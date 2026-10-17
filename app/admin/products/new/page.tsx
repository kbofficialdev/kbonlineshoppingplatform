"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Men');
  const [price, setPrice] = useState('799');
  const [compareAtPrice, setCompareAtPrice] = useState('1199');
  const [stockQuantity, setStockQuantity] = useState('30');
  const [description, setDescription] = useState('');
  const [fabricCare, setFabricCare] = useState('100% Pure Combed Cotton. Machine wash gentle with cold water.');
  const [origin, setOrigin] = useState('Kalwaral, Telangana, India');
  const [imageData, setImageData] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File upload reader storing directly to base64
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

  // Quick default SVG artwork generator for convenience
  const handleGenerateDefaultArtwork = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
      <rect width="400" height="480" fill="#f4f1de"/>
      <path d="M140 100 Q200 130 260 100 L320 150 L280 200 L250 180 L250 410 L150 410 L150 180 L120 200 L80 150 Z" 
            fill="#3d405b" stroke="#111111" stroke-width="2.5"/>
      <rect x="30" y="30" width="140" height="26" rx="13" fill="#111111"/>
      <text x="100" y="47" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">KB FASHIONS</text>
      <rect x="25" y="430" width="350" height="32" rx="6" fill="#ffffff" stroke="#e8e8e8"/>
      <text x="40" y="451" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#111111">${name || 'Village Craft Apparel'}</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setImageData(dataUrl);
    setImagePreview(dataUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setErrorMsg('Please enter both name and description');
      return;
    }
    if (!imageData) {
      setErrorMsg('Please upload an image or click "Generate Village Vector Artwork" to store image in database');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim() || name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          category,
          stockQuantity: parseInt(stockQuantity, 10),
          fabricCare,
          origin,
          tags: ['Handloom', 'Village Craft', category],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Natural', 'Charcoal', 'Indigo'],
          imageData,
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
      } else {
        setErrorMsg(data.error || 'Failed to save product');
        setIsSubmitting(false);
      }
    } catch (e: any) {
      setErrorMsg('Error communicating with server');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-kbBorder pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-black text-kbBlack">Add New Garment to Catalog</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Data and images are saved directly into the PostgreSQL database
          </p>
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
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Product Title / Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Telangana Handspun Khadi Kurta"
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
            <label className="font-bold text-neutral-700 block mb-1">Stock Quantity (In Village Store) *</label>
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
            <label className="font-bold text-neutral-700 block mb-1">Compare-at Struck Price (₹)</label>
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="e.g. 1199"
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
              placeholder="Detail the fabric weave, fit, and village craftsmanship..."
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            ></textarea>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Origin / Artisan Details</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Fabric Care Instructions</label>
            <input
              type="text"
              value={fabricCare}
              onChange={(e) => setFabricCare(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>
        </div>

        {/* Database-Stored Image Section */}
        <div className="border-t border-kbBorder pt-6 space-y-4">
          <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
            Garment Image (Stored Directly in PostgreSQL)
          </h3>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {imagePreview ? (
              <div className="w-36 h-44 rounded-kb-sm border border-kbBorder overflow-hidden bg-kbCardBg relative shadow-sm">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageData(''); setImagePreview(null); }}
                  className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-36 h-44 rounded-kb-sm border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 p-2 text-center text-[10px]">
                <span>No image selected</span>
              </div>
            )}

            <div className="flex-1 space-y-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Upload Device File (PNG, JPG, SVG)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                />
              </div>

              <div className="text-neutral-400 text-[11px]">— or generate a curated village vector artwork —</div>

              <button
                type="button"
                onClick={handleGenerateDefaultArtwork}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2 rounded-kb-pill transition-all"
              >
                🎨 Generate Vector Apparel Artwork for DB
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
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
            {isSubmitting ? 'Saving to Database...' : 'Save Product to Database'}
          </button>
        </div>
      </form>
    </div>
  );
}
