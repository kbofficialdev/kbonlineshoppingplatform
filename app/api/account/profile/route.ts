import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const user = db.users.find(u => u.id === auth.userId);
  if (!user || !user.isActive) {
    return NextResponse.json({ error: 'User not found or inactive' }, { status: 404 });
  }

  const addresses = db.getUserAddresses(user.id);
  const paymentMethods = db.getUserPaymentMethods(user.id);
  const userOrders = db.orders.filter(o => o.userId === user.id || o.customerEmail === user.email);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar || `/api/media/avatar-${user.id}`,
      villageOrCity: user.villageOrCity || 'Kalwaral',
      mandalOrArea: user.mandalOrArea || 'Sadasivanagar',
      district: user.district || 'Kamareddy',
      state: user.state || 'Telangana',
      pinCode: user.pinCode || '503145',
      preferredLanguage: user.preferredLanguage || 'en',
      smsUpdates: user.smsUpdates !== false,
      whatsappUpdates: user.whatsappUpdates !== false,
      bio: user.bio || '',
      createdAt: user.createdAt,
    },
    addresses,
    paymentMethods,
    ordersCount: userOrders.length,
  });
}

export async function PUT(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updatedUser = db.updateUserProfile(auth.userId, body);
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
    }

    db.addAuditLog(
      updatedUser.email,
      updatedUser.role,
      'UPDATE_PROFILE',
      'USER',
      updatedUser.id,
      { fields: Object.keys(body) }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        villageOrCity: updatedUser.villageOrCity,
        mandalOrArea: updatedUser.mandalOrArea,
        district: updatedUser.district,
        state: updatedUser.state,
        pinCode: updatedUser.pinCode,
        preferredLanguage: updatedUser.preferredLanguage,
        smsUpdates: updatedUser.smsUpdates,
        whatsappUpdates: updatedUser.whatsappUpdates,
        bio: updatedUser.bio,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 });
  }
}
