import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
    }

    const result = db.changeUserPassword(auth.userId, currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to change password' }, { status: 400 });
    }

    db.addAuditLog(
      auth.email,
      auth.role,
      'USER_PASSWORD_CHANGED',
      'USER',
      auth.userId,
      { method: 'SELF_SERVICE' }
    );

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully. Your account security has been updated.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
