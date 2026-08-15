# Status-change emails for Join Us submissions

## Which address will the mail come from?

Right now: none. No sender domain is set up for this project yet, so app emails cannot be sent at all.

Since you already use **urjasethu.dev**, the natural sender is your own brand, e.g. **UrjaSetu <notify@urjasethu.dev>**. Setting this up is a one-time step: you pick the sending subdomain (typically `notify.urjasethu.dev`) and add the DNS records shown during setup. After that, every review email goes out from your domain — better trust and deliverability than a generic address.

## What gets built after the domain is ready

1. A branded email template matching the site (Manrope/DM Sans, forest green, ivory), containing:
   - Organisation name and which path they applied through (Solution Provider / Finance Provider / Network Partner)
   - The new review status in plain language (Under review, Approved, Rejected, Suspended)
   - The admin note, when one is present
   - A link back to the site / next step
2. Sending is triggered from the server when an admin changes the status of a Join Us submission in `/admin`, using the application's contact email.
   - The current admin note is included with the status change.
   - Only real status changes send mail; saving a note alone does not.
   - Each send is de-duplicated so an accidental double-save does not send twice.
3. Admin UI feedback: a small confirmation that the applicant was notified, or a quiet note if the email could not be delivered (e.g. the address previously bounced).

## Technical notes

- Admin status updates currently run client-side in `src/routes/_authenticated/admin.tsx`. They move to an authenticated server function that verifies the caller is an admin, updates `provider_applications`, then sends the email — so the send cannot be triggered from the browser with an arbitrary recipient.
- Template lives in `src/lib/email-templates/`, sent through the project's server-side send helper. No queue, no email tables, no database migration needed.
- Delivery outcomes (sent, bounced, complaints) are visible in the backend Emails view.

## Your next step

Set up the sender domain; then I will build the template and wire the trigger.
