import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/join-provider")({
  beforeLoad: () => {
    throw redirect({ to: "/join-us", replace: true });
  },
});
