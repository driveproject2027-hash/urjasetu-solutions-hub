import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { CheckboxGroup, Field, JoinSteps, SubmitRow, TextArea } from "../components/site/FormField";
import { submitProviderApplication } from "../lib/db";
import { userMessage } from "../lib/user-error";

export const Route = createFileRoute("/join-us/network-partner")({
  head: () => ({
    meta: [
      { title: "Register as a Network Partner — UrjaSethu" },
      {
        name: "description",
        content:
          "NGOs, FPOs, clusters, incubators and local facilitators can register as UrjaSethu network partners and connect enterprises to decentralised renewable energy.",
      },
      { property: "og:title", content: "Register as a Network Partner — UrjaSethu" },
      { property: "og:description", content: "Help local enterprises find the right DRE solution and support." },
      { property: "og:url", content: "https://urjasethu.dev/join-us/network-partner" },
      { property: "og:image", content: "https://urjasethu.dev/og-image.jpg" },
      { name: "twitter:image", content: "https://urjasethu.dev/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://urjasethu.dev/join-us/network-partner" }],
  }),
  component: NetworkPartnerForm,
});

const support = [
  "Awareness and outreach",
  "Enterprise handholding",
  "Training and skilling",
  "Scheme and subsidy support",
  "Loan application support",
  "Aggregating demand",
  "Monitoring and reporting",
  "Hosting demonstrations",
];

const communities = [
  "Women entrepreneurs",
  "Farmers and FPOs",
  "Artisans and weavers",
  "Micro food processors",
  "Self-help groups",
  "Youth entrepreneurs",
];

function NetworkPartnerForm() {
  const [busy, setBusy] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Join us · Network partner"
        title="Register as a network partner"
        intro="Network partners work with enterprises on the ground — NGOs, FPOs, cluster associations, incubators, consultants and local facilitators."
      />

      <div className="container-page py-12">
        <JoinSteps steps={["Submitted", "Under review", "Verified", "Onboarded"]} />

        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            setBusy(true);
            submitProviderApplication({
              organisation: String(fd.get("organisation") ?? ""),
              contact_person: String(fd.get("contact_person") ?? ""),
              email: String(fd.get("email") ?? ""),
              phone: String(fd.get("phone") ?? ""),
              location: [fd.get("city"), fd.get("state")].filter(Boolean).join(", "),
              provider_type: "network",
              services: fd.getAll("services").map(String),
              website: String(fd.get("website") ?? ""),
              description: [
                `Organisation type: ${String(fd.get("org_type") ?? "")}`,
                `Role / designation: ${String(fd.get("role") ?? "")}`,
                `Other support offered: ${String(fd.get("services_other") ?? "")}`,
                `Communities worked with: ${fd.getAll("communities").map(String).join(", ")}`,
                `Districts covered: ${String(fd.get("districts") ?? "")}`,
                `Enterprises reached per year: ${String(fd.get("reach") ?? "")}`,
                `Years active: ${String(fd.get("years") ?? "")}`,
                `Registration number (if any): ${String(fd.get("registration") ?? "")}`,
                `Existing DRE experience: ${String(fd.get("dre_experience") ?? "")}`,
                `Notes: ${String(fd.get("notes") ?? "")}`,
              ].join("\n"),
            })
              .then(() => {
                toast.success("Registration submitted", {
                  description: "Our team will review your details and get in touch.",
                });
                form.reset();
              })
              .catch((err: unknown) => toast.error("Could not submit", { description: userMessage(err) }))
              .finally(() => setBusy(false));
          }}
        >
          <Field label="Organisation name" name="organisation" required />
          <div>
            <label htmlFor="org_type" className="mb-1.5 block text-sm font-medium">
              Type of organisation
            </label>
            <select
              id="org_type"
              name="org_type"
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            >
              <option>NGO or trust</option>
              <option>Farmer producer organisation</option>
              <option>Self-help group federation</option>
              <option>Cluster or industry association</option>
              <option>Incubator or accelerator</option>
              <option>Consultant or individual facilitator</option>
              <option>Government or academic body</option>
              <option>Other</option>
            </select>
          </div>
          <Field label="Contact person" name="contact_person" required />
          <Field label="Role / designation" name="role" />
          <Field label="Phone" name="phone" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="City" name="city" required />
          <Field label="State" name="state" required />

          <CheckboxGroup label="How you support enterprises" name="services" options={support} className="md:col-span-2" />
          <Field
            label="Other support (if not listed above)"
            name="services_other"
            className="md:col-span-2"
            placeholder="Tell us how else you work with enterprises"
          />

          <CheckboxGroup
            label="Communities you work with"
            name="communities"
            options={communities}
            className="md:col-span-2"
          />

          <Field label="Districts covered" name="districts" required className="md:col-span-2" />
          <Field label="Enterprises reached per year" name="reach" />
          <Field label="Years active" name="years" />
          <Field label="Registration number (if any)" name="registration" />
          <Field label="Website" name="website" />
          <TextArea
            label="Any existing work on renewable energy or energy access"
            name="dre_experience"
            rows={3}
            className="md:col-span-2"
          />
          <TextArea label="Anything else we should know" name="notes" rows={3} className="md:col-span-2" />

          <p className="text-xs text-muted-foreground md:col-span-2">
            Not sure this is the right form?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            and we will guide you.
          </p>
          <SubmitRow busy={busy} />
        </form>
      </div>
    </>
  );
}
