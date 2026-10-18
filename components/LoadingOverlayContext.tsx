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
      {/* Minimalist Full-Screen Circular Ring Spinner Overlay (Ref: media_1792310765327_039b725e.png) */}
      {isLoading && (
        <div
          id="kb-global-loading-overlay"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[99999] bg-black/45 backdrop-blur-[2px] flex items-center justify-center select-none animate-in fade-in duration-150"
        >
          {/* Centered Large Circular Ring Spinner */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[6px] sm:border-[7px] border-white/25 border-t-white animate-spin"
            style={{ animationDuration: '0.85s' }}
          />
        </div>
      )}
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  return useContext(LoadingOverlayContext);
}
