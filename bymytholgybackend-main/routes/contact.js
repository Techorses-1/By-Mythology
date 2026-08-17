const express = require("express");
const router = express.Router();
const Contact = require("../modals/Contact");
const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ==================== SUBMIT CONTACT FORM ====================
router.post("/submit", async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate phone number format
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number",
            });
        }

        // ========== CHECK FOR DUPLICATE SUBMISSION IN LAST 24 HOURS ==========
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Check by email OR phone number within last 24 hours
        const recentSubmission = await Contact.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone: phone }
            ],
            createdAt: { $gte: twentyFourHoursAgo },
            isActive: true
        });

        if (recentSubmission) {
            // Calculate remaining time
            const nextAllowedTime = new Date(recentSubmission.createdAt);
            nextAllowedTime.setHours(nextAllowedTime.getHours() + 24);

            const remainingMs = nextAllowedTime - new Date();
            const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
            const remainingMinutes = Math.floor((remainingMs % (3600000)) / 60000);

            let timeMessage = "";
            if (remainingHours > 0) {
                timeMessage = `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
                if (remainingMinutes > 0) {
                    timeMessage += ` and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
                }
            } else {
                timeMessage = `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
            }

            return res.status(429).json({
                success: false,
                message: `You have already submitted a message recently. Please try again after ${timeMessage}.`,
                retryAfter: Math.ceil(remainingMs / 1000),
                lastSubmittedAt: recentSubmission.createdAt,
                nextAllowedAt: nextAllowedTime
            });
        }

        // Save to database
        const contact = await Contact.create({
            name,
            email: email.toLowerCase(),
            phone,
            subject,
            message,
        });

        // ========== 1. SEND AUTO-REPLY TO USER ==========
        const userMailOptions = {
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Thank you for contacting us",
            html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; border: 1px solid #c9a84c; border-radius: 12px; overflow: hidden;">
          
          <!-- Header with Gold Accent -->
          <div style="background: linear-gradient(135deg, #c9a84c 0%, #a07e2e 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #0a0a0a; margin: 0; font-family: 'Cinzel', serif; font-size: 28px; letter-spacing: 2px;">✨ Thank You ✨</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Dear <strong style="color: #c9a84c;">${name}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #e0d6c8;">
              Thank you for reaching out to us. We have received your message and our team will respond within <strong style="color: #c9a84c;">24 hours</strong>.
            </p>
            
            <div style="background: #141414; border-left: 3px solid #c9a84c; padding: 15px 20px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #c9a84c;">📋 Your Message Summary:</p>
              <p style="margin: 0; font-size: 14px; color: #b0a890;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #b0a890;"><strong>Message:</strong> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #b0a890; margin-bottom: 20px;">
              For urgent assistance, please call us at <strong style="color: #c9a84c;">+91 98765 43210</strong>.
            </p>
            
            <div style="border-top: 1px solid #c9a84c33; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="font-size: 12px; color: #888; margin: 0;">
                © 2024 Your Brand. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(userMailOptions);
        console.log(`✅ Auto-reply email sent to ${email}`);

        // ========== 2. SEND NOTIFICATION TO ADMIN ==========
        const adminMailOptions = {
            from: `"Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "🔔 New Contact Form Submission",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; border: 1px solid #c9a84c; border-radius: 12px; overflow: hidden;">
          
          <div style="background: #c9a84c; padding: 20px; text-align: center;">
            <h2 style="color: #0a0a0a; margin: 0;">📬 New Contact Form Submission</h2>
          </div>
          
          <div style="padding: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;"><strong>👤 Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;"><strong>📧 Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;"><strong>📞 Phone:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;"><strong>📋 Subject:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #c9a84c33;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; vertical-align: top;"><strong>💬 Message:</strong></td>
                <td style="padding: 10px 0;">${message}</td>
              </tr>
            </table>
            
            <div style="background: #141414; padding: 15px; margin-top: 20px; border-radius: 8px;">
              <p style="margin: 0; font-size: 12px; color: #888;">Contact ID: ${contact.contactId}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">Submitted at: ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
              Reply to this email to respond to the customer.
            </p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(adminMailOptions);
        console.log(`✅ Admin notification email sent`);

        res.status(201).json({
            success: true,
            message: "Message sent successfully! We'll get back to you soon.",
            contact: {
                contactId: contact.contactId,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                status: contact.status,
            },
        });

    } catch (error) {
        console.error("❌ Error submitting contact form:", error);

        // Handle duplicate email/phone (though not unique in contact)
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error: " + error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later.",
            error: error.message,
        });
    }
});

// ==================== GET ALL CONTACTS (ADMIN) ====================
router.get("/all", async (req, res) => {
    try {
        const contacts = await Contact.find({ isActive: true })
            .sort({ createdAt: -1 })
            .select("-__v");

        res.status(200).json({
            success: true,
            count: contacts.length,
            contacts,
        });
    } catch (error) {
        console.error("❌ Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
            error: error.message,
        });
    }
});

// ==================== GET SINGLE CONTACT ====================
router.get("/:contactId", async (req, res) => {
    try {
        const contact = await Contact.findOne({
            contactId: req.params.contactId,
            isActive: true
        }).select("-__v");

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            contact,
        });
    } catch (error) {
        console.error("❌ Error fetching contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contact",
            error: error.message,
        });
    }
});

// ==================== UPDATE CONTACT STATUS ====================
router.put("/update-status/:contactId", async (req, res) => {
    try {
        const { status, adminNote } = req.body;

        const contact = await Contact.findOne({ contactId: req.params.contactId });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        if (status) contact.status = status;
        if (adminNote !== undefined) contact.adminNote = adminNote;

        await contact.save();

        res.status(200).json({
            success: true,
            message: "Contact status updated successfully",
            contact,
        });
    } catch (error) {
        console.error("❌ Error updating contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update contact",
            error: error.message,
        });
    }
});

// ==================== DELETE CONTACT (SOFT DELETE) ====================
router.delete("/delete/:contactId", async (req, res) => {
    try {
        const contact = await Contact.findOne({ contactId: req.params.contactId });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        contact.isActive = false;
        await contact.save();

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (error) {
        console.error("❌ Error deleting contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete contact",
            error: error.message,
        });
    }
});

module.exports = router;