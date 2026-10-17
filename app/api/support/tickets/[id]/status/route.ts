import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const ticket = db.getSupportTicketById(params.id);
    if (!ticket) {
      return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
    }

    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` }, { status: 400 });
    }

    // Customers can only mark their own tickets as RESOLVED or CLOSED
    if (auth.role !== 'ADMIN' && ticket.userId !== auth.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    if (auth.role !== 'ADMIN' && !['RESOLVED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: 'Customers can only mark tickets as resolved or closed' }, { status: 403 });
    }

    const updated = db.updateTicketStatus(ticket.id, status, auth.name || 'Store User');

    return NextResponse.json({
      success: true,
      ticket: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
