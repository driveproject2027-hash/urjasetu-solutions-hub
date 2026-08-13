import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/solutions", label: "Solutions" },
  { to: "/providers", label: "Providers" },
  { to: "/stories", label: "Business Stories" },
  { to: "/needs", label: "Open Needs" },
  { to: "/opportunities", label: "Business Opportunities" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-baseline">
          <span className="font-display text-xl font-bold tracking-tight text-primary">UrjaSetu</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link to="/join-provider" className="text-sm text-foreground/80 hover:text-primary">
            Join as Provider
          </Link>
          <Link
            to="/find-my-solution"
            className="border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
          >
            Find a Solution
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-2" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-base"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/join-provider" onClick={() => setOpen(false)} className="py-3 text-base">
              Join as Provider
            </Link>
            <Link
              to="/find-my-solution"
              onClick={() => setOpen(false)}
              className="my-3 bg-primary px-4 py-3 text-center text-base font-medium text-primary-foreground"
            >
              Find a Solution
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
