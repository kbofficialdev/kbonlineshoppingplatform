"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password Sign In
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim(), password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account/orders');
        }
      } else {
        setErrorMsg(data.error || 'Failed to sign in');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or phone number');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setSuccessMsg(data.message);
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
        }
      } else {
        setErrorMsg(data.error || 'Failed to send OTP');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim(), otp: otpCode.trim() })
      });
      const data = await res.json();

      if (data.success && data.user) {
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account/orders');
        }
      } else {
        setErrorMsg(data.error || 'Invalid OTP code');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
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
          <h1 className="text-xl font-black text-kbBlack">Sign In to Your Account</h1>
          <p className="text-xs text-neutral-500">Access orders, tracking, and customer services</p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-kbBorder text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('PASSWORD'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
              mode === 'PASSWORD' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Password Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('OTP'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
              mode === 'OTP' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Instant OTP Login
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-kb-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-kb-sm">
            ✓ {successMsg}
          </div>
        )}

        {devOtpHint && (
          <div className="bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs p-3 rounded-kb-sm font-mono">
            <strong>Development OTP:</strong> {devOtpHint}
          </div>
        )}

        {mode === 'PASSWORD' ? (
          <form onSubmit={handlePasswordSignIn} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Email or Phone Number</label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="customer@example.com or +919876543210"
                className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-neutral-700">Password</label>
                <Link href="/auth/forgot-password" className="text-neutral-500 hover:text-black underline text-[11px]">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white text-xs font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In with Password'}
            </button>

            <div className="text-[11px] text-neutral-400 bg-neutral-50 p-2.5 rounded text-center">
              Admin demo: <code>kb.official.admin@gmail.com</code> / <code>Admin@KBFashions2026</code>
            </div>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Registered Email or Phone</label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter email or phone number"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white text-xs font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
                >
                  {isLoading ? 'Sending OTP...' : 'Send One-Time Password (OTP)'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest font-mono text-lg font-bold px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-800 text-white text-xs font-bold py-3.5 rounded-kb-pill hover:bg-emerald-900 transition-all shadow-md disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP & Sign In'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-neutral-500 hover:text-black underline text-[11px]"
                  >
                    Change Phone / Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="text-center pt-4 border-t border-kbBorder text-xs text-neutral-500">
          Don't have an account yet?{' '}
          <Link href="/auth/signup" className="font-bold text-black hover:underline">
            Create an Account →
          </Link>
        </div>
      </div>
    </div>
  );
}

