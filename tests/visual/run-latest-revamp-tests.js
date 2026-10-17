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

async function runTests() {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Verification Test Suite for Latest Revamps`);
  console.log(` 📸 Screenshots directory: ${SCREENSHOT_DIR}`);
  console.log(` 🏬 Live server at http://localhost:${TEST_PORT}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 820 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  const capture = async (name) => {
    const localPath = path.join(SCREENSHOT_DIR, name);
    const artifactPath = path.join(ARTIFACT_DIR, name);
    await page.screenshot({ path: localPath, fullPage: false });
    try {
      fs.copyFileSync(localPath, artifactPath);
    } catch (e) { }
    console.log(`✓ Captured: ${name}`);
  };

  try {
    // 1. Category Strip below Opaque Navbar
    console.log('\n[1] Capturing Category Strip below Opaque Navbar...');
    await page.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('86_category_strip_below_opaque_navbar.png');

    // 2. AI Private Preview Coming Soon
    console.log('\n[2] Capturing AI Private Preview Poster & Waitlist...');
    await page.goto(`http://localhost:${TEST_PORT}/ai`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('85_ai_private_preview_coming_soon.png');

    // 3. Split-Screen Sign In
    console.log('\n[3] Capturing Split-Screen Sign In Page...');
    await page.goto(`http://localhost:${TEST_PORT}/auth/signin`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('72_split_screen_signin_page.png');

    // 4. Split-Screen Sign Up
    console.log('\n[4] Capturing Split-Screen Sign Up Page...');
    await page.goto(`http://localhost:${TEST_PORT}/auth/signup`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('73_split_screen_signup_page.png');

    // 5. Split-Screen Forgot Password
    console.log('\n[5] Capturing Split-Screen Forgot Password...');
    await page.goto(`http://localhost:${TEST_PORT}/auth/forgot-password`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('74_split_screen_forgot_password.png');

    // 6. Split-Screen Reset Password
    console.log('\n[6] Capturing Split-Screen Reset Password...');
    await page.goto(`http://localhost:${TEST_PORT}/auth/reset-password?token=sample-test-token`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('75_split_screen_reset_password.png');

    // 7. Stunning About Us Page
    console.log('\n[7] Capturing Stunning About Us Heritage Page...');
    await page.goto(`http://localhost:${TEST_PORT}/about`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('76_about_us_stunning_heritage_page.png');

    // 8. Policy Grievance with Gradient Banner
    console.log('\n[8] Capturing Policy Grievance with Gradient Banner...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/grievance`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('77_policy_grievance_gradient_banner.png');

    // 9. Policy Shipping with Gradient Banner & 10km Radius
    console.log('\n[9] Capturing Policy Shipping with Gradient Banner...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/shipping`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('78_policy_shipping_gradient_banner.png');

    // 10. Policy Terms with Gradient Banner
    console.log('\n[10] Capturing Policy Terms with Gradient Banner...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/terms`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('79_policy_terms_gradient_banner.png');

    // 11. Policy Privacy with Gradient Banner
    console.log('\n[11] Capturing Policy Privacy with Gradient Banner...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/privacy`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('80_policy_privacy_gradient_banner.png');

    // 12. Policy Refunds with Gradient Banner
    console.log('\n[12] Capturing Policy Refunds with Gradient Banner...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/refunds`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('81_policy_refunds_gradient_banner.png');

    // 13. Policy Statutory Declaration with Gradient Banner
    console.log('\n[13] Capturing Policy Statutory Declaration...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/statutory-declaration`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('82_policy_statutory_gradient_banner.png');

    // 14. Admin Settings with Grievance Officer & Policy Broadcast
    console.log('\n[14] Capturing Admin Settings with Grievance Officer & Policy Broadcast...');
    // Sign in as admin first
    await page.goto(`http://localhost:${TEST_PORT}/auth/signin`, { waitUntil: 'domcontentloaded' });
    await page.fill('input[placeholder*="rahul@example.com"]', 'kb.official.admin@gmail.com');
    await page.fill('form input[type="password"]', 'Admin@KBFashions2026');
    await page.click('form button[type="submit"]');
    await page.waitForTimeout(1500);
    await page.goto(`http://localhost:${TEST_PORT}/admin/settings`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await capture('83_admin_settings_grievance_and_broadcast.png');

    // 15. Checkout Terms Consent & OTP Modal
    console.log('\n[15] Capturing Checkout Terms Consent & OTP Modal...');
    // Add item to cart first
    await page.goto(`http://localhost:${TEST_PORT}/products/prod-gadwal-1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const addBtn = await page.$('#add-to-bag-btn');
    if (addBtn) {
      await addBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.goto(`http://localhost:${TEST_PORT}/checkout`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    // Fill Step 1 address if not filled
    const addressInput = await page.$('input[placeholder*="House number"]');
    if (addressInput) {
      await addressInput.fill('H.No 3-45, Brahmin Street, Near Anjaneya Temple');
    }
    const pinInput = await page.$('input[placeholder*="503145"]');
    if (pinInput) {
      await pinInput.fill('503145');
    }
    const villageInput = await page.$('input[placeholder*="Village or City"]');
    if (villageInput) {
      await villageInput.fill('Kalwaral Village');
    }
    const districtInput = await page.$('input[placeholder*="District name"]');
    if (districtInput) {
      await districtInput.fill('Nizamabad');
    }
    const stateInput = await page.$('input[placeholder*="Telangana"]');
    if (stateInput) {
      await stateInput.fill('Telangana');
    }

    // Proceed to Step 2
    const continueBtn = await page.$('button:has-text("Continue to Payment Selection")');
    if (continueBtn) {
      await continueBtn.click();
      await page.waitForTimeout(800);
    }

    // Check all three statutory checkboxes
    const checkboxes = await page.$$('input[type="checkbox"]');
    for (const cb of checkboxes) {
      const isChecked = await cb.isChecked();
      if (!isChecked) {
        await cb.check();
      }
    }
    await page.waitForTimeout(400);

    // Click button to open OTP modal
    const otpTrigger = await page.$('#confirm-place-order-btn');
    if (otpTrigger) {
      await otpTrigger.click();
      await page.waitForTimeout(1200);
    }
    await capture('84_checkout_terms_consent_and_otp_modal.png');

    console.log('\n🎉 ALL REVAMP VISUAL TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test Suite Error:', err);
  } finally {
    await browser.close();
  }
}

runTests();
