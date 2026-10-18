const { Client } = require('pg');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Read .env if exists
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

const region = process.env.RDS_REGION || 'ap-southeast-2';
const hostname = process.env.RDS_HOSTNAME || 'kbonlineshoppingplatform-db-instance-1.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com';
const port = parseInt(process.env.RDS_PORT || '5432', 10);
const database = process.env.RDS_DATABASE || 'postgres';
const username = process.env.RDS_USERNAME || 'Sudoapt1729';

AWS.config.update({ region });

async function main() {
  console.log('================================================================');
  console.log('   KB FASHIONS — AWS RDS POSTGRESQL CONNECTIVITY TEST');
  console.log('================================================================');
  console.log(`Region:   ${region}`);
  console.log(`Host:     ${hostname}`);
  console.log(`Port:     ${port}`);
  console.log(`Database: ${database}`);
  console.log(`User:     ${username}`);

  let password = process.env.RDS_AUTH_TOKEN || '';

  if (!password) {
    console.log('\n[1/3] No RDS_AUTH_TOKEN provided in .env. Attempting dynamic AWS.RDS.Signer...');
    try {
      const signer = new AWS.RDS.Signer({
        region,
        hostname,
        port,
        username,
      });
      password = signer.getAuthToken({});
      console.log('✓ Generated dynamic RDS IAM Auth Token (length:', password.length, 'chars)');
    } catch (e) {
      console.log('Notice: Could not generate dynamic IAM token without local AWS credentials:', e.message);
    }
  } else {
    console.log('\n[1/3] Using configured RDS_AUTH_TOKEN / password from .env (length:', password.length, 'chars)');
  }

  console.log('[2/3] Opening SSL connection to AWS RDS PostgreSQL...');
  const client = new Client({
    host: hostname,
    port,
    database,
    user: username,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });

  try {
    await client.connect();
    console.log('✓ [SUCCESS] Connected to AWS RDS PostgreSQL Instance!');
    console.log('[3/3] Querying database version...');
    const res = await client.query('SELECT version()');
    console.log('✓ PostgreSQL Engine Version:');
    console.log('  ', res.rows[0].version);
    console.log('\nRDS Database verification completed successfully!');
  } catch (error) {
    console.error('\n✗ Database Connection Result:', error.message);
    if (!password) {
      console.log('\n💡 Next Step: Paste your AWS RDS IAM Auth Token or Database Password into `.env` as `RDS_AUTH_TOKEN="..."` and rerun `node scripts/test-rds.js`.');
    }
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

main().catch(console.error);

