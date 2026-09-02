import { readFileSync } from 'node:fs';
import pg from 'pg';

const password = readFileSync('/tmp/dbpw.txt', 'utf8').trim();
const project = 'xqtptsehmfsnjjeoqnwz';
const client = new pg.Client({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  user: `postgres.${project}`,
  database: 'postgres',
  password,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const sql = process.argv[2] ?? readFileSync(process.argv[3] ?? '', 'utf8');
const res = await client.query(sql);
console.log('OK', res.command, res.rowCount ?? '');
await client.end();
