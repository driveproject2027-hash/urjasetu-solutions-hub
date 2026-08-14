import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";
import { resourceCategories } from "../data/resources";
import { solutions, opportunities, stories } from "../data/catalog";

export const Route = createFileRoute("/resources/$category")({
  loader: ({ params }) => {
    const category = resourceCategories.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Resource not found — UrjaSetu" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    const description = `${category.tagline} ${category.intro}`.slice(0, 155);
    return {
      meta: [
        { title: `${category.name} — Resources | UrjaSetu` },
        { name: "description", content: description },
        { property: "og:title", content: `${category.name} — UrjaSetu Resources` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();

  return (
    <>
      <PageHeader eyebrow="Resources" title={category.name} intro={category.intro}>
        <Link to="/resources" className="text-sm text-primary underline underline-offset-4">
          Back to all resources
        </Link>
      </PageHeader>

      <div className="container-page py-12">
        {category.articles.length > 0 && (
          <div className="space-y-12">
            {category.articles.map((a) => (
              <article key={a.slug} id={a.slug} className="border-t border-border pt-6">
                <h2 className="font-display text-2xl font-semibold">{a.title}</h2>
                <p className="mt-2 max-w-2xl text-base text-muted-foreground">{a.summary}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {a.body.map((b) => (
                    <section key={b.heading}>
                      <h3 className="font-display text-base font-semibold">{b.heading}</h3>
                      <p className="mt-1 text-base text-foreground/85">{b.text}</p>
                    </section>
                  ))}
                </div>
                {(a.source || a.updated) && (
                  <p className="mt-6 text-sm text-muted-foreground">
                    {a.source && (
                      <>
                        Official source:{" "}
                        <a
                          href={a.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-4"
                        >
                          {a.source.label}
                        </a>
                        {a.updated ? " · " : ""}
                      </>
                    )}
                    {a.updated && <>Last updated: {a.updated}</>}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {category.slug === "dre-technologies" && (
          <div className="grid gap-px border border-border bg-border md:grid-cols-2">
            {solutions.map((s) => (
              <Link
                key={s.slug}
                to="/solutions/$slug"
                params={{ slug: s.slug }}
                className="group bg-background p-7 hover:bg-ivory"
              >
                <p className="eyebrow">{s.category}</p>
                <h2 className="mt-2 font-display text-lg font-semibold group-hover:text-primary">{s.name}</h2>
                <p className="mt-2 text-base text-foreground/85">{s.summary}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  What it solves, who it suits, how it works, advantages, limitations and what to ask a provider.
                </p>
              </Link>
            ))}
          </div>
        )}

        {category.slug === "business-opportunities" && (
          <div className="grid gap-px border border-border bg-border md:grid-cols-2">
            {opportunities.map((o) => (
              <article key={o.slug} className="bg-background p-7">
                <h2 className="font-display text-lg font-semibold">{o.title}</h2>
                <dl className="mt-4 space-y-3 text-base">
                  <div>
                    <dt className="text-sm text-muted-foreground">Problem addressed</dt>
                    <dd className="text-foreground/85">{o.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">The opportunity</dt>
                    <dd className="text-foreground/85">{o.opportunity}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Who may consider it</dt>
                    <dd className="text-foreground/85">{o.users}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Technology involved</dt>
                    <dd className="text-foreground/85">{o.tech}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Before you start, ask</dt>
                    <dd className="text-foreground/85">
                      Who are the paying customers nearby? What does the equipment cost, installed? Who services it?
                      How will the first year be financed?
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}

        {category.slug === "case-studies" && (
          <ul className="divide-y divide-border border-y border-border">
            {stories.map((s) => (
              <li key={s.slug} className="py-6">
                <Link
                  to="/stories/$slug"
                  params={{ slug: s.slug }}
                  className="font-display text-lg font-semibold hover:text-primary"
                >
                  {s.headline}
                  <span className="mt-1 block text-sm font-normal text-muted-foreground">
                    {s.person} · {s.business} · {s.location}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}


        {category.slug === "business-opportunities" && (
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            No income, return or outcome is guaranteed. Viability depends on local demand, costs and your own capacity.
          </p>
        )}
      </div>
    </>
  );
}
