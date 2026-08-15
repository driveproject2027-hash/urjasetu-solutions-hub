import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/join-network-partner")({
  beforeLoad: () => {
    throw redirect({ to: "/join-us/network-partner", replace: true });
  },
});
