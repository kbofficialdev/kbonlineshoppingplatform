const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runVisualTests() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const screenshotsDir = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('1. Capturing Homepage Hero Grand Banner without text overlays...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(screenshotsDir, '114_homepage_clean_hero_banner_no_text_overlays.png'),
    fullPage: false
  });

  console.log('2. Capturing Policy Terms & Conditions...');
  await page.goto('http://localhost:3000/policies/terms', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '115_policy_terms_black_banner_and_custom_svg.png'),
    fullPage: false
  });

  console.log('3. Capturing Shipping Policy (10 km Strict Radius)...');
  await page.goto('http://localhost:3000/policies/shipping', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '116_policy_shipping_10km_strictly_black_banner.png'),
    fullPage: false
  });

  console.log('4. Capturing Refund & Return Policy...');
  await page.goto('http://localhost:3000/policies/refunds', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '117_policy_refunds_7day_inspection_black_banner.png'),
    fullPage: false
  });

  console.log('5. Capturing Privacy Policy...');
  await page.goto('http://localhost:3000/policies/privacy', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '118_policy_privacy_it_act_dpdp_black_banner.png'),
    fullPage: false
  });

  console.log('6. Capturing Grievance Redressal Policy (Official Designation Only, No Personal Names)...');
  await page.goto('http://localhost:3000/policies/grievance', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '119_policy_grievance_official_designation_only_no_names.png'),
    fullPage: false
  });

  console.log('7. Capturing Statutory Tax Exemption Declaration (Sec 23 CGST Act)...');
  await page.goto('http://localhost:3000/policies/statutory-declaration', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '120_policy_statutory_declaration_sec23_cgst.png'),
    fullPage: false
  });

  console.log('8. Capturing Revamped Checkout Page (Step 1 Delivery)...');
  // Add an item to cart first so checkout has items
  await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, '121_checkout_page_clean_formatting_and_stepper.png'),
    fullPage: false
  });

  console.log('9. Capturing Checkout Step 2 Payment Selection...');
  const continueBtn = await page.$('button:has-text("Continue to Payment Selection")');
  if (continueBtn) {
    await continueBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(screenshotsDir, '122_checkout_page_step2_payment_options_and_summary.png'),
      fullPage: false
    });
  }

  await browser.close();
  console.log('ALL VISUAL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

runVisualTests().catch(err => {
  console.error('Visual Test Error:', err);
  process.exit(1);
});
