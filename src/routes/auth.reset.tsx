import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/reset")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — LayaGreenEnergy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // A recovery link creates a temporary authenticated session. Do not treat a
    // normal signed-in session as proof that this page was opened from a reset
    // email, otherwise any existing session can bypass the password form.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        window.sessionStorage.setItem("laya-password-recovery", "1");
        setReady(true);
      }
    });

    // Keep the recovery session active while the form is open so updateUser can
    // consume it. After a successful update, onSubmit signs it out.
    return () => data.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      toast.success("Password updated", {
        description: "Your password has been updated. Please sign in again.",
      });
      setMessage("Your password has been updated. Redirecting to sign in…");
      setTimeout(() => void navigate({ to: "/auth" }), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Set a new password"
        intro="Choose a new password for your LayaGreenEnergy account."
      />
      <div className="container-page max-w-md py-12">
        {message && (
          <p className="mb-4 border border-border bg-ivory px-4 py-3 text-sm">{message}</p>
        )}
        {ready || message ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !!message}
              className="w-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep disabled:opacity-60"
            >
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : (
          <p className="border border-border bg-ivory px-4 py-3 text-sm text-muted-foreground">
            This password reset link is missing, invalid or has expired.{" "}
            <a href="/auth" className="font-medium text-primary underline underline-offset-4">
              Request a new one
            </a>
            .
          </p>
        )}
      </div>
    </>
  );
}
