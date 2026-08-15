import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { useSession } from "../../lib/useAuth";

const nav = [
  { to: "/solutions", label: "Solutions" },
  { to: "/providers", label: "Providers" },
  { to: "/find-my-solution", label: "Find My Solution" },
  { to: "/stories", label: "Stories" },
  { to: "/needs", label: "Open Needs" },
  { to: "/opportunities", label: "Business Opportunities" },
  { to: "/resources", label: "Resources" },
  { to: "/financing", label: "Finance" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact Us" },
] as const;


export function Header() {
  const [open, setOpen] = useState(false);
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-baseline">
          <span className="font-display text-xl font-bold tracking-tight text-primary">UrjaSetu</span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
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

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            to="/join-us"
            className="whitespace-nowrap border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
          >
            Join as Provider
          </Link>
          <Link
            to={session ? "/account" : "/auth"}
            className="whitespace-nowrap text-sm text-foreground/80 hover:text-primary"
          >
            {session ? "My account" : "Sign In"}
          </Link>
        </div>


        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="xl:hidden p-2 text-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background xl:hidden">
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
            <Link
              to={session ? "/account" : "/auth"}
              onClick={() => setOpen(false)}
              className="border-b border-border/60 py-3 text-base"
            >
              {session ? "My account" : "Sign In"}
            </Link>
            <Link
              to="/join-us"
              onClick={() => setOpen(false)}
              className="my-3 bg-primary px-4 py-3 text-center text-base font-medium text-primary-foreground"
            >
              Join as Provider
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
