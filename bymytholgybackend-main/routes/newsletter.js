const express = require("express");
const router = express.Router();
const Newsletter = require("../modals/Newsletter");
const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ==================== SUBSCRIBE TO NEWSLETTER ====================
router.post("/subscribe", async (req, res) => {
    try {
        const { email, name, source } = req.body;

        console.log("========================================");
        console.log("📧 NEWSLETTER SUBSCRIPTION REQUEST");
        console.log("========================================");
        console.log("📝 Request body:", JSON.stringify(req.body, null, 2));
        console.log("📧 Email received:", email);
        console.log("👤 Name received:", name);
        console.log("📍 Source received:", source);

        // Validate email presence
        if (!email) {
            console.log("❌ Error: Email is missing");
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Validate email format
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            console.log("❌ Error: Invalid email format -", email);
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address",
            });
        }
        console.log("✅ Email format validation passed");

        // Check if email already exists in database
        console.log("🔍 Checking if email exists in database:", email.toLowerCase());
        let existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

        if (existingSubscriber) {
            console.log("📌 Existing subscriber found:", {
                email: existingSubscriber.email,
                isSubscribed: existingSubscriber.isSubscribed,
                subscribedAt: existingSubscriber.subscribedAt,
                source: existingSubscriber.source
            });

            // If already subscribed and active
            if (existingSubscriber.isSubscribed) {
                console.log("❌ Error: Email already subscribed");
                return res.status(400).json({
                    success: false,
                    message: "This email is already subscribed to our newsletter",
                    alreadySubscribed: true,
                });
            }
            // If previously unsubscribed, reactivate
            else {
                console.log("🔄 Reactivating previously unsubscribed email");
                existingSubscriber.isSubscribed = true;
                existingSubscriber.unsubscribedAt = null;
                if (name) existingSubscriber.name = name;
                if (source) existingSubscriber.source = source;
                await existingSubscriber.save();
                console.log("✅ Subscriber reactivated successfully");

                // Send welcome back email
                try {
                    const welcomeBackMailOptions = {
                        from: `"Newsletter" <${process.env.EMAIL_USER}>`,
                        to: email,
                        subject: "Welcome Back to Our Newsletter!",
                        html: `
                            <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; border: 1px solid #c9a84c; border-radius: 12px; overflow: hidden;">
                                <div style="background: linear-gradient(135deg, #c9a84c 0%, #a07e2e 100%); padding: 30px 20px; text-align: center;">
                                    <h1 style="color: #0a0a0a; margin: 0; font-family: 'Cinzel', serif; font-size: 28px;">✨ Welcome Back! ✨</h1>
                                </div>
                                <div style="padding: 30px;">
                                    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name || "Valued Customer"},</p>
                                    <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">You have successfully resubscribed to our newsletter. You'll now receive exclusive updates, new product launches, and special offers.</p>
                                    <div style="border-top: 1px solid #c9a84c33; margin-top: 20px; padding-top: 15px; text-align: center;"></div>
                                </div>
                            </div>
                        `,
                    };
                    await transporter.sendMail(welcomeBackMailOptions);
                    console.log("✅ Welcome back email sent to:", email);
                } catch (emailError) {
                    console.error("❌ Failed to send welcome back email:", emailError.message);
                }

                return res.status(200).json({
                    success: true,
                    message: "Successfully resubscribed to newsletter! Welcome back!",
                    isResubscribe: true,
                });
            }
        }

        // Create new subscription
        console.log("🆕 Creating new subscriber");
        const subscription = await Newsletter.create({
            email: email.toLowerCase(),
            name: name || "",
            source: source || "website",
            isSubscribed: true,
            subscribedAt: new Date(),
        });
        console.log("✅ New subscriber created:", {
            newsletterId: subscription.newsletterId,
            email: subscription.email,
            source: subscription.source
        });

        // Send welcome email
        try {
            const welcomeMailOptions = {
                from: `"Newsletter" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Welcome to Our Newsletter!",
                html: `
                    <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; border: 1px solid #c9a84c; border-radius: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #c9a84c 0%, #a07e2e 100%); padding: 30px 20px; text-align: center;">
                            <h1 style="color: #0a0a0a; margin: 0; font-family: 'Cinzel', serif; font-size: 28px;">✨ Welcome Aboard ✨</h1>
                        </div>
                        <div style="padding: 30px;">
                            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name || "Valued Customer"},</p>
                            <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Thank you for subscribing to our newsletter! You'll now receive exclusive updates, new product launches, and special offers directly in your inbox.</p>
                            <div style="background: #141414; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; font-size: 13px; color: #c9a84c;">📧 What to expect:</p>
                                <p style="margin: 8px 0 0 0; font-size: 13px;">• New product announcements</p>
                                <p style="margin: 5px 0 0 0; font-size: 13px;">• Exclusive discounts & offers</p>
                                <p style="margin: 5px 0 0 0; font-size: 13px;">• Spiritual insights & stories</p>
                            </div>
                            <div style="border-top: 1px solid #c9a84c33; margin-top: 20px; padding-top: 15px; text-align: center;">
                                <p style="font-size: 11px; color: #666;">You can unsubscribe anytime by clicking the link in our emails.</p>
                            </div>
                        </div>
                    </div>
                `,
            };
            await transporter.sendMail(welcomeMailOptions);
            console.log("✅ Welcome email sent to:", email);
        } catch (emailError) {
            console.error("❌ Failed to send welcome email:", emailError.message);
        }

        console.log("✅ SUBSCRIPTION SUCCESSFUL");
        console.log("========================================\n");

        res.status(201).json({
            success: true,
            message: "Successfully subscribed to newsletter! Check your email for confirmation.",
            data: {
                newsletterId: subscription.newsletterId,
                email: subscription.email,
                subscribedAt: subscription.subscribedAt,
            },
        });

    } catch (error) {
        console.log("========================================");
        console.log("❌ ERROR IN NEWSLETTER SUBSCRIPTION");
        console.log("========================================");
        console.error("Error name:", error.name);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Full error:", error);

        // Log validation errors specifically
        if (error.name === "ValidationError") {
            console.log("📋 Validation Errors:");
            for (let field in error.errors) {
                console.log(`   - ${field}: ${error.errors[field].message}`);
            }
        }

        console.log("========================================\n");

        // Handle duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            console.log(`❌ Duplicate key error on field: ${duplicateField}`);
            return res.status(400).json({
                success: false,
                message: `This email is already subscribed to our newsletter`,
                alreadySubscribed: true,
            });
        }

        // Handle validation errors
        if (error.name === "ValidationError") {
            const firstError = Object.values(error.errors)[0];
            return res.status(400).json({
                success: false,
                message: firstError?.message || "Validation error. Please check your input.",
                validationErrors: error.errors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to subscribe. Please try again later.",
            error: error.message,
        });
    }
});

// ==================== UNSUBSCRIBE FROM NEWSLETTER ====================
router.post("/unsubscribe", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Email not found in our records",
            });
        }

        if (!subscription.isSubscribed) {
            return res.status(400).json({
                success: false,
                message: "This email is already unsubscribed",
            });
        }

        subscription.isSubscribed = false;
        subscription.unsubscribedAt = new Date();
        await subscription.save();

        // Send goodbye email
        const goodbyeMailOptions = {
            from: `"Newsletter" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "You have been unsubscribed",
            html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; border: 1px solid #c9a84c; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #c9a84c;">You're Unsubscribed</h2>
          <p>We're sad to see you go! You have been successfully unsubscribed from our newsletter.</p>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">If this was a mistake, you can resubscribe anytime on our website.</p>
        </div>
      `,
        };
        await transporter.sendMail(goodbyeMailOptions);
        console.log(`✅ Goodbye email sent to ${email}`);

        res.status(200).json({
            success: true,
            message: "Successfully unsubscribed from newsletter",
        });

    } catch (error) {
        console.error("❌ Error unsubscribing:", error);
        res.status(500).json({
            success: false,
            message: "Failed to unsubscribe",
            error: error.message,
        });
    }
});

// ==================== CHECK SUBSCRIPTION STATUS ====================
router.post("/check-status", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

        if (!subscription) {
            return res.status(200).json({
                success: true,
                isSubscribed: false,
                message: "Email not found in newsletter",
            });
        }

        res.status(200).json({
            success: true,
            isSubscribed: subscription.isSubscribed,
            subscribedAt: subscription.subscribedAt,
            message: subscription.isSubscribed ? "Email is subscribed" : "Email is unsubscribed",
        });

    } catch (error) {
        console.error("❌ Error checking status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check subscription status",
            error: error.message,
        });
    }
});

// ==================== GET ALL SUBSCRIBERS (ADMIN ONLY) ====================
router.get("/subscribers", async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isSubscribed: true })
            .sort({ subscribedAt: -1 })
            .select("-__v");

        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers,
        });
    } catch (error) {
        console.error("❌ Error fetching subscribers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subscribers",
            error: error.message,
        });
    }
});

// ==================== GET ALL UNSUBSCRIBED (ADMIN ONLY) ====================
router.get("/unsubscribed", async (req, res) => {
    try {
        const unsubscribed = await Newsletter.find({ isSubscribed: false })
            .sort({ unsubscribedAt: -1 })
            .select("-__v");

        res.status(200).json({
            success: true,
            count: unsubscribed.length,
            unsubscribed,
        });
    } catch (error) {
        console.error("❌ Error fetching unsubscribed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch unsubscribed users",
            error: error.message,
        });
    }
});

// ==================== SEND BULK NEWSLETTER (ADMIN ONLY) ====================
router.post("/send-bulk", async (req, res) => {
    try {
        const { subject, content } = req.body;

        if (!subject || !content) {
            return res.status(400).json({
                success: false,
                message: "Subject and content are required",
            });
        }

        const subscribers = await Newsletter.find({ isSubscribed: true });

        if (subscribers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No active subscribers found",
            });
        }

        let sentCount = 0;
        let failedCount = 0;
        const failedEmails = [];

        for (const subscriber of subscribers) {
            try {
                const mailOptions = {
                    from: `"Newsletter" <${process.env.EMAIL_USER}>`,
                    to: subscriber.email,
                    subject: subject,
                    html: `
            <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; border: 1px solid #c9a84c; border-radius: 12px; padding: 30px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #c9a84c; font-family: 'Cinzel', serif;">${subject}</h2>
                <div style="width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin: 15px auto;"></div>
              </div>
              <div style="line-height: 1.6;">${content}</div>
              <div style="border-top: 1px solid #c9a84c33; margin-top: 30px; padding-top: 20px; text-align: center;">
                <p style="font-size: 11px; color: #666;">
                  <a href="${process.env.FRONTEND_URL || 'https://yourwebsite.com'}/unsubscribe?email=${subscriber.email}" style="color: #c9a84c;">Unsubscribe</a>
                </p>
              </div>
            </div>
          `,
                };
                await transporter.sendMail(mailOptions);
                sentCount++;
            } catch (error) {
                console.error(`Failed to send to ${subscriber.email}:`, error);
                failedCount++;
                failedEmails.push(subscriber.email);
            }
        }

        res.status(200).json({
            success: true,
            message: `Newsletter sent: ${sentCount} successful, ${failedCount} failed`,
            sentCount,
            failedCount,
            failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
        });

    } catch (error) {
        console.error("❌ Error sending bulk newsletter:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send newsletter",
            error: error.message,
        });
    }
});

// ==================== DELETE SUBSCRIBER (ADMIN ONLY) ====================
router.delete("/delete/:newsletterId", async (req, res) => {
    try {
        const subscriber = await Newsletter.findOne({ newsletterId: req.params.newsletterId });

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Subscriber not found",
            });
        }

        await subscriber.deleteOne();

        res.status(200).json({
            success: true,
            message: "Subscriber deleted successfully",
        });
    } catch (error) {
        console.error("❌ Error deleting subscriber:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete subscriber",
            error: error.message,
        });
    }
});

module.exports = router;