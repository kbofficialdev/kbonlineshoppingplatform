"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/SkeletonPlaceholder';
import CircularContentLoader from '@/components/CircularContentLoader';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<string>('featured');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize with URL searchParams
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'All';
    const urlQ = searchParams.get('q') || searchParams.get('search') || '';
    setCategory(urlCat);
    setSearch(urlQ);
  }, [searchParams]);

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
      console.error('Error fetching catalog:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', newCat);
    router.push(`/search?${params.toString()}`);
  };

  const filterCategories = [
    { label: 'All', value: 'All' },
    { label: 'Sarees', value: 'Sarees' },
    { label: "Women's Wear", value: "Women's Wear" },
    { label: "Men's Wear", value: "Men's Unstitched Fabrics" },
    { label: 'Dhotis & Towels', value: 'Dhotis & Towels' },
    { label: 'Blouse & Matching', value: 'Blouse Pieces & Matching' },
    { label: 'Inners & Essentials', value: 'Inners & Essentials' },
  ];

  const getProductImage = (p: any) => {
    if (p.images && p.images.length > 0 && p.images[0].data) {
      return p.images[0].data;
    }
    return `/api/media/${p.productId || p.id}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Category / Search Header matching approved mockup */}
      <div className="pb-4 mb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-neutral-500 hover:text-neutral-900 transition-colors p-1 rounded-full hover:bg-slate-100"
              aria-label="Back to Home"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {category === 'All' ? 'Complete Collection' : category}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} available
              </p>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label htmlFor="catalog-sort" className="text-xs font-bold text-neutral-500">
              Sort by:
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-bold text-neutral-800 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Filter Pills Strip (Horizontal Scrollable matching mockup) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 pb-1">
          {filterCategories.map((item) => {
            const isActive = category === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleCategoryChange(item.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#3478F6] text-white shadow-xs'
                    : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, fabric, or color..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
          <button
            type="submit"
            className="bg-neutral-900 text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-black transition-all"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                const params = new URLSearchParams(searchParams.toString());
                params.delete('q');
                params.delete('search');
                router.push(`/search?${params.toString()}`);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-900 px-2"
            >
              Clear
            </button>
          )}
        </form>

      </div>

      {/* Product Grid Area */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5 pb-8">
          {products.map((p) => (
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
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 my-4">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-base font-bold text-neutral-900">No products found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            We couldn't find any items matching your selected category or search keywords.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory('All');
              setSearch('');
              router.push('/search');
            }}
            className="mt-4 bg-[#3478F6] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Bottom Loading Indicator for Progressive Fetching */}
      {isLoading && <CircularContentLoader message="Updating product catalog..." />}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8"><ProductGridSkeleton count={6} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
