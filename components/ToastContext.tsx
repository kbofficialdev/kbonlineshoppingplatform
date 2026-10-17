"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  timestamp: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = ({
    type = 'info',
    title,
    message,
    duration = 3800,
  }: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: Date.now(),
    };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep maximum 4 active toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  // Support global custom event for non-react triggers
  useEffect(() => {
    const handleGlobalToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        showToast(customEvent.detail);
      }
    };

    window.addEventListener('kb-toast', handleGlobalToast);
    return () => window.removeEventListener('kb-toast', handleGlobalToast);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Top-Right Fixed Toast Alert Container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col space-y-2.5 max-w-[340px] sm:max-w-[380px] w-full pointer-events-none px-3 sm:px-0"
      >
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto relative overflow-hidden bg-white/95 backdrop-blur-md rounded-xl shadow-lg border ${config.borderColor} p-3 sm:p-3.5 flex items-start gap-3 transition-all duration-300 transform translate-x-0 animate-fadeIn`}
            >
              {/* Type Icon Badge */}
              <div className={`shrink-0 w-7 h-7 rounded-lg ${config.bgTint} flex items-center justify-center ${config.iconColor}`}>
                {config.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    {toast.title}
                  </div>
                )}
                <div className="text-[11px] text-neutral-600 leading-snug mt-0.5 break-words">
                  {toast.message}
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-neutral-400 hover:text-neutral-700 p-0.5 rounded transition-colors"
                aria-label="Dismiss alert"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Subtle Auto-Dismiss Countdown Bar */}
              {toast.duration && toast.duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100 overflow-hidden">
                  <div
                    className={`h-full ${config.progressColor} animate-toastProgress`}
                    style={{ animationDuration: `${toast.duration}ms` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a safe fallback that dispatches window event if outside context
    return {
      showToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('kb-toast', { detail: toast }));
        }
      },
      removeToast: () => {},
    };
  }
  return context;
}

function getToastConfig(type: ToastType) {
  switch (type) {
    case 'success':
      return {
        borderColor: 'border-emerald-200/90',
        bgTint: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
        iconColor: 'text-emerald-700',
        progressColor: 'bg-emerald-500',
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    case 'error':
      return {
        borderColor: 'border-rose-200/90',
        bgTint: 'bg-rose-50 text-rose-700 border border-rose-200/60',
        iconColor: 'text-rose-700',
        progressColor: 'bg-rose-500',
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    case 'warning':
      return {
        borderColor: 'border-amber-200/90',
        bgTint: 'bg-amber-50 text-amber-700 border border-amber-200/60',
        iconColor: 'text-amber-700',
        progressColor: 'bg-amber-500',
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    case 'info':
    default:
      return {
        borderColor: 'border-sky-200/90',
        bgTint: 'bg-sky-50 text-sky-700 border border-sky-200/60',
        iconColor: 'text-sky-700',
        progressColor: 'bg-sky-500',
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
  }
}

export default ToastProvider;

