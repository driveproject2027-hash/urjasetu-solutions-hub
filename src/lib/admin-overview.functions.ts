import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// The Overview panel previously counted rows directly from the browser using
// the public (anon) client. Public read grants on these tables were revoked
// (see migration 20260821072434), so those counts silently returned 0.
// Counts now come from this verified admin server function using the
// service-role client, consistent with the other admin reads.

export type AdminOverviewCounts = Record<string, number>;

export const getAdminOverviewCounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminOverviewCounts> => {
    const { supabase, userId } = context;
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin as unknown as {
      from: (t: string) => {
        select: (
          c: string,
          o?: Record<string, unknown>,
        ) => {
          in: (
            col: string,
            v: string[],
          ) => Promise<{ count: number | null; error: { message: string } | null }>;
          eq: (
            col: string,
            v: unknown,
          ) => Promise<{ count: number | null; error: { message: string } | null }>;
        };
      };
    };

    async function countIn(table: string, values: string[]): Promise<number> {
      const { count, error } = await client
        .from(table)
        .select("*", { count: "exact", head: true })
        .in("status", values);
      if (error) throw new Error(error.message);
      return count ?? 0;
    }

    async function countEq(table: string, col: string, value: unknown): Promise<number> {
      const { count, error } = await client
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq(col, value);
      if (error) throw new Error(error.message);
      return count ?? 0;
    }

    const [
      newProviderApplications,
      pendingCustomerRequests,
      openNeeds,
      newQuoteRequests,
      pendingStories,
      upcomingEvents,
    ] = await Promise.all([
      countIn("provider_applications", ["pending", "under_review"]),
      countIn("customer_requests", ["new", "contacted"]),
      countIn("open_needs", ["new", "published", "responses_received"]),
      countIn("quote_requests", ["new", "viewed"]),
      countIn("story_submissions", ["pending", "under_review"]),
      countEq("events", "is_published", true),
    ]);

    return {
      "New provider applications": newProviderApplications,
      "Pending customer requests": pendingCustomerRequests,
      "Open needs": openNeeds,
      "New quote requests": newQuoteRequests,
      "Pending stories": pendingStories,
      "Upcoming events": upcomingEvents,
    };
  });

export type RecentEnquiry = {
  id: string;
  source: string;
  name: string | null;
  problem: string | null;
  status: string;
  created_at: string;
};

export const getRecentEnquiries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<RecentEnquiry[]> => {
    const { supabase, userId } = context;
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("customer_requests")
      .select("id, source, name, problem, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw new Error(error.message);
    return (data ?? []) as RecentEnquiry[];
  });
