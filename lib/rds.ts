import { Client, Pool } from 'pg';
import AWS from 'aws-sdk';

const RDS_REGION = process.env.RDS_REGION || process.env.AWS_REGION || 'ap-southeast-2';
const RDS_HOSTNAME = process.env.RDS_HOSTNAME || 'kbonlineshoppingplatform-db-instance-1.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com';
const RDS_PORT = parseInt(process.env.RDS_PORT || '5432', 10);
const RDS_DATABASE = process.env.RDS_DATABASE || 'postgres';
const RDS_USERNAME = process.env.RDS_USERNAME || 'Sudoapt1729';

AWS.config.update({ region: RDS_REGION });

/**
 * Generate an RDS IAM Authentication Token or return configured RDS_AUTH_TOKEN
 */
export function getRDSAuthToken(): string {
  // If user provided token or password in environment variable
  if (process.env.RDS_AUTH_TOKEN && process.env.RDS_AUTH_TOKEN.trim().length > 0) {
    return process.env.RDS_AUTH_TOKEN.trim();
  }

  // Otherwise generate dynamic auth token using AWS RDS Signer
  try {
    const signer = new (AWS as any).RDS.Signer({
      region: RDS_REGION,
      hostname: RDS_HOSTNAME,
      port: RDS_PORT,
      username: RDS_USERNAME,
    });
    return signer.getAuthToken({});
  } catch (err) {
    console.warn('Could not generate dynamic AWS RDS IAM Auth token:', err);
    return process.env.RDS_AUTH_TOKEN || '';
  }
}

/**
 * Create a new connected pg Client instance
 */
export function createRDSClient(): Client {
  const password = getRDSAuthToken();

  return new Client({
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    database: RDS_DATABASE,
    user: RDS_USERNAME,
    password,
    ssl: { rejectUnauthorized: false },
  });
}

/**
 * Test AWS RDS connection and query DB engine version
 */
export async function testRDSConnection(): Promise<{ success: boolean; version?: string; error?: string }> {
  const client = createRDSClient();
  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    const version = res.rows[0]?.version;
    return { success: true, version };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

