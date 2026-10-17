import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

interface AuthBannerProps {
  title?: string;
  subtitle?: string;
  badge?: string;
}

export default function AuthBanner({
  title = "Tradition Meets Trend",
  subtitle = "Direct ancestral village handloom craftsmanship, pure combed cottons, and honest pricing since 2006.",
  badge = "20 Years of Village Heritage (2006–2026)",
}: AuthBannerProps) {
  const store = db.storeSettings;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0A0E17] via-[#101726] to-[#06080E] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[480px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-slate-800">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      {/* Top Header & Brand Seal */}
      <div className="relative z-10 space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
            {store.brandName || 'KB'}.
          </span>
          <span className="text-xs font-bold text-kb-gold uppercase tracking-widest pt-2">
            FASHIONS
          </span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
          <span>✨</span>
          <span>{badge}</span>
        </div>

        <div className="font-serif italic text-sm text-amber-200/90 tracking-wide">
          కల్వరాల్ చేనేత వైభవం • పల్లెటూరి స్వచ్ఛమైన వస్త్ర సంస్కృతి
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-md">
          {subtitle}
        </p>
      </div>

      {/* Middle Highlights Feature Grid */}
      <div className="relative z-10 py-8 space-y-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-lg flex-shrink-0">
            🌾
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">Ancestral Kalwaral Village Weaves</div>
            <div className="text-[11px] text-neutral-400">Pure Gadwal pattu sarees, cotton dhotis &amp; mill cuts</div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center text-lg flex-shrink-0">
            🛡️
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">Password + OTP &amp; 5-Min Secure Activation</div>
            <div className="text-[11px] text-neutral-400">Multi-factor protected session with strict 5-min verification</div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-lg flex-shrink-0">
            📍
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">Strict 10 km Local Village Delivery</div>
            <div className="text-[11px] text-neutral-400">Serving habitations under PIN 503145 from Kalwaral store</div>
          </div>
        </div>
      </div>

      {/* Footer Store Coordinates */}
      <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-neutral-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="font-mono">
          {store.address}
        </div>
        <div className="text-neutral-500 text-[10px]">
          Customer Helpline: {store.contactPhone}
        </div>
      </div>
    </div>
  );
}

