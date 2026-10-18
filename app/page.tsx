"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useModalAlert } from '@/components/ModalContext';
import HeroGrandBanner from '@/components/HeroGrandBanner';
import { authFetch } from '@/lib/clientAuth';
import {
  UserProfileIcon,
  ShoppingBagIcon,
  DeliveryTruckIcon,
  SupportDeskIcon
} from '@/components/CustomIcons';

interface Product {
  id: string;
  productId: string;
  name: string;
  title: string;
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
  isFeatured: boolean;
  images: { id: string; data: string; name: string }[];
}

export default function HomePage() {
  const { showModal } = useModalAlert();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchUser();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kb_wishlist');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setWishlist(Array.isArray(parsed) ? parsed.map((p: any) => p.productId || p.id) : []);
        } catch (e) {}
      }
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await authFetch('/api/auth/me');
      const data = await res.json();
      if (data?.authenticated) setUser(data.user);
      else setUser(null);
    } catch (e) {}
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/catalog/products');
      const data = await res.json();
      if (data?.products) setProducts(data.products);
    } catch (e) {}
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showModal({
        type: 'auth',
        title: 'Sign In Required for Wishlist',
        message: 'Please sign in to save handloom garments to your wishlist.',
        primaryBtn: {
          text: 'Sign In to Account →',
          href: `/auth/signin?redirect=%2F`,
        },
        secondaryBtn: {
          text: 'Create New Account',
          href: `/auth/signup?redirect=%2F`,
        },
      });
      return;
    }

    let updated: any[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kb_wishlist');
      const currentList: any[] = stored ? JSON.parse(stored) : [];
      const exists = currentList.some(p => (p.productId || p.id) === product.productId);
      if (exists) {
        updated = currentList.filter(p => (p.productId || p.id) !== product.productId);
        showModal({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `"${product.name}" was removed from your wishlist.`,
        });
      } else {
        updated = [...currentList, product];
        showModal({
          type: 'success',
          title: 'Saved to Wishlist',
          message: `"${product.name}" added to your wishlist.`,
          primaryBtn: {
            text: 'View Wishlist →',
            href: '/wishlist',
          },
          secondaryBtn: {
            text: 'Continue Shopping',
          },
        });
      }
      localStorage.setItem('kb_wishlist', JSON.stringify(updated));
      setWishlist(updated.map(p => p.productId || p.id));
    }
  };

  const quickAddToBag = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await authFetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          name: product.name,
          price: product.price,
          size: product.sizes[0] || 'Standard',
        })
      });
      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        showModal({
          type: 'auth',
          title: 'Sign In Required',
          message: 'Please sign in to add garments to your bag and proceed to checkout.',
          primaryBtn: {
            text: 'Sign In →',
            href: `/auth/signin?redirect=%2F`,
          },
          secondaryBtn: {
            text: 'Register',
            href: `/auth/signup?redirect=%2F`,
          },
        });
        return;
      }

      if (!res.ok) {
        showModal({
          type: 'error',
          title: 'Unable to Add Item',
          message: data.error || 'Could not add item to bag. Please try again.',
        });
        return;
      }

      showModal({
        type: 'success',
        title: 'Added to Bag',
        message: `✓ "${product.name}" has been added to your shopping bag.`,
        primaryBtn: {
          text: 'View Bag & Checkout →',
          href: '/cart',
        },
        secondaryBtn: {
          text: 'Continue Browsing',
        },
      });
    } catch (e: any) {
      showModal({
        type: 'error',
        title: 'Connection Notice',
        message: 'Could not connect to the store servers. Please check your network.',
      });
    }
  };

  const categories = [
    'All',
    'Sarees',
    "Men's Unstitched",
    "Women's Wear",
    'Wedding & Pattu',
    'Dhotis & Towels',
  ];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => {
        const cat = activeCategory.toLowerCase();
        if (cat.includes('wedding')) {
          return p.category.toLowerCase().includes('wedding') || p.tags.some(t => t.toLowerCase().includes('wedding') || t.toLowerCase().includes('gadwal') || t.toLowerCase().includes('pattu'));
        }
        return (
          p.category.toLowerCase() === cat ||
          (p.productType && p.productType.toLowerCase() === cat) ||
          (cat.includes('saree') && (p.category === 'Sarees' || p.productType === 'SAREE')) ||
          (cat.includes('men') && (p.category.includes('Men') || p.productType === 'MEN_UNSTITCHED')) ||
          (cat.includes('women') && (p.category.includes('Women') || p.productType === 'WOMEN_WEAR')) ||
          (cat.includes('dhoti') && (p.category.includes('Dhoti') || p.productType === 'DHOTI_TOWEL'))
        );
      });

  return (
    <div className="bg-[#f8f9fa] text-neutral-900 min-h-screen">
      {/* 1. HERO GRAND BANNER: 100% Viewport Width, Clean, Uncropped */}
      <HeroGrandBanner />

      {/* 2. VILLAGE HERITAGE & STATUTORY STRIP */}
      <div className="bg-neutral-900 text-neutral-300 border-b border-neutral-800 py-3.5 px-4 sm:px-6 lg:px-8 text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-bold text-white">KB FASHIONS (Kalwaral, Telangana)</span>
            <span className="text-neutral-500 hidden sm:inline">•</span>
            <span className="text-neutral-400 hidden sm:inline">20 Years of Generational Handlooms (2006–2026)</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>🚀 10 km Village Delivery (PIN 503145)</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-neutral-300">Sec 23 CGST Tax-Exempt Net Pricing</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN CATALOG SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Header & Filter Pills */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              Handloom &amp; Master Cuts Catalog
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Pure Gadwal silks, Raymond suitings, Arvind shirtings, and authentic village cottons
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-black border-black text-white shadow-sm'
                    : 'bg-white border-slate-200 text-neutral-700 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map(product => {
            const isWishlisted = wishlist.includes(product.productId);
            const imageSrc = product.images?.[0]?.data || '';
            const isMeter = product.isUnstitched || product.unitType === 'METER';

            return (
              <article
                key={product.id}
                className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-neutral-900 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
              >
                <div>
                  {/* Image Viewport */}
                  <Link
                    href={`/products/${product.productId}`}
                    className="block relative aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden mb-4"
                  >
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-neutral-400">
                        KB FASHIONS
                      </div>
                    )}

                    {/* Tag Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="bg-white/95 backdrop-blur-xs text-neutral-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                        {product.tags[0] || 'Handcrafted'}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product, e)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs transition-transform shadow-xs ${
                        isWishlisted
                          ? 'bg-black text-white'
                          : 'bg-white/95 text-neutral-700 hover:scale-110 border border-slate-200'
                      }`}
                      aria-label="Toggle wishlist"
                    >
                      {isWishlisted ? '♥' : '♡'}
                    </button>
                  </Link>

                  {/* Origin & Fabric */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>{product.origin || 'Kalwaral Heritage'}</span>
                  </div>

                  {/* Product Title */}
                  <Link href={`/products/${product.productId}`}>
                    <h2 className="font-bold text-sm text-neutral-900 group-hover:text-blue-700 transition-colors line-clamp-1 mb-1.5">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {isMeter ? (
                      <div>
                        <span className="text-base font-black text-neutral-900">₹{product.pricePerMeter || product.price}</span>
                        <span className="text-xs text-neutral-500 font-medium ml-1">/ Meter</span>
                        <span className="block text-[9px] text-neutral-400">Tailored cut</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-base font-black text-neutral-900">₹{product.price}</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-neutral-400 line-through ml-2">₹{product.compareAtPrice}</span>
                        )}
                        <span className="block text-[9px] text-neutral-400 font-medium">Net retail price</span>
                      </div>
                    )}
                  </div>

                  {isMeter ? (
                    <Link
                      href={`/products/${product.productId}`}
                      className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 hover:bg-black hover:text-white text-xs font-bold transition-colors"
                    >
                      Select Cut →
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => quickAddToBag(product, e)}
                      className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs"
                    >
                      + Add to Bag
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* 4. THREE PILLARS OF VILLAGE TRANSPARENCY */}
      <section className="bg-white border-t border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Village Provenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-2">
              Why Patrons Trust KB Fashions
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Direct loom relationships, certified weights, and doorstep delivery within 10 km.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-sm text-neutral-900">Direct Ancestral Weaves</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Direct procurement from ancestral Gadwal loom artisans and mill-authorized Raymond suiting lines. Zero counterfeit blends.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-sm text-neutral-900">10 km Local Express Delivery</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Doorstep delivery within Kalwaral and surrounding villages under PIN 503145 with stage-by-stage consignment tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-sm text-neutral-900">Sec 23 CGST Net Pricing</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Operates with statutory exemption under Section 23 of the CGST Act. Transparent net bills of supply with zero tax markup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-black text-white rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
            Festive Handloom Updates
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Stay Connected with Kalwaral Weaves
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Get notified of new Gadwal silk releases, seasonal unstitched cuts, and festival announcements.
          </p>

          {newsletterSubscribed ? (
            <div className="p-3 bg-neutral-900 text-emerald-400 text-xs font-bold rounded-full inline-block border border-emerald-800">
              ✓ You are subscribed to KB Fashions seasonal updates.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  setNewsletterSubscribed(true);
                  showModal({
                    type: 'success',
                    title: 'Subscribed Successfully',
                    message: `✓ Thank you! Updates will be sent to ${newsletterEmail}.`,
                  });
                }
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-3 rounded-full transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
