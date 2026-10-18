import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = db.getSupportTicketById(params.id);
    if (!ticket) {
      return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
    }

    const auth = verifyAuth(req);

    if (auth) {
      // Permission check: admin or owner
      if (auth.role !== 'ADMIN' && ticket.userId !== auth.userId) {
        return NextResponse.json({ error: 'Access denied to this ticket' }, { status: 403 });
      }
    } else {
      const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();
      if (!email || email !== ticket.customerEmail.toLowerCase().trim()) {
        return NextResponse.json({ error: 'Authentication or matching email required to view ticket' }, { status: 401 });
      }
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

