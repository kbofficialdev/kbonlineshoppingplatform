"use client";

import React from 'react';

interface SmoothLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'black' | 'white' | 'gray';
  label?: string;
  className?: string;
}

export function SmoothLoader({
  size = 'sm',
  color = 'black',
  label,
  className = '',
}: SmoothLoaderProps) {
  // Ultra-clean, thin, smooth spinner dimensions
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 border-[1.5px]',
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-6 h-6 border-[2px]',
    lg: 'w-8 h-8 border-[2.5px]',
  }[size];

  const colorClasses = {
    black: 'border-neutral-200 border-t-black',
    white: 'border-white/30 border-t-white',
    gray: 'border-neutral-300 border-t-neutral-700',
  }[color];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="status" aria-label={label || 'Loading...'}>
      <div
        className={`${sizeClasses} ${colorClasses} rounded-full animate-spin transition-all`}
        style={{ animationDuration: '0.65s' }}
      />
      {label && (
        <span className="text-xs font-medium text-neutral-600 tracking-tight">
          {label}
        </span>
      )}
    </div>
  );
}

interface SmoothLoadingOverlayProps {
  message?: string;
  submessage?: string;
}

export function SmoothLoadingOverlay({
  message = 'Processing...',
  submessage,
}: SmoothLoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[99999] bg-black/45 backdrop-blur-[2px] flex items-center justify-center select-none animate-in fade-in duration-150"
    >
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[6px] sm:border-[7px] border-white/25 border-t-white animate-spin"
        style={{ animationDuration: '0.85s' }}
      />
    </div>
  );
}

export default SmoothLoader;

