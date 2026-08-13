import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { openNeeds } from "../data/catalog";

export const Route = createFileRoute("/needs")({
  head: () => ({
    meta: [
      { title: "Open Needs — what businesses are looking for | UrjaSetu" },
      {
        name: "description",
        content:
          "Active requirements posted by Indian businesses looking for decentralised renewable energy solutions. Providers can respond directly.",
      },
      { property: "og:title", content: "Open Needs — UrjaSetu" },
      { property: "og:description", content: "Real demand from businesses. Providers respond with proposals." },
    ],
  }),
  component: Needs,
});

function Needs() {
  const [showForm, setShowForm] = useState(false);
  const [privacy, setPrivacy] = useState("Public");

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="What businesses are looking for"
        intro="Open needs are active requirements posted by business owners. Providers respond with a proposed solution, indicative price and timeline."
      >
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep"
        >
          {showForm ? "Close form" : "Post your requirement"}
        </button>
      </PageHeader>

      <div className="container-page py-12">
        {showForm && (
          <form
            className="mb-12 grid gap-5 border border-border bg-card p-6 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setShowForm(false);
              toast.success("Requirement recorded", {
                description: "Posting to providers goes live once accounts are enabled.",
              });
            }}
          >
            <h2 className="text-lg font-semibold md:col-span-2">Post your requirement</h2>
            <Input label="Business type" placeholder="e.g. Food processing" />
            <Input label="Location" placeholder="District, state" />
            <Input label="Problem" placeholder="What is going wrong today?" className="md:col-span-2" />
            <Input label="What solution are you looking for?" placeholder="e.g. Solar dryer" />
            <Input label="Budget" placeholder="e.g. ₹1–2 lakh" />
            <Input label="Timeline" placeholder="e.g. Within 2 months" />
            <div>
              <label htmlFor="privacy" className="mb-1.5 block text-sm font-medium">
                Visibility
              </label>
              <select
                id="privacy"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2.5 text-base"
              >
                <option>Public</option>
                <option>Private — only matched providers</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
                Additional details
              </label>
              <textarea
                id="details"
                rows={4}
                className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground md:col-span-2">
              Contact details are never shown publicly. Private needs are shared only with providers matched to your
              requirement.
            </p>
            <button
              type="submit"
              className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep md:col-span-2 md:justify-self-start"
            >
              Post requirement
            </button>
          </form>
        )}

        <ul className="divide-y divide-border border-y border-border">
          {openNeeds.map((n) => (
            <li key={n.id} className="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-lg font-semibold">{n.title}</h2>
                  <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">{n.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {n.business} · {n.location}
                </p>
                <p className="mt-3 max-w-2xl text-base">{n.problem}</p>
                <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Looking for</dt>
                    <dd>{n.looking}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Budget</dt>
                    <dd>{n.budget}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Timeline</dt>
                    <dd>{n.timeline}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Responses</dt>
                    <dd>{n.responses}</dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                onClick={() =>
                  toast.success("Response started", {
                    description: "Provider responses go live once provider accounts are enabled.",
                  })
                }
                className="border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                I can help
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted-foreground">
          Are you a provider?{" "}
          <Link to="/join-provider" className="text-primary hover:underline">
            Join the platform
          </Link>{" "}
          to respond to these needs.
        </p>
      </div>
    </>
  );
}

function Input({
  label,
  placeholder,
  className = "",
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
      />
    </div>
  );
}
