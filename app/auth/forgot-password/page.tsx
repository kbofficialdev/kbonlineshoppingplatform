"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        if (data.devResetToken) {
          setDevToken(data.devResetToken);
        }
      } else {
        setErrorMsg(data.error || 'Failed to request reset');
      }
    } catch (e: any) {
      setErrorMsg('Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-kbBorder p-8 rounded-kb-xl shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <Link href="/" className="text-2xl font-black tracking-tight text-black inline-block mb-1">
            KB.
          </Link>
          <h1 className="text-xl font-black text-kbBlack">Forgot Password</h1>
          <p className="text-xs text-neutral-500">Enter your email to receive a secure password reset link</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-kb-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-kb-sm space-y-2">
            <p className="font-bold">✓ Reset Link Dispatched</p>
            <p>{message}</p>
            {devToken && (
              <div className="pt-2 border-t border-emerald-200">
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Account Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white text-xs font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-kbBorder text-xs text-neutral-500">
          Remembered your password?{' '}
          <Link href="/auth/signin" className="font-bold text-black hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
