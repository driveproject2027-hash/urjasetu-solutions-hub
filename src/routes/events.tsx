import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";

/**
 * Events & Awareness listing.
 * To add or update an event, edit this array — nothing else needs to change.
 * Only publish details shared by the project authorities.
 */
type EventItem = {
  name: string;
  date: string;
  location: string;
  description: string;
  contact?: string;
};

const events: EventItem[] = [];

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Awareness — UrjaSetu" },
      {
        name: "description",
        content:
          "Upcoming awareness programmes, workshops, DRE events and enterprise engagements organised under the DRIVE initiative.",
      },
      { property: "og:title", content: "Events & Awareness — UrjaSetu" },
      {
        property: "og:description",
        content: "Workshops, awareness programmes and enterprise engagements on decentralised renewable energy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Events,
});

function Events() {
  return (
    <>
      <PageHeader
        eyebrow="Events & awareness"
        title="Workshops, awareness programmes and enterprise engagements"
        intro="Sessions organised under the DRIVE initiative for business owners, providers and partners. Details are published as they are confirmed."
      />

      <div className="container-page py-12">
        {events.length === 0 ? (
          <div className="max-w-2xl border border-border bg-ivory p-6">
            <h2 className="font-display text-lg font-semibold">No events listed at the moment</h2>
            <p className="mt-2 text-foreground/85">
              Upcoming awareness programmes, workshops and enterprise engagements will be published here once
              confirmed by the project authorities.
            </p>
            <Link to="/contact" className="mt-4 inline-block font-medium text-primary underline">
              Contact us to know about upcoming sessions →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {events.map((e) => (
              <li key={e.name} className="grid gap-3 py-7 md:grid-cols-[16rem_1fr]">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{e.date}</p>
                  <p className="mt-1">{e.location}</p>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">{e.name}</h2>
                  <p className="mt-2 text-foreground/85">{e.description}</p>
                  {e.contact && (
                    <p className="mt-2 text-sm text-muted-foreground">Registration / contact: {e.contact}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
