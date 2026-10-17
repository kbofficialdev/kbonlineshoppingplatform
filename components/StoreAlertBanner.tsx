"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from './ToastContext';

export type StandardColor = 'BLUE' | 'BLACK' | 'GREEN' | 'RED';

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
  textColor?: StandardColor | null;
}

const COLOR_CONFIGS: Record<StandardColor, {
  container: string;
  badge: string;
  title: string;
  message: string;
  link: string;
  dismiss: string;
}> = {
  BLUE: {
    container: 'bg-blue-50/95 border-b border-blue-200 text-blue-900',
    badge: 'bg-blue-600 text-white',
    title: 'text-blue-950 font-bold',
    message: 'text-blue-900 font-medium',
    link: 'text-blue-700 hover:text-blue-950 font-bold underline underline-offset-2',
    dismiss: 'text-blue-600 hover:text-blue-950 hover:bg-blue-100/80',
  },
  BLACK: {
    container: 'bg-neutral-100 border-b border-neutral-300 text-black',
    badge: 'bg-black text-white',
    title: 'text-black font-black',
    message: 'text-neutral-900 font-semibold',
    link: 'text-black hover:text-neutral-700 font-bold underline underline-offset-2',
    dismiss: 'text-neutral-600 hover:text-black hover:bg-neutral-200',
  },
  GREEN: {
    container: 'bg-emerald-50/95 border-b border-emerald-200 text-emerald-950',
    badge: 'bg-emerald-700 text-white',
    title: 'text-emerald-950 font-bold',
    message: 'text-emerald-900 font-medium',
    link: 'text-emerald-700 hover:text-emerald-950 font-bold underline underline-offset-2',
    dismiss: 'text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100/80',
  },
  RED: {
    container: 'bg-rose-50/95 border-b border-rose-200 text-rose-950',
    badge: 'bg-red-600 text-white',
    title: 'text-red-950 font-bold',
    message: 'text-red-900 font-medium',
    link: 'text-red-700 hover:text-red-950 font-bold underline underline-offset-2',
    dismiss: 'text-rose-600 hover:text-rose-950 hover:bg-rose-100/80',
  },
};

function resolveStandardColor(alert: StoreAlert): StandardColor {
  if (alert.textColor && ['BLUE', 'BLACK', 'GREEN', 'RED'].includes(alert.textColor)) {
    return alert.textColor as StandardColor;
  }
  switch (alert.type) {
    case 'OFFER':
      return 'GREEN';
    case 'URGENT':
    case 'WARNING':
      return 'RED';
    case 'INFO':
      return 'BLUE';
    case 'ANNOUNCEMENT':
    default:
      return 'BLACK';
  }
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
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = alerts.filter(
    (a) => a.isActive && !dismissedIds.includes(a.id) && (a.displayLocation === 'TOP_BAR' || a.displayLocation === 'BOTH' || !a.displayLocation)
  );

  if (visibleAlerts.length === 0) return null;

  const currentAlert = visibleAlerts[0];
  const color = resolveStandardColor(currentAlert);
  const styles = COLOR_CONFIGS[color];

  return (
    <div
      id="store-alert-announcement-bar"
      role="banner"
      className={`${styles.container} px-3 py-1.5 sm:py-2 text-xs transition-all relative z-50`}
    >
      <div className="max-w-kb-content mx-auto flex items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          {currentAlert.badge && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${styles.badge} shrink-0`}>
              {currentAlert.badge}
            </span>
          )}
          <p className="truncate text-[11px] sm:text-xs">
            <span className={`${styles.title} mr-1.5`}>{currentAlert.title}:</span>
            <span className={styles.message}>{currentAlert.message}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {currentAlert.linkUrl && (
            <Link
              href={currentAlert.linkUrl}
              className={`text-[11px] shrink-0 transition-colors ${styles.link}`}
            >
              {currentAlert.linkText || 'Learn More →'}
            </Link>
          )}

          <button
            onClick={() => setDismissedIds((prev) => [...prev, currentAlert.id])}
            aria-label="Dismiss announcement"
            className={`text-xs px-1 rounded transition-colors ${styles.dismiss}`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
