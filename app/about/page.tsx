import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function AboutPage() {
  const store = db.storeSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-kbBorder pb-8 text-center space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
          20 Years of Village Heritage (2006–2026)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-kbBlack">
          Our Story — {store.officialName}
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto">
          An ancestral family occupation in Kalwaral village, Kamareddy, Telangana. Now stepping online after 20 years.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="space-y-6 text-sm text-neutral-700 leading-relaxed">
        <p className="text-base font-semibold text-black leading-relaxed">
          For over two decades, our physical shop in Kalwaral village has been a trusted cornerstone for regional handloom textiles, comfortable cotton dhotis, wedding ceremonial kurtas, and durable daily wear.
        </p>

        <p>
          We are not a corporate conglomerate or venture-backed aggregator. Our business is part of our family's ancestral occupation in garments and textile craftsmanship. In our village, quality is not a marketing term—it is our personal word to our neighbors, farmers, elders, and families who have dressed in our clothes for weddings, festivals, and everyday field work across Telangana.
        </p>

        <div className="bg-kbSurfaceAlt p-6 rounded-kb-lg border border-kbBorder my-8 space-y-3">
          <h3 className="font-bold text-black text-sm uppercase tracking-wider">
            Why We Are Coming Online in 2026
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Patrons who moved to Hyderabad, Bengaluru, Mumbai, and beyond often called us asking to send our handspun cotton kurtas and traditional dhoti sets. We built this online platform so that anyone across India can order our genuine garments directly from our Kalwaral store, without middlemen, inflated mall prices, or synthetic fabrics.
          </p>
        </div>

        <h2 className="text-lg font-black text-black pt-4">Our Core Commitments to You</h2>
        <ul className="space-y-3 pl-4 border-l-2 border-black text-xs">
          <li>
            <strong className="text-black">1. Honest Pricing Without GST Inflation:</strong> As a traditional small village retail enterprise, we operate under statutory GST exemption (Section 23 of CGST Act). You pay only the honest retail price of the garment—no hidden taxes or fees.
          </li>
          <li>
            <strong className="text-black">2. 100% Skin-Friendly Natural Fibers:</strong> We prioritize pure combed cottons, breathable slub weaves, and fine linens that stay cool in warm Indian climates.
          </li>
          <li>
            <strong className="text-black">3. Transparent Stage-by-Stage Tracking:</strong> Every shipment is hand-inspected in our Kalwaral store and tracked stage-by-stage until it safely reaches your doorstep.
          </li>
          <li>
            <strong className="text-black">4. Personal Support:</strong> You can call or WhatsApp our store directly at <strong>{store.contactPhone}</strong> if you ever need sizing assistance or care tips.
          </li>
        </ul>
      </div>

      {/* Official Enterprise Specifications */}
      <div className="bg-white border border-kbBorder p-6 rounded-kb-lg shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
          Official Store Record & Registered Address
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-neutral-400 block text-[10px]">Brand & Trademark:</span>
            <span className="font-bold text-neutral-950">{store.brandName}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">Official Enterprise Name:</span>
            <span className="font-bold text-neutral-950">{store.officialName}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-neutral-400 block text-[10px]">Village Physical Shop Address:</span>
            <span className="font-mono text-neutral-900">{store.address}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">Official Contact Phone:</span>
            <span className="font-bold text-neutral-950">{store.contactPhone}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">Official Contact Email:</span>
            <span className="font-bold text-neutral-950">{store.contactEmail}</span>
          </div>
          <div className="sm:col-span-2 pt-2 border-t border-neutral-100">
            <span className="text-neutral-400 block text-[10px]">Statutory Taxation Status:</span>
            <span className="text-emerald-800 font-semibold">{store.exemptionNotice}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="text-center pt-6">
        <Link
          href="/search?category=All"
          className="bg-black text-white font-bold text-xs px-8 py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all inline-block shadow-md"
        >
          Explore Handcrafted Garments →
        </Link>
      </div>
    </div>
  );
}

