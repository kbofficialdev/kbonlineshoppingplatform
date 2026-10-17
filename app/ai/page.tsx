"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ToastContext';
import { SmoothLoader } from '@/components/SmoothLoader';

export default function AIPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [village, setVillage] = useState('Kalwaral');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast({ type: 'warning', title: 'Contact Required', message: 'Please enter your mobile phone or email' });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/ai/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, emailOrPhone, village }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsJoined(true);
        showToast({
          type: 'success',
          title: 'Waitlist Registered',
          message: '✓ Added to the trusted customer private access queue.',
        });
      } else {
        showToast({ type: 'error', title: 'Error', message: data.error || 'Failed to submit' });
      }
    } catch (err: any) {
      showToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <span>🔒 PRIVATE PREVIEW</span>
            <span>•</span>
            <span>COMING SOON FOR TRUSTED CUSTOMERS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            KB Shopmate AI Voice Shopping
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
            Conversational shopping assistant in Telugu (తెలుగు) &amp; English. AI access is strictly controlled by KB Fashions store administration for trusted customers.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold text-neutral-700 hover:border-black hover:text-black transition-colors shrink-0"
        >
          ← Return to Public Store
        </Link>
      </div>

      {/* Main Content Grid: Poster on Left, Coming Soon & Waitlist on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Poster Image Container */}
        <div className="lg:col-span-7 bg-neutral-950 p-3 sm:p-5 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden group">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900">
            <img
              src="/images/kb-ai-poster.png"
              alt="KB Shopmate AI Interface Poster"
              className="w-full h-full object-contain object-center"
              onError={(e: any) => {
                // Fallback if image path varies
                e.target.src = '/api/media/banner-shopmate-ai';
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-2 font-mono">
            <span>Preview: Multi-turn Voice AI Engine</span>
            <span className="text-amber-400">Status: Controlled Rollout</span>
          </div>
        </div>

        {/* Right Column: Waitlist Card & Governance Notice */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                Exclusive Early Access
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                Request Trusted Customer Access
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Join our private waitlist. Our store owners in Kalwaral will review customer profiles and unlock AI voice shopping capabilities on your account.
              </p>
            </div>

            {isJoined ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <span className="text-2xl">✓</span>
                <h3 className="text-sm font-bold text-emerald-900">Application Submitted!</h3>
                <p className="text-xs text-emerald-700">
                  Thank you! Your profile has been queued for verification. Once approved by the administrator, voice shopping will be active on your account.
                </p>
                <Link
                  href="/search?category=Sarees"
                  className="inline-block mt-2 text-xs font-bold text-emerald-900 underline"
                >
                  Explore Current Catalog in the Meantime →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Mobile Phone (+91) or Email *</label>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. 9876543210 or ramesh@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Village / Town</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Kalwaral, Sadasivanagar, Kamareddy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="join-ai-waitlist-btn"
                  className="w-full py-3 rounded-full bg-black text-white font-bold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <SmoothLoader size="xs" color="white" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Request AI Access / Join Waitlist →</span>
                  )}
                </button>
              </form>
            )}

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-neutral-600 space-y-1">
              <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Administrator Governance Notice</span>
              </div>
              <p>
                Under our store's security charter, AI interactions with the live inventory database are permission-gated. Store administrators toggle user access directly in the administration console.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
