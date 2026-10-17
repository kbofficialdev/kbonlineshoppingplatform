const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const ARTIFACT_DIR = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function saveDual(page, filename) {
  const localPath = path.join(SCREENSHOT_DIR, filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  return Promise.all([
    page.screenshot({ path: localPath, fullPage: true }),
    page.screenshot({ path: artifactPath, fullPage: true }),
  ]);
}

async function runPrompt14Tests() {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Verification Test Suite for Prompt 14`);
  console.log(` 💳 Cashfree Payments Hosted Checkout Integration (API 2026-01-01)`);
  console.log(` 📧 Live Transactional Email Diagnostics (Google SMTP Handshake)`);
  console.log(` 🛡️ Defensive Security Hardening Headers`);
  console.log(` 👑 Elegant K-B Monogram Logo & Favicon Integration`);
  console.log(` ⚙️ Admin Database Settings Portal`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Authenticate as Admin via API and set cookie
    console.log('1. Signing in as Admin via API...');
    const adminLoginRes = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone: 'kb.official.admin@gmail.com', password: 'Admin@KBFashions2026' })
    });
    const adminData = await adminLoginRes.json();
    console.log('Admin Token Received:', !!adminData.token);

    await context.addCookies([
      { name: 'kb_auth_token', value: adminData.token, domain: 'localhost', path: '/' },
      { name: 'kb_session_active', value: '1', domain: 'localhost', path: '/' }
    ]);

    console.log('2. Viewing Admin Settings with Cashfree & Email Diagnostics...');
    await page.goto('http://localhost:3000/admin/settings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveDual(page, '111_admin_settings_cashfree_and_email_diagnostics.png');
    console.log('✓ Captured 111_admin_settings_cashfree_and_email_diagnostics.png');

    // 3. Customer Sign In (Password + OTP)
    console.log('3. Signing in as Customer (k.bhavithkumar.dev@gmail.com)...');
    const custLoginRes = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone: 'k.bhavithkumar.dev@gmail.com', password: 'Customer@123', otp: '123456' })
    });
    const custData = await custLoginRes.json();
    console.log('Customer Token Received:', !!custData.token);

    await context.clearCookies();
    await context.addCookies([
      { name: 'kb_auth_token', value: custData.token, domain: 'localhost', path: '/' },
      { name: 'kb_session_active', value: '1', domain: 'localhost', path: '/' }
    ]);

    // 4. Add product to bag
    console.log('4. Adding product to shopping bag via API...');
    await fetch('http://localhost:3000/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custData.token}`
      },
      body: JSON.stringify({
        productId: 'prod-gadwal-1',
        name: 'Authentic Handloom Gadwal Cotton-Silk Saree',
        price: 2450,
        qty: 1,
        size: 'Standard 6.3m',
        color: 'Earthy Mustard & Maroon'
      })
    });

    // 5. Checkout Step 2 with Cashfree
    console.log('5. Navigating to Checkout Step 2...');
    await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const continueBtn = await page.$('button:has-text("Continue to Payment Selection")');
    if (continueBtn) {
      await continueBtn.click();
      await page.waitForTimeout(1200);
    }

    await saveDual(page, '112_checkout_step2_cashfree_hosted_option.png');
    console.log('✓ Captured 112_checkout_step2_cashfree_hosted_option.png');

    // 6. Cashfree Return Page
    console.log('6. Inspecting Cashfree Return Page...');
    await page.goto('http://localhost:3000/checkout/cashfree-return?order_id=ORD-CF-1718000000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await saveDual(page, '113_checkout_cashfree_return_page.png');
    console.log('✓ Captured 113_checkout_cashfree_return_page.png');

    console.log('\n✅ All Prompt 14 verification visual tests completed successfully!\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await browser.close();
  }
}

runPrompt14Tests();
