import { Link, useRouterState } from "@tanstack/react-router";
import { Sun } from "lucide-react";

// Homepage floating CTA driving traffic to the solar savings calculator.
export function SolarSavingsFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/") return null;

  return (
    <Link
      to="/calculator"
      className="group fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-forest-deep py-3 pl-4 pr-5 text-sm font-medium text-primary-foreground shadow-lg shadow-forest-deep/25 transition-all hover:bg-forest hover:shadow-xl hover:shadow-forest-deep/30 sm:bottom-6 sm:right-6"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sand text-forest-deep">
        <Sun className="size-4" />
      </span>
      <span className="max-w-[9.5rem] leading-tight sm:max-w-none">
        Know your solar savings today
      </span>
    </Link>
  );
}
