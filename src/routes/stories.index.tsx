import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageHeader } from "../components/site/PageHeader";
import storyCold from "../assets/story-cold.jpg";
import storyDryer from "../assets/story-dryer.jpg";
import storyTextile from "../assets/hero-textile.jpg";
import { problems, stories } from "../data/catalog";

export const Route = createFileRoute("/stories/")({
  head: () => ({
    meta: [
      { title: "Business Stories — real problems, real DRE journeys | UrjaSetu" },
      {
        name: "description",
        content:
          "Indian business owners describe the problem they faced, what they needed, and the decentralised renewable energy journey that followed.",
      },
      { property: "og:title", content: "Business Stories — UrjaSetu" },
      { property: "og:description", content: "Every DRE journey starts with a real problem." },
    ],
  }),
  component: StoriesIndex,
});

const images: Record<string, string> = { textile: storyTextile, dryer: storyDryer, cold: storyCold };

function StoriesIndex() {
  const [problem, setProblem] = useState("");
  const [business, setBusiness] = useState("");

  const businesses = [...new Set(stories.map((s) => s.business))];
  const list = useMemo(
    () =>
      stories.filter(
        (s) => (!problem || s.problemId === problem) && (!business || s.business === business),
      ),
    [problem, business],
  );

  return (
    <>
      <PageHeader
        eyebrow="Business stories"
        title="Real businesses. Real problems."
        intro="Every DRE journey starts with a real problem. These are demo stories written to show the format — published stories require the person's consent."
      />

      <div className="container-page py-12">
        <div className="flex flex-wrap gap-4 border-b border-border pb-6">
          <div>
            <label htmlFor="fp" className="mb-1.5 block text-sm font-medium">
              Problem
            </label>
            <select
              id="fp"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="border border-input bg-card px-3 py-2.5 text-base"
            >
              <option value="">All problems</option>
              {problems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fb" className="mb-1.5 block text-sm font-medium">
              Business
            </label>
            <select
              id="fb"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="border border-input bg-card px-3 py-2.5 text-base"
            >
              <option value="">All businesses</option>
              {businesses.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          {list.map((s) => (
            <article key={s.slug} className="group">
              <Link to="/stories/$slug" params={{ slug: s.slug }} className="block overflow-hidden">
                <img
                  src={images[s.image]}
                  alt={s.headline}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-amber">Demo story</p>
              <h2 className="mt-2 font-display text-xl font-semibold leading-snug">
                <Link to="/stories/$slug" params={{ slug: s.slug }} className="hover:text-primary">
                  “{s.headline}”
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {s.person} · {s.role} · {s.location}
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/85">{s.problem}</p>
              <Link
                to="/find-my-solution"
                search={{ problem: s.problemId, story: s.slug }}
                className="mt-4 inline-block border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                I have a similar problem
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
