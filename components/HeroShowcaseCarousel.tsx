"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModalAlert } from './ModalContext';
import { useToast } from './ToastContext';
import { SmoothLoader } from './SmoothLoader';
import { authFetch } from '@/lib/clientAuth';

interface CarouselSlide {
  type: 'BANNER' | 'PRODUCT';
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageSrc: string;
  linkUrl: string;
  ctaText: string;
  price?: number;
  compareAtPrice?: number | null;
  category?: string;
  fabric?: string;
  product?: any;
}

export default function HeroShowcaseCarousel() {
  const { showModal } = useModalAlert();
  const { showToast } = useToast();
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAddingId, setIsAddingId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    async function loadCarouselData() {
      try {
        const [bannersRes, topProdRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/catalog/top-products'),
        ]);

        const bannersData = await bannersRes.json();
        const topProdData = await topProdRes.json();

        const compiledSlides: CarouselSlide[] = [];

        // 1. First Banner: Tradition Meets Trend
        compiledSlides.push({
          type: 'BANNER',
          id: 'slide-tradition',
          title: 'Tradition Meets Trend',
          subtitle: '20 Years of Generational Handlooms, Gadwal Craft & Authentic Unstitched Fabrics directly from Kalwaral Village.',
          badge: '✨ HERITAGE COLLECTION 2026',
          imageSrc: '/api/media/banner-tradition-meets-trend',
          linkUrl: '/search?category=All',
          ctaText: 'Explore Collection',
        });

        // 2. Second Banner: KB Shopmate AI
        compiledSlides.push({
          type: 'BANNER',
          id: 'slide-shopmate-ai',
          title: 'Shop in Telugu & English with Voice AI',
          subtitle: 'Experience KB Shopmate AI — Your friendly digital village assistant for finding the perfect saree or unstitched cut.',
          badge: '✦ INTRODUCING KB SHOPMATE AI',
          imageSrc: '/api/media/banner-shopmate-ai',
          linkUrl: '/ai',
          ctaText: 'Talk to KB AI',
        });

        // 3. Top 5 New Products with Special Effects
        if (topProdData?.products && Array.isArray(topProdData.products)) {
          topProdData.products.slice(0, 5).forEach((p: any, idx: number) => {
            const imgSrc = p.images?.[0]?.data || (p.images?.[0]?.id ? `/api/media/${p.images[0].id}` : '');
            compiledSlides.push({
              type: 'PRODUCT',
              id: `slide-prod-${p.id || idx}`,
              title: p.name,
              subtitle: p.description,
              badge: `🌟 TOP ARRIVAL #${idx + 1} • ${p.category}`,
              imageSrc: imgSrc,
              linkUrl: `/products/${p.productId || p.id}`,
              ctaText: 'View Garment Details',
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              category: p.category,
              fabric: p.fabric,
              product: p,
            });
          });
        }

        setSlides(compiledSlides);
      } catch (err) {
        console.error('Error loading carousel data:', err);
      }
    }

    loadCarouselData();
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Quick Add to Bag handler with strict authentication check
  const handleQuickAdd = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const prodId = product.productId || product.id;
    setIsAddingId(prodId);

    try {
      const res = await authFetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prodId,
          name: product.name,
          price: product.price,
          size: product.sizes?.[0] || 'Standard',
          cutLength: product.isUnstitched ? (product.availableMeters?.[0] || 2.25) : null,
        }),
      });

      if (res.status === 401) {
        showToast({
          type: 'warning',
          title: 'Sign In Required',
          message: 'Please sign in to your KB Fashions account to add items to your shopping bag.',
        });
        showModal({
          type: 'auth',
          title: 'Sign In Required to Shop',
          message: 'Authentication Required: You must have an active signed-in account to add items to your shopping bag or utilize store services.',
          primaryBtn: {
            text: 'Sign In to Your Account →',
            href: `/auth/signin?redirect=${encodeURIComponent(window.location.pathname)}&reason=auth_required`,
          },
          secondaryBtn: {
            text: 'Continue Browsing',
          },
        });
        return;
      }

      const data = await res.json();
      if (data?.requiresAuth) {
        showToast({
          type: 'warning',
          title: 'Sign In Required',
          message: data.error || 'Please sign in to add garments to your bag.',
        });
        return;
      }

      showToast({
        type: 'success',
        title: 'Added to Shopping Bag',
        message: `✓ Added 1x "${product.name}" (₹${product.price}) to your bag.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Bag Error',
        message: 'Could not connect to shopping bag service. Please retry.',
      });
    } finally {
      setIsAddingId(null);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="w-full h-80 sm:h-96 rounded-3xl bg-neutral-900 animate-pulse flex items-center justify-center text-neutral-500 font-mono text-xs">
        Loading KB Fashions Showcase...
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 bg-neutral-950 text-white select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="KB Fashions Featured Collections & Top Arrivals"
    >
      {/* Slide Content Display */}
      <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] flex items-center">
        {currentSlide.type === 'BANNER' ? (
          /* ============================================================== */
          /* FULL-CARD BANNER SLIDE (Complete Display Spanning Full Width)  */
          /* ============================================================== */
          <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] overflow-hidden bg-neutral-950 flex items-end">
            {/* Complete Banner Artwork Spanning Full Card Edge-to-Edge */}
            <img
              src={currentSlide.imageSrc}
              alt={currentSlide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Subtle Gradient Overlay for High-Contrast Action Buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Interactive Floating Overlay CTAs and Badge */}
            <div className="relative z-20 w-full p-4 sm:p-8 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider bg-black/70 text-kb-gold border border-amber-400/40 backdrop-blur-md">
                  {currentSlide.badge}
                </span>
                <h3 className="text-base sm:text-xl lg:text-2xl font-black text-white drop-shadow-lg">
                  {currentSlide.title}
                </h3>
              </div>
              <div className="flex items-center gap-2.5">
                <Link
                  href={currentSlide.linkUrl}
                  className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-kb-blue text-white text-xs sm:text-sm font-bold hover:brightness-110 active:scale-98 transition-all shadow-xl flex items-center gap-1.5"
                >
                  <span>{currentSlide.ctaText}</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/search?category=All"
                  className="px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-neutral-200 hover:text-white text-xs font-semibold transition-colors hidden md:inline-block"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* PRODUCT SHOWCASE SLIDE (Top 5 New Arrivals)                    */
          /* ============================================================== */
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 items-center p-6 sm:p-10 lg:p-14 gap-6 relative z-10">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kb-blue/20 border border-kb-blue/50 text-sky-400 text-[11px] font-bold tracking-wider">
                <span>{currentSlide.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl line-clamp-2 leading-relaxed">
                {currentSlide.subtitle}
              </p>

              {/* Price & Specs Banner */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs max-w-md space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ₹{currentSlide.price}
                  </span>
                  {currentSlide.compareAtPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{currentSlide.compareAtPrice}
                    </span>
                  )}
                  {currentSlide.product?.unitType === 'METER' && (
                    <span className="text-xs text-amber-300 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      ✂ Sold by the Meter
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-400 font-bold ml-auto">
                    ✓ GST Exempt Direct Price
                  </span>
                </div>
                {currentSlide.fabric && (
                  <div className="text-[11px] text-neutral-300">
                    Fabric: <strong className="text-white">{currentSlide.fabric}</strong> • Direct Handloom Weave
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
                <button
                  onClick={(e) => handleQuickAdd(currentSlide.product, e)}
                  disabled={isAddingId === (currentSlide.product?.productId || currentSlide.product?.id)}
                  className="px-6 py-3 rounded-kb-pill bg-kb-blue text-white text-xs sm:text-sm font-bold hover:brightness-110 active:scale-98 transition-all shadow-lg hover:shadow-kb-blue/30 inline-flex items-center gap-2 disabled:opacity-60"
                  id="carousel-quick-add-btn"
                >
                  {isAddingId === (currentSlide.product?.productId || currentSlide.product?.id) ? (
                    <>
                      <SmoothLoader size="xs" color="white" />
                      <span>Adding to Bag...</span>
                    </>
                  ) : (
                    <span>+ Quick Add to Bag</span>
                  )}
                </button>
                <Link
                  href={currentSlide.linkUrl}
                  className="px-5 py-3 rounded-kb-pill border border-white/20 text-neutral-200 hover:text-white hover:border-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  Full Specifications →
                </Link>
              </div>
            </div>

            {/* Right Product Photograph Showcase */}
            <div className="md:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border-2 border-kb-blue/40 shadow-2xl bg-gradient-to-br from-neutral-900 to-black group-hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center p-4">
                {currentSlide.imageSrc ? (
                  <img
                    src={currentSlide.imageSrc}
                    alt={currentSlide.title}
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/20">
                    KB FASHIONS
                  </div>
                )}
                {/* Floating Craft Watermark */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-amber-300 border border-amber-500/30 font-medium">
                  ★ Village Handloom Craft
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Gradient Glow Backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-kb-blue/15 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Navigation Controls (Arrows) */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-base border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-xs"
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-base border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-xs"
        aria-label="Next Slide"
      >
        ›
      </button>

      {/* Pagination Indicators & Slide Counter */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? 'w-8 h-2 bg-kb-blue shadow-xs'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
        <span className="ml-3 text-[10px] font-mono text-neutral-400 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>
    </section>
  );
}
