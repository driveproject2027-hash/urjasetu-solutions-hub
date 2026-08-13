import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "../components/site/PageHeader";
import { providers, solutions } from "../data/catalog";

export const Route = createFileRoute("/providers/")({
  head: () => ({
    meta: [
      { title: "Find DRE Providers — UrjaSetu" },
      {
        name: "description",
        content:
          "Search verified decentralised renewable energy providers by technology, industry, location and service area.",
      },
      { property: "og:title", content: "Find DRE Providers — UrjaSetu" },
      { property: "og:description", content: "A directory of DRE installers, manufacturers and service providers." },
    ],
  }),
  component: ProvidersIndex,
});

function ProvidersIndex() {
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("");
  const [state, setState] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const techs = [...new Set(solutions.map((s) => s.name))];
  const states = [...new Set(providers.map((p) => p.state))];

  const results = useMemo(
    () =>
      providers.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.technologies.join(" ").toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q);
        return (
          matchQ &&
          (!tech || p.technologies.includes(tech)) &&
          (!state || p.state === state) &&
          (!verifiedOnly || p.verified)
        );
      }),
    [query, tech, state, verifiedOnly],
  );

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Find DRE providers"
        intro="Installers, manufacturers and service providers working with Indian MSMEs and rural enterprises. All listings shown are demo data."
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-6">
          <div>
            <label htmlFor="q" className="mb-2 block text-sm font-medium">
              Search
            </label>
            <div className="flex items-center border border-input bg-card px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search solar, battery, cold storage..."
                className="w-full bg-transparent px-2 py-2.5 text-base outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="tech" className="mb-2 block text-sm font-medium">
              Technology
            </label>
            <select
              id="tech"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="w-full border border-input bg-card px-3 py-2.5 text-base"
            >
              <option value="">All technologies</option>
              {techs.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="state" className="mb-2 block text-sm font-medium">
              Location
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-input bg-card px-3 py-2.5 text-base"
            >
              <option value="">All states</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="size-4 accent-[oklch(0.42_0.075_152)]"
            />
            Verified providers only
          </label>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">{results.length} providers</p>
          <ul className="divide-y divide-border border-y border-border">
            {results.map((p) => (
              <li key={p.id} className="py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{p.name}</h2>
                      {p.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <BadgeCheck className="size-4" /> DRE Platform Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" /> {p.city}, {p.state}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm">{p.about}</p>
                    <dl className="mt-3 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground">Technologies</dt>
                        <dd>{p.technologies.join(", ")}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground">Industries</dt>
                        <dd>{p.industries.join(", ")}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground">Service areas</dt>
                        <dd>{p.serviceAreas.join(", ")}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground">Projects</dt>
                        <dd>{p.projects}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Star className="size-4 text-amber" /> {p.rating.toFixed(1)}
                    </span>
                    <Link
                      to="/providers/$id"
                      params={{ id: p.id }}
                      className="border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                    >
                      View profile
                    </Link>
                    <Link
                      to="/providers/$id"
                      params={{ id: p.id }}
                      className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
                    >
                      Request quote
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
