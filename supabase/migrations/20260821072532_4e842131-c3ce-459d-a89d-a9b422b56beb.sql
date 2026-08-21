DROP VIEW IF EXISTS public.public_open_needs;
DROP VIEW IF EXISTS public.public_providers;

CREATE OR REPLACE FUNCTION public.list_public_open_needs()
RETURNS TABLE (
  id uuid,
  title text,
  business_name text,
  sector text,
  location text,
  description text,
  budget text,
  timeline text,
  status text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT n.id, n.title, n.business_name, n.sector, n.location, n.description,
         n.budget, n.timeline, n.status, n.created_at
  FROM public.open_needs n
  WHERE n.status IN ('published', 'responses_received', 'matched')
  ORDER BY n.created_at DESC
$$;

CREATE OR REPLACE FUNCTION public.list_public_providers()
RETURNS TABLE (
  id uuid,
  organisation text,
  contact_person text,
  location text,
  provider_type provider_type,
  services text[],
  website text,
  description text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.organisation, p.contact_person, p.location, p.provider_type,
         p.services, p.website, p.description
  FROM public.provider_applications p
  WHERE p.status = 'approved'
  ORDER BY p.organisation
$$;

REVOKE ALL ON FUNCTION public.list_public_open_needs() FROM public;
REVOKE ALL ON FUNCTION public.list_public_providers() FROM public;
GRANT EXECUTE ON FUNCTION public.list_public_open_needs() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_public_providers() TO anon, authenticated;
