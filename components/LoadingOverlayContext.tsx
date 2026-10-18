"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { KBBrandLogoMark } from './CustomIcons';

interface LoadingOverlayContextType {
  isLoading: boolean;
  message: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextType>({
  isLoading: false,
  message: 'Processing your request... please wait',
  showLoader: () => { },
  hideLoader: () => { },
});

export function LoadingOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Processing your request... please wait');

  const showLoader = useCallback((msg?: string) => {
    setMessage(msg || 'Processing your request... please wait');
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingOverlayContext.Provider value={{ isLoading, message, showLoader, hideLoader }}>
      {children}

      {/* Global High-Fidelity Opacity Loader Overlay Interface */}
      {isLoading && (
        <div
          id="kb-global-loading-overlay"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[99999] bg-neutral-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80 flex flex-col items-center max-w-sm w-full text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Ambient Background Gradient Ring */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-neutral-950 via-blue-600 to-sky-400 animate-pulse"></div>

            {/* Brand Logo with Pulsing Shield Accent */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 animate-ping absolute"></div>
              <KBBrandLogoMark className="w-14 h-14 relative z-10 drop-shadow-md" />
            </div>

            {/* Radial High-Precision Spinner */}
            <div className="mb-4 relative">
              <svg
                className="w-8 h-8 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20 text-neutral-300"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3.5"
                ></circle>
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>

            {/* Dynamic Status Text */}
            <p className="text-xs font-semibold text-neutral-600 leading-relaxed max-w-[240px]">
              {message}
            </p>
          </div>
        </div>
      )}
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  return useContext(LoadingOverlayContext);
}
