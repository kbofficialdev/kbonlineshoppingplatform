import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Our Heritage Story (2006–2026) | KB FASHIONS',
  description: 'Two decades of authentic ancestral handloom weaving and fine textiles rooted in Kalwaral village, Kamareddy, Telangana.',
};

export default function AboutPage() {
  const store = db.storeSettings;

  const milestones = [
    {
      year: '2006',
      title: 'Ancestral Looms & Village Foundation',
      telugu: 'చేనేత మగ్గాల పునాది',
      desc: 'Originating as part of our family’s ancestral occupation in Kalwaral village, weaving and tailoring authentic daily wear, pure cotton dhotis, and festive garments for local farming and rural communities.',
      badge: 'Humble Village Beginnings'
    },
    {
      year: '2012',
      title: 'Regional Handloom Patronage',
      telugu: 'ప్రాంతీయ ప్రజల ఆదరణ',
      desc: 'Became the most trusted textile landmark across Sadasivanagar mandal and Kamareddy district. Families travelled miles to select wedding pattu sarees and ceremonial fabrics directly from our physical counter.',
      badge: 'Mandal & District Landmark'
    },
    {
      year: '2018',
      title: 'Direct Weaver Ties & Fabric Quality',
      telugu: 'నేతన్నల భాగస్వామ్యం',
      desc: 'Expanded direct master-weaver partnerships in Gadwal, Dharmavaram, and Pochampally, alongside mill-authorized distribution of pure combed cottons, Raymond suiting, and Arvind unstitched shirting.',
      badge: 'Pure Craftsmanship'
    },
    {
      year: '2026',
      title: 'Digital Village-to-India Store',
      telugu: 'ఆన్‌లైన్ ద్వారా దేశవ్యాప్తంగా',
      desc: 'Stepping online so that patrons who moved to Hyderabad, Bengaluru, the Gulf, and across India can order authentic Kalwaral garments with stage-by-stage consignment tracking and honest village pricing.',
      badge: 'Digital Era'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Grand Hero Banner with Gradient & Cultural Essence */}
      <section className="bg-gradient-to-r from-[#0C111D] via-[#151D2E] to-[#0A0E18] text-white border-b border-slate-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Decorative Background Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto space-y-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
            <span>✨</span>
            <span>20 YEARS OF ANCESTRAL WEAVING HERITAGE (2006–2026)</span>
          </div>

          <div className="font-serif italic text-base sm:text-lg text-amber-200/90 tracking-wide">
            కల్వరాల్ చేనేత వైభవం • రెండు దశాబ్దాల విశ్వసనీయత
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Tradition Meets Trend at <span className="text-kb-gold">{store.officialName}</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Rooted in Kalwaral village for over two decades. What began as an ancestral rural calling is now a premier destination for genuine handloom Gadwal sarees, unstitched suitings, and comfort daily wear delivered across India.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/search?category=All"
              className="bg-white text-black font-extrabold text-xs px-8 py-3.5 rounded-full hover:bg-neutral-200 transition-all shadow-lg"
            >
              Explore Handloom Catalog →
            </Link>
            <Link
              href="/policies/statutory-declaration"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-full transition-all border border-white/20"
            >
              Statutory Exemption Notice
            </Link>
          </div>
        </div>
      </section>

      {/* Main Narrative Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Intro Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Kalwaral Story
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Not an Aggregator. An Authentic Family Weaving &amp; Cloth Enterprise.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <p>
              For over two decades, our physical store situated in <strong>Kalwaral village</strong> (Sadasivanagar mandal, Kamareddy district, Telangana) has been a cherished cornerstone for families celebrating weddings, festivals, temple ceremonies, and everyday village life.
            </p>
            <p>
              We are not a faceless corporate brand or dropshipping middleman. Our enterprise is part of our family’s ancestral occupation in fine textiles. In our village, craftsmanship is not a marketing catchphrase—it is our personal word of honor given to our neighbors, village elders, and patrons who have dressed in our garments for over 20 years.
            </p>
            <p>
              When patrons who moved away to Hyderabad, Bengaluru, Pune, and abroad reached out asking how they could continue buying our pure cotton kurtas, Gadwal pattu sarees, and Raymond cuts, we decided to build this online platform. Today, you can order directly from our village counter with complete transparency.
            </p>
          </div>
        </div>

        {/* 20-Year Milestones Timeline */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-black">Our 20-Year Journey (2006 – 2026)</h3>
            <p className="text-xs text-neutral-500">From village loom counters to nation-wide doorstep deliveries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-black p-6 sm:p-8 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md space-y-4 relative group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl font-black font-mono text-black group-hover:text-kb-blue transition-colors">
                    {m.year}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-neutral-100 rounded-full text-neutral-700">
                    {m.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-black">{m.title}</h4>
                  <div className="text-xs font-semibold text-neutral-400 mt-0.5">{m.telugu}</div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Core Pillars of KB FASHIONS */}
        <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Village Integrity</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Our 4 Uncompromising Commitments</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
              <div className="text-lg font-black text-amber-300">1. Honest Pricing Without GST Markup</div>
              <p className="text-neutral-300 leading-relaxed">
                Operating under statutory exemption (Section 23 of CGST Act / TGST Act), we charge only the honest artisan retail price. Zero hidden administrative taxes or inflated mall margins.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
              <div className="text-lg font-black text-blue-300">2. 100% Skin-Friendly Natural Fibres</div>
              <p className="text-neutral-300 leading-relaxed">
                We prioritize breathable combed cottons, mulberry silks, fine linens, and natural slubs engineered for comfort in warm Indian climates.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
              <div className="text-lg font-black text-emerald-300">3. Local 10km Express Delivery</div>
              <p className="text-neutral-300 leading-relaxed">
                Dedicated local doorstep delivery across all habitations within a 10 km radius under PIN 503145 with stage-by-stage real-time tracking.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
              <div className="text-lg font-black text-purple-300">4. Direct Family Support Helpline</div>
              <p className="text-neutral-300 leading-relaxed">
                No automated bot menus. Call or WhatsApp our Kalwaral store counter directly at <strong>{store.contactPhone}</strong> for genuine assistance, meter cut advice, or order inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Physical Store & Statutory Credentials */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-black">Official Registered Store Credentials</h3>
            <p className="text-xs text-neutral-500">Government compliant and consumer protected under E-Commerce Rules 2020</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Brand &amp; Trademark</span>
              <span className="font-extrabold text-black text-sm">{store.brandName} FASHIONS</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Official Trade Entity</span>
              <span className="font-extrabold text-black text-sm">{store.officialName}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Grievance Officer</span>
              <span className="font-bold text-black">{store.grievanceOfficerName}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Physical Village Store Address</span>
              <span className="font-mono text-black leading-relaxed">{store.address}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Customer Helpline</span>
              <span className="font-mono font-bold text-black">{store.contactPhone}</span>
            </div>
            <div className="sm:col-span-3 pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2">
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ {store.exemptionNotice}
              </span>
              <Link href="/policies/grievance" className="text-xs font-bold text-black hover:underline">
                Grievance Resolution Policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
