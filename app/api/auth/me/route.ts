import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = db.findUserById(auth.userId);
  if (!user || !user.isActive) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar || null,
      villageOrCity: user.villageOrCity || null,
      mandalOrArea: user.mandalOrArea || null,
      district: user.district || null,
      state: user.state || 'Telangana',
      pinCode: user.pinCode || '503145',
      preferredLanguage: user.preferredLanguage || 'en',
      bio: user.bio || null,
      createdAt: user.createdAt,
    },
  });
}

