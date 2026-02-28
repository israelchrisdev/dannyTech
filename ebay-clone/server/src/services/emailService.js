const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to eBay Clone!';
  const html = `
    <h1>Welcome ${name}!</h1>
    <p>Thank you for joining eBay Clone. Start exploring millions of items or begin selling your own.</p>
    <a href="${process.env.CLIENT_URL}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Start Shopping
    </a>
  `;
  await sendEmail({ to: email, subject, html });
};

const sendOrderConfirmation = async (email, order) => {
  const subject = `Order Confirmation #${order.id}`;
  const itemsList = order.items.map(item => `
    <tr>
      <td>${item.product.title}</td>
      <td>${item.quantity}</td>
      <td>$${item.price}</td>
    </tr>
  `).join('');

  const html = `
    <h1>Thank you for your order!</h1>
    <p>Your order #${order.id} has been confirmed.</p>
    <h2>Order Details:</h2>
    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><strong>Total</strong></td>
          <td><strong>$${order.total}</strong></td>
        </tr>
      </tfoot>
    </table>
    <p>We'll notify you when your items ship.</p>
  `;
  await sendEmail({ to: email, subject, html });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
    <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  await sendEmail({ to: email, subject, html });
};

const sendOutbidNotification = async (email, product, newBid) => {
  const subject = `You've been outbid on ${product.title}`;
  const html = `
    <h1>You've been outbid!</h1>
    <p>Someone placed a higher bid of $${newBid.amount} on ${product.title}.</p>
    <a href="${process.env.CLIENT_URL}/product/${product.id}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      View Item
    </a>
  `;
  await sendEmail({ to: email, subject, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail,
  sendOutbidNotification
};