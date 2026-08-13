import { createFileRoute } from "@tanstack/react-router";

import { providers, solutions, stories } from "../data/catalog";

const staticPaths = [
  "/",
  "/solutions",
  "/providers",
  "/find-my-solution",
  "/stories",
  "/needs",
  "/opportunities",
  "/resources",
  "/financing",
  "/calculator",
  "/about",
  "/join-provider",
  "/contact",
  "/drive",
  "/events",
];


export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = [
          ...staticPaths,
          ...solutions.map((s) => `/solutions/${s.slug}`),
          ...providers.map((p) => `/providers/${p.id}`),
          ...stories.map((s) => `/stories/${s.slug}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${origin}${u}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml" } });
      },
    },
  },
});
