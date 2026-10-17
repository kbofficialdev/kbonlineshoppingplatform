"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface CategoryItem {
  id: string;
  name: string;
  nameTe: string;
  href: string;
  subtitle: string;
  badge?: string;
  iconSvg: React.ReactNode;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'sarees',
    name: 'Sarees',
    nameTe: 'చీరలు',
    href: '/search?category=Sarees',
    subtitle: 'Gadwal, Pattu, Nirma & Layered',
    badge: 'Popular',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 4c4 0 7 3 7 7v9H4V4z" />
        <path d="M11 11c3 0 6 2 9 5v4h-9v-9z" />
        <path d="M4 8h7" />
        <path d="M4 12h7" />
        <path d="M4 16h7" />
        <circle cx="16" cy="7" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'mens-unstitched',
    name: "Men's Fabrics",
    nameTe: 'పురుషుల క్లాత్స్',
    href: '/search?category=Men',
    subtitle: 'Raymond Suiting & Meter Cuts',
    badge: 'Unstitched',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="M3 10h18" />
        <path d="M7 6v12" />
        <path d="M11 10v4" />
        <path d="M15 10v4" />
      </svg>
    ),
  },
  {
    id: 'womens-wear',
    name: "Women's Wear",
    nameTe: 'లేడీస్ డ్రెస్సెస్',
    href: '/search?category=Women',
    subtitle: 'Tops, Leggings & Blouse Pieces',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6 3l3 2 3-2 3 2 3-2v5l-2 3v10H8V11L6 8V3z" />
        <path d="M9 5v4" />
        <path d="M15 5v4" />
      </svg>
    ),
  },
  {
    id: 'gadwal-sarees',
    name: 'Gadwal Sarees',
    nameTe: 'గద్వాల చీరలు',
    href: '/search?category=Sarees&work=gadwal',
    subtitle: 'Kuttu Temple Border for Elders & Puja',
    badge: 'Heritage',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2L4 9v11h16V9L12 2z" />
        <path d="M12 7l4 4-4 4-4-4 4-4z" />
        <path d="M4 17h16" />
      </svg>
    ),
  },
  {
    id: 'dhotis-towels',
    name: 'Dhotis & Towels',
    nameTe: 'ధోవతులు & తువ్వాళ్లు',
    href: '/search?category=Men&type=DHOTI_TOWEL',
    subtitle: 'Traditional Cotton Panchas & Towels',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M5 4h14v16H5z" />
        <path d="M9 4v16" />
        <path d="M5 9h14" />
        <path d="M5 14h14" />
      </svg>
    ),
  },
  {
    id: 'essentials',
    name: 'Banians & Inners',
    nameTe: 'బనియన్లు & ఇన్నర్స్',
    href: '/search?category=Men&type=INNER_ESSENTIAL',
    subtitle: 'Combed Cotton (80-100cm) & Kerchiefs',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M7 4h10v3c0 2-2 4-5 4s-5-2-5-4V4z" />
        <path d="M5 7v13h14V7" />
        <path d="M5 7L2 9l2 3 1-1" />
        <path d="M19 7l3 2-2 3-1-1" />
      </svg>
    ),
  },
  {
    id: 'matching-designing',
    name: 'Matching & Blouses',
    nameTe: 'మ్యాచింగ్ క్లాత్స్',
    href: '/search?category=Women&type=BLOUSE_PIECE',
    subtitle: 'Special Designing & Fall-Pico Pieces',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="M7.5 7.5l9 9" />
      </svg>
    ),
  },
];

export default function CategoryStrip() {
  const pathname = usePathname();

  return (
    <div
      id="kb-sub-navbar-categories"
      className="w-full bg-white border-b border-slate-200/90 shadow-2xs select-none"
    >
      <div className="max-w-kb-content mx-auto px-2 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2.5 scrollbar-none">
          {CATEGORIES_DATA.map((cat) => {
            const isActive = pathname.includes(cat.href) || (cat.href.includes('category=') && pathname.includes(cat.href.split('?')[1]));
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 border ${
                  isActive
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-slate-200 hover:border-black'
                }`}
              >
                <div className={`p-1 rounded-full transition-colors ${
                  isActive ? 'text-white' : 'text-neutral-700 group-hover:text-black'
                }`}>
                  {cat.iconSvg}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold tracking-tight">{cat.name}</span>
                    {cat.badge && (
                      <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-medium hidden md:inline truncate max-w-[130px] ${
                    isActive ? 'text-neutral-300' : 'text-neutral-500'
                  }`}>
                    {cat.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
