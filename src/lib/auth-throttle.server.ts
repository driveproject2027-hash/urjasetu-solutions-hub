// Advisory throttling for authentication actions. This layers per-IP and
// per-account limits with exponential backoff on top of the auth provider's
// own protections, instead of hard-locking an account.
import {
  backoffSeconds,
  clearFailures,
  clientKey,
  enforce,
  failureCount,
  hashSubject,
  recordHit,
  RateLimitError,
} from './rate-limit.server'
import { authLimits } from './security-config.server'
import { authThrottleSchema } from './validation'

export type AuthThrottleResult = { allowed: boolean; retryAfterSeconds: number }

export async function evaluateAuthThrottle(rawInput: unknown): Promise<AuthThrottleResult> {
  const input = authThrottleSchema.parse(rawInput)
  const limits = authLimits()
  const ip = await clientKey()
  const account = await hashSubject(input.email)
  const accountBucket = `auth:account:${input.action}`

  if (input.outcome === 'success') {
    await clearFailures(accountBucket, account)
    await clearFailures('auth:ip', ip)
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (input.outcome === 'failure') {
    await recordHit(accountBucket, account, 'failure')
    await recordHit('auth:ip', ip, 'failure')
    return { allowed: true, retryAfterSeconds: 0 }
  }

  // outcome === 'attempt' — decide whether this attempt may proceed.
  const failures = Math.max(
    await failureCount(accountBucket, account, limits.backoff.windowSeconds),
    await failureCount('auth:ip', ip, limits.backoff.windowSeconds),
  )
  const wait = backoffSeconds(failures, limits.backoff)
  if (wait > 0) {
    const lastAllowed = await failureCount(accountBucket, account, wait)
    if (lastAllowed > 0) return { allowed: false, retryAfterSeconds: wait }
  }

  try {
    await enforce('auth:ip:window', ip, limits.perIp)
    await enforce(accountBucket, account, limits.perAccount)
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { allowed: false, retryAfterSeconds: error.retryAfterSeconds }
    }
    throw error
  }

  return { allowed: true, retryAfterSeconds: 0 }
}
