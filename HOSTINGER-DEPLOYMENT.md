# Hostinger Deployment Guide for Supabase + TanStack Start

This project is intentionally kept on Supabase for the database and authentication layer. The app is a TanStack Start frontend with server-side functions, and it should continue to use Supabase Postgres + Supabase Auth rather than a MySQL migration.

## What this repo is using

From the current project setup:

- [package.json](package.json) uses Vite + TanStack Start build scripts
- [src/start.ts](src/start.ts) configures the app-level middleware
- [src/server.ts](src/server.ts) handles the server entry for the app runtime
- [src/lib/public-forms.server.ts](src/lib/public-forms.server.ts) already keeps writes in a server-controlled pattern

The repository includes `build`, `preview` and `start` scripts. The `start` script runs
`scripts/start.mjs`, which adapts the generated TanStack Fetch handler to Hostinger's HTTP server.

## Architecture to keep in production

- Frontend app: React + TanStack Start
- Database: Supabase Postgres
- Auth: Supabase Auth
- Email: Resend
- Secrets: Hostinger environment variables only
- Browser: no direct DB credentials exposed to the client

## Prerequisites

- Hostinger Node.js hosting plan
- GitHub repository connected to Hostinger
- Supabase project already created
- Resend API key for transactional email
- Custom domain configured if needed

## Recommended deployment method

Use GitHub deployment from Hostinger with a Node.js environment.

### 1. Prepare the GitHub repository

Ensure the repository is pushed to GitHub and the deployment branch is selected.

Add or confirm `.gitignore` includes:

```gitignore
node_modules/
dist/
.env
.env.local
.env.*.local
.vscode/
```

### 2. Create the Hostinger web app

1. Log in to the Hostinger panel
2. Open Web Apps or Node.js Applications
3. Create a new app
4. Select the Node.js runtime
5. Use Node.js 18+ or newer
6. Connect the GitHub repository

### 3. Configure the build command

Use:

```bash
npm run build
```

The repository defines a production `start` script in [package.json](package.json).

### 4. Configure the start command

Use the production start command:

```bash
npm start
```

The server reads Hostinger's `PORT` environment variable and binds to `0.0.0.0`. Do not use `vite preview` as the production process.

## Required environment variables

Set these in the Hostinger Environment Variables section:

```env
# Supabase app config
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional compatibility variables used by some server code paths
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_SERVICE_KEY=your_service_role_key

# Browser-exposed Supabase variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# Email
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@your_verified_domain.com

# Optional app config
APP_URL=https://your-domain.com
NODE_ENV=production
```

### Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` strictly server-side only
- Do not expose service-role credentials in the browser
- `VITE_*` variables are for client-safe public access only

## Hostinger deployment checklist

After adding the environment variables:

1. Set build command to `npm run build`
2. Set start command to `npm start`
3. Deploy from the main branch
4. Wait for build logs to finish
5. Check homepage load
6. Check sign-in page and protected routes
7. Confirm database-backed forms still work

## Local validation before deployment

Run these locally first:

```bash
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 3000
```

This repo has already been validated locally with a successful build run in the current environment, which is the correct baseline before deployment.

## Common runtime issues after deployment

### 1. Missing Supabase env vars

Symptoms:

- app loads but auth or form submissions fail
- console logs show missing variable errors

Fix:

- Add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Hostinger
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are also present

### 2. `npm start` fails

Symptoms:

- deployment command fails immediately
- Hostinger shows a missing script error

Fix:

- Confirm the build step completed successfully before starting the app
- Confirm Hostinger is using the repository root as the application directory
- Check the Node.js version and Hostinger application logs

### 3. Auth redirects break on production domains

Symptoms:

- sign-in page loops
- redirect goes to localhost or wrong domain

Fix:

- set `APP_URL` to the production domain
- ensure redirect URLs in Supabase match the deployed domain
- update Google OAuth redirect URLs if used

### 4. Resend mail fails

Symptoms:

- form submissions succeed but email notifications do not send

Fix:

- verify the sending domain in Resend
- ensure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are correct

### 5. Database writes fail in server functions

This app intentionally uses server-side writes, so the fix is not to expose DB credentials to the browser.

Keep the pattern used in:

- [src/lib/public-forms.server.ts](src/lib/public-forms.server.ts)
- [src/lib/db.ts](src/lib/db.ts)

and continue to keep all data access server-side.

## Support and next steps

Next recommended steps:

1. Add the real environment variables in Hostinger
2. Deploy the repo with the build/start commands above
3. Test the auth page and one public form submission
4. Confirm the deployed domain matches the Supabase redirect config
5. Check logs for any missing env or SSR issues after launch

## Final note

This app should remain on Supabase. The work needed is deployment hardening and Hostinger runtime configuration, not a database migration away from Supabase.
