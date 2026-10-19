const { Client } = require('pg');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-2' });

async function main() {
  console.log('Testing connection with AWS.RDS.Signer getAuthToken({})...');
  let password = '';
  try {
    const signer = new AWS.RDS.Signer({
      region: 'ap-southeast-2',
      hostname: 'kbonlineshoppingplatform-db.cluster-cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com',
      port: 5432,
      username: 'Sudoapt1729'
    });
    password = signer.getAuthToken({});
    console.log('Generated token length:', password ? password.length : 0);
    console.log('Generated token snippet:', password ? password.substring(0, 80) + '...' : 'empty');
  } catch (signerErr) {
    console.error('Error generating token from signer:', signerErr.message);
  }

  const client = new Client({
    host: 'kbonlineshoppingplatform-db.cluster-cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'Sudoapt1729',
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    console.log('Connecting to PostgreSQL client...');
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log('Connected! PostgreSQL version:', res.rows[0].version);
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

main().catch(console.error);

