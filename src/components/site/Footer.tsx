import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Platform",
    links: [
      { to: "/find-my-solution", label: "Find My Solution" },
      { to: "/solutions", label: "DRE Solutions" },
      { to: "/providers", label: "Providers" },
      { to: "/needs", label: "Open Needs" },
    ],
  },
  {
    title: "People",
    links: [
      { to: "/stories", label: "Business Stories" },
      { to: "/opportunities", label: "Business Opportunities" },
      { to: "/join-us", label: "Join Us" },
    ],
  },
  {
    title: "Knowledge",
    links: [
      { to: "/resources", label: "Understand DRE" },
      { to: "/financing", label: "Financing &amp; Support" },
      { to: "/calculator", label: "Solar Calculator" },
      { to: "/about", label: "About DRIVE" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-ivory">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">UrjaSethu</p>
          <p className="mt-2 max-w-xs text-sm text-ivory/70">
            A platform where Indian businesses start with a real problem and find the decentralised renewable
            energy solution and provider that fits.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-ivory">{col.title}</h3>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-ivory/70 transition-colors hover:text-ivory">
                    {l.label.replace("&amp;", "&")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Developed under the DRIVE initiative — Decentralised Renewable Energy Innovation for Vibrant Enterprises.</p>
          <p>Demo content. Estimates are indicative and must be verified before any investment decision.</p>
        </div>
      </div>
    </footer>
  );
}
