"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroGrandBanner() {
  const [banner, setBanner] = useState<any>({
    title: "KB FASHIONS: TRADITION MEETS TREND",
    subtitle: "Ancestral Gadwal Handlooms & Modern Textiles from Kalwaral Village, Telangana",
    badge: "🌟 OFFICIAL WELCOME HERO • 20 YEARS HERITAGE",
    imageUrl: "/images/kb-fashions-tradition-meets-trend.png",
    linkUrl: "/search?category=Sarees",
    ctaText: "Explore Authentic Weaves",
  });

  useEffect(() => {
    async function loadFirstBanner() {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        if (data?.banners && Array.isArray(data.banners) && data.banners.length > 0) {
          // Strictly take ONLY the first banner of the collection as instructed
          const first = data.banners[0];
          setBanner({
            title: first.title || "KB FASHIONS: TRADITION MEETS TREND",
            subtitle: first.subtitle || "Ancestral Gadwal Handlooms & Modern Textiles from Kalwaral Village, Telangana",
            badge: first.badge || "🌟 OFFICIAL WELCOME HERO • 20 YEARS HERITAGE",
            imageUrl: first.imageUrl || "/images/kb-fashions-tradition-meets-trend.png",
            linkUrl: first.linkUrl || "/search?category=Sarees",
            ctaText: first.ctaText || "Explore Authentic Weaves",
          });
        }
      } catch (e) {
        // Fallback gracefully to default
      }
    }
    loadFirstBanner();
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-neutral-950 text-white select-none">
      {/* Grand Full-Viewport Container with Zero Side Gaps */}
      <div className="w-full relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] flex items-center justify-center">
        
        {/* Hero Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={banner.imageUrl || "/images/kb-fashions-tradition-meets-trend.png"}
            alt={banner.title}
            className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-[1.01]"
            onError={(e: any) => {
              e.target.src = '/api/media/banner-tradition-meets-trend';
            }}
          />
          {/* Subtle Ambient Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent lg:w-3/4"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
        </div>

        {/* Content Box Overlaid on First Banner */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col justify-center items-start">
          <div className="max-w-2xl space-y-4">
            
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs font-black tracking-wider uppercase text-white shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{banner.badge}</span>
            </div>

            {/* Grand Brand Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
              {banner.title}
            </h1>

            {/* Telugu & English Subtitles */}
            <div className="space-y-1">
              <div className="font-telugu text-base sm:text-xl font-semibold text-amber-200/90 drop-shadow-sm">
                కల్వరాల్ గ్రామీణ చేనేత వస్త్రాల ప్రత్యేక సంగ్రహం
              </div>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl drop-shadow-sm">
                {banner.subtitle}
              </p>
            </div>

            {/* Direct Call to Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href={banner.linkUrl || "/search?category=Sarees"}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-white text-black hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-white/20 flex items-center gap-2"
              >
                <span>{banner.ctaText}</span>
                <span>→</span>
              </Link>

              <Link
                href="/search?category=Men%27s+Unstitched"
                className="px-6 py-3.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white font-semibold text-xs border border-white/30 transition-all flex items-center gap-2"
              >
                <span>Men&apos;s Unstitched Cuts</span>
              </Link>
            </div>

            {/* Store Provenance Coordinates */}
            <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-neutral-300">
              <span className="flex items-center gap-1">
                <span>📍</span>
                <span>Kalwaral Village</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">10 km Radius Doorstep Delivery</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
