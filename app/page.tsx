"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  productId: string;
  name: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  hsnCode: string;
  countryOfOrigin: string;
  isGovtVerifiedSeller: boolean;
  taxRatePercent: number;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  stockQuantity: number;
  manufacturerDetails: string;
  collection: string;
  fabricCare?: string;
  fitSizing?: string;
  returnPolicy?: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  hsnCode: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  shippingFee: number;
  total: number;
  appliedPromo: string | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sizeFilter, setSizeFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<number>(9999);
  const [sortFilter, setSortFilter] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    subtotal: 0,
    discountAmount: 0,
    discountPercent: 0,
    shippingFee: 99,
    total: 0,
    appliedPromo: null,
  });
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Modals & Drawers
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  // Checkout Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [custName, setCustName] = useState<string>('Rahul Sharma');
  const [custPhone, setCustPhone] = useState<string>('9876543210');
  const [custAddress, setCustAddress] = useState<string>('42, Fashion Avenue, Indiranagar');
  const [custPin, setCustPin] = useState<string>('560038');
  const [custCity, setCustCity] = useState<string>('Bengaluru');
  const [custState, setCustState] = useState<string>('Karnataka');
  const [isB2B, setIsB2B] = useState<boolean>(false);
  const [custGstin, setCustGstin] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Merchant & Admin Modals
  const [isMerchantLookupOpen, setIsMerchantLookupOpen] = useState<boolean>(false);
  const [merchantLookupInput, setMerchantLookupInput] = useState<string>('29AAAAA0000A1Z5');
  const [merchantLookupResult, setMerchantLookupResult] = useState<any>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Legal Modals
  const [activePolicyKey, setActivePolicyKey] = useState<string | null>(null);

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any>(null);

  // Load baseline data on mount
  useEffect(() => {
    fetchProducts();
    fetchCart();
    const storedWishlist = localStorage.getItem('kb_wishlist');
    if (storedWishlist) {
      try { setWishlist(JSON.parse(storedWishlist)); } catch (e) {}
    }
  }, []);

  // Keyboard accessibility: dismiss topmost modal/drawer on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (isSizeGuideOpen) {
          setIsSizeGuideOpen(false);
        } else if (activePolicyKey) {
          setActivePolicyKey(null);
        } else if (isAdminOpen) {
          setIsAdminOpen(false);
        } else if (isMerchantLookupOpen) {
          setIsMerchantLookupOpen(false);
        } else if (isCheckoutOpen) {
          setIsCheckoutOpen(false);
        } else if (selectedProduct) {
          setSelectedProduct(null);
        } else if (isBagOpen) {
          setIsBagOpen(false);
        } else if (isWishlistOpen) {
          setIsWishlistOpen(false);
        } else if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSizeGuideOpen, activePolicyKey, isAdminOpen, isMerchantLookupOpen, isCheckoutOpen, selectedProduct, isBagOpen, isWishlistOpen, isSearchOpen, isMobileMenuOpen]);

  // Initialize Canvas Chart.js
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
          labels: ['Fabric Softness', 'Fit Accuracy', 'Color Retention', 'Stitching Strength', 'Price-to-Value'],
          datasets: [{
            label: 'Positive Rating Score (%)',
            data: [98, 96, 95, 97, 99],
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
                label: (context: any) => ` Positive Rating: ${context.raw}%`
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

  // Fetch products from Next.js API
  async function fetchProducts() {
    try {
      const res = await fetch('/api/catalog/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    }
  }

  // Fetch cart from Next.js API
  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCartState(data);
    } catch (e) {
      console.error(e);
    }
  }

  // Add item to cart
  async function addToCart(product: Product, size: string) {
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          productId: product.productId,
          name: product.name,
          price: product.price,
          size: size || 'M',
          hsnCode: product.hsnCode,
        })
      });
      const data = await res.json();
      setCartState(data);
    } catch (e) {
      console.error(e);
    }
  }

  // Update item quantity in cart
  async function updateCartQty(productId: string, size: string, delta: number) {
    try {
      const res = await fetch(`/api/cart/items/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta, size })
      });
      const data = await res.json();
      setCartState(data);
    } catch (e) {
      console.error(e);
    }
  }

  // Apply promo code
  async function applyPromo() {
    if (!promoCodeInput.trim()) return;
    try {
      const res = await fetch('/api/cart/apply-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCodeInput })
      });
      const data = await res.json();
      if (data.success) {
        setCartState(data.cart);
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Failed to apply promo code");
    }
  }

  // Wishlist toggle
  function toggleWishlist(product: Product) {
    let updated: Product[];
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      updated = wishlist.filter(item => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('kb_wishlist', JSON.stringify(updated));
  }

  // PIN lookup
  async function handlePinChange(pin: string) {
    setCustPin(pin);
    if (pin.length === 6) {
      try {
        const res = await fetch(`/api/orders/lookup-pin/${pin}`);
        const data = await res.json();
        if (data.success) {
          setCustCity(data.city);
          setCustState(data.state);
        }
      } catch (e) {}
    }
  }

  // Place order
  async function handlePlaceOrder() {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: custName,
            phone: custPhone,
            streetAddress: custAddress,
            pinCode: custPin,
            city: custCity,
            state: custState,
            b2bGstin: isB2B ? custGstin : null,
          },
          paymentMethod,
        })
      });
      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.order);
        setCheckoutStep(3);
        fetchCart(); // cart was cleared on order placement
      } else {
        alert(data.error || "Order failed");
      }
    } catch (e) {
      alert("Error placing order");
    }
  }

  // Verify merchant lookup
  async function handleMerchantVerify() {
    if (!merchantLookupInput.trim()) return;
    try {
      const res = await fetch(`/api/merchants/verify/${encodeURIComponent(merchantLookupInput)}`);
      const data = await res.json();
      setMerchantLookupResult(data);
    } catch (e) {
      setMerchantLookupResult({ found: false, message: "Verification lookup failed" });
    }
  }

  // Refresh admin audit logs
  async function openAdmin() {
    setIsAdminOpen(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch (e) {}
  }

  // Trigger test refund
  async function handleTestRefund() {
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: placedOrder?.orderId || 'ORD-2026-1001',
          amount: 499,
          reason: 'Customer initiated statutory cancellation within SLA'
        })
      });
      const data = await res.json();
      alert(data.message);
      const updatedLogs = await fetch('/api/admin/audit-logs').then(r => r.json());
      setAuditLogs(updatedLogs.logs || []);
    } catch (e) {
      alert("Refund request failed");
    }
  }

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = (activeCategory === 'All') || (p.category === activeCategory) || (p.tags.includes(activeCategory));
    const matchesSize = (sizeFilter === 'All') || p.sizes.includes(sizeFilter);
    const matchesPrice = p.price <= priceFilter;
    const matchesSearch = !searchQuery || (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hsnCode.includes(searchQuery)
    );
    return matchesCat && matchesSize && matchesPrice && matchesSearch;
  });

  if (sortFilter === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortFilter === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortFilter === 'rating') filteredProducts.sort((a, b) => b.rating - a.rating);

  const totalCartCount = cartState.items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <>
      {/* STATUTORY TOP BAR */}
      <aside className="bg-neutral-900 text-neutral-300 text-[11px] py-1.5 px-4 text-center border-b border-white/10 hidden sm:block">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 100% Govt Verified Sellers
            </span>
            <span className="text-neutral-500">|</span>
            <span>Country of Origin: Made in India</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Free Express Delivery on orders over ₹999</span>
            <button onClick={() => setActivePolicyKey('grievance')} className="text-neutral-300 hover:text-white underline">
              Grievance Redressal
            </button>
            <button onClick={() => setIsMerchantLookupOpen(true)} className="text-emerald-400 hover:underline font-semibold">
              🔍 Verify Merchant
            </button>
          </div>
        </div>
      </aside>

      {/* GLOBAL FROSTED HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/5 transition-all duration-200">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 h-16 md:h-[72px] flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden touch-target flex items-center justify-center rounded-full border border-kbBorder hover:bg-kbLight transition-colors text-lg"
              aria-label="Open Mobile Menu"
            >
              ☰
            </button>
            <Link href="/" className="text-[25px] font-extrabold tracking-[-1.5px] select-none">
              KB<span className="font-normal text-kbBlack">.</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <a href="#shop" onClick={() => setActiveCategory('All')} className="hover:text-black transition-colors">Shop</a>
            <a href="#categories" className="hover:text-black transition-colors">Categories</a>
            <a href="#shop" onClick={() => setActiveCategory('New Arrivals')} className="hover:text-black transition-colors">New Arrivals</a>
            <a href="#shop" onClick={() => setActiveCategory('Offers')} className="hover:text-black transition-colors">Offers</a>
            <a href="#analytics" className="hover:text-black transition-colors">Quality Insights</a>
            <button onClick={() => setIsMerchantLookupOpen(true)} className="hover:text-black transition-colors flex items-center gap-1 text-emerald-800 font-semibold">
              <span>✓</span> Verify Merchant
            </button>
            <button onClick={openAdmin} className="hover:text-black transition-colors text-xs text-neutral-400 hover:text-black">
              Governance
            </button>
          </nav>

          {/* Nav Icons */}
          <div className="flex items-center gap-2">
            <button
              id="search-open-btn"
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full border border-kbBorder bg-white flex items-center justify-center text-base hover:bg-neutral-100 hover:-translate-y-0.5 transition-all"
              aria-label="Search"
            >
              ⌕
            </button>
            <button
              id="wishlist-open-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-10 h-10 rounded-full border border-kbBorder bg-white flex items-center justify-center text-base hover:bg-neutral-100 hover:-translate-y-0.5 transition-all"
              aria-label="Wishlist"
            >
              ♡
              {wishlist.length > 0 && (
                <span id="wishlist-badge" className="absolute -top-1 -right-1 bg-kbBlack text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              id="bag-open-btn"
              onClick={() => setIsBagOpen(true)}
              className="relative w-10 h-10 rounded-full border border-kbBorder bg-white flex items-center justify-center text-base hover:bg-neutral-100 hover:-translate-y-0.5 transition-all"
              aria-label="Shopping Bag"
            >
              🛍️
              <span id="bag-badge" className="absolute -top-1 -right-1 bg-kbBlack text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER */}
      <div id="mobile-drawer" className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-kbBorder">
              <div className="text-2xl font-extrabold tracking-tight">KB.</div>
              <button id="mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)} className="w-9 h-9 rounded-full border border-kbBorder flex items-center justify-center font-bold text-sm">✕</button>
            </div>
            <nav className="flex flex-col gap-4 mt-6 text-base font-medium">
              <a href="#shop" onClick={() => { setIsMobileMenuOpen(false); setActiveCategory('All'); }} className="py-2 border-b border-neutral-100">Shop Catalog</a>
              <a href="#categories" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-neutral-100">Explore Categories</a>
              <a href="#shop" onClick={() => { setIsMobileMenuOpen(false); setActiveCategory('Men'); }} className="py-2 border-b border-neutral-100">Men's Collection</a>
              <a href="#shop" onClick={() => { setIsMobileMenuOpen(false); setActiveCategory('Women'); }} className="py-2 border-b border-neutral-100">Women's Collection</a>
              <a href="#shop" onClick={() => { setIsMobileMenuOpen(false); setActiveCategory('New Arrivals'); }} className="py-2 border-b border-neutral-100">New Arrivals</a>
              <a href="#shop" onClick={() => { setIsMobileMenuOpen(false); setActiveCategory('Offers'); }} className="py-2 border-b border-neutral-100">Offers & Deals</a>
              <a href="#analytics" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-neutral-100">Quality Ratings</a>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsMerchantLookupOpen(true); }} className="text-left py-2 border-b border-neutral-100 text-emerald-800 font-bold flex items-center gap-1">
                <span>✓</span> Verify Merchant Portal
              </button>
              <button onClick={() => { setIsMobileMenuOpen(false); openAdmin(); }} className="text-left py-2 border-b border-neutral-100 text-neutral-500">
                Admin Governance Ledger
              </button>
            </nav>
          </div>
          <div className="pt-6 border-t border-kbBorder text-xs text-kbMuted">
            Better clothes. Better prices.<br />
            © 2026 KB Online (Next.js & PostgreSQL Edition)
          </div>
        </div>
      </div>

      <main>
        {/* HERO BANNER */}
        <section className="bg-kbBlack text-white overflow-hidden py-12 md:py-20">
          <div className="max-w-[1240px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center gap-10">
            <div className="hero">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-kb-pill border border-white/20 text-xs text-neutral-300 font-medium mb-6 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                WELCOME TO KB ONLINE • GOVT VERIFIED E-COMMERCE
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[72px] leading-[0.98] font-extrabold tracking-[-0.05em] mb-6">
                Better clothes.<br />
                <span className="text-neutral-400">Better prices.</span>
              </h1>
              <p className="max-w-lg text-neutral-300 text-base md:text-lg leading-relaxed mb-8">
                Discover everyday fashion made for modern life — carefully selected styles, comfortable premium essentials, and honest prices without compromising quality.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#shop" onClick={() => setActiveCategory('All')} className="bg-white text-kbBlack font-semibold px-6 py-3.5 rounded-kb-pill hover:bg-neutral-200 hover:-translate-y-0.5 transition-all text-sm">
                  Shop Collection →
                </a>
                <a href="#shop" onClick={() => setActiveCategory('New Arrivals')} className="bg-transparent text-white border border-neutral-700 font-semibold px-6 py-3.5 rounded-kb-pill hover:bg-neutral-900 hover:-translate-y-0.5 transition-all text-sm">
                  Explore New Arrivals
                </a>
              </div>
            </div>

            <div className="h-[280px] md:h-[350px] rounded-kb-lg bg-gradient-to-br from-neutral-800 to-kbBlack relative overflow-hidden flex items-center justify-center p-6 border border-white/10">
              <div className="w-56 h-68 rounded-kb-sm bg-gradient-to-br from-neutral-200 to-neutral-400 -rotate-6 shadow-2xl relative p-5 text-kbBlack flex flex-col justify-between transition-transform hover:rotate-0 duration-500 select-none">
                <div className="flex justify-between items-start">
                  <div className="text-2xl font-black tracking-tight">KB.</div>
                  <span className="bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">VERIFIED SELLER</span>
                </div>
                <div className="bg-white/85 backdrop-blur-sm rounded-lg p-3 text-xs font-bold shadow-sm">
                  <div>ESSENTIAL TEE</div>
                  <div className="text-neutral-500 font-normal">100% Combed Cotton</div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-extrabold">₹499</span>
                    <span className="text-[10px] text-neutral-500 font-normal">(Incl. all taxes)</span>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-semibold tracking-wider text-neutral-700">
                  <span>HSN 61091000</span>
                  <span>NEW SEASON</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CATEGORY SHOWCASE */}
        <section id="categories" className="max-w-[1240px] mx-auto px-4 md:px-6 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-1.5px]">Shop your style.</h2>
              <p className="text-kbMuted text-sm mt-1">Simple pieces. Easy choices.</p>
            </div>
            <span className="text-xs text-neutral-400">Click any card to filter catalog</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div onClick={() => setActiveCategory('Men')} className="group cursor-pointer min-h-[170px] rounded-kb-md bg-kbLight p-6 flex flex-col justify-between border border-transparent hover:border-neutral-300 hover:-translate-y-1 transition-all">
              <span className="text-xs text-neutral-400 font-mono">01</span>
              <div>
                <h3 className="text-xl font-bold group-hover:underline">Men</h3>
                <p className="text-xs text-neutral-500 mt-1">Everyday essentials & fits</p>
              </div>
            </div>
            <div onClick={() => setActiveCategory('Women')} className="group cursor-pointer min-h-[170px] rounded-kb-md bg-kbLight p-6 flex flex-col justify-between border border-transparent hover:border-neutral-300 hover:-translate-y-1 transition-all">
              <span className="text-xs text-neutral-400 font-mono">02</span>
              <div>
                <h3 className="text-xl font-bold group-hover:underline">Women</h3>
                <p className="text-xs text-neutral-500 mt-1">Modern everyday fashion</p>
              </div>
            </div>
            <div onClick={() => setActiveCategory('New Arrivals')} className="group cursor-pointer min-h-[170px] rounded-kb-md bg-kbLight p-6 flex flex-col justify-between border border-transparent hover:border-neutral-300 hover:-translate-y-1 transition-all">
              <span className="text-xs text-neutral-400 font-mono">03</span>
              <div>
                <h3 className="text-xl font-bold group-hover:underline">New Arrivals</h3>
                <p className="text-xs text-neutral-500 mt-1">Fresh styles updated weekly</p>
              </div>
            </div>
            <div onClick={() => setActiveCategory('Offers')} className="group cursor-pointer min-h-[170px] rounded-kb-md bg-kbLight p-6 flex flex-col justify-between border border-transparent hover:border-neutral-300 hover:-translate-y-1 transition-all">
              <span className="text-xs text-neutral-400 font-mono">04</span>
              <div>
                <h3 className="text-xl font-bold group-hover:underline">Offers</h3>
                <p className="text-xs text-neutral-500 mt-1">More value for less price</p>
              </div>
            </div>
          </div>
        </section>

        {/* FULL PRODUCT CATALOG */}
        <section id="shop" className="max-w-[1240px] mx-auto px-4 md:px-6 py-12 border-t border-kbBorder">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-1.5px]">Featured Picks & Catalog.</h2>
              <p className="text-kbMuted text-sm mt-1">Explore our collection with Zod-validated facets & statutory tags.</p>
            </div>
            <div className="text-xs text-neutral-500">
              Showing <span id="visible-count" className="font-bold text-black">{filteredProducts.length}</span> of <span id="total-count" className="font-bold text-black">{products.length}</span> products
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-kbLight p-4 md:p-6 rounded-kb-md mb-8 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center border border-kbBorder">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500 mr-2">Category:</span>
              {['All', 'Men', 'Women', 'New Arrivals', 'Offers'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cat-pill text-xs font-semibold px-4 py-2 rounded-kb-pill transition-all ${
                    activeCategory === cat ? 'active bg-kbBlack text-white' : 'bg-white text-kbBlack border border-kbBorder hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-neutral-500 mr-1">Size:</span>
                <select
                  id="size-filter"
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="bg-white border border-kbBorder text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-black"
                >
                  <option value="All">All Sizes</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-neutral-500 mr-1">Max Price:</span>
                <select
                  id="price-filter"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(parseFloat(e.target.value))}
                  className="bg-white border border-kbBorder text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-black"
                >
                  <option value="9999">Any Price</option>
                  <option value="599">Under ₹599</option>
                  <option value="999">Under ₹999</option>
                  <option value="1200">Under ₹1,200</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-neutral-500 mr-1">Sort:</span>
                <select
                  id="sort-filter"
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                  className="bg-white border border-kbBorder text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isWishlisted = wishlist.some(item => item.id === product.id);
              return (
                <article
                  key={product.id}
                  onClick={() => { setSelectedProduct(product); setSelectedSize(product.sizes[0]); }}
                  className="group cursor-pointer select-none"
                >
                  <div
                    className="h-80 rounded-kb-sm bg-kbCardBg watermark-kb relative overflow-hidden flex flex-col justify-between p-3.5 transition-transform group-hover:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start z-10">
                      <span className="bg-white text-kbBlack text-[10px] font-bold px-2.5 py-1 rounded-kb-pill border border-kbBorder">
                        {product.tags[0]}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        className="w-8 h-8 rounded-full bg-white border border-kbBorder flex items-center justify-center text-xs hover:scale-110 transition-transform"
                      >
                        {isWishlisted ? '♥' : '♡'}
                      </button>
                    </div>

                    <div className="z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, product.sizes[0]); }}
                        className="w-full bg-white/95 backdrop-blur-sm text-black font-bold text-xs py-2.5 rounded-kb-pill opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-black hover:text-white"
                      >
                        + Quick Add to Bag
                      </button>
                    </div>
                  </div>

                  <div className="pt-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>Made in India • HSN {product.hsnCode}</span>
                    </div>
                    <div className="font-semibold text-sm mb-1 group-hover:underline">{product.name}</div>
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>{product.collection}</span>
                      <div className="text-right">
                        <strong className="text-black text-sm">₹{product.price}</strong>
                        <span className="text-[9px] block text-neutral-400 font-normal">Incl. all taxes</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* QUALITY SENTIMENT (Canvas Chart.js) */}
        <section id="analytics" className="max-w-[1240px] mx-auto px-4 md:px-6 py-12 border-t border-kbBorder">
          <div className="bg-kbSurfaceAlt rounded-kb-xl p-6 md:p-10 border border-kbBorder">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Quality & Comfort Ratings</div>
                <h2 className="text-2xl font-bold tracking-tight mt-1">Customer Sentiment Breakdown</h2>
                <p className="text-xs text-kbMuted mt-1">Aggregated verified buyer feedback across fabric, durability, fit accuracy, and value.</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-kb-pill border border-kbBorder text-xs font-semibold">
                Overall Satisfaction Rating: <span className="text-emerald-700 font-extrabold">4.8 / 5.0</span> ★
              </div>
            </div>
            <div className="chart-container">
              <canvas id="qualityChart" ref={chartCanvasRef}></canvas>
            </div>
          </div>
        </section>

        {/* EDITORIAL PROMO SECTION */}
        <section id="new" className="max-w-[1240px] mx-auto px-4 md:px-6 py-12">
          <div className="bg-kbSurfaceAlt rounded-kb-xl p-8 md:p-16 text-center border border-kbBorder">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-2.5px] mb-4">
              Style shouldn't be expensive.
            </h2>
            <p className="max-w-xl mx-auto text-neutral-600 text-sm md:text-base mb-8 leading-relaxed">
              KB brings together quality, comfort, and modern minimalist design at prices made for sensible, everyday shopping.
            </p>
            <button onClick={() => { setActiveCategory('All'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-kbBlack text-white font-semibold px-8 py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all text-sm">
              Start Shopping →
            </button>
          </div>
        </section>

        {/* BRAND & STATUTORY FOOTER LINKS */}
        <section id="about" className="max-w-[1240px] mx-auto px-4 md:px-6 py-12 border-t border-kbBorder">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="text-2xl font-extrabold tracking-tight mb-3">KB.</div>
              <p className="text-neutral-500 leading-relaxed text-xs">
                We build elevated wardrobe staples designed for long-lasting comfort and versatility. No inflated markups, no artificial trends.
              </p>
            </div>
            <div>
              <div className="font-bold mb-3 text-black">Customer Care Promise</div>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li>✓ Free shipping on all orders over ₹999</li>
                <li>✓ 7-day hassle-free easy returns & exchanges</li>
                <li>✓ 100% combed cotton & durable weave fabrics</li>
                <li>✓ Secure payment via UPI, Cards, Net Banking & COD</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-3 text-black">Statutory Disclosures</div>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li><button onClick={() => setActivePolicyKey('terms')} className="hover:underline">Terms & Conditions</button></li>
                <li><button onClick={() => setActivePolicyKey('privacy')} className="hover:underline">Privacy Policy (DPDP Act)</button></li>
                <li><button onClick={() => setActivePolicyKey('returns')} className="hover:underline">Return & Refund Policy</button></li>
                <li><button onClick={() => setActivePolicyKey('grievance')} className="hover:underline">Grievance Officer SLA</button></li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-3 text-black">Stay Connected</div>
              <p className="text-xs text-neutral-500 mb-3">Subscribe for exclusive drops and early access to sales.</p>
              <div className="flex gap-2">
                <input type="email" id="newsletter-email" placeholder="Enter your email" className="bg-kbLight border border-kbBorder text-xs rounded-kb-pill px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black" />
                <button onClick={() => alert("Thank you for joining KB Online!")} className="bg-kbBlack text-white text-xs font-semibold px-4 py-2 rounded-kb-pill hover:bg-neutral-800 transition-colors">Join</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-kbBorder py-8 bg-white text-neutral-500 text-xs">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-black text-lg tracking-tight">KB.</div>
          <div>© 2026 KB Online Shopping Platform (KB Retail Pvt Ltd). All rights reserved.</div>
          <div>Rule 46 CGST Tax Compliant • DPDP 2023 Compliant</div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-kbBorder flex items-center justify-around py-2.5 md:hidden">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-neutral-600">
          <span className="text-base">🏠</span> Home
        </button>
        <button onClick={() => { setActiveCategory('All'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-neutral-600">
          <span className="text-base">👕</span> Shop
        </button>
        <button id="mobile-search-btn" onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-neutral-600">
          <span className="text-base">⌕</span> Search
        </button>
        <button id="mobile-wishlist-btn" onClick={() => setIsWishlistOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-neutral-600 relative">
          <span className="text-base">♡</span> Wishlist
          {wishlist.length > 0 && (
            <span id="mobile-wishlist-badge" className="absolute top-0 right-2 bg-kbBlack text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>
        <button id="mobile-bag-btn" onClick={() => setIsBagOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-neutral-600 relative">
          <span className="text-base">🛍️</span> Bag
          <span id="mobile-bag-badge" className="absolute top-0 right-2 bg-kbBlack text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {totalCartCount}
          </span>
        </button>
      </div>

      {/* SLIDE-OVER BAG DRAWER */}
      <div id="bag-drawer" className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div id="bag-drawer-content" className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white h-full flex flex-col justify-between transform transition-transform duration-300 ${isBagOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-kbBorder flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold">Shopping Bag</span>
              <span id="bag-item-count" className="text-xs bg-kbLight px-2 py-1 rounded-full font-bold text-neutral-600">{totalCartCount} items</span>
            </div>
            <button id="bag-drawer-close" onClick={() => setIsBagOpen(false)} className="w-8 h-8 rounded-full border border-kbBorder flex items-center justify-center font-bold text-xs hover:bg-kbLight">✕</button>
          </div>

          {/* Free Shipping Tier */}
          <div className="bg-kbSurfaceAlt px-6 py-3 border-b border-kbBorder">
            <div id="shipping-threshold-text" className="text-xs font-medium text-neutral-700 mb-1.5">
              {cartState.subtotal >= 999 ? (
                <span className="font-bold text-emerald-700">✓ You have unlocked FREE Express Delivery!</span>
              ) : (
                <>Add <span className="font-bold text-black">₹{999 - cartState.subtotal}</span> more for FREE Express Delivery</>
              )}
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                id="shipping-progress"
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((cartState.subtotal / 999) * 100))}%` }}
              ></div>
            </div>
          </div>

          <div id="bag-items-list" className="p-6 overflow-y-auto flex-1 divide-y divide-kbBorder">
            {cartState.items.length === 0 ? (
              <div className="py-12 text-center text-kbMuted text-xs">Your shopping bag is empty.</div>
            ) : (
              cartState.items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <div className="font-bold text-xs">{item.name}</div>
                    <div className="text-[11px] text-neutral-400">Size: {item.size} | ₹{item.price} each (HSN {item.hsnCode})</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQty(item.productId, item.size, -1)} className="w-6 h-6 border border-kbBorder rounded-full flex items-center justify-center font-bold text-xs">-</button>
                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.productId, item.size, 1)} className="w-6 h-6 border border-kbBorder rounded-full flex items-center justify-center font-bold text-xs">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-kbBorder bg-kbLight">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                id="promo-code-input"
                placeholder="Promo code (e.g. KB10)"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="uppercase bg-white border border-kbBorder text-xs rounded-kb-pill px-3 py-2 flex-1 focus:outline-none"
              />
              <button onClick={applyPromo} className="bg-kbBlack text-white text-xs font-semibold px-4 py-2 rounded-kb-pill hover:bg-neutral-800">Apply</button>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span id="bag-subtotal" className="font-bold text-black">₹{cartState.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (<span id="discount-percent">{cartState.discountPercent}</span>%)</span>
                <span id="bag-discount" className="text-emerald-700 font-bold">-₹{cartState.discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span id="bag-shipping" className="font-bold text-black">{cartState.shippingFee === 0 ? 'FREE' : `₹${cartState.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-kbBorder">
                <span>Total (Incl. all taxes)</span>
                <span id="bag-total">₹{cartState.total}</span>
              </div>
            </div>

            <button
              id="checkout-btn"
              onClick={() => {
                if (cartState.items.length === 0) { alert("Your bag is empty!"); return; }
                setIsBagOpen(false);
                setIsCheckoutOpen(true);
                setCheckoutStep(1);
              }}
              className="w-full bg-kbBlack text-white font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all text-sm flex items-center justify-center gap-2"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>

      {/* SLIDE-OVER WISHLIST DRAWER */}
      <div id="wishlist-drawer" className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isWishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div id="wishlist-drawer-content" className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white h-full flex flex-col justify-between transform transition-transform duration-300 ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-kbBorder flex items-center justify-between">
            <span className="text-xl font-extrabold">Your Wishlist</span>
            <button id="wishlist-drawer-close" onClick={() => setIsWishlistOpen(false)} className="w-8 h-8 rounded-full border border-kbBorder flex items-center justify-center font-bold text-xs hover:bg-kbLight">✕</button>
          </div>
          <div id="wishlist-items-list" className="p-6 overflow-y-auto flex-1 divide-y divide-kbBorder">
            {wishlist.length === 0 ? (
              <div className="py-12 text-center text-kbMuted text-xs">Your wishlist is empty.</div>
            ) : (
              wishlist.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-xs">{item.name}</div>
                    <div className="text-[11px] text-neutral-400">₹{item.price} • {item.collection}</div>
                  </div>
                  <button
                    onClick={() => { addToCart(item, item.sizes[0]); toggleWishlist(item); }}
                    className="bg-black text-white text-xs px-3 py-1.5 rounded-kb-pill"
                  >
                    Move to Bag
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SEARCH COMMAND MODAL */}
      <div id="search-modal" className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-md transition-opacity duration-300 flex items-start justify-center pt-20 px-4 ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-kb-md w-full max-w-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-kbBorder">
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clothes, collections, tags, or HSN codes..."
              className="w-full text-lg font-medium focus:outline-none pr-4"
              autoFocus={isSearchOpen}
            />
            <button id="search-modal-close" onClick={() => setIsSearchOpen(false)} className="text-sm font-bold w-8 h-8 rounded-full bg-kbLight flex items-center justify-center">✕</button>
          </div>
          <div id="search-results" className="mt-4 max-h-80 overflow-y-auto space-y-3">
            {filteredProducts.slice(0, 5).map(p => (
              <div
                key={p.id}
                onClick={() => { setSelectedProduct(p); setSelectedSize(p.sizes[0]); setIsSearchOpen(false); }}
                className="p-3 rounded-lg hover:bg-kbLight cursor-pointer flex justify-between items-center border border-kbBorder"
              >
                <div>
                  <div className="font-bold text-xs">{p.name}</div>
                  <div className="text-[10px] text-neutral-400">{p.collection} • HSN {p.hsnCode}</div>
                </div>
                <div className="font-extrabold text-xs">₹{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCT DETAIL MODAL (PDP) */}
      {selectedProduct && (
        <div id="product-modal" className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
          <div id="product-modal-card" className="bg-white rounded-kb-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-kbLight border border-kbBorder flex items-center justify-center font-bold text-sm hover:bg-neutral-200">✕</button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <div className="h-72 md:h-96 rounded-kb-sm bg-kbCardBg watermark-kb flex flex-col justify-between p-4 relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                  <span id="modal-tag" className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-kb-pill border border-kbBorder">
                    {selectedProduct.tags[0]}
                  </span>
                  <span className="bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-kb-pill">✓ Govt Verified</span>
                </div>
                <div className="z-10 text-left bg-white/80 backdrop-blur-sm p-3 rounded-lg text-xs">
                  <div id="modal-country" className="font-semibold text-neutral-800">Country of Origin: {selectedProduct.countryOfOrigin}</div>
                  <div id="modal-hsn" className="text-neutral-500 text-[10px]">HSN: {selectedProduct.hsnCode} • GST {selectedProduct.taxRatePercent}%</div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div id="modal-collection" className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{selectedProduct.collection}</div>
                  <h3 id="modal-title" className="text-2xl font-extrabold mt-1">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span id="modal-price" className="text-2xl font-extrabold">₹{selectedProduct.price}</span>
                    <span className="text-xs text-neutral-500 font-medium">(Incl. of all taxes)</span>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600">
                    <span id="modal-rating">★★★★★ {selectedProduct.rating}</span>
                    <span id="modal-reviews" className="text-neutral-400">({selectedProduct.reviews} verified reviews)</span>
                  </div>

                  {/* Size Selector */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Select Size</span>
                      <button onClick={() => setIsSizeGuideOpen(true)} className="text-xs text-neutral-500 underline hover:text-black">Size Guide (Inches)</button>
                    </div>
                    <div id="modal-sizes" className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                            selectedSize === size ? 'bg-kbBlack text-white' : 'bg-white text-black border border-kbBorder hover:bg-kbLight'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="mt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block mb-2">Color</span>
                    <div className="flex gap-2">
                      <span className="w-6 h-6 rounded-full bg-black border-2 border-black ring-2 ring-neutral-300 cursor-pointer"></span>
                      <span className="w-6 h-6 rounded-full bg-neutral-400 cursor-pointer"></span>
                      <span className="w-6 h-6 rounded-full bg-stone-200 cursor-pointer"></span>
                    </div>
                  </div>

                  {/* Accordions */}
                  <div className="mt-6 text-xs text-neutral-600 space-y-2 border-t border-kbBorder pt-4">
                    <details className="cursor-pointer" open>
                      <summary className="font-bold text-black py-1">Fabric & Care</summary>
                      <p id="modal-fabric" className="pt-1 text-neutral-500">{selectedProduct.fabricCare || '100% Combed Cotton. Machine wash cold with similar colors.'}</p>
                    </details>
                    <details className="cursor-pointer">
                      <summary className="font-bold text-black py-1">Fit & Sizing</summary>
                      <p id="modal-fit" className="pt-1 text-neutral-500">{selectedProduct.fitSizing || 'Relaxed drop-shoulder oversized fit.'}</p>
                    </details>
                    <details className="cursor-pointer">
                      <summary className="font-bold text-black py-1">Manufacturer & Importer Details</summary>
                      <p id="modal-mfg" className="pt-1 text-neutral-500 font-mono text-[11px]">{selectedProduct.manufacturerDetails}</p>
                    </details>
                    <details className="cursor-pointer">
                      <summary className="font-bold text-black py-1">Free Delivery & 7-Day Easy Returns</summary>
                      <p id="modal-return" className="pt-1 text-neutral-500">{selectedProduct.returnPolicy || 'Free delivery on orders over ₹999. 7-day hassle-free returns.'}</p>
                    </details>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => { addToCart(selectedProduct, selectedSize); setSelectedProduct(null); setIsBagOpen(true); }}
                    className="flex-1 bg-kbBlack text-white font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all text-sm"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className="w-12 h-12 rounded-full border border-kbBorder flex items-center justify-center text-lg hover:bg-kbLight"
                  >
                    ♡
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIZE GUIDE MODAL */}
      <div id="size-guide-modal" className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-md transition-opacity duration-300 flex items-center justify-center p-4 ${isSizeGuideOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-kb-md w-full max-w-lg p-6 shadow-2xl">
          <div className="flex justify-between items-center pb-4 border-b border-kbBorder">
            <h4 className="font-bold text-lg">Standard Size Chart (Inches & CM)</h4>
            <button onClick={() => setIsSizeGuideOpen(false)} className="text-sm font-bold w-7 h-7 rounded-full bg-kbLight">✕</button>
          </div>
          <div className="mt-4 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-kbLight border-b border-kbBorder">
                  <th className="p-2">Size</th>
                  <th className="p-2">Chest (Inches)</th>
                  <th className="p-2">Length (Inches)</th>
                  <th className="p-2">Shoulder (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kbBorder">
                <tr><td className="p-2 font-bold">XS</td><td className="p-2">36"</td><td className="p-2">26"</td><td className="p-2">17"</td></tr>
                <tr><td className="p-2 font-bold">S</td><td className="p-2">38"</td><td className="p-2">27"</td><td className="p-2">18"</td></tr>
                <tr><td className="p-2 font-bold">M</td><td className="p-2">40"</td><td className="p-2">28"</td><td className="p-2">19"</td></tr>
                <tr><td className="p-2 font-bold">L</td><td className="p-2">42"</td><td className="p-2">29"</td><td className="p-2">20"</td></tr>
                <tr><td className="p-2 font-bold">XL</td><td className="p-2">44"</td><td className="p-2">30"</td><td className="p-2">21"</td></tr>
                <tr><td className="p-2 font-bold">XXL</td><td className="p-2">46"</td><td className="p-2">31"</td><td className="p-2">22"</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MULTI-STEP CHECKOUT MODAL */}
      <div id="checkout-modal" className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-300 flex items-center justify-center p-4 ${isCheckoutOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-kb-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
          <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-kbLight flex items-center justify-center font-bold text-xs">✕</button>

          <div className="flex items-center justify-between pb-6 border-b border-kbBorder">
            <div id="checkout-step-1-indicator" className={`text-xs font-bold pb-1 ${checkoutStep === 1 ? 'text-black border-b-2 border-black' : 'text-neutral-400'}`}>1. Delivery Details</div>
            <div id="checkout-step-2-indicator" className={`text-xs font-bold pb-1 ${checkoutStep === 2 ? 'text-black border-b-2 border-black' : 'text-neutral-400'}`}>2. Payment Method</div>
            <div id="checkout-step-3-indicator" className={`text-xs font-bold pb-1 ${checkoutStep === 3 ? 'text-black border-b-2 border-black' : 'text-neutral-400'}`}>3. Order Confirmation</div>
          </div>

          {checkoutStep === 1 && (
            <div id="checkout-step-1" className="mt-6 space-y-4">
              <h3 className="font-extrabold text-lg">Delivery & Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input type="text" id="cust-name" value={custName} onChange={(e) => setCustName(e.target.value)} className="w-full bg-kbLight border border-kbBorder rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number (+91) *</label>
                  <input type="text" id="cust-phone" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} className="w-full bg-kbLight border border-kbBorder rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="text-xs">
                <label className="block font-semibold mb-1">Street Address *</label>
                <input type="text" id="cust-address" value={custAddress} onChange={(e) => setCustAddress(e.target.value)} className="w-full bg-kbLight border border-kbBorder rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">PIN Code *</label>
                  <input type="text" id="cust-pin" value={custPin} onChange={(e) => handlePinChange(e.target.value)} className="w-full bg-kbLight border border-kbBorder rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input type="text" id="cust-city" value={custCity} onChange={(e) => setCustCity(e.target.value)} className="w-full bg-kbLight border border-kbBorder rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State</label>
                  <input type="text" id="cust-state" value={custState} onChange={(e) => setCustState(e.target.value)} className="w-full bg-kbLight border border-kbBorder rounded-lg px-3 py-2" />
                </div>
              </div>

              <div className="text-xs pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
                  <input type="checkbox" id="b2b-checkbox" checked={isB2B} onChange={(e) => setIsB2B(e.target.checked)} className="accent-black" />
                  Buying for business? Add GSTIN for Input Tax Credit (ITC)
                </label>
                {isB2B && (
                  <div id="b2b-gstin-box" className="mt-2">
                    <input
                      type="text"
                      id="cust-gstin"
                      placeholder="Enter 15-character Business GSTIN (e.g. 29AAAAA1111A1Z1)"
                      value={custGstin}
                      onChange={(e) => setCustGstin(e.target.value.toUpperCase())}
                      className="uppercase w-full bg-kbLight border border-kbBorder rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                )}
              </div>

              <button onClick={() => setCheckoutStep(2)} className="w-full bg-kbBlack text-white font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all text-sm mt-4">
                Continue to Payment Method →
              </button>
            </div>
          )}

          {checkoutStep === 2 && (
            <div id="checkout-step-2" className="mt-6 space-y-4">
              <h3 className="font-extrabold text-lg">Select Payment Gateway / Method</h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-3 p-3.5 rounded-lg border border-kbBorder bg-kbLight cursor-pointer">
                  <input type="radio" name="payment-method" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-black" />
                  <div>
                    <span className="font-bold block text-sm">UPI (GPay / PhonePe / Paytm / BHIM)</span>
                    <span className="text-neutral-500">Instant 1-Click Verification • 0% Transaction Fees</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3.5 rounded-lg border border-kbBorder bg-kbLight cursor-pointer">
                  <input type="radio" name="payment-method" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="accent-black" />
                  <div>
                    <span className="font-bold block text-sm">Credit / Debit Card</span>
                    <span className="text-neutral-500">Visa, Mastercard, RuPay with 3D Secure OTP</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3.5 rounded-lg border border-kbBorder bg-kbLight cursor-pointer">
                  <input type="radio" name="payment-method" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-black" />
                  <div>
                    <span className="font-bold block text-sm">Cash on Delivery (COD)</span>
                    <span className="text-neutral-500">Pay cash or scan UPI QR code at doorstep</span>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-neutral-100 rounded-lg text-xs space-y-1">
                <div className="flex justify-between"><span>Payable Amount:</span><span id="checkout-payable" className="font-bold text-black">₹{cartState.total}</span></div>
                <div className="flex justify-between text-neutral-500"><span>Statutory Invoice:</span><span>Generated upon confirmation</span></div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setCheckoutStep(1)} className="w-1/3 border border-kbBorder font-bold py-3.5 rounded-kb-pill hover:bg-kbLight text-sm">
                  ← Back
                </button>
                <button onClick={handlePlaceOrder} id="place-order-btn" className="w-2/3 bg-kbBlack text-white font-bold py-3.5 rounded-kb-pill hover:bg-neutral-800 text-sm">
                  Place Order Now
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 3 && placedOrder && (
            <div id="checkout-step-3" className="mt-6 text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">✓</div>
              <h3 className="text-2xl font-extrabold">Order Confirmed!</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Thank you for shopping with KB. Your order <span id="conf-order-id" className="font-bold text-black">{placedOrder.orderId}</span> has been placed successfully.
              </p>
              <div className="bg-kbLight p-4 rounded-kb-md text-xs text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between"><span>Estimated Delivery:</span><span id="conf-sla" className="font-bold">{placedOrder.estimatedDeliveryDays} Business Days</span></div>
                <div className="flex justify-between"><span>Amount Paid:</span><span id="conf-amount" className="font-bold">₹{placedOrder.totalPaid}</span></div>
                <div className="flex justify-between"><span>Tax Invoice #:</span><span id="conf-invoice" className="font-mono font-bold">{placedOrder.invoiceNumber}</span></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Link
                  id="conf-invoice-link"
                  href={`/invoices/${placedOrder.orderId}`}
                  target="_blank"
                  className="bg-neutral-900 text-white font-bold px-6 py-3 rounded-kb-pill hover:bg-black text-xs flex items-center justify-center gap-1.5"
                >
                  📄 View / Print Tax Invoice
                </Link>
                <button onClick={() => setIsCheckoutOpen(false)} className="border border-kbBorder text-black font-bold px-6 py-3 rounded-kb-pill hover:bg-kbLight text-xs">
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MERCHANT VERIFICATION MODAL (/verify-merchant) */}
      <div id="merchant-modal" className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-300 flex items-center justify-center p-4 ${isMerchantLookupOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-kb-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
          <button onClick={() => setIsMerchantLookupOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-kbLight flex items-center justify-center font-bold text-xs">✕</button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-extrabold">Government Regulatory & Merchant Verification Portal</span>
          </div>
          <p className="text-xs text-neutral-500 mb-6">
            Search any vendor or brand by official GSTIN or Merchant ID to verify statutory registration, business health, and quality certifications.
          </p>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              id="merchant-lookup-input"
              value={merchantLookupInput}
              onChange={(e) => setMerchantLookupInput(e.target.value.toUpperCase())}
              placeholder="Enter GSTIN or Merchant ID (e.g. 29AAAAA0000A1Z5)"
              className="uppercase bg-kbLight border border-kbBorder text-xs rounded-kb-pill px-4 py-3 flex-1 focus:outline-none focus:ring-1 focus:ring-black font-mono"
            />
            <button onClick={handleMerchantVerify} className="bg-kbBlack text-white text-xs font-semibold px-6 py-3 rounded-kb-pill hover:bg-neutral-800">
              Verify Record
            </button>
          </div>

          <div id="merchant-lookup-result" className="bg-kbSurfaceAlt p-5 rounded-kb-lg border border-kbBorder text-xs">
            {merchantLookupResult ? (
              merchantLookupResult.found ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-kbBorder pb-2">
                    <span className="font-extrabold text-sm">{merchantLookupResult.verification.legalBusinessName}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">✓ OFFICIALLY VERIFIED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div><span className="text-neutral-500">Merchant ID:</span> <strong className="font-mono">{merchantLookupResult.verification.merchantId}</strong></div>
                    <div><span className="text-neutral-500">GSTIN:</span> <strong className="font-mono">{merchantLookupResult.verification.gstin}</strong></div>
                    <div><span className="text-neutral-500">Entity Type:</span> <strong>{merchantLookupResult.verification.entityType}</strong></div>
                    <div><span className="text-neutral-500">Compliance Rating:</span> <strong className="text-emerald-700">{merchantLookupResult.verification.complianceRating}</strong></div>
                  </div>
                  <div className="text-xs pt-1"><span className="text-neutral-500">Registered Address:</span> {merchantLookupResult.verification.registeredAddress}</div>
                  <div className="text-xs pt-1"><span className="text-neutral-500">Certifications:</span> <span className="font-medium">{merchantLookupResult.verification.qualityCertifications.join(', ')}</span></div>
                  <div className="text-[10px] text-neutral-400 border-t border-kbBorder pt-2 mt-2">
                    Verification Seal Timestamp: {new Date(merchantLookupResult.verification.verificationSealTimestamp).toLocaleString('en-IN')}<br />
                    {merchantLookupResult.verification.complianceNotes}
                  </div>
                </div>
              ) : (
                <div className="text-red-700 text-center py-4 font-semibold">{merchantLookupResult.message}</div>
              )
            ) : (
              <div className="text-neutral-400 text-center py-4">Click "Verify Record" to check statutory status.</div>
            )}
          </div>
        </div>
      </div>

      {/* ADMIN GOVERNANCE & AUDIT LEDGER MODAL */}
      <div id="admin-modal" className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-300 flex items-center justify-center p-4 ${isAdminOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-kb-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
          <button onClick={() => setIsAdminOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-kbLight flex items-center justify-center font-bold text-xs">✕</button>
          <div className="flex items-center justify-between mb-4 border-b border-kbBorder pb-4">
            <div>
              <h3 className="text-xl font-extrabold">Platform Governance & Audit Ledger</h3>
              <p className="text-xs text-neutral-500">Cryptographically chained immutable ledger tracking administrative and compliance events.</p>
            </div>
            <span id="ledger-status" className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full">✓ Chain Verified</span>
          </div>

          <div className="bg-kbLight p-4 rounded-kb-md mb-6 border border-kbBorder flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold block">1-Click Dispute & Refund Reconciliation</span>
              <span className="text-neutral-500">Triggers automated gateway webhook back to customer payment source.</span>
            </div>
            <button onClick={handleTestRefund} className="bg-neutral-900 hover:bg-black text-white font-bold px-4 py-2 rounded-kb-pill">
              Initiate Test Refund
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-kbBorder font-mono text-[10px] text-neutral-500 uppercase">
                  <th className="p-2">Log ID</th>
                  <th className="p-2">Action</th>
                  <th className="p-2">Actor</th>
                  <th className="p-2">Resource</th>
                  <th className="p-2">SHA256 Hash</th>
                </tr>
              </thead>
              <tbody id="audit-logs-table" className="divide-y divide-kbBorder font-mono text-[11px]">
                {auditLogs.slice(0, 8).map(log => (
                  <tr key={log.logId}>
                    <td className="p-2 font-bold">{log.logId}</td>
                    <td className="p-2 text-black">{log.action}</td>
                    <td className="p-2 text-neutral-500">{log.actorId}</td>
                    <td className="p-2">{log.resourceType}:{log.resourceId}</td>
                    <td className="p-2 text-[9px] text-neutral-400" title={log.hash}>{log.hash?.substring(0, 12)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* STATUTORY POLICIES MODAL */}
      {activePolicyKey && (
        <div id="statutory-modal" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-kb-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
            <button onClick={() => setActivePolicyKey(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-kbLight flex items-center justify-center font-bold text-xs">✕</button>
            <h3 id="statutory-title" className="text-xl font-extrabold mb-3">
              {activePolicyKey === 'terms' && 'Terms & Conditions'}
              {activePolicyKey === 'privacy' && 'Privacy Policy (DPDP Act, 2023 Compliant)'}
              {activePolicyKey === 'returns' && 'Return, Refund & Exchange SLA'}
              {activePolicyKey === 'grievance' && 'Grievance Redressal Officer Disclosure'}
            </h3>
            <div id="statutory-content" className="text-xs text-neutral-600 space-y-3 leading-relaxed">
              {activePolicyKey === 'terms' && (
                <>
                  <p><strong>1. Introduction:</strong> These terms govern all purchases made on KB Online Shopping Platform (KB Retail Pvt Ltd).</p>
                  <p><strong>2. Pricing & Taxes:</strong> All display prices are inclusive of GST (CGST/SGST/IGST) in accordance with the Central Goods and Services Tax Act, 2017.</p>
                  <p><strong>3. Country of Origin & Packaging:</strong> Every product lists registered manufacturer details and verifiable country of origin as per the Legal Metrology (Packaged Commodities) Rules, 2011.</p>
                </>
              )}
              {activePolicyKey === 'privacy' && (
                <>
                  <p><strong>1. Data Fiduciary Notice:</strong> KB Retail Private Limited acts as the Data Fiduciary under the Digital Personal Data Protection Act, 2023.</p>
                  <p><strong>2. Purpose of Collection:</strong> Customer contact, shipping addresses, and payment tokens are processed solely for order fulfillment, statutory invoicing, and delivery tracking.</p>
                  <p><strong>3. Consent & Erasure:</strong> Customers possess the statutory right to request erasure, correction, or review of personal data by emailing privacy@kbonline.internal.</p>
                </>
              )}
              {activePolicyKey === 'returns' && (
                <>
                  <p><strong>1. 7-Day Easy Returns:</strong> Customers can initiate returns or exchanges within 7 business days of delivery for unworn items with original tags.</p>
                  <p><strong>2. Instant Refund Processing:</strong> Refunds for prepaid orders (UPI/Card) are credited to original payment instruments within 2-4 business days via automated webhook reconciliation.</p>
                </>
              )}
              {activePolicyKey === 'grievance' && (
                <>
                  <p>In accordance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020:</p>
                  <p><strong>Grievance Officer:</strong> Vikramaditya Rao<br />
                  <strong>Designation:</strong> Head of Statutory Compliance & Consumer Redressal<br />
                  <strong>Email:</strong> grievance@kbonline.internal<br />
                  <strong>Physical Address:</strong> 42, Industrial Layout, Indiranagar, Bengaluru, Karnataka 560038<br />
                  <strong>Statutory SLA:</strong> Acknowledgment within 48 hours; resolution within 15 business days.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
