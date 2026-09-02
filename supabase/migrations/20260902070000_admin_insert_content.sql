-- Admin story creation: super_admins/admins can insert stories from the admin
-- dashboard (previously only anon/authenticated public submissions existed).

create policy "admin insert stories"
on public.story_submissions for insert to authenticated
with check (public.has_admin_section(auth.uid(), 'stories'));

create policy "admin insert needs"
on public.open_needs for insert to authenticated
with check (public.has_admin_section(auth.uid(), 'needs'));

create policy "admin insert requests"
on public.customer_requests for insert to authenticated
with check (public.has_admin_section(auth.uid(), 'requests'));
