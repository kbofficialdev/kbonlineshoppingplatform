"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';

const PHOTOGRAPHY_PRESETS = [
  {
    name: 'Banarasi Silk Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    type: 'SAREE',
    category: 'Sarees',
    brand: 'Gadwal Weavers',
    price: '2499',
  },
  {
    name: 'Kanjivaram Festive Saree',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    type: 'SAREE',
    category: 'Sarees',
    brand: 'KB FASHIONS',
    price: '3499',
  },
  {
    name: 'Handloom Cotton Kurti',
    url: 'https://images.unsplash.com/photo-1596783049554-460613241b7f?auto=format&fit=crop&w=800&q=80',
    type: 'WOMEN_WEAR',
    category: "Women's Wear",
    brand: 'KB FASHIONS',
    price: '1199',
  },
  {
    name: 'Raymond Formal Suiting Fabric',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    type: 'MEN_UNSTITCHED',
    category: "Men's Unstitched",
    brand: 'Raymond',
    price: '550',
  },
];

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

  // Image Inputs (Local file upload or External URL)
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageData, setImageData] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Saree fields
  const [sareeLength, setSareeLength] = useState('6.3');
  const [sareeHasBlouse, setSareeHasBlouse] = useState(true);
  const [sareeBlouseLength, setSareeBlouseLength] = useState('0.8');
  const [sareeWorkType, setSareeWorkType] = useState('Gadwal Handloom Weave');
  const [sareeBorderType, setSareeBorderType] = useState('Temple Zari Border');
  const [sareePallu, setSareePallu] = useState('Rich Contrast Zari Pallu');

  // Men's Unstitched
  const [fabricCutType, setFabricCutType] = useState('Shirt Piece');
  const [fabricWidth, setFabricWidth] = useState('58');
  const [standardCutMeters, setStandardCutMeters] = useState('1.6');
  const [recommendedUse, setRecommendedUse] = useState('Office & Festive Wear');

  // Inner Essentials
  const [packSize, setPackSize] = useState('3');
  const [chestSizes, setChestSizes] = useState('80cm, 85cm, 90cm, 95cm, 100cm');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setImageUrl('');
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: typeof PHOTOGRAPHY_PRESETS[0]) => {
    setImageUrl(preset.url);
    setImageData('');
    setImagePreview(preset.url);
    setName(preset.name);
    setCategory(preset.category);
    setProductType(preset.type);
    setBrand(preset.brand);
    setPrice(preset.price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setErrorMsg('Please enter both name and description');
      return;
    }
    if (!imageData && !imageUrl.trim()) {
      setErrorMsg('Please upload an image file or provide an external product photography URL');
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
      };

      if (imageUrl.trim()) {
        payload.imageUrl = imageUrl.trim();
      }
      if (imageData) {
        payload.imageData = imageData;
      }

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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="border-b border-neutralBorder pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-obsidian tracking-tight">Add New Product</h1>
          <p className="text-xs text-secondaryText mt-1">
            Persisted directly in PostgreSQL • Supports local upload &amp; external photography URLs
          </p>
        </div>
        <Link href="/admin/products" className="text-xs font-bold text-electricBlue hover:underline">
          ← Back to Inventory
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-4 rounded-xl font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-neutralBorder p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs text-xs">
        {/* Department / Product Type Selector */}
        <div className="p-4 bg-warmGray/60 rounded-xl border border-neutralBorder space-y-3">
          <label className="font-bold text-xs uppercase tracking-wider text-obsidian block">
            1. Select Inventory Department / Product Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { type: 'SAREE', label: '🥻 Saree' },
              { type: 'MEN_UNSTITCHED', label: '✂ Men’s Suiting' },
              { type: 'WOMEN_WEAR', label: '👗 Women’s Wear' },
              { type: 'BLOUSE_PIECE', label: '🧵 Blouse & Matching' },
              { type: 'DHOTI_TOWEL', label: '🪙 Dhotis & Towels' },
              { type: 'INNER_ESSENTIAL', label: '🩲 Inners & Essentials' },
              { type: 'GENERAL', label: '📦 General Catalog' },
            ].map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleProductTypeChange(item.type)}
                className={`p-2.5 rounded-xl border text-left font-bold text-xs transition-all ${
                  productType === item.type
                    ? 'border-electricBlue bg-electricBlue text-white shadow-xs'
                    : 'border-neutralBorder bg-white hover:border-obsidian text-obsidian'
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
            <label className="font-bold text-obsidian block mb-1">Product Title / Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pure Banarasi Silk Zari Saree"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-obsidian block mb-1">Brand *</label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Raymond, Gadwal Weavers, KB FASHIONS"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-obsidian block mb-1">Fabric Composition *</label>
            <input
              type="text"
              required
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="e.g. 100% Pure Silk / Handloom Cotton"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-obsidian block mb-1">Selling Unit Mode *</label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value as 'PIECE' | 'METER')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs font-semibold"
            >
              <option value="PIECE">By Piece / Garment</option>
              <option value="METER">By Meter (Custom Tailor Cuts)</option>
            </select>
          </div>

          {unitType === 'METER' ? (
            <div>
              <label className="font-bold text-obsidian block mb-1">Rate Per Meter (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={pricePerMeter}
                onChange={(e) => setPricePerMeter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs font-mono font-bold"
              />
            </div>
          ) : (
            <div>
              <label className="font-bold text-obsidian block mb-1">Retail Price (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs font-mono font-bold"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-obsidian block mb-1">Compare-at Price (₹)</label>
            <input
              type="number"
              min={1}
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="Strikethrough MRP"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-obsidian block mb-1">
              Stock Quantity ({unitType === 'METER' ? 'Meters' : 'Pieces'}) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-obsidian block mb-1">Product Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Handloom heritage, weave density, artisan origin details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* 2. Photography / Image Management */}
        <div className="border-t border-neutralBorder pt-6 space-y-4">
          <div>
            <label className="font-bold text-sm text-obsidian block">
              2. Authentic Product Photography *
            </label>
            <p className="text-[11px] text-secondaryText mt-0.5">
              Provide an authorized external image URL (Unsplash / CDN) or upload a local image file.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="p-3 bg-warmGray/60 rounded-xl border border-neutralBorder space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondaryText block">
              Quick Photography Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PHOTOGRAPHY_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-neutralBorder hover:border-obsidian text-[11px] font-semibold text-obsidian transition-colors shadow-2xs"
                >
                  📸 {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-32 h-44 bg-warmGray border border-neutralBorder rounded-xl overflow-hidden flex items-center justify-center shrink-0 relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-secondaryText font-bold text-xs text-center p-2">No Photo Selected</span>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="font-bold text-obsidian block mb-1">External Photography URL (HTTPS)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageData('');
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-secondaryText text-xs font-semibold">— or upload file —</span>
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-xs text-secondaryText file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-obsidian file:text-white hover:file:bg-neutral-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-neutralBorder pt-6 flex justify-between items-center">
          <Link href="/admin/products" className="text-secondaryText hover:text-obsidian font-semibold">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-electricBlue text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Saving to Database...' : 'Save Product to Storefront →'}
          </button>
        </div>
      </form>
    </div>
  );
}
