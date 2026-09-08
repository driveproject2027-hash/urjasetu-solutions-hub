import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "../components/site/PageHeader";
import { submitCustomerRequest } from "../lib/db";
import { estimateSolarProject } from "../lib/solar-estimate";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Solar Business Calculator — indicative estimates | LayaGreenEnergy" },
      {
        name: "description",
        content:
          "Estimate an indicative solar system size, monthly generation, savings, investment and payback for your business. Approximate figures only.",
      },
      { property: "og:title", content: "Solar Business Calculator — LayaGreenEnergy" },
      { property: "og:description", content: "What could solar look like for your business?" },
      { property: "og:url", content: "https://layagreenenergy.dev/calculator" },
      { property: "og:image", content: "https://layagreenenergy.dev/og-image.jpg" },
      { name: "twitter:image", content: "https://layagreenenergy.dev/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://layagreenenergy.dev/calculator" }],
  }),
  component: Calculator,
});

const STATE_TARIFFS: Record<string, number> = {
  "Andhra Pradesh": 8,
  Telangana: 8.5,
  Karnataka: 7.5,
  Maharashtra: 9,
  Gujarat: 7.5,
  "Tamil Nadu": 8,
  Rajasthan: 8,
  "West Bengal": 9,
};

const STATES = ["Andhra Pradesh", "Telangana", "Karnataka", "Maharashtra", "Gujarat", "Tamil Nadu", "Rajasthan", "West Bengal"];
const CATEGORIES = ["Residential", "Commercial", "Industrial"];

type CalculationMode = "bill" | "units" | "roof";

const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

function Calculator() {
  const [mode, setMode] = useState<CalculationMode>("bill");
  const [bill, setBill] = useState(15000);
  const [units, setUnits] = useState(1875);
  const [roof, setRoof] = useState(500);
  const [roofUnit, setRoofUnit] = useState<"sqft" | "sqm">("sqft");
  const [state, setState] = useState("Andhra Pradesh");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("Commercial");
  const [tariff, setTariff] = useState(8);
  const [subsidy, setSubsidy] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [leadMessage, setLeadMessage] = useState("");

  const estimate = estimateSolarProject({
    mode,
    bill,
    units,
    roofArea: roof,
    roofUnit,
    state,
    customerType: category.toLowerCase() as "residential" | "commercial" | "industrial",
    tariff,
    includeResidentialSubsidy: subsidy,
  });

  const { recommendedSystemKw: size, generationKwhPerMonth: generation, monthlySavings: savings, annualSavings, investment, paybackYears: payback, lifetimeSavings, co2AvoidedTonnes: co2, treesEquivalent: trees, subsidyAmount, subsidyEligible } = estimate;

  function changeState(value: string) {
    setState(value);
    setTariff(STATE_TARIFFS[value] ?? 8);
  }

  async function requestReport(event: React.FormEvent) {
    event.preventDefault();
    try {
      await submitCustomerRequest({
        source: "contact",
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        location: state,
        requirement: `Solar calculator report: ${size} kW system, ${category}, ${formatCurrency(savings)} monthly indicative savings.`,
        details: { calculation_mode: mode, monthly_bill: bill, monthly_units: units, roof_area: roof, tariff, subsidy, state, district },
      });
      setLeadMessage("Thanks. Our team will follow up with your indicative calculation.");
    } catch {
      setLeadMessage("We could not save the request. Please try again or contact us directly.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Estimator"
        title="What could solar look like for your business?"
        intro="A first-pass estimate to help you decide whether to explore further. All figures are approximate and are not a quotation."
      />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-7">
          <div className="grid grid-cols-3 gap-2 border-b border-border pb-4">
            {([["bill", "Monthly bill"], ["units", "Monthly units"], ["roof", "Roof area"]] as const).map(([value, label]) => (
              <button key={value} type="button" onClick={() => setMode(value)} className={`border px-3 py-2 text-sm ${mode === value ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                {label}
              </button>
            ))}
          </div>
          {mode === "bill" && <Field label={`Monthly electricity bill: ${formatCurrency(bill)}`} id="bill" value={bill} min={1000} max={200000} step={1000} onChange={setBill} />}
          {mode === "units" && <Field label={`Monthly consumption: ${units.toLocaleString("en-IN")} kWh`} id="units" value={units} min={100} max={30000} step={50} onChange={setUnits} />}
          {mode === "roof" && <Field label={`Available roof: ${roof.toLocaleString("en-IN")} ${roofUnit}`} id="roof" value={roof} min={100} max={5000} step={50} onChange={setRoof} />}
          {mode === "roof" && <div className="flex gap-2"><button type="button" onClick={() => setRoofUnit("sqft")} className={`border px-3 py-1.5 text-sm ${roofUnit === "sqft" ? "border-primary text-primary" : "border-border"}`}>Square feet</button><button type="button" onClick={() => setRoofUnit("sqm")} className={`border px-3 py-1.5 text-sm ${roofUnit === "sqm" ? "border-primary text-primary" : "border-border"}`}>Square metres</button></div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">State<select value={state} onChange={(e) => changeState(e.target.value)} className="mt-2 w-full border border-input bg-background px-3 py-2.5 font-normal">{STATES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-sm font-medium">Customer category<select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full border border-input bg-background px-3 py-2.5 font-normal">{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <label className="block text-sm font-medium">District / city<input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Visakhapatnam" className="mt-2 w-full border border-input bg-background px-3 py-2.5 font-normal" /></label>
          <div>
            <label htmlFor="tariff" className="mb-2 block text-sm font-medium">Electricity unit cost: {formatCurrency(tariff)} / kWh</label>
            <input id="tariff" type="range" min={1} max={30} step={0.5} value={tariff} onChange={(e) => setTariff(Number(e.target.value))} className="w-full accent-[oklch(0.42_0.075_152)]" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>₹1</span><span>₹30</span></div>
          </div>
          <div className="flex items-center gap-3 border border-border p-3 text-sm"><input id="subsidy" type="checkbox" className="size-4 accent-[oklch(0.42_0.075_152)]" checked={subsidy} onChange={(e) => setSubsidy(e.target.checked)} /><label htmlFor="subsidy" className="cursor-pointer">Include residential subsidy estimate</label></div>
          <div className="border-l-2 border-primary/50 bg-muted p-4 text-sm"><p className="font-medium">{subsidyEligible ? "Residential subsidy included" : "Subsidy guidance"}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{subsidyEligible ? `This estimate includes up to ${formatCurrency(subsidyAmount)} in indicative central support. Confirm current scheme rules and eligibility with the official portal.` : "Central rooftop subsidy estimates apply only to eligible residential consumers. Commercial and industrial projects should explore state schemes, financing and tax treatment instead."}</p></div>
        </section>

        <div className="border border-border bg-card p-7">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Indicative report</p>
          <h2 className="mt-2 text-lg font-semibold">Your solar savings estimate</h2>
          <dl className="mt-6 divide-y divide-border">
            <Result term="Recommended system" value={`${size} kW`} />
            <Result term="Estimated generation" value={`${generation.toLocaleString("en-IN")} units / month`} />
            <Result term="Monthly bill saving" value={formatCurrency(savings)} />
            <Result term="Annual bill saving" value={formatCurrency(annualSavings)} />
            <Result term="Approximate investment" value={formatCurrency(investment)} />
            <Result term="Simple payback" value={`${payback.toFixed(1)} years`} />
            <Result term="25-year indicative saving" value={formatCurrency(lifetimeSavings)} />
            <Result term="CO₂ avoided / 25 years" value={`${co2.toFixed(1)} tonnes`} />
            <Result term="Trees equivalent" value={trees.toLocaleString("en-IN")} />
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Estimates use indicative reference values for tariff, generation and installed cost. Actual figures
            depend on site conditions, load pattern, tariff category and equipment selected. This is not a
            guarantee or a quotation.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={() => setShowLead(true)} className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep">
              Get my indicative report
            </button>
            <Link
              to="/providers"
              className="inline-block bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-forest-deep"
            >
              Get quotes from providers
            </Link>
          </div>
          {showLead && <form onSubmit={requestReport} className="mt-6 space-y-3 border-t border-border pt-5"><p className="text-sm font-medium">Where should we send your follow-up?</p><input required value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Name" className="w-full border border-input bg-background px-3 py-2.5 text-sm" /><input required type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="Email" className="w-full border border-input bg-background px-3 py-2.5 text-sm" /><input value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="Phone (optional)" className="w-full border border-input bg-background px-3 py-2.5 text-sm" /><button type="submit" className="w-full border border-primary px-4 py-2.5 text-sm font-medium text-primary">Request follow-up</button>{leadMessage && <p className="text-xs text-muted-foreground">{leadMessage}</p>}</form>}
        </div>
      </div>
    </>
  );
}

function Field({ label, id, value, min, max, step, onChange }: { label: string; id: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[oklch(0.42_0.075_152)]" /></div>;
}

function Result({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-3">
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd className="font-display text-lg font-semibold">{value}</dd>
    </div>
  );
}
