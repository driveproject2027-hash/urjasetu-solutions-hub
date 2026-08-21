-- 1. Remove full-row public policies on base tables
DROP POLICY IF EXISTS "published needs public" ON public.open_needs;
DROP POLICY IF EXISTS "approved providers public" ON public.provider_applications;

-- 2. Remove anonymous access to the base tables entirely
REVOKE ALL ON public.open_needs FROM anon;
REVOKE ALL ON public.provider_applications FROM anon;

-- 3. Safe public listings (no contact_email / email / phone / documents)
CREATE OR REPLACE VIEW public.public_open_needs AS
SELECT id, title, business_name, sector, location, description, budget, timeline, status, created_at
FROM public.open_needs
WHERE status IN ('published', 'responses_received', 'matched');

CREATE OR REPLACE VIEW public.public_providers AS
SELECT id, organisation, contact_person, location, provider_type, services, website, description, applied_at
FROM public.provider_applications
WHERE status = 'approved';

ALTER VIEW public.public_open_needs SET (security_invoker = off);
ALTER VIEW public.public_providers SET (security_invoker = off);

GRANT SELECT ON public.public_open_needs TO anon, authenticated;
GRANT SELECT ON public.public_providers TO anon, authenticated;
