import { Link, useRouterState } from "@tanstack/react-router";
import { Sun } from "lucide-react";

// Homepage floating CTA driving traffic to the solar savings calculator.
export function SolarSavingsFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/") return null;

  return (
    <Link
      to="/calculator"
      className="group fixed bottom-4 left-4 z-50 flex items-center gap-3 border border-white/15 bg-forest-deep px-3 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_24px_oklch(0.29_0.055_155/0.22)] transition-colors hover:bg-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-6 sm:left-6"
    >
      <span className="flex size-9 shrink-0 items-center justify-center bg-sand text-forest-deep">
        <Sun className="size-4.5" strokeWidth={1.75} />
      </span>
      <span className="leading-tight">
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.12em] text-sand/75">
          Solar estimate
        </span>
        <span className="mt-0.5 block">Know your savings</span>
      </span>
    </Link>
  );
}
