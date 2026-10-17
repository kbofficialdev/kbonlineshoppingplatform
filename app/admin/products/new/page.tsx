"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';

export default function AdminNewProductPage() {
  const router = useRouter();

  // Basic Info
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sarees');
  const [productType, setProductType] = useState<string>('SAREE');
  const [brand, setBrand] = useState('KB FASHIONS');
  const [fabric, setFabric] = useState('Pure Cotton');
  const [unitType, setUnitType] = useState<'PIECE' | 'METER'>('PIECE');
  const [price, setPrice] = useState('899');
  const [pricePerMeter, setPricePerMeter] = useState('550');
  const [compareAtPrice, setCompareAtPrice] = useState('1299');
  const [stockQuantity, setStockQuantity] = useState('30');
  const [description, setDescription] = useState('');
  const [fabricCare, setFabricCare] = useState('Gentle cold wash with similar colors. Dry in shade.');
  const [origin, setOrigin] = useState('Kalwaral, Telangana, India');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageData, setImageData] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Domain-specific fields
  // 1. Saree
  const [sareeLength, setSareeLength] = useState('6.3');
  const [sareeHasBlouse, setSareeHasBlouse] = useState(true);
  const [sareeBlouseLength, setSareeBlouseLength] = useState('0.8');
  const [sareeWorkType, setSareeWorkType] = useState('Gadwal Handloom Weave');
  const [sareeBorderType, setSareeBorderType] = useState('Temple Zari Border');
  const [sareePallu, setSareePallu] = useState('Rich Contrast Zari Pallu');

  // 2. Men's Unstitched
  const [fabricCutType, setFabricCutType] = useState('Shirt Piece');
  const [fabricWidth, setFabricWidth] = useState('58');
  const [standardCutMeters, setStandardCutMeters] = useState('1.6');
  const [recommendedUse, setRecommendedUse] = useState('Office & Festive Wear');

  // 3. Inner Essentials
  const [packSize, setPackSize] = useState('3');
  const [chestSizes, setChestSizes] = useState('80cm, 85cm, 90cm, 95cm, 100cm');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle product type changes automatically synchronizing unitType & defaults
  const handleProductTypeChange = (type: string) => {
    setProductType(type);
    if (type === 'MEN_UNSTITCHED') {
      setUnitType('METER');
      setCategory("Men's Unstitched");
      setBrand('Raymond');
      setFabric('Super 120s Poly-Viscose / Arvind Cotton');
    } else if (type === 'SAREE') {
      setUnitType('PIECE');
      setCategory('Sarees');
      setBrand('Gadwal Weavers');
      setFabric('Handloom Cotton Silk');
    } else if (type === 'INNER_ESSENTIAL') {
      setUnitType('PIECE');
      setCategory('Inners & Essentials');
      setBrand('KB FASHIONS');
      setFabric('100% Combed Ribbed Cotton');
    } else if (type === 'DHOTI_TOWEL') {
      setUnitType('PIECE');
      setCategory('Dhotis & Towels');
      setBrand('KB FASHIONS');
      setFabric('Pure South Indian Handloom Cotton');
    } else if (type === 'BLOUSE_PIECE') {
      setUnitType('PIECE');
      setCategory('Blouse & Matching');
      setBrand('KB FASHIONS');
      setFabric('2x2 Rubia Heavy Cotton');
    } else if (type === 'WOMEN_WEAR') {
      setUnitType('PIECE');
      setCategory("Women's Wear");
      setBrand('KB FASHIONS');
      setFabric('Pure Bio-Wash Cotton');
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

  const handleGenerateDefaultArtwork = () => {
    const isUnstitched = unitType === 'METER' || productType === 'MEN_UNSTITCHED';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
      <defs>
        <linearGradient id="clothBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${isUnstitched ? '#1e293b' : '#312e81'}"/>
          <stop offset="100%" stop-color="${isUnstitched ? '#0f172a' : '#1e1b4b'}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="480" fill="url(#clothBg)"/>
      <circle cx="200" cy="180" r="90" fill="#f59e0b" opacity="0.15"/>
      <rect x="50" y="50" width="300" height="260" rx="12" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="200" y="170" font-family="Inter, sans-serif" font-size="20" font-weight="900" fill="#f8fafc" text-anchor="middle">${brand}</text>
      <text x="200" y="200" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">${isUnstitched ? '100% UNSTITCHED FABRIC BOLT' : productType}</text>
      <rect x="30" y="380" width="340" height="60" rx="8" fill="#ffffff" opacity="0.95"/>
      <text x="45" y="410" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#0f172a">${name || 'Authentic Village Garment'}</text>
      <text x="45" y="428" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#64748b">KB FASHIONS • Kalwaral, Kamareddy</text>
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
      setErrorMsg('Please upload an image or click "Generate Village Vector Artwork" to store image directly in database');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const isUnstitched = unitType === 'METER' || productType === 'MEN_UNSTITCHED';

      const payload: any = {
        name: name.trim(),
        title: title.trim() || name.trim(),
        description: description.trim(),
        price: isUnstitched ? parseFloat(pricePerMeter) : parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        category,
        productType,
        brand,
        fabric,
        isUnstitched,
        unitType,
        pricePerMeter: isUnstitched ? parseFloat(pricePerMeter) : null,
        availableMeters: isUnstitched ? [1.2, 1.6, 2.25, 3.0, 5.0] : [],
        stockQuantity: parseInt(stockQuantity, 10),
        fabricCare,
        origin,
        isFeatured,
        tags: [brand, category, isUnstitched ? 'Unstitched Fabric' : 'Ready Wear'],
        sizes: productType === 'INNER_ESSENTIAL' 
          ? chestSizes.split(',').map(s => s.trim()).filter(Boolean)
          : isUnstitched 
            ? ['1.2m Cut', '1.6m Cut', '2.25m Cut', '3.0m Cut']
            : ['S', 'M', 'L', 'XL', 'Free Size'],
        colors: ['Natural', 'Navy', 'Ochre', 'Maroon'],
        imageData,
      };

      if (productType === 'SAREE') {
        payload.sareeDetails = {
          lengthMeters: parseFloat(sareeLength),
          hasBlousePiece: sareeHasBlouse,
          blouseLengthMeters: sareeHasBlouse ? parseFloat(sareeBlouseLength) : 0,
          workType: sareeWorkType,
          borderType: sareeBorderType,
          palluDetails: sareePallu,
        };
      }

      if (isUnstitched) {
        payload.unstitchedDetails = {
          fabricCutType,
          widthInches: parseFloat(fabricWidth),
          standardLengthMeters: parseFloat(standardCutMeters),
          recommendedUse,
        };
      }

      if (productType === 'INNER_ESSENTIAL') {
        payload.essentialDetails = {
          packSize: parseInt(packSize, 10),
          measurementUnit: 'cm',
          measurementValues: chestSizes.split(',').map(s => s.trim()).filter(Boolean),
        };
      }

      const res = await authFetch('/api/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-kbBorder pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-black text-kbBlack">Add Village Garment or Fabric</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Zero-modal administration • Saved directly into PostgreSQL database
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
        {/* Department / Product Type Selector */}
        <div className="p-4 bg-neutral-50 rounded-kb-md border border-neutral-200 space-y-3">
          <label className="font-black text-sm text-neutral-900 block">
            1. Select Inventory Department / Product Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { type: 'SAREE', label: '🥻 Saree (Gadwal, Pattu, Nirma)' },
              { type: 'MEN_UNSTITCHED', label: '✂ Men’s Unstitched (Raymond)' },
              { type: 'WOMEN_WEAR', label: '👗 Women’s Wear & Tops' },
              { type: 'BLOUSE_PIECE', label: '🧵 Blouse & Matching Bits' },
              { type: 'DHOTI_TOWEL', label: '🪙 Dhotis & Towels' },
              { type: 'INNER_ESSENTIAL', label: '🩲 Inners & Banians (cm)' },
              { type: 'GENERAL', label: '📦 General Accessories' },
            ].map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleProductTypeChange(item.type)}
                className={`p-2.5 rounded-kb-sm border text-left font-bold text-xs transition-all ${
                  productType === item.type
                    ? 'border-black bg-black text-white shadow-sm'
                    : 'border-neutral-300 bg-white hover:border-black text-neutral-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Product Title / Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Raymond Unstitched Formal Shirting Fabric (100% Cotton)"
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Brand *</label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Raymond, Arvind, Siyaram's, Gadwal Weavers, KB FASHIONS"
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Fabric Composition *</label>
            <input
              type="text"
              required
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="e.g. 100% Giza Cotton / Silk Blend"
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Selling Unit Mode *</label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value as 'PIECE' | 'METER')}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            >
              <option value="PIECE">By Piece / Garment</option>
              <option value="METER">By Meter (Custom Tailor Cuts)</option>
            </select>
          </div>

          {unitType === 'METER' ? (
            <div>
              <label className="font-bold text-amber-950 block mb-1">Rate Per Meter (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={pricePerMeter}
                onChange={(e) => setPricePerMeter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-kb-sm border border-amber-300 bg-amber-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-mono font-bold"
              />
            </div>
          ) : (
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
          )}

          <div>
            <label className="font-bold text-neutral-700 block mb-1">
              Stock ({unitType === 'METER' ? 'Meters Available' : 'Units in Store'}) *
            </label>
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
            <label className="font-bold text-neutral-700 block mb-1">Compare-at Struck Price (₹)</label>
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="e.g. 1499"
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
              placeholder="Detail the weave, texture, feel, and craftsmanship..."
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            ></textarea>
          </div>
        </div>

        {/* 2. Type-Specific Specifications */}
        {unitType === 'METER' && (
          <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-kb-md space-y-3">
            <h3 className="font-black text-xs text-amber-950 uppercase tracking-wider">
              ✂ Unstitched Bolt Fabric Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-amber-900 block mb-1">Width (Inches)</label>
                <input
                  type="number"
                  value={fabricWidth}
                  onChange={(e) => setFabricWidth(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-amber-200 bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-amber-900 block mb-1">Standard Cut (Meters)</label>
                <input
                  type="number"
                  step="0.05"
                  value={standardCutMeters}
                  onChange={(e) => setStandardCutMeters(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-amber-200 bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-amber-900 block mb-1">Recommended Tailoring</label>
                <input
                  type="text"
                  value={recommendedUse}
                  onChange={(e) => setRecommendedUse(e.target.value)}
                  placeholder="e.g. Formal Trouser, Office Shirt"
                  className="w-full px-3 py-2 rounded border border-amber-200 bg-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {productType === 'SAREE' && (
          <div className="p-4 bg-rose-50/70 border border-rose-300 rounded-kb-md space-y-3">
            <h3 className="font-black text-xs text-rose-950 uppercase tracking-wider">
              🥻 Saree Craft &amp; Weave Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-rose-900 block mb-1">Total Saree Length (Meters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sareeLength}
                  onChange={(e) => setSareeLength(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-rose-200 bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-rose-900 block mb-1">Border Craft Type</label>
                <input
                  type="text"
                  value={sareeBorderType}
                  onChange={(e) => setSareeBorderType(e.target.value)}
                  placeholder="e.g. Temple Zari Border"
                  className="w-full px-3 py-2 rounded border border-rose-200 bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-rose-900 block mb-1">Pallu Craft Details</label>
                <input
                  type="text"
                  value={sareePallu}
                  onChange={(e) => setSareePallu(e.target.value)}
                  placeholder="e.g. Rich Contrast Zari Pallu"
                  className="w-full px-3 py-2 rounded border border-rose-200 bg-white text-xs"
                />
              </div>
              <div className="sm:col-span-3 flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={sareeHasBlouse}
                    onChange={(e) => setSareeHasBlouse(e.target.checked)}
                    className="accent-black w-4 h-4"
                  />
                  <span>Includes Unstitched Blouse Piece ({sareeBlouseLength}m)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {productType === 'INNER_ESSENTIAL' && (
          <div className="p-4 bg-sky-50/70 border border-sky-300 rounded-kb-md space-y-3">
            <h3 className="font-black text-xs text-sky-950 uppercase tracking-wider">
              🩲 Daily Essentials &amp; Banian Chest Sizing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-sky-900 block mb-1">Pack Size (Items per Box)</label>
                <input
                  type="number"
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-sky-200 bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-sky-900 block mb-1">Chest Sizes in cm (Comma-separated)</label>
                <input
                  type="text"
                  value={chestSizes}
                  onChange={(e) => setChestSizes(e.target.value)}
                  placeholder="80cm, 85cm, 90cm, 95cm, 100cm"
                  className="w-full px-3 py-2 rounded border border-sky-200 bg-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Image Upload / Vector Artwork Stored in Database */}
        <div className="border-t border-kbBorder pt-6 space-y-3">
          <label className="font-black text-sm text-neutral-900 block">
            3. Photograph or Vector Artwork (Saved in PostgreSQL Database) *
          </label>
          <p className="text-[11px] text-neutral-500">
            Images are persisted directly as base64 or vector data inside PostgreSQL database table.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-32 h-40 bg-kbCardBg border border-kbBorder rounded-kb-md overflow-hidden flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-neutral-400 font-bold text-xs">No Image</span>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-kb-pill file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800"
              />

              <div className="flex items-center gap-2">
                <span className="text-neutral-400">— or —</span>
                <button
                  type="button"
                  onClick={handleGenerateDefaultArtwork}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-4 py-2 rounded-kb-pill transition-all"
                >
                  🎨 Generate Village Vector Artwork
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-kbBorder pt-6 flex justify-between items-center">
          <Link href="/admin/products" className="text-neutral-500 hover:text-black font-semibold">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-bold px-8 py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving to Database...' : 'Save Product to Storefront →'}
          </button>
        </div>
      </form>
    </div>
  );
}
