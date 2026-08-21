export const ADMIN_SECTIONS = [
  { key: "joinus", label: "Join Us submissions" },
  { key: "requests", label: "Customer requests" },
  { key: "stories", label: "Stories" },
  { key: "needs", label: "Open needs" },
  { key: "quotes", label: "Quotes" },
  { key: "events", label: "Events" },
  { key: "resources", label: "Resources" },
  { key: "impact", label: "DRIVE impact" },
  { key: "workspace", label: "DRIVE workspace" },
] as const;

export type AdminSectionKey = (typeof ADMIN_SECTIONS)[number]["key"];

export const ADMIN_POSTS: { key: string; label: string; sections: string[] }[] = [
  { key: "full_admin", label: "Full administrator", sections: ["all"] },
  {
    key: "partnerships_manager",
    label: "Partnerships manager",
    sections: ["joinus", "requests", "quotes", "needs"],
  },
  {
    key: "content_manager",
    label: "Content manager",
    sections: ["stories", "resources", "events", "impact"],
  },
  { key: "programme_analyst", label: "Programme analyst", sections: ["impact", "workspace"] },
  { key: "custom", label: "Custom selection", sections: [] },
];

export function postLabel(key: string) {
  return ADMIN_POSTS.find((p) => p.key === key)?.label ?? "Custom selection";
}

/** Tab label -> section key used by the permissions system. */
export const TAB_SECTION: Record<string, AdminSectionKey> = {
  "Join Us submissions": "joinus",
  "Customer requests": "requests",
  Stories: "stories",
  "Open needs": "needs",
  Quotes: "quotes",
  Events: "events",
  Resources: "resources",
  "DRIVE impact": "impact",
  "DRIVE workspace": "workspace",
};

export function canSee(sections: string[] | null, key: AdminSectionKey) {
  if (!sections || sections.length === 0) return true; // unrestricted admin
  return sections.includes("all") || sections.includes(key);
}
