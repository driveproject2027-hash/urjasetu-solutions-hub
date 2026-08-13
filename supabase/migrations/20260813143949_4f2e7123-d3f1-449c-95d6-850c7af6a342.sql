
CREATE TYPE public.app_role AS ENUM ('admin','provider','customer');
CREATE TYPE public.provider_type AS ENUM ('solution','finance','network');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  organisation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile write" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.provider_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  organisation text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  provider_type public.provider_type NOT NULL,
  services text[] NOT NULL DEFAULT '{}',
  website text,
  description text,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','suspended')),
  admin_notes text,
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.provider_applications TO anon;
GRANT SELECT, INSERT, UPDATE ON public.provider_applications TO authenticated;
GRANT ALL ON public.provider_applications TO service_role;
ALTER TABLE public.provider_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can apply" ON public.provider_applications FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "approved providers public" ON public.provider_applications FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "own or admin read" ON public.provider_applications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update applications" ON public.provider_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER provider_applications_updated BEFORE UPDATE ON public.provider_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.customer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  source text NOT NULL CHECK (source IN ('find_my_solution','contact','post_a_need','quote_request','story_submission','finance_helper')),
  name text,
  business_name text,
  email text,
  phone text,
  location text,
  problem text,
  requirement text,
  solution_interest text,
  budget text,
  timeline text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','assigned','in_progress','resolved','closed')),
  assigned_provider_id uuid REFERENCES public.provider_applications(id) ON DELETE SET NULL,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.customer_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.customer_requests TO authenticated;
GRANT ALL ON public.customer_requests TO service_role;
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit request" ON public.customer_requests FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
CREATE POLICY "own admin or assigned read" ON public.customer_requests FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(),'admin')
    OR assigned_provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid())
  );
CREATE POLICY "admin update requests" ON public.customer_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER customer_requests_updated BEFORE UPDATE ON public.customer_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.story_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  slug text UNIQUE,
  title text NOT NULL,
  business_name text,
  sector text,
  location text,
  problem text,
  solution text,
  outcome text,
  contact_email text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.story_submissions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.story_submissions TO authenticated;
GRANT ALL ON public.story_submissions TO service_role;
ALTER TABLE public.story_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit story" ON public.story_submissions FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "approved stories public" ON public.story_submissions FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "own or admin story read" ON public.story_submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update stories" ON public.story_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER story_submissions_updated BEFORE UPDATE ON public.story_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.open_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  business_name text,
  sector text,
  location text,
  description text,
  budget text,
  timeline text,
  contact_email text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','published','responses_received','matched','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.open_needs TO anon;
GRANT SELECT, INSERT, UPDATE ON public.open_needs TO authenticated;
GRANT ALL ON public.open_needs TO service_role;
ALTER TABLE public.open_needs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can post need" ON public.open_needs FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
CREATE POLICY "published needs public" ON public.open_needs FOR SELECT TO anon, authenticated
  USING (status IN ('published','responses_received','matched'));
CREATE POLICY "own or admin need read" ON public.open_needs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update needs" ON public.open_needs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER open_needs_updated BEFORE UPDATE ON public.open_needs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.need_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id uuid NOT NULL REFERENCES public.open_needs(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES public.provider_applications(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  contact_name text,
  contact_email text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.need_responses TO anon;
GRANT SELECT, INSERT ON public.need_responses TO authenticated;
GRANT ALL ON public.need_responses TO service_role;
ALTER TABLE public.need_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can respond" ON public.need_responses FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "own or admin response read" ON public.need_responses FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES public.provider_applications(id) ON DELETE SET NULL,
  provider_ref text,
  name text,
  business_name text,
  email text,
  phone text,
  location text,
  requirement text,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','viewed','responded','accepted','rejected','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request quote" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
CREATE POLICY "own admin or provider read" ON public.quote_requests FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(),'admin')
    OR provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid())
  );
CREATE POLICY "admin or provider update quote" ON public.quote_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid()))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid()));
CREATE TRIGGER quote_requests_updated BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'workshop' CHECK (event_type IN ('workshop','awareness','training','webinar','other')),
  starts_at timestamptz,
  location text,
  registration_url text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published events public" ON public.events FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "admin manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  summary text,
  body text,
  source_name text,
  source_url text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published resources public" ON public.resources FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "admin manage resources" ON public.resources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER resources_updated BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.impact_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  note text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.impact_metrics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_metrics TO authenticated;
GRANT ALL ON public.impact_metrics TO service_role;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published metrics public" ON public.impact_metrics FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "admin manage metrics" ON public.impact_metrics FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER impact_metrics_updated BEFORE UPDATE ON public.impact_metrics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.impact_metrics (label, value, note, sort_order) VALUES
  ('Solutions enabled', 'To be updated', 'Verified figure pending', 1),
  ('Enterprises benefited', 'To be updated', 'Verified figure pending', 2),
  ('Regions covered', 'To be updated', 'Verified figure pending', 3),
  ('Awareness programmes', 'To be updated', 'Verified figure pending', 4);

CREATE POLICY "upload provider docs" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'provider-documents');
CREATE POLICY "admin read provider docs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'provider-documents' AND public.has_role(auth.uid(),'admin'));
