import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "../components/site/PageHeader";
import { financeHelperOptions, matchFinancing, type FinanceMatch } from "../data/resources";

export const Route = createFileRoute("/resources/finance-helper")({
  head: () => ({
    meta: [
      { title: "Finance Helper — find DRE financing options | UrjaSetu" },
      {
        name: "description",
        content:
          "Answer a few questions about your business and project to see which government schemes and financing routes may be worth investigating for a DRE investment in India.",
      },
      { property: "og:title", content: "Finance Helper — UrjaSetu" },
      {
        property: "og:description",
        content: "Potentially relevant schemes and financing routes, with what to check and where to verify.",
      },
    ],
  }),
  component: FinanceHelper,
});

const initial = {
  businessType: "",
  location: "",
  stage: "",
  solution: "",
  cost: "",
  support: "",
};

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function FinanceHelper() {
  const [form, setForm] = useState(initial);
  const [results, setResults] = useState<FinanceMatch[] | null>(null);

  const set = (k: keyof typeof initial) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const ready = form.businessType && form.stage && form.solution && form.cost && form.support;

  return (
    <>
      <PageHeader
        eyebrow="Resources · Tool"
        title="Finance Helper"
        intro="Tell us about your business and the project you are considering. We will point you to schemes and financing routes that may be worth investigating — and to the official source for each."
      >
        <Link to="/resources" className="text-sm text-primary underline underline-offset-4">
          Back to all resources
        </Link>
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_1.1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setResults(matchFinancing(form));
          }}
          className="space-y-5 border border-border p-7"
        >
          <Field label="Business type" value={form.businessType} options={financeHelperOptions.businessTypes} onChange={set("businessType")} />
          <label className="block">
            <span className="text-sm text-muted-foreground">Location (district / state)</span>
            <input
              value={form.location}
              onChange={(e) => set("location")(e.target.value)}
              placeholder="e.g. Nashik, Maharashtra"
              className="mt-1 w-full border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary"
            />
          </label>
          <Field label="Business stage" value={form.stage} options={financeHelperOptions.stages} onChange={set("stage")} />
          <Field label="DRE solution considered" value={form.solution} options={financeHelperOptions.solutions} onChange={set("solution")} />
          <Field label="Approximate project cost" value={form.cost} options={financeHelperOptions.costs} onChange={set("cost")} />
          <Field label="What kind of support are you looking for?" value={form.support} options={financeHelperOptions.supportTypes} onChange={set("support")} />

          <button
            type="submit"
            disabled={!ready}
            className="w-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep disabled:opacity-50"
          >
            Find Financing Options
          </button>
        </form>

        <div>
          {results === null ? (
            <div className="border border-border bg-ivory p-7">
              <h2 className="font-display text-lg font-semibold">How this works</h2>
              <p className="mt-2 text-base text-foreground/85">
                This tool shortlists options based only on what you enter. It does not check eligibility, does not
                submit any application and does not share your answers with anyone.
              </p>
            </div>
          ) : (
            <section>
              <h2 className="text-2xl font-semibold">Potential Financing &amp; Support</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                These are potentially relevant options based on the information you provided. Eligibility and
                availability must be verified with the relevant authority or financial institution.
              </p>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {results.map((r) => (
                  <li key={r.name} className="py-6">
                    <h3 className="font-display text-lg font-semibold">{r.name}</h3>
                    <p className="mt-2 text-base text-foreground/85">
                      <span className="text-sm text-muted-foreground">Why it may be relevant: </span>
                      {r.why}
                    </p>
                    <p className="mt-2 text-base text-foreground/85">
                      <span className="text-sm text-muted-foreground">What to check: </span>
                      {r.check}
                    </p>
                    <p className="mt-2 text-sm">
                      {r.source.url.startsWith("/") ? (
                        <Link to="/resources/$category" params={{ category: "finance-funding" }} className="text-primary underline underline-offset-4">
                          {r.source.label}
                        </Link>
                      ) : (
                        <a
                          href={r.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-4"
                        >
                          Official source: {r.source.label}
                        </a>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                UrjaSetu does not approve, process or guarantee any financing. Verify current eligibility and scheme
                details with the official government source before applying.
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
