import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, emailOrPhone, village } = body;

    if (!emailOrPhone) {
      return NextResponse.json({ error: 'Email or Phone is required' }, { status: 400 });
    }

    // Add audit log
    db.addAuditLog(
      name || 'VISITOR',
      'CUSTOMER',
      'AI_WAITLIST_REQUEST',
      'AI_ACCESS',
      emailOrPhone,
      { name, village: village || 'Kalwaral' }
    );

    return NextResponse.json({
      success: true,
      message: 'You have been added to the trusted customer private access waitlist! Store admin will notify you upon activation.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

