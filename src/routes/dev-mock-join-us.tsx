import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { submitProviderApplication } from "../lib/db";
import { userMessage } from "../lib/user-error";

export const Route = createFileRoute("/dev-mock-join-us")({
  loader: () => {
    if (import.meta.env.PROD) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Mock Join Us submissions — LayaGreenEnergy (dev tool)" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MockJoinUs,
});

type MockCase = {
  id: string;
  label: string;
  provider_type: "solution" | "finance" | "network";
};

const MOCK_CASES: MockCase[] = [
  { id: "mock-solution", label: "Mock · DRE Solution Provider", provider_type: "solution" },
  { id: "mock-finance", label: "Mock · Finance Provider", provider_type: "finance" },
  { id: "mock-network", label: "Mock · Network Partner", provider_type: "network" },
];

function mockPayload(type: MockCase["provider_type"], run: number) {
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const base = {
    organisation: `Mock Test Co (${type}) #${run}`,
    contact_person: "QA Tester",
    email: `mock-${type}-${run}@example.com`,
    phone: "+91 90000 00000",
    location: "Testville, Test State",
    website: "https://example.com",
  };
  if (type === "solution") {
    return {
      ...base,
      provider_type: type,
      services: ["Solar PV", "Battery Energy Storage"],
      description: `MOCK SUBMISSION for backend testing (${stamp}).\nService districts: Test District 1, Test District 2\nYears of experience: 5\nNotes: This is a mock submission to verify the Join Us review flow.`,
    };
  }
  if (type === "finance") {
    return {
      ...base,
      provider_type: type,
      services: ["Debt financing"],
      description: `MOCK SUBMISSION for backend testing (${stamp}).\nFinancing offered: Mock term loans for DRE assets.\nNotes: This is a mock submission to verify the Join Us review flow.`,
    };
  }
  return {
    ...base,
    provider_type: type,
    services: ["Last-mile distribution"],
    description: `MOCK SUBMISSION for backend testing (${stamp}).\nNetwork role: Mock local channel partner.\nNotes: This is a mock submission to verify the Join Us review flow.`,
  };
}

function MockJoinUs() {
  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  async function submitOne(c: MockCase) {
    setBusy(c.id);
    try {
      await submitProviderApplication(mockPayload(c.provider_type, Date.now()));
      const line = `✅ Submitted mock ${c.provider_type} application to provider_applications`;
      setLog((prev) => [line, ...prev].slice(0, 20));
      toast.success("Mock submission sent", {
        description: "Open /admin → Join Us submissions to see it.",
      });
    } catch (err) {
      const line = `❌ ${c.label}: ${userMessage(err)}`;
      setLog((prev) => [line, ...prev].slice(0, 20));
      toast.error("Mock submission failed", { description: userMessage(err) });
    } finally {
      setBusy(null);
    }
  }

  async function submitAll() {
    for (const c of MOCK_CASES) {
      await submitOne(c);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Dev tool"
        title="Mock Join Us submissions"
        intro="Submit test provider applications through the real public form pipeline (validation, rate limiting, database insert), then review them in the admin dashboard."
      />
      <div className="container-page max-w-2xl space-y-6 py-12">
        <div className="grid gap-3">
          {MOCK_CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={busy !== null}
              onClick={() => void submitOne(c)}
              className="border border-border px-5 py-3 text-left text-sm font-medium hover:border-primary disabled:opacity-60"
            >
              {busy === c.id ? "Submitting…" : c.label}
            </button>
          ))}
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void submitAll()}
            className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep disabled:opacity-60"
          >
            {busy !== null ? "Submitting…" : "Submit all three mock applications"}
          </button>
        </div>

        <div>
          <a
            href="/admin"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Open admin dashboard → Join Us submissions
          </a>
        </div>

        {log.length > 0 && (
          <div className="rounded border border-border bg-muted p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Result log
            </p>
            <ul className="space-y-1 text-sm">
              {log.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Note: submissions are rate-limited, so submitting many in a row may occasionally be
          throttled. All mock entries use example.com email addresses.
        </p>
      </div>
    </>
  );
}
