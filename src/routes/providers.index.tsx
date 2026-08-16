import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Search, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { fetchApprovedProviders, providerTypeLabels, type ProviderType } from "../lib/db";
import { PageHeader } from "../components/site/PageHeader";
import { providers, solutions } from "../data/catalog";

export const Route = createFileRoute("/providers/")({
  head: () => ({
    meta: [
      { title: "Find DRE Providers — UrjaSethu" },
      {
        name: "description",
        content:
          "Search verified decentralised renewable energy providers by technology, industry, location and service area.",
      },
      { property: "og:title", content: "Find DRE Providers — UrjaSethu" },
      { property: "og:description", content: "A directory of DRE installers, manufacturers and service providers." },
    ],
  }),
  component: ProvidersIndex,
});

type ApprovedProvider = {
  id: string;
  organisation: string;
  location: string | null;
  provider_type: string;
  services: string[] | null;
  website: string | null;
  description: string | null;
};

const typeTabs: Array<{ value: ProviderType | "all"; label: string; blurb: string }> = [
  { value: "all", label: "All partners", blurb: "Everyone listed on UrjaSethu." },
  {
    value: "solution",
    label: "Solution providers",
    blurb: "Installers, manufacturers and O&M teams delivering DRE equipment on the ground.",
  },
  {
    value: "finance",
    label: "Finance providers",
    blurb: "NBFCs, banks, cooperatives and funds that lend against DRE assets.",
  },
  {
    value: "network",
    label: "Network partners",
    blurb: "FPOs, incubators, associations and NGOs that aggregate demand and support enterprises.",
  },
];

function ProvidersIndex() {
  const [approved, setApproved] = useState<ApprovedProvider[]>([]);
  const [providerType, setProviderType] = useState<ProviderType | "all">("all");
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("");
  const [state, setState] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchApprovedProviders()
      .then((rows) => setApproved((rows ?? []) as unknown as ApprovedProvider[]))
      .catch(() => undefined);
  }, []);

  const activeTab = typeTabs.find((t) => t.value === providerType) ?? typeTabs[0]!;
  const approvedForType =
    providerType === "all" ? approved : approved.filter((a) => a.provider_type === providerType);
  const showSolutionDirectory = providerType === "all" || providerType === "solution";
  const typeCounts = {
    solution: approved.filter((a) => a.provider_type === "solution").length,
    finance: approved.filter((a) => a.provider_type === "finance").length,
    network: approved.filter((a) => a.provider_type === "network").length,
  };


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

      <div className="border-b border-border bg-ivory">
        <nav className="container-page flex flex-wrap gap-2 py-4" aria-label="Partner type">
          {typeTabs.map((t) => {
            const count = t.value === "all" ? undefined : typeCounts[t.value];
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setProviderType(t.value)}
                aria-pressed={providerType === t.value}
                className={`border px-3 py-1.5 text-sm ${
                  providerType === t.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {t.label}
                {count !== undefined && <span className="ml-2 text-xs opacity-70">{count}</span>}
              </button>
            );
          })}
        </nav>
      </div>


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
          <p className="mb-6 border-l-2 border-primary pl-4 text-sm text-muted-foreground">{activeTab.blurb}</p>

          {approvedForType.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-3 font-display text-xl font-semibold">
                {providerType === "all" ? "Verified platform partners" : `Verified ${activeTab.label.toLowerCase()}`}
              </h2>
              <ul className="divide-y divide-border border-y border-border">
                {approvedForType.map((a) => (
                  <li key={a.id} className="py-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-semibold">{a.organisation}</h3>
                      <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {providerTypeLabels[a.provider_type as ProviderType] ?? a.provider_type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.location}</p>
                    {a.services && a.services.length > 0 && (
                      <p className="mt-2 text-sm">{a.services.join(" · ")}</p>
                    )}
                    {a.description && (
                      <p className="mt-2 max-w-2xl whitespace-pre-line text-sm text-foreground/85">{a.description}</p>
                    )}
                    {a.website && (
                      <a href={a.website} className="mt-2 inline-block text-sm text-primary underline" rel="noreferrer">
                        Visit website
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!showSolutionDirectory && approvedForType.length === 0 && (
            <p className="border-y border-border py-8 text-sm text-muted-foreground">
              No {activeTab.label.toLowerCase()} are listed yet. Organisations of this kind can apply through Join Us
              and appear here once verified.
            </p>
          )}

          {showSolutionDirectory && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">{results.length} solution providers</p>
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
            </>
          )}

        </div>
      </div>
    </>
  );
}
