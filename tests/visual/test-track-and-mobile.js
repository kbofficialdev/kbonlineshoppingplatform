const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureRemaining() {
  const artifactDir = '/home/user/.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots';

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // Desktop Track Ticket Mode
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/support', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  const trackModeBtn = await page.$('button:has-text("Track Ticket")');
  if (trackModeBtn) {
    await trackModeBtn.click();
    await page.waitForTimeout(300);
    await page.fill('input[placeholder*="TKT-2026"]', 'TKT-2026-60434');
    await page.screenshot({
      path: path.join(artifactDir, '150_guest_track_ticket_mode.png'),
    });
    console.log('✓ Captured 150_guest_track_ticket_mode.png');
  }
  await context.close();

  // Mobile View
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/support', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, '151_mobile_guest_support_desk.png'),
  });
  console.log('✓ Captured 151_mobile_guest_support_desk.png');

  await mobileContext.close();
  await browser.close();
}

captureRemaining().catch(console.error);
