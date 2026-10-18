import { NextRequest } from 'next/server';
import { POST as handleCashfreeWebhook } from '@/app/api/payments/cashfree/webhook/route';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return handleCashfreeWebhook(req);
}

