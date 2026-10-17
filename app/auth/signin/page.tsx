"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const reason = searchParams.get('reason');

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
        const dest = redirectUrl || (data.user.role === 'ADMIN' ? '/admin' : '/account/orders');
        router.push(dest);
      } else {
        setErrorMsg(data.error || 'Failed to sign in. Please verify your credentials.');
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
        const dest = redirectUrl || (data.user.role === 'ADMIN' ? '/admin' : '/account/orders');
        router.push(dest);
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
      <div className="bg-kb-white border border-kb-gray p-8 rounded-kb-card shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <Link href="/" className="text-2xl font-black tracking-tight text-kb-black inline-block mb-1">
            KB.
          </Link>
          <h1 className="text-xl font-bold text-kb-black">Sign In to Your Account</h1>
          <p className="text-xs text-kb-slate">Access orders, tracking, and customer services</p>
        </div>

        {/* Security Alert Banners */}
        {reason === 'admin_required' && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs p-3.5 rounded-kb-sm space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Administrator Authentication Required</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              You attempted to access an administration route. Please sign in with an authorized KB Fashions store administrator account.
            </p>
          </div>
        )}

        {reason === 'forbidden' && (
          <div className="bg-red-50 border border-red-300 text-red-900 text-xs p-3.5 rounded-kb-sm space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>🚫</span>
              <span>Access Denied (403 Forbidden)</span>
            </div>
            <p className="text-[11px] text-red-800 leading-relaxed">
              Your account does not possess store administrator privileges. Please sign in with an authorized administrator credential.
            </p>
          </div>
        )}

        {reason === 'auth_required' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs p-3.5 rounded-kb-sm space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>🔒</span>
              <span>Account Sign In Required</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Please sign in to view your orders, account settings, and personalized services.
            </p>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-kb-gray text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('PASSWORD'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
              mode === 'PASSWORD' ? 'border-kb-blue text-kb-blue font-bold' : 'border-transparent text-kb-slate hover:text-kb-black'
            }`}
          >
            Password Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('OTP'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
              mode === 'OTP' ? 'border-kb-blue text-kb-blue font-bold' : 'border-transparent text-kb-slate hover:text-kb-black'
            }`}
          >
            Instant OTP Login
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-kb-error text-xs p-3 rounded-kb-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-kb-success text-xs p-3 rounded-kb-sm">
            ✓ {successMsg}
          </div>
        )}

        {/* MODE 1: PASSWORD LOGIN */}
        {mode === 'PASSWORD' && (
          <form onSubmit={handlePasswordSignIn} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-kb-black block mb-1">Email or Phone Number</label>
              <input
                type="text"
                required
                id="signin-email-input"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="kb.official.admin@gmail.com or 10-digit mobile"
                className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kb-gray bg-white text-xs text-kb-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-kb-black">Password</label>
                <Link href="/auth/forgot-password" className="text-[11px] text-kb-blue hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                id="signin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kb-gray bg-white text-xs text-kb-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
              />
            </div>

            <button
              type="submit"
              id="signin-submit-btn"
              disabled={isLoading}
              className="w-full bg-kb-blue text-white hover:bg-blue-600 font-semibold text-xs py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign In Now →'}
            </button>
          </form>
        )}

        {/* MODE 2: OTP LOGIN */}
        {mode === 'OTP' && (
          <div className="space-y-4 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="font-semibold text-kb-black block mb-1">Registered Phone or Email</label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile or email..."
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kb-gray bg-white text-xs text-kb-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                  />
                  <p className="text-[10px] text-kb-slate mt-1">
                    We will send a 6-digit authentication passcode.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-kb-blue text-white hover:bg-blue-600 font-semibold text-xs py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isLoading ? 'Sending Passcode...' : 'Send 6-Digit OTP →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-kb-black">Enter 6-Digit Passcode</label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-kb-blue hover:underline"
                    >
                      Change Contact
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kb-gray bg-white text-xs text-center font-mono font-bold tracking-widest text-kb-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                  />
                  {devOtpHint && (
                    <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                      🔑 Test passcode for development: <strong>{devOtpHint}</strong>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-kb-blue text-white hover:bg-blue-600 font-semibold text-xs py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isLoading ? 'Verifying Passcode...' : 'Verify OTP & Continue →'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Demo Credentials Box */}
        <div className="border-t border-kb-gray pt-4 text-[11px] text-kb-slate bg-neutral-50 p-3 rounded-kb-sm space-y-1">
          <div className="font-bold text-kb-black">Authorized Store Admin Credentials:</div>
          <div className="font-mono text-[10px]">Email: kb.official.admin@gmail.com</div>
          <div className="font-mono text-[10px]">Password: Admin@KBFashions2026</div>
        </div>

        <div className="border-t border-kb-gray pt-4 text-center text-xs text-kb-slate">
          <span>Don't have an account yet? </span>
          <Link href="/auth/signup" className="text-kb-blue font-semibold hover:underline">
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-xs text-kb-slate">Loading Sign In...</div>}>
      <SignInContent />
    </Suspense>
  );
}
