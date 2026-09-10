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
  const [moreOpen, setMoreOpen] = useState(false);
  const { session } = useSession();
  const primaryNav = [nav[0], nav[1], nav[2], nav[8], nav[9]];
  const secondaryNav = [nav[3], nav[4], nav[5], nav[6], nav[7]];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-24 items-center justify-between gap-6">
        <Link to="/" className="flex h-24 w-28 shrink-0 items-center" aria-label="Laya Green Energy home">
          <img
            src="/WhatsApp_Image_2026-09-08_at_20.49.59_copy-removebg-preview.png"
            alt="Laya Green Energy"
            className="h-full w-full bg-transparent object-contain mix-blend-multiply"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-evenly px-6 xl:flex 2xl:px-10" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((value) => !value)}
              className="whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              More
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-4 min-w-52 border border-border bg-background p-2 shadow-lg">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className="block px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            to="/join-us"
            className="whitespace-nowrap border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
          >
            Join Us
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
              Join Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
