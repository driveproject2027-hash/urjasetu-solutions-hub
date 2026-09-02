# Lovable to Self-Hosted Migration Checklist

This document tracks all changes made to migrate from Lovable to self-hosted on Hostinger.

## ✅ Completed Changes

### Package Dependencies
- [x] Removed `@lovable.dev/cloud-auth-js` from dependencies
- [x] Removed `@lovable.dev/email-js` from dependencies
- [x] Removed `@lovable.dev/webhooks-js` from dependencies
- [x] Removed `@lovable.dev/vite-tanstack-config` from devDependencies
- [x] Added `resend` to dependencies for email service

### Build Configuration
- [x] Replaced `vite.config.ts` to use standard Vite plugins instead of Lovable config
- [x] Now using:
  - `@vitejs/plugin-react`
  - `@tanstack/router-plugin/vite`
  - `@tanstack/react-start/vite`
  - `tailwindcss`
  - `vite-tsconfig-paths`

### Authentication
- [x] Updated `src/integrations/lovable/index.ts` to use Supabase OAuth only
- [x] Removed Lovable auth broker, mapped to Supabase providers
- [x] Updated `src/lib/auth-google.ts` to force Supabase mode
- [x] Removed conditional logic for Lovable vs Supabase auth
- [x] Updated `src/routes/auth.tsx` to remove Lovable import

### Email Service
- [x] Updated `src/lib/email-templates/send-email.ts` to use Resend
- [x] Replaced `sendLovableEmail()` with Resend API
- [x] Updated environment variable from `LOVABLE_API_KEY` to `RESEND_API_KEY`
- [x] Updated sender domain from Lovable nameserver subdomain to Resend format
- [x] Kept email template structure compatible

### Auth Storage
- [x] Updated `src/integrations/supabase/previewAuthStorage.ts`
- [x] Removed Lovable preview zone detection
- [x] Removed postMessage brokering logic
- [x] Simplified to use localStorage only

### Error Handling
- [x] Updated `src/lib/lovable-error-reporting.ts`
- [x] Removed Lovable telemetry globals
- [x] Now logs to console and can be extended for external services
- [x] Maintained function signature for backward compatibility

### Supabase Integration
- [x] Updated error messages in `src/integrations/supabase/auth-middleware.ts`
- [x] Updated error messages in `src/integrations/supabase/client.server.ts`
- [x] Updated error messages in `src/integrations/supabase/client.ts`
- [x] Removed references to "Lovable Cloud" in error messages

### Documentation
- [x] Created `HOSTINGER-DEPLOYMENT.md` with deployment instructions
- [x] Created `.env.example` with required environment variables
- [x] Created this migration checklist

## ⏳ Remaining Tasks

### Before First Deployment
- [ ] Verify Resend API key and domain setup
  - [ ] Add verified sender email in Resend
  - [ ] Set up domain verification (DNS records)
- [ ] Verify Supabase configuration
  - [ ] Confirm all env vars are correct
  - [ ] Test database connection locally
  - [ ] Enable Google OAuth provider (if using)
- [ ] Test locally with production env vars
  ```bash
  npm run build
  npm run preview
  ```
- [ ] Review and update error tracking
  - [ ] Either: Keep console logging only
  - [ ] Or: Connect to Sentry or similar service

### Hostinger Setup
- [ ] Set up Hostinger account and choose hosting plan
- [ ] Configure GitHub integration (if using)
- [ ] Add environment variables to Hostinger panel
- [ ] Set up custom domain
- [ ] Configure SSL certificate

### Post-Deployment Testing
- [ ] Test authentication flow (email signup/login)
- [ ] Test Google OAuth login (if enabled)
- [ ] Test email sending (verify Resend integration)
- [ ] Test critical user flows
- [ ] Monitor error logs

### Optional Enhancements
- [ ] Set up external error tracking (e.g., Sentry)
  - [ ] Update `reportLovableError()` function
  - [ ] Add error tracking API key to env
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Configure monitoring and alerts on Hostinger
- [ ] Set up automated backups
- [ ] Document any custom domain setup
- [ ] Remove Lovable reference from `AGENTS.md` (if no longer needed)
- [ ] Update `README.md` to mention self-hosted status

### Code Cleanup (Later)
- [ ] Consider renaming `src/integrations/lovable/` → `src/integrations/auth/`
- [ ] Consider renaming `reportLovableError()` → `reportRuntimeError()`
- [ ] Review and remove any remaining Lovable comments
- [ ] Optimize any Lovable-specific workarounds

## Files Modified

1. `package.json` - Dependencies updated
2. `vite.config.ts` - Build config updated
3. `src/integrations/lovable/index.ts` - Auth logic updated
4. `src/lib/auth-google.ts` - Removed dual auth logic
5. `src/routes/auth.tsx` - Removed Lovable import
6. `src/lib/email-templates/send-email.ts` - Email service replaced
7. `src/integrations/supabase/previewAuthStorage.ts` - Simplified
8. `src/lib/lovable-error-reporting.ts` - Updated for standalone
9. `src/integrations/supabase/auth-middleware.ts` - Error messages updated
10. `src/integrations/supabase/client.server.ts` - Error messages updated
11. `src/integrations/supabase/client.ts` - Error messages updated

## Files Created

1. `HOSTINGER-DEPLOYMENT.md` - Deployment guide
2. `.env.example` - Environment variables template
3. `MIGRATION-CHECKLIST.md` - This file

## Environment Variables Required

### For Supabase
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY` - Supabase publishable key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

### For Resend
- `RESEND_API_KEY` - Your Resend API key

### For Google OAuth (if using)
- Configure in Supabase Console under Authentication → Providers → Google
- No additional env vars needed if using Supabase's OAuth flow

## Testing Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run lint` passes
- [ ] `npm run build` completes successfully
- [ ] Development server starts: `npm run dev`
- [ ] Preview build runs: `npm run preview`
- [ ] Email preview routes still work at `/lovable/email/`
- [ ] Authentication flow works with Supabase
- [ ] Google OAuth login works
- [ ] Email sending works with Resend

## Rollback Plan

If issues arise during deployment:

1. Keep the Lovable project as backup until fully tested
2. If deploying via GitHub, you can quickly revert by:
   - Pushing previous commit to main branch
   - Hostinger will auto-redeploy
3. Keep database backups before major changes

## Support Resources

- **TanStack Start**: https://tanstack.com/start/latest
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs
- **Hostinger Docs**: https://support.hostinger.com
- **Node.js**: https://nodejs.org/en/docs/

---

**Migration Date**: 2026-08-25
**Status**: In Progress
