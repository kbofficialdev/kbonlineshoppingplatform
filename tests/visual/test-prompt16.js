const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const artifactDir = path.join(process.env.HOME, '.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });

  const page = await context.newPage();

  console.log('1. Signing in as customer...');
  await page.goto('http://localhost:3000/auth/signin');
  await page.waitForLoadState('networkidle');
  await page.fill('input[placeholder*="rahul"]', 'customer@example.com');
  await page.fill('input[type="password"]', 'Customer@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  console.log('2. Testing /orders/ORD-2026-1001 (Consignment tracking & details)...');
  await page.goto('http://localhost:3000/orders/ORD-2026-1001');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(artifactDir, '126_order_consignment_tracking_page.png'),
    fullPage: true
  });

  console.log('3. Testing /account?tab=tracking (Account live tracking tab)...');
  await page.goto('http://localhost:3000/account?tab=tracking');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(artifactDir, '127_account_live_consignment_tracking.png'),
    fullPage: true
  });

  console.log('4. Testing /checkout/cashfree-return?order_id=ORD-2026-1001...');
  await page.goto('http://localhost:3000/checkout/cashfree-return?order_id=ORD-2026-1001');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(artifactDir, '128_cashfree_return_verification_page.png'),
    fullPage: false
  });

  console.log('5. Testing /support (Support tickets stream)...');
  await page.goto('http://localhost:3000/support');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(artifactDir, '129_customer_support_tickets_system.png'),
    fullPage: true
  });

  console.log('6. Signing in as Admin to test Admin Consignment Monitor...');
  await page.goto('http://localhost:3000/auth/signin');
  await page.waitForLoadState('networkidle');
  await page.fill('input[placeholder*="rahul"]', 'kb.official.admin@gmail.com');
  await page.fill('input[type="password"]', 'Admin@KBFashions2026');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  console.log('7. Testing /admin/orders/ORD-2026-1001 (Admin strict forward stage progression)...');
  await page.goto('http://localhost:3000/admin/orders/ORD-2026-1001');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(artifactDir, '130_admin_consignment_monitor_strict_progression.png'),
    fullPage: true
  });

  await browser.close();
  console.log('Visual tests completed successfully!');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
