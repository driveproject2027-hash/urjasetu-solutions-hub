// Authentication integration - uses Supabase for all auth providers
// This was previously using Lovable Cloud Auth but now uses native Supabase OAuth

import { supabase } from "../supabase/client";

export const lovable = {
  auth: {
    signInWithOAuth: async (
      provider: "google" | "apple" | "microsoft" | "lovable",
      opts?: { redirect_uri?: string; extraParams?: Record<string, string> }
    ) => {
      // Map lovable provider to supabase provider (lovable provider is no longer available)
      const providerMap: Record<string, "google" | "apple" | "microsoft"> = {
        google: "google",
        apple: "apple",
        microsoft: "microsoft",
        lovable: "google", // fallback to google
      };

      const supabaseProvider = providerMap[provider] || "google";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider,
        options: {
          redirectTo: opts?.redirect_uri,
        },
      });

      if (error) {
        return { error, redirected: false };
      }

      // Supabase performs a full-page redirect for OAuth
      return { redirected: true };
    },
  },
};
