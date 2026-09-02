// Advisory throttling for authentication actions. This layers per-IP and
// per-account limits with exponential backoff on top of the auth provider's
// own protections, instead of hard-locking an account.
import {
  clientKey,
  enforce,
  hashSubject,
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
