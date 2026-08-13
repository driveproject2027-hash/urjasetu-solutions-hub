import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";
import solarImg from "../assets/solutions-solar.jpg";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Understand DRE — plain-language guide | UrjaSetu" },
      {
        name: "description",
        content:
          "What decentralised renewable energy means for a small business: solar PV, grid-tied versus battery systems, cold storage, drying, processing, e-mobility and farm energy.",
      },
      { property: "og:title", content: "Understand DRE — UrjaSetu" },
      { property: "og:description", content: "Energy where your business needs it, explained simply." },
    ],
  }),
  component: Resources,
});

const topics = [
  { name: "Solar PV", text: "Panels that generate electricity for your own consumption during the day." },
  { name: "Grid-tied", text: "Solar working alongside the grid, with no storage in between." },
  { name: "Solar + Battery", text: "Solar with storage so chosen equipment keeps running during outages." },
  { name: "Cold storage", text: "Cooling near the point of production so produce holds its value longer." },
  { name: "Solar drying", text: "Controlled drying that is faster and cleaner than the open sun." },
  { name: "Processing", text: "Mills, grinders and expellers powered without diesel." },
  { name: "E-mobility", text: "Electric carts and delivery vehicles with lower running cost." },
  { name: "Textile", text: "Shared power for stitching and weaving clusters." },
  { name: "Farm energy", text: "Pumping and farm operations without diesel dependence." },
];

function Resources() {
  return (
    <>
      <PageHeader
        eyebrow="Understand DRE"
        title="Energy where your business needs it."
        intro="Decentralised renewable energy means generating and using energy close to where the work happens — on your roof, at your farm gate, inside your workshop."
      />

      <div className="container-page py-12">
        <img
          src={solarImg}
          alt="Rooftop solar installation on a small industrial building in India"
          loading="lazy"
          width={1200}
          height={900}
          className="h-72 w-full object-cover md:h-96"
        />

        <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-3">
          {topics.map((t) => (
            <section key={t.name} className="border-t border-border pt-4">
              <h2 className="font-display text-lg font-semibold">{t.name}</h2>
              <p className="mt-2 text-base text-foreground/85">{t.text}</p>
            </section>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Grid-tied vs Solar + Battery</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The most common decision a business faces. It comes down to whether outages cost you money.
          </p>
          <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
            <div className="bg-background p-7">
              <h3 className="font-display text-lg font-semibold">Grid-tied</h3>
              <ul className="mt-4 space-y-2 text-base">
                <li className="border-l-2 border-border pl-3">Lower upfront cost</li>
                <li className="border-l-2 border-border pl-3">No battery to maintain or replace</li>
                <li className="border-l-2 border-border pl-3">Suits stable daytime operations</li>
                <li className="border-l-2 border-border pl-3">Stops working during an outage</li>
              </ul>
            </div>
            <div className="bg-ivory p-7">
              <h3 className="font-display text-lg font-semibold">Solar + Battery</h3>
              <ul className="mt-4 space-y-2 text-base">
                <li className="border-l-2 border-primary pl-3">Higher upfront cost</li>
                <li className="border-l-2 border-primary pl-3">Battery storage included</li>
                <li className="border-l-2 border-primary pl-3">Keeps chosen loads running</li>
                <li className="border-l-2 border-primary pl-3">Suits businesses where outages hurt</li>
              </ul>
            </div>
          </div>
          <Link
            to="/find-my-solution"
            className="mt-8 inline-block bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
          >
            Work out which fits your business
          </Link>
        </section>
      </div>
    </>
  );
}
