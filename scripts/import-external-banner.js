const fs = require('fs');
const path = require('path');

const externalsDir = path.resolve(__dirname, '../externals');
const publicImagesDir = path.resolve(__dirname, '../public/images');
const dbPath = path.resolve(__dirname, '../data/store_db.json');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

console.log('================================================================');
console.log('   KB FASHIONS — EXTERNAL BANNER IMPORT UTILITY');
console.log('================================================================');

if (!fs.existsSync(externalsDir)) {
  console.log('Externals folder not found:', externalsDir);
  process.exit(1);
}

const files = fs.readdirSync(externalsDir);
const imageFiles = files.filter(f => /\.(png|jpe?g|webp|svg)$/i.test(f));

console.log(`Found ${imageFiles.length} image files in /externals:`);
imageFiles.forEach(f => console.log('  -', f));

// Load store database
let db = { banners: [], mediaAssets: [] };
if (fs.existsSync(dbPath)) {
  try {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    console.error('Error parsing store_db.json:', e);
  }
}

let importedCount = 0;
imageFiles.forEach(fileName => {
  const filePath = path.join(externalsDir, fileName);
  const cleanName = fileName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
  const targetPublicPath = path.join(publicImagesDir, cleanName);

  // Copy to public/images for high-speed CDN / static serving
  fs.copyFileSync(filePath, targetPublicPath);
  const publicUrl = `/images/${cleanName}`;

  // Check if it's a banner candidate
  if (cleanName.includes('banner') || cleanName.includes('tradition') || cleanName.includes('trend') || cleanName.includes('hero')) {
    const existingIndex = db.banners.findIndex(b => b.bannerId === cleanName || b.imageUrl === publicUrl);
    const bannerRecord = {
      id: `bnr-ext-${Date.now()}-${importedCount}`,
      bannerId: cleanName,
      title: fileName.replace(/\.[^/.]+$/, ''),
      subtitle: 'Official Handloom & Fashion Collections from Kalwaral, Telangana',
      badge: '✨ HERITAGE COLLECTION',
      category: 'HERO',
      mediaId: cleanName,
      imageUrl: publicUrl,
      linkUrl: '/search?category=All',
      ctaText: 'Explore Collection',
      position: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db.banners[existingIndex] = { ...db.banners[existingIndex], ...bannerRecord };
    } else {
      db.banners.unshift(bannerRecord);
    }
    importedCount++;
    console.log(`✓ Imported banner to database: ${fileName} -> ${publicUrl}`);
  }
});

if (db.storeSettings) {
  db.storeSettings.cashfreeSecretKey = '';
  db.storeSettings.cashfreeAppId = '';
}

// Save database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`\nImport complete! Updated ${importedCount} banner(s) in data/store_db.json.`);
console.log('Run `npm run import:banners` anytime new images are placed in /externals.');

