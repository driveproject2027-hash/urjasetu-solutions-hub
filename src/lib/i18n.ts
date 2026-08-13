// Minimal i18n scaffold. Copy lives in dictionaries, not hard-coded in leaf
// components, so Telugu and Hindi can be added without touching layout code.

export type Locale = "en" | "te" | "hi";

export const dictionaries = {
  en: {
    "hero.eyebrow": "DRE Solutions • Technology • Business",
    "hero.title": "Find the right DRE solution for your business.",
    "hero.body":
      "Tell us what is holding your business back. Discover suitable renewable-energy solutions and connect with providers who can help.",
    "hero.cta": "Find My Solution",
    "hero.secondary": "Explore DRE Solutions",
    "hero.provider": "Are you a DRE business? Join the platform",
    "problems.title": "What is holding your business back?",
    "problems.sub": "Start with the problem. We'll help you find the technology.",
    "stories.title": "Real businesses. Real problems.",
    "stories.sub": "Every DRE journey starts with a real problem.",
    "needs.title": "What businesses are looking for",
  },
} satisfies Record<string, Record<string, string>>;

export const defaultLocale: Locale = "en";

export function t(key: keyof (typeof dictionaries)["en"], locale: Locale = defaultLocale): string {
  const dict = (dictionaries as Record<string, Record<string, string>>)[locale] ?? dictionaries.en;
  return dict[key] ?? dictionaries.en[key];
}
