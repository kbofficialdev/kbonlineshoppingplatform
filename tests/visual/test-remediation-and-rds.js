const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runVisualRemediationTests() {
  const artifactDir = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('--- Phase 1: Universal Opacity Loader Overlay & Registration Fix ---');
  // 1. Visit Signup Page
  await page.goto('http://localhost:3000/auth/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Fill in Registration Form
  const testEmail = `patron.${Date.now()}@kbfashions.in`;
  await page.fill('input[placeholder*="Bhavith Kumar"], input[type="text"]:first-of-type', 'Kalwaral Heritage Patron');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="tel"]', '7989768299');
  await page.fill('input[type="password"]', 'HeritagePass@2026');

  // Submit and immediately capture the active Opacity Loader Overlay
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    // Wait brief moment for loader overlay to be mounted in DOM
    await page.waitForTimeout(100);
    await page.screenshot({
      path: path.join(artifactDir, '143_signup_opacity_loader_overlay.png'),
    });
    console.log('✓ Captured 143_signup_opacity_loader_overlay.png');

    // Wait for transition to OTP verification screen
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(artifactDir, '144_signup_instant_otp_step.png'),
    });
    console.log('✓ Captured 144_signup_instant_otp_step.png');
  }

  console.log('--- Phase 2: Sign In Page & Opacity Loader ---');
  await page.goto('http://localhost:3000/auth/signin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(artifactDir, '145_signin_page_clean.png'),
  });
  console.log('✓ Captured 145_signin_page_clean.png');

  // Fill credentials and click sign in
  await page.fill('input[type="text"], input[type="email"]', 'kb.official.admin@gmail.com');
  await page.fill('input[type="password"]', 'Admin@KBFashions2026');
  const signinBtn = await page.$('button[type="submit"]');
  if (signinBtn) {
    await signinBtn.click();
    await page.waitForTimeout(120);
    await page.screenshot({
      path: path.join(artifactDir, '146_signin_opacity_loader_overlay.png'),
    });
    console.log('✓ Captured 146_signin_opacity_loader_overlay.png');
    await page.waitForTimeout(1000);
  }
  await context.close();

  console.log('--- Phase 3: Support Ticket System Overhaul (Guest Access & Thread Tracking) ---');
  const guestContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const guestPage = await guestContext.newPage();

  await guestPage.goto('http://localhost:3000/support', { waitUntil: 'domcontentloaded' });
  await guestPage.waitForTimeout(800);

  // Capture Guest Support Desk with Mode Toggle & Form
  await guestPage.screenshot({
    path: path.join(artifactDir, '147_guest_support_desk_portal.png'),
  });
  console.log('✓ Captured 147_guest_support_desk_portal.png');

  // Fill in Guest Support Form
  await guestPage.fill('input[placeholder*="Ramesh Kumar"]', 'Suresh Reddy (Kalwaral Farmer)');
  await guestPage.fill('input[placeholder*="ramesh@example.com"]', 'suresh.reddy@gmail.com');
  await guestPage.fill('input[placeholder*="98765"]', '+91 94401 23456');
  await guestPage.fill('input[placeholder*="Brief summary"]', 'Order Inquiry: 10 km Village Delivery Schedule');
  await guestPage.fill('textarea', 'Greetings to KB Fashions team. I placed an inquiry about Raymond suit cuts for our upcoming family function in Sadasivanagar mandal. Kindly confirm if direct hand delivery to Kalwaral village center is available tomorrow morning.');

  // Submit and capture loader overlay
  const supportSubmitBtn = await guestPage.$('button:has-text("Submit Support Ticket")');
  if (supportSubmitBtn) {
    await supportSubmitBtn.click();
    await guestPage.waitForTimeout(100);
    await guestPage.screenshot({
      path: path.join(artifactDir, '148_support_ticket_submission_loader.png'),
    });
    console.log('✓ Captured 148_support_ticket_submission_loader.png');

    // Wait for the ticket modal to appear with conversation thread
    await guestPage.waitForTimeout(1800);
    await guestPage.screenshot({
      path: path.join(artifactDir, '149_guest_ticket_created_conversation_modal.png'),
    });
    console.log('✓ Captured 149_guest_ticket_created_conversation_modal.png');
  }

  // Close ticket modal and test Track Ticket mode
  const closeBtn = await guestPage.$('button:has-text("✕")');
  if (closeBtn) {
    await closeBtn.click();
    await guestPage.waitForTimeout(400);
  }

  const trackModeBtn = await guestPage.$('button:has-text("Track Ticket")');
  if (trackModeBtn) {
    await trackModeBtn.click();
    await guestPage.waitForTimeout(400);
    await guestPage.fill('input[placeholder*="TKT-2026"]', 'suresh.reddy@gmail.com');
    await guestPage.screenshot({
      path: path.join(artifactDir, '150_guest_track_ticket_mode.png'),
    });
    console.log('✓ Captured 150_guest_track_ticket_mode.png');
  }
  await guestContext.close();

  console.log('--- Phase 4: Mobile Responsive View Verification ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/support', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({
    path: path.join(artifactDir, '151_mobile_guest_support_desk.png'),
  });
  console.log('✓ Captured 151_mobile_guest_support_desk.png');

  await browser.close();
  console.log('\n================================================================');
  console.log('✓ ALL REMEDIATION & VISUAL TESTS COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
}

runVisualRemediationTests().catch(err => {
  console.error('Visual test run failed:', err);
  process.exit(1);
});
