-- Scoped administrators must not read workflow data outside their assigned section.
DROP POLICY IF EXISTS "own or admin read" ON public.provider_applications;
CREATE POLICY "own or scoped admin read" ON public.provider_applications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_admin_section(auth.uid(), 'joinus'));

DROP POLICY IF EXISTS "own admin or assigned read" ON public.customer_requests;
CREATE POLICY "own scoped admin or assigned read" ON public.customer_requests FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_admin_section(auth.uid(), 'requests')
    OR assigned_provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "own or admin story read" ON public.story_submissions;
CREATE POLICY "own or scoped admin story read" ON public.story_submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_admin_section(auth.uid(), 'stories'));

DROP POLICY IF EXISTS "own or admin need read" ON public.open_needs;
CREATE POLICY "own or scoped admin need read" ON public.open_needs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_admin_section(auth.uid(), 'needs'));

DROP POLICY IF EXISTS "own or admin response read" ON public.need_responses;
CREATE POLICY "own or scoped admin response read" ON public.need_responses FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_admin_section(auth.uid(), 'needs'));

DROP POLICY IF EXISTS "own admin or provider read" ON public.quote_requests;
CREATE POLICY "own scoped admin or provider read" ON public.quote_requests FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_admin_section(auth.uid(), 'quotes')
    OR provider_id IN (SELECT id FROM public.provider_applications WHERE user_id = auth.uid())
  );