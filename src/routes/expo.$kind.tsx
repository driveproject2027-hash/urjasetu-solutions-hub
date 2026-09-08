// ============================================================
// TEMPORARY • DRE EXPO module — safe to remove after the expo.
// Registration form route: /expo/entrepreneur and /expo/vendor.
// See src/lib/expo.ts for how to retire the whole feature.
// ============================================================
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { EntrepreneurForm, SuccessScreen, VendorForm } from "../components/site/ExpoForms";
import { PageHeader } from "../components/site/PageHeader";
import { EXPO_ENABLED } from "../lib/expo";

export const Route = createFileRoute("/expo/$kind")({
  head: () => ({
    meta: [
      { title: "DRE Expo Registration — LayaGreenEnergy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ExpoRegisterPage,
});

const content = {
  entrepreneur: {
    title: "Register as Entrepreneur / Customer",
    intro: "Tell us a little about yourself and what you would like to explore at the DRE Expo.",
    successTitle: "Registration Successful",
    successMessage:
      "Thank you for registering for the DRE Expo. Further event details will be shared with you.",
  },
  vendor: {
    title: "Register as Vendor / Technology Provider",
    intro:
      "Tell us about your organisation, products and demonstration needs so we can plan your stall and power allocation.",
    successTitle: "Vendor Registration Submitted",
    successMessage:
      "Thank you for registering for the DRE Expo. Our team will review your details and contact you with further information.",
  },
} as const;

type Kind = keyof typeof content;

function ExpoRegisterPage() {
  const { kind } = Route.useParams();
  // Track which kind was completed so switching participant type resets the screen.
  const [doneFor, setDoneFor] = useState<Kind | null>(null);

  if (!EXPO_ENABLED) {
    return (
      <>
        <PageHeader
          eyebrow="DRE EXPO"
          title="Registration is closed"
          intro="Expo registrations are no longer being accepted."
        />
        <div className="container-page py-12">
          <Link to="/" className="text-sm font-medium text-primary underline">
            Back to the platform
          </Link>
        </div>
      </>
    );
  }

  const config = content[kind as Kind];

  if (!config) {
    return (
      <>
        <PageHeader
          eyebrow="DRE EXPO"
          title="DRE Expo Registration"
          intro="That participation option does not exist."
        />
        <div className="container-page py-12">
          <Link to="/expo" className="text-sm font-medium text-primary underline">
            Choose how you would like to participate
          </Link>
        </div>
      </>
    );
  }

  const done = doneFor === kind;

  return (
    <>
      <PageHeader eyebrow="DRE EXPO" title={config.title} intro={config.intro} />
      <div className="container-page py-12 md:py-16">
        <Link
          to="/expo"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Change participant type
        </Link>

        {done ? (
          <SuccessScreen
            title={config.successTitle}
            message={config.successMessage}
            onRegisterAnother={() => setDoneFor(null)}
          />
        ) : (
          <div className="max-w-3xl">
            {kind === "vendor" ? (
              <VendorForm onDone={() => setDoneFor("vendor")} />
            ) : (
              <EntrepreneurForm onDone={() => setDoneFor("entrepreneur")} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
