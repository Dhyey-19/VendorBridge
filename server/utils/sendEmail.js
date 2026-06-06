import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    // For production, configure with actual SMTP settings via environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email', // replace with actual
        pass: process.env.SMTP_PASS || 'ethereal_password', // replace with actual
      },
    });

    const mailOptions = {
      from: '"VendorBridge ERP" <no-reply@vendorbridge.com>',
      to,
      subject,
      html,
    };

    if (attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
