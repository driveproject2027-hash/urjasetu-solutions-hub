import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import storyCold from "../assets/story-cold.jpg";
import storyDryer from "../assets/story-dryer.jpg";
import storyTextile from "../assets/hero-textile.jpg";
import { problems, stories } from "../data/catalog";
import { fetchPublishedStories, submitStory } from "../lib/db";

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

type PublishedStory = {
  id: string;
  title: string;
  business_name: string | null;
  sector: string | null;
  location: string | null;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
};

function StoriesIndex() {
  const [published, setPublished] = useState<PublishedStory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [business, setBusiness] = useState("");

  useEffect(() => {
    fetchPublishedStories()
      .then((rows) => setPublished((rows ?? []) as unknown as PublishedStory[]))
      .catch(() => undefined);
  }, []);

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
        <div className="mb-10 border border-border bg-ivory p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Share your own story</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us what problem you faced and what changed. Stories are published only after review and your consent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {showForm ? "Close" : "Submit your story"}
            </button>
          </div>
          {showForm && (
            <form
              className="mt-6 grid gap-4 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                setBusy(true);
                submitStory({
                  title: String(fd.get("stitle") ?? ""),
                  business_name: String(fd.get("sbusiness") ?? ""),
                  sector: String(fd.get("ssector") ?? ""),
                  location: String(fd.get("slocation") ?? ""),
                  problem: String(fd.get("sproblem") ?? ""),
                  solution: String(fd.get("ssolution") ?? ""),
                  outcome: String(fd.get("soutcome") ?? ""),
                  contact_email: String(fd.get("semail") ?? ""),
                })
                  .then(() => {
                    form.reset();
                    setShowForm(false);
                    toast.success("Story submitted", { description: "Our team will review it before publishing." });
                  })
                  .catch((err: Error) => toast.error("Could not submit", { description: err.message }))
                  .finally(() => setBusy(false));
              }}
            >
              <input name="stitle" required placeholder="Headline" aria-label="Headline" className="border border-input bg-background px-3 py-2.5 text-base" />
              <input name="sbusiness" placeholder="Business name" aria-label="Business name" className="border border-input bg-background px-3 py-2.5 text-base" />
              <input name="ssector" placeholder="Sector" aria-label="Sector" className="border border-input bg-background px-3 py-2.5 text-base" />
              <input name="slocation" placeholder="District, state" aria-label="Location" className="border border-input bg-background px-3 py-2.5 text-base" />
              <textarea name="sproblem" rows={3} placeholder="The problem you faced" aria-label="Problem" className="border border-input bg-background px-3 py-2.5 text-base md:col-span-2" />
              <textarea name="ssolution" rows={3} placeholder="What you did about it" aria-label="Solution" className="border border-input bg-background px-3 py-2.5 text-base md:col-span-2" />
              <textarea name="soutcome" rows={3} placeholder="What changed afterwards" aria-label="Outcome" className="border border-input bg-background px-3 py-2.5 text-base md:col-span-2" />
              <input name="semail" type="email" placeholder="Contact email" aria-label="Contact email" className="border border-input bg-background px-3 py-2.5 text-base" />
              <button
                type="submit"
                disabled={busy}
                className="bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-forest-deep disabled:opacity-60 md:col-span-2 md:justify-self-start"
              >
                Submit story
              </button>
            </form>
          )}
        </div>

        {published.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-display text-xl font-semibold">Published stories</h2>
            <ul className="divide-y divide-border border-y border-border">
              {published.map((p) => (
                <li key={p.id} className="py-6">
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[p.business_name, p.sector, p.location].filter(Boolean).join(" · ")}
                  </p>
                  {p.problem && <p className="mt-3 text-base text-foreground/85">{p.problem}</p>}
                  {p.solution && <p className="mt-2 text-base text-foreground/85">{p.solution}</p>}
                  {p.outcome && <p className="mt-2 text-base text-foreground/85">{p.outcome}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

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
