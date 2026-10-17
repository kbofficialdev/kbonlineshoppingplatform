"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from './ToastContext';

interface StoreAlert {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ANNOUNCEMENT' | 'OFFER' | 'URGENT' | 'WARNING';
  linkUrl?: string | null;
  linkText?: string | null;
  isActive: boolean;
  isPushed?: boolean;
  displayLocation?: 'TOP_BAR' | 'TOAST_ALERT' | 'BOTH';
  badge?: string | null;
}

export default function StoreAlertBanner() {
  const [alerts, setAlerts] = useState<StoreAlert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) {
          const data = await res.json();
          if (data?.alerts && Array.isArray(data.alerts)) {
            setAlerts(data.alerts);

            // Check if any alert is marked as isPushed
            data.alerts.forEach((alert: StoreAlert) => {
              if (alert.isPushed && (alert.displayLocation === 'TOAST_ALERT' || alert.displayLocation === 'BOTH')) {
                const toastKey = `kb_pushed_toast_${alert.id}`;
                if (typeof window !== 'undefined' && !sessionStorage.getItem(toastKey)) {
                  sessionStorage.setItem(toastKey, 'true');
                  showToast({
                    type: alert.type === 'OFFER' ? 'success' : alert.type === 'URGENT' || alert.type === 'WARNING' ? 'warning' : 'info',
                    title: alert.title,
                    message: alert.message,
                  });
                }
              }
            });
          }
        }
      } catch (err) {}
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Polling for real-time admin updates
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = alerts.filter(
    (a) => a.isActive && !dismissedIds.includes(a.id) && (a.displayLocation === 'TOP_BAR' || a.displayLocation === 'BOTH' || !a.displayLocation)
  );

  if (visibleAlerts.length === 0) return null;

  const currentAlert = visibleAlerts[0];

  const typeStyles = {
    ANNOUNCEMENT: 'bg-neutral-900 text-white border-b border-neutral-800',
    OFFER: 'bg-gradient-to-r from-blue-900 via-indigo-950 to-neutral-900 text-white border-b border-blue-800/40',
    URGENT: 'bg-rose-950 text-rose-100 border-b border-rose-800/40',
    WARNING: 'bg-amber-950 text-amber-100 border-b border-amber-800/40',
    INFO: 'bg-slate-900 text-slate-100 border-b border-slate-800',
  }[currentAlert.type] || 'bg-neutral-900 text-white border-b border-neutral-800';

  return (
    <div
      id="store-alert-announcement-bar"
      role="banner"
      className={`${typeStyles} px-3 py-1.5 sm:py-2 text-xs transition-all relative z-50`}
    >
      <div className="max-w-kb-content mx-auto flex items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          {currentAlert.badge && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/15 text-amber-300 shrink-0">
              {currentAlert.badge}
            </span>
          )}
          <p className="truncate text-[11px] sm:text-xs">
            <span className="font-bold mr-1.5">{currentAlert.title}:</span>
            <span className="opacity-90">{currentAlert.message}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {currentAlert.linkUrl && (
            <Link
              href={currentAlert.linkUrl}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline underline-offset-2 shrink-0 transition-colors"
            >
              {currentAlert.linkText || 'Learn More →'}
            </Link>
          )}

          <button
            onClick={() => setDismissedIds((prev) => [...prev, currentAlert.id])}
            aria-label="Dismiss announcement"
            className="text-neutral-400 hover:text-white text-xs px-1 hover:bg-white/10 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

