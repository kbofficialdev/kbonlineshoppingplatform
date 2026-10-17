"use client";

import React from 'react';
import Link from 'next/link';
import KBShopmateAI from '@/components/KBShopmateAI';

export default function AIPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-kb-gray pb-4 mb-6 flex justify-between items-baseline">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-kb-pill bg-kb-violet/10 text-[11px] font-bold text-kb-violet mb-2">
            <span>✦</span>
            <span>Intelligent Village Commerce Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-kb-black">KB Shopmate AI</h1>
          <p className="text-xs text-kb-slate mt-1">
            Shop with voice in Telugu (తెలుగు) or English — discover verified sarees, unstitched fabrics, and daily essentials within your budget.
          </p>
        </div>
        <Link href="/search?category=All" className="text-xs font-semibold text-kb-slate hover:text-kb-black underline">
          ← Browse Catalog
        </Link>
      </div>

      <KBShopmateAI embedded={false} />
    </div>
  );
}

