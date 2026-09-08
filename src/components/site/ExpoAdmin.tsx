// ============================================================
// TEMPORARY • DRE EXPO module — safe to remove after the expo.
// Admin reporting for expo registrations. Rendered from the
// "DRE Expo registrations" tab in src/routes/_authenticated/admin.tsx.
// Reads public.expo_registrations (RLS: admins with the 'expo'
// section, unrestricted admins and super admins only).
// ============================================================
import { useCallback, useEffect, useState } from "react";
import { Plug, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

type ExpoRow = {
  id: string;
  kind: "entrepreneur" | "vendor";
  payload: Record<string, unknown>;
  requires_electricity: boolean;
  power_requirement: string | null;
  created_at: string;
};

/** Payload string accessor (all form fields live in the jsonb payload). */
function ps(row: ExpoRow, key: string) {
  const value = row.payload[key];
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

/** Payload string-list accessor (interests / technologies). */
function pl(row: ExpoRow, key: string) {
  const value = row.payload[key];
  return Array.isArray(value) ? (value as string[]) : [];
}

const filters = [
  { key: "all", label: "All" },
  { key: "entrepreneur", label: "Entrepreneurs / Customers" },
  { key: "vendor", label: "Vendors" },
  { key: "power", label: "Needs electricity" },
] as const;
type Filter = (typeof filters)[number]["key"];

function countBy(lists: string[][]) {
  const counts = new Map<string, number>();
  for (const list of lists) for (const item of list) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="border border-border bg-muted/40 px-2 py-0.5 text-xs">
          {item}
        </span>
      ))}
    </div>
  );
}

export function ExpoRegistrations() {
  const [rows, setRows] = useState<ExpoRow[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(() => {
    void (
      supabase.from("expo_registrations" as never) as never as {
        select: (c: string) => {
          order: (
            c: string,
            o: { ascending: boolean },
          ) => Promise<{ data: unknown; error: { message: string } | null }>;
        };
      }
    )
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error(error.message);
          setRows([]);
          return;
        }
        setRows((data ?? []) as ExpoRow[]);
      });
  }, []);
  useEffect(load, [load]);

  if (!rows) return <p className="text-sm text-muted-foreground">Loading registrations…</p>;

  const vendors = rows.filter((r) => r.kind === "vendor");
  const entrepreneurs = rows.filter((r) => r.kind === "entrepreneur");
  const powerVendors = vendors.filter((r) => r.requires_electricity);

  const visible = rows.filter((r) => {
    if (filter === "entrepreneur") return r.kind === "entrepreneur";
    if (filter === "vendor") return r.kind === "vendor";
    if (filter === "power") return r.requires_electricity;
    return true;
  });

  const stats: [string, number][] = [
    ["Total registrations", rows.length],
    ["Entrepreneurs / Customers", entrepreneurs.length],
    ["Vendors", vendors.length],
    ["Vendors needing electricity", powerVendors.length],
  ];

  const breakdowns: [string, [string, number][]][] = [
    ["Vendor categories", countBy(vendors.map((r) => [ps(r, "category")]).filter((l) => l[0]))],
    ["Vendor technologies", countBy(vendors.map((r) => pl(r, "technologies")))],
    ["Participant interests", countBy(entrepreneurs.map((r) => pl(r, "interests")))],
  ];

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            DRE Expo registrations
            <span className="ml-2 text-sm font-normal text-muted-foreground">{rows.length}</span>
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-amber-700">
            DRE Expo — remove this tab after the event
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-sm hover:border-primary/60"
        >
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* headline stats */}
      <div className="mb-6 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-background p-4">
            <div className="font-display text-2xl font-semibold text-primary">{value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* breakdowns */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {breakdowns.map(([title, entries]) => (
          <div key={title} className="border border-border p-4">
            <h3 className="text-sm font-semibold">{title}</h3>
            {entries.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {entries.map(([label, count]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="text-foreground/80">{label}</span>
                    <span className="font-medium text-primary">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`border px-3 py-1.5 text-sm ${
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/60"
            }`}
          >
            {f.label}
            {f.key === "power" && powerVendors.length > 0 && ` (${powerVendors.length})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="border-y border-border py-6 text-sm text-muted-foreground">
          No registrations in this view yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((row) => (
            <li
              key={row.id}
              className={`border p-4 ${
                row.requires_electricity ? "border-amber-500/60 bg-amber-50/60" : "border-border"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium">
                  {row.kind === "vendor" ? "Vendor" : "Entrepreneur / Customer"}
                </span>
                {row.requires_electricity && (
                  <span className="inline-flex items-center gap-1 border border-amber-600/60 bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                    <Plug className="size-3" />
                    Needs electricity{row.power_requirement ? ` · ${row.power_requirement}` : ""}
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(row.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {row.kind === "vendor" ? (
                <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Organisation" value={ps(row, "organisation")} />
                  <Detail label="Contact person" value={ps(row, "contact_person")} />
                  <Detail label="Category" value={ps(row, "category")} />
                  <Detail label="Mobile" value={ps(row, "mobile")} />
                  <Detail label="Email" value={ps(row, "email")} />
                  <Detail label="Location / District" value={ps(row, "district")} />
                  <Detail label="Website" value={ps(row, "website")} />
                  <Detail
                    label="Experience"
                    value={ps(row, "experience_years") && `${ps(row, "experience_years")} yrs`}
                  />
                  <Detail label="Previous projects" value={ps(row, "previous_projects")} />
                  <Detail label="Service area" value={ps(row, "service_area")} />
                </dl>
              ) : (
                <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Full name" value={ps(row, "full_name")} />
                  <Detail label="Participant type" value={ps(row, "participant_type")} />
                  <Detail label="Mobile" value={ps(row, "mobile")} />
                  <Detail label="Email" value={ps(row, "email")} />
                  <Detail label="Organisation" value={ps(row, "organisation")} />
                  <Detail label="District / Location" value={ps(row, "district")} />
                </dl>
              )}

              <div className="mt-3">
                <Chips
                  items={row.kind === "vendor" ? pl(row, "technologies") : pl(row, "interests")}
                />
              </div>

              {(ps(row, "description") || ps(row, "requirement")) && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {ps(row, "description") || ps(row, "requirement")}
                </p>
              )}

              {row.kind === "vendor" && row.requires_electricity && (
                <div className="mt-3 border border-amber-500/50 bg-amber-50 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
                    <Plug className="size-3.5" /> Stall power — for expo planning
                  </p>
                  <dl className="mt-2 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    <Detail label="Approx. power" value={row.power_requirement ?? ""} />
                    <Detail label="Phase" value={ps(row, "power_phase")} />
                    <Detail label="Equipment operated" value={ps(row, "equipment")} />
                    <Detail label="Special requirements" value={ps(row, "electrical_notes")} />
                  </dl>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
