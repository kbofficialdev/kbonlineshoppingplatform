const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres@localhost:5433/kbfashions';
}

const prisma = new PrismaClient();

async function rollback() {
  console.log('================================================================');
  console.log('   KB FASHIONS — POSTGRESQL SAFE BACKUP & RESTORE UTILITY');
  console.log('================================================================');
  
  const backupDir = path.resolve(__dirname, '../data/backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `pg_backup_${timestamp}.json`);

  console.log(`[1/2] Creating full snapshot of PostgreSQL to: ${backupFile}`);
  const [users, products, productImages, orders, orderItems, orderTimeline, tickets, ticketMessages, settings, categories, banners] = await Promise.all([
    prisma.user.findMany(),
    prisma.product.findMany(),
    prisma.productImage.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
    prisma.orderTimelineEvent.findMany(),
    prisma.supportTicket.findMany(),
    prisma.ticketMessage.findMany(),
    prisma.storeSettings.findMany(),
    prisma.category.findMany(),
    prisma.banner.findMany(),
  ]);

  const backupData = {
    timestamp: new Date().toISOString(),
    users,
    products,
    productImages,
    orders,
    orderItems,
    orderTimeline,
    tickets,
    ticketMessages,
    settings,
    categories,
    banners,
  };

  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`✓ Snapshot saved successfully (${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB).`);

  console.log('================================================================');
  console.log('✓ PostgreSQL Rollback & Backup Point Created Successfully!');
  console.log('================================================================');
}

rollback()
  .catch(err => {
    console.error('Rollback script error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

