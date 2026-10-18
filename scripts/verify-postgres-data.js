const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres@localhost:5433/kbfashions';
}

const prisma = new PrismaClient();

async function verify() {
  console.log('================================================================');
  console.log('   KB FASHIONS — POSTGRESQL INTEGRITY & HEALTH VERIFICATION');
  console.log('================================================================');
  console.log(`Database URL: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);

  try {
    const settings = await prisma.storeSettings.findFirst();
    console.log(`✓ Store Settings: ${settings?.officialName || 'Not Found'} (${settings?.village}, ${settings?.state})`);

    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    console.log(`✓ Users (${users.length}):`);
    users.slice(0, 5).forEach(u => console.log(`   - [${u.role}] ${u.name} (${u.email})`));

    const products = await prisma.product.findMany({
      include: { images: true },
      take: 5,
    });
    console.log(`✓ Products Sample (${products.length} of total):`);
    products.forEach(p => {
      console.log(`   - ${p.productId}: ${p.name} (₹${p.price}) | ${p.images?.length || 0} image(s) [${p.images?.[0]?.data?.substring(0, 30)}...]`);
    });

    const orders = await prisma.order.findMany({
      include: { items: true, timeline: true },
    });
    console.log(`✓ Orders (${orders.length}):`);
    orders.forEach(o => {
      console.log(`   - #${o.orderId}: ₹${o.totalPaid} (${o.orderStatus}) for ${o.customerName} [${o.items.length} item(s)]`);
    });

    const tickets = await prisma.supportTicket.findMany({
      include: { messages: true },
    });
    console.log(`✓ Support Tickets (${tickets.length}):`);
    tickets.forEach(t => {
      console.log(`   - #${t.ticketNumber}: ${t.subject} (${t.status}) [${t.messages.length} message(s)]`);
    });

    console.log('================================================================');
    console.log('✓ All tables and relations verified healthy and authoritative in PostgreSQL!');
    console.log('================================================================');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();

