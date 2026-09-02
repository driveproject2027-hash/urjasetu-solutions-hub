#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import http from 'node:http';

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const text = readFileSync(path, 'utf8');
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i <= 0) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    out[key] = value;
  }
  return out;
}

function mergedEnv() {
  return {
    ...parseEnvFile('.env'),
    ...parseEnvFile('.env.local'),
    ...process.env,
  };
}

function checkRequiredEnv(env) {
  const missing = [];

  const publicUrlPresent = Boolean(env.VITE_SUPABASE_URL || env.SUPABASE_URL);
  const publicKeyPresent = Boolean(env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY);
  const serverUrlPresent = Boolean(env.SUPABASE_URL);
  const serverPublishableKeyPresent = Boolean(env.SUPABASE_PUBLISHABLE_KEY);
  const serviceKeyPresent = Boolean(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY);
  const resendKeyPresent = Boolean(env.RESEND_API_KEY);

  if (!publicUrlPresent) missing.push('VITE_SUPABASE_URL (or SUPABASE_URL)');
  if (!publicKeyPresent) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_PUBLISHABLE_KEY)');
  if (!serverUrlPresent) missing.push('SUPABASE_URL');
  if (!serverPublishableKeyPresent) missing.push('SUPABASE_PUBLISHABLE_KEY');
  if (!resendKeyPresent) missing.push('RESEND_API_KEY');
  if (!serviceKeyPresent) missing.push('SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)');
  return missing;
}

function runBuild() {
  const npmResult = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true });
  if (npmResult.status === 0) return true;

  const bunResult = spawnSync('bun', ['run', 'build'], { stdio: 'inherit', shell: true });
  return bunResult.status === 0;
}

async function checkSupabaseKeys(env) {
  const checks = [];
  if (!env.SUPABASE_URL) return checks;

  for (const [label, key] of [
    ['publishable key', env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY],
    ['service role key', env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY],
  ]) {
    if (!key) continue;
    try {
      const response = await fetch(`${env.SUPABASE_URL}/auth/v1/settings`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (!response.ok) checks.push(`${label} rejected by Supabase (HTTP ${response.status})`);
    } catch (error) {
      checks.push(`${label} could not be verified (${error instanceof Error ? error.message : 'network error'})`);
    }
  }
  return checks;
}

async function checkSupabaseSchema(env) {
  const issues = [];
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
  if (!env.SUPABASE_URL || !key) return issues;

  try {
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rate_limit_hits?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) issues.push(`required table public.rate_limit_hits is unavailable (HTTP ${response.status})`);
  } catch (error) {
    issues.push(`database schema could not be verified (${error instanceof Error ? error.message : 'network error'})`);
  }
  return issues;
}

function fetchStatus(path) {
  return new Promise((resolve) => {
    const req = http.request(
      { host: 'localhost', port: 5173, path, method: 'GET', timeout: 4000 },
      (res) => resolve({ path, status: res.statusCode ?? 0 }),
    );
    req.on('error', (err) => resolve({ path, status: -1, err: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ path, status: -1, err: 'timeout' });
    });
    req.end();
  });
}

async function routeSweep() {
  const routes = [
    '/',
    '/about',
    '/calculator',
    '/contact',
    '/events',
    '/financing',
    '/find-my-solution',
    '/join-us',
    '/needs',
    '/opportunities',
    '/providers',
    '/resources',
    '/solutions',
    '/stories',
    '/auth',
    '/lovable/email/auth/preview',
    '/lovable/email/transactional/preview',
    '/robots.txt',
    '/sitemap.xml',
  ];
  const results = [];
  for (const route of routes) results.push(await fetchStatus(route));
  return results;
}

async function main() {
  console.log('\n== Prepublish Check ==\n');

  const env = mergedEnv();
  const missing = checkRequiredEnv(env);
  if (missing.length) {
    console.log('ENV: FAIL');
    console.log('Missing keys:');
    for (const key of missing) console.log(`- ${key}`);
  } else {
    console.log('ENV: PASS');
  }

  const credentialIssues = await checkSupabaseKeys(env);
  if (credentialIssues.length) {
    console.log('SUPABASE CREDENTIALS: FAIL');
    for (const issue of credentialIssues) console.log(`- ${issue}`);
  } else if (missing.length === 0) {
    console.log('SUPABASE CREDENTIALS: PASS');
  }

  const schemaIssues = await checkSupabaseSchema(env);
  if (schemaIssues.length) {
    console.log('SUPABASE SCHEMA: FAIL');
    for (const issue of schemaIssues) console.log(`- ${issue}`);
  } else if (missing.length === 0) {
    console.log('SUPABASE SCHEMA: PASS');
  }

  console.log('\nBUILD: running npm run build ...\n');
  const buildOk = runBuild();
  console.log(`\nBUILD: ${buildOk ? 'PASS' : 'FAIL'}`);

  console.log('\nROUTES: checking http://localhost:5173 ...\n');
  const routeResults = await routeSweep();
  const bad = routeResults.filter((r) => r.status !== 200);
  for (const r of routeResults) {
    const status = r.status === 200 ? 'PASS' : 'FAIL';
    const extra = r.err ? ` (${r.err})` : '';
    console.log(`${status}\t${r.path}\t${r.status}${extra}`);
  }

  console.log('\nSUMMARY');
  const overallOk = missing.length === 0 && credentialIssues.length === 0 && schemaIssues.length === 0 && buildOk && bad.length === 0;
  console.log(`- Env: ${missing.length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`- Supabase credentials: ${credentialIssues.length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`- Supabase schema: ${schemaIssues.length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`- Build: ${buildOk ? 'PASS' : 'FAIL'}`);
  console.log(`- Routes: ${bad.length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`- Overall: ${overallOk ? 'PASS' : 'FAIL'}`);

  if (!overallOk) process.exit(1);
}

main();
