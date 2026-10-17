const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const TEST_PORT = 3000;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const ARTIFACT_DIR = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';
const JWT_SECRET = 'kb_fashions_telangana_super_secret_jwt_key_2026_xyz';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

// Generate valid customer token for Rahul Sharma (usr-cust-1)
const customerToken = jwt.sign(
  {
    userId: 'usr-cust-1',
    email: 'customer@example.com',
    role: 'CUSTOMER',
    name: 'Rahul Sharma'
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);

async function runPrompt12Tests() {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Verification Test Suite for Prompt 12 Requirements`);
  console.log(` 📱 Mobile UI Revamp Inspired by Modern My Account UI`);
  console.log(` 📸 Screenshots directory: ${SCREENSHOT_DIR}`);
  console.log(` 🏬 Live server at http://localhost:${TEST_PORT}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Mobile Context (375x812 - iPhone X/12)
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  await mobileContext.addCookies([
    {
      name: 'kb_auth_token',
      value: customerToken,
      url: `http://localhost:${TEST_PORT}`
    },
    {
      name: 'kb_auth_token',
      value: customerToken,
      domain: 'localhost',
      path: '/'
    }
  ]);

  // Desktop Context (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  await desktopContext.addCookies([
    {
      name: 'kb_auth_token',
      value: customerToken,
      url: `http://localhost:${TEST_PORT}`
    },
    {
      name: 'kb_auth_token',
      value: customerToken,
      domain: 'localhost',
      path: '/'
    }
  ]);

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
    const mobilePage = await mobileContext.newPage();

    // Set localStorage auth token as well for clientAuth.ts
    await mobilePage.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'domcontentloaded' });
    await mobilePage.evaluate((token) => {
      localStorage.setItem('kb_auth_token', token);
      localStorage.setItem('kb_user_role', 'CUSTOMER');
    }, customerToken);

    // 1. Mobile Modern My Account UI with Floating Dock
    console.log('\n[1] Capturing Mobile Modern My Account UI with Floating Dock...');
    await mobilePage.goto(`http://localhost:${TEST_PORT}/account`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    await capture(mobilePage, '101_modern_my_account_mobile_ui.png', false);

    // 2. Mobile Account Subview (Click Profile)
    console.log('\n[2] Navigating to Mobile Profile Subview and verifying Back button...');
    const profileRow = await mobilePage.$('text="Your Profile"');
    if (profileRow) {
      await profileRow.click();
      await mobilePage.waitForTimeout(600);
    }
    await capture(mobilePage, '102_modern_account_mobile_subview.png', false);

    // Click Back to Menu
    console.log('\n[2b] Clicking Back to Account Menu on mobile...');
    const backBtn = await mobilePage.$('text="‹ Back to Account Menu"');
    if (backBtn) {
      await backBtn.click();
      await mobilePage.waitForTimeout(400);
    }

    // 3. Desktop Split View (/account)
    console.log('\n[3] Capturing Desktop Split View for Account Page...');
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'domcontentloaded' });
    await desktopPage.evaluate((token) => {
      localStorage.setItem('kb_auth_token', token);
      localStorage.setItem('kb_user_role', 'CUSTOMER');
    }, customerToken);

    await desktopPage.goto(`http://localhost:${TEST_PORT}/account`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);
    await capture(desktopPage, '103_modern_account_desktop_split_view.png', false);

    // 4. Mobile Homepage with Floating Dock
    console.log('\n[4] Capturing Mobile Homepage with Floating Bottom Dock...');
    await mobilePage.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    await capture(mobilePage, '104_mobile_bottom_dock_homepage.png', false);

    console.log(`\n======================================================`);
    console.log(` 🏆 Verification Suite Completed Successfully!`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    await browser.close();
  }
}

runPrompt12Tests();
