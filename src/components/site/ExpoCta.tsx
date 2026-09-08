// ============================================================
// TEMPORARY • DRE EXPO module — safe to remove after the expo.
// CTA entry points: header button, homepage banner and the
// floating homepage FAB (stands in for SolarSavingsFab).
// To retire, delete this file and remove its usages in
// Header.tsx, routes/index.tsx and routes/__root.tsx
// (or just set EXPO_ENABLED = false).
// ============================================================
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Ticket } from "lucide-react";

import { EXPO_ENABLED } from "../../lib/expo";

/** Large CTA button for the site header — pinned to the right side of the navbar. */
export function ExpoHeaderCta({
  onNavigate,
  className = "",
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  if (!EXPO_ENABLED) return null;
  return (
    <Link
      to="/expo"
      onClick={onNavigate}
      className={`inline-flex items-center justify-center gap-2.5 whitespace-nowrap bg-amber-400 px-6 py-2.5 shadow-[0_2px_12px_oklch(0.75_0.15_85/0.45)] transition-colors hover:bg-amber-500 ${className}`}
    >
      <span className="text-base font-bold text-amber-950">DRE Expo — Register Now</span>
    </Link>
  );
}

/** Prominent banner strip for the homepage, directly under the hero. */
export function ExpoBanner() {
  if (!EXPO_ENABLED) return null;
  return (
    <section className="border-b border-amber-500/40 bg-amber-50">
      <div className="container-page flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between md:py-8">
        <div className="max-w-2xl">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-amber-700">
            DRE Expo
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold md:text-xl">
            DRE Expo — technologies, demonstrations, financing and business opportunities
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Register as an entrepreneur / customer or as a vendor / technology provider.
          </p>
        </div>
        <Link
          to="/expo"
          className="inline-flex shrink-0 items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
        >
          DRE Expo — Register Now <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

/**
 * Floating homepage CTA for the expo — same bottom-left slot and
 * structure as the solar calculator FAB it temporarily replaces.
 */
export function ExpoFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!EXPO_ENABLED || pathname !== "/") return null;

  return (
    <Link
      to="/expo"
      className="group fixed bottom-4 left-4 z-50 flex items-center gap-3 border border-white/15 bg-forest-deep px-3 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_24px_oklch(0.29_0.055_155/0.22)] transition-colors hover:bg-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-6 sm:left-6"
    >
      <span className="flex size-9 shrink-0 items-center justify-center bg-amber-400 text-amber-950">
        <Ticket className="size-4.5" strokeWidth={1.75} />
      </span>
      <span className="leading-tight">
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.12em] text-amber-300">
          DRE Expo
        </span>
        <span className="mt-0.5 block">Register Now</span>
      </span>
    </Link>
  );
}
