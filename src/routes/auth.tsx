import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { checkAuthThrottle } from "../lib/public-forms.functions";
import { useSession } from "../lib/useAuth";

// Auth providers can return provider-specific detail; keep user-facing copy generic.
function authMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message.toLowerCase() : "";
  if (raw.includes("invalid login")) return "Incorrect email or password.";
  if (raw.includes("already registered")) return "An account with this email already exists.";
  if (raw.includes("email not confirmed")) return "Please confirm your email address first.";
  if (raw.includes("password")) return "Password does not meet the minimum requirements.";
  if (raw.includes("rate") || raw.includes("too many")) return "Too many attempts. Please try again later.";
  return "We could not complete that request. Please try again.";
}


export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in to UrjaSethu" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Sign in or create an UrjaSethu account to track your enquiries, provider applications and quote requests.",
      },
      { property: "og:title", content: "Sign in to UrjaSethu" },
      { property: "og:description", content: "Access your UrjaSethu enquiries, applications and quotes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    if (session) void navigate({ to: "/account" });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const action = mode === "signup" ? "signup" : "signin";
    try {
      const gate = await checkAuthThrottle({ data: { action, email, outcome: "attempt" } });
      if (!gate.allowed) {
        toast.error("Too many attempts", {
          description: `Please wait about ${Math.ceil(gate.retryAfterSeconds / 60) || 1} minute(s) before trying again.`,
        });
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        void checkAuthThrottle({ data: { action, email, outcome: "success" } });
        toast.success("Account created", { description: "You can now sign in." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        void checkAuthThrottle({ data: { action, email, outcome: "success" } });
        void navigate({ to: "/account" });
      }
    } catch (err) {
      void checkAuthThrottle({ data: { action, email, outcome: "failure" } });
      toast.error(authMessage(err));
    } finally {
      setBusy(false);
    }
  }


  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/account" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title={mode === "signin" ? "Sign in" : "Create an account"}
        intro="An account lets you track the enquiries, applications and quote requests you submit through UrjaSethu."
      />
      <div className="container-page max-w-md py-12">
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep disabled:opacity-60"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={onGoogle}
          className="mt-4 w-full border border-border px-5 py-3 text-sm font-medium hover:border-primary"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-muted-foreground">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-primary underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </>
  );
}
