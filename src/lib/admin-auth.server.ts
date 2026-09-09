import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

// Context produced by the requireSupabaseAuth middleware.
export type SupabaseAuthContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
  claims: Record<string, unknown>;
};

/**
 * Throws unless the authenticated user holds the given admin section role,
 * checked server-side through the `has_admin_section` RPC.
 */
export async function assertAdminSection(
  context: SupabaseAuthContext,
  section: string,
): Promise<void> {
  const { data, error } = await context.supabase.rpc("has_admin_section", {
    _user_id: context.userId,
    _section: section,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

/**
 * Throws unless the authenticated user holds the `super_admin` role,
 * checked server-side through the `has_role` RPC.
 */
export async function assertSuperAdmin(context: SupabaseAuthContext): Promise<void> {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}
