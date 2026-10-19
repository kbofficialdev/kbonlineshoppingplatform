const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read environment
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const AWS = require('aws-sdk');

const hostname = process.env.RDS_HOSTNAME || 'kbonlineshoppingplatform-db-instance-1.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com';
const port = parseInt(process.env.RDS_PORT || '5432', 10);
const database = process.env.RDS_DATABASE || 'postgres';
const username = process.env.RDS_USERNAME || 'Sudoapt1729';

function getPassword() {
  let password = process.env.RDS_AUTH_TOKEN ? process.env.RDS_AUTH_TOKEN.trim() : '';
  try {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      AWS.config.update({
        region: process.env.RDS_REGION || 'ap-southeast-2',
        credentials: new AWS.Credentials({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
          sessionToken: process.env.AWS_SESSION_TOKEN ? process.env.AWS_SESSION_TOKEN.trim() : undefined,
        })
      });
    } else {
      AWS.config.update({ region: process.env.RDS_REGION || 'ap-southeast-2' });
    }
    const signer = new AWS.RDS.Signer({
      region: process.env.RDS_REGION || 'ap-southeast-2',
      hostname,
      port,
      username,
    });
    const freshToken = signer.getAuthToken({});
    if (freshToken && freshToken.length > 100) {
      return freshToken;
    }
  } catch (e) {
    // Fall back to configured token
  }
  return password;
}

async function runMigration() {
  console.log('================================================================');
  console.log('   KB FASHIONS — AWS RDS POSTGRESQL COMPLETE SCHEMA & MIGRATION');
  console.log('================================================================');
  console.log(`Target: ${username}@${hostname}:${port}/${database}`);

  const client = new Client({
    host: hostname,
    port,
    database,
    user: username,
    password: getPassword(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 25000,
  });

  try {
    console.log('[1/4] Connecting to AWS RDS PostgreSQL Instance...');
    await client.connect();
    console.log('✓ Successfully connected to AWS RDS PostgreSQL!');

    console.log('[2/4] Creating all Relational Tables in PostgreSQL...');
    await client.query(`
      -- Store Settings Table
      CREATE TABLE IF NOT EXISTS store_settings (
        id VARCHAR(100) PRIMARY KEY DEFAULT 'kb-fashions-main',
        brand_name VARCHAR(255) NOT NULL,
        official_name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        village VARCHAR(100) NOT NULL,
        mandal VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pin_code VARCHAR(20) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        gst_exempt BOOLEAN DEFAULT TRUE,
        exemption_notice TEXT,
        history_since TEXT,
        story TEXT,
        free_shipping_threshold NUMERIC(10, 2) DEFAULT 999,
        flat_shipping_fee NUMERIC(10, 2) DEFAULT 70,
        grievance_officer_name VARCHAR(255),
        grievance_officer_designation VARCHAR(255),
        grievance_officer_email VARCHAR(255),
        grievance_officer_phone VARCHAR(50),
        grievance_officer_address TEXT,
        delivery_radius_km INT DEFAULT 10,
        delivery_pincode VARCHAR(20) DEFAULT '503145',
        delivery_villages TEXT,
        cashfree_app_id VARCHAR(255),
        cashfree_secret_key VARCHAR(255),
        cashfree_env VARCHAR(50) DEFAULT 'sandbox',
        cashfree_api_version VARCHAR(50) DEFAULT '2023-08-01',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Users Table
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'CUSTOMER',
        avatar TEXT,
        village_or_city VARCHAR(100),
        mandal_or_area VARCHAR(100),
        district VARCHAR(100),
        state VARCHAR(100) DEFAULT 'Telangana',
        pin_code VARCHAR(20),
        preferred_language VARCHAR(10) DEFAULT 'en',
        sms_updates BOOLEAN DEFAULT TRUE,
        whatsapp_updates BOOLEAN DEFAULT TRUE,
        bio TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        otp_code VARCHAR(20),
        otp_expires_at TIMESTAMPTZ,
        email_verification_token VARCHAR(255),
        email_verification_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Addresses Table
      CREATE TABLE IF NOT EXISTS addresses (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        tag VARCHAR(50) DEFAULT 'Home',
        street_address TEXT NOT NULL,
        village_or_city VARCHAR(100) NOT NULL,
        mandal_or_area VARCHAR(100),
        district VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pin_code VARCHAR(20) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Products Table
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        product_id VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        compare_at_price NUMERIC(10, 2),
        category VARCHAR(100) NOT NULL,
        sub_category VARCHAR(100),
        tags TEXT[] DEFAULT '{}',
        colors TEXT[] DEFAULT '{}',
        sizes TEXT[] DEFAULT '{}',
        is_available BOOLEAN DEFAULT TRUE,
        stock_quantity INT DEFAULT 10,
        low_stock_alert INT DEFAULT 3,
        product_type VARCHAR(100) DEFAULT 'GENERAL',
        saree_details JSONB,
        unstitched_details JSONB,
        essential_details JSONB,
        matching_details JSONB,
        village_craft BOOLEAN DEFAULT TRUE,
        artisan_name VARCHAR(255),
        hsn_code VARCHAR(50) DEFAULT '5208',
        rating NUMERIC(3, 2) DEFAULT 4.9,
        reviews_count INT DEFAULT 18,
        featured BOOLEAN DEFAULT FALSE,
        view_count INT DEFAULT 0,
        orders_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Product Images Table
      CREATE TABLE IF NOT EXISTS product_images (
        id VARCHAR(100) PRIMARY KEY,
        product_id VARCHAR(100) REFERENCES products(product_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        data TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Banners Table
      CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(100) PRIMARY KEY,
        banner_id VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        badge VARCHAR(100),
        category VARCHAR(100) DEFAULT 'HERO',
        media_id VARCHAR(100) NOT NULL,
        image_url TEXT NOT NULL,
        link_url TEXT DEFAULT '/search',
        cta_text VARCHAR(100) DEFAULT 'Explore Collection',
        position INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Orders Table
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE NOT NULL,
        user_id VARCHAR(100),
        order_number VARCHAR(100) UNIQUE,
        customer JSONB NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) NOT NULL,
        order_status VARCHAR(50) NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        shipping_fee NUMERIC(10, 2) NOT NULL,
        discount_amount NUMERIC(10, 2) DEFAULT 0,
        total_paid NUMERIC(10, 2) NOT NULL,
        cashfree_order_id VARCHAR(255),
        cashfree_payment_id VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Order Items Table
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES orders(order_id) ON DELETE CASCADE,
        product_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        qty INT NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        size VARCHAR(50) NOT NULL,
        cut_length NUMERIC(6, 2),
        configuration JSONB
      );

      -- Order Timeline Events Table
      CREATE TABLE IF NOT EXISTS order_timeline_events (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES orders(order_id) ON DELETE CASCADE,
        stage VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        courier_partner VARCHAR(255),
        tracking_number VARCHAR(255),
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE order_timeline_events ADD COLUMN IF NOT EXISTS courier_partner VARCHAR(255);
      ALTER TABLE order_timeline_events ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255);

      -- Support Tickets Table
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(100) PRIMARY KEY,
        ticket_number VARCHAR(100) UNIQUE NOT NULL,
        user_id VARCHAR(100),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        category VARCHAR(100) DEFAULT 'ORDER_ISSUE',
        priority VARCHAR(50) DEFAULT 'MEDIUM',
        order_id VARCHAR(100),
        subject VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'OPEN',
        sla_hours INT DEFAULT 24,
        assigned_to VARCHAR(100),
        first_response_at TIMESTAMPTZ,
        resolved_at TIMESTAMPTZ,
        closed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Ticket Messages Table
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id VARCHAR(100) PRIMARY KEY,
        ticket_id VARCHAR(100) REFERENCES support_tickets(id) ON DELETE CASCADE,
        sender_role VARCHAR(50) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        attachments JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Audit Logs Table
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        actor VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        metadata JSONB,
        previous_hash VARCHAR(255),
        current_hash VARCHAR(255),
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ All 11 Core PostgreSQL Tables Created Successfully!');

    console.log('[3/4] Migrating Data from data/store_db.json into AWS RDS PostgreSQL...');
    const jsonPath = path.resolve(__dirname, '../data/store_db.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`store_db.json not found at ${jsonPath}`);
    }
    const storeData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 1. Store Settings
    if (storeData.storeSettings) {
      const s = storeData.storeSettings;
      await client.query(`
        INSERT INTO store_settings (
          id, brand_name, official_name, address, village, mandal, district, state, pin_code,
          contact_email, contact_phone, gst_exempt, exemption_notice, history_since, story,
          free_shipping_threshold, flat_shipping_fee, grievance_officer_name,
          grievance_officer_designation, grievance_officer_email, grievance_officer_phone,
          grievance_officer_address, delivery_radius_km, delivery_pincode, delivery_villages,
          cashfree_app_id, cashfree_secret_key, cashfree_env, cashfree_api_version, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
        )
        ON CONFLICT (id) DO UPDATE SET
          brand_name = EXCLUDED.brand_name,
          official_name = EXCLUDED.official_name,
          address = EXCLUDED.address,
          contact_email = EXCLUDED.contact_email,
          contact_phone = EXCLUDED.contact_phone,
          updated_at = EXCLUDED.updated_at;
      `, [
        s.id || 'kb-fashions-main', s.brandName, s.officialName, s.address, s.village, s.mandal,
        s.district, s.state, s.pinCode, s.contactEmail, s.contactPhone, s.gstExempt, s.exemptionNotice,
        s.historySince, s.story, s.freeShippingThreshold, s.flatShippingFee, s.grievanceOfficerName,
        s.grievanceOfficerDesignation, s.grievanceOfficerEmail, s.grievanceOfficerPhone,
        s.grievanceOfficerAddress, s.deliveryRadiusKm, s.deliveryPincode, s.deliveryVillages,
        s.cashfreeAppId, s.cashfreeSecretKey, s.cashfreeEnv, s.cashfreeApiVersion, s.updatedAt || new Date()
      ]);
      console.log('✓ Store settings migrated.');
    }

    // 2. Users
    if (Array.isArray(storeData.users)) {
      for (const u of storeData.users) {
        await client.query(`
          INSERT INTO users (
            id, name, email, phone, password_hash, role, avatar, village_or_city,
            mandal_or_area, district, state, pin_code, preferred_language, sms_updates,
            whatsapp_updates, bio, is_active, email_verified, otp_code, otp_expires_at,
            email_verification_token, email_verification_expires_at, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20, $21, $22, $23, $24
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role,
            is_active = EXCLUDED.is_active,
            email_verified = EXCLUDED.email_verified,
            updated_at = EXCLUDED.updated_at;
        `, [
          u.id, u.name, u.email.toLowerCase().trim(), u.phone, u.passwordHash, u.role || 'CUSTOMER',
          u.avatar || null, u.villageOrCity || null, u.mandalOrArea || null, u.district || null,
          u.state || 'Telangana', u.pinCode || null, u.preferredLanguage || 'en',
          u.smsUpdates !== false, u.whatsappUpdates !== false, u.bio || null,
          u.isActive !== false, u.emailVerified || false, u.otpCode || null,
          u.otpExpiresAt ? new Date(u.otpExpiresAt) : null, u.emailVerificationToken || null,
          u.emailVerificationExpiresAt ? new Date(u.emailVerificationExpiresAt) : null,
          u.createdAt ? new Date(u.createdAt) : new Date(), u.updatedAt ? new Date(u.updatedAt) : new Date()
        ]);
      }
      console.log(`✓ Migrated ${storeData.users.length} users into AWS RDS PostgreSQL.`);
    }

    // 3. Products
    if (Array.isArray(storeData.products)) {
      for (const p of storeData.products) {
        await client.query(`
          INSERT INTO products (
            id, product_id, name, title, description, price, compare_at_price,
            category, sub_category, tags, colors, sizes, is_available, stock_quantity,
            low_stock_alert, product_type, saree_details, unstitched_details, essential_details,
            matching_details, village_craft, artisan_name, hsn_code, rating, reviews_count,
            featured, view_count, orders_count, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            title = EXCLUDED.title,
            price = EXCLUDED.price,
            compare_at_price = EXCLUDED.compare_at_price,
            category = EXCLUDED.category,
            stock_quantity = EXCLUDED.stock_quantity,
            updated_at = EXCLUDED.updated_at;
        `, [
          p.id, p.productId, p.name, p.title, p.description, p.price, p.compareAtPrice || null,
          p.category, p.subCategory || null, p.tags || [], p.colors || [], p.sizes || [],
          p.isAvailable !== false, p.stockQuantity ?? 10, p.lowStockAlert ?? 3,
          p.productType || 'GENERAL', JSON.stringify(p.sareeDetails || {}),
          JSON.stringify(p.unstitchedDetails || {}), JSON.stringify(p.essentialDetails || {}),
          JSON.stringify(p.matchingDetails || {}), p.villageCraft !== false, p.artisanName || 'Kalwaral Artisan',
          p.hsnCode || '5208', p.rating || 4.9, p.reviewsCount || 18, p.featured || false,
          p.viewCount || 0, p.ordersCount || 0, p.createdAt ? new Date(p.createdAt) : new Date(),
          p.updatedAt ? new Date(p.updatedAt) : new Date()
        ]);
      }
      console.log(`✓ Migrated ${storeData.products.length} products into AWS RDS PostgreSQL.`);
    }

    // 4. Banners
    if (Array.isArray(storeData.banners)) {
      for (const b of storeData.banners) {
        await client.query(`
          INSERT INTO banners (
            id, banner_id, title, subtitle, badge, category, media_id, image_url,
            link_url, cta_text, position, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (banner_id) DO UPDATE SET
            title = EXCLUDED.title,
            image_url = EXCLUDED.image_url,
            link_url = EXCLUDED.link_url,
            updated_at = EXCLUDED.updated_at;
        `, [
          b.id, b.bannerId, b.title, b.subtitle || null, b.badge || null, b.category || 'HERO',
          b.mediaId, b.imageUrl, b.linkUrl || '/search', b.ctaText || 'Explore Collection',
          b.position || 0, b.isActive !== false, b.createdAt ? new Date(b.createdAt) : new Date(),
          b.updatedAt ? new Date(b.updatedAt) : new Date()
        ]);
      }
      console.log(`✓ Migrated ${storeData.banners.length} banners into AWS RDS PostgreSQL.`);
    }

    // 5. Orders
    if (Array.isArray(storeData.orders)) {
      for (const o of storeData.orders) {
        const customerData = o.customer || {
          name: o.customerName || 'Customer',
          phone: o.customerPhone || '',
          email: o.customerEmail || '',
          address: o.streetAddress || '',
          village: o.villageOrCity || '',
          mandal: o.mandalOrArea || '',
          district: o.district || '',
          state: o.state || '',
          pinCode: o.pinCode || '',
        };

        await client.query(`
          INSERT INTO orders (
            id, order_id, user_id, order_number, customer, payment_method,
            payment_status, order_status, subtotal, shipping_fee, discount_amount,
            total_paid, cashfree_order_id, cashfree_payment_id, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (order_id) DO UPDATE SET
            order_status = EXCLUDED.order_status,
            payment_status = EXCLUDED.payment_status,
            updated_at = EXCLUDED.updated_at;
        `, [
          o.id, o.orderId, o.userId || null, o.orderNumber || o.orderId,
          JSON.stringify(customerData), o.paymentMethod, o.paymentStatus, o.orderStatus,
          o.subtotal, o.shippingFee, o.discountAmount || 0, o.totalPaid,
          o.cashfreeOrderId || null, o.cashfreePaymentId || null,
          o.createdAt ? new Date(o.createdAt) : new Date(),
          o.updatedAt ? new Date(o.updatedAt) : new Date()
        ]);

        // Items
        if (Array.isArray(o.items)) {
          for (const it of o.items) {
            await client.query(`
              INSERT INTO order_items (
                id, order_id, product_id, title, qty, unit_price, total_amount, size, cut_length, configuration
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
              ON CONFLICT (id) DO NOTHING;
            `, [
              it.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              o.orderId, it.productId, it.title, it.qty, it.unitPrice, it.totalAmount,
              it.size || 'Standard', it.cutLength || null, JSON.stringify(it.configuration || {})
            ]);
          }
        }

        // Timeline Events
        if (Array.isArray(o.timeline)) {
          for (const tl of o.timeline) {
            await client.query(`
              INSERT INTO order_timeline_events (
                id, order_id, stage, title, description, location, courier_partner, tracking_number, timestamp
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              ON CONFLICT (id) DO NOTHING;
            `, [
              tl.id || `tl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              o.orderId, tl.stage, tl.title, tl.description || '', tl.location || 'Kalwaral Hub',
              tl.courierPartner || null, tl.trackingNumber || null,
              tl.timestamp ? new Date(tl.timestamp) : new Date()
            ]);
          }
        }
      }
      console.log(`✓ Migrated ${storeData.orders.length} orders, items, and timeline events into AWS RDS PostgreSQL.`);
    }

    // 6. Support Tickets & Messages
    if (Array.isArray(storeData.supportTickets)) {
      for (const t of storeData.supportTickets) {
        await client.query(`
          INSERT INTO support_tickets (
            id, ticket_number, user_id, customer_name, customer_email, customer_phone,
            category, priority, order_id, subject, status, sla_hours, assigned_to,
            first_response_at, resolved_at, closed_at, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at;
        `, [
          t.id, t.ticketNumber, t.userId || null, t.customerName, t.customerEmail,
          t.customerPhone || null, t.category, t.priority, t.orderId || null,
          t.subject, t.status, t.slaHours || 24, t.assignedTo || null,
          t.firstResponseAt ? new Date(t.firstResponseAt) : null,
          t.resolvedAt ? new Date(t.resolvedAt) : null,
          t.closedAt ? new Date(t.closedAt) : null,
          t.createdAt ? new Date(t.createdAt) : new Date(),
          t.updatedAt ? new Date(t.updatedAt) : new Date()
        ]);

        if (Array.isArray(t.messages)) {
          for (const m of t.messages) {
            await client.query(`
              INSERT INTO ticket_messages (
                id, ticket_id, sender_role, sender_name, message, attachments, created_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (id) DO NOTHING;
            `, [
              m.id, t.id, m.senderRole, m.senderName, m.message,
              JSON.stringify(m.attachments || []), m.createdAt ? new Date(m.createdAt) : new Date()
            ]);
          }
        }
      }
      console.log(`✓ Migrated ${storeData.supportTickets.length} support tickets & message threads into AWS RDS.`);
    }

    console.log('[4/4] Verifying Table Row Counts in AWS RDS PostgreSQL...');
    const tableCounts = await Promise.all([
      client.query('SELECT COUNT(*) FROM store_settings').then(r => ({ table: 'store_settings', count: r.rows[0].count })),
      client.query('SELECT COUNT(*) FROM users').then(r => ({ table: 'users', count: r.rows[0].count })),
      client.query('SELECT COUNT(*) FROM products').then(r => ({ table: 'products', count: r.rows[0].count })),
      client.query('SELECT COUNT(*) FROM banners').then(r => ({ table: 'banners', count: r.rows[0].count })),
      client.query('SELECT COUNT(*) FROM orders').then(r => ({ table: 'orders', count: r.rows[0].count })),
      client.query('SELECT COUNT(*) FROM support_tickets').then(r => ({ table: 'support_tickets', count: r.rows[0].count })),
    ]);

    console.log('\n================================================================');
    console.log('   AWS RDS POSTGRESQL LIVE VERIFICATION SUMMARY:');
    console.log('================================================================');
    tableCounts.forEach(t => {
      console.log(`✓ ${t.table.padEnd(20)}: ${t.count} rows`);
    });
    console.log('================================================================\n');

  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  } finally {
    await client.end();
  }
}

runMigration().catch(err => {
  console.error(err);
  process.exit(1);
});
