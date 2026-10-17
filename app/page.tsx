"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [store, setStore] = useState<any>({
    brandName: "KB",
    officialName: "KB FASHIONS",
    village: "Kalwaral",
    mandal: "Sadasivanagar",
    district: "Kamareddy",
    state: "Telangana",
    contactPhone: "+91 7989768200",
  });
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchStoreSettings();
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
    let updated: any[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kb_wishlist');
      const currentList: any[] = stored ? JSON.parse(stored) : [];
      const exists = currentList.some(p => (p.productId || p.id) === product.productId);
      if (exists) {
        updated = currentList.filter(p => (p.productId || p.id) !== product.productId);
      } else {
        updated = [...currentList, product];
      }
      localStorage.setItem('kb_wishlist', JSON.stringify(updated));
      setWishlist(updated.map(p => p.productId || p.id));
    }
  };

  const quickAddToBag = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          name: product.name,
          price: product.price,
          size: product.sizes[0] || 'M',
        })
      });
      setAddedMessage(`✓ Added "${product.name}" to bag!`);
      setTimeout(() => setAddedMessage(null), 3000);
    } catch (e) {}
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
            label: 'Village Customer Rating (%)',
            data: [99, 97, 98, 96, 100],
            backgroundColor: '#111111',
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
              grid: { color: '#e8e8e8' }
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
    'Blouse & Matching',
    'Dhotis & Towels',
    'Inners & Essentials'
  ];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => {
        const cat = activeCategory.toLowerCase();
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

  return (
    <div>
      {/* Toast Alert */}
      {addedMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-kb-pill text-xs font-bold shadow-2xl flex items-center gap-3 animate-bounce">
          <span>{addedMessage}</span>
          <Link href="/cart" className="underline text-emerald-400">View Bag →</Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-kbBlack text-white py-16 md:py-24 border-b border-neutral-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-kb-pill bg-neutral-900 border border-neutral-700 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>20 Years in Kalwaral Village, Telangana • Traditional Occupation</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]">
              Better Clothes.<br />Better Prices.
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Welcome to <strong className="text-white">{store.officialName}</strong>. Coming online after 20 years of serving our village community in Kalwaral (Kamareddy, Telangana). Pure handspun cottons, traditional ceremonial sets, and honest everyday wear at uninflated village prices.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/search?category=All"
                className="bg-white text-black font-bold text-xs px-6 py-3.5 rounded-kb-pill hover:bg-neutral-200 transition-all flex items-center gap-2"
              >
                Explore Full Collection →
              </Link>
              <Link
                href="/about"
                className="border border-neutral-700 hover:border-white text-white font-semibold text-xs px-6 py-3.5 rounded-kb-pill transition-all"
              >
                Read Our Village Story
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-xs text-neutral-400">
              <div>
                <strong className="block text-white text-lg font-extrabold">2006–2026</strong>
                <span>20 Years Serving Patrons</span>
              </div>
              <div>
                <strong className="block text-white text-lg font-extrabold">100% Cotton & Linen</strong>
                <span>Skin-friendly Traditional Weave</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <strong className="block text-emerald-400 text-lg font-extrabold">GST Exempted</strong>
                <span>Zero Tax Markup on Retail Bills</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="shop">
        {/* Category Filter Pills */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-kbBlack">Authentic Collections</h2>
            <p className="text-xs text-neutral-500 mt-1">Direct from Kalwaral shop to your doorstep</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-pill text-xs font-semibold px-4 py-2 rounded-kb-pill transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-kbBlack text-white shadow-sm'
                    : 'bg-kbLight text-neutral-600 hover:text-black hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const isWishlisted = wishlist.includes(product.productId);
            const imageSrc = product.images?.[0]?.data || '';

            return (
              <article
                key={product.id}
                className="group select-none bg-white border border-kbBorder hover:border-black rounded-kb-md p-4 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Direct Link to Dedicated Product Page */}
                  <Link href={`/products/${product.productId}`} className="block relative aspect-[4/5] bg-kbCardBg rounded-kb-sm overflow-hidden mb-4">
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

                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="bg-white/95 backdrop-blur-sm text-kbBlack text-[10px] font-bold px-2 py-0.5 rounded-kb-pill border border-kbBorder">
                        {product.tags[0] || 'Handcrafted'}
                      </span>
                      {product.brand && product.brand !== 'KB FASHIONS' && (
                        <span className="bg-neutral-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-kb-pill">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 border border-kbBorder flex items-center justify-center text-xs hover:scale-110 transition-transform shadow-sm"
                      title="Wishlist"
                    >
                      {isWishlisted ? '♥' : '♡'}
                    </button>
                  </Link>

                  {/* Origin & Details */}
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{product.origin}</span>
                  </div>

                  <Link href={`/products/${product.productId}`}>
                    <h3 className="font-bold text-sm text-neutral-900 group-hover:underline line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-kbBorder flex items-center justify-between">
                  <div>
                    {product.isUnstitched || product.unitType === 'METER' ? (
                      <div>
                        <span className="text-base font-extrabold text-black">₹{product.pricePerMeter || product.price}</span>
                        <span className="text-xs text-amber-900 font-bold ml-1">/ Meter</span>
                        <span className="block text-[9px] text-neutral-400">Custom tailor cuts</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-base font-extrabold text-black">₹{product.price}</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-neutral-400 line-through ml-2">₹{product.compareAtPrice}</span>
                        )}
                        <span className="block text-[9px] text-neutral-400">Net retail price</span>
                      </div>
                    )}
                  </div>

                  {product.isUnstitched || product.unitType === 'METER' ? (
                    <Link
                      href={`/products/${product.productId}`}
                      className="bg-amber-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-kb-pill transition-all"
                    >
                      Choose Cut →
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => quickAddToBag(product, e)}
                      className="bg-black text-white hover:bg-neutral-800 text-xs font-bold px-3.5 py-2 rounded-kb-pill transition-all"
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

      {/* Customer Trust & Ratings Section */}
      <section className="bg-kbSurfaceAlt border-t border-b border-kbBorder py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center mb-10">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
              Customer Loyalty & Craftsmanship
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-3">20 Years of Village Trust</h2>
            <p className="text-xs text-neutral-500 mt-2">
              Feedback gathered from patrons in Kalwaral, Kamareddy, and patrons who buy from our shop across India.
            </p>
          </div>

          <div className="chart-container bg-white p-4 rounded-kb-lg border border-kbBorder shadow-sm">
            <canvas ref={chartCanvasRef}></canvas>
          </div>
        </div>
      </section>

      {/* Ancestral Village Heritage Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-kbBlack text-white rounded-kb-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
              Tradition Meets Modern Convenience
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Direct from our family in Kalwaral to your doorstep.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              We pack every shipment carefully with personal inspections. Enjoy express delivery across India with full stage-by-stage consignment tracking.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/about"
              className="bg-white text-black font-bold text-xs px-6 py-3.5 rounded-kb-pill hover:bg-neutral-200 text-center"
            >
              Learn More About Us
            </Link>
            <Link
              href="/contact"
              className="border border-neutral-700 text-white font-bold text-xs px-6 py-3.5 rounded-kb-pill hover:border-white text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
