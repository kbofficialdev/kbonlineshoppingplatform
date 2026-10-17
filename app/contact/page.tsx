"use client";

import React, { useState } from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';

export default function ContactPage() {
  const store = db.storeSettings;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="border-b border-kbBorder pb-8 text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-kbBlack">
          Contact KB FASHIONS
        </h1>
        <p className="text-sm text-neutral-500 max-w-lg mx-auto">
          We are here to help with sizing, fabric questions, order inquiries, or special village artisan requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Contact Info */}
        <div className="bg-kbSurfaceAlt border border-kbBorder p-6 sm:p-8 rounded-kb-lg space-y-6 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Store Owner & Administrator
            </span>
            <div className="text-base font-black text-black">{store.officialName}</div>
            <div className="text-neutral-500 text-[11px]">Village Retail & Ancestral Textiles</div>
          </div>

          <div className="space-y-4 pt-4 border-t border-kbBorder">
            <div>
              <span className="font-bold text-neutral-700 block mb-0.5">Physical Shop Location:</span>
              <p className="text-neutral-600 font-mono text-[11px] leading-relaxed">
                {store.address}
              </p>
            </div>

            <div>
              <span className="font-bold text-neutral-700 block mb-0.5">Customer Support Phone:</span>
              <a href={`tel:${store.contactPhone}`} className="text-sm font-extrabold text-black hover:underline">
                {store.contactPhone}
              </a>
              <span className="block text-[10px] text-neutral-400">Available Mon–Sat: 9:00 AM – 8:00 PM IST</span>
            </div>

            <div>
              <span className="font-bold text-neutral-700 block mb-0.5">Official Inquiries & Email:</span>
              <a href={`mailto:${store.contactEmail}`} className="font-mono text-neutral-800 hover:underline">
                {store.contactEmail}
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-kbBorder text-[11px] text-emerald-800 font-semibold">
            ✓ Located at Kalwaral village, Sadasivanagar Mandal, Kamareddy District, Telangana (503145).
          </div>
        </div>

        {/* In-page Inquiry Form */}
        <div className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-4">
            Send Message Directly to Our Shop
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-6 rounded-kb-sm text-xs space-y-2 text-center">
              <div className="text-2xl">✓</div>
              <p className="font-bold">Thank you, {name}!</p>
              <p className="text-neutral-600">
                Your message has been received by KB FASHIONS admin. We will reply to your phone ({phone}) shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Mobile Number (+91) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Your Question or Inquiry *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about size measurements, custom dhoti sets, bulk village orders, or order delivery..."
                  className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white text-xs font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md"
              >
                Send Message to Store Owner
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

