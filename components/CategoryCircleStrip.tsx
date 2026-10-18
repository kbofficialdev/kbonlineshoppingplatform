"use client";

import React from 'react';
import Link from 'next/link';

export interface CategoryCircleItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

const DEFAULT_CATEGORIES: CategoryCircleItem[] = [
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'Sarees',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'kurtis',
    name: 'Kurtis',
    slug: "Women's Wear",
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    slug: 'Sarees',
    imageUrl: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'mens-wear',
    name: "Men's Wear",
    slug: "Men's Unstitched Fabrics",
    imageUrl: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'kids-wear',
    name: 'Kids Wear',
    slug: 'Inners & Essentials',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'Dhotis & Towels',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'festive',
    name: 'Festive',
    slug: 'Sarees',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    slug: 'All',
    imageUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
  },
];

export default function CategoryCircleStrip({
  categories = DEFAULT_CATEGORIES,
}: {
  categories?: CategoryCircleItem[];
}) {
  return (
    <div className="w-full bg-white py-4 sm:py-6 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${encodeURIComponent(cat.slug)}`}
              className="flex flex-col items-center group shrink-0 select-none cursor-pointer"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-100 via-orange-50 to-amber-200 border border-amber-200/60 shadow-2xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-neutral-800 group-hover:text-blue-600 transition-colors text-center whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

