import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentWebhookSchema } from '@/lib/validations';

const processedIdempotencyKeys = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = paymentWebhookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid webhook schema', details: parsed.error.format() }, { status: 400 });
    }

    const { eventType, payload, idempotencyKey } = parsed.data;

    if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
      return NextResponse.json({ status: 'duplicate_ignored' });
    }
    if (idempotencyKey) processedIdempotencyKeys.add(idempotencyKey);

    db.addAuditLog(
      "GATEWAY_WEBHOOK",
      "SYSTEM",
      `WEBHOOK_${eventType.toUpperCase()}`,
      "PAYMENT",
      payload.orderId || 'UNKNOWN',
      payload
    );

    return NextResponse.json({ status: 'acknowledged', eventType, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
