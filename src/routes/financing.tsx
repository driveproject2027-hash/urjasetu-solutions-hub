import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";
import { schemes } from "../data/catalog";


export const Route = createFileRoute("/financing")({
  head: () => ({
    meta: [
      { title: "Financing & Support for DRE Investments — UrjaSethu" },
      {
        name: "description",
        content:
          "Schemes referenced in the DRIVE material — MSE GIFT, MSE SPICE, PMFME, PMEGP and ZED — that may support Indian MSMEs adopting renewable energy.",
      },
      { property: "og:title", content: "Financing & Support — UrjaSethu" },
      { property: "og:description", content: "Government schemes that may support DRE adoption by MSMEs." },
      { property: "og:url", content: "https://urjasethu.dev/financing" },
      { property: "og:image", content: "https://urjasethu.dev/og-image.jpg" },
      { name: "twitter:image", content: "https://urjasethu.dev/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://urjasethu.dev/financing" }],
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
        <ul className="divide-y divide-border border-y border-border">

          {schemes.map((s) => (
            <li key={s.name} className="grid gap-2 py-6 md:grid-cols-[12rem_1fr]">
              <h2 className="font-display text-lg font-semibold">{s.name}</h2>
              <p className="text-base text-foreground/85">{s.what}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          UrjaSethu does not process applications, guarantee eligibility or provide financial advice. Scheme details
          shown here are summaries for orientation only.
        </p>
      </div>
    </>
  );
}
