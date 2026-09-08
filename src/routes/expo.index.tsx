import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Store, Users } from "lucide-react";

import { PageHeader } from "../components/site/PageHeader";
import { EXPO_ENABLED, expoParticipantOptions } from "../lib/expo";

export const Route = createFileRoute("/expo/")({
  head: () => ({
    meta: [
      { title: "DRE Expo Registration — LayaGreenEnergy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ExpoPage,
});

const kindIcons = { entrepreneur: Users, vendor: Store } as const;

function ExpoPage() {
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

  return (
    <>
      <PageHeader
        eyebrow="DRE EXPO"
        title="DRE Expo Registration"
        intro="Choose how you would like to participate."
      />
      <div className="container-page py-12 md:py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Back to LayaGreenEnergy
        </Link>

        <div className="mx-auto grid max-w-2xl gap-6">
          {expoParticipantOptions.map((option) => {
            const Icon = kindIcons[option.kind];
            return (
              <Link
                key={option.kind}
                to="/expo/$kind"
                params={{ kind: option.kind }}
                className="group flex flex-col border border-border bg-background p-6 transition-colors hover:border-primary hover:bg-ivory md:p-8"
              >
                <span className="inline-flex size-12 items-center justify-center border border-primary/30 bg-ivory">
                  <Icon className="size-6 text-primary" strokeWidth={1.5} />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold md:text-2xl">
                  {option.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {option.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Continue{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
