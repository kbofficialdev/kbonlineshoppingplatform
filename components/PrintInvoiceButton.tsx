"use client";

import React from 'react';

export default function PrintInvoiceButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }}
      className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
    >
      🖨️ Print / Download PDF
    </button>
  );
}
