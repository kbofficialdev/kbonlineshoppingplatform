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

    const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'REOPENED', 'CLOSED'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` }, { status: 400 });
    }

    // STRICT GOVERNANCE: Ticket lifecycle statuses are managed exclusively by Store Admin / Support Desk
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Forbidden: Ticket status is managed exclusively by KB Fashions Support Administrators. Customers cannot modify ticket lifecycle statuses.'
      }, { status: 403 });
    }

    let updated: any = null;
    await db.transaction(() => {
      updated = db.updateTicketStatus(ticket.id, status, auth.name || 'Store User');
    });

    return NextResponse.json({
      success: true,
      ticket: updated,
    });
  } catch (err: any) {
    const isTransitionError = err.message?.includes('Invalid ticket transition');
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: isTransitionError ? 400 : 500 });
  }
}

