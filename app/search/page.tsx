"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<string>('featured');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());
      if (sort) params.set('sort', sort);

      const res = await fetch(`/api/catalog/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data?.products || []);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleQuickAdd = async (product: any) => {
    try {
      await authFetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId || product.id,
          name: product.name,
          price: product.price,
          size: product.sizes?.[0] || 'M',
        })
      });
      setToastMessage(`✓ Added "${product.name}" to bag!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {}
  };

  const categories = [
    'All',
    'Sarees',
    "Men's Unstitched",
    "Women's Wear",
    'Blouse & Matching',
    'Dhotis & Towels',
    'Inners & Essentials'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-kb-pill text-xs font-bold shadow-2xl flex items-center gap-3">
          <span>{toastMessage}</span>
          <Link href="/cart" className="underline text-emerald-400">View Bag →</Link>
        </div>
      )}

      {/* Page Title & Search Input */}
      <div className="border-b border-kbBorder pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-kbBlack mb-4">Search & Catalog</h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by garment name, fabric, or tag (e.g. Kurta, Linen, Dhoti)..."
            className="flex-1 px-4 py-3 rounded-kb-pill border border-kbBorder bg-kbLight text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white text-xs font-bold px-6 py-3 rounded-kb-pill hover:bg-neutral-800 transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-kb-pill transition-all cursor-pointer ${
                category === cat
                  ? 'bg-black text-white'
                  : 'bg-kbLight text-neutral-600 hover:text-black hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-semibold">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 rounded-kb-sm border border-kbBorder bg-white text-xs font-semibold focus:outline-none"
          >
            <option value="featured">Featured / Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Searching database...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-kbSurfaceAlt border border-kbBorder rounded-kb-lg p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="text-4xl">🔍</div>
          <h2 className="text-lg font-bold">No garments matched your search</h2>
          <p className="text-xs text-neutral-500">
            Try adjusting your search keywords or explore another collection category.
          </p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); }}
            className="mt-3 bg-black text-white text-xs font-bold px-5 py-2.5 rounded-full"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs text-neutral-500 mb-4 font-mono">
            Showing {products.length} authentic handcrafted garment{products.length > 1 ? 's' : ''}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => {
              const imageSrc = product.images?.[0]?.data || '';
              const prodId = product.productId || product.id;

              return (
                <article
                  key={prodId}
                  className="group bg-white/95 backdrop-blur-xs border border-slate-200/80 hover:border-kb-blue/60 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(52,120,246,0.14),0_6px_20px_rgba(0,0,0,0.06)] hover:ring-2 hover:ring-kb-blue/20 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-kb-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div>
                    <Link href={`/products/${prodId}`} className="block relative aspect-[4/5] bg-kbCardBg rounded-kb-sm overflow-hidden mb-3">
                      {imageSrc ? (
                        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-neutral-300">KB</div>
                      )}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                        <span className="bg-white/95 text-[10px] font-bold px-2 py-0.5 rounded-kb-pill border border-kbBorder">
                          {product.tags?.[0] || 'Handloom'}
                        </span>
                        {product.brand && product.brand !== 'KB FASHIONS' && (
                          <span className="bg-neutral-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-kb-pill">
                            {product.brand}
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="text-[10px] text-emerald-800 font-semibold mb-1">
                      {product.origin || 'Kalwaral, Telangana'}
                    </div>

                    <Link href={`/products/${prodId}`}>
                      <h3 className="font-bold text-sm text-neutral-900 hover:underline line-clamp-1 mb-1">
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
                          <span className="font-extrabold text-base text-black">₹{product.pricePerMeter || product.price}</span>
                          <span className="text-xs text-amber-900 font-bold ml-1">/ Meter</span>
                          <span className="block text-[9px] text-neutral-400">Custom tailor cuts</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-extrabold text-base text-black">₹{product.price}</span>
                          <span className="block text-[9px] text-neutral-400">Net retail price</span>
                        </div>
                      )}
                    </div>

                    {product.isUnstitched || product.unitType === 'METER' ? (
                      <Link
                        href={`/products/${prodId}`}
                        className="bg-amber-900 hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-kb-pill transition-all"
                      >
                        Choose Cut →
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="bg-black text-white hover:bg-neutral-800 text-xs font-bold px-3 py-2 rounded-kb-pill transition-all"
                      >
                        + Add to Bag
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-neutral-400">Loading catalog...</div>}>
      <SearchContent />
    </Suspense>
  );
}

