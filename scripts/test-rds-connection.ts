import { Client } from 'pg';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

// Native env loader
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    }
  }
} catch (_) {}

const region = process.env.RDS_REGION || 'ap-southeast-2';
const hostname = process.env.RDS_HOSTNAME || 'kbonlineshoppingplatform-db-instance-1.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com';
const port = parseInt(process.env.RDS_PORT || '5432', 10);
const database = process.env.RDS_DATABASE || 'postgres';
const username = process.env.RDS_USERNAME || 'Sudoapt1729';

AWS.config.update({ region });

async function main(): Promise<void> {
  console.log('--- KB Fashions: AWS RDS PostgreSQL Verification ---');
  console.log(`Region:   ${region}`);
  console.log(`Host:     ${hostname}`);
  console.log(`Port:     ${port}`);
  console.log(`Database: ${database}`);
  console.log(`User:     ${username}`);

  let password: string = process.env.RDS_AUTH_TOKEN || '';

  if (!password) {
    console.log('Attempting to generate dynamic IAM auth token via AWS.RDS.Signer...');
    try {
      const signer = new (AWS as any).RDS.Signer({
        region,
        hostname,
        port,
        username,
      });
      password = signer.getAuthToken({});
      console.log('Generated IAM token length:', password.length);
    } catch (e: any) {
      console.warn('Note: AWS IAM credentials not in local environment, checking RDS_AUTH_TOKEN...');
    }
  } else {
    console.log('Using configured RDS_AUTH_TOKEN from environment variables.');
  }

  const client = new Client({
    host: hostname,
    port,
    database,
    user: username,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('Connecting to AWS RDS PostgreSQL instance...');
    await client.connect();
    console.log('✓ Successfully connected to AWS RDS PostgreSQL!');
    const res = await client.query('SELECT version()');
    console.log('PostgreSQL Version:', res.rows[0].version);
  } catch (error: any) {
    console.error('Database connection notice:', error.message || error);
    if (!password) {
      console.log('\n[INFO] Please paste your AWS RDS IAM Auth Token or Database Password in .env as RDS_AUTH_TOKEN');
    }
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

main().catch(console.error);

