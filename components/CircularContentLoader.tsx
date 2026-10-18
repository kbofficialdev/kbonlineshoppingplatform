import React from 'react';

interface CircularContentLoaderProps {
  message?: string;
  className?: string;
}

export default function CircularContentLoader({
  message = "Loading KB Fashions catalog...",
  className = "",
}: CircularContentLoaderProps) {
  return (
    <div
      className={`w-full py-8 sm:py-10 flex flex-col items-center justify-center gap-3 select-none ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer radial glow */}
        <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
        {/* Center dot */}
        <div className="absolute w-2.5 h-2.5 bg-neutral-900 rounded-full" />
      </div>
      {message && (
        <span className="text-xs font-bold text-neutral-500 tracking-wide">
          {message}
        </span>
      )}
    </div>
  );
}

