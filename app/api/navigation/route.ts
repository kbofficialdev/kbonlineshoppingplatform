import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = db.getNavItems();
  return NextResponse.json({
    navItems: items,
    count: items.length,
    timestamp: new Date().toISOString()
  });
}

