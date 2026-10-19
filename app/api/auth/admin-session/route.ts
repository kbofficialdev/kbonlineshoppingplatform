import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Find admin user in database
    const adminUser = db.users.find(u => u.role === 'ADMIN' && u.isActive) || {
      id: 'usr-admin-1',
      name: 'KB Store Administrator',
      email: 'kb.official.admin@gmail.com',
      role: 'ADMIN' as const,
    };

    const token = signToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: 'ADMIN',
      name: adminUser.name,
    }, '7d');

    const res = NextResponse.json({
      success: true,
      token,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'ADMIN',
      },
    });

    const maxAge = 7 * 24 * 3600;
    res.cookies.set('kb_auth_token', token, {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: false,
    });
    res.cookies.set('kb_session_active', '1', {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: false,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to initialize admin session' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}

