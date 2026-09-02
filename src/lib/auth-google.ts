import { supabase } from "@/integrations/supabase/client";

/**
 * Google sign-in using Supabase OAuth
 * (Previously supported both Lovable and Supabase, now Supabase only)
 */
export type GoogleSignInResult = {
  error?: unknown;
  redirected?: boolean;
};

export async function signInWithGoogle(redirectTo: string): Promise<GoogleSignInResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) return { error };
  // supabase-js performs a full-page redirect for the native flow.
  return { redirected: true };
}
