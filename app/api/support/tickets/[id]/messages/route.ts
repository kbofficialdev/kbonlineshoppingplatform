import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { detectAbuseLanguage } from '@/lib/abuseFilter';

export async function POST(
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

    // Permission check
    if (auth.role !== 'ADMIN' && ticket.userId !== auth.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await req.json();
    const { message, attachments } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // Abuse language check
    const abuseCheck = detectAbuseLanguage(message);
    if (abuseCheck.hasAbuse) {
      return NextResponse.json({
        error: `Submission Blocked: Abusive or prohibited language detected (${abuseCheck.flaggedWords.join(', ')}). Please communicate respectfully.`,
        isAbuse: true,
        flaggedWords: abuseCheck.flaggedWords,
      }, { status: 400 });
    }

    const user = db.findUserById(auth.userId);
    const senderRole = auth.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    const senderName = auth.role === 'ADMIN'
      ? `KB Support Team (${user?.name || 'Administrator'})`
      : (user?.name || auth.name || 'Customer');

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

