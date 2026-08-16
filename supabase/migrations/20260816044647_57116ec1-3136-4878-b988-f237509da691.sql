-- Rate limiting store (server-only; no anon/authenticated access)
CREATE TABLE IF NOT EXISTS public.rate_limit_hits (
  id BIGSERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,
  subject TEXT NOT NULL,
  outcome TEXT NOT NULL DEFAULT 'hit',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rate_limit_hits_lookup ON public.rate_limit_hits (bucket, subject, created_at DESC);
GRANT ALL ON public.rate_limit_hits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limit_hits_id_seq TO service_role;
ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- no policies: only service_role (which bypasses RLS) may touch this table

-- Public form submissions must go through the validated server endpoint,
-- so remove direct client insert paths.
DROP POLICY IF EXISTS "anyone can submit request" ON public.customer_requests;
DROP POLICY IF EXISTS "anyone can apply" ON public.provider_applications;
DROP POLICY IF EXISTS "anyone can post need" ON public.open_needs;
DROP POLICY IF EXISTS "anyone can respond" ON public.need_responses;
DROP POLICY IF EXISTS "anyone can request quote" ON public.quote_requests;
DROP POLICY IF EXISTS "anyone can submit story" ON public.story_submissions;

REVOKE INSERT ON public.customer_requests FROM anon, authenticated;
REVOKE INSERT ON public.provider_applications FROM anon, authenticated;
REVOKE INSERT ON public.open_needs FROM anon, authenticated;
REVOKE INSERT ON public.need_responses FROM anon, authenticated;
REVOKE INSERT ON public.quote_requests FROM anon, authenticated;
REVOKE INSERT ON public.story_submissions FROM anon, authenticated;