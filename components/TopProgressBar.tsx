"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';

function ProgressBarInner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger progress on route change
  useEffect(() => {
    setLoading(true);
    setProgress(25);

    const timer1 = setTimeout(() => {
      setProgress(70);
    }, 70);

    const timer2 = setTimeout(() => {
      setProgress(95);
    }, 150);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 180);
    }, 240);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  // Global manual listener for async fetch or form submissions
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setProgress(35);
    };
    const handleProgress = (e: any) => {
      if (typeof e.detail?.percent === 'number') {
        setProgress(e.detail.percent);
      }
    };
    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 180);
    };

    window.addEventListener('kb-top-progress-start', handleStart);
    window.addEventListener('kb-top-progress-update', handleProgress);
    window.addEventListener('kb-top-progress-stop', handleComplete);

    return () => {
      window.removeEventListener('kb-top-progress-start', handleStart);
      window.removeEventListener('kb-top-progress-update', handleProgress);
      window.removeEventListener('kb-top-progress-stop', handleComplete);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      id="kb-top-loader-bar"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none overflow-hidden bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-kb-blue via-kb-violet to-amber-400 transition-all duration-200 ease-out shadow-[0_0_10px_#3478F6]"
        style={{
          width: `${progress}%`,
          opacity: loading || progress > 0 ? 1 : 0,
        }}
      >
        {/* Glow Pip at front edge */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/60 blur-[1px]" />
      </div>
    </div>
  );
}

export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}

