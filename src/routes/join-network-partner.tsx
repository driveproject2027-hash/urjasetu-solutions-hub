import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/join-network-partner")({
  head: () => ({
    meta: [{ title: "Join as Network Partner — UrjaSetu" }],
  }),
  component: JoinNetworkPartner,
});

function JoinNetworkPartner() {
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
            // simple client-side confirmation for the stub
            alert("Thank you — registration recorded (demo).");
          }}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input className="w-full border border-input px-3 py-2.5" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Organisation</label>
            <input className="w-full border border-input px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Role</label>
            <input className="w-full border border-input px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Contact (phone or email)</label>
            <input className="w-full border border-input px-3 py-2.5" required />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Region / Districts you operate in</label>
            <input className="w-full border border-input px-3 py-2.5" />
          </div>

          <button type="submit" className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
