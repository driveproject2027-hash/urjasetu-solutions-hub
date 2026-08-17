import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { CheckboxGroup, Field, JoinSteps, SubmitRow, TextArea } from "../components/site/FormField";
import { submitProviderApplication } from "../lib/db";
import { solutions } from "../data/catalog";
import { userMessage } from "../lib/user-error";

export const Route = createFileRoute("/join-us/solution-provider")({
  head: () => ({
    meta: [
      { title: "Register as a DRE Solution Provider — UrjaSethu" },
      {
        name: "description",
        content:
          "Register your DRE company on UrjaSethu — technologies offered, service districts, capacity and certifications — and reach Indian businesses looking for solutions.",
      },
      { property: "og:title", content: "Register as a DRE Solution Provider — UrjaSethu" },
      { property: "og:description", content: "Reach businesses actively looking for renewable energy solutions." },
      { property: "og:url", content: "https://urjasethu.dev/join-us/solution-provider" },
      { property: "og:image", content: "https://urjasethu.dev/og-image.jpg" },
      { name: "twitter:image", content: "https://urjasethu.dev/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://urjasethu.dev/join-us/solution-provider" }],
  }),
  component: SolutionProviderForm,
});

function SolutionProviderForm() {
  const [busy, setBusy] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Join us · Solution provider"
        title="Register as a DRE solution provider"
        intro="Put your systems in front of businesses actively looking for them. We verify what you submit before your profile is published."
      />

      <div className="container-page py-12">
        <JoinSteps steps={["Submitted", "Under review", "Verified", "Published"]} />

        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            setBusy(true);
            submitProviderApplication({
              organisation: String(fd.get("company") ?? ""),
              contact_person: String(fd.get("contact_person") ?? ""),
              email: String(fd.get("email") ?? ""),
              phone: String(fd.get("phone") ?? ""),
              location: [fd.get("city"), fd.get("state")].filter(Boolean).join(", "),
              provider_type: "solution",
              services: fd.getAll("services").map(String),
              website: String(fd.get("website") ?? ""),
              description: [
                `Other technologies: ${String(fd.get("services_other") ?? "")}`,
                `Service districts: ${String(fd.get("districts") ?? "")}`,
                `Industries served: ${String(fd.get("industries") ?? "")}`,
                `Years of experience: ${String(fd.get("experience") ?? "")}`,
                `Installations completed: ${String(fd.get("installations") ?? "")}`,
                `Largest system installed: ${String(fd.get("largest_system") ?? "")}`,
                `In-house O&M / service: ${String(fd.get("service_model") ?? "")}`,
                `Certifications / empanelments: ${String(fd.get("certifications") ?? "")}`,
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
          <Field label="Company name" name="company" required />
          <Field label="Contact person" name="contact_person" required />
          <Field label="Phone" name="phone" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="City" name="city" required />
          <Field label="State" name="state" required />

          <CheckboxGroup
            label="Technologies offered"
            name="services"
            options={solutions.map((s) => s.name)}
            className="md:col-span-2"
          />
          <Field
            label="Other technologies (if not listed above)"
            name="services_other"
            placeholder="Tell us what else you supply or install"
            className="md:col-span-2"
          />

          <Field label="Service areas (districts)" name="districts" required className="md:col-span-2" />
          <Field label="Industries served" name="industries" className="md:col-span-2" />
          <Field label="Years of experience" name="experience" />
          <Field label="Installations completed" name="installations" />
          <Field label="Largest system installed (kW / capacity)" name="largest_system" />
          <Field label="In-house O&M or service team?" name="service_model" placeholder="Yes / No / Through partners" />
          <Field label="Certifications and empanelments" name="certifications" className="md:col-span-2" placeholder="MNRE, state DISCOM, ISO, BIS…" />
          <Field label="Website" name="website" className="md:col-span-2" />
          <TextArea
            label="Anything else about your capacity or past projects"
            name="notes"
            rows={5}
            className="md:col-span-2"
          />

          <p className="text-xs text-muted-foreground md:col-span-2">
            Verification means the platform has reviewed the information you submit. It is separate from customer
            ratings, which come only from real project experience. If something here does not fit your business,{" "}
            <Link to="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            .
          </p>
          <SubmitRow busy={busy} />
        </form>
      </div>
    </>
  );
}
