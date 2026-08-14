import { supabase } from "@/integrations/supabase/client";

export type ProviderType = "solution" | "finance" | "network";

export const providerTypeLabels: Record<ProviderType, string> = {
  solution: "DRE Solution Provider",
  finance: "Finance Provider",
  network: "Network Partner",
};

export const requestSourceLabels: Record<string, string> = {
  find_my_solution: "Find My Solution",
  contact: "Contact Us",
  post_a_need: "Post a Need",
  quote_request: "Request Quote",
  story_submission: "Story submission",
};

export const providerStatuses = ["pending", "under_review", "approved", "rejected", "suspended"] as const;
export const requestStatuses = ["new", "contacted", "assigned", "in_progress", "resolved", "closed"] as const;
export const storyStatuses = ["pending", "under_review", "approved", "rejected", "archived"] as const;
export const needStatuses = ["new", "published", "responses_received", "matched", "closed"] as const;
export const quoteStatuses = ["new", "viewed", "responded", "accepted", "rejected", "closed"] as const;

export function statusLabel(value: string) {
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

type Row = Record<string, unknown>;

async function insertRow(table: string, row: Row) {
  // Casts are needed because the generated types use exactOptionalPropertyTypes.
  const { error } = await (supabase.from(table as never) as never as {
    insert: (v: Row) => Promise<{ error: { message: string } | null }>;
  }).insert(row);
  if (error) throw error;
}

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export type CustomerRequestInput = {
  source: string;
  name?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  problem?: string;
  requirement?: string;
  solution_interest?: string;
  budget?: string;
  timeline?: string;
  details?: Record<string, unknown>;
};

export async function submitCustomerRequest(input: CustomerRequestInput) {
  const user_id = await currentUserId();
  await insertRow("customer_requests", { ...input, user_id });
}

export async function submitProviderApplication(input: {
  organisation: string;
  contact_person: string;
  email: string;
  phone?: string;
  location?: string;
  provider_type: ProviderType;
  services?: string[];
  website?: string;
  description?: string;
}) {
  const user_id = await currentUserId();
  await insertRow("provider_applications", { ...input, user_id });
}

export async function submitOpenNeed(input: {
  title: string;
  business_name?: string;
  sector?: string;
  location?: string;
  description?: string;
  budget?: string;
  timeline?: string;
  contact_email?: string;
}) {
  const user_id = await currentUserId();
  await insertRow("open_needs", { ...input, user_id });
}

export async function submitNeedResponse(input: {
  need_id: string;
  contact_name?: string;
  contact_email?: string;
  message: string;
}) {
  const user_id = await currentUserId();
  await insertRow("need_responses", { ...input, user_id });
}

export async function submitQuoteRequest(input: {
  provider_id?: string | null;
  provider_ref?: string;
  name?: string;
  email?: string;
  phone?: string;
  requirement?: string;
  message?: string;
}) {
  const user_id = await currentUserId();
  await insertRow("quote_requests", { ...input, user_id });
}

export async function submitStory(input: {
  title: string;
  business_name?: string;
  sector?: string;
  location?: string;
  problem?: string;
  solution?: string;
  outcome?: string;
  contact_email?: string;
}) {
  const user_id = await currentUserId();
  await insertRow("story_submissions", { ...input, user_id });
}

export async function fetchApprovedProviders(type?: ProviderType) {
  let query = supabase
    .from("provider_applications")
    .select("id, organisation, contact_person, location, provider_type, services, website, description")
    .eq("status", "approved")
    .order("organisation");
  if (type) query = query.eq("provider_type", type);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedStories() {
  const { data, error } = await supabase
    .from("story_submissions")
    .select("id, title, business_name, sector, location, problem, solution, outcome")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublicNeeds() {
  const { data, error } = await supabase
    .from("open_needs")
    .select("id, title, business_name, sector, location, description, budget, timeline, status")
    .in("status", ["published", "responses_received", "matched"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, event_type, starts_at, location, registration_url")
    .eq("is_published", true)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchImpactMetrics() {
  const { data, error } = await supabase
    .from("impact_metrics")
    .select("id, label, value, note")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedResources(category?: string) {
  let query = supabase
    .from("resources")
    .select("id, category, title, summary, body, source_name, source_url")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
