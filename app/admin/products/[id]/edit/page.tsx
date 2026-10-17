"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('Men');
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setName(p.name);
        setPrice(p.price.toString());
        setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice.toString() : '');
        setStockQuantity(p.stockQuantity.toString());
        setCategory(p.category);
        setDescription(p.description);
        if (p.images?.[0]?.data) {
          setImagePreview(p.images[0].data);
        }
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageData(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload: any = {
        name: name.trim(),
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stockQuantity: parseInt(stockQuantity, 10),
        category,
        description: description.trim(),
      };
      if (imageData) {
        payload.imageData = imageData;
      }

      const res = await fetch(`/api/catalog/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        setErrorMsg(data.error || 'Failed to update product');
        setIsSubmitting(false);
      }
    } catch (e: any) {
      setErrorMsg('Error communicating with server');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-kbBorder pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-black text-kbBlack">Edit Garment Details</h1>
          <p className="text-xs text-neutral-500 mt-1">Updating product #{id} in database</p>
        </div>
        <Link href="/admin/products" className="text-xs font-bold text-neutral-600 hover:text-black underline">
          ← Back to Inventory
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-4 rounded-kb-md">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg space-y-6 shadow-sm text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Product Title / Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Ethnic & Traditional">Ethnic & Traditional</option>
              <option value="Daily Wear">Daily Wear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Stock Quantity *</label>
            <input
              type="number"
              required
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Retail Price (₹) *</label>
            <input
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Compare-at Price (₹)</label>
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            ></textarea>
          </div>
        </div>

        {/* Image preview & replacement */}
        <div className="border-t border-kbBorder pt-6 space-y-4">
          <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
            Replace Garment Image in Database
          </h3>
          <div className="flex gap-6 items-center">
            {imagePreview && (
              <div className="w-24 h-28 rounded-kb-sm border border-kbBorder overflow-hidden bg-kbCardBg">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="text-xs text-neutral-500"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-kbBorder flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-kb-pill border border-kbBorder font-bold text-neutral-600 hover:text-black"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-8 py-3 rounded-kb-pill font-bold hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
