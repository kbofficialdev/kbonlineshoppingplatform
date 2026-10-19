import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { storeSettingsUpdateSchema } from '@/lib/validations';

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: db.storeSettings,
    storeSettings: db.storeSettings,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = storeSettingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    db.storeSettings = {
      ...db.storeSettings,
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    };
    db.saveToDisk();

    let emailsDispatched = 0;
    if (parsed.data.notifyCustomersOnPolicyChange && parsed.data.policyUpdateTitle) {
      const { sendPolicyUpdateNotificationEmail } = await import('@/lib/email');
      db.loadFromDisk();
      const customers = db.users.filter(u => u.role === 'CUSTOMER' && u.email);
      for (const cust of customers) {
        try {
          await sendPolicyUpdateNotificationEmail(
            cust.email,
            cust.name,
            parsed.data.policyUpdateTitle,
            parsed.data.policyUpdateSummary || 'Mandatory statutory and consumer rights policy terms update.'
          );
          emailsDispatched++;
        } catch (e) {
          console.error(`Failed to dispatch policy notice to ${cust.email}:`, e);
        }
      }
    }

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'SETTINGS_UPDATED',
      'STORE_SETTINGS',
      db.storeSettings.id,
      { ...parsed.data, emailsDispatched }
    );

    return NextResponse.json({
      success: true,
      message: `Store settings successfully updated in database${emailsDispatched > 0 ? ` and policy update notice broadcast to ${emailsDispatched} registered customer(s)` : ''}`,
      settings: db.storeSettings,
      emailsDispatched,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

