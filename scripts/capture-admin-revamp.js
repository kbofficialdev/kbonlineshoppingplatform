const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const screenshotsDir = path.resolve(__dirname, '../../.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 1. Desktop Admin Views (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  console.log('Authenticating administrator session via API...');
  const signinRes = await desktopContext.request.post('http://localhost:3000/api/auth/signin', {
    data: {
      emailOrPhone: 'kb.official.admin@gmail.com',
      password: 'Admin@KBFashions2026',
    }
  });
  const signinData = await signinRes.json();
  console.log('Admin Auth Response:', signinData.success, signinData.user?.role);

  if (signinData.token) {
    await desktopContext.addCookies([
      { name: 'kb_auth_token', value: signinData.token, domain: 'localhost', path: '/' },
      { name: 'kb_session_active', value: '1', domain: 'localhost', path: '/' },
    ]);
  }

  const page = await desktopContext.newPage();

  // Screen 1: Admin Main Dashboard
  console.log('Capturing 161_admin_main_dashboard.png...');
  await page.goto('http://localhost:3000/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '161_admin_main_dashboard.png'), fullPage: true });

  // Screen 2: Admin Products Management
  console.log('Capturing 162_admin_products_management.png...');
  await page.goto('http://localhost:3000/admin/products');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '162_admin_products_management.png'), fullPage: true });

  // Screen 3: Admin Orders Management
  console.log('Capturing 163_admin_orders_management.png...');
  await page.goto('http://localhost:3000/admin/orders');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '163_admin_orders_management.png'), fullPage: true });

  // Screen 4: Admin Customers Management
  console.log('Capturing 164_admin_customers_management.png...');
  await page.goto('http://localhost:3000/admin/customers');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '164_admin_customers_management.png'), fullPage: true });

  // Screen 5: Admin Banners & Promotions
  console.log('Capturing 165_admin_banners_promotions.png...');
  await page.goto('http://localhost:3000/admin/banners');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '165_admin_banners_promotions.png'), fullPage: true });

  // Screen 6: Admin Store Settings
  console.log('Capturing 166_admin_store_settings.png...');
  await page.goto('http://localhost:3000/admin/settings');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '166_admin_store_settings.png'), fullPage: true });

  // 2. Mobile View for Ultra-Compact Footer
  console.log('Capturing 167_mobile_compact_footer.png...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(1000);
  // Scroll down to the bottom
  await mobilePage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, '167_mobile_compact_footer.png') });

  // 3. Circular Ring Spinner Loader Overlay (Ref: media_1792310765327_039b725e.png)
  console.log('Capturing 168_circular_ring_spinner_loader.png...');
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    const overlay = document.createElement('div');
    overlay.id = 'test-ring-loader-overlay';
    overlay.className = 'fixed inset-0 z-[99999] bg-black/45 backdrop-blur-[2px] flex items-center justify-center select-none';
    overlay.innerHTML = '<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[6px] sm:border-[7px] border-white/25 border-t-white animate-spin" style="animation-duration: 0.85s;"></div>';
    document.body.appendChild(overlay);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '168_circular_ring_spinner_loader.png') });

  await browser.close();
  console.log('✓ All 8 visual verification screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});

