import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const user = db.findUserById(auth.userId);
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User account not found or deactivated' }, { status: 404 });
    }

    const addresses = db.getUserAddresses(user.id);
    const paymentMethods = db.getUserPaymentMethods(user.id);
    const orders = db.orders.filter(o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase());

    return NextResponse.json({
      success: true,
      profile: {
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
        smsUpdates: user.smsUpdates ?? true,
        whatsappUpdates: user.whatsappUpdates ?? true,
        bio: user.bio || 'Patron of authentic Telangana Gadwal sarees & Raymond fine fabrics.',
        createdAt: user.createdAt,
      },
      addresses,
      paymentMethods,
      ordersCount: orders.length,
      orders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const updated = db.updateUserProfile(auth.userId, body);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 400 });
    }

    db.addAuditLog(
      updated.email,
      updated.role,
      'USER_PROFILE_UPDATED',
      'USER',
      updated.id,
      { updatedFields: Object.keys(body) }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        avatar: updated.avatar,
        villageOrCity: updated.villageOrCity,
        mandalOrArea: updated.mandalOrArea,
        district: updated.district,
        state: updated.state,
        pinCode: updated.pinCode,
        preferredLanguage: updated.preferredLanguage,
        smsUpdates: updated.smsUpdates,
        whatsappUpdates: updated.whatsappUpdates,
        bio: updated.bio,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

