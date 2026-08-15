import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import storyCold from "../assets/story-cold.jpg";
import storyDryer from "../assets/story-dryer.jpg";
import storyTextile from "../assets/hero-textile.jpg";
import { solutions, stories } from "../data/catalog";

const images: Record<string, string> = { textile: storyTextile, dryer: storyDryer, cold: storyCold };

export const Route = createFileRoute("/stories/$slug")({
  loader: ({ params }) => {
    const story = stories.find((s) => s.slug === params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Story unavailable — UrjaSethu" }, { name: "robots", content: "noindex" }] };
    }
    const { story } = loaderData;
    return {
      meta: [
        { title: `“${story.headline}” — Business Story | UrjaSethu` },
        { name: "description", content: story.problem },
        { property: "og:title", content: story.headline },
        { property: "og:description", content: story.problem },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: StoryPage,
});

function StoryPage() {
  const { story } = Route.useLoaderData();
  const solution = solutions.find((s) => s.slug === story.solutionSlug);

  return (
    <article>
      <div className="border-b border-border bg-ivory">
        <div className="container-page grid gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-amber">Demo story</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-[2.4rem]">
              “{story.headline}”
            </h1>
            <p className="mt-4 text-muted-foreground">
              {story.person} · {story.role} · {story.location}
            </p>
          </div>
          <img
            src={images[story.image]}
            alt={story.headline}
            width={1200}
            height={900}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      </div>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-9">
          <Section title="My problem">{story.problem}</Section>
          <Section title="What I was looking for">{story.needed}</Section>
          <Section title="Why it mattered">{story.mattered}</Section>
          <Section title="My DRE journey">{story.journey}</Section>
          <Section title="What changed">
            {story.changed ?? "Results are only published once they are verified with the business owner."}
          </Section>
        </div>

        <aside className="space-y-6 lg:border-l lg:border-border lg:pl-10">
          <div className="border border-border bg-card p-6">
            <h2 className="font-semibold">I have a similar problem</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll open the assessment with this story's context already filled in.
            </p>
            <Link
              to="/find-my-solution"
              search={{ problem: story.problemId, story: story.slug }}
              className="mt-4 inline-block bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
            >
              Start my assessment
            </Link>
          </div>
          {solution && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Solution explored
              </h2>
              <Link
                to="/solutions/$slug"
                params={{ slug: solution.slug }}
                className="mt-3 block font-medium hover:text-primary"
              >
                {solution.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{solution.summary}</p>
            </div>
          )}
          <Link to="/stories" className="inline-block text-sm text-primary hover:underline">
            ← All business stories
          </Link>
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
      <p className="mt-2.5 text-lg leading-relaxed text-foreground/90">{children}</p>
    </section>
  );
}
