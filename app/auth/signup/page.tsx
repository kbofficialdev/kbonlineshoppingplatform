"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        router.push('/account/orders');
      } else {
        setErrorMsg(data.error || 'Failed to create account');
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
          <h1 className="text-xl font-black text-kbBlack">Create New Account</h1>
          <p className="text-xs text-neutral-500">Join our patrons across India for direct village clothes</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-kb-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Mobile Phone (10 digits) *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Password (min 6 chars) *</label>
            <input
              type="password"
              required
              minLength={6}
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
            {isLoading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-kbBorder text-xs text-neutral-500">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-bold text-black hover:underline">
            Sign In here →
          </Link>
        </div>
      </div>
    </div>
  );
}

