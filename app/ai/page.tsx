"use client";

import React from 'react';
import Link from 'next/link';

export default function AIPage() {
  return (
    <div className="min-h-[85vh] bg-[#07090E] text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse duration-1000"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full max-w-5xl mx-auto space-y-10 relative z-10">
        
        {/* Top Minimal Navigation Strip */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-xs font-mono tracking-widest text-blue-400 uppercase font-bold">
              KB FASHIONS LABS • EXPERIMENTAL AI
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-xs font-bold text-neutral-300 hover:text-white transition-all duration-200"
          >
            <span>←</span>
            <span>Return to Public Store</span>
          </Link>
        </div>

        {/* Master AI Showcase Card with Glowing Holographic Border */}
        <div className="relative rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-blue-500/40 via-indigo-500/20 to-purple-600/40 shadow-[0_0_60px_rgba(59,130,246,0.22)] backdrop-blur-xl">
          <div className="relative rounded-[22px] overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl">
            
            {/* The KB Shopmate AI Official Banner */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[520px] bg-black flex items-center justify-center overflow-hidden group">
              <img
                src="/images/kb-shopmate-ai-banner.png"
                alt="KB ShopMate AI Assistant - Voice & Multimodal Shopping in Telugu and English"
                className="w-full h-full object-contain sm:object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                onError={(e: any) => {
                  e.target.src = '/api/media/banner-shopmate-ai';
                }}
              />
              
              {/* Subtle Vignette Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

              {/* Floating Status Pill over Banner */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="tracking-wide">AI Model V2.4 In Staging</span>
                </div>
              </div>
            </div>

            {/* Bottom Content Area with Animated Coming Soon Typography & Messages */}
            <div className="p-6 sm:p-10 lg:p-12 space-y-8 bg-gradient-to-b from-neutral-950 via-[#0C0F17] to-neutral-950">
              
              {/* Animated Coming Soon Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <span className="text-base animate-spin" style={{ animationDuration: '6s' }}>✦</span>
                  <span className="animate-pulse">COMING SOON FOR TRUSTED PATRONS</span>
                  <span className="text-base animate-spin" style={{ animationDuration: '6s' }}>✦</span>
                </div>

                {/* Animated Voice Waveform Visualizer */}
                <div className="flex items-center gap-1.5 h-6 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 mr-1.5">Voice Synth</span>
                  <span className="w-1 bg-blue-400 rounded-full animate-[pulse_1s_ease-in-out_infinite] h-2"></span>
                  <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-4"></span>
                  <span className="w-1 bg-sky-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s] h-5"></span>
                  <span className="w-1 bg-purple-400 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.1s] h-3"></span>
                  <span className="w-1 bg-blue-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.3s] h-2"></span>
                </div>
              </div>

              {/* Headlines & Messages */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  <span className="bg-gradient-to-r from-white via-neutral-100 to-blue-200 bg-clip-text text-transparent">
                    KB ShopMate AI Voice Shopping
                  </span>
                </h1>

                {/* Heartwarming Telugu Message */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm space-y-1.5">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✨</span>
                    <span>తెలుగు భాషా సంభాషణా వేదిక</span>
                  </div>
                  <p className="font-telugu text-base sm:text-lg font-medium text-amber-100/95 leading-relaxed">
                    “త్వరలో మీ ముందుకు: KB షాప్‌మేట్ AI — తెలంగాణ గ్రామీణ ప్రాంతాల కోసం సరికొత్త ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ షాపింగ్ అనుభవం. మీ మాతృభాష తెలుగులో స్వరం ద్వారా మాట్లాడి స్వచ్ఛమైన గద్వాల్ పట్టు చీరలు, సూటింగ్స్ మరియు వస్త్రాలను మీ బడ్జెట్‌కు తగినట్లు ఎంచుకోండి.”
                  </p>
                </div>

                {/* English Vision Message */}
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl">
                  Experience next-generation conversational commerce hand-tailored for Kalwaral village and patrons across Telangana. 
                  Say naturally in Telugu or English: <span className="text-white font-semibold italic">“నాకు ₹1,500 లోపు పండుగ గద్వాల్ చీర చూపించు”</span> or <span className="text-white font-semibold italic">“Show me Raymond safari suiting cuts”</span> and receive tailored recommendations matched to live village inventory.
                </p>
              </div>

              {/* Interactive Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="text-xl">🎙️</div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Natural Voice in Telugu</h2>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Speak freely in regional dialect with instant conversational responses and audio feedback.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="text-xl">🧵</div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Artisan Weave Matching</h2>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    AI accurately recognizes pure silk Gadwal borders, zari motifs, and tailor cut requirements.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="text-xl">🛡️</div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Trusted Patron Rollout</h2>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Controlled early preview governed directly by KB Fashions store administration.
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/search?category=Sarees"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider transition-all duration-200 text-center shadow-lg hover:shadow-white/20"
                >
                  Explore Current Store Catalog →
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-xs border border-white/10 transition-colors text-center"
                >
                  Back to Kalwaral Storefront
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Minimal Footer Stamp */}
        <div className="text-center text-xs text-neutral-500 font-mono">
          KB FASHIONS (కల్వరాల్ గ్రామం) • Next-Gen Rural Commerce &copy; 2006–2026
        </div>

      </div>
    </div>
  );
}
