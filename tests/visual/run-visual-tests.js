const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const next = require('next');

const TEST_PORT = 8088;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVisualTests() {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Full Visual & Feature Playwright Test Suite`);
  console.log(` 📸 Screenshots directory: ${SCREENSHOT_DIR}`);
  console.log(`======================================================\n`);

  // 1. Start Next.js App Router Server
  console.log(`⏳ Preparing Next.js 14 production app on port ${TEST_PORT}...`);
  const app = next({ dev: false, dir: path.resolve(__dirname, '../../') });
  const handle = app.getRequestHandler();
  await app.prepare();
  const server = http.createServer((req, res) => handle(req, res));
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✓ Next.js 14 App Router running on http://localhost:${TEST_PORT}`);

  // 2. Launch Playwright Chrome
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  const testResults = [];

  // Automatically dismiss browser alerts
  page.on('dialog', async dialog => {
    console.log(`   [Browser Dialog] ${dialog.message()}`);
    await dialog.accept();
  });

  try {
    // TEST 1: Desktop Landing Experience
    console.log(`\n[Test 1] Loading Desktop Home View & Brand System...`);
    await page.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#product-grid article');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_home_view.png') });
    console.log(`✓ Captured: 01_desktop_home_view.png`);
    testResults.push({ test: "01 Desktop Home View", status: "PASSED" });

    // TEST 2: Category Filtering (Women's Collection)
    console.log(`\n[Test 2] Testing Category Filtering ('Women')...`);
    await page.click('button.cat-pill:has-text("Women")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_filtered_category_view.png') });
    console.log(`✓ Captured: 02_filtered_category_view.png`);
    testResults.push({ test: "02 Dynamic Category Filter", status: "PASSED" });

    // TEST 3: Live Search Command Modal
    console.log(`\n[Test 3] Testing Live Search Command Modal...`);
    await page.click('#search-open-btn');
    await page.waitForSelector('#search-modal:not(.opacity-0)');
    await page.fill('#search-input', 'cotton');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_search_command_modal.png') });
    console.log(`✓ Captured: 03_search_command_modal.png`);
    testResults.push({ test: "03 Live Search Modal", status: "PASSED" });
    await page.click('#search-modal-close');
    await page.waitForTimeout(300);

    // Reset filter
    await page.click('button.cat-pill:has-text("All")');
    await page.waitForTimeout(300);

    // TEST 4: Product Detail Modal (PDP) with Statutory Mandates
    console.log(`\n[Test 4] Testing Product Detail Modal (PDP) with Statutory Badges...`);
    await page.click('#product-grid article:first-child');
    await page.waitForSelector('#product-modal:not(.opacity-0)');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_pdp_modal_statutory.png') });
    console.log(`✓ Captured: 04_pdp_modal_statutory.png`);
    testResults.push({ test: "04 PDP Modal with Statutory Mandates", status: "PASSED" });

    // TEST 5: Size Guide Modal Overlay
    console.log(`\n[Test 5] Testing Standard Size Guide Table...`);
    await page.click('button:has-text("Size Guide")');
    await page.waitForSelector('#size-guide-modal:not(.opacity-0)');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_size_guide_table.png') });
    console.log(`✓ Captured: 05_size_guide_table.png`);
    testResults.push({ test: "05 Size Guide Table Modal", status: "PASSED" });
    await page.click('#size-guide-modal button:has-text("✕")'); // close size guide via its close button
    await page.waitForTimeout(300);

    // TEST 6: Add Item to Bag & Slide-Over Bag Drawer with Free Shipping Tier
    console.log(`\n[Test 6] Testing Slide-Over Bag Drawer & Free Shipping Progress Tier...`);
    await page.click('#product-modal button:has-text("Add to Bag")');
    await page.waitForSelector('#bag-drawer:not(.opacity-0)');
    // Apply promo code KB10
    await page.fill('#promo-code-input', 'KB10');
    await page.click('button:has-text("Apply")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_bag_drawer_free_shipping_tier.png') });
    console.log(`✓ Captured: 06_bag_drawer_free_shipping_tier.png`);
    testResults.push({ test: "06 Slide-Over Bag Drawer & Promo Tier", status: "PASSED" });
    await page.click('#bag-drawer-close');
    await page.waitForTimeout(300);

    // TEST 7: Wishlist Drawer
    console.log(`\n[Test 7] Testing Wishlist Drawer...`);
    // Toggle wishlist on second product
    await page.click('#product-grid article:nth-child(2) button:has-text("♡")');
    await page.click('#wishlist-open-btn');
    await page.waitForSelector('#wishlist-drawer:not(.opacity-0)');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_wishlist_drawer.png') });
    console.log(`✓ Captured: 07_wishlist_drawer.png`);
    testResults.push({ test: "07 Wishlist Drawer", status: "PASSED" });
    await page.keyboard.press('Escape'); // close wishlist
    await page.waitForTimeout(200);

    // TEST 8: Multi-Step Checkout: Delivery Details
    console.log(`\n[Test 8] Testing Multi-Step Checkout: Step 1 Delivery...`);
    await page.click('#bag-open-btn');
    await page.waitForSelector('#bag-drawer:not(.opacity-0)');
    await page.click('#checkout-btn');
    await page.waitForSelector('#checkout-modal:not(.opacity-0)');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_checkout_step1_delivery.png') });
    console.log(`✓ Captured: 08_checkout_step1_delivery.png`);
    testResults.push({ test: "08 Checkout Step 1 Delivery", status: "PASSED" });

    // TEST 9: Multi-Step Checkout: Payment Gateway
    console.log(`\n[Test 9] Testing Multi-Step Checkout: Step 2 Payment Selection...`);
    await page.click('button:has-text("Continue to Payment Method →")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_checkout_step2_payment.png') });
    console.log(`✓ Captured: 09_checkout_step2_payment.png`);
    testResults.push({ test: "09 Checkout Step 2 Payment Gateway", status: "PASSED" });

    // TEST 10: Multi-Step Checkout: Order Confirmation & Invoice Trigger
    console.log(`\n[Test 10] Testing Order Placement & Confirmation...`);
    await page.click('#place-order-btn');
    await page.waitForSelector('#checkout-step-3:not(.hidden)', { timeout: 5000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_checkout_step3_order_confirmation.png') });
    console.log(`✓ Captured: 10_checkout_step3_order_confirmation.png`);
    testResults.push({ test: "10 Order Confirmation & Invoice Generation", status: "PASSED" });

    // TEST 11: Statutory Tax Invoice View
    console.log(`\n[Test 11] Testing Printable Statutory Tax Invoice (Rule 46 CGST)...`);
    const invoiceUrl = await page.getAttribute('#conf-invoice-link', 'href');
    const invoicePage = await context.newPage();
    await invoicePage.goto(`http://localhost:${TEST_PORT}${invoiceUrl}`, { waitUntil: 'networkidle' });
    await invoicePage.screenshot({ path: path.join(SCREENSHOT_DIR, '11_statutory_tax_invoice.png') });
    console.log(`✓ Captured: 11_statutory_tax_invoice.png`);
    testResults.push({ test: "11 Statutory Tax Invoice Generator", status: "PASSED" });
    await invoicePage.close();
    await page.click('button:has-text("Continue Shopping")');

    // TEST 12: Public Merchant Verification Portal (/verify-merchant)
    console.log(`\n[Test 12] Testing Public Merchant Regulatory Verification Portal...`);
    await page.locator('button:has-text("Verify Merchant")').first().click();
    await page.waitForSelector('#merchant-modal:not(.opacity-0)');
    await page.click('button:has-text("Verify Record")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_merchant_verification_portal.png') });
    console.log(`✓ Captured: 12_merchant_verification_portal.png`);
    testResults.push({ test: "12 Public Merchant Verification Portal", status: "PASSED" });
    await page.click('#merchant-modal button:has-text("✕")');
    await page.waitForTimeout(300);

    // TEST 13: Platform Governance & Immutable Audit Ledger
    console.log(`\n[Test 13] Testing Governance & Cryptographic Audit Ledger...`);
    await page.locator('button:has-text("Governance")').first().click();
    await page.waitForSelector('#admin-modal:not(.opacity-0)');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_admin_audit_ledger.png') });
    console.log(`✓ Captured: 13_admin_audit_ledger.png`);
    testResults.push({ test: "13 Admin Governance & Immutable Audit Ledger", status: "PASSED" });
    await page.click('#admin-modal button:has-text("✕")');
    await page.waitForTimeout(300);

    // TEST 14: Mobile Viewport & Ergonomics (375x667)
    console.log(`\n[Test 14] Testing Mobile Ergonomics & Bottom Bar (375x667)...`);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(400);
    // Click hamburger to open mobile menu
    await page.click('#mobile-menu-btn');
    await page.waitForSelector('#mobile-drawer:not(.opacity-0)');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_mobile_bottom_bar_and_drawer.png') });
    console.log(`✓ Captured: 14_mobile_bottom_bar_and_drawer.png`);
    testResults.push({ test: "14 Mobile Navigation & Thumb Ergonomics", status: "PASSED" });

  } catch (error) {
    console.error("Test execution failed with error:", error);
    testResults.push({ test: "Test Execution", status: "FAILED", error: error.message });
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n======================================================`);
  console.log(` 📊 PLAYWRIGHT TEST SUMMARY:`);
  console.log(`======================================================`);
  testResults.forEach(r => {
    console.log(` [${r.status}] ${r.test}`);
  });
  console.log(`======================================================\n`);

  const hasFailures = testResults.some(r => r.status === 'FAILED');
  if (hasFailures) process.exit(1);
}

runVisualTests().catch(err => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});

