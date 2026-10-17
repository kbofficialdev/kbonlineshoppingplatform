import { NextRequest, NextResponse } from 'next/server';
import { db, UserModel } from '@/lib/db';
import { signupSchema } from '@/lib/validations';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;

    // Check if user already exists
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === phone);
    if (existing) {
      return NextResponse.json({ error: 'Account already exists with this email or phone number' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const newUser: UserModel = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: 'CUSTOMER',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);

    db.addAuditLog(
      newUser.email,
      'CUSTOMER',
      'USER_SIGNUP',
      'USER',
      newUser.id,
      { name, email, phone }
    );

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      token,
    }, { status: 201 });

    // Set HTTP-only auth cookie
    response.cookies.set('kb_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
