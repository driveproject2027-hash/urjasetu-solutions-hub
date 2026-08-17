/**
 * Shared SEO helpers. Single source of truth for the canonical domain,
 * social preview image and JSON-LD builders used by route `head()` options.
 */

export const SITE_URL = "https://urjasethu.dev";
export const SITE_NAME = "UrjaSethu";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Absolute, self-referencing URL for a route path (no trailing slash except root). */
export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean.replace(/\/+$/, "")}`;
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      "UrjaSethu connects Indian businesses with decentralised renewable energy (DRE) solutions, solution providers, finance providers and network partners.",
    logo: `${SITE_URL}/favicon.png`,
    telephone: "+91-8499883525",
    areaServed: "IN",
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "en-IN",
  };
}

/** BreadcrumbList JSON-LD from an ordered list of crumbs (path relative). */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
