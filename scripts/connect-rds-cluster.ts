import { Client } from 'pg';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'ap-southeast-2' });

async function main(): Promise<void> {
  let password: string = '';
  const signer = new (AWS as any).RDS.Signer({
    region: 'ap-southeast-2',
    hostname: 'kbonlineshoppingplatform-db.cluster-cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com',
    port: 5432,
    username: 'Sudoapt1729',
  });
  password = signer.getAuthToken({});

  console.log('Dynamic AWS RDS Auth Token generated. Valid for 15 minutes.');
  console.log('Token snippet:', password.substring(0, 60) + '...');

  const client = new Client({
    host: 'kbonlineshoppingplatform-db.cluster-cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'Sudoapt1729',
    password,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log('Connected successfully to AWS RDS PostgreSQL Cluster:');
    console.log(res.rows[0].version);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(console.error);

