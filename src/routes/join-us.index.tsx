import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/join-us/")({
  head: () => ({
    meta: [
      { title: "Join Us — Solution, Finance & Network Partners | UrjaSethu" },
      {
        name: "description",
        content:
          "Register on UrjaSethu as a DRE solution provider, a finance provider or a network partner. Each partner type has its own onboarding form.",
      },
      { property: "og:title", content: "Join UrjaSethu" },
      {
        property: "og:description",
        content: "Three ways to join the DRE marketplace: solution provider, finance provider or network partner.",
      },
      { property: "og:url", content: "https://urjasethu.dev/join-us" },
      { property: "og:image", content: "https://urjasethu.dev/og-image.jpg" },
      { name: "twitter:image", content: "https://urjasethu.dev/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://urjasethu.dev/join-us" }],
  }),
  component: JoinUs,
});

const paths = [
  {
    to: "/join-us/solution-provider",
    eyebrow: "01",
    title: "DRE Solution Provider",
    text: "You design, supply, install or service decentralised renewable energy systems — solar PV, cold chain, solar drying, pumps, e-mobility, storage.",
    asks: "Technologies, service districts, capacity, certifications and past installations.",
  },
  {
    to: "/join-us/finance-provider",
    eyebrow: "02",
    title: "Finance Provider",
    text: "You lend to or finance MSMEs — a bank, NBFC, cooperative, leasing company or a pay-as-you-go financier.",
    asks: "Institution type, products, ticket sizes, sectors funded and geographies covered.",
  },
  {
    to: "/join-us/network-partner",
    eyebrow: "03",
    title: "Network Partner",
    text: "You work with businesses on the ground — an NGO, FPO, cluster association, incubator, consultant or local facilitator.",
    asks: "Type of organisation, community reached, districts covered and how you support enterprises.",
  },
] as const;

function JoinUs() {
  return (
    <>
      <PageHeader
        eyebrow="Join us"
        title="Three ways to be part of the UrjaSethu network"
        intro="Choose the role that fits your organisation. Each one has its own registration form, because what we need to verify is different in each case."
      />

      <div className="container-page py-12">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {paths.map((p) => (
            <Link key={p.to} to={p.to} className="group bg-background p-7 transition-colors hover:bg-ivory">
              <p className="eyebrow">{p.eyebrow}</p>
              <h2 className="mt-2 font-display text-xl font-semibold group-hover:text-primary">{p.title}</h2>
              <p className="mt-3 text-base text-foreground/85">{p.text}</p>
              <p className="mt-4 text-sm text-muted-foreground">What we ask for: {p.asks}</p>
              <span className="mt-5 inline-block text-sm font-medium text-primary">Register →</span>
            </Link>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          Not sure which one applies to you?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          and we will point you to the right form.
        </p>
      </div>
    </>
  );
}
