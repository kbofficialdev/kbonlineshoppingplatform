"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useModalAlert } from '@/components/ModalContext';
import HeroShowcaseCarousel from '@/components/HeroShowcaseCarousel';
import { authFetch } from '@/lib/clientAuth';

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
  fabricCare?: string;
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
  const [store, setStore] = useState<any>({
    brandName: "KB",
    officialName: "KB FASHIONS",
    village: "Kalwaral",
    mandal: "Sadasivanagar",
    district: "Kamareddy",
    state: "Telangana",
    pinCode: "503145",
    contactPhone: "+91 7989768200",
    contactEmail: "kb.official.admin@gmail.com",
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchStoreSettings();
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

  const fetchStoreSettings = async () => {
    try {
      const res = await fetch('/api/store/settings');
      const data = await res.json();
      if (data?.settings) setStore(data.settings);
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

    // Check if user is authenticated before allowing wishlist services
    if (!user) {
      showModal({
        type: 'auth',
        title: 'Sign In Required for Wishlist',
        message: 'Please sign in to save your favorite Kalwaral handloom items to your personal wishlist.',
        primaryBtn: {
          text: 'Sign In to Account →',
          href: `/auth/signin?redirect=%2F&reason=auth_required`,
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
          message: `♥ "${product.name}" has been bookmarked to your wishlist.`,
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
          size: product.sizes[0] || 'M',
        })
      });
      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        showModal({
          type: 'auth',
          title: 'Sign In Required to Shop',
          message: 'An active account session is required to add items to your shopping bag, save your selections, and place an order.',
          primaryBtn: {
            text: 'Sign In to Account →',
            href: `/auth/signin?redirect=%2F&reason=auth_required`,
          },
          secondaryBtn: {
            text: 'Create New Account',
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

      // Success modal alert at center of page
      showModal({
        type: 'success',
        title: 'Item Added to Shopping Bag',
        message: `✓ "${product.name}" has been added to your shopping bag!`,
        primaryBtn: {
          text: 'View Shopping Bag & Checkout →',
          href: '/cart',
        },
        secondaryBtn: {
          text: 'Continue Shopping',
        },
      });
    } catch (e: any) {
      showModal({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to the store servers. Please check your connection.',
      });
    }
  };

  // Initialize Canvas Chart.js for quality ratings
  useEffect(() => {
    if (!chartCanvasRef.current) return;
    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const Chart = (window as any).Chart;
    if (Chart) {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Fabric Longevity', 'Softness & Breathability', 'Stitching Strength', 'Color Retention', 'Price-to-Value'],
          datasets: [{
            label: 'Patron Satisfaction Rating (%)',
            data: [99, 98, 98, 97, 100],
            backgroundColor: '#08090C',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => ` Satisfaction: ${context.raw}%`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { callback: (val: any) => val + '%', font: { size: 10, family: 'Inter' } },
              grid: { color: '#E8EAF0' }
            },
            x: {
              ticks: { font: { size: 11, family: 'Inter' } },
              grid: { display: false }
            }
          }
        }
      });
    }
  }, [products]);

  const categories = [
    'All',
    'Sarees',
    "Men's Unstitched",
    "Women's Wear",
    'Wedding & Pattu',
    'Blouse & Matching',
    'Dhotis & Towels',
    'Inners & Essentials'
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
          (cat.includes('blouse') && (p.category.includes('Blouse') || p.productType === 'BLOUSE_PIECE')) ||
          (cat.includes('dhoti') && (p.category.includes('Dhoti') || p.productType === 'DHOTI_TOWEL')) ||
          (cat.includes('inner') && (p.category.includes('Inner') || p.productType === 'INNER_ESSENTIAL'))
        );
      });

  const weddingCollection = products.filter(p => 
    p.tags?.some(t => ['wedding', 'gadwal', 'pattu', 'ceremony', 'pure silk'].includes(t.toLowerCase())) ||
    p.category === 'Wedding' || p.brand === 'Gadwal Handloom' || p.brand === 'Raymond'
  ).slice(0, 4);

  return (
    <div className="bg-white text-kb-black">
      {/* ========================================================================= */}
      {/* 2. FULL-VIEWPORT HERO CAROUSEL: ZERO SIDE GAPS (100vw EDGE-TO-EDGE)       */}
      {/* ========================================================================= */}
      <section className="w-full pb-0">
        <HeroShowcaseCarousel />
      </section>

      {/* ========================================================================= */}
      {/* 2.5 LIVE VILLAGE STORE STATUS & HYPERLOCAL CONCIERGE STRIP                 */}
      {/* ========================================================================= */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-white py-3 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              STORE OPEN TODAY 9 AM – 9 PM
            </span>
            <span className="text-neutral-300 font-medium text-[11px]">
              📍 Kalwaral Village (PIN 503145) • Free Doorstep Delivery within 10 km
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/policies/shipping" className="text-amber-300 font-bold hover:underline">
              Check 10-km Villages →
            </Link>
            <span className="text-neutral-600">|</span>
            <Link href="/support" className="text-sky-300 font-bold hover:underline flex items-center gap-1">
              <span>🎫</span>
              <span>Online Support Desk</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KB SHOPMATE AI ANNOUNCEMENT BANNER (AI Blue-Violet Gradient 7%)       */}
      {/* ========================================================================= */}
      <section className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="kb-ai-gradient rounded-kb-panel p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-kb-pill bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold text-white">
                <span className="text-base">✦</span>
                <span>Shop in Telugu &amp; English with Voice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Meet KB Shopmate AI: Your Personal Village Assistant
              </h2>
              <p className="text-white/90 text-sm leading-relaxed">
                Experience voice-powered conversational shopping. Say or type naturally in Telugu: 
                <span className="font-telugu font-semibold bg-white/20 px-2 py-0.5 rounded mx-1 text-white">
                  “నాకు ₹1000 లోపు మంచి చీర చూపించు”
                </span>
                and discover handpicked sarees, suitings, and essentials matched to your exact budget.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/ai"
                className="bg-white text-kb-black hover:bg-neutral-100 font-semibold text-sm px-6 py-3.5 rounded-kb-pill transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span>🎙️ Try KB Shopmate AI Now</span>
              </Link>
              <Link
                href="/ai?query=gadwal+sarees"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-sm px-5 py-3.5 rounded-kb-pill transition-all text-center"
              >
                Voice Examples →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. POPULAR CATEGORIES (Neutral Surface with Electric Blue Active States) */}
      {/* ========================================================================= */}
      <section className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2" id="categories">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-kb-black">Popular Categories</h2>
            <p className="text-xs text-kb-slate mt-1">Browse authentic garments hand-selected for our Kalwaral store</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-pill text-xs font-semibold px-4 py-2 rounded-kb-pill transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-kb-blue border-kb-blue text-white shadow-sm'
                    : 'bg-white border-[#E8EAF0] text-kb-black hover:border-kb-blue hover:text-kb-blue'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NEW ARRIVALS & BEST SELLERS (Pure White 55%, Blue CTAs 10%, Gold 3%)   */}
      {/* ========================================================================= */}
      <section className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="shop">
        <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const isWishlisted = wishlist.includes(product.productId);
            const imageSrc = product.images?.[0]?.data || '';
            const isMeter = product.isUnstitched || product.unitType === 'METER';

            return (
              <article
                key={product.id}
                className="group select-none bg-white/95 backdrop-blur-xs border border-slate-200/80 hover:border-kb-blue/60 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(52,120,246,0.14),0_6px_20px_rgba(0,0,0,0.06)] hover:ring-2 hover:ring-kb-blue/20 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Subtle light colored line animated on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-kb-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div>
                  {/* Image Container with Consistent Aspect Ratio */}
                  <Link href={`/products/${product.productId}`} className="block relative aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden mb-4">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-neutral-400">
                        KB
                      </div>
                    )}

                    {/* Small Champagne Gold Badges for Genuine Provenance */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="bg-white/95 backdrop-blur-sm text-kb-black text-[10px] font-bold px-2 py-0.5 rounded-kb-pill border border-[#E8EAF0] shadow-2xs">
                        {product.tags[0] || 'Handcrafted'}
                      </span>
                      {product.brand && product.brand !== 'KB FASHIONS' && (
                        <span className="bg-kb-black text-kb-gold text-[9px] font-bold px-2 py-0.5 rounded-kb-pill border border-kb-gold/30">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 border border-[#E8EAF0] flex items-center justify-center text-xs hover:scale-110 transition-transform shadow-xs"
                      title="Wishlist"
                    >
                      {isWishlisted ? '♥' : '♡'}
                    </button>
                  </Link>

                  {/* Origin Tag */}
                  <div className="flex items-center gap-1.5 text-[10px] text-kb-slate font-medium mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-kb-gold"></span>
                    <span>{product.origin}</span>
                  </div>

                  <Link href={`/products/${product.productId}`}>
                    <h3 className="font-semibold text-sm text-kb-black group-hover:text-kb-blue transition-colors line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-kb-slate line-clamp-2 mb-3 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8EAF0] flex items-center justify-between">
                  <div>
                    {isMeter ? (
                      <div>
                        <span className="text-base font-bold text-kb-black">₹{product.pricePerMeter || product.price}</span>
                        <span className="text-xs text-kb-slate font-medium ml-1">/ Meter</span>
                        <span className="block text-[9px] text-kb-slate">Custom tailor cut</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-base font-bold text-kb-black">₹{product.price}</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-kb-slate line-through ml-2">₹{product.compareAtPrice}</span>
                        )}
                        <span className="block text-[9px] text-kb-slate">Net retail price</span>
                      </div>
                    )}
                  </div>

                  {isMeter ? (
                    <Link
                      href={`/products/${product.productId}`}
                      className="bg-kb-blue hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-kb-pill transition-all"
                    >
                      Choose Cut →
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => quickAddToBag(product, e)}
                      className="bg-kb-blue hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-kb-pill transition-all shadow-xs"
                    >
                      + Add to Bag
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CURATED COLLECTIONS: WEDDING & TRENDING FASHION                        */}
      {/* ========================================================================= */}
      <section className="bg-neutral-50 border-t border-b border-[#E8EAF0] py-16">
        <div className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-kb-gold uppercase tracking-wider bg-kb-gold/10 px-3 py-1 rounded-full border border-kb-gold/20">
                Ancestral Wedding Registry
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-kb-black mt-2">
                Ceremonial &amp; Festive Collection
              </h2>
              <p className="text-xs text-kb-slate mt-1 max-w-xl">
                Gadwal silk sarees, Arvind unstitched safari suit lengths, and pure cotton festive dhotis prepared specifically for weddings and family celebrations.
              </p>
            </div>
            <Link
              href="/search?category=Sarees"
              className="text-xs font-semibold text-kb-blue hover:underline flex items-center gap-1"
            >
              Browse All Ceremonial Wear →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weddingCollection.map(product => {
              const imageSrc = product.images?.[0]?.data || '';
              return (
                <div key={product.id} className="bg-white border border-[#E8EAF0] rounded-kb-card p-4 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <Link href={`/products/${product.productId}`} className="block relative aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden mb-3">
                      {imageSrc ? (
                        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-neutral-400">KB</div>
                      )}
                      <span className="absolute top-2 left-2 bg-kb-black text-kb-gold text-[9px] font-bold px-2 py-0.5 rounded-kb-pill border border-kb-gold/30">
                        {product.brand || 'Handloom'}
                      </span>
                    </Link>
                    <h3 className="font-semibold text-sm text-kb-black line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-kb-slate line-clamp-1 mt-0.5">{product.fabric || 'Pure Cotton & Silk'}</p>
                  </div>
                  <div className="pt-3 border-t border-[#E8EAF0] flex items-center justify-between mt-3">
                    <span className="font-bold text-sm text-kb-black">₹{product.price}</span>
                    <Link
                      href={`/products/${product.productId}`}
                      className="text-xs font-semibold text-kb-blue hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CUSTOMER TRUST, DELIVERY, RETURNS & GST EXEMPTION                     */}
      {/* ========================================================================= */}
      <section className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-kb-black uppercase tracking-wider bg-neutral-100 px-3 py-1 rounded-full border border-[#E8EAF0]">
            Transparent Commerce
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-kb-black mt-3">
            Why Patrons Choose KB Fashions
          </h2>
          <p className="text-xs text-kb-slate mt-2">
            No synthetic blends, no hidden taxes, and genuine village hospitality backed by full tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E8EAF0] p-6 rounded-kb-card text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl mx-auto text-kb-black">
              📜
            </div>
            <h3 className="font-bold text-sm text-kb-black">GST Exempted Retail</h3>
            <p className="text-xs text-kb-slate leading-relaxed">
              We operate under Section 23 of the CGST Act. Every price is a net retail price with official Bills of Supply and zero tax markup.
            </p>
          </div>

          <div className="bg-white border border-[#E8EAF0] p-6 rounded-kb-card text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl mx-auto text-kb-black">
              🚚
            </div>
            <h3 className="font-bold text-sm text-kb-black">Stage-by-Stage Tracking</h3>
            <p className="text-xs text-kb-slate leading-relaxed">
              From handloom folding in Kalwaral to courier dispatch, monitor your shipment through every checkpoint in real-time.
            </p>
          </div>

          <div className="bg-white border border-[#E8EAF0] p-6 rounded-kb-card text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl mx-auto text-kb-black">
              🧵
            </div>
            <h3 className="font-bold text-sm text-kb-black">Authentic Fabrics</h3>
            <p className="text-xs text-kb-slate leading-relaxed">
              Direct ancestral weavers for Gadwal sarees, Raymond suitings, Arvind shirtings, and 100% skin-safe village cottons.
            </p>
          </div>

          <div className="bg-white border border-[#E8EAF0] p-6 rounded-kb-card text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl mx-auto text-kb-black">
              📞
            </div>
            <h3 className="font-bold text-sm text-kb-black">Direct Village Support</h3>
            <p className="text-xs text-kb-slate leading-relaxed">
              Call us at +91 7989768200 or open a ticket at our{' '}
              <Link href="/support" className="text-kb-blue font-semibold hover:underline">
                Online Support Desk →
              </Link>
            </p>
          </div>
        </div>

        {/* Quality Chart */}
        <div className="mt-12 bg-white p-6 rounded-kb-card border border-[#E8EAF0] shadow-xs">
          <div className="text-center mb-6">
            <h3 className="font-bold text-sm text-kb-black">Independent Patron Satisfaction Index</h3>
            <p className="text-xs text-kb-slate">Metrics compiled from 20 years of Kalwaral community patronage</p>
          </div>
          <div className="h-64">
            <canvas ref={chartCanvasRef}></canvas>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. GENUINE CUSTOMER REVIEWS                                              */}
      {/* ========================================================================= */}
      <section className="bg-neutral-50 border-t border-b border-[#E8EAF0] py-16">
        <div className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-kb-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Community Voices
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-kb-black mt-2">
              Loved by Generations Across Telangana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-kb-card border border-[#E8EAF0] space-y-3 shadow-xs">
              <div className="flex text-kb-gold text-xs">★★★★★</div>
              <p className="text-xs text-kb-slate leading-relaxed italic">
                “We have been purchasing wedding sarees and dhoti sets from KB Fashions in Kalwaral for two decades. The Gadwal silk quality and zari border work are heirloom level.”
              </p>
              <div className="pt-2 border-t border-[#E8EAF0] flex items-center justify-between text-xs">
                <strong className="text-kb-black">Rajesham Goud</strong>
                <span className="text-kb-slate text-[11px]">Kamareddy, Telangana</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-kb-card border border-[#E8EAF0] space-y-3 shadow-xs">
              <div className="flex text-kb-gold text-xs">★★★★★</div>
              <p className="text-xs text-kb-slate leading-relaxed italic">
                “Ordering custom meter cuts for Raymond and Arvind suiting was effortless. The precise meter cuts and delivery to Hyderabad took just 2 days. Village honesty at its best.”
              </p>
              <div className="pt-2 border-t border-[#E8EAF0] flex items-center justify-between text-xs">
                <strong className="text-kb-black">K. Srinivas Rao</strong>
                <span className="text-kb-slate text-[11px]">Hyderabad</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-kb-card border border-[#E8EAF0] space-y-3 shadow-xs">
              <div className="flex text-kb-gold text-xs">★★★★★</div>
              <p className="text-xs text-kb-slate leading-relaxed italic">
                “KB Shopmate AI understood my Telugu query instantly and suggested the exact Gadwal saree within my ₹1,500 budget. Highly recommended shopping experience!”
              </p>
              <div className="pt-2 border-t border-[#E8EAF0] flex items-center justify-between text-xs">
                <strong className="text-kb-black">Laxmi Prasanna</strong>
                <span className="text-kb-slate text-[11px]">Nizamabad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. NEWSLETTER & MARKETING SUBSCRIPTION                                   */}
      {/* ========================================================================= */}
      <section className="max-w-kb-content mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-kb-black text-white rounded-kb-panel p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono text-kb-gold uppercase tracking-wider font-semibold">
            Stay Connected with Kalwaral Handlooms
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Subscribe for Festive Weave Announcements
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Receive exclusive updates on new Gadwal loom batches, seasonal suiting cuts, and festive discounts directly from our village artisans.
          </p>

          {newsletterSubscribed ? (
            <div className="p-3 bg-neutral-900 border border-kb-gold/40 text-kb-gold text-xs font-semibold rounded-kb-pill inline-block">
              ✓ Thank you! You are subscribed to KB Fashions seasonal updates.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  setNewsletterSubscribed(true);
                  showModal({
                    type: 'success',
                    title: 'Subscribed to Handloom Weaves',
                    message: `✓ Thank you! ${newsletterEmail} is now subscribed to KB Fashions seasonal announcements and festive weaver discounts.`,
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
                className="flex-1 px-4 py-3 rounded-kb-pill bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-kb-blue"
              />
              <button
                type="submit"
                className="bg-kb-blue hover:bg-blue-600 text-white text-xs font-semibold px-6 py-3 rounded-kb-pill transition-all"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-neutral-400 pt-2">
            No spam. Only authentic handloom announcements. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
