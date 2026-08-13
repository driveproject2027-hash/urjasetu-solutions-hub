import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { solutions } from "../data/catalog";

export const Route = createFileRoute("/join-provider")({
  head: () => ({
    meta: [
      { title: "Join the DRE Platform as a Provider — UrjaSetu" },
      {
        name: "description",
        content:
          "Put your DRE solutions in front of Indian businesses actively looking for them. Register, get verified and respond to real customer demand.",
      },
      { property: "og:title", content: "Join the DRE Platform — UrjaSetu" },
      { property: "og:description", content: "Reach businesses actively looking for renewable energy solutions." },
    ],
  }),
  component: JoinProvider,
});

const steps = ["Submitted", "Under review", "Verified", "Published"];

function JoinProvider() {
  return (
    <>
      <PageHeader
        eyebrow="For providers"
        title="Join the DRE platform"
        intro="Put your solutions in front of businesses actively looking for them."
      />

      <div className="container-page py-12">
        <ol className="mb-12 flex flex-wrap gap-6 border-y border-border py-5">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm">
              <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className={i === 0 ? "font-medium text-primary" : "text-foreground/80"}>{s}</span>
            </li>
          ))}
        </ol>

        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Registration recorded", {
              description: "Provider accounts and verification go live in the next phase.",
            });
          }}
        >
          <Field label="Company name" required />
          <Field label="Contact person" required />
          <Field label="Phone" required />
          <Field label="Email" type="email" required />
          <Field label="City" required />
          <Field label="State" required />
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium">Technologies offered</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {solutions.map((s) => (
                <label key={s.slug} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-[oklch(0.42_0.075_152)]" />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <Field label="Service areas (districts)" className="md:col-span-2" />
          <Field label="Industries served" className="md:col-span-2" />
          <Field label="Years of experience" />
          <Field label="Website" />
          <div className="md:col-span-2">
            <label htmlFor="exp" className="mb-1.5 block text-sm font-medium">
              Capacity, certifications and previous projects
            </label>
            <textarea
              id="exp"
              rows={5}
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground md:col-span-2">
            Verification means the platform has reviewed the information you submit. It is separate from customer
            ratings, which come only from real project experience.
          </p>
          <button
            type="submit"
            className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep md:justify-self-start"
          >
            Submit registration
          </button>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  type?: string;
  required?: boolean;
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
        type={type}
        required={required}
        className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
      />
    </div>
  );
}
