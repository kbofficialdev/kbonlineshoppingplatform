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

// Generate valid admin token with exact db credentials
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

async function runPrompt10Tests() {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Verification Test Suite for Prompt 10 Requirements`);
  console.log(` 📸 Screenshots directory: ${SCREENSHOT_DIR}`);
  console.log(` 🏬 Live server at http://localhost:${TEST_PORT}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Desktop context (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  // Add cookies with both url and domain to be 100% resilient across Chromium versions
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

  // Mobile context (375x812 - iPhone X/12)
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
    const page = await desktopContext.newPage();

    // Set localStorage for client-side state
    await page.addInitScript((tok) => {
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

    // 1. Full-Viewport Carousel on Desktop
    console.log('\n[1] Capturing Full-Viewport Carousel on Desktop (1440px wide)...');
    await page.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await capture(page, '87_carousel_full_viewport_desktop.png', false);

    // 2. Full-Viewport Carousel on Mobile
    console.log('\n[2] Capturing Full-Viewport Carousel on Mobile (375px wide)...');
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(1000);
    await capture(mobilePage, '88_carousel_full_viewport_mobile.png', false);
    await mobilePage.close();

    // 3. Admin Banner Upload & Dimensions Guide
    console.log('\n[3] Capturing Admin Banner Upload & Dimensions Guide (/admin/alerts)...');
    await page.goto(`http://localhost:${TEST_PORT}/admin/alerts`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    await capture(page, '89_admin_banner_upload_and_dimensions_guide.png', false);

    // 4. Customer Support Ticket Portal
    console.log('\n[4] Capturing Customer Support Ticket Portal (/support)...');
    await page.goto(`http://localhost:${TEST_PORT}/support`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await capture(page, '90_customer_support_ticket_portal.png', false);

    // 5. Customer Ticket Modal & Form
    console.log('\n[5] Capturing Ticket Creation Modal Form...');
    const newTicketBtn = await page.$('button:has-text("Raise Support Ticket")');
    if (newTicketBtn) {
      await newTicketBtn.click();
      await page.waitForTimeout(500);
      const subjectInput = await page.$('input[placeholder*="Order delayed"]');
      if (subjectInput) {
        await subjectInput.fill('Pincode 503145 Handloom Dispatch Query');
      }
      const descInput = await page.$('textarea[placeholder*="clearly explain"]');
      if (descInput) {
        await descInput.fill('Please confirm delivery date for our wedding saree package to Kalwaral village.');
      }
      await page.waitForTimeout(400);
      await capture(page, '91_customer_ticket_modal_form.png', false);

      // Close modal
      const closeBtn = await page.$('button:has-text("Cancel")');
      if (closeBtn) await closeBtn.click();
    }

    // 6. Admin Support Desk Portal
    console.log('\n[6] Capturing Admin Support Desk Portal (/admin/support)...');
    await page.goto(`http://localhost:${TEST_PORT}/admin/support`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    await capture(page, '92_admin_support_desk_portal.png', false);

    // 7. Policy: Shipping
    console.log('\n[7] Capturing Colorful Shipping Policy Page (/policies/shipping)...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/shipping`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await capture(page, '93_policy_shipping_colorful_revamp.png', false);

    // 8. Policy: Refunds
    console.log('\n[8] Capturing Colorful Refunds Policy Page (/policies/refunds)...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/refunds`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await capture(page, '94_policy_refunds_colorful_revamp.png', false);

    // 9. Policy: Grievance Officer
    console.log('\n[9] Capturing Colorful Grievance Officer Page (/policies/grievance)...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/grievance`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await capture(page, '95_policy_grievance_officer_revamp.png', false);

    // 10. Redesigned Obsidian Footer
    console.log('\n[10] Capturing Redesigned Obsidian Footer...');
    await page.goto(`http://localhost:${TEST_PORT}/policies/terms`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await capture(page, '96_redesigned_obsidian_footer.png', false);

    console.log('\n✅ All Prompt 10 Verification Screenshots captured successfully!\n');
  } catch (err) {
    console.error('❌ Error during visual tests:', err);
  } finally {
    await browser.close();
  }
}

runPrompt10Tests();
