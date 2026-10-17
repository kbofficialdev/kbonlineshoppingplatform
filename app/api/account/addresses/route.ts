import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const addresses = db.getUserAddresses(auth.userId);
  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.phone || !body.streetAddress || !body.villageOrCity || !body.pinCode) {
      return NextResponse.json(
        { error: 'Name, phone, street address, village/city, and pin code are required' },
        { status: 400 }
      );
    }

    const newAddress = db.addAddress(auth.userId, {
      name: body.name.trim(),
      phone: body.phone.trim(),
      tag: body.tag || 'Home',
      streetAddress: body.streetAddress.trim(),
      villageOrCity: body.villageOrCity.trim(),
      mandalOrArea: body.mandalOrArea?.trim() || 'Sadasivanagar',
      district: body.district?.trim() || 'Kamareddy',
      state: body.state?.trim() || 'Telangana',
      pinCode: body.pinCode.trim(),
      isDefault: Boolean(body.isDefault),
    });

    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid address data' }, { status: 400 });
  }
}
