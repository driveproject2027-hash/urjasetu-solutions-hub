CREATE TABLE public.admin_permissions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  post text NOT NULL DEFAULT 'custom',
  sections text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_permissions TO authenticated;
GRANT ALL ON public.admin_permissions TO service_role;

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own admin permissions"
ON public.admin_permissions FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TRIGGER admin_permissions_updated
BEFORE UPDATE ON public.admin_permissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.has_admin_section(_user_id uuid, _section text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'super_admin'::app_role)
      OR (
        public.has_role(_user_id, 'admin'::app_role)
        AND (
          NOT EXISTS (SELECT 1 FROM public.admin_permissions p WHERE p.user_id = _user_id)
          OR EXISTS (
            SELECT 1 FROM public.admin_permissions p
            WHERE p.user_id = _user_id
              AND (p.sections @> ARRAY['all']::text[] OR p.sections @> ARRAY[_section]::text[])
          )
        )
      )
$$;

DROP POLICY IF EXISTS "admin update applications" ON public.provider_applications;
CREATE POLICY "admin update applications"
ON public.provider_applications FOR UPDATE TO authenticated
USING (public.has_admin_section(auth.uid(), 'joinus'))
WITH CHECK (public.has_admin_section(auth.uid(), 'joinus'));

DROP POLICY IF EXISTS "admin update requests" ON public.customer_requests;
CREATE POLICY "admin update requests"
ON public.customer_requests FOR UPDATE TO authenticated
USING (public.has_admin_section(auth.uid(), 'requests'))
WITH CHECK (public.has_admin_section(auth.uid(), 'requests'));

DROP POLICY IF EXISTS "admin update stories" ON public.story_submissions;
CREATE POLICY "admin update stories"
ON public.story_submissions FOR UPDATE TO authenticated
USING (public.has_admin_section(auth.uid(), 'stories'))
WITH CHECK (public.has_admin_section(auth.uid(), 'stories'));

DROP POLICY IF EXISTS "admin update needs" ON public.open_needs;
CREATE POLICY "admin update needs"
ON public.open_needs FOR UPDATE TO authenticated
USING (public.has_admin_section(auth.uid(), 'needs'))
WITH CHECK (public.has_admin_section(auth.uid(), 'needs'));

DROP POLICY IF EXISTS "admin or provider update quote" ON public.quote_requests;
CREATE POLICY "admin or provider update quote"
ON public.quote_requests FOR UPDATE TO authenticated
USING (
  public.has_admin_section(auth.uid(), 'quotes')
  OR provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid())
)
WITH CHECK (
  public.has_admin_section(auth.uid(), 'quotes')
  OR provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "admin manage events" ON public.events;
CREATE POLICY "admin manage events"
ON public.events FOR ALL TO authenticated
USING (public.has_admin_section(auth.uid(), 'events'))
WITH CHECK (public.has_admin_section(auth.uid(), 'events'));

DROP POLICY IF EXISTS "admin manage resources" ON public.resources;
CREATE POLICY "admin manage resources"
ON public.resources FOR ALL TO authenticated
USING (public.has_admin_section(auth.uid(), 'resources'))
WITH CHECK (public.has_admin_section(auth.uid(), 'resources'));

DROP POLICY IF EXISTS "admin manage metrics" ON public.impact_metrics;
CREATE POLICY "admin manage metrics"
ON public.impact_metrics FOR ALL TO authenticated
USING (public.has_admin_section(auth.uid(), 'impact'))
WITH CHECK (public.has_admin_section(auth.uid(), 'impact'));

DROP POLICY IF EXISTS "admins read workspace links" ON public.workspace_links;
CREATE POLICY "admins read workspace links"
ON public.workspace_links FOR SELECT TO authenticated
USING (
  public.has_admin_section(auth.uid(), 'workspace')
  AND ((NOT super_admin_only) OR public.has_role(auth.uid(), 'super_admin'::app_role))
);