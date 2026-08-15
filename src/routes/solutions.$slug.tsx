import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { openNeeds, providers, solutions, stories } from "../data/catalog";

export const Route = createFileRoute("/solutions/$slug")({
  loader: ({ params }) => {
    const solution = solutions.find((s) => s.slug === params.slug);
    if (!solution) throw notFound();
    return { solution };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Solution unavailable — UrjaSethu" }, { name: "robots", content: "noindex" }] };
    }
    const { solution } = loaderData;
    return {
      meta: [
        { title: `${solution.name} — DRE Solutions | UrjaSethu` },
        { name: "description", content: solution.summary },
        { property: "og:title", content: `${solution.name} — UrjaSethu` },
        { property: "og:description", content: solution.summary },
      ],
    };
  },
  component: SolutionPage,
});

function SolutionPage() {
  const { solution } = Route.useLoaderData();
  const related = providers.filter((p) => p.technologies.some((t) => solution.name.startsWith(t.split(" ")[0] ?? t)));
  const relatedStories = stories.filter((s) => s.solutionSlug === solution.slug);
  const relatedNeeds = openNeeds.filter((n) => solution.name.toLowerCase().includes((n.looking.toLowerCase().split(" ")[0] ?? "")));

  return (
    <article>
      <header className="border-b border-border bg-ivory">
        <div className="container-page py-14 md:py-20">
          <p className="eyebrow">{solution.category}</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-[2.6rem]">{solution.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{solution.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/providers"
              className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
            >
              Find providers
            </Link>
            <Link
              to="/find-my-solution"
              search={{ problem: solution.problems[0] }}
              className="border border-foreground/25 px-5 py-3 text-sm font-medium hover:border-foreground/60"
            >
              I have this problem
            </Link>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <Block title="What is it?">
            <p>{solution.what}</p>
          </Block>
          <Block title="What problem does it solve?">
            <List items={solution.solves} />
          </Block>
          <Block title="Who is it for?">
            <List items={solution.who} />
          </Block>
          <Block title="How does it work?">
            <p>{solution.how}</p>
          </Block>
          <div className="grid gap-10 sm:grid-cols-2">
            <Block title="Benefits">
              <List items={solution.benefits} />
            </Block>
            <Block title="Limitations and trade-offs">
              <List items={solution.limits} />
            </Block>
          </div>
          <Block title="Typical applications">
            <p>{solution.applications.join(" · ")}</p>
          </Block>
        </div>

        <aside className="space-y-8 lg:border-l lg:border-border lg:pl-10">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Relevant providers
            </h2>
            <ul className="mt-4 space-y-3">
              {(related.length ? related : providers.slice(0, 2)).map((p) => (
                <li key={p.id}>
                  <Link to="/providers/$id" params={{ id: p.id }} className="text-sm font-medium hover:text-primary">
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {p.city}, {p.state}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {relatedStories.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Related business stories
              </h2>
              <ul className="mt-4 space-y-3">
                {relatedStories.map((s) => (
                  <li key={s.slug}>
                    <Link to="/stories/$slug" params={{ slug: s.slug }} className="text-sm hover:text-primary">
                      “{s.headline}”
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {relatedNeeds.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Open customer needs
              </h2>
              <ul className="mt-4 space-y-3">
                {relatedNeeds.map((n) => (
                  <li key={n.id} className="text-sm">
                    <Link to="/needs" className="hover:text-primary">
                      {n.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{n.location}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-base leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((i) => (
        <li key={i} className="border-l-2 border-border pl-3">
          {i}
        </li>
      ))}
    </ul>
  );
}
