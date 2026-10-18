import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { detectAbuseLanguage } from '@/lib/abuseFilter';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = db.getSupportTicketById(params.id);
    if (!ticket) {
      return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
    }

    const body = await req.json();
    const { message, attachments, customerEmail } = body;

    let senderRole: 'ADMIN' | 'CUSTOMER' = 'CUSTOMER';
    let senderName = ticket.customerName;

    const auth = verifyAuth(req);

    if (auth) {
      if (auth.role !== 'ADMIN' && ticket.userId !== auth.userId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      const user = db.findUserById(auth.userId);
      senderRole = auth.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
      senderName = auth.role === 'ADMIN'
        ? `KB Support Team (${user?.name || 'Administrator'})`
        : (user?.name || auth.name || ticket.customerName);
    } else {
      const email = customerEmail?.toLowerCase().trim();
      if (!email || email !== ticket.customerEmail.toLowerCase().trim()) {
        return NextResponse.json({ error: 'Authentication or matching customer email required to reply' }, { status: 401 });
      }
      senderRole = 'CUSTOMER';
      senderName = ticket.customerName;
    }

    const newMsg = db.addTicketMessage(ticket.id, {
      senderRole,
      senderName,
      message: message.trim(),
      attachments: attachments || [],
    });

    return NextResponse.json({
      success: true,
      message: newMsg,
      ticketStatus: ticket.status,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

