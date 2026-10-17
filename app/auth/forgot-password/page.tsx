"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { SmoothLoader } from '@/components/SmoothLoader';
import { useToast } from '@/components/ToastContext';
import AuthBanner from '@/components/AuthBanner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMsg(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        showToast({
          type: 'success',
          title: 'Reset Link Dispatched',
          message: data.message || `Password reset link sent to ${email}`,
        });
        if (data.devResetToken) {
          setDevToken(data.devResetToken);
        }
      } else {
        setErrorMsg(data.error || 'Failed to request password reset');
        showToast({
          type: 'error',
          title: 'Reset Request Failed',
          message: data.error || 'No account found with this email.',
        });
      }
    } catch (e: any) {
      setErrorMsg('Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Heritage Visual Banner */}
      <div className="lg:col-span-6 xl:col-span-7">
        <AuthBanner
          title="Recover Account Access"
          subtitle="Forgot your password? Enter your registered email to receive an encrypted 15-minute password reset link and account protection instructions."
          badge="Encrypted Security Protocols"
        />
      </div>

      {/* Right Column: Clean Form Card */}
      <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-50/60">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-black">Reset Password</h1>
            <p className="text-xs text-neutral-500">
              Enter your registered email to receive a secure password recovery link
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-2xl leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-2xl space-y-2 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5">
                <span>✓</span>
                <span>Reset Link Dispatched</span>
              </p>
              <p>{message}</p>
              {devToken && (
                <div className="pt-2 border-t border-emerald-200 text-[11px]">
                  <Link
                    href={`/auth/reset-password?token=${devToken}`}
                    className="font-bold underline text-black block mt-1"
                  >
                    Click here to set new password (Development Link) →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Account Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <SmoothLoader size="xs" color="white" />
                  <span>Dispatching Reset Link...</span>
                </>
              ) : (
                <span>Send Password Reset Link →</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-neutral-500">
            Remembered your password?{' '}
            <Link href="/auth/signin" className="font-bold text-black underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
