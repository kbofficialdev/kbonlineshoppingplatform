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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 max-w-xs w-full mx-4 text-center space-y-3">
        <div className="flex justify-center">
          <SmoothLoader size="lg" color="black" />
        </div>
        <div>
          <div className="text-sm font-bold text-neutral-900">{message}</div>
          {submessage && (
            <div className="text-xs text-neutral-500 mt-1">{submessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SmoothLoader;

