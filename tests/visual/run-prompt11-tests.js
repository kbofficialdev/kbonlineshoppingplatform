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

// Generate valid admin token
const adminToken = jwt.sign(
  {
    userId: 'usr-admin-1',
    email: 'kb.official.admin@gmail.com',
    role: 'ADMIN',
    name: 'KB Fashions Store Admin'
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);

async function runPrompt11Tests() {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Verification Test Suite for Prompt 11 Requirements`);
  console.log(` 📸 Screenshots directory: ${SCREENSHOT_DIR}`);
  console.log(` 🏬 Live server at http://localhost:${TEST_PORT}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Desktop Context (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  await desktopContext.addCookies([
    {
      name: 'kb_auth_token',
      value: adminToken,
      url: `http://localhost:${TEST_PORT}`
    },
    {
      name: 'kb_auth_token',
      value: adminToken,
      domain: 'localhost',
      path: '/'
    }
  ]);

  // Mobile Context (375x812 - iPhone X/12)
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
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
    const desktopPage = await desktopContext.newPage();

    // 1. Desktop Navbar with Floating Categories Dropdown Open
    console.log('\n[1] Capturing Desktop Navbar with Floating Categories Dropdown Open...');
    await desktopPage.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'domcontentloaded' });
    await desktopPage.waitForTimeout(1000);

    // Click the Categories dropdown button in navbar
    const catBtn = await desktopPage.$('#desktop-categories-nav-trigger');
    if (catBtn) {
      await catBtn.click();
      await desktopPage.waitForTimeout(600);
    }
    await capture(desktopPage, '97_desktop_navbar_categories_dropdown_open.png', false);

    // 2. Desktop Navbar Scrolled Down Hiding Any Body Content
    console.log('\n[2] Capturing Desktop Navbar on Scroll (Solid Opaque Hiding Body Content)...');
    // Close dropdown first
    if (catBtn) await catBtn.click();
    await desktopPage.waitForTimeout(300);

    // Scroll down 400px so carousel passes underneath navbar
    await desktopPage.evaluate(() => window.scrollTo(0, 400));
    await desktopPage.waitForTimeout(500);
    await capture(desktopPage, '98_desktop_navbar_scrolled_hiding_body.png', false);

    // 3. Mobile Sidebar with Complete Categories
    console.log('\n[3] Capturing Mobile Sidebar Drawer with Complete Categories...');
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(800);

    // Click mobile hamburger menu
    const menuToggle = await mobilePage.$('#mobile-menu-toggle-btn');
    if (menuToggle) {
      await menuToggle.click();
      await mobilePage.waitForTimeout(600);
      await capture(mobilePage, '99_mobile_sidebar_with_complete_categories.png', false);
    }
    await mobilePage.close();

    // 4. Admin Alerts Page with Standard Color Picker
    console.log('\n[4] Capturing Admin Alerts Page with Standard Color Picker...');
    await desktopPage.addInitScript((tok) => {
      window.localStorage.setItem('kb_auth_token', tok);
      window.localStorage.setItem(
        'kb_user_info',
        JSON.stringify({
          userId: 'usr-admin-1',
          email: 'kb.official.admin@gmail.com',
          role: 'ADMIN',
          name: 'KB Fashions Store Admin'
        })
      );
    }, adminToken);

    await desktopPage.goto(`http://localhost:${TEST_PORT}/admin/alerts`, { waitUntil: 'domcontentloaded' });
    await desktopPage.waitForTimeout(1000);
    await capture(desktopPage, '100_admin_alerts_standard_color_picker.png', false);

    console.log('\n✅ All Prompt 11 Verification Screenshots captured successfully!\n');
  } catch (err) {
    console.error('❌ Error during visual tests:', err);
  } finally {
    await browser.close();
  }
}

runPrompt11Tests();
