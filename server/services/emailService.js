import nodemailer from 'nodemailer';

// Create a transporter using environment variables or a fallback
const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

/**
 * Send an OTP code to a user's email
 * @param {string} toEmail 
 * @param {string} otp 
 */
export const sendOTPEmail = async (toEmail, otp) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"VendorBridge Security" <${process.env.SMTP_FROM || 'noreply@vendorbridge.com'}>`,
    to: toEmail,
    subject: 'VendorBridge Security Verification Code',
    text: `Your VendorBridge OTP verification code is: ${otp}. It will expire in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">VendorBridge Verification</h2>
        <p style="font-size: 16px; color: #1e293b; line-height: 1.5;">Hello,</p>
        <p style="font-size: 16px; color: #1e293b; line-height: 1.5;">You requested a One-Time Password (OTP) verification code for your VendorBridge Procurement ERP account.</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: 800; color: #4f46e5; letter-spacing: 4px; padding: 12px 24px; background-color: #f5f3ff; border: 1px dashed #c084fc; border-radius: 6px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #64748b; line-height: 1.5; text-align: center;">This code will automatically expire in 5 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">If you did not request this verification code, please ignore this email or contact support.</p>
      </div>
    `
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email dispatched successfully! Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Nodemailer error sending email:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  } else {
    // Development local logger fallback
    console.log('\n==================================================');
    console.log('📬 [EMAIL SIMULATION SERVICE]');
    console.log(`To:      ${toEmail}`);
    console.log(`From:    ${mailOptions.from}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`OTP:     ${otp}`);
    console.log('==================================================\n');
    return { success: true, simulated: true };
  }
};

/**
 * Send a team invitation email containing an activation link
 * @param {string} toEmail 
 * @param {string} userName 
 * @param {string} inviteUrl 
 * @param {string} roleLabel 
 */
export const sendInviteEmail = async (toEmail, userName, inviteUrl, roleLabel) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"VendorBridge Security" <${process.env.SMTP_FROM || 'noreply@vendorbridge.com'}>`,
    to: toEmail,
    subject: 'VendorBridge Team Invitation',
    text: `Hello ${userName},\n\nYou have been invited to join the VendorBridge corporate procurement platform as a ${roleLabel}.\n\nAccept your invitation and activate your account by clicking the link below:\n${inviteUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #059669; text-align: center; margin-bottom: 24px;">Join VendorBridge Team</h2>
        <p style="font-size: 16px; color: #1e293b; line-height: 1.5;">Hello <strong>${userName}</strong>,</p>
        <p style="font-size: 16px; color: #1e293b; line-height: 1.5;">You have been registered as a team member on VendorBridge with the role: <strong>${roleLabel}</strong>.</p>
        <p style="font-size: 16px; color: #1e293b; line-height: 1.5;">To accept this invitation and log in to your dashboard automatically, please click the link below:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteUrl}" target="_blank" style="display: inline-block; font-size: 16px; font-weight: 700; color: #ffffff; background-color: #059669; padding: 14px 28px; text-decoration: none; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Accept Invitation & Access Account
          </a>
        </div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5; text-align: center;">If the button above does not work, copy and paste this URL into your browser:</p>
        <p style="font-size: 12px; color: #3b82f6; text-align: center; word-break: break-all; margin-top: 8px;">
          <a href="${inviteUrl}" style="color: #3b82f6;">${inviteUrl}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">This invitation link will expire in 24 hours. If you did not expect this invitation, please disregard this email.</p>
      </div>
    `
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Invitation email dispatched successfully! Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Nodemailer error sending invitation:', error.message);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }
  } else {
    // Development local logger fallback
    console.log('\n==================================================');
    console.log('📬 [EMAIL SIMULATION SERVICE - TEAM INVITATION]');
    console.log(`To:      ${toEmail}`);
    console.log(`From:    ${mailOptions.from}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Role:    ${roleLabel}`);
    console.log(`Link:    ${inviteUrl}`);
    console.log('==================================================\n');
    return { success: true, simulated: true };
  }
};
