import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}

export function useIsSuperAdmin(userId: string | undefined) {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsSuperAdmin(null);
      return;
    }
    let active = true;
    supabase
      .rpc("has_role", { _user_id: userId, _role: "super_admin" })
      .then(({ data }) => {
        if (active) setIsSuperAdmin(Boolean(data));
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return isSuperAdmin;
}

/** Sections the signed-in admin may edit. `null` = unrestricted (no scoped post). */
export function useMyAdminSections(userId: string | undefined) {
  const [sections, setSections] = useState<string[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) {
      setSections(null);
      setLoaded(false);
      return;
    }
    let active = true;
    void supabase
      .from("admin_permissions")
      .select("sections")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setSections((data?.sections as string[] | undefined) ?? null);
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return { sections, loaded };
}

export function useIsAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(null);
      return;
    }
    let active = true;
    supabase
      .rpc("has_role", { _user_id: userId, _role: "admin" })
      .then(({ data }) => {
        if (active) setIsAdmin(Boolean(data));
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return isAdmin;
}
