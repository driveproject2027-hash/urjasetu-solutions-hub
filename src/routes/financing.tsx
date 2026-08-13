import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";
import { schemes } from "../data/catalog";


export const Route = createFileRoute("/financing")({
  head: () => ({
    meta: [
      { title: "Financing & Support for DRE Investments — UrjaSetu" },
      {
        name: "description",
        content:
          "Schemes referenced in the DRIVE material — MSE GIFT, MSE SPICE, PMFME, PMEGP and ZED — that may support Indian MSMEs adopting renewable energy.",
      },
      { property: "og:title", content: "Financing & Support — UrjaSetu" },
      { property: "og:description", content: "Government schemes that may support DRE adoption by MSMEs." },
    ],
  }),
  component: Financing,
});

function Financing() {
  return (
    <>
      <PageHeader
        eyebrow="Financing"
        title="Find support for your business"
        intro="These schemes are referenced in the DRIVE material. Eligibility, limits and application windows vary and change — verify current information on the official scheme website before applying."
      />
      <div className="container-page py-12">
        <div className="mb-10 flex flex-wrap items-center gap-4 border border-border bg-ivory p-5">
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">Finance Helper</h2>
            <p className="mt-1 text-sm text-foreground/85">
              Answer a few questions and see which support options may be potentially relevant for you.
            </p>
          </div>
          <Link
            to="/resources/finance-helper"
            className="border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
          >
            Open Finance Helper
          </Link>
        </div>
        <ul className="divide-y divide-border border-y border-border">

          {schemes.map((s) => (
            <li key={s.name} className="grid gap-2 py-6 md:grid-cols-[12rem_1fr]">
              <h2 className="font-display text-lg font-semibold">{s.name}</h2>
              <p className="text-base text-foreground/85">{s.what}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          UrjaSetu does not process applications, guarantee eligibility or provide financial advice. Scheme details
          shown here are summaries for orientation only.
        </p>
      </div>
    </>
  );
}
