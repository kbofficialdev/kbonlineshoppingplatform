"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Natural');
  const [qty, setQty] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/catalog/products/${id}`);
      const data = await res.json();
      if (data?.product) {
        setProduct(data.product);
        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
        checkWishlist(data.product.productId);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const checkWishlist = (productId: string) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kb_wishlist');
      if (stored) {
        try {
          const list: any[] = JSON.parse(stored);
          setIsWishlisted(list.some(p => (p.productId || p.id) === productId));
        } catch (e) {}
      }
    }
  };

  const toggleWishlist = () => {
    if (!product || typeof window === 'undefined') return;
    const stored = localStorage.getItem('kb_wishlist');
    let list: any[] = stored ? JSON.parse(stored) : [];
    if (isWishlisted) {
      list = list.filter(p => (p.productId || p.id) !== product.productId);
      setIsWishlisted(false);
    } else {
      list.push(product);
      setIsWishlisted(true);
    }
    localStorage.setItem('kb_wishlist', JSON.stringify(list));
  };

  const handleAddToBag = async (proceedToCart: boolean = false) => {
    if (!product) return;
    try {
      await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          name: product.name,
          price: product.price,
          size: selectedSize,
          color: selectedColor,
          qty,
        })
      });

      if (proceedToCart) {
        router.push('/cart');
      } else {
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 3500);
      }
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Loading authentic village product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">The requested garment could not be found in our database.</p>
        <Link href="/search?category=All" className="inline-block mt-4 bg-black text-white text-xs font-bold px-6 py-3 rounded-full">
          Browse All Collections
        </Link>
      </div>
    );
  }

  const imageSrc = product.images?.[0]?.data || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-kb-pill text-xs font-bold shadow-2xl flex items-center gap-3">
          <span>✓ Added {qty}x to your bag!</span>
          <Link href="/cart" className="underline text-emerald-400 font-bold">Go to Bag →</Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-black">{product.category}</Link>
        <span>/</span>
        <span className="text-neutral-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Dedicated PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left: Product Artwork / Image stored in DB */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-kbCardBg rounded-kb-md border border-kbBorder overflow-hidden relative shadow-sm">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-neutral-300">
                KB
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-kb-pill text-[10px] font-bold border border-kbBorder">
              {product.origin}
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 text-center font-mono">
            Directly photographed & stored in KB FASHIONS database
          </p>
        </div>

        {/* Right: Specifications, Sizing, and Ordering */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Village Textile Heritage • 20 Years Craft</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-kbBlack leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">{product.title}</p>
          </div>

          {/* Pricing & GST Exemption Notice */}
          <div className="p-4 bg-kbSurfaceAlt rounded-kb-md border border-kbBorder space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-black">₹{product.price}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-neutral-400 line-through">₹{product.compareAtPrice}</span>
              )}
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Village Direct Price
              </span>
            </div>
            <div className="text-[11px] text-neutral-500">
              ✓ Net retail price • <strong>GST Exempted</strong> small enterprise under Section 23 of CGST Act. No extra tax charged.
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Select Size:</span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-xs font-semibold text-neutral-600 hover:text-black underline flex items-center gap-1"
              >
                📏 {showSizeGuide ? 'Hide Measurements' : 'View Standard Size Guide'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes?.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-11 rounded-kb-sm border text-xs font-bold transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-kbBorder hover:border-black text-neutral-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Inline Size Guide Table (In-Page Accordion, Zero Modals!) */}
          {showSizeGuide && (
            <div className="p-4 bg-white border border-neutral-300 rounded-kb-md text-xs space-y-3 animate-fadeIn">
              <div className="font-bold text-neutral-900 flex justify-between items-center">
                <span>Standard Garment Measurements (Inches)</span>
                <span className="text-[10px] text-neutral-400 font-normal">Chest / Length / Shoulder</span>
              </div>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="py-1.5">Size</th>
                    <th className="py-1.5">Chest</th>
                    <th className="py-1.5">Length</th>
                    <th className="py-1.5">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr><td className="py-1.5 font-bold">S</td><td>38 in</td><td>28 in</td><td>17.5 in</td></tr>
                  <tr><td className="py-1.5 font-bold">M</td><td>40 in</td><td>29 in</td><td>18.0 in</td></tr>
                  <tr><td className="py-1.5 font-bold">L</td><td>42 in</td><td>30 in</td><td>18.5 in</td></tr>
                  <tr><td className="py-1.5 font-bold">XL</td><td>44 in</td><td>31 in</td><td>19.0 in</td></tr>
                  <tr><td className="py-1.5 font-bold">XXL</td><td>46 in</td><td>32 in</td><td>19.5 in</td></tr>
                </tbody>
              </table>
              <p className="text-[10px] text-neutral-500">
                Fit: Regular comfortable fit with allowances for natural cotton relaxation.
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Quantity:</span>
            <div className="flex items-center border border-kbBorder rounded-kb-pill px-2 py-1 bg-kbLight">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 flex items-center justify-center font-bold text-sm hover:bg-neutral-200 rounded-full"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 flex items-center justify-center font-bold text-sm hover:bg-neutral-200 rounded-full"
              >
                +
              </button>
            </div>
            <span className="text-xs text-emerald-800 font-semibold">
              ✓ In Stock ({product.stockQuantity} available at Kalwaral store)
            </span>
          </div>

          {/* Action Buttons: Add to Bag & Buy Now */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => handleAddToBag(false)}
              className="flex-1 bg-kbBlack text-white hover:bg-neutral-800 font-bold text-xs py-4 rounded-kb-pill transition-all"
            >
              + Add to Shopping Bag
            </button>
            <button
              onClick={() => handleAddToBag(true)}
              className="flex-1 bg-emerald-800 text-white hover:bg-emerald-900 font-bold text-xs py-4 rounded-kb-pill transition-all"
            >
              Buy Now (Proceed to Checkout) →
            </button>
            <button
              onClick={toggleWishlist}
              className={`w-12 h-12 rounded-full border border-kbBorder flex items-center justify-center text-base transition-colors ${
                isWishlisted ? 'text-red-500 border-red-300 bg-red-50' : 'hover:border-black'
              }`}
              title="Bookmark in Wishlist"
            >
              {isWishlisted ? '♥' : '♡'}
            </button>
          </div>

          {/* Accordion / Details */}
          <div className="border-t border-kbBorder pt-6 space-y-4 text-xs">
            <details className="border-b border-kbBorder pb-3 cursor-pointer" open>
              <summary className="font-bold text-neutral-900 py-1">Fabric & Traditional Care</summary>
              <p className="text-neutral-500 mt-2 leading-relaxed">
                {product.fabricCare || 'Pure South Handloom Combed Cotton. Machine wash gentle in cold water with similar tones. Dry in shade to preserve organic fiber integrity.'}
              </p>
            </details>

            <details className="border-b border-kbBorder pb-3 cursor-pointer" open>
              <summary className="font-bold text-neutral-900 py-1">Seller & Origin Specifications</summary>
              <div className="text-neutral-600 mt-2 space-y-1 font-mono text-[11px]">
                <div>Manufactured & Sold By: <strong>KB FASHIONS</strong></div>
                <div>Physical Address: 3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145</div>
                <div>Contact: +91 7989768200 | kb.official.admin@gmail.com</div>
              </div>
            </details>

            <details className="border-b border-kbBorder pb-3 cursor-pointer">
              <summary className="font-bold text-neutral-900 py-1">Express Delivery & Returns</summary>
              <p className="text-neutral-500 mt-2 leading-relaxed">
                Dispatched directly from our Kamareddy district facility within 24 hours. Orders over ₹999 qualify for Free Express Shipping. 7-day hassle-free replacement or return if not satisfied.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
