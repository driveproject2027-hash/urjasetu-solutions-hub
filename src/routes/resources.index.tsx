import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageHeader } from "../components/site/PageHeader";
import { resourceCategories } from "../data/resources";
import { solutions, opportunities, stories } from "../data/catalog";


export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Resources — DRE knowledge centre | UrjaSetu" },
      {
        name: "description",
        content:
          "Guides, government schemes, financing resources, DRE technologies, business opportunities and ecosystem insights for Indian businesses exploring decentralised renewable energy.",
      },
      { property: "og:title", content: "Resources — UrjaSetu knowledge centre" },
      {
        property: "og:description",
        content: "Understand DRE. Find the right support. Make better decisions.",
      },
    ],
  }),
  component: ResourcesHub,
});

const exampleSearches = ["solar subsidy", "cold storage", "solar dryer", "PMEGP", "DRE financing", "battery storage"];

type Hit = { title: string; summary: string; category: string; slug: string };

function ResourcesHub() {
  const [q, setQ] = useState("");

  const index = useMemo<Hit[]>(() => {
    const items: Hit[] = [];
    for (const cat of resourceCategories) {
      items.push({ title: cat.name, summary: cat.tagline, category: "Category", slug: cat.slug });
      for (const a of cat.articles) {
        items.push({
          title: a.title,
          summary: `${a.summary} ${a.tags.join(" ")}`,
          category: cat.name,
          slug: cat.slug,
        });
      }
    }
    for (const s of solutions) {
      items.push({ title: s.name, summary: s.summary, category: "DRE Technologies", slug: 'dre-technologies' });
    }
    for (const o of opportunities) {
      items.push({ title: o.title, summary: o.opportunity, category: "Business Opportunities", slug: 'business-opportunities' });
    }
    return items;
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return index
      .filter((i) => `${i.title} ${i.summary} ${i.category}`.toLowerCase().includes(term))
      .slice(0, 12);
  }, [q, index]);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Understand DRE. Find the right support. Make better decisions."
        intro="Explore practical guides, government schemes, financing resources, DRE technologies, business opportunities and stories from the ecosystem."
      >
        <div className="max-w-xl">
          <label htmlFor="resource-search" className="sr-only">
            Search resources
          </label>
          <input
            id="resource-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search resources..."
            className="w-full border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Try:</span>
            {exampleSearches.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQ(s)}
                className="border border-border px-2 py-1 text-foreground/80 hover:border-primary hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>

          {q.trim().length >= 2 && (
            <div className="mt-6 border border-border bg-background">
              {results.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No resources matched “{q}”.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {results.map((r, i) => (
                    <li key={`${r.slug}-${i}`}>
                      <Link
                        to="/resources/$category"
                        params={{ category: r.slug }}
                        className="block p-4 hover:bg-ivory"
                      >
                        <p className="eyebrow">{r.category}</p>
                        <p className="mt-1 font-display font-semibold">{r.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </PageHeader>

      <div className="container-page py-12">

        <h2 className="mt-16 text-2xl font-semibold">Browse the knowledge centre</h2>
        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {resourceCategories.map((cat) => (
            <Link
              key={cat.slug}
              to="/resources/$category"
              params={{ category: cat.slug }}
              className="group bg-background p-7 transition-colors hover:bg-ivory"
            >
              <h3 className="font-display text-lg font-semibold group-hover:text-primary">{cat.name}</h3>
              <p className="mt-2 text-base text-foreground/85">{cat.tagline}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {cat.slug === "dre-technologies"
                  ? `${solutions.length} technologies`
                  : cat.slug === "business-opportunities"
                    ? `${opportunities.length} opportunities`
                    : cat.slug === "case-studies"
                      ? `${stories.length} case studies`
                      : `${cat.articles.length} resources`}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
          UrjaSetu does not process applications, confirm eligibility or provide financial advice. Scheme summaries are
          for orientation only — always verify current details with the official source.
        </p>
      </div>
    </>
  );
}
