CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (role = _role OR (_role = 'admin'::app_role AND role = 'super_admin'::app_role))
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT DO NOTHING;
  IF lower(NEW.email) = 'nischal@lgv.co.in' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role FROM auth.users WHERE lower(email) = 'nischal@lgv.co.in'
ON CONFLICT DO NOTHING;

CREATE POLICY "super admin manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

CREATE TABLE public.workspace_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  description text,
  super_admin_only boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_links TO authenticated;
GRANT ALL ON public.workspace_links TO service_role;

ALTER TABLE public.workspace_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read workspace links" ON public.workspace_links
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    AND (NOT super_admin_only OR public.has_role(auth.uid(), 'super_admin'::app_role))
  );

CREATE POLICY "super admins manage workspace links" ON public.workspace_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER workspace_links_updated BEFORE UPDATE ON public.workspace_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.workspace_links (title, url, description, super_admin_only, sort_order)
VALUES (
  'DRIVE x LGV workspace',
  'https://sites.google.com/view/drivexlgv?usp=sharing',
  'Internal DRIVE programme site shared by LGV. Restricted to authorised UrjaSethu administrators.',
  false,
  0
);