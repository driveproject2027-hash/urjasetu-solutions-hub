// Database-backed rate limiting. Counts are stored in public.rate_limit_hits,
// which is reachable only by the service role.
import { getRequestHeader } from '@tanstack/react-start/server'

import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { ipHashSalt, type RateLimitRule } from './security-config.server'

// rate_limit_hits is server-only and intentionally absent from the generated
// Data API types, so reach it through an untyped view of the admin client.
const admin = () => supabaseAdmin as unknown as {
  from: (table: string) => any
}

export class RateLimitError extends Error {
  retryAfterSeconds: number
  constructor(retryAfterSeconds: number) {
    super('Too many requests')
    this.name = 'RateLimitError'
    this.retryAfterSeconds = retryAfterSeconds
  }
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Hashed client IP — we never store raw addresses. */
export async function clientKey(): Promise<string> {
  const forwarded = getRequestHeader('cf-connecting-ip')
    ?? getRequestHeader('x-real-ip')
    ?? getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown'
  return (await sha256(`${ipHashSalt()}:${forwarded}`)).slice(0, 40)
}

export async function hashSubject(value: string): Promise<string> {
  return (await sha256(`${ipHashSalt()}:${value.toLowerCase()}`)).slice(0, 40)
}

async function countHits(bucket: string, subject: string, windowSeconds: number, outcome?: string) {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString()
  let query = admin()
    .from('rate_limit_hits')
    .select('id', { count: 'exact', head: true })
    .eq('bucket', bucket)
    .eq('subject', subject)
    .gte('created_at', since)
  if (outcome) query = query.eq('outcome', outcome)
  const { count, error } = await query
  if (error) {
    // Fail open on infrastructure errors, but make it visible server-side.
    console.error('[rate-limit] count failed', error)
    return 0
  }
  return count ?? 0
}

export async function recordHit(bucket: string, subject: string, outcome = 'hit') {
  const { error } = await admin()
    .from('rate_limit_hits')
    .insert({ bucket, subject, outcome })
  if (error) console.error('[rate-limit] insert failed', error)
}

/** Throws RateLimitError when the rule is exceeded. Records the hit otherwise. */
export async function enforce(bucket: string, subject: string, rule: RateLimitRule) {
  const used = await countHits(bucket, subject, rule.windowSeconds)
  if (used >= rule.limit) {
    throw new RateLimitError(rule.windowSeconds)
  }
  await recordHit(bucket, subject)
}

/** Consecutive-failure count used for exponential backoff on auth routes. */
export async function failureCount(bucket: string, subject: string, windowSeconds: number) {
  return countHits(bucket, subject, windowSeconds, 'failure')
}

export async function clearFailures(bucket: string, subject: string) {
  const { error } = await admin()
    .from('rate_limit_hits')
    .delete()
    .eq('bucket', bucket)
    .eq('subject', subject)
    .eq('outcome', 'failure')
  if (error) console.error('[rate-limit] clear failed', error)
}

export function backoffSeconds(
  failures: number,
  opts: { freeAttempts: number; baseSeconds: number; maxSeconds: number },
) {
  const over = failures - opts.freeAttempts
  if (over <= 0) return 0
  return Math.min(opts.maxSeconds, opts.baseSeconds * 2 ** (over - 1))
}
