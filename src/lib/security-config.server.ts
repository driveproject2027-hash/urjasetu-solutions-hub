// Central, environment-configurable security thresholds.
// Nothing here is hardcoded at module scope: every value is read from the
// environment at call time so limits can be tuned per deployment.

export type RateLimitRule = {
  /** Maximum number of accepted requests inside the window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
};

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  const parsed = raw == null ? Number.NaN : Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function rule(prefix: string, limit: number, windowSeconds: number): RateLimitRule {
  return {
    limit: num(`${prefix}_LIMIT`, limit),
    windowSeconds: num(`${prefix}_WINDOW`, windowSeconds),
  };
}

/** Auth routes: strict, per-IP and per-account, with exponential backoff. */
export function authLimits() {
  return {
    perIp: rule("RL_AUTH_IP", 20, 900),
    perAccount: rule("RL_AUTH_ACCOUNT", 8, 900),
    backoff: {
      /** Failures tolerated before backoff starts. */
      freeAttempts: num("RL_AUTH_FREE_ATTEMPTS", 3),
      baseSeconds: num("RL_AUTH_BACKOFF_BASE", 5),
      maxSeconds: num("RL_AUTH_BACKOFF_MAX", 900),
      /** How far back failures are counted. */
      windowSeconds: num("RL_AUTH_BACKOFF_WINDOW", 3600),
    },
  };
}

/** Public, unauthenticated write endpoints (contact, join us, needs...). */
export function publicWriteLimits() {
  return {
    perIp: rule("RL_PUBLIC_IP", 10, 600),
    perIpDaily: rule("RL_PUBLIC_IP_DAILY", 60, 86_400),
    perForm: rule("RL_PUBLIC_FORM", 5, 600),
  };
}

/** Signed-in user actions: looser, mostly an abuse ceiling. */
export function authenticatedActionLimits() {
  return {
    perUser: rule("RL_USER_ACTION", 120, 600),
  };
}

/** Salt used to hash client IPs before they are stored. */
export function ipHashSalt(): string {
  return process.env['RATE_LIMIT_IP_SALT'] ?? process.env['SUPABASE_PROJECT_ID'] ?? 'urjasethu';
}
