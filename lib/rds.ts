import { Client, Pool } from 'pg';
import AWS from 'aws-sdk';

const RDS_REGION = process.env.RDS_REGION || process.env.AWS_REGION || 'ap-southeast-2';
const RDS_HOSTNAME = process.env.RDS_HOSTNAME || 'kbonlineshoppingplatform-db-instance-1.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com';
const RDS_PORT = parseInt(process.env.RDS_PORT || '5432', 10);
const RDS_DATABASE = process.env.RDS_DATABASE || 'postgres';
const RDS_USERNAME = process.env.RDS_USERNAME || 'Sudoapt1729';

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  AWS.config.update({
    region: RDS_REGION,
    credentials: new AWS.Credentials({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
      sessionToken: process.env.AWS_SESSION_TOKEN ? process.env.AWS_SESSION_TOKEN.trim() : undefined,
    }),
  });
} else {
  AWS.config.update({ region: RDS_REGION });
}

interface CachedToken {
  token: string;
  generatedAt: number;
  expiresInMs: number;
}

// Auto-regenerate cache: RDS IAM tokens expire strictly every 15 minutes (900s).
// We refresh automatically at 12 minutes (720s) to guarantee zero PAM auth failures.
let tokenCache: CachedToken | null = null;

/**
 * Generate or retrieve a valid, fresh AWS RDS IAM Authentication Token
 * Automatically regenerates before the 15-minute expiration deadline.
 */
export function getRDSAuthToken(forceRefresh = false): string {
  const configuredPassword = process.env.RDS_AUTH_TOKEN?.trim() || '';

  // If a standard database password (non-IAM URL token) is set, return it directly
  if (configuredPassword && !configuredPassword.includes('X-Amz-Signature') && !configuredPassword.includes('X-Amz-Date')) {
    return configuredPassword;
  }

  const now = Date.now();
  const maxTokenAgeMs = 12 * 60 * 1000; // 12 minutes (safe margin under 15 min expiry)

  if (!forceRefresh && tokenCache && (now - tokenCache.generatedAt) < maxTokenAgeMs) {
    return tokenCache.token;
  }

  try {
    const signer = new (AWS as any).RDS.Signer({
      region: RDS_REGION,
      hostname: RDS_HOSTNAME,
      port: RDS_PORT,
      username: RDS_USERNAME,
    });
    const freshToken = signer.getAuthToken({});
    tokenCache = {
      token: freshToken,
      generatedAt: now,
      expiresInMs: maxTokenAgeMs,
    };
    return freshToken;
  } catch (err: any) {
    console.warn('Notice: AWS RDS dynamic IAM token generation error:', err?.message || err);
    return configuredPassword;
  }
}

/**
 * Create a new connected pg Client instance with fresh auto-renewed authentication
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
    connectionTimeoutMillis: 20000,
  });
}

/**
 * Shared connection pool for Next.js API routes with auto-renewing credentials
 */
let sharedPool: Pool | null = null;

export function getRDSPool(): Pool {
  if (!sharedPool) {
    sharedPool = new Pool({
      host: RDS_HOSTNAME,
      port: RDS_PORT,
      database: RDS_DATABASE,
      user: RDS_USERNAME,
      password: () => getRDSAuthToken(), // Dynamic password evaluation on checkout
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000,
    });
  }
  return sharedPool;
}

/**
 * Test AWS RDS connection and query DB engine version
 */
export async function testRDSConnection(): Promise<{ success: boolean; version?: string; error?: string }> {
  // Always force a freshly minted token for testing
  const token = getRDSAuthToken(true);
  const client = new Client({
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    database: RDS_DATABASE,
    user: RDS_USERNAME,
    password: token,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });

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
