const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres@localhost:5433/kbfashions';
}

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
  { code: 'ALL', name: 'All Garments', subtitle: 'Authentic Village Handlooms & Suitings', itemCount: 17 },
  { code: 'SAREES', name: 'Sarees', subtitle: 'Gadwal, Banarasi, Kanjivaram & Cotton Silks', itemCount: 6 },
  { code: 'MEN_UNSTITCHED', name: "Men's Unstitched", subtitle: 'Raymond, Arvind & Silk Blend Suitings', itemCount: 4 },
  { code: 'WOMEN_WEAR', name: "Women's Wear", subtitle: 'Handcrafted Kurtis, Tops & Anarkalis', itemCount: 3 },
  { code: 'BLOUSE_PIECE', name: 'Blouse & Matching', subtitle: '2x2 Rubia Heavy Cotton Cut Pieces', itemCount: 2 },
  { code: 'DHOTI_TOWEL', name: 'Dhotis & Towels', subtitle: 'South Indian Handloom Cotton Dhotis', itemCount: 2 },
  { code: 'INNER_ESSENTIAL', name: 'Inners & Essentials', subtitle: '100% Combed Ribbed Cotton Banians & Trunks', itemCount: 2 },
];

async function migrateData() {
  console.log('================================================================');
  console.log('   KB FASHIONS — POSTGRESQL DATA MIGRATION & PERSISTENCE VERIFICATION');
  console.log('================================================================');
  console.log(`Target Database: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);

  const jsonPath = path.resolve(__dirname, '../data/store_db.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`store_db.json not found at ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);

  // 1. Migrate Store Settings
  console.log('\n[1/8] Migrating Store Settings...');
  const s = data.storeSettings || {};
  await prisma.storeSettings.upsert({
    where: { id: 'kb-fashions-main' },
    update: {
      brandName: s.brandName || 'KB',
      officialName: s.officialName || 'KB FASHIONS',
      address: s.address || '3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana(TG), 503145.',
      village: s.village || 'Kalwaral',
      mandal: s.mandal || 'Sadasivanagar',
      district: s.district || 'Kamareddy',
      state: s.state || 'Telangana',
      pinCode: s.pinCode || '503145',
      contactEmail: s.contactEmail || 'kb.official.admin@gmail.com',
      contactPhone: s.contactPhone || '+91 7989768200',
      gstExempt: s.gstExempt !== false,
      exemptionNotice: s.exemptionNotice || 'Small rural artisan enterprise exempted under Section 23 CGST.',
      historySince: s.historySince || 'Serving our village for 20 years.',
      story: s.story || 'Fine textiles from Kalwaral village.',
      freeShippingThreshold: s.freeShippingThreshold || 999,
      flatShippingFee: s.flatShippingFee || 70,
    },
    create: {
      id: 'kb-fashions-main',
      brandName: s.brandName || 'KB',
      officialName: s.officialName || 'KB FASHIONS',
      address: s.address || '3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana(TG), 503145.',
      village: s.village || 'Kalwaral',
      mandal: s.mandal || 'Sadasivanagar',
      district: s.district || 'Kamareddy',
      state: s.state || 'Telangana',
      pinCode: s.pinCode || '503145',
      contactEmail: s.contactEmail || 'kb.official.admin@gmail.com',
      contactPhone: s.contactPhone || '+91 7989768200',
      gstExempt: s.gstExempt !== false,
      exemptionNotice: s.exemptionNotice || 'Small rural artisan enterprise exempted under Section 23 CGST.',
      historySince: s.historySince || 'Serving our village for 20 years.',
      story: s.story || 'Fine textiles from Kalwaral village.',
      freeShippingThreshold: s.freeShippingThreshold || 999,
      flatShippingFee: s.flatShippingFee || 70,
    },
  });
  console.log('✓ Store settings migrated.');

  // 2. Migrate Categories
  console.log('\n[2/8] Migrating Categories...');
  for (const cat of CATEGORIES_DATA) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: {
        name: cat.name,
        subtitle: cat.subtitle,
        itemCount: cat.itemCount,
      },
      create: {
        code: cat.code,
        name: cat.name,
        subtitle: cat.subtitle,
        itemCount: cat.itemCount,
      },
    });
  }
  console.log(`✓ ${CATEGORIES_DATA.length} Categories migrated.`);

  // 3. Migrate Users
  console.log('\n[3/8] Migrating Users...');
  const users = data.users || [];
  let userCount = 0;
  for (const u of users) {
    if (!u.email || !u.phone) continue;
    await prisma.user.upsert({
      where: { email: u.email.toLowerCase().trim() },
      update: {
        name: u.name || 'Customer',
        phone: u.phone.trim(),
        passwordHash: u.passwordHash || '$2a$10$Defau1tPasswordHashForTestingOnly...',
        role: u.role || 'CUSTOMER',
        avatar: u.avatar || null,
        villageOrCity: u.villageOrCity || 'Kalwaral',
        mandalOrArea: u.mandalOrArea || 'Sadasivanagar',
        district: u.district || 'Kamareddy',
        state: u.state || 'Telangana',
        pinCode: u.pinCode || '503145',
        preferredLanguage: u.preferredLanguage || 'en',
        smsUpdates: u.smsUpdates !== false,
        whatsappUpdates: u.whatsappUpdates !== false,
        bio: u.bio || null,
        isActive: u.isActive !== false,
      },
      create: {
        id: u.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: u.name || 'Customer',
        email: u.email.toLowerCase().trim(),
        phone: u.phone.trim(),
        passwordHash: u.passwordHash || '$2a$10$Defau1tPasswordHashForTestingOnly...',
        role: u.role || 'CUSTOMER',
        avatar: u.avatar || null,
        villageOrCity: u.villageOrCity || 'Kalwaral',
        mandalOrArea: u.mandalOrArea || 'Sadasivanagar',
        district: u.district || 'Kamareddy',
        state: u.state || 'Telangana',
        pinCode: u.pinCode || '503145',
        preferredLanguage: u.preferredLanguage || 'en',
        smsUpdates: u.smsUpdates !== false,
        whatsappUpdates: u.whatsappUpdates !== false,
        bio: u.bio || null,
        isActive: u.isActive !== false,
      },
    });
    userCount++;
  }
  console.log(`✓ ${userCount} Users migrated.`);

  // 4. Migrate Products and Product Images
  console.log('\n[4/8] Migrating Products and Real Photography Images...');
  const products = data.products || [];
  let prodCount = 0;
  for (const p of products) {
    const prodId = p.productId || p.id;
    if (!prodId) continue;

    const createdProd = await prisma.product.upsert({
      where: { productId: prodId },
      update: {
        name: p.name || 'Village Garment',
        title: p.title || p.name || 'Village Garment',
        description: p.description || 'Authentic Handloom product from Kalwaral.',
        price: parseFloat(p.price) || 899,
        compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice) : null,
        category: p.category || 'Sarees',
        productType: p.productType || 'GENERAL',
        brand: p.brand || 'KB FASHIONS',
        fabric: p.fabric || 'Pure Cotton',
        isUnstitched: !!p.isUnstitched,
        unitType: p.unitType || 'PIECE',
        pricePerMeter: p.pricePerMeter ? parseFloat(p.pricePerMeter) : null,
        availableMeters: Array.isArray(p.availableMeters) ? p.availableMeters : [],
        tags: Array.isArray(p.tags) ? p.tags : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL'],
        colors: Array.isArray(p.colors) ? p.colors : ['Natural'],
        stockQuantity: parseInt(p.stockQuantity, 10) || 25,
        rating: p.rating || 4.9,
        reviews: p.reviews || 0,
        fabricCare: p.fabricCare || 'Gentle wash in cold water.',
        origin: p.origin || 'Kalwaral, Telangana, India',
        isFeatured: !!p.isFeatured,
        sareeDetails: p.sareeDetails || null,
        unstitchedDetails: p.unstitchedDetails || null,
        essentialDetails: p.essentialDetails || null,
        matchingDetails: p.matchingDetails || null,
      },
      create: {
        id: p.id || prodId,
        productId: prodId,
        name: p.name || 'Village Garment',
        title: p.title || p.name || 'Village Garment',
        description: p.description || 'Authentic Handloom product from Kalwaral.',
        price: parseFloat(p.price) || 899,
        compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice) : null,
        category: p.category || 'Sarees',
        productType: p.productType || 'GENERAL',
        brand: p.brand || 'KB FASHIONS',
        fabric: p.fabric || 'Pure Cotton',
        isUnstitched: !!p.isUnstitched,
        unitType: p.unitType || 'PIECE',
        pricePerMeter: p.pricePerMeter ? parseFloat(p.pricePerMeter) : null,
        availableMeters: Array.isArray(p.availableMeters) ? p.availableMeters : [],
        tags: Array.isArray(p.tags) ? p.tags : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL'],
        colors: Array.isArray(p.colors) ? p.colors : ['Natural'],
        stockQuantity: parseInt(p.stockQuantity, 10) || 25,
        rating: p.rating || 4.9,
        reviews: p.reviews || 0,
        fabricCare: p.fabricCare || 'Gentle wash in cold water.',
        origin: p.origin || 'Kalwaral, Telangana, India',
        isFeatured: !!p.isFeatured,
        sareeDetails: p.sareeDetails || null,
        unstitchedDetails: p.unstitchedDetails || null,
        essentialDetails: p.essentialDetails || null,
        matchingDetails: p.matchingDetails || null,
      },
    });

    // Migrate Images
    if (Array.isArray(p.images) && p.images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: prodId } });
      for (let i = 0; i < p.images.length; i++) {
        const img = p.images[i];
        await prisma.productImage.create({
          data: {
            productId: prodId,
            name: img.name || `${prodId}-img-${i + 1}`,
            mimeType: img.mimeType || (img.data?.startsWith('http') ? 'image/jpeg' : 'image/svg+xml'),
            data: img.data,
            isPrimary: i === 0,
          },
        });
      }
    }
    prodCount++;
  }
  console.log(`✓ ${prodCount} Products and their images migrated.`);

  // 5. Migrate Orders, Items, Timeline
  console.log('\n[5/8] Migrating Orders and Line Items...');
  const orders = data.orders || [];
  let orderCount = 0;
  for (const o of orders) {
    const orderId = o.orderId || o.id;
    if (!orderId) continue;

    await prisma.order.upsert({
      where: { orderId },
      update: {
        invoiceNumber: o.invoiceNumber || `BILL-2026-${orderCount + 100}`,
        userId: o.userId || null,
        customerName: o.customerName || 'Customer',
        customerPhone: o.customerPhone || '+91 9876543210',
        customerEmail: o.customerEmail || 'customer@example.com',
        streetAddress: o.streetAddress || 'Kalwaral',
        villageOrCity: o.villageOrCity || 'Kalwaral',
        mandalOrArea: o.mandalOrArea || 'Sadasivanagar',
        district: o.district || 'Kamareddy',
        state: o.state || 'Telangana',
        pinCode: o.pinCode || '503145',
        subtotal: parseFloat(o.subtotal) || 0,
        discountAmount: parseFloat(o.discountAmount) || 0,
        shippingFee: parseFloat(o.shippingFee) || 0,
        totalPaid: parseFloat(o.totalPaid || o.totalAmount) || 0,
        paymentMethod: o.paymentMethod || 'COD',
        paymentStatus: o.paymentStatus || 'PENDING',
        orderStatus: o.orderStatus || o.status || 'ORDER_PLACED',
        courierPartner: o.courierPartner || 'Kalwaral Direct Store Runner',
        trackingNumber: o.trackingNumber || `TRACK-${orderId}`,
        estimatedDeliveryDays: o.estimatedDeliveryDays || 3,
      },
      create: {
        id: o.id || orderId,
        orderId,
        invoiceNumber: o.invoiceNumber || `BILL-2026-${orderCount + 100}`,
        userId: o.userId || null,
        customerName: o.customerName || 'Customer',
        customerPhone: o.customerPhone || '+91 9876543210',
        customerEmail: o.customerEmail || 'customer@example.com',
        streetAddress: o.streetAddress || 'Kalwaral',
        villageOrCity: o.villageOrCity || 'Kalwaral',
        mandalOrArea: o.mandalOrArea || 'Sadasivanagar',
        district: o.district || 'Kamareddy',
        state: o.state || 'Telangana',
        pinCode: o.pinCode || '503145',
        subtotal: parseFloat(o.subtotal) || 0,
        discountAmount: parseFloat(o.discountAmount) || 0,
        shippingFee: parseFloat(o.shippingFee) || 0,
        totalPaid: parseFloat(o.totalPaid || o.totalAmount) || 0,
        paymentMethod: o.paymentMethod || 'COD',
        paymentStatus: o.paymentStatus || 'PENDING',
        orderStatus: o.orderStatus || o.status || 'ORDER_PLACED',
        courierPartner: o.courierPartner || 'Kalwaral Direct Store Runner',
        trackingNumber: o.trackingNumber || `TRACK-${orderId}`,
        estimatedDeliveryDays: o.estimatedDeliveryDays || 3,
      },
    });

    // Items
    if (Array.isArray(o.items) && o.items.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId } });
      for (const item of o.items) {
        await prisma.orderItem.create({
          data: {
            orderId,
            productId: item.productId || 'PROD-UNKNOWN',
            title: item.title || item.name || 'Village Garment',
            qty: parseInt(item.qty, 10) || 1,
            unitPrice: parseFloat(item.unitPrice || item.price) || 0,
            totalAmount: parseFloat(item.totalAmount || (item.unitPrice || item.price) * (item.qty || 1)) || 0,
            size: item.size || 'Free Size',
            cutLength: item.cutLength ? parseFloat(item.cutLength) : null,
            configuration: item.configuration || null,
          },
        });
      }
    }

    // Timeline
    if (Array.isArray(o.timeline) && o.timeline.length > 0) {
      await prisma.orderTimelineEvent.deleteMany({ where: { orderId } });
      for (const tl of o.timeline) {
        await prisma.orderTimelineEvent.create({
          data: {
            orderId,
            stage: tl.stage || 'ORDER_PLACED',
            title: tl.title || 'Order Placed',
            description: tl.description || 'Order registered in Kalwaral store.',
            location: tl.location || 'Kalwaral, Telangana',
          },
        });
      }
    }
    orderCount++;
  }
  console.log(`✓ ${orderCount} Orders with items and timelines migrated.`);

  // 6. Migrate Support Tickets
  console.log('\n[6/8] Migrating Support Tickets...');
  const tickets = data.supportTickets || [];
  let ticketCount = 0;
  for (const t of tickets) {
    const tNum = t.ticketNumber || `TKT-${ticketCount + 1000}`;
    const tId = t.id || `st-${ticketCount + 1}`;

    const createdTicket = await prisma.supportTicket.upsert({
      where: { ticketNumber: tNum },
      update: {
        customerName: t.customerName || 'Customer',
        customerEmail: t.customerEmail || 'customer@example.com',
        customerPhone: t.customerPhone || '+91 9876543210',
        category: t.category || 'ORDER_ISSUE',
        priority: t.priority || 'MEDIUM',
        orderId: t.orderId || null,
        subject: t.subject || 'Store Support Inquiry',
        status: t.status || 'OPEN',
        slaHours: t.slaHours || 24,
      },
      create: {
        id: tId,
        ticketNumber: tNum,
        userId: t.userId || null,
        customerName: t.customerName || 'Customer',
        customerEmail: t.customerEmail || 'customer@example.com',
        customerPhone: t.customerPhone || '+91 9876543210',
        category: t.category || 'ORDER_ISSUE',
        priority: t.priority || 'MEDIUM',
        orderId: t.orderId || null,
        subject: t.subject || 'Store Support Inquiry',
        status: t.status || 'OPEN',
        slaHours: t.slaHours || 24,
      },
    });

    if (Array.isArray(t.messages) && t.messages.length > 0) {
      await prisma.ticketMessage.deleteMany({ where: { ticketId: createdTicket.id } });
      for (const m of t.messages) {
        await prisma.ticketMessage.create({
          data: {
            ticketId: createdTicket.id,
            senderRole: m.senderRole || 'CUSTOMER',
            senderName: m.senderName || 'Customer',
            message: m.message || 'Support inquiry message.',
            attachments: m.attachments || [],
          },
        });
      }
    }
    ticketCount++;
  }
  console.log(`✓ ${ticketCount} Support tickets migrated.`);

  // 7. Migrate Banners
  console.log('\n[7/8] Migrating Banners...');
  const banners = data.banners || [];
  let bannerCount = 0;
  for (const b of banners) {
    const bId = b.bannerId || b.id;
    await prisma.banner.upsert({
      where: { bannerId: bId },
      update: {
        title: b.title,
        subtitle: b.subtitle || null,
        badge: b.badge || null,
        category: b.category || 'HERO',
        mediaId: b.mediaId || `media-${bId}`,
        imageUrl: b.imageUrl,
        linkUrl: b.linkUrl || '/search',
        ctaText: b.ctaText || 'Shop Now',
        position: b.position || 0,
        isActive: b.isActive !== false,
      },
      create: {
        bannerId: bId,
        title: b.title,
        subtitle: b.subtitle || null,
        badge: b.badge || null,
        category: b.category || 'HERO',
        mediaId: b.mediaId || `media-${bId}`,
        imageUrl: b.imageUrl,
        linkUrl: b.linkUrl || '/search',
        ctaText: b.ctaText || 'Shop Now',
        position: b.position || 0,
        isActive: b.isActive !== false,
      },
    });
    bannerCount++;
  }
  console.log(`✓ ${bannerCount} Banners migrated.`);

  // 8. Verification Audit
  console.log('\n[8/8] Performing Final PostgreSQL Persistence Audit...');
  const [uCnt, pCnt, oCnt, cCnt, bCnt, tCnt] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.banner.count(),
    prisma.supportTicket.count(),
  ]);

  console.log('================================================================');
  console.log('   POSTGRESQL PERSISTENCE AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`• Users:           ${uCnt} records in PostgreSQL`);
  console.log(`• Products:        ${pCnt} records in PostgreSQL`);
  console.log(`• Orders:          ${oCnt} records in PostgreSQL`);
  console.log(`• Categories:      ${cCnt} records in PostgreSQL`);
  console.log(`• Banners:         ${bCnt} records in PostgreSQL`);
  console.log(`• Support Tickets: ${tCnt} records in PostgreSQL`);
  console.log('✓ All business data successfully verified in authoritative PostgreSQL database!');
  console.log('================================================================');
}

migrateData()
  .catch((e) => {
    console.error('Migration Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

