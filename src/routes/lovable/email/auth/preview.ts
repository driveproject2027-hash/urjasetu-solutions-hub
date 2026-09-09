import * as React from "react";
import { render } from "@react-email/render";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { SignupEmail } from "@/lib/email-templates/signup";
import { InviteEmail } from "@/lib/email-templates/invite";
import { MagicLinkEmail } from "@/lib/email-templates/magic-link";
import { RecoveryEmail } from "@/lib/email-templates/recovery";
import { EmailChangeEmail } from "@/lib/email-templates/email-change";
import { ReauthenticationEmail } from "@/lib/email-templates/reauthentication";

const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
};

const SITE_NAME = "LayaGreenEnergy";
const ROOT_DOMAIN = "urjasetu.dev";
const SAMPLE_PROJECT_URL = `https://${ROOT_DOMAIN}`;
const SAMPLE_EMAIL = "user@example.test";

const SAMPLE_DATA: Record<string, object> = {
  signup: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth-callback?token=example-token`,
  },
  magiclink: {
    siteName: SITE_NAME,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth-callback?token=example-token`,
  },
  recovery: {
    siteName: SITE_NAME,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth-callback?token=example-token`,
  },
  invite: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth-callback?token=example-token`,
  },
  email_change: {
    siteName: SITE_NAME,
    oldEmail: "old@example.test",
    email: SAMPLE_EMAIL,
    newEmail: "new@example.test",
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth-callback?token=example-token`,
  },
  reauthentication: {
    token: "123456",
  },
};

export const Route = createFileRoute("/lovable/email/auth/preview")({
  loader: () => {
    if (import.meta.env.PROD) throw notFound();
  },
  component: AuthEmailPreviewPage,
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (import.meta.env.PROD) return new Response(null, { status: 404 });
        const body = (await request.json().catch(() => ({}))) as { type?: string };
        const type = body.type ?? "";
        const Template = EMAIL_TEMPLATES[type];

        if (!Template) {
          return Response.json({ error: `Unknown email type: ${type}` }, { status: 400 });
        }

        const sampleData = SAMPLE_DATA[type] ?? {};
        const html = await render(React.createElement(Template, sampleData));

        return new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});

function AuthEmailPreviewPage() {
  return React.createElement(
    "main",
    { className: "container-page py-16" },
    React.createElement(
      "h1",
      { className: "font-display text-2xl font-semibold" },
      "Authentication email previews",
    ),
    React.createElement(
      "p",
      { className: "mt-3 text-sm text-muted-foreground" },
      "This endpoint accepts POST requests for rendering authentication email templates.",
    ),
  );
}
