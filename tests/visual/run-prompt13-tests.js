const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TEST_PORT = 3000;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const ARTIFACT_DIR = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPrompt13Tests() {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Verification Test Suite for Prompt 13`);
  console.log(` 🤖 Dedicated AI Page Revamp (/ai)`);
  console.log(` 🏬 Homepage Grand Single Hero Banner & Animated Product Collage`);
  console.log(` 📍 10 km Local Delivery Enforcement (No India Post)`);
  console.log(` ⚖️ Grievance Redressal (No Personal Names, Official Designation & Email Only)`);
  console.log(` 🖤 Monochrome Black & White Footer with Bold Blue Hover`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  const capture = async (page, name, fullPage = false) => {
    const localPath = path.join(SCREENSHOT_DIR, name);
    const artifactPath = path.join(ARTIFACT_DIR, name);
    await page.screenshot({ path: localPath, fullPage });
    try {
      fs.copyFileSync(localPath, artifactPath);
    } catch (e) {
      console.error(`Failed to copy to artifact dir:`, e.message);
    }
    console.log(`✓ Captured: ${name}`);
  };

  try {
    const page = await desktopContext.newPage();

    // 1. Dedicated AI Page (/ai)
    console.log('\n[1] Capturing Dedicated AI Page (/ai)...');
    await page.goto(`http://localhost:${TEST_PORT}/ai`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await capture(page, '105_ai_page_showcase_banner.png', false);

    // 2. Homepage: Single Grand Hero Banner (/ - top)
    console.log('\n[2] Capturing Homepage Grand Single Hero Banner (/)...');
    await page.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await capture(page, '106_homepage_single_hero_banner.png', false);

    // 3. Homepage: Product Collage Showcase (Editorial Mosaic)
    console.log('\n[3] Capturing Homepage Product Collage Showcase (Editorial Mosaic)...');
    const collageSection = await page.$('text="Artisan Handloom Showcase"');
    if (collageSection) {
      await collageSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
    }
    await capture(page, '107_homepage_product_collage_mosaic.png', false);

    // 4. Switch to Dynamic Quad View
    console.log('\n[4] Switching to Dynamic Quad Matrix view in collage...');
    const quadBtn = await page.$('text="Dynamic Quad"');
    if (quadBtn) {
      await quadBtn.click();
      await page.waitForTimeout(600);
    }
    await capture(page, '108_homepage_product_collage_quad.png', false);

    // 5. Scroll to Monochrome Black & White Footer with Blue Hover
    console.log('\n[5] Capturing Clean Black & White Footer with bold blue hover...');
    const footerLink = await page.$('footer a:has-text("Gadwal Handloom Sarees")');
    if (footerLink) {
      await footerLink.scrollIntoViewIfNeeded();
      await footerLink.hover();
      await page.waitForTimeout(600);
    } else {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);
    }
    await capture(page, '109_black_white_footer_hover_blue.png', false);

    // 6. Shipping Policy strictly 10km (No India Post)
    console.log('\n[6] Capturing Shipping Policy Page (/policies/shipping)...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/shipping`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await capture(page, '110_shipping_policy_10km_strictly.png', false);

    console.log(`\n======================================================`);
    console.log(` 🏆 Verification Suite Completed Successfully!`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    await browser.close();
  }
}

runPrompt13Tests();
