"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastContext';
import { useModalAlert } from '@/components/ModalContext';
import { authFetch } from '@/lib/clientAuth';
import CircularContentLoader from '@/components/CircularContentLoader';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { showToast } = useToast();
  const { showModal } = useModalAlert();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('Natural');
  const [selectedSize, setSelectedSize] = useState<string>('Free Size');
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

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
        const p = data.product;
        setProduct(p);

        // Primary image
        const primaryImg = p.images?.[0]?.data || `/api/media/${p.productId || p.id}`;
        setSelectedImage(primaryImg);

        if (p.colors && p.colors.length > 0) {
          setSelectedColor(p.colors[0]);
        }
        if (p.sizes && p.sizes.length > 0) {
          setSelectedSize(p.sizes[0]);
        }

        // Check wishlist
        checkWishlist(p.productId || p.id);
      }
    } catch (e) {
      console.error('Error fetching product:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkWishlist = (pId: string) => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list) && list.some((item: any) => (item.id === pId || item.productId === pId))) {
            setIsWishlisted(true);
          }
        }
      }
    } catch (e) {}
  };

  const toggleWishlist = () => {
    if (!product || typeof window === 'undefined') return;
    const pId = product.productId || product.id;
    try {
      const stored = localStorage.getItem('kb_wishlist');
      let list: any[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      if (isWishlisted) {
        list = list.filter((item: any) => (item.id !== pId && item.productId !== pId));
        setIsWishlisted(false);
        showToast({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `"${product.name}" removed from wishlist.`,
        });
      } else {
        list.push({
          id: pId,
          productId: pId,
          title: product.title || product.name,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          category: product.category,
          imageUrl: selectedImage,
          rating: product.rating || 4.6,
          reviews: product.reviews || 120,
        });
        setIsWishlisted(true);
        showToast({
          type: 'success',
          title: 'Saved to Wishlist',
          message: `"${product.name}" added to your wishlist.`,
        });
      }
      localStorage.setItem('kb_wishlist', JSON.stringify(list));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (e) {}
  };

  const handleAddToCart = async (buyNow = false) => {
    if (!product) return;
    try {
      setIsAdding(true);
      const res = await authFetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId || product.id,
          name: product.name,
          price: product.price,
          size: selectedSize,
          color: selectedColor,
          qty: quantity,
        }),
      });

      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        showModal({
          type: 'auth',
          title: 'Sign In Required',
          message: 'Please sign in to add items to your shopping bag.',
          primaryBtn: {
            text: 'Sign In →',
            href: `/auth/signin?redirect=${encodeURIComponent(`/products/${product.productId || product.id}`)}`,
          },
          secondaryBtn: {
            text: 'Register',
            href: `/auth/signup?redirect=${encodeURIComponent(`/products/${product.productId || product.id}`)}`,
          },
        });
        return;
      }

      if (!res.ok) {
        showToast({
          type: 'error',
          title: 'Cart Error',
          message: data.error || 'Could not add item to bag.',
        });
        return;
      }

      showToast({
        type: 'success',
        title: 'Added to Bag',
        message: `✓ Added ${quantity}x "${product.name}" to your bag.`,
      });

      if (buyNow) {
        router.push('/checkout');
      }
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to store server.',
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <CircularContentLoader message="Loading authentic product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">The requested garment could not be found in our catalog.</p>
        <Link
          href="/search"
          className="mt-6 inline-block bg-[#3478F6] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-xs"
        >
          Explore Catalog →
        </Link>
      </div>
    );
  }

  // Gallery thumbnails
  const galleryImages = [
    selectedImage,
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1610030469854-4638706346aa?auto=format&fit=crop&w=600&q=80',
  ];

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Breadcrumb Navigation matching approved mockup */}
      <nav className="text-xs text-neutral-500 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>&gt;</span>
        <Link href="/search?category=Sarees" className="hover:text-blue-600 transition-colors">Women</Link>
        <span>&gt;</span>
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 transition-colors">
          {product.category}
        </Link>
        <span>&gt;</span>
        <span className="text-neutral-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout (2 Columns matching mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT GALLERY: Vertical thumbnail strip (4 items) + Large preview (LG: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
          
          {/* Vertical Thumbnail Strip */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === img
                    ? 'border-[#3478F6] ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>

          {/* Main Large Product Photograph */}
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-xs">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            />
            {discountPercent && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-xs">
                {discountPercent}% OFF
              </div>
            )}
          </div>

        </div>

        {/* RIGHT INFO SECTION (LG: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Title, Share & Wishlist Row */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={toggleWishlist}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`p-2.5 rounded-full border transition-all ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-slate-200 hover:border-neutral-900 text-neutral-600'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Rating & Stock Status */}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <span>★ {product.rating || 4.6}</span>
                <span className="text-neutral-500 font-medium">({product.reviews || 120} reviews)</span>
              </div>
              <span className="text-neutral-300">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                In Stock ({product.stockQuantity || 25} available)
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 pt-1 border-t border-slate-100">
            <span className="text-3xl font-black text-neutral-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-neutral-400 line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent && (
              <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description || "Premium handcrafted fabric with generational village weaving heritage. Suitable for festive wear, weddings, and daily traditional celebrations."}
          </p>

          {/* Color Variant Picker matching mockup */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-neutral-800">
                Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.colors.map((c: string, idx: number) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedColor === c
                        ? 'border-[#3478F6] bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-neutral-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-neutral-800">Quantity</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-600 hover:bg-slate-100 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-black text-neutral-900 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 10, quantity + 1))}
                  className="px-3 py-2 text-neutral-600 hover:bg-slate-100 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-neutral-400">
                Max {product.stockQuantity || 10} per order
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart + Buy Now matching mockup */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              disabled={isAdding}
              onClick={() => handleAddToCart(false)}
              className="w-full py-3 px-4 rounded-xl border-2 border-neutral-900 bg-white text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-50 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={isAdding}
              onClick={() => handleAddToCart(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#3478F6] text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges Strip (Approved Mockup Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200">
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base mb-1">🚚</span>
              <span className="text-[11px] font-bold text-neutral-800">Free Shipping</span>
              <span className="text-[9px] text-neutral-400">Above ₹999</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base mb-1">🔄</span>
              <span className="text-[11px] font-bold text-neutral-800">Easy Returns</span>
              <span className="text-[9px] text-neutral-400">7 Days</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base mb-1">💵</span>
              <span className="text-[11px] font-bold text-neutral-800">Cash on Delivery</span>
              <span className="text-[9px] text-neutral-400">Available</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base mb-1">🔒</span>
              <span className="text-[11px] font-bold text-neutral-800">Secure Payment</span>
              <span className="text-[9px] text-neutral-400">100% Safe</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
