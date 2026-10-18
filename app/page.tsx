"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CategoryCircleStrip from '@/components/CategoryCircleStrip';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/SkeletonPlaceholder';

interface Product {
  id: string;
  productId: string;
  name: string;
  title: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  images?: { id: string; data: string; name: string }[];
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const heroSlides = [
    {
      title: "Elegance in Every Drape",
      subtitle: "Premium Sarees for Every Occasion",
      ctaText: "Shop Sarees →",
      ctaLink: "/search?category=Sarees",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
      badge: "Festive Collection • Flat 30% OFF",
    },
    {
      title: "Handloom Heritage",
      subtitle: "Authentic Gadwal & Pure Silk Creations",
      ctaText: "Explore Collection →",
      ctaLink: "/search?category=Sarees",
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
      badge: "Kalwaral Store Special",
    },
    {
      title: "Fine Suiting & Shirtings",
      subtitle: "Raymond & Arvind Premium Unstitched Cuts",
      ctaText: "View Men's Wear →",
      ctaLink: "/search?category=Men%27s%20Unstitched%20Fabrics",
      imageUrl: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1200&q=85",
      badge: "Custom Lengths Available",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/catalog/products');
      const data = await res.json();
      if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Error fetching catalog products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract image URL
  const getProductImage = (p: Product) => {
    if (p.images && p.images.length > 0 && p.images[0].data) {
      return p.images[0].data;
    }
    return `/api/media/${p.productId || p.id}`;
  };

  // Trending Products: First 6 products
  const trendingProducts = products.slice(0, 6);
  // New Arrivals: Next 6 products
  const newArrivals = products.slice(6, 12);

  return (
    <div className="bg-[#f8f9fa] text-neutral-900 min-h-screen">
      
      {/* 1. HERO CAMPAIGN SECTION (Desktop & Mobile matching approved mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 sm:pt-6 sm:pb-4">
        
        {/* DESKTOP HERO BANNER */}
        <div className="hidden sm:relative sm:flex items-center justify-between rounded-3xl overflow-hidden bg-gradient-to-r from-[#F6E8D8] via-[#FAF5EE] to-[#F6E8D8] border border-amber-200/50 shadow-xs min-h-[360px] lg:min-h-[420px]">
          
          {/* Left Hero Content */}
          <div className="flex-1 p-8 sm:p-12 lg:p-16 z-10 max-w-xl">
            <span className="inline-block text-[11px] font-black tracking-widest text-amber-800 uppercase bg-amber-200/50 px-3 py-1 rounded-full border border-amber-300/60 mb-3">
              {heroSlides[currentSlide].badge}
            </span>
            <h1 className="text-3xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="mt-2 text-sm lg:text-base text-neutral-600 font-medium">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href={heroSlides[currentSlide].ctaLink}
                className="bg-[#3478F6] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <span>{heroSlides[currentSlide].ctaText}</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative w-1/2 h-[360px] lg:h-[420px] overflow-hidden">
            <img
              src={heroSlides[currentSlide].imageUrl}
              alt="KB Fashions Campaign"
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle Gradient Blend */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F6E8D8] via-[#F6E8D8]/60 to-transparent" />
          </div>

          {/* Carousel Navigation Arrows */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-neutral-800 shadow-md flex items-center justify-center hover:bg-white transition-all z-20"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-neutral-800 shadow-md flex items-center justify-center hover:bg-white transition-all z-20"
          >
            ›
          </button>

          {/* Slider Dots Indicator */}
          <div className="absolute bottom-4 left-12 flex items-center gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-neutral-900' : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>

        </div>

        {/* MOBILE HERO CARD (Matching approved mockup) */}
        <div className="sm:hidden relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-blue-950 text-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1 pr-3 z-10">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                Festive Collection
              </span>
              <h2 className="text-xl font-black text-white mt-0.5 leading-tight">
                Flat 30% OFF
              </h2>
              <p className="text-[11px] text-neutral-300 mt-1">
                Authentic sarees & fine weaves
              </p>
              <Link
                href="/search?category=Sarees"
                className="mt-3 inline-block bg-white text-neutral-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-xs hover:bg-neutral-100"
              >
                Shop Now →
              </Link>
            </div>
            <div className="w-28 h-32 rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img
                src={heroSlides[0].imageUrl}
                alt="Festive Collection"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

      </section>

      {/* 2. CIRCULAR CATEGORY NAVIGATION STRIP */}
      <CategoryCircleStrip />

      {/* 3. TRENDING NOW SECTION (Matching approved mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Trending Now
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Top curated handlooms and customer favorites
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs sm:text-sm font-bold text-[#3478F6] hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
            {trendingProducts.map((p) => (
              <ProductCard
                key={p.productId || p.id}
                id={p.productId || p.id}
                productId={p.productId || p.id}
                title={p.title || p.name}
                name={p.name}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                category={p.category}
                imageUrl={getProductImage(p)}
                rating={p.rating || 4.6}
                reviews={p.reviews || 120}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. NEW ARRIVALS & HANDLOOM HERITAGE */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                New Arrivals &amp; Handloom Heritage
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Generational weaves, Raymond cuts, and daily cottons
              </p>
            </div>
            <Link
              href="/search?sort=created-desc"
              className="text-xs sm:text-sm font-bold text-[#3478F6] hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap"
            >
              <span>View All</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
            {newArrivals.map((p) => (
              <ProductCard
                key={p.productId || p.id}
                id={p.productId || p.id}
                productId={p.productId || p.id}
                title={p.title || p.name}
                name={p.name}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                category={p.category}
                imageUrl={getProductImage(p)}
                rating={p.rating || 4.8}
                reviews={p.reviews || 75}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. TRUST BADGES STRIP (Approved Mockup Style) */}
      <section className="bg-white border-t border-b border-slate-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-2">
                🚚
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Free Shipping</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">On orders above ₹999</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-2">
                🔄
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Easy Returns</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">7 days hassle-free policy</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-2">
                📦
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Direct Village Runner</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">10 km radius under PIN 503145</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-2">
                🔒
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Secure Payment</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">100% Safe with Cashfree</div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
