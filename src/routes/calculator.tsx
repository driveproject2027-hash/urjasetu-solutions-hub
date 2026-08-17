import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Solar Business Calculator — indicative estimates | UrjaSethu" },
      {
        name: "description",
        content:
          "Estimate an indicative solar system size, monthly generation, savings, investment and payback for your business. Approximate figures only.",
      },
      { property: "og:title", content: "Solar Business Calculator — UrjaSethu" },
      { property: "og:description", content: "What could solar look like for your business?" },
      { property: "og:url", content: "https://urjasethu.dev/calculator" },
      { property: "og:image", content: "https://urjasethu.dev/og-image.jpg" },
      { name: "twitter:image", content: "https://urjasethu.dev/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://urjasethu.dev/calculator" }],
  }),
  component: Calculator,
});

// Indicative reference values only, in the spirit of the project material.
const TARIFF = 8; // ₹ per unit, indicative commercial tariff
const UNITS_PER_KW_MONTH = 120; // indicative generation
const COST_PER_KW = 60000; // indicative installed cost

function Calculator() {
  const [bill, setBill] = useState(15000);
  const [hours, setHours] = useState("Daytime only");
  const [roof, setRoof] = useState(500);

  const unitsUsed = bill / TARIFF;
  const sizeFromBill = unitsUsed / UNITS_PER_KW_MONTH;
  const sizeFromRoof = roof / 100; // ~100 sq ft per kW
  const size = Math.max(1, Math.round(Math.min(sizeFromBill, sizeFromRoof)));
  const generation = Math.round(size * UNITS_PER_KW_MONTH);
  const offsetFactor = hours === "Daytime only" ? 0.95 : hours === "Extended into evening" ? 0.75 : 0.6;
  const savings = Math.round(generation * TARIFF * offsetFactor);
  const investment = size * COST_PER_KW;
  const payback = savings > 0 ? (investment / (savings * 12)).toFixed(1) : "—";

  return (
    <>
      <PageHeader
        eyebrow="Estimator"
        title="What could solar look like for your business?"
        intro="A first-pass estimate to help you decide whether to explore further. All figures are approximate and are not a quotation."
      />
      <div className="container-page grid gap-12 py-12 md:grid-cols-2">
        <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="bill" className="mb-2 block text-sm font-medium">
              Monthly electricity bill: ₹{bill.toLocaleString("en-IN")}
            </label>
            <input
              id="bill"
              type="range"
              min={1000}
              max={200000}
              step={1000}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full accent-[oklch(0.42_0.075_152)]"
            />
          </div>
          <div>
            <label htmlFor="roof" className="mb-2 block text-sm font-medium">
              Usable roof area: {roof} sq ft
            </label>
            <input
              id="roof"
              type="range"
              min={100}
              max={5000}
              step={50}
              value={roof}
              onChange={(e) => setRoof(Number(e.target.value))}
              className="w-full accent-[oklch(0.42_0.075_152)]"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Operating hours</p>
            <div className="flex flex-wrap gap-2">
              {["Daytime only", "Extended into evening", "Round the clock"].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`border px-4 py-2 text-sm ${
                    hours === h ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="border border-border bg-card p-7">
          <h2 className="text-lg font-semibold">Indicative result</h2>
          <dl className="mt-6 divide-y divide-border">
            <Result term="Recommended system" value={`${size} kW`} />
            <Result term="Estimated generation" value={`${generation.toLocaleString("en-IN")} units / month`} />
            <Result term="Indicative monthly saving" value={`₹${savings.toLocaleString("en-IN")}`} />
            <Result term="Approximate investment" value={`₹${investment.toLocaleString("en-IN")}`} />
            <Result term="Indicative payback" value={`${payback} years`} />
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Estimates use indicative reference values for tariff, generation and installed cost. Actual figures
            depend on site conditions, load pattern, tariff category and equipment selected. This is not a
            guarantee or a quotation.
          </p>
          <Link
            to="/providers"
            className="mt-6 inline-block bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
          >
            Get quotes from providers
          </Link>
        </div>
      </div>
    </>
  );
}

function Result({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-3">
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd className="font-display text-lg font-semibold">{value}</dd>
    </div>
  );
}
