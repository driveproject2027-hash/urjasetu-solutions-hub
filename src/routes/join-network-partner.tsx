import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { submitProviderApplication } from "../lib/db";
import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/join-network-partner")({
  head: () => ({
    meta: [{ title: "Join as Network Partner — UrjaSetu" }],
  }),
  component: JoinNetworkPartner,
});

function JoinNetworkPartner() {
  const [busy, setBusy] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Network partners"
        title="Join as a network partner"
        intro="Network partners help connect local businesses to solutions — local helps, NGOs and regional experts."
      />

      <div className="container-page py-12">
        <p className="mb-6 text-base text-foreground/90">
          Network partners include local helps, NGOs and regional experts. If you support businesses by connecting them to solutions,
          please register below and we will be in touch.
        </p>

        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            const contact = String(fd.get("contact") ?? "");
            setBusy(true);
            submitProviderApplication({
              organisation: String(fd.get("organisation") ?? "") || String(fd.get("name") ?? ""),
              contact_person: String(fd.get("name") ?? ""),
              email: contact.includes("@") ? contact : "",
              phone: contact.includes("@") ? "" : contact,
              location: String(fd.get("region") ?? ""),
              provider_type: "network",
              description: `Role: ${String(fd.get("role") ?? "")}`,
            })
              .then(() => {
                form.reset();
                toast.success("Registration submitted", { description: "Our team will review and get in touch." });
              })
              .catch((err: Error) => toast.error("Could not submit", { description: err.message }))
              .finally(() => setBusy(false));
          }}
        >
          <div>
            <label htmlFor="np-name" className="mb-1.5 block text-sm font-medium">Name</label>
            <input id="np-name" name="name" className="w-full border border-input px-3 py-2.5" required />
          </div>
          <div>
            <label htmlFor="np-organisation" className="mb-1.5 block text-sm font-medium">Organisation</label>
            <input id="np-organisation" name="organisation" className="w-full border border-input px-3 py-2.5" />
          </div>
          <div>
            <label htmlFor="np-role" className="mb-1.5 block text-sm font-medium">Role</label>
            <input id="np-role" name="role" className="w-full border border-input px-3 py-2.5" />
          </div>
          <div>
            <label htmlFor="np-contact" className="mb-1.5 block text-sm font-medium">Contact (phone or email)</label>
            <input id="np-contact" name="contact" className="w-full border border-input px-3 py-2.5" required />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="np-region" className="mb-1.5 block text-sm font-medium">Region / Districts you operate in</label>
            <input id="np-region" name="region" className="w-full border border-input px-3 py-2.5" />
          </div>

          <button type="submit" disabled={busy} className="bg-primary px-6 py-3 disabled:opacity-60 text-sm font-medium text-primary-foreground">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
