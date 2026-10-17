import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { sendMail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const { to, subject, message } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid recipient email address' }, { status: 400 });
    }

    const testSubject = subject || `[Diagnostics] KB Fashions SMTP Live Test - ${new Date().toLocaleTimeString('en-IN')}`;
    const testHtml = `
      <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #0a0a0a; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">KB FASHIONS</h2>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 12px;">Kalwaral, Telangana - 503145</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <span style="display: inline-block; background: #22c55e; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 12px; margin-bottom: 8px;">SMTP HANDSHAKE VERIFIED</span>
          <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 600;">Live Dispatch Diagnostic Test</p>
          <p style="margin: 6px 0 0; color: #475569; font-size: 12px; line-height: 1.5;">
            ${message || 'This confirms that the KB Fashions transactional email system is securely connected to Google SMTP servers and able to deliver messages to your mailbox.'}
          </p>
        </div>
        <table style="width: 100%; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          <tr><td><strong>Recipient:</strong></td><td>${to}</td></tr>
          <tr><td><strong>Timestamp:</strong></td><td>${new Date().toISOString()}</td></tr>
          <tr><td><strong>Host:</strong></td><td>smtp.gmail.com:587 (TLS)</td></tr>
          <tr><td><strong>Security:</strong></td><td>App-Specific Authenticated Token</td></tr>
        </table>
      </div>
    `;

    const result = await sendMail({
      to: to.trim(),
      subject: testSubject,
      html: testHtml,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        recipient: to.trim(),
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        recipient: to.trim(),
      }, { status: 502 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
