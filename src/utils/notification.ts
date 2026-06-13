import nodemailer from 'nodemailer';
import twilio from 'twilio';

export const sendResetPasswordEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const fromAddress =
    process.env.SMTP_FROM || `no-reply@${smtpHost || 'localhost'}`;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('SMTP configuration is missing');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: 'Reset your password',
    text: `You requested a password reset. Use the following token to reset your password: ${token}\n\nOr click this link: ${resetLink}\n\nThis token expires in 1 hour.`,
    html: `<p>You requested a password reset.</p>
<p>Use this token to reset your password:</p>
<p><strong>${token}</strong></p>
<p>Or click this link: <a href="${resetLink}">Reset password</a></p>
<p>This token expires in 1 hour.</p>`,
  });
};

export const sendResetPasswordSMS = async (
  phone: string,
  token: string
): Promise<void> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio configuration is missing');
  }

  const client = twilio(accountSid, authToken);
  await client.messages.create({
    body: `Your password reset token is ${token}. It expires in 1 hour.`,
    from: fromNumber,
    to: phone,
  });
};
