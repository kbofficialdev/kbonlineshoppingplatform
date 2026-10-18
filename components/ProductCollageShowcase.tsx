"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  productId: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  productType?: string;
  brand?: string;
  fabric?: string;
  isUnstitched?: boolean;
  unitType?: string;
  pricePerMeter?: number | null;
  tags: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  stockQuantity: number;
  origin: string;
  images: { id: string; data: string; name: string }[];
}

interface ProductCollageShowcaseProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onQuickAddToBag: (product: Product, e: React.MouseEvent) => void;
}

type CollageView = 'mosaic' | 'quad' | 'trio';

export default function ProductCollageShowcase({
  products,
  wishlist,
  onToggleWishlist,
  onQuickAddToBag,
}: ProductCollageShowcaseProps) {
  const [activeView, setActiveView] = useState<CollageView>('mosaic');
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  const SWAP_INTERVAL_MS = 5000;
  const validProducts = products.length > 0 ? products : [];

  // Swap animation trigger
  useEffect(() => {
    if (validProducts.length <= 4 || isPaused) return;

    const progressStep = 100;
    const intervalTimer = setInterval(() => {
      setTimerProgress((prev) => {
        if (prev >= 100) {
          triggerSwap();
          return 0;
        }
        return prev + (progressStep / (SWAP_INTERVAL_MS / 100));
      });
    }, progressStep);

    return () => clearInterval(intervalTimer);
  }, [validProducts.length, isPaused, startIndex]);

  const triggerSwap = () => {
    setAnimating(true);
    setTimeout(() => {
      setStartIndex((prev) => (prev + 3) % Math.max(1, validProducts.length));
      setAnimating(false);
    }, 400);
  };

  // Compute products for current view
  const getDisplayItems = () => {
    if (validProducts.length === 0) return [];
    const count = activeView === 'trio' ? 3 : 4;
    const items: Product[] = [];
    for (let i = 0; i < count; i++) {
      items.push(validProducts[(startIndex + i) % validProducts.length]);
    }
    return items;
  };

  const displayItems = getDisplayItems();
  if (displayItems.length === 0) return null;

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
            <span>DYNAMIC CURATION • AUTO-SWAPPING SHOWCASE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
            Artisan Handloom Showcase
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Explore authentic handpicked weaves swapping dynamically. Select preferred collage view below.
          </p>
        </div>

        {/* View Switcher Tabs & Auto-Swap Status */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold">
            <button
              onClick={() => setActiveView('mosaic')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'mosaic'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <span>✦</span>
              <span>Editorial Mosaic</span>
            </button>

            <button
              onClick={() => setActiveView('quad')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'quad'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <span>⊞</span>
              <span>Dynamic Quad</span>
            </button>

            <button
              onClick={() => setActiveView('trio')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'trio'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <span>☰</span>
              <span>Curated Trio</span>
            </button>
          </div>

          <button
            onClick={triggerSwap}
            title="Swap products now"
            className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1.5 shadow-2xs"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Swap Items</span>
          </button>
        </div>
      </div>

      {/* Auto-Swap Subtle Progress Line */}
      <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-600 transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${timerProgress}%` }}
        ></div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: EDITORIAL MOSAIC (1 Hero Left + 3 Stacked Right)                  */}
      {/* ========================================================================= */}
      {activeView === 'mosaic' && (
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-500 ${
            animating ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {/* Main Hero Spotlight (Col span 7) */}
          {displayItems[0] && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 hover-elevate-card flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider">
                      ★ SPOTLIGHT WEAVE
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                      {displayItems[0].category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => onToggleWishlist(displayItems[0], e)}
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs transition-colors"
                  >
                    {wishlist.includes(displayItems[0].productId) ? '♥' : '♡'}
                  </button>
                </div>

                <Link
                  href={`/products/${displayItems[0].productId}`}
                  className="block relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 mb-4"
                >
                  <img
                    src={displayItems[0].images?.[0]?.data || '/images/kb-fashions-tradition-meets-trend.png'}
                    alt={displayItems[0].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-mono">
                    📍 {displayItems[0].origin || 'Kalwaral Handloom'}
                  </div>
                </Link>

                <Link href={`/products/${displayItems[0].productId}`}>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {displayItems[0].name}
                  </h3>
                </Link>

                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {displayItems[0].description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-neutral-900">₹{displayItems[0].price}</span>
                  {displayItems[0].compareAtPrice && (
                    <span className="text-xs text-neutral-400 line-through ml-2">₹{displayItems[0].compareAtPrice}</span>
                  )}
                  <span className="block text-[10px] text-emerald-700 font-bold">✓ Net Direct Village Retail Price</span>
                </div>

                <button
                  onClick={(e) => onQuickAddToBag(displayItems[0], e)}
                  className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs"
                >
                  + Add to Bag
                </button>
              </div>
            </div>
          )}

          {/* 3 Companion Products on Right (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {displayItems.slice(1, 4).map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 sm:p-4 hover-elevate-card flex items-center gap-4 group"
              >
                <Link
                  href={`/products/${item.productId}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0 relative"
                >
                  <img
                    src={item.images?.[0]?.data || '/images/kb-fashions-tradition-meets-trend.png'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[8px] font-bold">
                    #{idx + 2}
                  </span>
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <Link href={`/products/${item.productId}`}>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h4>
                    </Link>
                    <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                      {item.fabric || item.origin}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-neutral-100">
                    <span className="text-sm font-black text-neutral-900">₹{item.price}</span>
                    <button
                      onClick={(e) => onQuickAddToBag(item, e)}
                      className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-[11px] font-bold text-neutral-800 transition-colors"
                    >
                      + Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DYNAMIC QUAD MATRIX (4-Quadrant Grid)                             */}
      {/* ========================================================================= */}
      {activeView === 'quad' && (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ${
            animating ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {displayItems.slice(0, 4).map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-3xl border border-neutral-200/80 p-4 hover-elevate-card flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <Link
                  href={`/products/${item.productId}`}
                  className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 mb-3"
                >
                  <img
                    src={item.images?.[0]?.data || '/images/kb-fashions-tradition-meets-trend.png'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-black/80 text-white text-[9px] font-bold">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => onToggleWishlist(item, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-xs shadow-xs"
                  >
                    {wishlist.includes(item.productId) ? '♥' : '♡'}
                  </button>
                </Link>

                <div className="text-[10px] text-neutral-400 font-mono">📍 {item.origin}</div>
                <Link href={`/products/${item.productId}`}>
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5">
                    {item.name}
                  </h4>
                </Link>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-neutral-900">₹{item.price}</span>
                  {item.compareAtPrice && (
                    <span className="text-[10px] text-neutral-400 line-through ml-1.5">₹{item.compareAtPrice}</span>
                  )}
                </div>

                <button
                  onClick={(e) => onQuickAddToBag(item, e)}
                  className="px-3 py-1.5 rounded-full bg-black text-white hover:bg-neutral-800 text-[11px] font-bold transition-all shadow-2xs"
                >
                  + Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CURATED TRIO (3 High-Impact Vertical Editorial Cards)             */}
      {/* ========================================================================= */}
      {activeView === 'trio' && (
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ${
            animating ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {displayItems.slice(0, 3).map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-3xl border border-neutral-200/80 p-5 hover-elevate-card flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                    CURATED PICK #{idx + 1}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {item.origin}
                  </span>
                </div>

                <Link
                  href={`/products/${item.productId}`}
                  className="block relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 mb-4"
                >
                  <img
                    src={item.images?.[0]?.data || '/images/kb-fashions-tradition-meets-trend.png'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                  {item.category} • {item.fabric || 'Pure Handloom'}
                </span>

                <Link href={`/products/${item.productId}`}>
                  <h4 className="text-base font-black text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-1">
                    {item.name}
                  </h4>
                </Link>

                <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-xl font-black text-neutral-900">₹{item.price}</span>
                  {item.compareAtPrice && (
                    <span className="text-xs text-neutral-400 line-through ml-2">₹{item.compareAtPrice}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onToggleWishlist(item, e)}
                    className="w-8 h-8 rounded-full border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-xs"
                  >
                    {wishlist.includes(item.productId) ? '♥' : '♡'}
                  </button>
                  <button
                    onClick={(e) => onQuickAddToBag(item, e)}
                    className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all"
                  >
                    + Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
