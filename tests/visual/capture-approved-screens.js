const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kb_fashions_production_master_jwt_secret_key_2026_secured';

async function capture() {
  const screenshotDir = path.resolve(__dirname, '../../data/screenshots_revamp');
  const artifactDir = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';

  [screenshotDir, artifactDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const customerUser = {
    id: 'usr-customer-1',
    name: 'Rahul Sharma',
    email: 'customer@example.com',
    role: 'CUSTOMER',
    phone: '+91 9876543210',
    villageOrCity: 'Kalwaral',
    district: 'Kamareddy',
    state: 'Telangana',
    pinCode: '503145',
  };

  const adminUser = {
    id: 'usr-admin-1',
    name: 'KB Fashions Store Admin',
    email: 'kb.official.admin@gmail.com',
    role: 'ADMIN',
    phone: '+91 7989768200',
    villageOrCity: 'Kalwaral',
    district: 'Kamareddy',
    state: 'Telangana',
    pinCode: '503145',
  };

  const customerToken = jwt.sign(customerUser, JWT_SECRET, { expiresIn: '7d' });
  const adminToken = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '7d' });

  const takeShot = async (page, filename) => {
    const p1 = path.join(screenshotDir, filename);
    const p2 = path.join(artifactDir, filename);
    await page.screenshot({ path: p1, fullPage: false });
    await page.screenshot({ path: p2, fullPage: false });
    console.log(`✓ Saved: ${filename}`);
  };

  try {
    // 1. Desktop Context
    console.log('--- Setting up Desktop Browser ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });

    await desktopContext.addCookies([
      { name: 'auth_token', value: customerToken, domain: 'localhost', path: '/' },
    ]);

    const desktopPage = await desktopContext.newPage();
    await desktopPage.addInitScript(({ token, user }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }, { token: customerToken, user: customerUser });

    // Seed Cart item for Rahul Sharma
    await desktopPage.goto('http://localhost:3000/');
    await desktopPage.evaluate(async () => {
      await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({
          productId: 'prod-gadwal-1',
          name: 'Authentic Handloom Gadwal Cotton-Silk Saree',
          price: 2450,
          qty: 1,
          size: '6.3m with Blouse',
          sessionId: 'usr-customer-1',
        })
      });
    });

    // Screen 1: Desktop Homepage
    console.log('Capturing Screen 1: Desktop Homepage...');
    await desktopPage.goto('http://localhost:3000/');
    await desktopPage.waitForTimeout(1000);
    await takeShot(desktopPage, '152_desktop_homepage.png');

    // Screen 5: Desktop Product Details
    console.log('Capturing Screen 5: Desktop Product Details...');
    await desktopPage.goto('http://localhost:3000/products/prod-gadwal-1');
    await desktopPage.waitForTimeout(1000);
    await takeShot(desktopPage, '156_desktop_product_details.png');

    // Screen 6: Shopping Cart
    console.log('Capturing Screen 6: Shopping Cart...');
    await desktopPage.goto('http://localhost:3000/cart');
    await desktopPage.waitForTimeout(1000);
    await takeShot(desktopPage, '157_desktop_shopping_cart.png');

    // Screen 7: Checkout (3-Step Stepper)
    console.log('Capturing Screen 7: Checkout (3-Step Stepper)...');
    await desktopPage.goto('http://localhost:3000/checkout');
    await desktopPage.waitForTimeout(1000);
    await takeShot(desktopPage, '158_desktop_checkout_stepper.png');

    // Screen 8: Customer Dashboard
    console.log('Capturing Screen 8: Customer Dashboard...');
    await desktopPage.goto('http://localhost:3000/account');
    await desktopPage.waitForTimeout(1000);
    await takeShot(desktopPage, '159_desktop_customer_dashboard.png');

    // Switch to Admin Session for Screen 9
    console.log('Capturing Screen 9: Admin Dashboard...');
    await desktopContext.clearCookies();
    await desktopContext.addCookies([
      { name: 'auth_token', value: adminToken, domain: 'localhost', path: '/' },
    ]);
    await desktopPage.addInitScript(({ token, user }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }, { token: adminToken, user: adminUser });

    await desktopPage.goto('http://localhost:3000/admin');
    await desktopPage.waitForTimeout(1200);
    await takeShot(desktopPage, '160_desktop_admin_dashboard.png');

    await desktopContext.close();

    // 2. Mobile Context (iPhone 13 / 390x844)
    console.log('--- Setting up Mobile Browser ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });

    await mobileContext.addCookies([
      { name: 'auth_token', value: customerToken, domain: 'localhost', path: '/' },
    ]);

    const mobilePage = await mobileContext.newPage();
    await mobilePage.addInitScript(({ token, user }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }, { token: customerToken, user: customerUser });

    // Screen 2: Mobile Homepage
    console.log('Capturing Screen 2: Mobile Homepage...');
    await mobilePage.goto('http://localhost:3000/');
    await mobilePage.waitForTimeout(1000);
    await takeShot(mobilePage, '153_mobile_homepage.png');

    // Screen 3: Mobile Category & Product Listing (Sarees)
    console.log('Capturing Screen 3: Mobile Category & Products (Sarees)...');
    await mobilePage.goto('http://localhost:3000/search?category=Sarees');
    await mobilePage.waitForTimeout(1000);
    await takeShot(mobilePage, '154_mobile_category_sarees.png');

    // Screen 4: Mobile Customer Account
    console.log('Capturing Screen 4: Mobile Customer Account...');
    await mobilePage.goto('http://localhost:3000/account');
    await mobilePage.waitForTimeout(1000);
    await takeShot(mobilePage, '155_mobile_customer_account.png');

    await mobileContext.close();

    console.log('================================================================');
    console.log('✓ All 9 Approved UI Reference Screens Captured Successfully!');
    console.log('================================================================');
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    await browser.close();
  }
}

capture();

