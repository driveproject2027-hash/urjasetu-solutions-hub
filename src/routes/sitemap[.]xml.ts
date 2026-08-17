import { createFileRoute } from "@tanstack/react-router";

import { providers, solutions, stories } from "../data/catalog";
import { resourceCategories } from "../data/resources";
import { SITE_URL } from "../lib/seo";

/** Public, indexable routes only. Admin, account, auth and internal routes are excluded. */
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
  "/join-us",
  "/join-us/solution-provider",
  "/join-us/finance-provider",
  "/join-us/network-partner",
  "/contact",
  "/drive",
  "/events",
];

const priorities: Record<string, string> = {
  "/": "1.0",
  "/solutions": "0.9",
  "/providers": "0.9",
  "/financing": "0.9",
  "/find-my-solution": "0.9",
  "/resources": "0.8",
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = [
          ...staticPaths,
          ...solutions.map((s) => `/solutions/${s.slug}`),
          ...providers.map((p) => `/providers/${p.id}`),
          ...stories.map((s) => `/stories/${s.slug}`),
          ...resourceCategories.map((c) => `/resources/${c.slug}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    const loc = u === "/" ? `${SITE_URL}/` : `${SITE_URL}${u}`;
    const priority = priorities[u] ?? "0.7";
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>`;
        return new Response(body, {
          headers: { "content-type": "application/xml", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
