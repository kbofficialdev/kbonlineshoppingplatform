import nodemailer from 'nodemailer';

// Create singleton Nodemailer SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || 'kb.official.admin@gmail.com',
    pass: process.env.SMTP_PASS || 'ptxilkfsukfcsndf',
  },
});

const DEFAULT_FROM = process.env.SMTP_FROM || '"KB FASHIONS" <kb.official.admin@gmail.com>';

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send generic branded email
 */
export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendMailResult> {
  try {
    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''),
    });

    console.log(`[SMTP DISPATCH SUCCESS] Delivered to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[SMTP DISPATCH FAILURE] Failed sending to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send 6-Digit Login / Verification OTP Email
 */
export async function sendOtpEmail(to: string, name: string, otp: string): Promise<SendMailResult> {
  const subject = `Your KB FASHIONS Login OTP: ${otp}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 24px; color: #111827; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #0b0f19; padding: 28px 32px; text-align: center; border-bottom: 2px solid #d6ac55; }
        .brand { font-size: 26px; font-weight: 900; letter-spacing: 1px; color: #ffffff; margin: 0; }
        .tagline { font-size: 11px; font-weight: 700; color: #d6ac55; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
        .body { padding: 32px; }
        .greeting { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .instruction { font-size: 14px; color: #4b5563; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #f0f4ff; border: 2px dashed #3478f6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1d4ed8; }
        .validity { font-size: 12px; color: #6b7280; margin-top: 8px; font-weight: 500; }
        .security-note { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #991b1b; margin-top: 24px; line-height: 1.5; }
        .footer { background: #f9fafb; padding: 20px 32px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="brand">KB FASHIONS</h1>
          <div class="tagline">Kalwaral Village Heritage Handlooms</div>
        </div>
        <div class="body">
          <div class="greeting">Namaste ${name || 'Valued Customer'},</div>
          <p class="instruction">You requested a secure One-Time Password (OTP) to access your KB FASHIONS account. Enter the code below to complete your verification:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="validity">⏱ Valid for 10 minutes only • One-time use</div>
          </div>
          <div class="security-note">
            <strong>Security Notice:</strong> KB FASHIONS staff will NEVER ask for your OTP. Do not share this code with anyone. If you did not request this OTP, please reset your password immediately.
          </div>
        </div>
        <div class="footer">
          KB Fashions • 3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145<br>
          Customer Support: +91 7989768200 | kb.official.admin@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to, subject, html });
}

/**
 * Send Password Reset Link Email
 */
export async function sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<SendMailResult> {
  const subject = `Reset Your KB FASHIONS Password`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 24px; color: #111827; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #0b0f19; padding: 28px 32px; text-align: center; border-bottom: 2px solid #d6ac55; }
        .brand { font-size: 26px; font-weight: 900; letter-spacing: 1px; color: #ffffff; margin: 0; }
        .tagline { font-size: 11px; font-weight: 700; color: #d6ac55; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
        .body { padding: 32px; }
        .greeting { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .instruction { font-size: 14px; color: #4b5563; line-height: 1.6; margin-bottom: 24px; }
        .btn-box { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; background: #3478f6; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(52,120,246,0.3); }
        .link-text { font-size: 11px; color: #9ca3af; word-break: break-all; margin-top: 16px; }
        .footer { background: #f9fafb; padding: 20px 32px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="brand">KB FASHIONS</h1>
          <div class="tagline">Kalwaral Village Heritage Handlooms</div>
        </div>
        <div class="body">
          <div class="greeting">Hello ${name || 'Customer'},</div>
          <p class="instruction">We received a request to reset the password for your KB FASHIONS account. Click the secure button below to set a new password:</p>
          <div class="btn-box">
            <a href="${resetLink}" class="btn">Reset My Password →</a>
          </div>
          <p class="instruction">This link is valid for <strong>15 minutes</strong>. If you did not request a password change, you can safely ignore this email.</p>
          <div class="link-text">If the button does not work, copy and paste this link into your browser:<br>${resetLink}</div>
        </div>
        <div class="footer">
          KB Fashions • 3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145<br>
          Customer Support: +91 7989768200 | kb.official.admin@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to, subject, html });
}

/**
 * Send Account Freeze / Temporary Lock Alert Email
 */
export async function sendAccountLockedEmail(to: string, name: string, lockDurationMinutes: number): Promise<SendMailResult> {
  const subject = `Security Alert: Your KB FASHIONS Account Has Been Temporarily Frozen`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 24px; color: #111827; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #991b1b; padding: 24px 32px; text-align: center; }
        .brand { font-size: 24px; font-weight: 900; color: #ffffff; margin: 0; }
        .sub { font-size: 11px; font-weight: 700; color: #fecaca; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
        .body { padding: 32px; }
        .alert-box { background: #fef2f2; border: 1px solid #f87171; border-radius: 12px; padding: 18px; margin-bottom: 20px; color: #991b1b; font-size: 13px; line-height: 1.5; }
        .footer { background: #f9fafb; padding: 20px 32px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="brand">SECURITY ALERT</h1>
          <div class="sub">KB Fashions Account Protection</div>
        </div>
        <div class="body">
          <p>Hello ${name || 'Customer'},</p>
          <div class="alert-box">
            <strong>Account Frozen:</strong> We detected 5 consecutive failed login attempts on your account. To protect your personal information and orders, your account has been temporarily frozen for <strong>${lockDurationMinutes} minutes</strong>.
          </div>
          <p style="font-size: 13px; color: #4b5563; line-height: 1.6;">
            No further sign-in attempts will be permitted until the freeze expires. Once the ${lockDurationMinutes} minutes have elapsed, you can attempt to sign in again or use the password reset service.
          </p>
          <p style="font-size: 13px; color: #4b5563; line-height: 1.6;">
            If this was not you, someone may be attempting unauthorized access to your account. We strongly recommend resetting your password immediately after the freeze period.
          </p>
        </div>
        <div class="footer">
          KB Fashions • 3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145<br>
          Grievance Desk: +91 7989768200 | kb.official.admin@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to, subject, html });
}
