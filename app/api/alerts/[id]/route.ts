import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = db.updateAlert(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, alert: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update alert' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 401 });
  }

  const success = db.deleteAlert(params.id);
  if (!success) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Alert deleted' });
}

