"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface ProductCardProps {
  id: string;
  productId?: string;
  name?: string;
  title?: string;
  price: number;
  compareAtPrice?: number | null;
  category?: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  productId,
  name,
  title,
  price,
  compareAtPrice,
  category,
  imageUrl,
  rating = 4.6,
  reviews = 120,
  className = "",
}: ProductCardProps) {
  const pId = productId || id;
  const displayTitle = title || name || "KB Ethnic Fashion";
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl || '/images/kb-monogram-logo.png');

  // Calculate discount percentage
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  // Sync wishlist from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list) && list.some((item: any) => (item.id === pId || item.productId === pId))) {
            setIsWishlisted(true);
          }
        }
      }
    } catch (e) {}
  }, [pId]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kb_wishlist');
        let list: any[] = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(list)) list = [];

        if (isWishlisted) {
          list = list.filter((item: any) => (item.id !== pId && item.productId !== pId));
          setIsWishlisted(false);
        } else {
          list.push({
            id: pId,
            productId: pId,
            title: displayTitle,
            name: displayTitle,
            price,
            compareAtPrice,
            category,
            imageUrl: imgSrc,
            rating,
            reviews,
          });
          setIsWishlisted(true);
        }
        localStorage.setItem('kb_wishlist', JSON.stringify(list));
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } catch (e) {}
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Product Image Area */}
      <Link
        href={`/products/${pId}`}
        className="block relative aspect-[3/4] w-full overflow-hidden bg-slate-50 cursor-pointer"
        aria-label={displayTitle}
      >
        {/* Placeholder skeleton while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
            <span className="text-slate-300 text-xs font-semibold">KB FASHIONS</span>
          </div>
        )}

        <img
          src={imgSrc}
          alt={displayTitle}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
            setImgLoaded(true);
          }}
          className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-red-500 text-white font-black text-[10px] tracking-wide px-2 py-0.5 rounded-full shadow-xs">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-xs ${
            isWishlisted
              ? 'bg-red-50 text-red-500 shadow-xs'
              : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-500 shadow-2xs'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </Link>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {category && (
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {category}
            </span>
          )}
          <Link href={`/products/${pId}`}>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {displayTitle}
            </h3>
          </Link>
        </div>

        <div className="mt-2.5">
          {/* Price Row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-neutral-900">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-500 font-medium">
            <span className="text-amber-500 font-bold">★ {rating.toFixed(1)}</span>
            <span className="text-neutral-400">({reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

