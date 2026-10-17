import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const categoryCounts: Record<string, number> = {};

  db.products.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const categories = [
    { code: 'All', name: 'All Collections', itemCount: db.products.length, subtitle: 'Complete authentic collection' },
    ...Object.entries(categoryCounts).map(([cat, count]) => ({
      code: cat,
      name: cat,
      itemCount: count,
      subtitle: `Authentic village crafted ${cat.toLowerCase()}`
    }))
  ];

  return NextResponse.json({
    success: true,
    categories,
  });
}
