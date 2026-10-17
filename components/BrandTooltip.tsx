"use client";

import React, { ReactNode } from 'react';

interface BrandTooltipProps {
  content: string;
  subcontent?: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function BrandTooltip({
  content,
  subcontent,
  children,
  position = 'bottom',
  className = '',
}: BrandTooltipProps) {
  if (!content) return <>{children}</>;

  const positionClasses = {
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  const arrowClasses = {
    bottom: '-top-1 left-1/2 -translate-x-1/2 border-b-black/95 border-l-transparent border-r-transparent border-t-transparent',
    top: '-bottom-1 left-1/2 -translate-x-1/2 border-t-black/95 border-l-transparent border-r-transparent border-b-transparent',
    left: '-right-1 top-1/2 -translate-y-1/2 border-l-black/95 border-t-transparent border-b-transparent border-r-transparent',
    right: '-left-1 top-1/2 -translate-y-1/2 border-r-black/95 border-t-transparent border-b-transparent border-l-transparent',
  }[position];

  return (
    <div className={`relative group inline-flex items-center ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`absolute ${positionClasses} z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 scale-95 group-hover:scale-100 group-focus-within:scale-100 transition-all duration-150 ease-out`}
      >
        <div className="bg-kb-black/95 text-white border border-white/15 px-2.5 py-1 rounded-md shadow-xl backdrop-blur-md flex flex-col items-center gap-0.5 whitespace-nowrap">
          <span className="text-[11px] font-semibold text-white tracking-wide">{content}</span>
          {subcontent && (
            <span className="text-[9px] text-amber-300 font-mono">{subcontent}</span>
          )}
        </div>
        {/* Subtle Arrow Tip */}
        <div className={`absolute w-0 h-0 border-4 ${arrowClasses}`} />
      </div>
    </div>
  );
}

