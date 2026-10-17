import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { storeSettingsUpdateSchema } from '@/lib/validations';

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: db.storeSettings,
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

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'SETTINGS_UPDATED',
      'STORE_SETTINGS',
      db.storeSettings.id,
      parsed.data
    );

    return NextResponse.json({
      success: true,
      message: 'Store settings successfully updated in database',
      settings: db.storeSettings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
