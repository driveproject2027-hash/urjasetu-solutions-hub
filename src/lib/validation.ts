// Strict input schemas shared by the client forms and the server endpoints.
// Every public submission is rejected unless it matches exactly — we do not
// silently sanitize or coerce unknown shapes.
import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);
const required = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} must be under ${max} characters`);

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(255, "Email must be under 255 characters");

// Indian and international dial formats, digits/space/+/-/() only.
export const phoneSchema = z
  .string()
  .trim()
  .min(6, "Enter a valid phone number")
  .max(20, "Enter a valid phone number")
  .regex(/^[+]?[0-9 ()-]{6,20}$/, "Phone number can only contain digits, spaces, +, - and ()");

export const urlSchema = z
  .string()
  .trim()
  .max(300)
  .refine((value) => {
    try {
      const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid website address");

const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.literal("")]).optional().transform((v) => (v === "" ? undefined : v));

const detailsSchema = z
  .record(z.union([z.string().max(2000), z.number(), z.boolean(), z.array(z.string().max(300)).max(50)]))
  .refine((value) => Object.keys(value).length <= 40, "Too many fields")
  .optional();

export const customerRequestSchema = z.object({
  source: z.enum(["find_my_solution", "contact", "post_a_need", "quote_request", "story_submission"]),
  name: optional(trimmed(120)),
  business_name: optional(trimmed(160)),
  email: optional(emailSchema),
  phone: optional(phoneSchema),
  location: optional(trimmed(160)),
  problem: optional(trimmed(2000)),
  requirement: optional(trimmed(2000)),
  solution_interest: optional(trimmed(300)),
  budget: optional(trimmed(120)),
  timeline: optional(trimmed(120)),
  details: detailsSchema,
});

export const providerApplicationSchema = z.object({
  organisation: required(200, "Organisation"),
  contact_person: required(120, "Contact person"),
  email: emailSchema,
  phone: optional(phoneSchema),
  location: optional(trimmed(160)),
  provider_type: z.enum(["solution", "finance", "network"]),
  services: z.array(trimmed(120)).max(40).optional(),
  website: optional(urlSchema),
  description: optional(trimmed(8000)),
});

export const openNeedSchema = z.object({
  title: required(200, "Title"),
  business_name: optional(trimmed(160)),
  sector: optional(trimmed(120)),
  location: optional(trimmed(160)),
  description: optional(trimmed(4000)),
  budget: optional(trimmed(120)),
  timeline: optional(trimmed(120)),
  contact_email: optional(emailSchema),
});

export const needResponseSchema = z.object({
  need_id: z.string().uuid("Unknown need"),
  contact_name: optional(trimmed(120)),
  contact_email: optional(emailSchema),
  message: required(4000, "Message"),
});

export const quoteRequestSchema = z.object({
  provider_id: z.union([z.string().uuid(), z.null()]).optional(),
  provider_ref: optional(trimmed(160)),
  name: optional(trimmed(120)),
  email: optional(emailSchema),
  phone: optional(phoneSchema),
  requirement: optional(trimmed(2000)),
  message: optional(trimmed(4000)),
});

export const storySubmissionSchema = z.object({
  title: required(200, "Title"),
  business_name: optional(trimmed(160)),
  sector: optional(trimmed(120)),
  location: optional(trimmed(160)),
  problem: optional(trimmed(4000)),
  solution: optional(trimmed(4000)),
  outcome: optional(trimmed(4000)),
  contact_email: optional(emailSchema),
});

export const publicFormSchema = z.discriminatedUnion("form", [
  z.object({ form: z.literal("customer_request"), payload: customerRequestSchema }),
  z.object({ form: z.literal("provider_application"), payload: providerApplicationSchema }),
  z.object({ form: z.literal("open_need"), payload: openNeedSchema }),
  z.object({ form: z.literal("need_response"), payload: needResponseSchema }),
  z.object({ form: z.literal("quote_request"), payload: quoteRequestSchema }),
  z.object({ form: z.literal("story_submission"), payload: storySubmissionSchema }),
]);

export type PublicFormInput = z.input<typeof publicFormSchema>;
export type PublicFormData = z.output<typeof publicFormSchema>;

export const authThrottleSchema = z.object({
  action: z.enum(["signin", "signup", "reset"]),
  email: emailSchema,
  outcome: z.enum(["attempt", "failure", "success"]),
});

/** First readable message from a ZodError, safe to show a user. */
export function firstIssue(error: unknown): string | null {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Please check the details you entered.";
  }
  return null;
}
