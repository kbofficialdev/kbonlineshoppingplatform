const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Testing connection to new AWS RDS PostgreSQL database...');
  const password = 'cG3cPHmcTkD5jte';
  const caBundlePath = path.resolve(__dirname, '../global-bundle.pem');
  const ca = fs.existsSync(caBundlePath) ? fs.readFileSync(caBundlePath).toString() : undefined;

  const client = new Client({
    host: 'kbfashions-db.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password,
    ssl: { rejectUnauthorized: false, ca },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('Connected successfully to AWS RDS!');
    const res = await client.query('SELECT version()');
    console.log('PostgreSQL Version:', res.rows[0].version);
  } catch (error) {
    console.error('Database connection error:', error.message);
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

main().catch(console.error);

