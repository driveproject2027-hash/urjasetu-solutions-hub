import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { submitCustomerRequest } from "../lib/db";

import { PageHeader } from "../components/site/PageHeader";

// Update these with the official contact details.
const PHONE = "8499883525";
const EMAIL = "hello@urjasethu.dev";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact UrjaSethu — Talk to a DRE expert" },
      {
        name: "description",
        content:
          "Call us or share a few details about your renewable energy requirement and we will connect you with the right domain-specific expert.",
      },
      { property: "og:title", content: "Contact UrjaSethu" },
      {
        property: "og:description",
        content: "Reach the UrjaSethu team by phone, or send a short enquiry about your DRE requirement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us about your energy problem"
        intro="You do not need to fill a form. Call us directly and describe the situation — we will point you to the right person."
      />

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_1.2fr]">
        <aside className="space-y-6">
          <div className="border border-border bg-ivory p-6">
            <p className="eyebrow">Call us</p>
            <a href={`tel:${PHONE}`} className="mt-3 block font-display text-2xl font-semibold text-primary">
              {PHONE}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              Monday to Saturday. If we miss your call, leave a message and we will call back.
            </p>
          </div>
          <div className="border border-border p-6">
            <p className="eyebrow">Email</p>
            <a href={`mailto:${EMAIL}`} className="mt-3 block font-medium text-primary underline">
              {EMAIL}
            </a>
          </div>
        </aside>

        <section>
          <p className="max-w-2xl text-base text-foreground/85">
            Have a specific DRE requirement? Share a few details and we&rsquo;ll connect you with the right
            domain-specific expert.
          </p>

          {sent ? (
            <div className="mt-6 border border-border bg-ivory p-6">
              <h2 className="font-display text-lg font-semibold">Thank you — your enquiry has been noted.</h2>
              <p className="mt-2 text-sm text-foreground/80">
                Someone from the team will get in touch. For anything urgent, call {PHONE}.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-medium text-primary underline"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form
              className="mt-6 grid gap-5 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                setBusy(true);
                submitCustomerRequest({
                  source: "contact",
                  name: String(fd.get("name") ?? ""),
                  business_name: String(fd.get("org") ?? ""),
                  phone: String(fd.get("phone") ?? ""),
                  email: String(fd.get("email") ?? ""),
                  problem: String(fd.get("message") ?? ""),
                })
                  .then(() => setSent(true))
                  .catch((err: Error) =>
                    toast.error("Could not send your enquiry", { description: err.message }),
                  )
                  .finally(() => setBusy(false));
              }}
            >

              <Field label="Name" name="name" />
              <Field label="Business / Organisation" name="org" />
              <Field label="Phone number" name="phone" type="tel" />
              <Field label="Email" name="email" type="email" />
              <div className="md:col-span-2">
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  What can we help you with?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Describe the problem in your own words — high bills, load shedding, spoilage, drying, anything."
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="border border-primary bg-primary px-5 py-3 disabled:opacity-60 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
                >
                  Submit Enquiry
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  All fields are optional. Nothing here is mandatory to reach us.
                </p>
              </div>
            </form>
          )}
        </section>
      </div>
    </>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
