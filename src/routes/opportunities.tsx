import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";
import { opportunities } from "../data/catalog";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Start a DRE Business — Business Opportunities | UrjaSethu" },
      {
        name: "description",
        content:
          "Enterprise opportunities in decentralised renewable energy: solar drying, cold storage, service centres, e-mobility, waste-to-fuel and textile clusters.",
      },
      { property: "og:title", content: "Start a DRE Business — UrjaSethu" },
      { property: "og:description", content: "Enterprise opportunities in decentralised renewable energy." },
    ],
  }),
  component: Opportunities,
});

function Opportunities() {
  const [lead, ...rest] = opportunities;

  return (
    <>
      <PageHeader
        eyebrow="Enterprise"
        title="Start a DRE business"
        intro="Opportunities where decentralised renewable energy creates a viable enterprise. We do not publish projected returns — viability depends on local demand, costs and utilisation."
      />

      <div className="container-page py-12">
        {lead && (
          <article className="grid gap-8 border-b border-border pb-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-semibold">{lead.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground/85">{lead.opportunity}</p>
              <p className="mt-4 text-base text-muted-foreground">{lead.problem}</p>
            </div>
            <dl className="space-y-4 border-l border-border pl-8 text-sm">
              <Row term="Suitable for" desc={lead.users} />
              <Row term="Technology" desc={lead.tech} />
              <Row
                term="Requirements"
                desc="Space, working capital, basic operating skills and a reliable local customer base."
              />
              <Row term="Support" desc="See financing schemes and provider onboarding." />
              <Link
                to="/find-my-solution"
                search={{ problem: "new-business" }}
                className="mt-2 inline-block bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
              >
                Assess this opportunity
              </Link>
            </dl>
          </article>
        )}

        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {rest.map((o) => (
            <article key={o.slug} className="border-t border-border pt-5">
              <h2 className="font-display text-lg font-semibold">{o.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{o.problem}</p>
              <p className="mt-3 text-base">{o.opportunity}</p>
              <dl className="mt-4 space-y-1 text-sm">
                <Row term="Suitable for" desc={o.users} />
                <Row term="Technology" desc={o.tech} />
              </dl>
              <Link
                to="/providers"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Find relevant providers →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 border border-border bg-ivory p-8">
          <h2 className="text-xl font-semibold">Financing and support</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Several central schemes support micro and small enterprises adopting cleaner energy. Eligibility and
            limits vary and change over time.
          </p>
          <Link to="/financing" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            See financing and support →
          </Link>
        </div>
      </div>
    </>
  );
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-muted-foreground">{term}</dt>
      <dd>{desc}</dd>
    </div>
  );
}
