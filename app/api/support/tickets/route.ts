import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { detectAbuseLanguage } from '@/lib/abuseFilter';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const ticketNumber = searchParams.get('ticketNumber') || undefined;
    const queryEmail = searchParams.get('email') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const priority = searchParams.get('priority') || undefined;

    if (!auth) {
      // Guest ticket tracking lookup
      if (ticketNumber) {
        const ticket = db.getSupportTicketById(ticketNumber);
        if (ticket) {
          return NextResponse.json({ success: true, tickets: [ticket], count: 1 });
        }
        return NextResponse.json({ success: true, tickets: [], count: 0 });
      }
      if (queryEmail) {
        const tickets = db.getSupportTickets({ status, category, priority })
          .filter(t => t.customerEmail.toLowerCase() === queryEmail.toLowerCase().trim());
        return NextResponse.json({ success: true, tickets, count: tickets.length });
      }
      return NextResponse.json({ error: 'Authentication required or provide ticketNumber/email to track' }, { status: 401 });
    }

    let tickets;
    if (auth.role === 'ADMIN') {
      tickets = db.getSupportTickets({ status, category, priority });
    } else {
      tickets = db.getSupportTickets({ userId: auth.userId, status, category, priority });
    }

    return NextResponse.json({
      success: true,
      tickets,
      count: tickets.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    const body = await req.json();
    const { subject, category, priority, orderId, message } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Initial message description is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Abuse Language & Profanity Check
    const subjectCheck = detectAbuseLanguage(subject);
    const messageCheck = detectAbuseLanguage(message);

    if (subjectCheck.hasAbuse || messageCheck.hasAbuse) {
      const allFlagged = Array.from(new Set([...subjectCheck.flaggedWords, ...messageCheck.flaggedWords]));
      return NextResponse.json({
        error: `Submission Blocked: Abusive or prohibited language detected (${allFlagged.join(', ')}). KB Fashions maintains a respectful, village-friendly community. Please revise your message.`,
        isAbuse: true,
        flaggedWords: allFlagged,
      }, { status: 400 });
    }

    let userId = 'guest';
    let customerName = 'Valued Patron';
    let customerEmail = '';
    let customerPhone = '';

    if (auth) {
      userId = auth.userId;
      const user = db.findUserById(auth.userId);
      customerName = user?.name || auth.name || 'Patron';
      customerEmail = user?.email || auth.email || '';
      customerPhone = user?.phone || '';
    } else {
      // Guest ticket validation
      if (!body.customerEmail || !body.customerEmail.trim()) {
        return NextResponse.json({ error: 'Email address is required for ticket tracking and updates' }, { status: 400 });
      }
      if (!body.customerName || !body.customerName.trim()) {
        return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
      }
      customerName = body.customerName.trim();
      customerEmail = body.customerEmail.toLowerCase().trim();
      customerPhone = body.customerPhone?.trim() || '';
    }

    const newTicket = db.createSupportTicket({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      category,
      priority: priority || 'MEDIUM',
      orderId: orderId || null,
      subject: subject.trim(),
      initialMessage: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: `Support ticket ${newTicket.ticketNumber} created successfully. Our Kalwaral village support desk will resolve it within ${newTicket.slaHours} hours.`,
      ticket: newTicket,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

