DROP VIEW IF EXISTS public.public_providers;
DROP VIEW IF EXISTS public.public_stories;
DROP VIEW IF EXISTS public.public_open_needs;

-- Restore row visibility, but withhold sensitive columns via column-level grants.
CREATE POLICY "published needs public" ON public.open_needs
  FOR SELECT TO anon, authenticated
  USING (status = ANY (ARRAY['published'::text, 'responses_received'::text, 'matched'::text]));

CREATE POLICY "approved providers public" ON public.provider_applications
  FOR SELECT TO anon, authenticated
  USING (status = 'approved'::text);

CREATE POLICY "approved stories public" ON public.story_submissions
  FOR SELECT TO anon, authenticated
  USING (status = 'approved'::text);

REVOKE SELECT ON public.open_needs FROM anon, authenticated;
GRANT SELECT (id, title, business_name, sector, location, description, budget, timeline, status, created_at)
  ON public.open_needs TO anon;
GRANT SELECT (id, user_id, title, business_name, sector, location, description, budget, timeline, status, created_at, updated_at)
  ON public.open_needs TO authenticated;

REVOKE SELECT ON public.story_submissions FROM anon, authenticated;
GRANT SELECT (id, slug, title, business_name, sector, location, problem, solution, outcome, status, created_at)
  ON public.story_submissions TO anon;
GRANT SELECT (id, user_id, slug, title, business_name, sector, location, problem, solution, outcome, status, created_at, updated_at)
  ON public.story_submissions TO authenticated;

REVOKE SELECT ON public.provider_applications FROM anon, authenticated;
GRANT SELECT (id, organisation, contact_person, location, provider_type, services, website, description, status, applied_at)
  ON public.provider_applications TO anon;
GRANT SELECT (id, user_id, organisation, contact_person, location, provider_type, services, website, description, status, admin_notes, applied_at, updated_at)
  ON public.provider_applications TO authenticated;