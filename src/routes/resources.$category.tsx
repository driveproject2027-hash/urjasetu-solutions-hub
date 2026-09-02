import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "../components/site/PageHeader";
import { Breadcrumbs } from "../components/site/Breadcrumbs";
import { resourceCategories } from "../data/resources";
import { OG_IMAGE, absoluteUrl, breadcrumbLd } from "../lib/seo";
import { solutions, opportunities, stories } from "../data/catalog";
import { fetchPublishedResources } from "../lib/db";

export const Route = createFileRoute("/resources/$category")({
  loader: ({ params }) => {
    const category = resourceCategories.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Resource not found — UrjaSethu" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    const description = `${category.tagline} ${category.intro}`.slice(0, 155);
    return {
      meta: [
        { title: `${category.name} — Resources | UrjaSethu` },
        { name: "description", content: description },
        { property: "og:title", content: `${category.name} — UrjaSethu Resources` },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(`/resources/${category.slug}`) },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(`/resources/${category.slug}`) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Resources", path: "/resources" },
              { name: category.name, path: `/resources/${category.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const [published, setPublished] = useState<PublishedResource[] | null>(null);

  useEffect(() => {
    fetchPublishedResources(category.slug)
      .then((rows) => setPublished(rows as PublishedResource[]))
      .catch(() => setPublished([]));
  }, [category.slug]);

  const articles = published === null ? category.articles : published;

  return (
    <>
      <PageHeader eyebrow="Resources" title={category.name} intro={category.intro}>
        <Breadcrumbs
          items={[{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }, { name: category.name }]}
        />
        <Link to="/resources" className="text-sm text-primary underline underline-offset-4">
          Back to all resources
        </Link>
      </PageHeader>

      <div className="container-page py-12">
        {articles.length > 0 && (
          <div className="space-y-12">
            {articles.map((a) => (
              <article key={a.id ?? a.slug} id={a.slug} className="border-t border-border pt-6">
                <h2 className="font-display text-2xl font-semibold">{a.title}</h2>
                <p className="mt-2 max-w-2xl text-base text-muted-foreground">{a.summary}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {articleSections(a).map((b) => (
                    <section key={b.heading}>
                      <h3 className="font-display text-base font-semibold">{b.heading}</h3>
                      <p className="mt-1 text-base text-foreground/85">{b.text}</p>
                    </section>
                  ))}
                </div>
                {(a.source || a.source_name || a.updated) && (
                  <p className="mt-6 text-sm text-muted-foreground">
                    {(a.source || a.source_name) && (
                      <>
                        Official source:{" "}
                        <a
                          href={a.source?.url ?? a.source_url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-4"
                        >
                          {a.source?.label ?? a.source_name}
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

type PublishedResource = {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  source_name: string | null;
  source_url: string | null;
  slug?: string;
  source?: { label: string; url: string };
  updated?: string;
};

function articleSections(article: PublishedResource | (typeof resourceCategories)[number]["articles"][number]) {
  if (Array.isArray(article.body)) return article.body;
  return (article.body ?? "")
    .split("\n\n")
    .filter(Boolean)
    .map((section) => {
      const [heading, ...text] = section.split("\n");
      return { heading, text: text.join(" ") };
    });
}
