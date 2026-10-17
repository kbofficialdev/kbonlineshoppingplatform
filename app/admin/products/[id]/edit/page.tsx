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
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sarees');
  const [productType, setProductType] = useState<string>('SAREE');
  const [brand, setBrand] = useState('KB FASHIONS');
  const [fabric, setFabric] = useState('Pure Cotton');
  const [unitType, setUnitType] = useState<'PIECE' | 'METER'>('PIECE');
  const [price, setPrice] = useState('899');
  const [pricePerMeter, setPricePerMeter] = useState('550');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('30');
  const [description, setDescription] = useState('');
  const [fabricCare, setFabricCare] = useState('');
  const [origin, setOrigin] = useState('Kalwaral, Telangana, India');
  const [imageData, setImageData] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Domain specifics
  const [sareeLength, setSareeLength] = useState('6.3');
  const [sareeHasBlouse, setSareeHasBlouse] = useState(true);
  const [sareeBlouseLength, setSareeBlouseLength] = useState('0.8');
  const [sareeWorkType, setSareeWorkType] = useState('');
  const [sareeBorderType, setSareeBorderType] = useState('');
  const [sareePallu, setSareePallu] = useState('');

  const [fabricCutType, setFabricCutType] = useState('Shirt Piece');
  const [fabricWidth, setFabricWidth] = useState('58');
  const [standardCutMeters, setStandardCutMeters] = useState('1.6');
  const [recommendedUse, setRecommendedUse] = useState('');

  const [packSize, setPackSize] = useState('3');
  const [chestSizes, setChestSizes] = useState('80cm, 85cm, 90cm, 95cm, 100cm');

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
        setName(p.name || '');
        setTitle(p.title || '');
        setCategory(p.category || 'Sarees');
        setProductType(p.productType || 'GENERAL');
        setBrand(p.brand || 'KB FASHIONS');
        setFabric(p.fabric || 'Pure Cotton');
        setUnitType(p.unitType || 'PIECE');
        setPrice(p.price?.toString() || '0');
        setPricePerMeter(p.pricePerMeter?.toString() || p.price?.toString() || '0');
        setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice.toString() : '');
        setStockQuantity(p.stockQuantity?.toString() || '0');
        setDescription(p.description || '');
        setFabricCare(p.fabricCare || '');
        setOrigin(p.origin || 'Kalwaral, Telangana, India');

        if (p.sareeDetails) {
          setSareeLength(p.sareeDetails.lengthMeters?.toString() || '6.3');
          setSareeHasBlouse(p.sareeDetails.hasBlousePiece ?? true);
          setSareeBlouseLength(p.sareeDetails.blouseLengthMeters?.toString() || '0.8');
          setSareeWorkType(p.sareeDetails.workType || '');
          setSareeBorderType(p.sareeDetails.borderType || '');
          setSareePallu(p.sareeDetails.palluDetails || '');
        }

        if (p.unstitchedDetails) {
          setFabricCutType(p.unstitchedDetails.fabricCutType || 'Shirt Piece');
          setFabricWidth(p.unstitchedDetails.widthInches?.toString() || '58');
          setStandardCutMeters(p.unstitchedDetails.standardLengthMeters?.toString() || '1.6');
          setRecommendedUse(p.unstitchedDetails.recommendedUse || '');
        }

        if (p.essentialDetails) {
          setPackSize(p.essentialDetails.packSize?.toString() || '3');
          setChestSizes(p.essentialDetails.measurementValues?.join(', ') || '80cm, 85cm, 90cm, 95cm, 100cm');
        }

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
      const isUnstitched = unitType === 'METER' || productType === 'MEN_UNSTITCHED';

      const payload: any = {
        name: name.trim(),
        title: title.trim() || name.trim(),
        description: description.trim(),
        price: isUnstitched ? parseFloat(pricePerMeter) : parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stockQuantity: parseInt(stockQuantity, 10),
        category,
        productType,
        brand,
        fabric,
        isUnstitched,
        unitType,
        pricePerMeter: isUnstitched ? parseFloat(pricePerMeter) : null,
        fabricCare,
        origin,
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-kbBorder pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-black text-kbBlack">Edit Garment Details</h1>
          <p className="text-xs text-neutral-500 mt-1">Updating product #{id} in PostgreSQL database</p>
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
            <label className="font-bold text-neutral-700 block mb-1">Department / Product Type *</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            >
              <option value="SAREE">Saree (Gadwal, Pattu, Nirma)</option>
              <option value="MEN_UNSTITCHED">Men’s Unstitched Fabric</option>
              <option value="WOMEN_WEAR">Women’s Wear & Tops</option>
              <option value="BLOUSE_PIECE">Blouse & Matching Bits</option>
              <option value="DHOTI_TOWEL">Dhotis & Towels</option>
              <option value="INNER_ESSENTIAL">Inners & Banians (cm)</option>
              <option value="GENERAL">General Garments</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Brand *</label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
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
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Selling Mode *</label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value as 'PIECE' | 'METER')}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            >
              <option value="PIECE">By Piece</option>
              <option value="METER">By Meter (Custom Tailor Cut)</option>
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
              Stock ({unitType === 'METER' ? 'Meters' : 'Units'}) *
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

        {/* Unstitched details */}
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
                  className="w-full px-3 py-2 rounded border border-amber-200 bg-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Image update */}
        <div className="border-t border-kbBorder pt-6 space-y-3">
          <label className="font-black text-sm text-neutral-900 block">
            Update Photograph / Artwork (Saved in PostgreSQL Database)
          </label>
          <div className="flex gap-4 items-center">
            <div className="w-20 h-24 bg-kbCardBg border border-kbBorder rounded overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-neutral-400 font-bold text-xs">No Image</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-kb-pill file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800"
            />
          </div>
        </div>

        <div className="border-t border-kbBorder pt-6 flex justify-between items-center">
          <Link href="/admin/products" className="text-neutral-500 hover:text-black font-semibold">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-bold px-8 py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Save Changes →'}
          </button>
        </div>
      </form>
    </div>
  );
}
