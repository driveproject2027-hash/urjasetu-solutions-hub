import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LayaGreenEnergy and the DRIVE initiative" },
      {
        name: "description",
        content:
          "LayaGreenEnergy is a decentralised renewable energy platform for Indian businesses, developed under DRIVE — Decentralised Renewable Energy Innovation for Vibrant Enterprises.",
      },
      { property: "og:title", content: "About LayaGreenEnergy and DRIVE" },
      {
        property: "og:description",
        content:
          "A DRE marketplace built around real business problems, not technology catalogues.",
      },
      { property: "og:url", content: "https://layagreenenergy.com/about" },
      { property: "og:image", content: "https://layagreenenergy.com/og-image.jpg" },
      { name: "twitter:image", content: "https://layagreenenergy.com/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://layagreenenergy.com/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A platform built around the business problem, not the technology."
        intro="LayaGreenEnergy exists so that a business owner can describe what is going wrong and end up with a suitable solution, a credible provider and a project that actually gets done."
      />

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold">How we think about it</h2>
            <p className="mt-3 text-lg leading-relaxed text-foreground/85">
              Identify the business problem first. Match the appropriate technology. Work out how it
              will be financed. Pilot it. Then scale it. Most failed clean-energy investments skip
              the first step.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">The loop we are building</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">
              People post problems. The platform understands the requirement. Providers discover
              genuine demand and respond. Customers compare options. Projects get completed.
              Customers share what happened — and the next business finds their story.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">About DRIVE</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">
              DRIVE — Decentralised Renewable Energy Innovation for Vibrant Enterprises — is the
              initiative under which LayaGreenEnergy is developed. DRIVE works on strengthening the
              ecosystem for decentralised renewable energy in Indian enterprises: awareness,
              technology matching, enterprise development and financing linkages.
            </p>
          </section>
        </div>

        <aside className="space-y-4 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Get started
          </h2>
          <Link to="/drive" className="block font-medium hover:text-primary">
            About DRIVE →
          </Link>
          <Link to="/events" className="block font-medium hover:text-primary">
            Events &amp; awareness →
          </Link>
          <Link to="/find-my-solution" className="block font-medium hover:text-primary">
            Find my solution →
          </Link>

          <Link to="/join-us" className="block font-medium hover:text-primary">
            Join as a provider →
          </Link>
          <Link to="/needs" className="block font-medium hover:text-primary">
            Post a requirement →
          </Link>
        </aside>
      </div>
    </>
  );
}
