import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

/**
 * Google sign-in with two backends.
 *
 * Default (unset flag): the Lovable broker — the iframe-safe flow used by the
 * published site and the editor preview. Behaviour is unchanged.
 *
 * Self-hosted: set `VITE_AUTH_GOOGLE_MODE=supabase` in `.env` to use the
 * native Supabase OAuth redirect instead, for deployments that do not run on
 * Lovable infrastructure. Requires the Google provider to be enabled in your
 * own Supabase project.
 */
export type GoogleSignInResult = {
  error?: unknown;
  redirected?: boolean;
};

function useNativeOAuth() {
  return import.meta.env['VITE_AUTH_GOOGLE_MODE'] === "supabase";
}

export async function signInWithGoogle(redirectTo: string): Promise<GoogleSignInResult> {
  if (useNativeOAuth()) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) return { error };
    // supabase-js performs a full-page redirect for the native flow.
    return { redirected: true };
  }

  return lovable.auth.signInWithOAuth("google", { redirect_uri: redirectTo });
}
