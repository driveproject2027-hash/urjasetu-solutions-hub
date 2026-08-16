// Server-only implementation for public (unauthenticated) form submissions.
// All writes are validated, rate limited, and performed with the service role
// so that the browser never holds direct insert rights on these tables.
import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { clientKey, enforce, RateLimitError } from './rate-limit.server'
import { publicWriteLimits } from './security-config.server'
import { publicFormSchema, type PublicFormData } from './validation'

const TABLES: Record<PublicFormData['form'], string> = {
  customer_request: 'customer_requests',
  provider_application: 'provider_applications',
  open_need: 'open_needs',
  need_response: 'need_responses',
  quote_request: 'quote_requests',
  story_submission: 'story_submissions',
}

// Server-controlled initial status: never accepted from the client.
const INITIAL_STATUS: Partial<Record<PublicFormData['form'], string>> = {
  customer_request: 'new',
  provider_application: 'pending',
  open_need: 'new',
  quote_request: 'new',
  story_submission: 'pending',
}

export class SubmissionError extends Error {}

export async function handlePublicSubmission(rawInput: unknown, userId: string | null) {
  const parsed = publicFormSchema.parse(rawInput)
  const limits = publicWriteLimits()
  const ip = await clientKey()

  try {
    await enforce('public:ip', ip, limits.perIp)
    await enforce('public:ip:daily', ip, limits.perIpDaily)
    await enforce(`public:form:${parsed.form}`, ip, limits.perForm)
  } catch (error) {
    if (error instanceof RateLimitError) throw error
    throw error
  }

  const table = TABLES[parsed.form]
  const status = INITIAL_STATUS[parsed.form]
  const row: Record<string, unknown> = {
    ...(parsed.payload as Record<string, unknown>),
    user_id: userId,
    ...(status ? { status } : {}),
  }

  const client = supabaseAdmin as unknown as { from: (t: string) => any }
  const { error } = await client.from(table).insert(row)
  if (error) {
    // Log the real database error, return nothing specific to the caller.
    console.error(`[public-forms] insert failed for ${table}`, error)
    throw new SubmissionError('We could not save your submission. Please try again.')
  }
  return { ok: true as const }
}

/**
 * Resolves the caller's user id from the bearer token when present.
 * The client never supplies a user id directly.
 */
export async function resolveOptionalUser(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  if (token.split('.').length !== 3) return null
  try {
    const { data, error } = await supabaseAdmin.auth.getClaims(token)
    if (error || !data?.claims?.sub) return null
    return String(data.claims.sub)
  } catch (error) {
    console.error('[public-forms] token check failed', error)
    return null
  }
}
