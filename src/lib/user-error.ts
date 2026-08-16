// Converts any thrown value into a message that is safe to show a visitor.
// Anything that looks like internal detail (stack frames, file paths, SQL,
// Postgres codes, HTTP plumbing) is replaced with a generic sentence, while the
// original error is still logged for server-side/browser debugging.
const INTERNAL_PATTERNS = [
  /\bat\s+\S+\s+\(/i, // stack frame
  /\/(src|node_modules|home|var|usr)\//i, // file paths
  /\b(select|insert|update|delete)\b.+\bfrom\b/i, // SQL
  /\b(pgrst|22p02|23\d{3}|42\d{3})\b/i, // postgres / postgrest codes
  /supabase|postgres|jwt|fetch failed|networkerror|<!doctype/i,
  /\[object\s/i,
];

const FALLBACK = "Something went wrong. Please try again in a moment.";

export function userMessage(error: unknown, fallback = FALLBACK): string {
  if (typeof console !== "undefined") console.error(error);
  const message = error instanceof Error ? error.message : "";
  if (!message || message.length > 200) return fallback;
  if (INTERNAL_PATTERNS.some((pattern) => pattern.test(message))) return fallback;
  return message;
}
