import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [joinOpen, setJoinOpen] = useState(false);
  const joinRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (joinRef.current && !joinRef.current.contains(e.target as Node)) {
        setJoinOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

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
          <div className="relative" ref={joinRef}>
            <button
              type="button"
              aria-expanded={joinOpen}
              onClick={() => setJoinOpen((v) => !v)}
              className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary"
            >
              Join
              <ChevronDown className="size-4" />
            </button>

            {joinOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-background shadow-md">
                <div className="flex flex-col p-2">
                  <Link
                    to="/join-provider"
                    className="px-3 py-2 text-sm text-foreground/90 hover:bg-muted/60"
                    onClick={() => setJoinOpen(false)}
                  >
                    Join as Solution Provider
                  </Link>
                  <Link
                    to="/join-network-partner"
                    className="mt-1 px-3 py-2 text-sm text-foreground/90 hover:bg-muted/60"
                    onClick={() => setJoinOpen(false)}
                  >
                    Join as Network Partner
                  </Link>
                  <p className="mt-2 px-3 text-xs text-muted-foreground">
                    Network partners include local helps, NGOs and regional experts.
                  </p>
                </div>
              </div>
            )}
          </div>

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
            <div className="border-b border-border/60 py-3">
              <div className="mb-2 text-base font-medium">Join</div>
              <Link to="/join-provider" onClick={() => setOpen(false)} className="block py-2 text-base">
                Join as Solution Provider
              </Link>
              <Link to="/join-network-partner" onClick={() => setOpen(false)} className="block py-2 text-base">
                Join as Network Partner
              </Link>
            </div>
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
