"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function TrackingContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = searchParams.get('orderId') || searchParams.get('id');
    if (q) {
      setOrderId(q);
      handleTrack(q);
    }
  }, [searchParams]);

  const handleTrack = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (data.success) {
        setTracking(data.tracking);
      } else {
        setTracking(null);
        setError(data.error || 'No consignment found with this order ID.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-kb-blue border border-blue-200 text-xs font-bold uppercase tracking-wider">
          🚚 Real-Time Logistics Tracking
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-kb-black tracking-tight">
          Track Your Handloom Consignment
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Enter your Order ID or AWB Tracking Number to view live dispatch milestones from Kalwaral village.
        </p>

        {/* Tracking Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack(orderId);
          }}
          className="flex gap-2 max-w-md mx-auto pt-2"
        >
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ORD-2026-1001"
            required
            className="flex-1 px-4 py-3 rounded-full border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-kb-blue focus:outline-none font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-full bg-kb-blue text-white text-xs sm:text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-md"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium">
          {error}
        </div>
      )}

      {tracking && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">AWB Consignment #</span>
              <span className="font-mono font-bold text-black text-sm">{tracking.trackingNumber}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Courier Partner</span>
              <span className="font-bold text-black">{tracking.courierPartner}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Destination Address</span>
              <span className="text-neutral-700 leading-snug">{tracking.destination}</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Milestone Stepper</h3>
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {tracking.stages?.map((stage: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    stage.completed
                      ? 'bg-kb-blue border-kb-blue text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {stage.completed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${stage.isCurrent ? 'text-kb-blue' : 'text-black'}`}>
                        {stage.label}
                      </span>
                      {stage.isCurrent && (
                        <span className="px-2 py-0.2 bg-blue-100 text-kb-blue rounded-full text-[9px] font-bold animate-pulse">
                          In Transit
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-xs">
            <Link href={`/orders/${tracking.orderId}`} className="text-kb-blue font-bold hover:underline">
              View Detailed Order Stage Stepper →
            </Link>
            <Link href={`/invoices/${tracking.orderId}`} className="text-neutral-600 font-semibold hover:text-black">
              📄 Download Bill of Supply
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StandaloneTrackingPage() {
  return (
    <React.Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-4 border-kb-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-neutral-500">Loading Tracking...</p>
      </div>
    }>
      <TrackingContent />
    </React.Suspense>
  );
}
