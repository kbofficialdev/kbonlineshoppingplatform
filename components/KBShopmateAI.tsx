"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useModalAlert } from '@/components/ModalContext';
import { authFetch } from '@/lib/clientAuth';

interface ProductItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  category: string;
  brand?: string;
  images: { data: string }[];
}

export default function KBShopmateAI({ embedded = false }: { embedded?: boolean }) {
  const { showModal } = useModalAlert();
  const [state, setState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'RESULTS' | 'NO_RESULTS'>('IDLE');
  const [query, setQuery] = useState<string>('');
  const [activeSpeechText, setActiveSpeechText] = useState<string>('నాకు ₹1000 లోపు మంచి చీర చూపించు (Show me a good saree under ₹1,000)');
  const [aiMessage, setAiMessage] = useState<string>("నమస్కారం! I'm KB Shopmate AI. How can I help you find garments today? (మీకు ఏ బట్టలు కావాలి?)");
  const [recommendedProducts, setRecommendedProducts] = useState<ProductItem[]>([]);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [chosenMessage, setChosenMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/catalog/products');
      const data = await res.json();
      if (data?.products) {
        setAllProducts(data.products);
      }
    } catch (e) {}
  };

  const handleSimulateVoice = (sampleText: string) => {
    setQuery(sampleText);
    setState('LISTENING');
    setAiMessage('Listening to your voice... (వింటున్నాను...)');

    setTimeout(() => {
      setState('PROCESSING');
      setAiMessage('Searching our Kalwaral store catalog for verified garments within your budget...');
      setTimeout(() => {
        executeSearch(sampleText);
      }, 1000);
    }, 1800);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setState('PROCESSING');
    setAiMessage('Checking authentic store inventory...');
    setTimeout(() => {
      executeSearch(query.trim());
    }, 700);
  };

  const executeSearch = (searchText: string) => {
    const lower = searchText.toLowerCase();
    let matches: ProductItem[] = [];

    // Parse budget if mentioned (e.g. 1000)
    let maxBudget = 999999;
    const numMatch = searchText.match(/(\d+)/);
    if (numMatch) {
      maxBudget = parseInt(numMatch[1], 10);
    }

    if (lower.includes('చీర') || lower.includes('saree')) {
      matches = allProducts.filter(p => (p.category === 'Sarees' || p.name.toLowerCase().includes('saree')) && p.price <= maxBudget);
    } else if (lower.includes('pant') || lower.includes('shirt') || lower.includes('raymond') || lower.includes('unstitched') || lower.includes('మగ')) {
      matches = allProducts.filter(p => p.category.includes('Men') && p.price <= maxBudget);
    } else if (lower.includes('banian') || lower.includes('inner') || lower.includes('బనియన్')) {
      matches = allProducts.filter(p => (p.name.toLowerCase().includes('banian') || p.category.includes('Inner')) && p.price <= maxBudget);
    } else {
      matches = allProducts.filter(p => p.price <= maxBudget);
    }

    // Limit to top 3 verified results per specification
    const topThree = matches.slice(0, 3);

    if (topThree.length > 0) {
      setRecommendedProducts(topThree);
      setState('RESULTS');
      setAiMessage(`I found ${topThree.length} verified handloom options matching your request within ₹${maxBudget}:`);
    } else {
      setRecommendedProducts([]);
      setState('NO_RESULTS');
      setAiMessage(`We couldn't find items under ₹${maxBudget}. Would you like to check nearby collections or contact our Kalwaral store directly?`);
    }
  };

  const handleChooseProduct = async (product: ProductItem) => {
    try {
      const res = await authFetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId || product.id,
          name: product.name,
          price: product.price,
          size: 'M',
          qty: 1
        })
      });
      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        showModal({
          type: 'auth',
          title: 'Sign In Required for KB AI Shopping',
          message: 'An active account session is required to add items suggested by KB Shopmate AI to your shopping bag or place orders.',
          primaryBtn: {
            text: 'Sign In to Account →',
            href: '/auth/signin?redirect=%2Fai&reason=auth_required',
          },
          secondaryBtn: {
            text: 'Create New Account',
            href: '/auth/signup?redirect=%2Fai',
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
        title: 'Item Added to Shopping Bag',
        message: `✓ "${product.name}" has been added to your shopping bag via KB Shopmate AI!`,
        primaryBtn: {
          text: 'View Shopping Bag & Checkout →',
          href: '/cart',
        },
        secondaryBtn: {
          text: 'Continue AI Shopping',
        },
      });
    } catch (e: any) {
      showModal({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the store servers. Please check your internet connection.',
      });
    }
  };

  return (
    <div className={`bg-kb-white border border-kb-gray rounded-kb-panel p-6 sm:p-8 space-y-6 shadow-sm ${embedded ? '' : 'max-w-3xl mx-auto my-8'}`}>
      {/* AI Header Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-kb-gray pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full kb-ai-gradient flex items-center justify-center text-white text-lg font-bold shadow-sm">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-kb-black">KB Shopmate AI</h2>
              <span className="bg-kb-violet/10 text-kb-violet text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Personal Shopping Assistant
              </span>
            </div>
            <p className="text-xs text-kb-slate">
              Multilingual Voice &amp; Text • Telugu (తెలుగు) &amp; English
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-kb-slate">Store:</span>
          <span className="text-[11px] font-bold text-kb-black bg-neutral-100 px-2 py-0.5 rounded">
            Kalwaral Live Inventory
          </span>
        </div>
      </div>

      {chosenMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-kb-success text-xs p-3 rounded-kb-sm font-semibold flex items-center justify-between">
          <span>{chosenMessage}</span>
          <Link href="/cart" className="underline font-bold text-kb-blue">View Bag →</Link>
        </div>
      )}

      {/* AI Chat Bubble */}
      <div className="bg-neutral-50 border border-kb-gray p-4 rounded-kb-card space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-kb-violet">
          <span>✦ Shopmate AI:</span>
        </div>
        <p className="text-xs text-kb-black leading-relaxed font-medium">
          {aiMessage}
        </p>
      </div>

      {/* Interactive Microphone & Voice Area */}
      <div className="p-6 bg-gradient-to-b from-neutral-50 to-white rounded-kb-card border border-kb-gray text-center space-y-4">
        {state === 'IDLE' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSimulateVoice("నాకు ₹1000 లోపు మంచి చీర చూపించు")}
              className="w-16 h-16 rounded-full kb-ai-gradient text-white flex items-center justify-center mx-auto text-2xl shadow-md hover:scale-105 active:scale-95 transition-all"
              title="Tap to speak in Telugu or English"
            >
              🎤
            </button>
            <div className="text-xs font-semibold text-kb-black">Tap microphone to speak</div>
            <p className="text-[11px] text-kb-slate">
              Try saying: <button type="button" onClick={() => handleSimulateVoice("నాకు ₹1000 లోపు మంచి చీర చూపించు")} className="text-kb-blue underline font-medium">“నాకు ₹1000 లోపు మంచి చీర చూపించు”</button> (Show me a good saree under ₹1,000)
            </p>
          </div>
        )}

        {state === 'LISTENING' && (
          <div className="space-y-3 py-2">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <span className="absolute w-full h-full rounded-full bg-kb-violet/20 animate-ping"></span>
              <button
                type="button"
                onClick={() => setState('IDLE')}
                className="w-16 h-16 rounded-full bg-kb-violet text-white flex items-center justify-center text-2xl shadow-lg relative z-10"
              >
                ⏹
              </button>
            </div>
            <div className="text-xs font-bold text-kb-violet animate-pulse">
              Listening to voice... (వింటున్నాను)
            </div>
            <p className="text-[11px] text-kb-slate italic">
              &quot;{query}&quot;
            </p>
          </div>
        )}

        {state === 'PROCESSING' && (
          <div className="space-y-3 py-3">
            <div className="w-8 h-8 border-2 border-kb-violet border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-xs font-semibold text-kb-black">Searching Kalwaral store inventory...</div>
          </div>
        )}

        {/* Text Input Fallback (Voice is NEVER mandatory) */}
        <form onSubmit={handleTextSubmit} className="flex gap-2 max-w-md mx-auto pt-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Or type here (e.g. Gadwal Saree, Raymond, ₹1000)..."
            className="flex-1 px-3.5 py-2.5 rounded-kb-pill border border-kb-gray text-xs text-kb-black bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
          />
          <button
            type="submit"
            className="bg-kb-blue text-white text-xs font-semibold px-5 py-2.5 rounded-kb-pill hover:bg-blue-600 transition-all shadow-sm"
          >
            Ask AI
          </button>
        </form>
      </div>

      {/* Suggested Voice Queries Pills */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-kb-slate font-semibold">Quick Queries:</span>
        {[
          { label: '🥻 ₹1000 లోపు చీర (Saree under ₹1k)', q: 'నాకు ₹1000 లోపు మంచి చీర చూపించు' },
          { label: '✂ Raymond Unstitched Shirting', q: 'Raymond unstitched shirt' },
          { label: '🩲 90cm Banian Pack', q: '90cm cotton banian pack' },
          { label: '🪙 Handloom Dhoti', q: 'Traditional Dhoti Pancha' },
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSimulateVoice(item.q)}
            className="bg-neutral-100 hover:bg-neutral-200 text-kb-black font-medium px-2.5 py-1 rounded-kb-pill border border-kb-gray transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Up to 3 Verified Product Results Area */}
      {state === 'RESULTS' && recommendedProducts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-kb-black">
            <span>Verified Recommendations ({recommendedProducts.length}):</span>
            <span className="text-kb-success text-[11px]">✓ Real Store Inventory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedProducts.map(prod => (
              <div
                key={prod.id || prod.productId}
                className="bg-white border border-kb-gray hover:border-kb-blue rounded-kb-card p-3 flex flex-col justify-between transition-all shadow-sm"
              >
                <div>
                  <div className="aspect-[4/5] bg-neutral-100 rounded-kb-sm overflow-hidden mb-2.5 relative">
                    {prod.images?.[0]?.data ? (
                      <img src={prod.images[0].data} alt={prod.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-neutral-300">KB</div>
                    )}
                    <span className="absolute top-2 left-2 bg-white/95 text-[9px] font-bold px-2 py-0.5 rounded-kb-pill border border-kb-gray">
                      {prod.category}
                    </span>
                  </div>

                  <Link href={`/products/${prod.productId || prod.id}`} className="font-bold text-xs text-kb-black hover:underline line-clamp-1">
                    {prod.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-kb-black">₹{prod.price}</span>
                    <span className="text-[10px] text-kb-slate">Village Direct</span>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-kb-gray flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChooseProduct(prod)}
                    className="flex-1 bg-kb-blue text-white text-xs font-semibold py-2 rounded-kb-pill hover:bg-blue-600 transition-all text-center"
                  >
                    Choose This
                  </button>
                  <Link
                    href={`/products/${prod.productId || prod.id}`}
                    className="px-2.5 py-2 border border-kb-gray rounded-kb-pill text-xs font-semibold text-kb-slate hover:text-kb-black"
                    title="View details"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Fallback & Human Support Handover */}
      {state === 'NO_RESULTS' && (
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-kb-card space-y-3 text-xs">
          <div className="font-bold text-amber-950 flex items-center gap-1.5">
            <span>ℹ️</span>
            <span>Looking for custom tailoring or specific sarees?</span>
          </div>
          <p className="text-amber-900 leading-relaxed text-[11px]">
            In our 20-year Kalwaral village shop, we stock hundreds of unstitched cuts and festive sarees. If your exact combination isn&apos;t found online, speak directly to our village shop staff:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="tel:+917989768200"
              className="bg-amber-900 text-white font-bold px-4 py-2 rounded-kb-pill hover:bg-black transition-all text-xs"
            >
              📞 Call Shop: +91 7989768200
            </a>
            <Link
              href="/contact"
              className="text-amber-900 font-semibold underline text-xs"
            >
              View Shop Address in Kalwaral →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

