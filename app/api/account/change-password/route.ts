import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match' },
        { status: 400 }
      );
    }

    const result = db.changeUserPassword(auth.userId, currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to change password' }, { status: 400 });
    }

    const user = db.users.find(u => u.id === auth.userId);
    if (user) {
      db.addAuditLog(
        user.email,
        user.role,
        'CHANGE_PASSWORD',
        'USER',
        user.id,
        { method: 'ACCOUNT_PORTAL' }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to change password' }, { status: 500 });
  }
}
