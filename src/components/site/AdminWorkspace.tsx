import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { listAdmins, setAdminAccess, type AdminUser } from "@/lib/admin-roles.functions";
import { ADMIN_POSTS, ADMIN_SECTIONS, postLabel } from "@/lib/admin-posts";

type WorkspaceLink = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  super_admin_only: boolean;
};

/* ---------- gated internal workspace ---------- */

export function WorkspacePanel({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [links, setLinks] = useState<WorkspaceLink[] | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const load = useCallback(() => {
    void (supabase.from("workspace_links" as never) as never as {
      select: (c: string) => { order: (c: string) => Promise<{ data: unknown; error: { message: string } | null }> };
    })
      .select("*")
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) {
          toast.error(error.message);
          return;
        }
        const rows = (data ?? []) as WorkspaceLink[];
        setLinks(rows);
        setActive((prev) => prev ?? rows[0]?.id ?? null);
      });
  }, []);

  useEffect(load, [load]);

  if (!links) return <p className="text-sm text-muted-foreground">Loading workspace…</p>;
  if (links.length === 0)
    return <p className="border-y border-border py-6 text-sm text-muted-foreground">No workspace links yet.</p>;

  const current = links.find((l) => l.id === active) ?? links[0]!;

  return (
    <section>
      <h2 className="mb-1 text-xl font-semibold">Internal workspace</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        Private DRIVE and programme material. Visible only to signed-in UrjaSethu administrators.
        {isSuperAdmin ? " As a super admin you can add or remove links below." : ""}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActive(l.id)}
            className={`border px-3 py-1.5 text-sm ${
              l.id === current.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/60"
            }`}
          >
            {l.title}
          </button>
        ))}
      </div>

      <div className="border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium">{current.title}</p>
            {current.description && (
              <p className="text-xs text-muted-foreground">{current.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={current.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-medium text-primary underline"
            >
              Open in a new tab
            </a>
            {isSuperAdmin && (
              <button
                type="button"
                className="text-sm text-destructive underline"
                onClick={() => {
                  void (async () => {
                    const query = supabase.from("workspace_links" as never) as never as {
                      delete: () => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
                    };
                    const { error } = await query.delete().eq("id", current.id);
                    if (error) toast.error(error.message);
                    else {
                      toast.success("Link removed");
                      setActive(null);
                      load();
                    }
                  })();
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <iframe
          key={current.id}
          title={current.title}
          src={current.url}
          className="h-[75vh] w-full bg-background"
          referrerPolicy="no-referrer"
        />
        <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          If the embedded view stays blank, the source blocks embedding — use “Open in a new tab”.
        </p>
      </div>

      {isSuperAdmin && <AddLinkForm onSaved={load} />}
    </section>
  );
}

function AddLinkForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [superOnly, setSuperOnly] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="mt-8 max-w-xl space-y-3 border border-border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        setBusy(true);
        void (async () => {
          const query = supabase.from("workspace_links" as never) as never as {
            insert: (v: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
          };
          const { error } = await query.insert({
            title,
            url,
            description: description || null,
            super_admin_only: superOnly,
          });
          setBusy(false);
          if (error) toast.error(error.message);
          else {
            toast.success("Workspace link added");
            setTitle("");
            setUrl("");
            setDescription("");
            setSuperOnly(false);
            onSaved();
          }
        })();
      }}
    >
      <h3 className="text-sm font-semibold">Add a workspace link</h3>
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border border-input bg-background px-3 py-2 text-sm"
      />
      <input
        required
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://…"
        className="w-full border border-input bg-background px-3 py-2 text-sm"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description (optional)"
        className="w-full border border-input bg-background px-3 py-2 text-sm"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={superOnly} onChange={(e) => setSuperOnly(e.target.checked)} />
        Restrict to super admins only
      </label>
      <button
        type="submit"
        disabled={busy}
        className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        Add link
      </button>
    </form>
  );
}

/* ---------- super admin: administrators ---------- */

export function AdministratorsPanel() {
  const [rows, setRows] = useState<AdminUser[] | null>(null);
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<"admin" | "super_admin">("admin");
  const [post, setPost] = useState<string>("full_admin");
  const [sections, setSections] = useState<string[]>(["all"]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    listAdmins({ data: undefined })
      .then(setRows)
      .catch((e: Error) => toast.error(e.message));
  }, []);

  useEffect(load, [load]);

  function choosePost(key: string) {
    setPost(key);
    const preset = ADMIN_POSTS.find((p) => p.key === key);
    if (preset && key !== "custom") setSections(preset.sections);
    if (key === "custom") setSections([]);
  }

  function toggleSection(key: string) {
    setPost("custom");
    setSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev.filter((s) => s !== "all"), key],
    );
  }

  async function apply(
    targetEmail: string,
    targetLevel: "admin" | "super_admin" | "none",
    targetPost = "full_admin",
    targetSections: string[] = ["all"],
  ) {
    setBusy(true);
    try {
      await setAdminAccess({
        data: { email: targetEmail, level: targetLevel, post: targetPost, sections: targetSections },
      });
      toast.success("Access updated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="mb-1 text-xl font-semibold">Administrators</h2>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Super admins manage who can access the admin area. The person must already have an UrjaSethu account.
      </p>

      <form
        className="mb-8 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void apply(email, level, post, level === "super_admin" ? ["all"] : sections).then(() =>
            setEmail(""),
          );
        }}
      >
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">
            Account email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-72 border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="admin-level" className="mb-1 block text-sm font-medium">
            Access level
          </label>
          <select
            id="admin-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as "admin" | "super_admin")}
            className="border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </select>
        </div>
        {level === "admin" && (
          <div>
            <label htmlFor="admin-post" className="mb-1 block text-sm font-medium">
              Post
            </label>
            <select
              id="admin-post"
              value={post}
              onChange={(e) => choosePost(e.target.value)}
              className="border border-input bg-background px-3 py-2 text-sm"
            >
              {ADMIN_POSTS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          Grant access
        </button>

        {level === "admin" && post !== "full_admin" && (
          <fieldset className="w-full border border-border p-4">
            <legend className="px-1 text-sm font-medium">Sections this post can manage</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {ADMIN_SECTIONS.map((s) => (
                <label key={s.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sections.includes("all") || sections.includes(s.key)}
                    onChange={() => toggleSection(s.key)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Leave every box ticked-off empty to give this admin full access.
            </p>
          </fieldset>
        )}
      </form>

      {!rows ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="border-y border-border py-6 text-sm text-muted-foreground">No administrators yet.</p>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <div key={r.userId} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium">{r.fullName || r.email || r.userId}</p>
                <p className="text-xs text-muted-foreground">
                  {r.email} — {r.level === "super_admin" ? "Super admin" : postLabel(r.post)}
                </p>
                {r.level === "admin" && !r.sections.includes("all") && (
                  <p className="text-xs text-muted-foreground">
                    Sections:{" "}
                    {r.sections
                      .map((s) => ADMIN_SECTIONS.find((x) => x.key === s)?.label ?? s)
                      .join(", ") || "none"}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                {r.level === "admin" ? (
                  <button
                    type="button"
                    disabled={busy}
                    className="text-sm text-primary underline"
                    onClick={() => void apply(r.email, "super_admin")}
                  >
                    Make super admin
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    className="text-sm text-primary underline"
                    onClick={() => void apply(r.email, "admin", r.post, r.sections)}
                  >
                    Make normal admin
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  className="text-sm text-destructive underline"
                  onClick={() => void apply(r.email, "none")}
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
