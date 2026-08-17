import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "../../components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { statusLabel, requestSourceLabels } from "../../lib/db";
import { useIsAdmin } from "../../lib/useAuth";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [{ title: "Your account — UrjaSethu" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Account,
});

type Row = {
  id: string;
  source?: string | null;
  problem?: string | null;
  status?: string | null;
  provider_ref?: string | null;
  requirement?: string | null;
  organisation?: string | null;
  provider_type?: string | null;
};

function Account() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [requests, setRequests] = useState<Row[]>([]);
  const [quotes, setQuotes] = useState<Row[]>([]);
  const [applications, setApplications] = useState<Row[]>([]);
  const isAdmin = useIsAdmin(userId);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id);
      setEmail(data.user?.email ?? undefined);
      const [r, q, a] = await Promise.all([
        supabase.from("customer_requests").select("id, source, problem, status, created_at").order("created_at", { ascending: false }),
        supabase.from("quote_requests").select("id, provider_ref, requirement, status, created_at").order("created_at", { ascending: false }),
        supabase.from("provider_applications").select("id, organisation, provider_type, status, applied_at").order("applied_at", { ascending: false }),
      ]);
      setRequests((r.data ?? []) as Row[]);
      setQuotes((q.data ?? []) as Row[]);
      setApplications((a.data ?? []) as Row[]);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    void navigate({ to: "/", replace: true });
  }

  return (
    <>
      <PageHeader eyebrow="Account" title="Your UrjaSethu activity" intro={email ?? ""}>
        <div className="flex flex-wrap gap-4">
          {isAdmin && (
            <Link to="/admin" className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep">
              Open admin dashboard
            </Link>
          )}
          <button type="button" onClick={signOut} className="border border-border px-5 py-3 text-sm font-medium hover:border-primary">
            Sign out
          </button>
        </div>
      </PageHeader>

      <div className="container-page space-y-12 py-12">
        <Section title="Your enquiries">
          {requests.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {requests.map((r) => (
                <li key={r.id} className="py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium">{requestSourceLabels[r.source ?? ""] ?? r.source}</span>
                    <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">{statusLabel(r.status ?? "")}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/85">{r.problem}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Your quote requests">
          {quotes.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {quotes.map((q) => (
                <li key={q.id} className="py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium">{q.provider_ref ?? "Provider"}</span>
                    <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">{statusLabel(q.status ?? "")}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/85">{q.requirement}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Your provider applications">
          {applications.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {applications.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 py-4">
                  <span className="text-sm font-medium">{a.organisation}</span>
                  <span className="text-xs text-muted-foreground">{a.provider_type}</span>
                  <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">{statusLabel(a.status ?? "")}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Empty() {
  return <p className="border-y border-border py-6 text-sm text-muted-foreground">Nothing here yet.</p>;
}
