-- 1. Role check helper: no longer SECURITY DEFINER.
DROP POLICY IF EXISTS "read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "super admin manage roles" ON public.user_roles;

CREATE POLICY "read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (role = _role OR (_role = 'admin'::app_role AND role = 'super_admin'::app_role))
  )
$$;

-- 2. Remove full-row public read access to tables holding contact details.
DROP POLICY IF EXISTS "published needs public" ON public.open_needs;
DROP POLICY IF EXISTS "approved providers public" ON public.provider_applications;
DROP POLICY IF EXISTS "approved stories public" ON public.story_submissions;

REVOKE SELECT ON public.open_needs FROM anon;
REVOKE SELECT ON public.provider_applications FROM anon;
REVOKE SELECT ON public.story_submissions FROM anon;

-- 3. Public projections that expose only non-sensitive columns.
CREATE OR REPLACE VIEW public.public_providers WITH (security_barrier = true) AS
  SELECT id, organisation, contact_person, location, provider_type, services, website, description, applied_at
  FROM public.provider_applications
  WHERE status = 'approved';

CREATE OR REPLACE VIEW public.public_stories WITH (security_barrier = true) AS
  SELECT id, slug, title, business_name, sector, location, problem, solution, outcome, created_at
  FROM public.story_submissions
  WHERE status = 'approved';

CREATE OR REPLACE VIEW public.public_open_needs WITH (security_barrier = true) AS
  SELECT id, title, business_name, sector, location, description, budget, timeline, status, created_at
  FROM public.open_needs
  WHERE status = ANY (ARRAY['published'::text, 'responses_received'::text, 'matched'::text]);

GRANT SELECT ON public.public_providers TO anon, authenticated;
GRANT SELECT ON public.public_stories TO anon, authenticated;
GRANT SELECT ON public.public_open_needs TO anon, authenticated;