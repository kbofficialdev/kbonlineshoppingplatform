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
      className={`w-full py-12 flex flex-col items-center justify-center gap-3 select-none ${className}`}
    >
      <div
        className="w-12 h-12 rounded-full border-[3.5px] border-neutral-200 border-t-neutral-900 animate-spin"
        style={{ animationDuration: '0.8s' }}
      />
      {message && (
        <span className="text-xs font-semibold text-neutral-500 tracking-wide">
          {message}
        </span>
      )}
    </div>
  );
}

