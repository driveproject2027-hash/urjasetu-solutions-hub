import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  Factory,
  Fuel,
  Leaf,
  Snowflake,
  Sprout,
  Truck,
  Zap,
} from "lucide-react";

import heroImg from "../assets/hero-textile.jpg";
import storyDryer from "../assets/story-dryer.jpg";
import storyCold from "../assets/story-cold.jpg";
import storyTextile from "../assets/hero-textile.jpg";
import solarImg from "../assets/solutions-solar.jpg";
import { openNeeds, opportunities, problems, solutions, stories } from "../data/catalog";
import { t } from "../lib/i18n";

const homeFaqs = [
  {
    question: "What is UrjaSethu?",
    answer:
      "UrjaSethu is an Indian platform that connects businesses with decentralised renewable energy (DRE) solutions, solution providers, finance providers and network partners. A business describes its problem — high energy bills, power cuts, diesel dependence, spoilage — and the platform points to suitable solutions and providers.",
  },
  {
    question: "What is decentralised renewable energy?",
    answer:
      "Decentralised renewable energy means generating and using clean energy close to where it is consumed, instead of drawing everything from the central grid. Typical examples are rooftop solar, solar plus battery systems, solar drying, solar-powered cold rooms, biomass processing and solar pumps.",
  },
  {
    question: "Who can use UrjaSethu?",
    answer:
      "MSMEs, farmer producer organisations, rural enterprises and entrepreneurs across India, along with solution providers, finance providers and ecosystem partners who want to serve them.",
  },
  {
    question: "How does UrjaSethu connect businesses with solution providers?",
    answer:
      "A business starts with Find My Solution, answers a short set of questions and receives suitable DRE solution categories. From there it can browse verified providers, request quotes and compare responses, or post an open need that providers respond to.",
  },
  {
    question: "How can businesses finance a DRE project in India?",
    answer:
      "Common routes are own funds, term loans from banks and NBFCs, equipment leasing, and support schemes referenced on the Finance page such as MSE GIFT, MSE SPICE, PMFME, PMEGP and ZED. Eligibility and terms change, so verify each scheme on its official source before applying.",
  },
  {
    question: "How can a provider or partner join UrjaSethu?",
    answer:
      "Through Join Us, which has separate onboarding for solution providers, finance providers and network partners. Each application is reviewed before a public listing goes live.",
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrjaSethu — Find the right DRE solution for your business" },
      {
        name: "description",
        content:
          "UrjaSethu connects Indian businesses with decentralised renewable energy solutions and verified providers. Start with your problem, get a recommendation, compare providers.",
      },
      { property: "og:title", content: "UrjaSethu — DRE Solutions & Business Platform" },
      {
        property: "og:description",
        content:
          "Start with the problem. Discover suitable renewable-energy solutions and connect with providers across India.",
      },
      { property: "og:url", content: "https://urjasethu.dev/" },
      { property: "og:image", content: "https://urjasethu.dev/og-image.jpg" },
      { name: "twitter:image", content: "https://urjasethu.dev/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://urjasethu.dev/" }],
  }),
  component: Home,
});

const problemIcons: Record<string, typeof Zap> = {
  "energy-cost": Zap,
  "power-cuts": BatteryCharging,
  diesel: Fuel,
  spoilage: Sprout,
  processing: Factory,
  cooling: Snowflake,
  mobility: Truck,
  "new-business": Leaf,
};

const storyImages: Record<string, string> = {
  textile: storyTextile,
  dryer: storyDryer,
  cold: storyCold,
};

const journey = [
  "Problem",
  "Assess",
  "Recommend",
  "Discover",
  "Match",
  "Connect",
  "Quote",
  "Compare",
  "Book",
  "Grow",
];

function Home() {
  const lead = stories[0]!;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-ivory">
        <div className="container-page grid items-stretch gap-0 md:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center py-14 pr-0 md:py-24 md:pr-14">
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1 className="mt-4 max-w-xl text-[2.1rem] font-semibold leading-[1.1] text-foreground md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("hero.body")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/find-my-solution"
                className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
              >
                {t("hero.cta")} <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/solutions"
                className="border border-foreground/25 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/60"
              >
                {t("hero.secondary")}
              </Link>
            </div>
            <Link
              to="/join-us"
              className="mt-6 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
            >
              {t("hero.provider")} <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="relative -mx-5 md:mx-0">
            <img
              src={heroImg}
              alt="A woman entrepreneur running a solar-powered stitching unit in rural India"
              width={1408}
              height={1200}
              className="h-56 w-full object-cover sm:h-72 md:h-full"
            />

            {/* Story overlay — inline below the image on mobile, floating on the image from md up */}
            <Link
              to="/stories/$slug"
              params={{ slug: lead.slug }}
              className="block border-b border-border bg-ivory px-5 py-5 md:absolute md:bottom-8 md:left-8 md:z-10 md:max-w-md md:rounded-md md:border md:border-white/30 md:bg-white/70 md:p-4 md:shadow-md md:backdrop-blur-md md:hover:shadow-lg"
              aria-label={`Read story: ${lead.headline}`}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-amber">Demo story</p>
              <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground md:text-lg">
                “{lead.headline}”
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{lead.person} · {lead.role} · {lead.location}</p>
              <p className="mt-3 text-sm text-foreground/90">{lead.problem}</p>

              <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                I have a similar problem <ArrowRight className="size-3" />
              </span>
            </Link>

          </div>

        </div>
      </section>

      {/* Problem-first grid */}
      <section className="border-b border-border">
        <div className="container-page py-12 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold md:text-3xl">{t("problems.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("problems.sub")}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => {
              const Icon = problemIcons[p.id] ?? Zap;
              return (
                <Link
                  key={p.id}
                  to="/find-my-solution"
                  search={{ problem: p.id }}
                  className="group bg-background p-6 transition-colors hover:bg-ivory"
                >
                  <Icon className="size-5 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-4 text-base font-semibold">{p.label}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Start here <ArrowRight className="size-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-forest-deep text-ivory">
        <div className="container-page py-14">
          <p className="text-[0.72rem] uppercase tracking-[0.14em] text-ivory/60">How UrjaSethu works</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold md:text-3xl">
            One path, from a real problem to a completed project.
          </h2>
          <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {journey.map((step, i) => (
              <li key={step} className="flex items-center gap-2 text-sm text-ivory/90">
                <span className="text-xs text-ivory/50">{String(i + 1).padStart(2, "0")}</span>
                {step}
                {i < journey.length - 1 && <span className="text-ivory/30">/</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stories */}
      <section className="border-b border-border">
        <div className="container-page py-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold md:text-3xl">{t("stories.title")}</h2>
              <p className="mt-3 text-muted-foreground">{t("stories.sub")}</p>
            </div>
            <Link to="/stories" className="text-sm font-medium text-primary hover:underline">
              Explore business stories →
            </Link>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <article className="group">
              <Link to="/stories/$slug" params={{ slug: lead.slug }} className="block overflow-hidden">
                <img
                  src={storyImages[lead.image]}
                  alt={lead.headline}
                  loading="lazy"
                  width={1408}
                  height={1200}
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] md:h-96"
                />
              </Link>
              <p className="mt-5 text-xs uppercase tracking-[0.14em] text-amber">Demo story</p>
              <h3 className="mt-2 font-display text-xl font-semibold md:text-2xl">
                “{lead.headline}”
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {lead.person} · {lead.role} · {lead.location}
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed">{lead.problem}</p>
              <Link
                to="/find-my-solution"
                search={{ problem: lead.problemId, story: lead.slug }}
                className="mt-5 inline-flex items-center gap-2 border border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                I have a similar problem <ArrowRight className="size-4" />
              </Link>
            </article>

            <div className="divide-y divide-border rule-top">
              {stories.slice(1).map((s) => (
                <Link
                  key={s.slug}
                  to="/stories/$slug"
                  params={{ slug: s.slug }}
                  className="flex gap-4 py-5 first:pt-6"
                >
                  <img
                    src={storyImages[s.image]}
                    alt=""
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-20 w-24 shrink-0 object-cover"
                  />
                  <div>
                    <h3 className="font-display text-base font-semibold leading-snug">“{s.headline}”</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.person} · {s.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions — asymmetric */}
      <section className="border-b border-border bg-ivory">
        <div className="container-page py-12 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">Explore DRE solutions</h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Technology matched to what your business actually needs — generation, storage, cooling,
                processing and mobility.
              </p>
              <img
                src={solarImg}
                alt="Technicians installing rooftop solar on a small factory"
                loading="lazy"
                width={1200}
                height={900}
                className="mt-8 h-56 w-full object-cover"
              />
            </div>
            <ul className="divide-y divide-border border-y border-border">
              {solutions.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/solutions/$slug"
                    params={{ slug: s.slug }}
                    className="group flex items-baseline justify-between gap-6 py-4 transition-colors hover:text-primary"
                  >
                    <span>
                      <span className="font-display text-lg font-medium">{s.name}</span>
                      <span className="mt-1 block max-w-md text-sm text-muted-foreground">{s.summary}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Open needs */}
      <section className="border-b border-border">
        <div className="container-page py-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">{t("needs.title")}</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Active demand posted by businesses. Providers respond directly.
              </p>
            </div>
            <Link to="/needs" className="text-sm font-medium text-primary hover:underline">
              View all open needs →
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {openNeeds.slice(0, 3).map((n) => (
              <li key={n.id} className="flex flex-col items-start gap-3 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <h3 className="font-medium">{n.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {n.business} · {n.location} · Budget {n.budget}
                  </p>
                </div>
                <Link
                  to="/needs"
                  className="border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  Respond to this need
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Calculator + opportunities */}
      <section className="border-b border-border bg-ivory">
        <div className="container-page grid gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">What could solar look like for your business?</h2>
            <p className="mt-3 text-muted-foreground">
              A quick indicative estimate of system size, generation, savings and payback. Estimates only —
              always confirm with a provider site assessment.
            </p>
            <Link
              to="/calculator"
              className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
            >
              Open the solar calculator <ArrowRight className="size-4" />
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Start a DRE business</h2>
            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {opportunities.map((o) => (
                <li key={o.slug}>
                  <Link to="/opportunities" className="hover:text-primary">
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/opportunities" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
              Explore opportunities →
            </Link>
          </div>
        </div>
      </section>

      {/* Providers + DRIVE */}
      <section className="border-b border-border">
        <div className="container-page grid gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Find DRE providers</h2>
            <p className="mt-3 text-muted-foreground">
              Search installers, manufacturers and service providers by technology, industry and service area.
            </p>
            <Link to="/providers" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
              Browse the provider directory →
            </Link>
          </div>
          <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="eyebrow">Institutional</p>
            <h2 className="mt-3 text-xl font-semibold">The DRIVE initiative</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              UrjaSethu is developed under DRIVE — Decentralised Renewable Energy Innovation for Vibrant
              Enterprises — an initiative supporting MSMEs and rural enterprises to adopt clean energy.
            </p>
            <Link to="/about" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
              About DRIVE →
            </Link>
          </div>
        </div>
      </section>

      {/* Common questions — plain answers for people and answer engines */}
      <section className="border-b border-border bg-ivory">
        <div className="container-page py-12 md:py-20">
          <h2 className="text-2xl font-semibold md:text-3xl">Common questions about UrjaSethu and DRE</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {homeFaqs.map((f) => (
              <div key={f.question}>
                <dt className="font-display text-base font-semibold">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground/85">{f.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-muted-foreground">
            More background in the{" "}
            <Link to="/resources" className="text-primary underline underline-offset-4">
              DRE knowledge centre
            </Link>
            , or read about{" "}
            <Link to="/financing" className="text-primary underline underline-offset-4">
              financing options for renewable energy projects
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA block */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page flex flex-col items-start gap-6 py-12 md:flex-row md:flex-wrap md:items-center md:justify-between md:py-14">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Don't start with technology. Start with the problem.</h2>
            <p className="mt-2 max-w-xl text-primary-foreground/80">
              Tell us what is holding your business back and we'll take it from there.
            </p>
          </div>
          <Link
            to="/find-my-solution"
            className="bg-ivory px-6 py-3 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
          >
            Find My Solution
          </Link>
        </div>
      </section>
    </>
  );
}
