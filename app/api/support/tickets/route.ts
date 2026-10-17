import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { detectAbuseLanguage } from '@/lib/abuseFilter';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const priority = searchParams.get('priority') || undefined;

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
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required to raise a support ticket' }, { status: 401 });
    }

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

    // Lookup user details
    const user = db.users.find(u => u.id === auth.userId);
    const customerName = user?.name || auth.name || 'Patron';
    const customerEmail = user?.email || auth.email || '';
    const customerPhone = user?.phone || '';

    const newTicket = db.createSupportTicket({
      userId: auth.userId,
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

