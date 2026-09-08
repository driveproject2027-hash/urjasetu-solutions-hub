// TEMPORARY • DRE EXPO: validated, rate-limited server endpoint.
// Mirrors the public-forms pattern: writes use the service role so the
// browser never has direct insert rights on expo_registrations.
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
  expoInterests,
  expoParticipantTypes,
  expoPowerPhases,
  expoTechnologies,
  expoVendorCategories,
} from './expo'
import type { ExpoRegistrationInput } from './expo'

const trimmed = (max: number) => z.string().trim().max(max)
const required = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} must be under ${max} characters`)

const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.literal('')]).optional().transform((v) => (v === '' ? undefined : v))

const mobileSchema = z
  .string()
  .trim()
  .min(6, 'Enter a valid mobile number')
  .max(20, 'Enter a valid mobile number')
  .regex(/^[+]?[0-9 ()-]{6,20}$/, 'Mobile number can only contain digits, spaces, +, - and ()')

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address')
  .max(255, 'Email must be under 255 characters')

const urlSchema = z
  .string()
  .trim()
  .max(300)
  .refine((value) => {
    try {
      const parsed = new URL(value.startsWith('http') ? value : `https://${value}`)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }, 'Enter a valid website address')

const entrepreneurSchema = z.object({
  full_name: required(120, 'Full name'),
  mobile: mobileSchema,
  email: optional(emailSchema),
  organisation: optional(trimmed(160)),
  district: optional(trimmed(160)),
  participant_type: z.enum(expoParticipantTypes, { message: 'Select a participant type' }),
  interests: z.array(z.enum(expoInterests)).max(expoInterests.length).default([]),
  requirement: optional(trimmed(2000)),
})

const vendorSchema = z
  .object({
    organisation: required(200, 'Company / organisation name'),
    contact_person: required(120, 'Contact person name'),
    mobile: mobileSchema,
    email: emailSchema,
    district: optional(trimmed(160)),
    website: optional(urlSchema),
    category: z.enum(expoVendorCategories, { message: 'Select a vendor category' }),
    technologies: z
      .array(z.enum(expoTechnologies))
      .min(1, 'Select at least one technology / product')
      .max(expoTechnologies.length),
    experience_years: required(10, 'Years of experience'),
    previous_projects: optional(trimmed(120)),
    service_area: optional(trimmed(300)),
    description: optional(trimmed(4000)),
    requires_electricity: z.boolean(),
    power_requirement: optional(trimmed(120)),
    power_phase: optional(z.enum(expoPowerPhases)),
    equipment: optional(trimmed(1000)),
    electrical_notes: optional(trimmed(1000)),
  })
  .superRefine((value, ctx) => {
    if (value.requires_electricity) {
      if (!value.power_requirement?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['power_requirement'],
          message: 'Approximate power requirement is needed for stall planning',
        })
      }
      if (!value.equipment?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['equipment'],
          message: 'Tell us which equipment you will operate',
        })
      }
    }
  })

export const expoRegistrationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('entrepreneur'), payload: entrepreneurSchema }),
  z.object({ kind: z.literal('vendor'), payload: vendorSchema }),
])

export const submitExpoRegistration = createServerFn({ method: 'POST' })
  .validator((input: unknown) => expoRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { clientKey, enforce, RateLimitError } = await import('./rate-limit.server')
    const { publicWriteLimits } = await import('./security-config.server')
    const { firstIssue } = await import('./validation')

    const parsed = expoRegistrationSchema.parse(data)
    const limits = publicWriteLimits()
    const ip = await clientKey()
    try {
      await enforce('expo:ip', ip, limits.perIp)
      await enforce(`expo:${parsed.kind}`, ip, limits.perForm)
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw new Error('Too many submissions from this device. Please try again later.')
      }
      throw error
    }

    const requiresElectricity =
      parsed.kind === 'vendor' && parsed.payload.requires_electricity === true

    const row = {
      kind: parsed.kind,
      payload: parsed.payload,
      requires_electricity: requiresElectricity,
      power_requirement:
        parsed.kind === 'vendor' ? parsed.payload.power_requirement ?? null : null,
    }

    const client = supabaseAdmin as unknown as { from: (t: string) => any }
    const { error } = await client.from('expo_registrations').insert(row)
    if (error) {
      console.error('[expo] insert failed', error)
      throw new Error('We could not save your registration. Please try again.')
    }
    return { ok: true as const }
  })

export type { ExpoRegistrationInput }
