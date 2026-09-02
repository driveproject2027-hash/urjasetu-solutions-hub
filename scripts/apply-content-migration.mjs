// Apply the content-tables migration + seed hardcoded frontend data to Supabase.
// Usage: node scripts/apply-content-migration.mjs
import { readFileSync } from 'node:fs';
import pg from 'pg';
import ts from 'typescript';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')];
    }),
);

const project = env.SUPABASE_PROJECT_ID;
// Direct DB host resolves to the pooler; use session pooler on 5432.
const configs = [
  { host: `aws-0-ap-northeast-1.pooler.supabase.com`, port: 6543, user: `postgres.${project}`, database: 'postgres', ssl: { rejectUnauthorized: false } },
  { host: `aws-0-ap-northeast-1.pooler.supabase.com`, port: 5432, user: `postgres.${project}`, database: 'postgres', ssl: { rejectUnauthorized: false } },
];

const password = process.argv[2] ?? readFileSync('/tmp/dbpw.txt', 'utf8').trim();
if (!password) {
  console.error('Usage: node scripts/apply-content-migration.mjs <db-password>');
  process.exit(1);
}

let client;
for (const cfg of configs) {
  try {
    client = new pg.Client({ ...cfg, password });
    await client.connect();
    console.log('Connected via', cfg.host);
    break;
  } catch (e) {
    console.log(`Failed ${cfg.host}: ${e.message}`);
    client = null;
  }
}
if (!client) {
  console.error('Could not connect with the provided password.');
  process.exit(1);
}

const { rows: [{ contentTablesExist }] } = await client.query(
  "select to_regclass('public.resource_articles') is not null as \"contentTablesExist\"",
);
if (!contentTablesExist) {
  const sql = readFileSync(new URL('../supabase/migrations/20260825070000_content_tables.sql', import.meta.url), 'utf8');
  await client.query(sql);
  console.log('Migration applied.');
} else {
  console.log('Content tables already exist; skipping migration.');
}

const resourceSource = readFileSync(new URL('../src/data/resources.ts', import.meta.url), 'utf8');
const resourceModule = ts.transpileModule(resourceSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const resourceExports = {};
new Function('exports', 'module', resourceModule)(resourceExports, { exports: resourceExports });

let resourcesCreated = 0;
for (const category of resourceExports.resourceCategories) {
  for (const article of category.articles) {
    const body = article.body.map(({ heading, text }) => `${heading}\n${text}`).join('\n\n');
    const sourceName = article.source?.label ?? null;
    const sourceUrl = article.source?.url ?? null;
    const existing = await client.query(
      'select id from public.resources where category = $1 and title = $2 limit 1',
      [category.slug, article.title],
    );
    if (existing.rowCount) continue;

    await client.query(
      `insert into public.resources (category, title, summary, body, source_name, source_url, is_published)
       values ($1, $2, $3, $4, $5, $6, true)`,
      [category.slug, article.title, article.summary, body, sourceName, sourceUrl],
    );
    resourcesCreated += 1;
  }
}
console.log(`Seeded ${resourcesCreated} resources from the frontend catalog.`);
await client.end();
