import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { CheckboxGroup, Field, JoinSteps, SubmitRow, TextArea } from "../components/site/FormField";
import { submitProviderApplication } from "../lib/db";
import { userMessage } from "../lib/user-error";

export const Route = createFileRoute("/join-us/finance-provider")({
  head: () => ({
    meta: [
      { title: "Register as a Finance Provider — UrjaSethu" },
      {
        name: "description",
        content:
          "Banks, NBFCs, cooperatives and leasing companies can register on UrjaSethu to finance MSME investments in decentralised renewable energy.",
      },
      { property: "og:title", content: "Register as a Finance Provider — UrjaSethu" },
      { property: "og:description", content: "Reach MSMEs seeking finance for renewable energy assets." },
    ],
  }),
  component: FinanceProviderForm,
});

const products = [
  "Term loan",
  "Working capital",
  "Equipment / asset finance",
  "Lease or rental",
  "Pay-as-you-go",
  "Subsidy-linked loan",
  "Partial guarantee",
  "Grant or blended finance",
];

const sectors = [
  "Agriculture & agri-processing",
  "Food processing & cold chain",
  "Textiles & apparel",
  "Manufacturing & engineering",
  "Retail & services",
  "Dairy & livestock",
  "Handicrafts & artisans",
  "Mobility & logistics",
];

function FinanceProviderForm() {
  const [busy, setBusy] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Join us · Finance provider"
        title="Register as a finance provider"
        intro="Tell us what you lend, to whom and where, so we can route relevant MSME requirements to you."
      />

      <div className="container-page py-12">
        <JoinSteps steps={["Submitted", "Under review", "Verified", "Listed"]} />

        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            setBusy(true);
            submitProviderApplication({
              organisation: String(fd.get("institution") ?? ""),
              contact_person: String(fd.get("contact_person") ?? ""),
              email: String(fd.get("email") ?? ""),
              phone: String(fd.get("phone") ?? ""),
              location: [fd.get("city"), fd.get("state")].filter(Boolean).join(", "),
              provider_type: "finance",
              services: fd.getAll("services").map(String),
              website: String(fd.get("website") ?? ""),
              description: [
                `Institution type: ${String(fd.get("institution_type") ?? "")}`,
                `Other product: ${String(fd.get("services_other") ?? "")}`,
                `Ticket size: ${String(fd.get("ticket_min") ?? "")} to ${String(fd.get("ticket_max") ?? "")}`,
                `Typical tenure: ${String(fd.get("tenure") ?? "")}`,
                `Indicative interest range: ${String(fd.get("interest") ?? "")}`,
                `Collateral requirement: ${String(fd.get("collateral") ?? "")}`,
                `Geographies covered: ${String(fd.get("geographies") ?? "")}`,
                `Sectors funded: ${fd.getAll("sectors").map(String).join(", ")}`,
                `Government schemes handled: ${String(fd.get("schemes") ?? "")}`,
                `Regulator / licence: ${String(fd.get("licence") ?? "")}`,
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
          <Field label="Institution name" name="institution" required />
          <div>
            <label htmlFor="institution_type" className="mb-1.5 block text-sm font-medium">
              Type of institution
            </label>
            <select
              id="institution_type"
              name="institution_type"
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            >
              <option>Scheduled commercial bank</option>
              <option>Regional rural bank</option>
              <option>Cooperative bank</option>
              <option>NBFC</option>
              <option>Microfinance institution</option>
              <option>Leasing / rental company</option>
              <option>Impact fund or grant body</option>
              <option>Other</option>
            </select>
          </div>
          <Field label="Contact person" name="contact_person" required />
          <Field label="Designation" name="designation" />
          <Field label="Phone" name="phone" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="City" name="city" required />
          <Field label="State" name="state" required />

          <CheckboxGroup label="Financing products offered" name="services" options={products} className="md:col-span-2" />
          <Field
            label="Other product (if not listed above)"
            name="services_other"
            className="md:col-span-2"
            placeholder="Describe the product you offer"
          />

          <Field label="Minimum ticket size (₹)" name="ticket_min" />
          <Field label="Maximum ticket size (₹)" name="ticket_max" />
          <Field label="Typical tenure" name="tenure" placeholder="e.g. 3–7 years" />
          <Field label="Indicative interest range" name="interest" placeholder="e.g. 9–13% p.a." />
          <Field label="Collateral requirement" name="collateral" placeholder="Collateral-free / partial / full" />
          <Field label="Regulator or licence" name="licence" placeholder="RBI, NABARD, SIDBI empanelment…" />
          <Field label="Geographies covered" name="geographies" className="md:col-span-2" placeholder="States and districts you lend in" />

          <CheckboxGroup label="Sectors you fund" name="sectors" options={sectors} className="md:col-span-2" />
          <Field
            label="Government schemes you process"
            name="schemes"
            className="md:col-span-2"
            placeholder="MSE GIFT, PMEGP, PMFME, CGTMSE…"
          />
          <Field label="Website" name="website" className="md:col-span-2" />
          <TextArea label="Anything else we should know" name="notes" rows={4} className="md:col-span-2" />

          <p className="text-xs text-muted-foreground md:col-span-2">
            UrjaSethu does not process loan applications or guarantee eligibility. If your offering does not fit these
            fields,{" "}
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
