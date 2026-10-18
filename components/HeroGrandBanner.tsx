"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroGrandBanner() {
  const [banner, setBanner] = useState<any>({
    title: "KB FASHIONS: TRADITION MEETS TREND",
    imageUrl: "/images/kb-fashions--tradition-meets-trend.png",
    mobileImageUrl: null,
    linkUrl: "/search?category=All",
  });

  useEffect(() => {
    async function loadFirstBanner() {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        if (data?.banners && Array.isArray(data.banners) && data.banners.length > 0) {
          const first = data.banners[0];
          setBanner({
            title: first.title || "KB FASHIONS: TRADITION MEETS TREND",
            imageUrl: first.imageUrl || "/images/kb-fashions--tradition-meets-trend.png",
            mobileImageUrl: first.mobileImageUrl || null,
            linkUrl: first.linkUrl || "/search?category=All",
          });
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadFirstBanner();
  }, []);

  return (
    <section className="w-full relative overflow-hidden bg-black select-none">
      {/* Full-width, uncropped banner presentation with ZERO text overlays covering artwork */}
      <Link 
        href={banner.linkUrl || "/search?category=All"} 
        className="block w-full relative group transition-opacity hover:opacity-95"
      >
        <div className="w-full relative flex items-center justify-center bg-black">
          <picture className="w-full flex items-center justify-center">
            {banner.mobileImageUrl && (
              <source media="(max-width: 640px)" srcSet={banner.mobileImageUrl} />
            )}
            <img
              src={banner.imageUrl || "/images/kb-fashions--tradition-meets-trend.png"}
              alt={banner.title || "KB Fashions Banner"}
              className="w-full h-auto min-h-[200px] sm:min-h-[300px] max-h-[620px] object-cover sm:object-contain object-center transition-transform duration-700 group-hover:scale-[1.008]"
              onError={(e: any) => {
                e.target.src = '/images/kb-fashions--tradition-meets-trend.png';
              }}
            />
          </picture>
        </div>
      </Link>
    </section>
  );
}
