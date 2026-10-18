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

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kbfashions.in';

/**
 * Send 5-Minute Secure Email Verification Link
 */
export async function sendEmailVerificationLink(to: string, name: string, tokenOrUrl: string, baseUrl: string = APP_BASE_URL): Promise<SendMailResult> {
  const verifyUrl = tokenOrUrl.startsWith('http') ? tokenOrUrl : `${baseUrl}/api/auth/verify-email?token=${tokenOrUrl}`;
  const subject = `Verify Your KB FASHIONS Account (Link Expires in 5 Minutes)`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #000000; padding: 28px; text-align: center; }
        .brand { font-size: 26px; font-weight: 900; color: #ffffff; margin: 0; }
        .sub { font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }
        .body { padding: 32px; }
        .btn { display: inline-block; background: #3478F6; color: #ffffff !important; padding: 14px 28px; border-radius: 9999px; font-weight: 700; font-size: 14px; text-decoration: none; margin: 20px 0; }
        .expiry { background: #fef3c7; border: 1px solid #fde68a; padding: 12px; border-radius: 8px; font-size: 12px; color: #92400e; font-weight: 600; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="brand">KB FASHIONS</h1>
          <div class="sub">Kalwaral Village • Estd. 2006</div>
        </div>
        <div class="body">
          <p>Hello <strong>${name || 'Valued Customer'}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Thank you for creating an account with KB Fashions. To activate your account, please click the secure link below:
          </p>
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="btn">Verify Account Now →</a>
          </div>
          <div class="expiry">
            ⏱️ <strong>Strict Expiry Notice:</strong> This activation link is strictly valid for <strong>5 minutes only</strong> from dispatch.
          </div>
          <p style="font-size: 11px; color: #94a3b8; word-break: break-all; margin-top: 16px;">
            Or copy paste this link in your browser: ${verifyUrl}
          </p>
        </div>
        <div class="footer">
          3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145<br>
          Support: +91 7989768200 | kb.official.admin@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to, subject, html });
}

/**
 * Send Checkout Order Confirmation OTP
 */
export async function sendOrderConfirmationOtp(to: string, name: string, otp: string, orderTotal: number): Promise<SendMailResult> {
  const subject = `Your Order Confirmation OTP: ${otp} (₹${orderTotal})`;
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, sans-serif; background: #f8fafc; padding: 24px;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; font-weight: 900;">KB FASHIONS</h2>
        <div style="font-size: 11px; color: #64748b; font-weight: bold; margin-bottom: 24px;">ORDER AUTHORIZATION CODE</div>
        <p style="font-size: 13px; color: #334155;">Hello ${name}, please enter the OTP below to confirm your order of <strong>₹${orderTotal}</strong>:</p>
        <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #000000; margin: 20px 0; background: #f1f5f9; padding: 16px; border-radius: 12px; font-family: monospace;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #d97706; font-weight: bold;">Valid for 5 minutes only. Do not share this OTP with anyone.</p>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to, subject, html });
}

/**
 * Send Policy Change Email Broadcast to Customers
 */
export async function sendPolicyUpdateNotificationEmail(to: string, name: string, policyTitle: string, summary: string): Promise<SendMailResult> {
  const subject = `Statutory Notice: Update to KB FASHIONS ${policyTitle}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, sans-serif; background: #f8fafc; padding: 24px;">
      <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 900; color: #0f172a;">KB FASHIONS • POLICY UPDATE NOTICE</h2>
        <p style="font-size: 13px; color: #475569; margin-top: 12px;">Hello ${name || 'Customer'},</p>
        <p style="font-size: 13px; color: #475569; line-height: 1.6;">
          In accordance with consumer protection regulations and e-commerce statutory requirements, please be advised that our <strong>${policyTitle}</strong> has been updated.
        </p>
        <div style="background: #f1f5f9; border-left: 4px solid #3478F6; padding: 14px; border-radius: 4px; font-size: 12px; color: #1e293b; margin: 16px 0;">
          <strong>Summary of Changes:</strong><br>${summary}
        </div>
        <p style="font-size: 12px; color: #64748b;">
          You can review the complete updated policy on our website anytime under the statutory compliance section.
        </p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #94a3b8;">
          KB Fashions • Kalwaral Village, Kamareddy, Telangana 503145 • Contact: +91 7989768200
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to, subject, html });
}

/**
 * Send Delivery Status Stage Email to Customer
 */
export async function sendOrderStatusUpdateEmail(
  to: string,
  name: string,
  orderId: string,
  newStatus: string,
  trackingNotes?: string,
  location?: string
): Promise<SendMailResult> {
  const subject = `Consignment Update: Order #${orderId} is now ${newStatus.replace(/_/g, ' ')}`;
  const statusLabels: Record<string, string> = {
    CONFIRMED: 'Confirmed & Packed at Kalwaral Store',
    DISPATCHED: 'Dispatched for Delivery',
    OUT_FOR_DELIVERY: 'Out for Doorstep Delivery in 10 km Radius',
    DELIVERED: 'Successfully Delivered to Doorstep',
  };
  const label = statusLabels[newStatus] || newStatus;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, sans-serif; background: #f8fafc; padding: 24px;">
      <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px;">
        <div style="background: #000000; color: #ffffff; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 18px;">KB FASHIONS</strong>
          <span style="font-size: 11px; color: #94a3b8;">DISPATCH TIMELINE</span>
        </div>
        <h3 style="margin: 0; font-size: 18px; color: #0f172a;">Delivery Progress Update</h3>
        <p style="font-size: 13px; color: #475569;">Hello ${name}, your order <strong>#${orderId}</strong> has progressed to a new stage:</p>
        
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <div style="font-size: 11px; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">Current Stage:</div>
          <div style="font-size: 16px; font-weight: 900; color: #1e3a8a; margin-top: 4px;">${label}</div>
          ${location ? `<div style="font-size: 12px; color: #3b82f6; margin-top: 4px;">📍 Location: ${location}</div>` : ''}
          ${trackingNotes ? `<div style="font-size: 12px; color: #64748b; margin-top: 6px;">Notes: ${trackingNotes}</div>` : ''}
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${APP_BASE_URL}/orders/${orderId}" style="display: inline-block; background: #000000; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-size: 13px; font-weight: bold;">
            Track Live Timeline →
          </a>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center;">
          KB Fashions • Kalwaral (Vil), Sadasivanagar, Kamareddy, Telangana 503145 • +91 7989768200
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to, subject, html });
}


