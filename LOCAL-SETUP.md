# UrjaSethu — Running locally on your own backend

This guide takes the project from the hosted Lovable Cloud backend to a Supabase
project you own, running on your own machine.

---

## 1. Prerequisites

- **Node 20+** and **bun** (`curl -fsSL https://bun.sh/install | bash`)
- **Supabase CLI** (`brew install supabase/tap/supabase`, or see
  https://supabase.com/docs/guides/cli)
- A free account at https://supabase.com

---

## 2. Get the code

Export the project to GitHub from the Lovable editor (Project Settings → GitHub),
then:

```bash
git clone <your-repo-url> urjasethu
cd urjasethu
bun install
```

---

## 3. Create your own Supabase project

1. https://supabase.com/dashboard → **New project**.
2. Pick a region close to your users (e.g. Mumbai / `ap-south-1`).
3. Save the database password you set — you need it for `db push`.
4. From **Project Settings → API** copy:
   - Project URL (`https://<ref>.supabase.co`)
   - Publishable / anon key
   - Service role key (keep this secret — server only)
   - Project ref (the `<ref>` part)

---

## 4. Replay the schema

All 14 migrations are committed under `supabase/migrations/`. They create every
table, enum, RLS policy, function and trigger the app needs.

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

Verify in the dashboard that these exist:

- Tables: `profiles`, `user_roles`, `admin_permissions`, `provider_applications`,
  `customer_requests`, `open_needs`, `need_responses`, `quote_requests`,
  `story_submissions`, `events`, `resources`, `impact_metrics`,
  `workspace_links`, `rate_limit_hits`
- Enums: `app_role` (admin, provider, customer, super_admin),
  `provider_type` (solution, finance, network)
- Functions: `has_role`, `has_admin_section`, `handle_new_user`,
  `set_updated_at`, `list_public_open_needs`, `list_public_providers`
- Trigger on `auth.users`: `on_auth_user_created`

---

## 5. Create the storage bucket

Migrations contain the storage **policies** but not the bucket itself.
In the dashboard: **Storage → New bucket**

- Name: `provider-documents`
- Public: **off** (private)

The committed policies let a signed-in user read/write only inside a folder
named after their own user id.

---

## 6. Environment variables

Create `.env` in the project root:

```bash
# Client-visible (safe in the browser)
VITE_SUPABASE_URL="https://<ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<your publishable/anon key>"
VITE_SUPABASE_PROJECT_ID="<ref>"

# Server-only — never expose to the client
SUPABASE_URL="https://<ref>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<your publishable/anon key>"
SUPABASE_SERVICE_ROLE_KEY="<your service role key>"
SUPABASE_PROJECT_ID="<ref>"

# Salt used to hash client IPs for rate limiting (any long random string)
RATE_LIMIT_IP_SALT="<openssl rand -hex 32>"
```

Make sure `.env` is in `.gitignore`.

### Optional variables

| Variable | Purpose | If omitted |
| --- | --- | --- |
| `LOVABLE_API_KEY` | Lovable AI Gateway (AI features) | AI calls fail; rest of the app works |
| `LOVABLE_SEND_URL` | Outbound transactional email | Status-change emails are skipped |
| `RL_AUTH_IP_LIMIT`, `RL_PUBLIC_IP_LIMIT`, … | Rate-limit tuning (see `src/lib/security-config.server.ts`) | Sensible defaults apply |

Off Lovable Cloud you'll want to replace the email sender in
`src/lib/email-templates/send-email.ts` with a provider you own (Resend,
Postmark, SES) — it currently posts to the Lovable email service.

---

## 7. Configure authentication

In your Supabase dashboard:

1. **Authentication → URL Configuration**
   - Site URL: `http://localhost:5173`
   - Redirect URLs: add `http://localhost:5173/**` and your production domain.
2. **Authentication → Providers → Email**: enable; leave "Confirm email" on for
   production, turn it off locally if you want faster testing.
3. **Authentication → Providers → Google**: enable and paste a Google OAuth
   client ID + secret from Google Cloud Console. Authorised redirect URI:
   `https://<ref>.supabase.co/auth/v1/callback`.

> Note: `src/integrations/lovable/index.ts` routes Google sign-in through the
> Lovable broker. On your own infrastructure, switch that call to
> `supabase.auth.signInWithOAuth({ provider: 'google' })` — the Supabase-native
> flow — since the broker only serves Lovable-hosted deployments.

---

## 8. Create your admin account

`handle_new_user()` automatically grants `super_admin` to the email
`nischal@lgv.co.in`. So:

1. Run the app, go to `/auth`, and sign up with that address.
2. You now have the `super_admin` role and full `/admin` access.

To use a different address, either edit that email in the function, or grant the
role manually in the SQL editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'super_admin' from auth.users where email = 'you@example.com'
on conflict do nothing;
```

---

## 9. Run it

```bash
bun run dev          # http://localhost:5173
```

Smoke test:

- Home, `/solutions`, `/providers`, `/resources` render
- `/auth` sign-up works and a row appears in `profiles`
- A public form (`/contact`, `/join-us`) submits and the row lands in the DB
- `/admin` loads with your super-admin account and tabs are visible

---

## 10. Moving your existing data (optional)

The hosted Cloud database can't be dumped directly. If you need the current
content (resources, events, impact metrics, approved providers/stories), export
each table to CSV from the backend view in Lovable and import the CSVs into the
matching tables in your own project. Auth users cannot be migrated — people will
sign up again.

---

## 11. Deploying

The app is a TanStack Start app targeting an edge/Worker runtime. Cloudflare
Workers/Pages, Vercel and Netlify all work:

```bash
bun run build
```

Set the same environment variables in your host's dashboard (the `VITE_*` ones
at build time, the server-only ones at runtime), and add the deployed origin to
Supabase → Authentication → URL Configuration.

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `Missing Supabase environment variable(s)` | `.env` not loaded or a name is misspelled |
| Permission denied on a table | Migration didn't run — re-check `supabase db push` output |
| `Unsupported provider` on Google sign-in | Google provider not enabled in your Supabase project |
| Redirect loop after login | Site URL / redirect URLs don't include `http://localhost:5173` |
| File upload fails | `provider-documents` bucket missing (step 5) |
