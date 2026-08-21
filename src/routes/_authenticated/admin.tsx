import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../../components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import {
  needStatuses,
  providerStatuses,
  providerTypeLabels,
  quoteStatuses,
  requestSourceLabels,
  requestStatuses,
  statusLabel,
  storyStatuses,
} from "../../lib/db";
import { useIsAdmin, useIsSuperAdmin, useMyAdminSections } from "../../lib/useAuth";
import { TAB_SECTION, canSee } from "@/lib/admin-posts";
import { AdministratorsPanel, WorkspacePanel } from "../../components/site/AdminWorkspace";
import { listJoinUsSubmissions, updateJoinUsStatus } from "@/lib/join-us-review.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin — UrjaSethu" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

type AnyRow = {
  id: string;
  [key: string]: unknown;
};

const tabs = [
  "Overview",
  "Join Us submissions",
  "Customer requests",
  "Stories",
  "Open needs",
  "Quotes",
  "Events",
  "Resources",
  "DRIVE impact",
  "DRIVE workspace",
  "Administrators",
] as const;
type Tab = (typeof tabs)[number];

function str(row: AnyRow, key: string) {
  const value = row[key];
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

async function selectAll(table: string, order: string, columns = "*") {
  const { data, error } = await supabase
    .from(table as never)
    .select(columns)
    .order(order, { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AnyRow[];
}

async function updateRow(table: string, id: string, patch: Record<string, unknown>) {
  const query = supabase.from(table as never) as never as {
    update: (v: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
    };
  };
  const { error } = await query.update(patch).eq("id", id);
  if (error) throw error;
}

function AdminPage() {
  const [userId, setUserId] = useState<string>();
  const isAdmin = useIsAdmin(userId);
  const isSuperAdmin = useIsSuperAdmin(userId) === true;
  const [tab, setTab] = useState<Tab>("Overview");
  const { sections } = useMyAdminSections(userId);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, []);

  const allowed = useCallback(
    (t: Tab) => {
      if (t === "Overview") return true;
      if (t === "Administrators") return isSuperAdmin;
      if (isSuperAdmin) return true;
      const key = TAB_SECTION[t];
      return key ? canSee(sections, key) : true;
    },
    [isSuperAdmin, sections],
  );

  if (isAdmin === null) {
    return <div className="container-page py-20 text-sm text-muted-foreground">Checking access…</div>;
  }

  if (!isAdmin) {
    return (
      <>
        <PageHeader
          eyebrow="Admin"
          title="You do not have access to this area"
          intro="The admin dashboard is limited to UrjaSethu administrators."
        />
        <div className="container-page py-12">
          <Link to="/" className="text-sm font-medium text-primary underline">
            Back to the platform
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="UrjaSethu administration"
        intro="Review applications, route customer requests to the right kind of provider and manage published content."
      />
      <div className="container-page py-10">
        <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4" aria-label="Admin sections">
          {tabs
            .filter((t) => t !== "Administrators" || isSuperAdmin)
            .map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`border px-3 py-1.5 text-sm ${
                  tab === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {t}
              </button>
            ))}
        </nav>


        {tab === "Overview" && <Overview onJump={setTab} />}
        {tab === "Join Us submissions" && <Providers />}
        {tab === "Customer requests" && <CustomerRequests />}
        {tab === "Stories" && <Stories />}
        {tab === "Open needs" && <Needs />}
        {tab === "Quotes" && <Quotes />}
        {tab === "Events" && <Events />}
        {tab === "Resources" && <Resources />}
        {tab === "DRIVE impact" && <Impact />}
        {tab === "DRIVE workspace" && <WorkspacePanel isSuperAdmin={isSuperAdmin} />}
        {tab === "Administrators" && isSuperAdmin && <AdministratorsPanel />}
      </div>
    </>
  );
}

/* ---------- shared bits ---------- */

function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Status"
      className="border border-input bg-background px-2 py-1 text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {statusLabel(o)}
        </option>
      ))}
    </select>
  );
}

function Panel({ title, count, children }: { title: string; count?: number | undefined; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">
        {title}
        {count !== undefined && <span className="ml-2 text-sm font-normal text-muted-foreground">{count}</span>}
      </h2>
      {children}
    </section>
  );
}

function Empty({ label = "Nothing here yet." }: { label?: string }) {
  return <p className="border-y border-border py-6 text-sm text-muted-foreground">{label}</p>;
}

function useTable(table: string, order: string, columns = "*") {
  const [rows, setRows] = useState<AnyRow[] | null>(null);
  const load = useCallback(() => {
    selectAll(table, order, columns)
      .then(setRows)
      .catch((e: Error) => toast.error(e.message));
  }, [table, order, columns]);
  useEffect(load, [load]);
  return { rows, reload: load };
}

async function saveStatus(table: string, id: string, status: string, reload: () => void) {
  try {
    await updateRow(table, id, { status });
    toast.success(`Status updated to ${statusLabel(status)}`);
    reload();
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Update failed");
  }
}

/* ---------- overview ---------- */

function Overview({ onJump }: { onJump: (t: Tab) => void }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    void (async () => {
      const queries: Array<[string, string, string, string[]]> = [
        ["New provider applications", "provider_applications", "status", ["pending", "under_review"]],
        ["Pending customer requests", "customer_requests", "status", ["new", "contacted"]],
        ["Open needs", "open_needs", "status", ["new", "published", "responses_received"]],
        ["New quote requests", "quote_requests", "status", ["new", "viewed"]],
        ["Pending stories", "story_submissions", "status", ["pending", "under_review"]],
      ];
      const next: Record<string, number> = {};
      for (const [label, table, col, values] of queries) {
        const { count } = await supabase
          .from(table as never)
          .select("*", { count: "exact", head: true })
          .in(col, values);
        next[label] = count ?? 0;
      }
      const { count: eventCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);
      next["Upcoming events"] = eventCount ?? 0;
      setCounts(next);
    })();
  }, []);

  const jumpFor: Record<string, Tab> = {
    "New provider applications": "Join Us submissions",
    "Pending customer requests": "Customer requests",
    "Open needs": "Open needs",
    "New quote requests": "Quotes",
    "Pending stories": "Stories",
    "Upcoming events": "Events",
  };

  return (
    <Panel title="Overview">
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(jumpFor).map(([label, target]) => (
          <button
            key={label}
            type="button"
            onClick={() => onJump(target)}
            className="bg-background p-5 text-left hover:bg-ivory"
          >
            <div className="font-display text-3xl font-semibold text-primary">{counts[label] ?? "—"}</div>
            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
          </button>
        ))}
      </div>
      <RecentEnquiries />
    </Panel>
  );
}

function RecentEnquiries() {
  const [rows, setRows] = useState<AnyRow[]>([]);
  useEffect(() => {
    void supabase
      .from("customer_requests")
      .select("id, source, name, problem, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setRows((data ?? []) as unknown as AnyRow[]));
  }, []);

  return (
    <div className="mt-10">
      <h3 className="mb-3 text-lg font-semibold">Recent enquiries</h3>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
              <span className="text-muted-foreground">{new Date(str(r, "created_at")).toLocaleDateString()}</span>
              <span className="font-medium">{requestSourceLabels[str(r, "source")] ?? str(r, "source")}</span>
              <span className="text-foreground/80">{str(r, "name")}</span>
              <span className="flex-1 truncate text-muted-foreground">{str(r, "problem")}</span>
              <span className="border border-border px-2 py-0.5 text-xs">{statusLabel(str(r, "status"))}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- providers ---------- */

const typeFilters = ["all", "solution", "finance", "network"] as const;

function parseDetails(description: string) {
  return description
    .split("\n")
    .map((line) => {
      const i = line.indexOf(":");
      if (i === -1) return null;
      const label = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      if (!label || !value) return null;
      return { label, value };
    })
    .filter((v): v is { label: string; value: string } => v !== null);
}

async function saveProviderStatus(id: string, status: string, reload: () => void) {
  try {
    const result = await updateJoinUsStatus({ data: { id, status } });
    const note =
      result.notified === "sent"
        ? ` · applicant notified at ${result.recipient ?? "their email"}`
        : result.notified === "suppressed"
          ? " · applicant could not be emailed (address blocked)"
          : result.notified === "failed"
            ? " · email notification failed"
            : "";
    toast.success(`Status updated to ${statusLabel(status)}${note}`);
    reload();
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Update failed");
  }
}

function Providers() {
  const [rows, setRows] = useState<AnyRow[] | null>(null);
  const reload = useCallback(() => {
    listJoinUsSubmissions({ data: undefined })
      .then((data) => setRows(data as unknown as AnyRow[]))
      .catch((e: Error) => toast.error(e.message));
  }, []);
  useEffect(reload, [reload]);
  const [filter, setFilter] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  if (!rows) return <Empty label="Loading…" />;

  const term = q.trim().toLowerCase();
  const visible = rows.filter((r) => {
    if (filter !== "all" && str(r, "provider_type") !== filter) return false;
    if (status !== "all" && str(r, "status") !== status) return false;
    if (!term) return true;
    return ["organisation", "contact_person", "email", "phone", "location", "services", "description"].some((k) =>
      str(r, k).toLowerCase().includes(term),
    );
  });

  const countBy = (predicate: (r: AnyRow) => boolean) => rows.filter(predicate).length;

  return (
    <Panel title="Join Us submissions" count={rows.length}>
      <div className="mb-6 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Awaiting review", countBy((r) => ["pending", "under_review"].includes(str(r, "status")))],
          ["Solution providers", countBy((r) => str(r, "provider_type") === "solution")],
          ["Finance providers", countBy((r) => str(r, "provider_type") === "finance")],
          ["Network partners", countBy((r) => str(r, "provider_type") === "network")],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-background p-4">
            <div className="font-display text-2xl font-semibold text-primary">{value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {typeFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`border px-3 py-1 text-sm ${filter === f ? "border-primary text-primary" : "border-border"}`}
          >
            {f === "all" ? "All types" : providerTypeLabels[f as "solution"]}
          </button>
        ))}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by review status"
          className="border border-input bg-background px-2 py-1.5 text-sm"
        >
          <option value="all">All statuses</option>
          {providerStatuses.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search organisation, contact, location…"
          aria-label="Search submissions"
          className="min-w-56 flex-1 border border-input bg-background px-3 py-1.5 text-sm"
        />
      </div>

      <p className="mb-2 text-xs text-muted-foreground">
        Showing {visible.length} of {rows.length} submissions
      </p>

      {visible.length === 0 ? (
        <Empty label="No submissions match these filters." />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {visible.map((r) => {
            const services = String(r["services"] ?? "")
              .replace(/[{}"]/g, "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            const details = parseDetails(str(r, "description"));
            const isOpen = open === r.id;
            return (
              <li key={r.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_18rem]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold">{str(r, "organisation")}</h3>
                    <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {providerTypeLabels[str(r, "provider_type") as "solution"] ?? str(r, "provider_type")}
                    </span>
                    <span className="border border-primary/40 px-2 py-0.5 text-xs text-primary">
                      {statusLabel(str(r, "status"))}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[str(r, "contact_person"), str(r, "email"), str(r, "phone"), str(r, "location")]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {str(r, "website") && (
                    <p className="mt-1 text-sm">
                      <a href={str(r, "website")} target="_blank" rel="noreferrer" className="text-primary underline">
                        {str(r, "website")}
                      </a>
                    </p>
                  )}
                  {services.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {services.map((s) => (
                        <li key={s} className="border border-border px-2 py-0.5 text-xs text-foreground/80">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Applied {new Date(str(r, "applied_at")).toLocaleDateString()}
                    {str(r, "admin_notes") && " · has internal notes"}
                  </p>

                  {details.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : r.id)}
                        className="mt-2 text-xs font-medium text-primary underline"
                      >
                        {isOpen ? "Hide submitted answers" : `View submitted answers (${details.length})`}
                      </button>
                      {isOpen && (
                        <dl className="mt-3 grid max-w-2xl gap-x-6 gap-y-2 border border-border p-4 text-sm sm:grid-cols-2">
                          {details.map((d) => (
                            <div key={d.label}>
                              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{d.label}</dt>
                              <dd className="text-foreground/90">{d.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <StatusSelect
                    value={str(r, "status")}
                    options={providerStatuses}
                    onChange={(v) => void saveProviderStatus(r.id, v, reload)}
                  />

                  <AdminNotes table="provider_applications" row={r} reload={reload} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted-foreground">Only approved providers appear in the public directory.</p>
    </Panel>
  );
}


function AdminNotes({ table, row, reload }: { table: string; row: AnyRow; reload: () => void }) {
  const [notes, setNotes] = useState(str(row, "admin_notes"));
  return (
    <div className="w-full lg:w-64">
      <textarea
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Internal notes"
        aria-label="Internal notes"
        className="w-full border border-input bg-background px-2 py-1 text-sm"
      />
      <button
        type="button"
        onClick={() => {
          updateRow(table, row.id, { admin_notes: notes })
            .then(() => {
              toast.success("Notes saved");
              reload();
            })
            .catch((e: Error) => toast.error(e.message));
        }}
        className="mt-1 text-xs font-medium text-primary underline"
      >
        Save notes
      </button>
    </div>
  );
}

/* ---------- customer requests ---------- */

function CustomerRequests() {
  const { rows, reload } = useTable("customer_requests", "created_at");
  const [providers, setProviders] = useState<AnyRow[]>([]);

  useEffect(() => {
    void supabase
      .from("provider_applications")
      .select("id, organisation, provider_type")
      .eq("status", "approved")
      .then(({ data }) => setProviders((data ?? []) as unknown as AnyRow[]));
  }, []);

  if (!rows) return <Empty label="Loading…" />;

  return (
    <Panel title="Customer requests" count={rows.length}>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <li key={r.id} className="grid gap-3 py-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {requestSourceLabels[str(r, "source")] ?? str(r, "source")}
                  </span>
                  <h3 className="font-medium">{str(r, "name") || str(r, "business_name") || "Unnamed"}</h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(str(r, "created_at")).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {str(r, "email")} · {str(r, "phone")} · {str(r, "location")}
                </p>
                <p className="mt-2 max-w-2xl text-sm">{str(r, "problem")}</p>
                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                  {str(r, "requirement") && <div>Requirement: {str(r, "requirement")}</div>}
                  {str(r, "solution_interest") && <div>Interest: {str(r, "solution_interest")}</div>}
                  {str(r, "budget") && <div>Budget: {str(r, "budget")}</div>}
                  {str(r, "timeline") && <div>Timeline: {str(r, "timeline")}</div>}
                </dl>
              </div>
              <div className="flex flex-col items-start gap-2 lg:items-end">
                <StatusSelect
                  value={str(r, "status")}
                  options={requestStatuses}
                  onChange={(v) => void saveStatus("customer_requests", r.id, v, reload)}
                />
                <select
                  aria-label="Assign to provider"
                  value={str(r, "assigned_provider_id")}
                  onChange={(e) => {
                    updateRow("customer_requests", r.id, {
                      assigned_provider_id: e.target.value || null,
                      status: e.target.value ? "assigned" : str(r, "status"),
                    })
                      .then(() => {
                        toast.success("Assignment updated");
                        reload();
                      })
                      .catch((err: Error) => toast.error(err.message));
                  }}
                  className="w-64 border border-input bg-background px-2 py-1 text-sm"
                >
                  <option value="">Assign to expert…</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {str(p, "organisation")} — {providerTypeLabels[str(p, "provider_type") as "solution"]}
                    </option>
                  ))}
                </select>
                <AdminNotes table="customer_requests" row={r} reload={reload} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- stories ---------- */

function Stories() {
  const { rows, reload } = useTable(
    "story_submissions",
    "created_at",
    "id, slug, title, business_name, sector, location, problem, solution, outcome, status, created_at",
  );
  if (!rows) return <Empty label="Loading…" />;

  return (
    <Panel title="Business stories" count={rows.length}>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <li key={r.id} className="grid gap-3 py-5 lg:grid-cols-[1fr_auto]">
              <div>
                <h3 className="font-display text-lg font-semibold">{str(r, "title")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {str(r, "business_name")} · {str(r, "sector")} · {str(r, "location")}
                </p>
                <EditableStory row={r} reload={reload} />
              </div>
              <StatusSelect
                value={str(r, "status")}
                options={storyStatuses}
                onChange={(v) => void saveStatus("story_submissions", r.id, v, reload)}
              />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted-foreground">Only approved stories appear publicly.</p>
    </Panel>
  );
}

function EditableStory({ row, reload }: { row: AnyRow; reload: () => void }) {
  const [problem, setProblem] = useState(str(row, "problem"));
  const [solution, setSolution] = useState(str(row, "solution"));
  const [outcome, setOutcome] = useState(str(row, "outcome"));
  return (
    <div className="mt-3 grid max-w-2xl gap-2">
      <TextArea label="Problem" value={problem} onChange={setProblem} />
      <TextArea label="Solution" value={solution} onChange={setSolution} />
      <TextArea label="Outcome" value={outcome} onChange={setOutcome} />
      <button
        type="button"
        onClick={() => {
          updateRow("story_submissions", row.id, { problem, solution, outcome })
            .then(() => {
              toast.success("Story updated");
              reload();
            })
            .catch((e: Error) => toast.error(e.message));
        }}
        className="justify-self-start border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
      >
        Save edits
      </button>
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-input bg-background px-2 py-1 text-sm"
      />
    </label>
  );
}

/* ---------- open needs ---------- */

function Needs() {
  const { rows, reload } = useTable(
    "open_needs",
    "created_at",
    "id, title, business_name, sector, location, description, budget, timeline, status, created_at",
  );
  const [responses, setResponses] = useState<AnyRow[]>([]);

  useEffect(() => {
    void supabase
      .from("need_responses")
      .select("id, need_id, contact_name, contact_email, message, created_at")
      .then(({ data }) => setResponses((data ?? []) as unknown as AnyRow[]));
  }, []);

  if (!rows) return <Empty label="Loading…" />;

  return (
    <Panel title="Open needs" count={rows.length}>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((r) => {
            const rs = responses.filter((x) => str(x, "need_id") === r.id);
            return (
              <li key={r.id} className="grid gap-3 py-5 lg:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="font-display text-lg font-semibold">{str(r, "title")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {str(r, "business_name")} · {str(r, "sector")} · {str(r, "location")}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm">{str(r, "description")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Budget {str(r, "budget") || "—"} · Timeline {str(r, "timeline") || "—"} · {rs.length} response(s)
                  </p>
                  {rs.length > 0 && (
                    <ul className="mt-2 space-y-1 border-l border-border pl-3">
                      {rs.map((x) => (
                        <li key={x.id} className="text-sm text-foreground/85">
                          <span className="font-medium">{str(x, "contact_name") || "Provider"}</span>{" "}
                          <span className="text-muted-foreground">{str(x, "contact_email")}</span> — {str(x, "message")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <StatusSelect
                  value={str(r, "status")}
                  options={needStatuses}
                  onChange={(v) => void saveStatus("open_needs", r.id, v, reload)}
                />
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Needs are visible publicly once the status is Published, Responses received or Matched.
      </p>
    </Panel>
  );
}

/* ---------- quotes ---------- */

function Quotes() {
  const { rows, reload } = useTable("quote_requests", "created_at");
  if (!rows) return <Empty label="Loading…" />;

  return (
    <Panel title="Quote requests" count={rows.length}>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <li key={r.id} className="grid gap-3 py-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-medium">{str(r, "name") || "Customer"}</h3>
                  <span className="text-xs text-muted-foreground">→ {str(r, "provider_ref") || "Provider"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(str(r, "created_at")).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {str(r, "email")} · {str(r, "phone")}
                </p>
                <p className="mt-2 max-w-2xl text-sm">{str(r, "requirement") || str(r, "message")}</p>
              </div>
              <StatusSelect
                value={str(r, "status")}
                options={quoteStatuses}
                onChange={(v) => void saveStatus("quote_requests", r.id, v, reload)}
              />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- events ---------- */

function Events() {
  const { rows, reload } = useTable("events", "starts_at");
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_type: "workshop",
    starts_at: "",
    location: "",
    registration_url: "",
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("events").insert({
      title: form.title,
      description: form.description || null,
      event_type: form.event_type,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      location: form.location || null,
      registration_url: form.registration_url || null,
      is_published: false,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Event created (unpublished)");
    setForm({ title: "", description: "", event_type: "workshop", starts_at: "", location: "", registration_url: "" });
    reload();
  }

  return (
    <Panel title="Events and awareness programmes" count={rows?.length}>
      <form onSubmit={create} className="mb-8 grid gap-4 border border-border bg-ivory p-5 md:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <div>
          <label htmlFor="etype" className="mb-1.5 block text-sm font-medium">
            Type
          </label>
          <select
            id="etype"
            value={form.event_type}
            onChange={(e) => setForm({ ...form, event_type: e.target.value })}
            className="w-full border border-input bg-background px-3 py-2 text-sm"
          >
            {["workshop", "awareness", "training", "webinar", "other"].map((t) => (
              <option key={t} value={t}>
                {statusLabel(t)}
              </option>
            ))}
          </select>
        </div>
        <Input label="Date and time" type="datetime-local" value={form.starts_at} onChange={(v) => setForm({ ...form, starts_at: v })} />
        <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <Input label="Registration link" value={form.registration_url} onChange={(v) => setForm({ ...form, registration_url: v })} className="md:col-span-2" />
        <div className="md:col-span-2">
          <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        </div>
        <button
          type="submit"
          className="bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-forest-deep md:justify-self-start"
        >
          Add event
        </button>
      </form>

      {!rows || rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="flex-1">
                <h3 className="font-medium">{str(r, "title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {str(r, "starts_at") ? new Date(str(r, "starts_at")).toLocaleString() : "Date to be announced"} ·{" "}
                  {str(r, "location") || "Location to be announced"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateRow("events", r.id, { is_published: !r["is_published"] })
                    .then(() => {
                      toast.success("Event updated");
                      reload();
                    })
                    .catch((e: Error) => toast.error(e.message));
                }}
                className="border border-border px-3 py-1 text-sm hover:border-primary"
              >
                {r["is_published"] ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => {
                  supabase
                    .from("events")
                    .delete()
                    .eq("id", r.id)
                    .then(({ error }) => {
                      if (error) toast.error(error.message);
                      else {
                        toast.success("Event deleted");
                        reload();
                      }
                    });
                }}
                className="text-sm text-muted-foreground underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- resources ---------- */

const resourceCategories = [
  "dre-basics",
  "government-schemes",
  "finance-funding",
  "dre-technologies",
  "business-opportunities",
  "game-drive",
  "case-studies",
  "guides-toolkits",
  "blogs-insights",
];

function Resources() {
  const { rows, reload } = useTable("resources", "created_at");
  const [form, setForm] = useState({
    category: resourceCategories[0] as string,
    title: "",
    summary: "",
    body: "",
    source_name: "",
    source_url: "",
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("resources").insert({
      category: form.category,
      title: form.title,
      summary: form.summary || null,
      body: form.body || null,
      source_name: form.source_name || null,
      source_url: form.source_url || null,
      is_published: true,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Resource published");
    setForm({ category: resourceCategories[0] as string, title: "", summary: "", body: "", source_name: "", source_url: "" });
    reload();
  }

  return (
    <Panel title="Resources" count={rows?.length}>
      <form onSubmit={create} className="mb-8 grid gap-4 border border-border bg-ivory p-5 md:grid-cols-2">
        <div>
          <label htmlFor="rcat" className="mb-1.5 block text-sm font-medium">
            Category
          </label>
          <select
            id="rcat"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-input bg-background px-3 py-2 text-sm"
          >
            {resourceCategories.map((c) => (
              <option key={c} value={c}>
                {statusLabel(c.replace(/-/g, " "))}
              </option>
            ))}
          </select>
        </div>
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <Input label="Source name" value={form.source_name} onChange={(v) => setForm({ ...form, source_name: v })} />
        <Input label="Official source link" value={form.source_url} onChange={(v) => setForm({ ...form, source_url: v })} />
        <div className="md:col-span-2">
          <TextArea label="Summary" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} />
        </div>
        <div className="md:col-span-2">
          <TextArea label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} />
        </div>
        <button
          type="submit"
          className="bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-forest-deep md:justify-self-start"
        >
          Add resource
        </button>
      </form>

      {!rows || rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="flex-1">
                <h3 className="font-medium">{str(r, "title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {statusLabel(str(r, "category").replace(/-/g, " "))}
                  {str(r, "source_name") ? ` · ${str(r, "source_name")}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateRow("resources", r.id, { is_published: !r["is_published"] })
                    .then(() => {
                      toast.success("Resource updated");
                      reload();
                    })
                    .catch((e: Error) => toast.error(e.message));
                }}
                className="border border-border px-3 py-1 text-sm hover:border-primary"
              >
                {r["is_published"] ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => {
                  supabase
                    .from("resources")
                    .delete()
                    .eq("id", r.id)
                    .then(({ error }) => {
                      if (error) toast.error(error.message);
                      else {
                        toast.success("Resource deleted");
                        reload();
                      }
                    });
                }}
                className="text-sm text-muted-foreground underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- impact ---------- */

function Impact() {
  const { rows, reload } = useTable("impact_metrics", "sort_order");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  if (!rows) return <Empty label="Loading…" />;

  return (
    <Panel title="DRIVE impact metrics">
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        These values appear on the DRIVE page. Only publish figures that have been verified.
      </p>
      <ul className="divide-y divide-border border-y border-border">
        {[...rows].reverse().map((r) => (
          <MetricRow key={r.id} row={r} reload={reload} />
        ))}
      </ul>
      <form
        className="mt-6 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          supabase
            .from("impact_metrics")
            .insert({ label, value, sort_order: rows.length + 1 })
            .then(({ error }) => {
              if (error) toast.error(error.message);
              else {
                toast.success("Metric added");
                setLabel("");
                setValue("");
                reload();
              }
            });
        }}
      >
        <Input label="New metric" value={label} onChange={setLabel} required />
        <Input label="Value" value={value} onChange={setValue} required />
        <button type="submit" className="border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground">
          Add metric
        </button>
      </form>
    </Panel>
  );
}

function MetricRow({ row, reload }: { row: AnyRow; reload: () => void }) {
  const [value, setValue] = useState(str(row, "value"));
  const [note, setNote] = useState(str(row, "note"));
  return (
    <li className="flex flex-wrap items-end gap-3 py-4">
      <div className="min-w-40 flex-1 text-sm font-medium">{str(row, "label")}</div>
      <Input label="Value" value={value} onChange={setValue} />
      <Input label="Note" value={note} onChange={setNote} />
      <button
        type="button"
        onClick={() => {
          updateRow("impact_metrics", row.id, { value, note })
            .then(() => {
              toast.success("Metric updated");
              reload();
            })
            .catch((e: Error) => toast.error(e.message));
        }}
        className="border border-border px-3 py-2 text-sm hover:border-primary"
      >
        Save
      </button>
    </li>
  );
}

/* ---------- inputs ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  const id = `f-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
