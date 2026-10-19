"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function StoreMainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <main
      className={
        isAdmin
          ? "flex-1 min-h-screen bg-[#F5F5F4] w-full"
          : "flex-1 pt-28 sm:pt-[84px] pb-24 sm:pb-0"
      }
    >
      {children}
    </main>
  );
}

