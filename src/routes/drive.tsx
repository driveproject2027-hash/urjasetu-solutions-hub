import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "../components/site/PageHeader";
import { fetchImpactMetrics } from "../lib/db";

// Fallback shown until verified figures are published from the admin dashboard.
const fallbackImpact = [
  { label: "No. of Solutions", value: "To be updated" },
  { label: "Enterprises Benefited", value: "To be updated" },
  { label: "Regions Covered", value: "To be updated" },
];

const partners = [
  {
    name: "GAME",
    role: "Global Alliance for Mass Entrepreneurship — works on mass entrepreneurship in India, including access to finance, market linkages and enabling policy. Role within DRIVE: to be updated with project-provided information.",
  },
  {
    name: "LGV",
    role: "Partner in the DRIVE initiative. Role and contribution: to be updated with project-provided information.",
  },
  {
    name: "Sales Force",
    role: "Partner in the DRIVE initiative. Role and contribution: to be updated with project-provided information.",
  },
];

export const Route = createFileRoute("/drive")({
  head: () => ({
    meta: [
      { title: "DRIVE — Decentralised Renewable Energy Innovation for Vibrant Enterprises" },
      {
        name: "description",
        content:
          "DRIVE is the initiative supporting UrjaSethu — strengthening decentralised renewable energy adoption among Indian enterprises through awareness, matching and financing linkages.",
      },
      { property: "og:title", content: "About DRIVE" },
      {
        property: "og:description",
        content: "The initiative behind UrjaSethu: purpose, partners, approach and impact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Drive,
});

function Drive() {
  const [impact, setImpact] = useState(fallbackImpact);

  useEffect(() => {
    fetchImpactMetrics()
      .then((rows) => {
        const list = (rows ?? []) as unknown as Array<{ label: string; value: string | null }>;
        if (list.length > 0) {
          setImpact(list.map((m) => ({ label: m.label, value: m.value || "To be updated" })));
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="The initiative"
        title="DRIVE"
        intro="Decentralised Renewable Energy Innovation for Vibrant Enterprises."
      />

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold">What DRIVE is</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">
              DRIVE is an initiative working on decentralised renewable energy adoption within Indian enterprises. It
              brings together awareness building, technology matching, enterprise development and financing linkages so
              that a small business can move from an energy problem to a working solution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Purpose</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">
              To make decentralised renewable energy a practical, financeable choice for micro, small and medium
              enterprises — starting from the business problem rather than the technology catalogue. UrjaSethu is the
              platform through which this happens; DRIVE supports it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Partners</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {partners.map((p) => (
                <li key={p.name} className="grid gap-2 py-5 md:grid-cols-[10rem_1fr]">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  <p className="text-foreground/85">{p.role}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">The DRIVE approach</h2>
            <ol className="mt-4 space-y-3 text-foreground/85">
              <li>
                <span className="text-xs text-muted-foreground">01</span> Understand the business problem before
                proposing any technology.
              </li>
              <li>
                <span className="text-xs text-muted-foreground">02</span> Match an appropriate decentralised renewable
                energy solution to that problem.
              </li>
              <li>
                <span className="text-xs text-muted-foreground">03</span> Work out how the project will be financed.
              </li>
              <li>
                <span className="text-xs text-muted-foreground">04</span> Pilot with a credible provider, then scale
                what works.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Impact</h2>
            <dl className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-3">
              {impact.map((m) => (
                <div key={m.label} className="bg-background p-5">
                  <dt className="text-sm text-muted-foreground">{m.label}</dt>
                  <dd className="mt-2 font-display text-lg font-semibold">{m.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">
              Impact figures are published only once verified by the project authorities. Additional verified metrics
              will be added here as they become available.
            </p>
          </section>
        </div>

        <aside className="space-y-4 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Related</h2>
          <Link to="/about" className="block font-medium hover:text-primary">
            About UrjaSethu →
          </Link>
          <Link to="/events" className="block font-medium hover:text-primary">
            Events &amp; awareness →
          </Link>
          <Link to="/contact" className="block font-medium hover:text-primary">
            Contact the team →
          </Link>
        </aside>
      </div>
    </>
  );
}
