import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const addresses = db.getUserAddresses(auth.userId);
    return NextResponse.json({ success: true, addresses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, tag, streetAddress, villageOrCity, mandalOrArea, district, state, pinCode, isDefault } = body;

    if (!name || !phone || !streetAddress || !villageOrCity || !district || !pinCode) {
      return NextResponse.json({ error: 'Name, phone, street address, village/city, district, and pincode are required.' }, { status: 400 });
    }

    const newAddress = db.addAddress(auth.userId, {
      name,
      phone,
      tag: tag || 'Home',
      streetAddress,
      villageOrCity,
      mandalOrArea: mandalOrArea || 'Sadasivanagar',
      district,
      state: state || 'Telangana',
      pinCode,
      isDefault: Boolean(isDefault),
    });

    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress,
    }, { status: 201 });
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
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const updated = db.updateAddress(id, auth.userId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const ok = db.deleteAddress(id, auth.userId);
    if (!ok) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Address removed successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

