import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { openNeeds } from "../data/catalog";
import { fetchPublicNeeds, submitCustomerRequest, submitNeedResponse, submitOpenNeed } from "../lib/db";

export const Route = createFileRoute("/needs")({
  head: () => ({
    meta: [
      { title: "Open Needs — what businesses are looking for | UrjaSethu" },
      {
        name: "description",
        content:
          "Active requirements posted by Indian businesses looking for decentralised renewable energy solutions. Providers can respond directly.",
      },
      { property: "og:title", content: "Open Needs — UrjaSethu" },
      { property: "og:description", content: "Real demand from businesses. Providers respond with proposals." },
    ],
  }),
  component: Needs,
});

type LiveNeed = {
  id: string;
  title: string;
  business_name: string | null;
  sector: string | null;
  location: string | null;
  description: string | null;
  budget: string | null;
  timeline: string | null;
  status: string | null;
};

function Needs() {
  const [showForm, setShowForm] = useState(false);
  const [privacy, setPrivacy] = useState("Public");
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState<LiveNeed[]>([]);
  const [respondTo, setRespondTo] = useState<string | null>(null);

  function loadNeeds() {
    fetchPublicNeeds()
      .then((rows) => setLive((rows ?? []) as unknown as LiveNeed[]))
      .catch(() => undefined);
  }

  useEffect(loadNeeds, []);

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
              const form = e.currentTarget;
              const fd = new FormData(form);
              const problem = String(fd.get("problem") ?? "");
              const looking = String(fd.get("what-solution-are-you-looking-for") ?? "");
              setBusy(true);
              submitOpenNeed({
                title: looking || problem.slice(0, 80) || "New requirement",
                business_name: String(fd.get("business-type") ?? ""),
                sector: String(fd.get("business-type") ?? ""),
                location: String(fd.get("location") ?? ""),
                description: [problem, String(fd.get("details") ?? ""), `Visibility: ${privacy}`]
                  .filter(Boolean)
                  .join("\n"),
                budget: String(fd.get("budget") ?? ""),
                timeline: String(fd.get("timeline") ?? ""),
                contact_email: String(fd.get("contact-email") ?? ""),
              })
                .then(() => {
                  form.reset();
                  setShowForm(false);
                  loadNeeds();
                  toast.success("Requirement posted", {
                    description: "Our team reviews it before publishing to providers.",
                  });
                })
                .catch((err: Error) => toast.error("Could not post", { description: err.message }))
                .finally(() => setBusy(false));
            }}
          >
            <h2 className="text-lg font-semibold md:col-span-2">Post your requirement</h2>
            <Input label="Business type" placeholder="e.g. Food processing" />
            <Input label="Location" placeholder="District, state" />
            <Input label="Problem" placeholder="What is going wrong today?" className="md:col-span-2" />
            <Input label="What solution are you looking for?" placeholder="e.g. Solar dryer" />
            <Input label="Budget" placeholder="e.g. ₹1–2 lakh" />
            <Input label="Timeline" placeholder="e.g. Within 2 months" />
            <Input label="Contact email" placeholder="you@business.in" />
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
                name="details"
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
              disabled={busy}
              className="bg-primary px-5 py-3 disabled:opacity-60 text-sm font-medium text-primary-foreground hover:bg-forest-deep md:col-span-2 md:justify-self-start"
            >
              Post requirement
            </button>
          </form>
        )}

        {live.length > 0 && (
          <ul className="mb-12 divide-y divide-border border-y border-border">
            {live.map((n) => (
              <li key={n.id} className="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-lg font-semibold">{n.title}</h2>
                    <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {n.status ?? "Published"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[n.business_name, n.sector, n.location].filter(Boolean).join(" · ")}
                  </p>
                  {n.description && <p className="mt-3 max-w-2xl whitespace-pre-line text-base">{n.description}</p>}
                  <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Budget</dt>
                      <dd>{n.budget || "Not specified"}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Timeline</dt>
                      <dd>{n.timeline || "Not specified"}</dd>
                    </div>
                  </dl>
                  {respondTo === n.id && (
                    <form
                      className="mt-4 grid max-w-xl gap-3 border border-border bg-ivory p-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const fd = new FormData(form);
                        setBusy(true);
                        submitNeedResponse({
                          need_id: n.id,
                          contact_name: String(fd.get("rname") ?? ""),
                          contact_email: String(fd.get("remail") ?? ""),
                          message: String(fd.get("rmessage") ?? ""),
                        })
                          .then(() => {
                            form.reset();
                            setRespondTo(null);
                            toast.success("Response sent", {
                              description: "The business and our team can now see your proposal.",
                            });
                          })
                          .catch((err: Error) => toast.error("Could not send", { description: err.message }))
                          .finally(() => setBusy(false));
                      }}
                    >
                      <input name="rname" placeholder="Your name / organisation" aria-label="Your name" className="border border-input bg-background px-3 py-2 text-sm" />
                      <input name="remail" type="email" placeholder="Email" aria-label="Email" className="border border-input bg-background px-3 py-2 text-sm" />
                      <textarea name="rmessage" rows={3} required placeholder="What you propose, indicative price and timeline" aria-label="Message" className="border border-input bg-background px-3 py-2 text-sm" />
                      <button type="submit" disabled={busy} className="justify-self-start bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">
                        Send response
                      </button>
                    </form>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setRespondTo(respondTo === n.id ? null : n.id)}
                  className="border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {respondTo === n.id ? "Cancel" : "I can help"}
                </button>
              </li>
            ))}
          </ul>
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
                onClick={() => {
                  setBusy(true);
                  submitCustomerRequest({
                    source: "post_a_need",
                    problem: `Provider interest in sample need: ${n.title}`,
                    requirement: n.looking,
                  })
                    .then(() =>
                      toast.success("Interest recorded", {
                        description: "Our team will get back to you with the requirement details.",
                      }),
                    )
                    .catch((err: Error) => toast.error("Could not record", { description: err.message }))
                    .finally(() => setBusy(false));
                }}
                className="border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                I can help
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted-foreground">
          Are you a provider?{" "}
          <Link to="/join-us" className="text-primary hover:underline">
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
        name={id}
        placeholder={placeholder}
        className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
      />
    </div>
  );
}
