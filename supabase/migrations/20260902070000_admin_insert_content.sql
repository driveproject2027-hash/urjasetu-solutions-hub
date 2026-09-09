-- Admin story creation: super_admins/admins can insert stories from the admin
-- dashboard (previously only anon/authenticated public submissions existed).

do $$
begin
	if not exists (
		select 1 from pg_policies
		where schemaname = 'public' and tablename = 'story_submissions' and policyname = 'admin insert stories'
	) then
		create policy "admin insert stories"
		on public.story_submissions for insert to authenticated
		with check (public.has_admin_section(auth.uid(), 'stories'));
	end if;
	if not exists (
		select 1 from pg_policies
		where schemaname = 'public' and tablename = 'open_needs' and policyname = 'admin insert needs'
	) then
		create policy "admin insert needs"
		on public.open_needs for insert to authenticated
		with check (public.has_admin_section(auth.uid(), 'needs'));
	end if;
	if not exists (
		select 1 from pg_policies
		where schemaname = 'public' and tablename = 'customer_requests' and policyname = 'admin insert requests'
	) then
		create policy "admin insert requests"
		on public.customer_requests for insert to authenticated
		with check (public.has_admin_section(auth.uid(), 'requests'));
	end if;
end
$$;
