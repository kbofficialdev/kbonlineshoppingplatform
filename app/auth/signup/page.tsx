"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { setClientSession } from '@/lib/clientAuth';
import { SmoothLoader } from '@/components/SmoothLoader';
import { useToast } from '@/components/ToastContext';
import AuthBanner from '@/components/AuthBanner';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { showToast } = useToast();

  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const formattedPhone = phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.trim()}`;
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: formattedPhone,
          password,
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.requiresOtp) {
          setStep('OTP');
          setSuccessMsg(data.message || `A 6-digit OTP code and a 5-minute activation link have been dispatched to ${email}.`);
          showToast({
            type: 'info',
            title: 'Account Created',
            message: `Please verify your account with the OTP sent to ${email}.`,
          });
        } else if (data.user) {
          if (data.token) {
            setClientSession(data.token, data.user);
          }
          showToast({
            type: 'success',
            title: 'Account Created',
            message: `Welcome to KB Fashions, ${data.user.name}!`,
          });
          setTimeout(() => {
            window.location.href = redirectUrl || '/account';
          }, 300);
        }
      } else {
        setErrorMsg(data.error || 'Failed to create account');
        showToast({
          type: 'error',
          title: 'Registration Error',
          message: data.error || 'Could not create account. Please check your details.',
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const formattedPhone = phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.trim()}`;
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email.trim() || formattedPhone, otp: otpCode.trim() })
      });
      const data = await res.json();

      if (data.success && data.user) {
        if (data.token) {
          setClientSession(data.token, data.user);
        }
        showToast({
          type: 'success',
          title: 'Account Activated!',
          message: `Welcome to KB Fashions, ${data.user.name}!`,
        });
        setTimeout(() => {
          window.location.href = redirectUrl || '/account';
        }, 300);
      } else {
        setErrorMsg(data.error || 'Invalid OTP code');
        showToast({
          type: 'error',
          title: 'Verification Failed',
          message: data.error || 'Incorrect OTP code. Please try again.',
        });
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || `New OTP code dispatched to ${email}`);
        showToast({
          type: 'info',
          title: 'Passcode Resent',
          message: data.message || 'New OTP passcode sent to your email.',
        });
      } else {
        setErrorMsg(data.error || 'Failed to resend code');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Heritage Visual Banner */}
      <div className="lg:col-span-6 xl:col-span-7">
        <AuthBanner
          title="Create Your Patron Account"
          subtitle="Join thousands of families dressing in authentic Kalwaral handlooms, pure cotton dhotis, and Raymond fabric cuts with honest artisan pricing."
          badge="Ancestral Handlooms (2006–2026)"
        />
      </div>

      {/* Right Column: Clean Form Card */}
      <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-50/60">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-black">
              {step === 'REGISTER' ? 'Register Account' : 'Verify Activation OTP'}
            </h1>
            <p className="text-xs text-neutral-500">
              {step === 'REGISTER'
                ? 'Direct village-to-doorstep shopping across India'
                : `Enter the code sent to ${email} to activate your session`}
            </p>
          </div>

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

          {step === 'REGISTER' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Mobile Number (10 Digits) *</label>
                <div className="flex gap-2">
                  <span className="px-3.5 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-neutral-600 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[6-9][0-9]{9}"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Set Account Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account &amp; Send OTP →</span>
                )}
              </button>

              <div className="text-[11px] text-center text-neutral-400 pt-1 leading-snug">
                By registering, you agree to our{' '}
                <Link href="/policies/terms" className="underline text-black font-semibold">Terms</Link> and{' '}
                <Link href="/policies/privacy" className="underline text-black font-semibold">Privacy Policy</Link>.
              </div>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <span>⏱️</span>
                  <span>Strict 5-Minute Activation Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  A 6-digit OTP code AND a direct activation link have been sent to <strong>{email}</strong>. If you close this page, simply open your email and click the link within 5 minutes!
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-neutral-700">Enter 6-Digit OTP</label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
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
                  className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 px-4 rounded-2xl border-2 border-slate-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all shadow-md disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <SmoothLoader size="xs" color="white" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify OTP &amp; Complete Registration →</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('REGISTER')}
                className="w-full text-xs text-neutral-500 hover:text-black font-semibold text-center"
              >
                ← Back to Edit Details
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link href={`/auth/signin${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} className="font-bold text-black underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <SmoothLoader size="md" color="black" label="Loading Registration..." />
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
