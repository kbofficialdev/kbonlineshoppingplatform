const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('--- 1. Authenticating Admin Session ---');
  const sessionRes = await page.request.post('http://localhost:3000/api/auth/admin-session');
  const sessionData = await sessionRes.json();
  const token = sessionData.token;

  await context.addCookies([
    { name: 'kb_auth_token', value: token, domain: 'localhost', path: '/' },
    { name: 'kb_session_active', value: '1', domain: 'localhost', path: '/' },
  ]);

  await page.goto('http://localhost:3000/');
  await page.evaluate((tok) => {
    localStorage.setItem('kb_auth_token', tok);
    localStorage.setItem('kb_auth_user', JSON.stringify({
      id: 'usr-admin-1',
      name: 'KB Store Administrator',
      email: 'kb.official.admin@gmail.com',
      role: 'ADMIN'
    }));
  }, token);
  await page.waitForTimeout(500);

  // 1. ADMIN PROMOTIONS & LIVE COUPONS
  console.log('--- 2. Capturing Admin Promotions & Coupons CRUD ---');
  await page.goto('http://localhost:3000/admin/promotions');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '170_admin_promotions_and_coupons_crud.png') });
  console.log('✓ Saved 170_admin_promotions_and_coupons_crud.png');

  // 2. CUSTOMER CART APPLYING DYNAMIC COUPON
  console.log('--- 3. Capturing Customer Cart with Dynamic Coupon Discount ---');
  // Add an item to bag via API to have a populated cart
  await page.evaluate(async () => {
    // Read auth token from localStorage or cookies
    const token = localStorage.getItem('kb_auth_token');
    await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        productId: 'PRD-101',
        name: 'Royal Gadwal Silk Saree',
        price: 2499,
        size: 'Free Size',
        color: 'Deep Maroon',
        qty: 1
      })
    });
    // Apply dynamic coupon
    await fetch('/api/cart/apply-promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ code: 'FESTIVE30' })
    });
  });

  await page.goto('http://localhost:3000/cart');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '171_customer_cart_dynamic_coupon_discount.png') });
  console.log('✓ Saved 171_customer_cart_dynamic_coupon_discount.png');

  // 3. STORE ALERT BANNER ON TOP OF NAVBAR
  console.log('--- 4. Capturing Store Alert Banner on Customer Navbar ---');
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '172_store_alert_banner_on_customer_navbar.png') });
  console.log('✓ Saved 172_store_alert_banner_on_customer_navbar.png');

  // 4. ADMIN PRODUCTS & WORKING IMAGE UPLOAD MODAL
  console.log('--- 5. Capturing Admin Products & Image Upload Interface ---');
  await page.goto('http://localhost:3000/admin/products');
  await page.waitForTimeout(1500);
  // Click "+ Add Product" button to show the modal with image upload and live preview
  try {
    const addBtn = page.locator('button:has-text("+ Add Product")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(800);
    }
  } catch (e) {}
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '173_admin_products_image_upload_and_editor.png') });
  console.log('✓ Saved 173_admin_products_image_upload_and_editor.png');

  // 5. CUSTOMER CATALOG REFLECTION
  console.log('--- 6. Capturing Customer Catalog Real Photography Reflection ---');
  await page.goto('http://localhost:3000/search?category=Sarees');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '174_customer_catalog_reflection_product_image.png') });
  console.log('✓ Saved 174_customer_catalog_reflection_product_image.png');

  // 6. ADMIN ORDERS MANAGEMENT & FULFILLMENT
  console.log('--- 7. Capturing Admin Orders Management & Tracking Modal ---');
  await page.goto('http://localhost:3000/admin/orders');
  await page.waitForTimeout(1500);
  // Click first "Manage & Update" button
  try {
    const manageBtn = page.locator('button:has-text("Manage & Update")').first();
    if (await manageBtn.isVisible()) {
      await manageBtn.click();
      await page.waitForTimeout(800);
    }
  } catch (e) {}
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '175_admin_orders_fulfillment_management.png') });
  console.log('✓ Saved 175_admin_orders_fulfillment_management.png');

  // 7. CUSTOMER ACCOUNT ISOLATED PAYMENT HISTORY
  console.log('--- 8. Capturing Customer Account Payment & Transaction History ---');
  await page.goto('http://localhost:3000/account?tab=transactions');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '176_customer_account_isolated_payment_history.png') });
  console.log('✓ Saved 176_customer_account_isolated_payment_history.png');

  // 8. ADMIN OPERATIONS & KILL-SWITCHES
  console.log('--- 9. Capturing Admin Operations & Kill-Switches ---');
  await page.goto('http://localhost:3000/admin/settings');
  await page.waitForTimeout(1200);
  // Click "Operations & Kill-Switches" tab
  try {
    const opsTab = page.locator('button:has-text("Operations & Kill-Switches")').first();
    if (await opsTab.isVisible()) {
      await opsTab.click();
      await page.waitForTimeout(600);
    }
  } catch (e) {}
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '177_admin_operations_kill_switches.png') });
  console.log('✓ Saved 177_admin_operations_kill_switches.png');

  // 9. STOREFRONT KILL-SWITCH EMERGENCY PAUSE NOTICE
  console.log('--- 10. Capturing Storefront Kill-Switch Customer Protection Notice ---');
  // Temporarily toggle checkout pause to capture customer protection
  await page.evaluate(async () => {
    const token = localStorage.getItem('kb_auth_token');
    await fetch('/api/store/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        isCheckoutEnabled: false,
        checkoutDisabledNotice: 'Checkout is temporarily paused for routine maintenance. Your items remain safely saved.'
      })
    });
  });

  await page.goto('http://localhost:3000/cart');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '178_customer_storefront_kill_switch_guard_notice.png') });
  console.log('✓ Saved 178_customer_storefront_kill_switch_guard_notice.png');

  // Restore checkout to enabled
  await page.evaluate(async () => {
    const token = localStorage.getItem('kb_auth_token');
    await fetch('/api/store/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ isCheckoutEnabled: true })
    });
  });

  // 10. ADMIN SUPPORT DESK REDESIGN
  console.log('--- 11. Capturing Redesigned Admin Support Desk ---');
  await page.goto('http://localhost:3000/admin/support');
  await page.waitForTimeout(1500);
  // Select first ticket if available
  try {
    const ticketRow = page.locator('div[class*="cursor-pointer"]').first();
    if (await ticketRow.isVisible()) {
      await ticketRow.click();
      await page.waitForTimeout(800);
    }
  } catch (e) {}
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '179_admin_support_desk_redesign.png') });
  console.log('✓ Saved 179_admin_support_desk_redesign.png');

  // 11. ADMIN AI RECOMMENDATIONS & DECISION ENGINE
  console.log('--- 12. Capturing AI Recommendations & ML Models ---');
  await page.goto('http://localhost:3000/admin/recommendations');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '180_admin_ai_recommendations_and_decision_engine.png') });
  console.log('✓ Saved 180_admin_ai_recommendations_and_decision_engine.png');

  // 12. FIXED LAYOUT WITH SCROLLABLE SIDEBAR & BODY
  console.log('--- 13. Capturing Admin Fixed Layout & Sidebar Scroll ---');
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '181_admin_fixed_layout_with_scrollable_body.png') });
  console.log('✓ Saved 181_admin_fixed_layout_with_scrollable_body.png');

  await browser.close();
  console.log('--- ALL VISUAL EVIDENCE SCREENSHOTS SUCCESSFULLY CAPTURED ---');
}

main().catch(err => {
  console.error('Playwright verification error:', err);
  process.exit(1);
});
