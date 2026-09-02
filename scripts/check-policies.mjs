import pg from 'pg';
import fs from 'node:fs';

const c = new pg.Client({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.xqtptsehmfsnjjeoqnwz',
  database: 'postgres',
  password: fs.readFileSync('/tmp/dbpw.txt', 'utf8').trim(),
  ssl: { rejectUnauthorized: false },
});
await c.connect();
const r = await c.query("select policyname, cmd, roles::text from pg_policies where tablename='story_submissions'");
console.log(JSON.stringify(r.rows, null, 1));
const grants = await c.query("select grantee, privilege_type from information_schema.role_table_grants where table_name='story_submissions' and grantee in ('anon','authenticated')");
console.log(grants.rows);
await c.end();
