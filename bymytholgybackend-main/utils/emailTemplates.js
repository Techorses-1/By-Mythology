// utils/emailTemplates.js

// Base email wrapper with your brand styling
const baseEmailWrapper = (content, title) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Raleway', Arial, sans-serif;
            background-color: #0a0a0a;
            margin: 0;
            padding: 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #0a0a0a;
            border: 1px solid rgba(201, 168, 76, 0.3);
            border-radius: 16px;
            overflow: hidden;
        }
        
        .email-header {
            background: linear-gradient(135deg, #0a0a0a 0%, #111009 100%);
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid rgba(201, 168, 76, 0.2);
        }
        
        .email-logo {
            font-family: 'Cinzel', serif;
            font-size: 24px;
            font-weight: 700;
            color: #e8c97a;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        
        .email-logo-sub {
            font-size: 10px;
            color: rgba(245, 240, 232, 0.5);
            letter-spacing: 0.2em;
        }
        
        .email-title {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            color: #c9a84c;
            margin-top: 16px;
            letter-spacing: 0.05em;
        }
        
        .email-body {
            padding: 30px 24px;
            color: #f5f0e8;
        }
        
        .order-details {
            background: #111009;
            border: 1px solid rgba(201, 168, 76, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(201, 168, 76, 0.1);
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .item-name {
            font-weight: 500;
            color: #e8c97a;
        }
        
        .item-price {
            color: #c9a84c;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            margin-top: 12px;
            border-top: 2px solid rgba(201, 168, 76, 0.2);
            font-weight: 600;
        }
        
        .status-badge {
            display: inline-block;
            background: rgba(201, 168, 76, 0.15);
            border: 1px solid #c9a84c;
            border-radius: 30px;
            padding: 6px 16px;
            font-size: 12px;
            color: #c9a84c;
            margin-top: 8px;
        }
        
        .address-box {
            background: #0f0f0f;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            border-left: 3px solid #c9a84c;
        }
        
        .btn-review {
            display: inline-block;
            background: #c9a84c;
            color: #0a0a0a;
            text-decoration: none;
            padding: 10px 24px;
            border-radius: 30px;
            font-family: 'Cinzel', serif;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            margin-top: 16px;
            transition: all 0.3s;
        }
        
        .btn-review:hover {
            background: #e8c97a;
        }
        
        .email-footer {
            background: #0f0f0f;
            padding: 20px;
            text-align: center;
            border-top: 1px solid rgba(201, 168, 76, 0.1);
            font-size: 11px;
            color: rgba(245, 240, 232, 0.4);
        }
        
        .gold-text {
            color: #c9a84c;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #c9a84c, transparent);
            margin: 20px 0;
        }
        
        .tracking-link {
            color: #c9a84c;
            text-decoration: none;
        }
        
        @media (max-width: 480px) {
            .email-body {
                padding: 20px 16px;
            }
            .order-item {
                flex-direction: column;
                gap: 4px;
            }
        }
    </style>
</head>
<body style="background-color: #0a0a0a; padding: 20px;">
    <div class="email-container">
        <div class="email-header">
            <div class="email-logo">BYMYTHOLOGY</div>
            <div class="email-logo-sub">ILLUMINATING ANCIENT STORIES</div>
            <div class="email-title">${title}</div>
        </div>
        ${content}
        <div class="email-footer">
            <p>© ${new Date().getFullYear()} Bymythology. All rights reserved.</p>
            <p>Illuminating ancient stories • Inspiring modern souls</p>
            <p style="margin-top: 12px; font-size: 10px;">
                This is a system-generated email. Please do not reply.
            </p>
        </div>
    </div>
</body>
</html>
`;

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Get status message
const getStatusMessage = (status) => {
    const messages = {
        pending: "Your order has been received and is awaiting confirmation.",
        processing: "Your order is being processed and prepared for shipment.",
        shipped: "Great news! Your order has been shipped and is on its way to you.",
        delivered: "Your order has been delivered. We hope you love your purchase!",
        cancelled: "Your order has been cancelled as requested."
    };
    return messages[status] || "Your order status has been updated.";
};

// 1. ORDER CONFIRMATION EMAIL (to user)
const getOrderConfirmationEmail = (order, userEmail, userName) => {
    const itemsHtml = order.items.map(item => `
        <div class="order-item">
            <span class="item-name">${item.productName} ${item.fragrance ? `(${item.fragrance})` : ''} x ${item.quantity}</span>
            <span class="item-price">₹${formatCurrency(item.offerPrice * item.quantity)}</span>
        </div>
    `).join('');

    const content = `
        <div class="email-body">
            <p style="font-size: 16px; margin-bottom: 16px;">Dear <strong style="color: #e8c97a;">${userName || "Valued Customer"}</strong>,</p>
            
            <p>Thank you for your order! We're delighted to have you on this sacred journey with us.</p>
            
            <div class="order-details">
                <p><strong>📦 Order ID:</strong> <span class="gold-text">${order.orderId}</span></p>
                <p><strong>📅 Order Date:</strong> ${formatDate(order.createdAt)}</p>
                <p><strong>💳 Payment Method:</strong> ${order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p><strong>📊 Order Status:</strong> <span class="status-badge">${order.orderStatus.toUpperCase()}</span></p>
            </div>
            
            <h3 style="color: #e8c97a; margin-bottom: 12px;">Order Items</h3>
            <div class="order-details">
                ${itemsHtml}
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>₹${formatCurrency(order.pricing.subtotal)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping</span>
                    <span>${order.pricing.shipping === 0 ? 'FREE' : `₹${formatCurrency(order.pricing.shipping)}`}</span>
                </div>
                <div class="total-row">
                    <span>Tax (18% GST)</span>
                    <span>₹${formatCurrency(order.pricing.tax)}</span>
                </div>
                <div class="total-row">
                    <span><strong>TOTAL</strong></span>
                    <span><strong style="color: #c9a84c;">₹${formatCurrency(order.pricing.total)}</strong></span>
                </div>
            </div>
            
            <div class="address-box">
                <p><strong>📍 Shipping Address</strong></p>
                <p>${order.deliveryAddress.fullName}</p>
                <p>${order.deliveryAddress.addressLine1}${order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''}</p>
                <p>${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}</p>
                <p>📞 ${order.deliveryAddress.mobile}</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="text-align: center;">You will receive another email when your order is shipped.</p>
            <p style="text-align: center; font-size: 12px; color: rgba(245,240,232,0.5); margin-top: 16px;">
                For any queries, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #c9a84c;">${process.env.EMAIL_USER}</a>
            </p>
        </div>
    `;
    
    return baseEmailWrapper(content, "Order Confirmation");
};

// 2. ADMIN NEW ORDER NOTIFICATION
const getAdminNewOrderEmail = (order, userEmail, userName) => {
    const itemsHtml = order.items.map(item => `
        <div class="order-item">
            <span class="item-name">${item.productName} ${item.fragrance ? `(${item.fragrance})` : ''} x ${item.quantity}</span>
            <span class="item-price">₹${formatCurrency(item.offerPrice * item.quantity)}</span>
        </div>
    `).join('');

    const content = `
        <div class="email-body">
            <p style="font-size: 16px; margin-bottom: 16px;"><strong>🛍️ New Order Received!</strong></p>
            
            <div class="order-details">
                <p><strong>👤 Customer:</strong> ${userName || userEmail}</p>
                <p><strong>📧 Email:</strong> ${userEmail}</p>
                <p><strong>📦 Order ID:</strong> ${order.orderId}</p>
                <p><strong>📅 Order Date:</strong> ${formatDate(order.createdAt)}</p>
                <p><strong>💳 Payment:</strong> ${order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            </div>
            
            <h3 style="color: #e8c97a;">Order Items</h3>
            <div class="order-details">
                ${itemsHtml}
                <div class="total-row">
                    <span><strong>TOTAL</strong></span>
                    <span><strong style="color: #c9a84c;">₹${formatCurrency(order.pricing.total)}</strong></span>
                </div>
            </div>
            
            <div class="address-box">
                <p><strong>📍 Shipping Address</strong></p>
                <p>${order.deliveryAddress.fullName}</p>
                <p>${order.deliveryAddress.addressLine1}</p>
                <p>${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}</p>
                <p>📞 ${order.deliveryAddress.mobile}</p>
            </div>
            
            <p style="margin-top: 20px; text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'https://bymythology.com'}/admin/orders" style="color: #c9a84c;">👉 View in Admin Panel</a>
            </p>
        </div>
    `;
    
    return baseEmailWrapper(content, "New Order Alert");
};

// 3. ORDER STATUS UPDATE EMAIL (to user)
const getOrderStatusUpdateEmail = (order, userEmail, userName, oldStatus, newStatus) => {
    const content = `
        <div class="email-body">
            <p style="font-size: 16px; margin-bottom: 16px;">Dear <strong style="color: #e8c97a;">${userName || "Valued Customer"}</strong>,</p>
            
            <p>Your order status has been updated.</p>
            
            <div class="order-details">
                <p><strong>📦 Order ID:</strong> <span class="gold-text">${order.orderId}</span></p>
                <p><strong>📅 Order Date:</strong> ${formatDate(order.createdAt)}</p>
                <p><strong>Previous Status:</strong> <span style="color: rgba(245,240,232,0.5);">${oldStatus}</span></p>
                <p><strong>New Status:</strong> <span class="status-badge">${newStatus.toUpperCase()}</span></p>
            </div>
            
            <div class="address-box" style="background: rgba(201, 168, 76, 0.05);">
                <p>${getStatusMessage(newStatus)}</p>
            </div>
            
            <div class="divider"></div>
            
            ${newStatus === 'delivered' ? `
                <div style="text-align: center;">
                    <p style="margin-bottom: 16px;">✨ We'd love to hear your experience! ✨</p>
                    <a href="${process.env.FRONTEND_URL || 'https://bymythology.com'}/orders" class="btn-review">
                        ⭐ WRITE A REVIEW ⭐
                    </a>
                </div>
                <div class="divider"></div>
            ` : ''}
            
            <p style="text-align: center;">Track your order status anytime from your account dashboard.</p>
        </div>
    `;
    
    return baseEmailWrapper(content, `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
};

// 4. ORDER CANCELLED EMAIL (to user)
const getOrderCancelledUserEmail = (order, userEmail, userName) => {
    const content = `
        <div class="email-body">
            <p style="font-size: 16px; margin-bottom: 16px;">Dear <strong style="color: #e8c97a;">${userName || "Valued Customer"}</strong>,</p>
            
            <p>Your order has been cancelled as requested.</p>
            
            <div class="order-details">
                <p><strong>📦 Order ID:</strong> <span class="gold-text">${order.orderId}</span></p>
                <p><strong>📅 Order Date:</strong> ${formatDate(order.createdAt)}</p>
                <p><strong>💰 Total Amount:</strong> ₹${formatCurrency(order.pricing.total)}</p>
            </div>
            
            <div class="address-box" style="background: rgba(201, 168, 76, 0.05);">
                <p>If you paid online, the refund will be processed within 5-7 business days to your original payment method.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="text-align: center;">We hope to serve you again soon!</p>
        </div>
    `;
    
    return baseEmailWrapper(content, "Order Cancelled");
};

// 5. ADMIN ORDER CANCELLED NOTIFICATION
const getAdminOrderCancelledEmail = (order, userEmail, userName) => {
    const content = `
        <div class="email-body">
            <p style="font-size: 16px; margin-bottom: 16px;"><strong>⚠️ Order Cancelled by Customer</strong></p>
            
            <div class="order-details">
                <p><strong>👤 Customer:</strong> ${userName || userEmail}</p>
                <p><strong>📧 Email:</strong> ${userEmail}</p>
                <p><strong>📦 Order ID:</strong> ${order.orderId}</p>
                <p><strong>📅 Order Date:</strong> ${formatDate(order.createdAt)}</p>
                <p><strong>💰 Order Total:</strong> ₹${formatCurrency(order.pricing.total)}</p>
            </div>
            
            <p style="margin-top: 20px; text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'https://bymythology.com'}/admin/orders" style="color: #c9a84c;">👉 View in Admin Panel</a>
            </p>
        </div>
    `;
    
    return baseEmailWrapper(content, "Order Cancelled - Customer");
};

module.exports = {
    getOrderConfirmationEmail,
    getAdminNewOrderEmail,
    getOrderStatusUpdateEmail,
    getOrderCancelledUserEmail,
    getAdminOrderCancelledEmail,
    formatCurrency,
    formatDate
};