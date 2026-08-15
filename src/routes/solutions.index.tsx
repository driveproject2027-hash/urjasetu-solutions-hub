import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";
import { solutions } from "../data/catalog";

export const Route = createFileRoute("/solutions/")({
  head: () => ({
    meta: [
      { title: "Explore DRE Solutions — UrjaSethu" },
      {
        name: "description",
        content:
          "Solar PV, solar plus battery, cold chain, solar drying, processing, e-mobility, pumps and waste-to-fuel — matched to real business problems.",
      },
      { property: "og:title", content: "Explore DRE Solutions — UrjaSethu" },
      {
        property: "og:description",
        content: "Decentralised renewable energy solutions for Indian MSMEs and rural enterprises.",
      },
    ],
  }),
  component: SolutionsIndex,
});

function SolutionsIndex() {
  const categories = [...new Set(solutions.map((s) => s.category))];

  return (
    <>
      <PageHeader
        eyebrow="Solution directory"
        title="Explore DRE solutions"
        intro="Each solution starts from a problem it solves — not from the technology itself."
      />
      <div className="container-page py-14">
        {categories.map((cat) => (
          <section key={cat} className="mb-14">
            <h2 className="border-b border-border pb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {cat}
            </h2>
            <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {solutions
                .filter((s) => s.category === cat)
                .map((s) => (
                  <article key={s.slug} className="border border-border bg-card p-6">
                    <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                    <ul className="mt-4 space-y-1 text-sm">
                      {s.solves.slice(0, 2).map((x) => (
                        <li key={x} className="text-foreground/80">
                          — {x}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex gap-4 text-sm">
                      <Link
                        to="/solutions/$slug"
                        params={{ slug: s.slug }}
                        className="font-medium text-primary hover:underline"
                      >
                        Read more
                      </Link>
                      <Link to="/providers" className="text-muted-foreground hover:text-primary">
                        Find providers
                      </Link>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
