"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useModalAlert } from '@/components/ModalContext';
import { authFetch } from '@/lib/clientAuth';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { showModal } = useModalAlert();

  const [product, setProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Natural');
  const [cutLength, setCutLength] = useState<number>(1.6);
  const [qty, setQty] = useState<number>(1);
  const [includeFallPico, setIncludeFallPico] = useState<boolean>(false);
  const [includeMatchingBlouse, setIncludeMatchingBlouse] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await authFetch('/api/auth/me');
      const data = await res.json();
      if (data?.authenticated) setUser(data.user);
      else setUser(null);
    } catch (e) {}
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/catalog/products/${id}`);
      const data = await res.json();
      if (data?.product) {
        const p = data.product;
        setProduct(p);
        if (p.sizes?.length > 0) {
          setSelectedSize(p.sizes[0]);
        }
        if (p.colors?.length > 0) {
          setSelectedColor(p.colors[0]);
        }
        if (p.unstitchedDetails?.standardLengthMeters) {
          setCutLength(p.unstitchedDetails.standardLengthMeters);
        } else if (p.availableMeters?.length > 0) {
          setCutLength(p.availableMeters[0]);
        } else if (p.productType === 'MEN_UNSTITCHED') {
          setCutLength(1.6);
        }
        checkWishlist(p.productId);
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
        } catch (e) { }
      }
    }
  };

  const toggleWishlist = () => {
    if (!product || typeof window === 'undefined') return;

    if (!user) {
      showModal({
        type: 'auth',
        title: 'Sign In Required for Wishlist',
        message: 'Please sign in to bookmark and save authentic handloom items to your personal wishlist.',
        primaryBtn: {
          text: 'Sign In to Account →',
          href: `/auth/signin?redirect=${encodeURIComponent('/products/' + product.productId)}&reason=auth_required`,
        },
        secondaryBtn: {
          text: 'Create New Account',
          href: `/auth/signup?redirect=${encodeURIComponent('/products/' + product.productId)}`,
        },
      });
      return;
    }

    const stored = localStorage.getItem('kb_wishlist');
    let list: any[] = stored ? JSON.parse(stored) : [];
    if (isWishlisted) {
      list = list.filter(p => (p.productId || p.id) !== product.productId);
      setIsWishlisted(false);
      showModal({
        type: 'info',
        title: 'Removed from Wishlist',
        message: `"${product.name}" was removed from your wishlist.`,
      });
    } else {
      list.push(product);
      setIsWishlisted(true);
      showModal({
        type: 'success',
        title: 'Saved to Wishlist',
        message: `♥ "${product.name}" has been bookmarked to your wishlist.`,
        primaryBtn: {
          text: 'View Wishlist →',
          href: '/wishlist',
        },
        secondaryBtn: {
          text: 'Continue Browsing',
        },
      });
    }
    localStorage.setItem('kb_wishlist', JSON.stringify(list));
  };

  const isMeterProduct = product?.productType === 'MEN_UNSTITCHED' || product?.unitType === 'METER' || product?.isUnstitched;
  const basePricePerMeter = product?.pricePerMeter || product?.price || 0;
  const currentItemPrice = isMeterProduct
    ? Math.round(basePricePerMeter * cutLength)
    : (product?.price || 0);

  const totalPriceWithAddons = currentItemPrice + (includeFallPico ? 80 : 0) + (includeMatchingBlouse ? 180 : 0);

  const handleAddToBag = async (proceedToCart: boolean = false) => {
    if (!product) return;
    try {
      const itemName = isMeterProduct
        ? `${product.name} (${cutLength}m Cut)`
        : product.name;

      const res = await authFetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          name: itemName,
          price: totalPriceWithAddons,
          size: isMeterProduct ? `${cutLength}m Cut` : selectedSize,
          color: selectedColor,
          qty,
          cutLength: isMeterProduct ? cutLength : null,
          configuration: {
            cutLength: isMeterProduct ? cutLength : null,
            fallPico: includeFallPico,
            matchingBlouse: includeMatchingBlouse,
            chestSize: product.productType === 'INNER_ESSENTIAL' ? selectedSize : null,
            brand: product.brand,
            fabric: product.fabric,
          }
        })
      });
      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        showModal({
          type: 'auth',
          title: 'Sign In Required to Shop',
          message: 'An active account session is required to add items to your shopping bag or proceed to checkout.',
          primaryBtn: {
            text: 'Sign In to Account →',
            href: `/auth/signin?redirect=${encodeURIComponent('/products/' + product.productId)}&reason=auth_required`,
          },
          secondaryBtn: {
            text: 'Create New Account',
            href: `/auth/signup?redirect=${encodeURIComponent('/products/' + product.productId)}`,
          },
        });
        return;
      }

      if (!res.ok) {
        showModal({
          type: 'error',
          title: 'Unable to Add to Bag',
          message: data.error || 'Could not add item to bag. Please try again.',
        });
        return;
      }

      if (proceedToCart) {
        router.push('/cart');
      } else {
        showModal({
          type: 'success',
          title: 'Garment Added to Shopping Bag',
          message: `✓ "${itemName}" has been added to your shopping bag!`,
          primaryBtn: {
            text: 'View Bag & Checkout →',
            href: '/cart',
          },
          secondaryBtn: {
            text: 'Continue Browsing',
          },
        });
      }
    } catch (e: any) {
      showModal({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to the store servers. Please check your connection.',
      });
    }
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
        {/* Left: Product Artwork / Image stored directly in DB */}
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
              {product.origin || 'Kalwaral, Telangana'}
            </div>
            {product.brand && (
              <div className="absolute top-4 right-4 bg-neutral-900 text-white px-3 py-1 rounded-kb-pill text-[10px] font-bold tracking-wider uppercase">
                {product.brand}
              </div>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 text-center font-mono">
            Directly photographed & stored in KB FASHIONS database
          </p>
        </div>

        {/* Right: Specifications, Customization & Ordering */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {product.productType === 'MEN_UNSTITCHED' && (
                <span>✂ 100% Unstitched Fabric by Meter • Master Tailor Cut</span>
              )}
              {product.productType === 'SAREE' && (
                <span>🥻 Authentic Handloom & Festive Saree • 20 Years Craft</span>
              )}
              {product.productType === 'INNER_ESSENTIAL' && (
                <span>🩲 100% Combed Ribbed Cotton Essentials • Village Direct</span>
              )}
              {product.productType === 'DHOTI_TOWEL' && (
                <span>Traditional South Indian Handloom Dhotis & Towels</span>
              )}
              {(product.productType === 'WOMEN_WEAR' || product.productType === 'BLOUSE_PIECE' || product.productType === 'GENERAL') && (
                <span>Village Textile Heritage • 20 Years Craft</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-kbBlack leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">{product.title}</p>
          </div>

          {/* Pricing & GST Exemption Notice */}
          <div className="p-4 bg-kbSurfaceAlt rounded-kb-md border border-kbBorder space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-black">₹{totalPriceWithAddons}</span>
              {isMeterProduct && (
                <span className="text-xs text-neutral-600 font-bold bg-amber-100 px-2.5 py-1 rounded-md">
                  (₹{basePricePerMeter} / Meter × {cutLength}m)
                </span>
              )}
              {product.compareAtPrice && !isMeterProduct && (
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

          {/* ========================================================= */}
          {/* 1. MEN'S UNSTITCHED FABRIC METER SELECTOR */}
          {/* ========================================================= */}
          {isMeterProduct && (
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-kb-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  ✂ Choose Unstitched Cut Length:
                </span>
                <span className="text-[11px] font-semibold text-amber-800">
                  Rate: <strong>₹{basePricePerMeter}/meter</strong>
                </span>
              </div>

              {/* Standard Cut Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { meters: 1.2, label: '1.2m Trouser Cut' },
                  { meters: 1.6, label: '1.6m Full Shirt' },
                  { meters: 2.25, label: '2.25m Kurta Piece' },
                  { meters: 3.0, label: '3.0m Safari Suit' },
                ].map(preset => (
                  <button
                    key={preset.meters}
                    type="button"
                    onClick={() => setCutLength(preset.meters)}
                    className={`py-2 px-2.5 rounded-kb-sm border text-xs font-bold text-center transition-all ${
                      cutLength === preset.meters
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-amber-300 bg-white hover:border-black text-neutral-800'
                    }`}
                  >
                    <div>{preset.meters} Meters</div>
                    <div className="text-[10px] font-normal opacity-80">{preset.label}</div>
                  </button>
                ))}
              </div>

              {/* Custom Meter Adjuster */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs">
                <span className="text-neutral-700 font-medium">Custom Meter Length:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCutLength(Math.max(1.0, parseFloat((cutLength - 0.25).toFixed(2))))}
                    className="w-7 h-7 flex items-center justify-center font-bold bg-white border border-amber-300 rounded hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm px-2 text-neutral-900">{cutLength} m</span>
                  <button
                    type="button"
                    onClick={() => setCutLength(parseFloat((cutLength + 0.25).toFixed(2)))}
                    className="w-7 h-7 flex items-center justify-center font-bold bg-white border border-amber-300 rounded hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Domain Notice for Men's Unstitched Clothes */}
              <div className="text-[11px] text-amber-900 bg-white p-2.5 rounded border border-amber-200/80 leading-relaxed">
                ℹ <strong>Tailor Ready:</strong> In our 20-year village store tradition, men's garments are cut fresh from the master roll ({product.unstitchedDetails?.widthInches || 58}&quot; width). You will receive 1 single uncut piece of exactly {cutLength} meters.
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. SAREE SPECIFICATIONS & FALL-PICO FINISHING */}
          {/* ========================================================= */}
          {product.productType === 'SAREE' && (
            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-kb-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-950 block">
                🥻 Saree Specifications & Traditional Finishes:
              </span>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="text-neutral-500 block">Total Length</span>
                  <strong className="text-neutral-900">{product.sareeDetails?.lengthMeters || 6.3} Meters</strong>
                </div>
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="text-neutral-500 block">Blouse Piece</span>
                  <strong className="text-neutral-900">
                    {product.sareeDetails?.hasBlousePiece ? `Included (${product.sareeDetails?.blouseLengthMeters || 0.8}m unstitched)` : 'No Blouse Piece'}
                  </strong>
                </div>
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="text-neutral-500 block">Border Craft</span>
                  <strong className="text-neutral-900">{product.sareeDetails?.borderType || 'Zari Border'}</strong>
                </div>
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="text-neutral-500 block">Weave Style</span>
                  <strong className="text-neutral-900">{product.sareeDetails?.workType || 'Traditional Weave'}</strong>
                </div>
              </div>

              {/* Fall & Pico Service Toggle */}
              <div className="space-y-2 pt-2 border-t border-rose-200/60">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={includeFallPico}
                    onChange={(e) => setIncludeFallPico(e.target.checked)}
                    className="accent-neutral-900 w-4 h-4 rounded"
                  />
                  <span className="font-medium text-neutral-800">
                    Add Professional <strong>Fall &amp; Pico Service</strong> (+₹80)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={includeMatchingBlouse}
                    onChange={(e) => setIncludeMatchingBlouse(e.target.checked)}
                    className="accent-neutral-900 w-4 h-4 rounded"
                  />
                  <span className="font-medium text-neutral-800">
                    Add Matching <strong>2x2 Rubia Cotton Blouse Piece</strong> (+₹180)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. INNER ESSENTIALS (BANIANS / CHEST SIZES IN CM) */}
          {/* ========================================================= */}
          {product.productType === 'INNER_ESSENTIAL' && (
            <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-kb-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-950">
                  Select Chest Size (Centimeters):
                </span>
                <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  {product.essentialDetails?.packSize ? `Pack of ${product.essentialDetails.packSize}` : 'Hygienic Pack'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(product.essentialDetails?.measurementValues || ['80cm', '85cm', '90cm', '95cm', '100cm']).map((sizeVal: string) => (
                  <button
                    key={sizeVal}
                    type="button"
                    onClick={() => setSelectedSize(sizeVal)}
                    className={`py-2 px-3.5 rounded-kb-sm border text-xs font-bold transition-all ${
                      selectedSize === sizeVal
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-sky-300 bg-white hover:border-black text-neutral-800'
                    }`}
                  >
                    {sizeVal}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-sky-900">
                📏 Traditional Indian Banian Sizing: 80cm (XS/S, 32&quot;), 85cm (S, 34&quot;), 90cm (M, 36&quot;), 95cm (L, 38&quot;), 100cm (XL, 40&quot;).
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. GENERAL GARMENT SIZES (WOMEN'S WEAR, TOPS, LEGGINGS) */}
          {/* ========================================================= */}
          {product.productType !== 'MEN_UNSTITCHED' && product.productType !== 'SAREE' && product.productType !== 'INNER_ESSENTIAL' && product.sizes?.length > 0 && (
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
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-11 px-3 rounded-kb-sm border text-xs font-bold transition-all cursor-pointer ${
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
          )}

          {/* Inline Size Guide Table (Zero Modals) */}
          {showSizeGuide && (
            <div className="p-4 bg-white border border-neutral-300 rounded-kb-md text-xs space-y-3 animate-fadeIn">
              <div className="font-bold text-neutral-900 flex justify-between items-center">
                <span>Standard Village Garment Measurements (Inches)</span>
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
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 flex items-center justify-center font-bold text-sm hover:bg-neutral-200 rounded-full"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold">{qty}</span>
              <button
                type="button"
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
              type="button"
              id="add-to-bag-btn"
              onClick={() => handleAddToBag(false)}
              className="flex-1 bg-kb-blue text-white hover:bg-blue-600 font-semibold text-sm py-4 rounded-kb-pill transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>+ Add to Shopping Bag</span>
            </button>
            <button
              type="button"
              id="buy-now-btn"
              onClick={() => handleAddToBag(true)}
              className="flex-1 bg-kb-black text-white hover:bg-neutral-800 font-semibold text-sm py-4 rounded-kb-pill transition-all text-center"
            >
              Buy Now (Proceed to Checkout) →
            </button>
            <button
              type="button"
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
              <summary className="font-bold text-neutral-900 py-1">Fabric &amp; Traditional Care</summary>
              <p className="text-neutral-500 mt-2 leading-relaxed">
                {product.fabricCare || 'Pure South Handloom Combed Cotton. Machine wash gentle in cold water with similar tones. Dry in shade to preserve organic fiber integrity.'}
              </p>
            </details>

            <details className="border-b border-kbBorder pb-3 cursor-pointer" open>
              <summary className="font-bold text-neutral-900 py-1">Seller &amp; Origin Specifications</summary>
              <div className="text-neutral-600 mt-2 space-y-1 font-mono text-[11px]">
                <div>Manufactured &amp; Sold By: <strong>KB FASHIONS</strong></div>
                <div>Physical Address: 3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145</div>
                <div>Contact: +91 7989768200 | kb.official.admin@gmail.com</div>
              </div>
            </details>

            <details className="border-b border-kbBorder pb-3 cursor-pointer">
              <summary className="font-bold text-neutral-900 py-1">Express Delivery &amp; Returns</summary>
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
