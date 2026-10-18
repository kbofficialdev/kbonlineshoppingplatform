const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testNavbarAndHomepage() {
  const artifactDir = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // 1. Desktop Test (1440x900)
  console.log('Testing Desktop View...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // Take screenshot of clean navbar & top hero
  await desktopPage.screenshot({
    path: path.join(artifactDir, '136_desktop_clean_navbar_and_hero.png'),
  });
  console.log('✓ Captured 136_desktop_clean_navbar_and_hero.png');

  // Click profile trigger to test dropdown menu
  const profileTrigger = await desktopPage.$('#kb-navbar-profile-trigger');
  if (profileTrigger) {
    await profileTrigger.click();
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({
      path: path.join(artifactDir, '137_desktop_profile_dropdown_menu.png'),
    });
    console.log('✓ Captured 137_desktop_profile_dropdown_menu.png');
  }

  // Scroll down to view the clean product grid & trust section
  await desktopPage.evaluate(() => window.scrollTo(0, 750));
  await desktopPage.waitForTimeout(400);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '138_desktop_streamlined_product_grid.png'),
  });
  console.log('✓ Captured 138_desktop_streamlined_product_grid.png');

  // Scroll to footer to verify non-redundant clean links
  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await desktopPage.waitForTimeout(400);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '139_desktop_footer_non_redundant_links.png'),
  });
  console.log('✓ Captured 139_desktop_footer_non_redundant_links.png');

  await desktopContext.close();

  // 2. Mobile View (390x844 - iPhone / Android)
  console.log('Testing Mobile View...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // Mobile Top & Hero Banner
  await mobilePage.screenshot({
    path: path.join(artifactDir, '140_mobile_clean_navbar_and_banner.png'),
  });
  console.log('✓ Captured 140_mobile_clean_navbar_and_banner.png');

  // Mobile Profile Trigger click
  await mobilePage.click('#kb-navbar-profile-trigger');
  await mobilePage.waitForSelector('#kb-navbar-profile-dropdown', { state: 'visible', timeout: 3000 }).catch(() => {});
  await mobilePage.waitForTimeout(300);
  await mobilePage.screenshot({
    path: path.join(artifactDir, '141_mobile_profile_dropdown_menu.png'),
  });
  console.log('✓ Captured 141_mobile_profile_dropdown_menu.png');
  // Dismiss
  await mobilePage.keyboard.press('Escape');

  // Mobile Scroll down
  await mobilePage.evaluate(() => window.scrollTo(0, 600));
  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({
    path: path.join(artifactDir, '142_mobile_streamlined_cards_and_dock.png'),
  });
  console.log('✓ Captured 142_mobile_streamlined_cards_and_dock.png');

  await mobileContext.close();
  await browser.close();

  console.log('All visual verification tests completed successfully!');
}

testNavbarAndHomepage().catch(err => {
  console.error('Visual test error:', err);
  process.exit(1);
});
