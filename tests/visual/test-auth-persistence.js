const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kb_fashions_telangana_super_secret_jwt_key_2026_xyz';

async function run() {
  const artifactDir = path.join(process.env.HOME, '.gemini/antigravity/brain/0daf7d07-f592-4d5c-a70a-f399fb11561c/screenshots');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('[STEP 1] Visiting Sign In page...');
  await page.goto('http://localhost:3000/auth/signin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, '131_signin_page_revamp.png'), fullPage: false });
  console.log('Saved 131_signin_page_revamp.png');

  // Authenticate context with persistent customer token
  const dbData = JSON.parse(fs.readFileSync('data/store_db.json', 'utf-8'));
  const user = dbData.users.find(u => u.email === 'bhavith.test.persist@gmail.com') || dbData.users[1];

  const token = jwt.sign({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }, JWT_SECRET, { expiresIn: '7d' });

  await context.addCookies([
    {
      name: 'kb_auth_token',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
    {
      name: 'kb_session_active',
      value: '1',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    }
  ]);

  // Set localStorage token as well
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('kb_auth_token', token);
    localStorage.setItem('kb_user_session', JSON.stringify(user));
  }, { token, user });

  console.log('[STEP 2] Visiting Authenticated Account Overview...');
  await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, '133_authenticated_account_overview.png'), fullPage: false });
  console.log('Saved 133_authenticated_account_overview.png');

  console.log('[STEP 3] Visiting Consignment Tracking as Authenticated Customer...');
  await page.goto('http://localhost:3000/orders/ORD-2026-1001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, '134_consignment_tracking_verified.png'), fullPage: false });
  console.log('Saved 134_consignment_tracking_verified.png');

  console.log('[STEP 4] Visiting Customer Support Ticket System...');
  await page.goto('http://localhost:3000/support', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, '135_customer_support_tickets_verified.png'), fullPage: false });
  console.log('Saved 135_customer_support_tickets_verified.png');

  await browser.close();
  console.log('All verification steps completed and screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});

