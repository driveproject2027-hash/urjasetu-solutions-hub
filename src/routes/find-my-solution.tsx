import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { PageHeader } from "../components/site/PageHeader";
import { problems, solutions, stories, type ProblemId } from "../data/catalog";

const searchSchema = z.object({
  problem: z.string().optional(),
  story: z.string().optional(),
});

export const Route = createFileRoute("/find-my-solution")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Find My Solution — UrjaSetu" },
      {
        name: "description",
        content:
          "Answer a few questions about your business and the problem you face. Get explainable DRE recommendations and matching providers.",
      },
      { property: "og:title", content: "Find My Solution — UrjaSetu" },
      { property: "og:description", content: "Start with the problem. We'll help you find the technology." },
    ],
  }),
  component: Finder,
});

const businessTypes = [
  "Agriculture",
  "Food Processing",
  "Retail",
  "Textile",
  "Manufacturing",
  "Services",
];

type Answers = {
  businessType: string;
  location: string;
  stage: string;
  problem: string;
  bill: string;
  outages: string;
  hours: string;
  diesel: string;
  storage: string;
  budget: string;
};

const empty: Answers = {
  businessType: "",
  location: "",
  stage: "Existing business",
  problem: "",
  bill: "",
  outages: "",
  hours: "",
  diesel: "",
  storage: "",
  budget: "",
};

function Finder() {
  const search = Route.useSearch();
  const story = stories.find((s) => s.slug === search.story);
  const [step, setStep] = useState(search.problem ? 1 : 0);
  const [answers, setAnswers] = useState<Answers>({
    ...empty,
    problem: search.problem ?? "",
    businessType: story?.business ?? "",
    location: story?.location ?? "",
  });

  const set = (k: keyof Answers, v: string) => setAnswers((a) => ({ ...a, [k]: v }));
  const total = 4;

  const recommendations = useMemo(() => score(answers), [answers]);

  return (
    <>
      <PageHeader
        eyebrow="Assessment"
        title={story ? "Let's find the right solution for you." : "Find my solution"}
        intro={
          story
            ? `We've pre-filled some details from ${story.person}'s story. Adjust anything that doesn't match your business.`
            : "Four short steps. We only ask what is relevant to your problem."
        }
      />

      <div className="container-page max-w-3xl py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-1 flex-1 bg-border">
            <div
              className="h-1 bg-primary transition-all duration-300"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Step {Math.min(step + 1, total)} of {total}
          </span>
        </div>

        {step === 0 && (
          <Step title="Tell us about your business">
            <Field label="Business type">
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((b) => (
                  <Choice key={b} active={answers.businessType === b} onClick={() => set("businessType", b)}>
                    {b}
                  </Choice>
                ))}
              </div>
            </Field>
            <Field label="Location (district, state)">
              <input
                className="w-full border border-input bg-card px-3 py-2.5 text-base outline-none focus:border-primary"
                value={answers.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Vizianagaram, Andhra Pradesh"
              />
            </Field>
            <Field label="Business stage">
              <div className="flex flex-wrap gap-2">
                {["Existing business", "New business"].map((s) => (
                  <Choice key={s} active={answers.stage === s} onClick={() => set("stage", s)}>
                    {s}
                  </Choice>
                ))}
              </div>
            </Field>
          </Step>
        )}

        {step === 1 && (
          <Step title="What problem are you facing?">
            <div className="grid gap-2 sm:grid-cols-2">
              {problems.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set("problem", p.id)}
                  className={`border p-4 text-left transition-colors ${
                    answers.problem === p.id ? "border-primary bg-ivory" : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="block font-medium">{p.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{p.blurb}</span>
                </button>
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="A few details about your situation">
            {["energy-cost", "power-cuts", "diesel"].includes(answers.problem) && (
              <Field label="Monthly electricity expense">
                <Options
                  value={answers.bill}
                  onChange={(v) => set("bill", v)}
                  items={["Under ₹5,000", "₹5,000–20,000", "₹20,000–75,000", "Above ₹75,000"]}
                />
              </Field>
            )}
            {["power-cuts", "diesel"].includes(answers.problem) && (
              <Field label="How often does power fail?">
                <Options
                  value={answers.outages}
                  onChange={(v) => set("outages", v)}
                  items={["Rarely", "A few times a week", "Daily, under 2 hours", "Daily, more than 2 hours"]}
                />
              </Field>
            )}
            {answers.problem === "diesel" && (
              <Field label="Monthly diesel expense">
                <Options
                  value={answers.diesel}
                  onChange={(v) => set("diesel", v)}
                  items={["None", "Under ₹10,000", "₹10,000–50,000", "Above ₹50,000"]}
                />
              </Field>
            )}
            {["spoilage", "cooling"].includes(answers.problem) && (
              <Field label="How much do you need to store or cool?">
                <Options
                  value={answers.storage}
                  onChange={(v) => set("storage", v)}
                  items={["Under 500 kg / litres", "500 kg – 2 tonnes", "2–10 tonnes", "More than 10 tonnes"]}
                />
              </Field>
            )}
            <Field label="Operating hours">
              <Options
                value={answers.hours}
                onChange={(v) => set("hours", v)}
                items={["Daytime only", "Extended into evening", "Round the clock"]}
              />
            </Field>
            <Field label="Indicative budget">
              <Options
                value={answers.budget}
                onChange={(v) => set("budget", v)}
                items={["Under ₹1 lakh", "₹1–3 lakh", "₹3–8 lakh", "Above ₹8 lakh", "Not decided"]}
              />
            </Field>
          </Step>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-2xl font-semibold">Your DRE recommendations</h2>
            <p className="mt-2 text-muted-foreground">
              Based on your answers. Every recommendation shows why it was suggested — confirm suitability with a
              provider site assessment.
            </p>
            <div className="mt-8 space-y-6">
              {recommendations.map((r) => (
                <article key={r.slug} className="border border-border bg-card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">{r.name}</h3>
                    <span
                      className={`text-xs font-medium uppercase tracking-[0.12em] ${
                        r.verdict === "Highly suitable"
                          ? "text-primary"
                          : r.verdict === "Suitable"
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {r.verdict}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Why this was recommended:</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {r.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-4 text-sm">
                    <Link
                      to="/solutions/$slug"
                      params={{ slug: r.slug }}
                      className="font-medium text-primary hover:underline"
                    >
                      About this solution
                    </Link>
                    <Link to="/providers" className="text-muted-foreground hover:text-primary">
                      Find providers
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 border border-border bg-ivory p-6">
              <h3 className="font-semibold">Want providers to come to you?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Post your requirement as an open need and relevant providers can respond.
              </p>
              <Link
                to="/needs"
                className="mt-4 inline-block bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
              >
                Post your requirement
              </Link>
            </div>
          </section>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={(step === 0 && !answers.businessType) || (step === 1 && !answers.problem)}
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep disabled:opacity-40"
            >
              Continue <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-6 space-y-7">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 text-sm transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"
      }`}
    >
      {children}
    </button>
  );
}

function Options({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <Choice key={i} active={value === i} onClick={() => onChange(i)}>
          {i}
        </Choice>
      ))}
    </div>
  );
}

type Rec = { slug: string; name: string; verdict: string; reasons: string[]; points: number };

// Transparent rule-based scoring. Structured now, extendable later.
function score(a: Answers): Rec[] {
  const recs: Rec[] = [];
  const push = (slug: string, points: number, reasons: string[]) => {
    const sol = solutions.find((s) => s.slug === slug);
    if (!sol) return;
    const existing = recs.find((r) => r.slug === slug);
    if (existing) {
      existing.points += points;
      existing.reasons.push(...reasons);
      return;
    }
    recs.push({ slug, name: sol.name, verdict: "", reasons, points });
  };

  const p = a.problem as ProblemId;
  const heavyOutage = a.outages.startsWith("Daily");
  const highBill = a.bill === "₹20,000–75,000" || a.bill === "Above ₹75,000";

  if (p === "power-cuts") push("solar-battery", 3, ["Frequent power interruptions reported"]);
  if (p === "energy-cost") push("solar-pv", 3, ["Reducing electricity cost is the primary goal"]);
  if (p === "diesel") {
    push("solar-battery", 2, ["Diesel is being used to cover supply gaps"]);
    push("solar-pumps", 1, ["Diesel pumping is a common cost to replace"]);
  }
  if (p === "spoilage") push("cold-storage", 3, ["Losses are occurring before sale"]);
  if (p === "cooling") push("cold-storage", 3, ["Storage and cooling is the stated requirement"]);
  if (p === "processing") push("processing-equipment", 3, ["Processing capacity is the bottleneck"]);
  if (p === "mobility") push("e-mobility", 3, ["Delivery and mobility cost is the stated problem"]);
  if (p === "new-business") {
    push("solar-drying", 2, ["A viable entry-level DRE enterprise"]);
    push("cold-storage", 1, ["Storage as a service works where cooling is scarce"]);
  }
  if (p === "spoilage") push("solar-drying", 2, ["Drying can convert surplus into a storable product"]);

  if (heavyOutage) push("solar-battery", 2, ["Outages occur daily"]);
  if (highBill) push("solar-pv", 2, ["Significant monthly energy consumption"]);
  if (a.hours === "Round the clock") push("energy-storage", 1, ["Continuous operation requirement"]);
  if (a.hours === "Daytime only") push("solar-pv", 1, ["Daytime load matches solar generation well"]);
  if (a.businessType === "Textile") push("textile-manufacturing", 1, ["Common setup for textile units"]);

  recs.sort((x, y) => y.points - x.points);
  return recs.slice(0, 4).map((r) => ({
    ...r,
    reasons: [...new Set(r.reasons)],
    verdict: r.points >= 4 ? "Highly suitable" : r.points >= 2 ? "Suitable" : "Consider",
  }));
}
