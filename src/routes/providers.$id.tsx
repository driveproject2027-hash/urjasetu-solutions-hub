import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { submitQuoteRequest } from "../lib/db";

import { providers } from "../data/catalog";

export const Route = createFileRoute("/providers/$id")({
  loader: ({ params }) => {
    const provider = providers.find((p) => p.id === params.id);
    if (!provider) throw notFound();
    return { provider };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Provider unavailable — UrjaSetu" }, { name: "robots", content: "noindex" }] };
    }
    const { provider } = loaderData;
    return {
      meta: [
        { title: `${provider.name} — DRE provider in ${provider.city} | UrjaSetu` },
        { name: "description", content: provider.about },
        { property: "og:title", content: `${provider.name} — UrjaSetu` },
        { property: "og:description", content: provider.about },
      ],
    };
  },
  component: ProviderProfile,
});

function ProviderProfile() {
  const { provider } = Route.useLoaderData();
  const [busy, setBusy] = useState(false);

  return (
    <article>
      <header className="border-b border-border bg-ivory">
        <div className="container-page py-14">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold md:text-4xl">{provider.name}</h1>
            {provider.verified && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                <BadgeCheck className="size-5" /> DRE Platform Verified
              </span>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4" /> {provider.city}, {provider.state}
            <span className="mx-2 text-border">|</span>
            <Star className="size-4 text-amber" /> {provider.rating.toFixed(1)} · {provider.projects} projects
          </p>
        </div>
      </header>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">{provider.about}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Technologies</h2>
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {provider.technologies.map((t) => (
                <li key={t} className="py-2.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          </section>
          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold">Industries served</h2>
              <p className="mt-2 text-sm text-foreground/85">{provider.industries.join(" · ")}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Service areas</h2>
              <p className="mt-2 text-sm text-foreground/85">{provider.serviceAreas.join(" · ")}</p>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Previous projects</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Project records and photographs appear here once the provider uploads them and the platform reviews
              them. This demo listing has none.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Reviews</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Reviews are only shown after a verified project or enquiry. No reviews have been submitted for this
              demo listing.
            </p>
          </section>
        </div>

        <aside className="border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-lg font-semibold">Request a quote</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your requirement and this provider will respond with an indicative proposal.
          </p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const fd = new FormData(form);
              const contact = String(fd.get("contact") ?? "");
              setBusy(true);
              submitQuoteRequest({
                provider_ref: provider.name,
                name: String(fd.get("name") ?? ""),
                email: contact.includes("@") ? contact : "",
                phone: contact.includes("@") ? "" : contact,
                requirement: String(fd.get("requirement") ?? ""),
              })
                .then(() => {
                  form.reset();
                  toast.success("Quote request sent", {
                    description: "The provider and our team can now see your requirement.",
                  });
                })
                .catch((err: Error) => toast.error("Could not send", { description: err.message }))
                .finally(() => setBusy(false));
            }}
          >
            <input
              required
              name="name"
              aria-label="Your name"
              placeholder="Your name"
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
            <input
              required
              name="contact"
              aria-label="Phone or email"
              placeholder="Phone or email"
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
            <textarea
              required
              name="requirement"
              aria-label="What problem are you trying to solve?"
              rows={4}
              placeholder="What problem are you trying to solve?"
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary disabled:opacity-60 px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
            >
              Request quote
            </button>
          </form>
          <Link to="/providers" className="mt-4 inline-block text-sm text-primary hover:underline">
            ← Back to all providers
          </Link>
        </aside>
      </div>
    </article>
  );
}
