"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { setClientSession } from '@/lib/clientAuth';
import { SmoothLoader } from '@/components/SmoothLoader';
import { useToast } from '@/components/ToastContext';
import AuthBanner from '@/components/AuthBanner';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const reason = searchParams.get('reason');
  const verified = searchParams.get('verified');
  const urlError = searchParams.get('error');

  const { showToast } = useToast();

  const [mode, setMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(urlError || null);
  const [successMsg, setSuccessMsg] = useState<string | null>(
    verified ? '✓ Email verified successfully! Please sign in with your credentials.' : null
  );

  // Password Sign In (Step 1)
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

      if (data.requiresOtp) {
        setOtpSent(true);
        setMode('OTP');
        setSuccessMsg(data.message || `A 6-digit OTP and 5-minute activation link have been dispatched to ${data.email}.`);
        showToast({
          type: 'info',
          title: 'OTP Required',
          message: data.message || `Enter the 6-digit passcode sent to ${data.email}.`,
        });
        return;
      }

      if (data.success && data.user) {
        if (data.token) {
          setClientSession(data.token, data.user);
        }
        showToast({
          type: 'success',
          title: 'Sign In Successful',
          message: `Welcome back, ${data.user.name || 'valued customer'}!`,
        });
        const dest = redirectUrl || (data.user.role === 'ADMIN' ? '/admin' : '/account');
        setTimeout(() => {
          window.location.href = dest;
        }, 300);
      } else {
        setErrorMsg(data.error || 'Failed to sign in. Please verify your credentials.');
        showToast({
          type: 'error',
          title: 'Sign In Failed',
          message: data.error || 'Incorrect email/phone or password. Please try again.',
        });
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to store authentication service.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send Direct OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        showToast({
          type: 'info',
          title: 'Passcode Dispatched',
          message: data.message || '6-digit OTP passcode sent successfully.',
        });
      } else {
        setErrorMsg(data.error || 'Failed to send OTP');
        showToast({
          type: 'error',
          title: 'Unable to Send Passcode',
          message: data.error || 'Could not dispatch OTP code.',
        });
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP (Step 2)
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
        if (data.token) {
          setClientSession(data.token, data.user);
        }
        showToast({
          type: 'success',
          title: 'Verification Successful',
          message: `Welcome, ${data.user.name}! Your session is active.`,
        });
        const dest = redirectUrl || (data.user.role === 'ADMIN' ? '/admin' : '/account');
        setTimeout(() => {
          window.location.href = dest;
        }, 300);
      } else {
        setErrorMsg(data.error || 'Invalid OTP code');
        showToast({
          type: 'error',
          title: 'Verification Failed',
          message: data.error || 'Incorrect OTP code. Please check and try again.',
        });
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to store server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Full-Width Heritage Visual Banner */}
      <div className="lg:col-span-6 xl:col-span-7">
        <AuthBanner
          title="Sign In to Your Patron Account"
          subtitle="Direct from Kalwaral Village handloom looms. Access past orders, track live consignments, and enjoy exclusive rural weaving collections."
          badge="Secure Patron Portal (2006–2026)"
        />
      </div>

      {/* Right Column: Clean Form Card */}
      <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-50/60">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-black">Patron Sign In</h1>
            <p className="text-xs text-neutral-500">
              Access your personal wardrobe account with multi-factor security
            </p>
          </div>

          {reason === 'auth_required' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-2xl">
              <strong>Account Required:</strong> Please sign in with your customer credentials to proceed with checkout.
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-2xl leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('PASSWORD'); setErrorMsg(null); }}
              className={`flex-1 pb-2.5 text-center transition-colors border-b-2 -mb-px ${
                mode === 'PASSWORD' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Password + OTP
            </button>
            <button
              type="button"
              onClick={() => { setMode('OTP'); setErrorMsg(null); }}
              className={`flex-1 pb-2.5 text-center transition-colors border-b-2 -mb-px ${
                mode === 'OTP' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Direct OTP Passcode
            </button>
          </div>

          {/* FORM: Password Sign In */}
          {mode === 'PASSWORD' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Registered Email Address or Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul@example.com or 9876543210"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-neutral-700">Password *</label>
                  <Link href="/auth/forgot-password" className="text-[11px] font-bold text-neutral-500 hover:text-black hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Verify Password &amp; Proceed to OTP →</span>
                )}
              </button>

              <div className="text-[11px] text-center text-neutral-400 pt-1">
                A 6-digit confirmation OTP and a 5-minute activation link will be sent to your email.
              </div>
            </form>
          )}

          {/* FORM: OTP Verification */}
          {mode === 'OTP' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Registered Email or Phone *
                </label>
                <input
                  type="text"
                  required
                  disabled={otpSent}
                  placeholder="e.g. rahul@example.com or 9876543210"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium disabled:bg-slate-50 disabled:text-neutral-500"
                />
              </div>

              {otpSent && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-neutral-700">Enter 6-Digit OTP *</label>
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={isLoading}
                      className="text-[11px] font-bold text-blue-700 hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl font-mono font-bold tracking-widest py-3 px-4 rounded-2xl border-2 border-slate-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                  <div className="text-[10px] text-neutral-500 mt-1.5 leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-slate-100">
                    ⏱️ Code valid for 5 minutes. If you leave, you can click the secure 5-minute activation link sent to your email!
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <SmoothLoader size="xs" color="white" />
                    <span>{otpSent ? 'Verifying OTP...' : 'Dispatching OTP...'}</span>
                  </>
                ) : (
                  <span>{otpSent ? 'Confirm OTP & Sign In →' : 'Send 6-Digit OTP Passcode →'}</span>
                )}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtpCode(''); }}
                  className="w-full text-xs text-neutral-500 hover:text-black font-semibold text-center"
                >
                  Change Email / Phone Number
                </button>
              )}
            </form>
          )}

          {/* Bottom Prompt */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-neutral-500">
            Don&apos;t have a patron account?{' '}
            <Link href={`/auth/signup${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} className="font-bold text-black underline">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <SmoothLoader size="md" color="black" label="Loading Sign In Portal..." />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
