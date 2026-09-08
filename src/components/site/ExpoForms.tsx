import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import {
  EXPO_ENABLED,
  expoInterests,
  expoParticipantTypes,
  expoPowerPhases,
  expoTechnologies,
  expoVendorCategories,
  type ExpoEntrepreneurInput,
  type ExpoVendorInput,
} from "../../lib/expo";
import { submitExpoRegistration } from "../../lib/expo.functions";
import { firstIssue } from "../../lib/validation";

/* ---------- shared field primitives (match existing form styling) ---------- */

const inputClass =
  "w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none";
const labelClass = "mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground";
const errorClass = "mt-1 text-xs text-destructive";

export function Field({
  label,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className={errorClass}>{error}</span>}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
  error,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  required,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} required={required} error={error}>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  required,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} required={required} error={error}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">{placeholder ?? "Select…"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckList({
  label,
  options,
  selected,
  onToggle,
  required,
  error,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <span className={labelClass}>
        {label}
        {required ? " *" : ""}
      </span>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const checked = selected.includes(o);
          return (
            <label
              key={o}
              className={`flex cursor-pointer items-center gap-2 border px-3 py-2 text-sm transition-colors ${
                checked ? "border-primary bg-ivory text-foreground" : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(o)}
                className="size-4 accent-[var(--color-primary)]"
              />
              {o}
            </label>
          );
        })}
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="rule-top border-t border-border pt-4 font-display text-lg font-semibold">
      {children}
    </h2>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  );
}

export function SuccessScreen({
  title,
  message,
  onRegisterAnother,
}: {
  title: string;
  message: string;
  onRegisterAnother?: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl border border-primary/40 bg-ivory p-8 text-center md:p-12">
      <CheckCircle2 className="mx-auto size-12 text-primary" strokeWidth={1.5} />
      <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {onRegisterAnother && (
          <button
            type="button"
            onClick={onRegisterAnother}
            className="border border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Register another participant
          </button>
        )}
        <a
          href="/"
          className="bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
        >
          Back to LayaGreenEnergy
        </a>
      </div>
    </div>
  );
}

/* TEMPORARY • DRE EXPO: in-memory drafts so moving between participation
   options preserves entered data for the session. Cleared on successful submit. */
const expoDrafts: Partial<Record<"entrepreneur" | "vendor", unknown>> = {};

function useExpoDraft<T extends object>(kind: "entrepreneur" | "vendor", empty: T) {
  const [form, setFormState] = useState<T>(() => ({
    ...empty,
    ...(expoDrafts[kind] as Partial<T> | undefined),
  }));
  const setForm = (next: T | ((prev: T) => T)) => {
    setFormState((prev) => {
      const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      expoDrafts[kind] = value;
      return value;
    });
  };
  const clearDraft = () => {
    delete expoDrafts[kind];
  };
  return { form, setForm, clearDraft };
}

/* ---------- submit helper shared by both forms ---------- */

export function useExpoSubmit() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(input: Parameters<typeof submitExpoRegistration>[0]["data"]) {
    if (busy) return false; // prevent duplicate accidental submissions
    setBusy(true);
    setError(null);
    try {
      await submitExpoRegistration({ data: input });
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      const issue = firstIssue(e);
      setError(issue ?? msg);
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, submit, setError };
}

export function SubmitButton({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep disabled:opacity-60"
    >
      {busy && <Loader2 className="size-4 animate-spin" />}
      {busy ? "Submitting…" : label}
    </button>
  );
}

/* ---------- entrepreneur / customer form ---------- */

const emptyEntrepreneur: ExpoEntrepreneurInput = {
  full_name: "",
  mobile: "",
  email: "",
  organisation: "",
  district: "",
  participant_type: "" as unknown as ExpoEntrepreneurInput["participant_type"],
  interests: [],
  requirement: "",
};

export function EntrepreneurForm({ onDone }: { onDone: () => void }) {
  const { form, setForm, clearDraft } = useExpoDraft("entrepreneur", emptyEntrepreneur);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { busy, error, submit } = useExpoSubmit();

  const set = <K extends keyof ExpoEntrepreneurInput>(k: K, v: ExpoEntrepreneurInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (v: string) =>
    set(
      "interests",
      form.interests.includes(v)
        ? form.interests.filter((i) => i !== v)
        : [...form.interests, v],
    );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.full_name.trim()) errors.full_name = "Full name is required";
    if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
    if (!form.participant_type) errors.participant_type = "Select a participant type";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const ok = await submit({
      kind: "entrepreneur" as const,
      payload: { ...form, interests: form.interests },
    });
    if (ok) {
      clearDraft();
      onDone();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <FormError message={error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full Name"
          required
          value={form.full_name}
          onChange={(v) => set("full_name", v)}
          error={fieldErrors.full_name}
        />
        <TextField
          label="Mobile Number"
          required
          type="tel"
          value={form.mobile}
          onChange={(v) => set("mobile", v)}
          error={fieldErrors.mobile}
          placeholder="e.g. 98765 43210"
        />
        <TextField
          label="Email"
          type="email"
          value={form.email ?? ""}
          onChange={(v) => set("email", v)}
          hint="Optional — event details will be shared here if provided"
        />
        <TextField
          label="Organisation / Business Name"
          value={form.organisation ?? ""}
          onChange={(v) => set("organisation", v)}
        />
        <TextField
          label="District / Location"
          value={form.district ?? ""}
          onChange={(v) => set("district", v)}
        />
        <SelectField
          label="Participant Type"
          required
          value={form.participant_type}
          options={expoParticipantTypes}
          onChange={(v) => set("participant_type", v as ExpoEntrepreneurInput["participant_type"])}
          error={fieldErrors.participant_type}
        />
      </div>

      <CheckList
        label="What are you interested in?"
        options={expoInterests}
        selected={form.interests}
        onToggle={toggleInterest}
      />

      <TextAreaField
        label="Briefly describe your requirement / what you would like to explore"
        value={form.requirement ?? ""}
        onChange={(v) => set("requirement", v)}
      />

      <SubmitButton busy={busy} label="Register for DRE Expo" />
    </form>
  );
}

/* ---------- vendor form ---------- */

const emptyVendor: ExpoVendorInput = {
  organisation: "",
  contact_person: "",
  mobile: "",
  email: "",
  district: "",
  website: "",
  category: "" as unknown as ExpoVendorInput["category"],
  technologies: [],
  experience_years: "",
  previous_projects: "",
  service_area: "",
  description: "",
  requires_electricity: false,
  power_requirement: "",
  power_phase: undefined,
  equipment: "",
  electrical_notes: "",
};

export function VendorForm({ onDone }: { onDone: () => void }) {
  const { form, setForm, clearDraft } = useExpoDraft("vendor", emptyVendor);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { busy, error, submit } = useExpoSubmit();

  const set = <K extends keyof ExpoVendorInput>(k: K, v: ExpoVendorInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleTech = (v: string) =>
    set(
      "technologies",
      form.technologies.includes(v)
        ? form.technologies.filter((t) => t !== v)
        : [...form.technologies, v],
    );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.organisation.trim()) errors.organisation = "Company / organisation name is required";
    if (!form.contact_person.trim()) errors.contact_person = "Contact person name is required";
    if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.category) errors.category = "Select a vendor category";
    if (form.technologies.length === 0) errors.technologies = "Select at least one technology / product";
    if (!form.experience_years.trim()) errors.experience_years = "Years of experience is required";
    if (form.requires_electricity) {
      if (!form.power_requirement?.trim())
        errors.power_requirement = "Approximate power requirement is needed for stall planning";
      if (!form.equipment?.trim()) errors.equipment = "Tell us which equipment you will operate";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const ok = await submit({ kind: "vendor" as const, payload: { ...form } });
    if (ok) {
      clearDraft();
      onDone();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <FormError message={error} />

      <SectionTitle>Organisation Details</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Company / Organisation Name"
          required
          value={form.organisation}
          onChange={(v) => set("organisation", v)}
          error={fieldErrors.organisation}
        />
        <TextField
          label="Contact Person Name"
          required
          value={form.contact_person}
          onChange={(v) => set("contact_person", v)}
          error={fieldErrors.contact_person}
        />
        <TextField
          label="Mobile Number"
          required
          type="tel"
          value={form.mobile}
          onChange={(v) => set("mobile", v)}
          error={fieldErrors.mobile}
          placeholder="e.g. 98765 43210"
        />
        <TextField
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          error={fieldErrors.email}
        />
        <TextField
          label="Location / District"
          value={form.district ?? ""}
          onChange={(v) => set("district", v)}
        />
        <TextField
          label="Website"
          type="url"
          value={form.website ?? ""}
          onChange={(v) => set("website", v)}
          placeholder="e.g. example.com"
        />
      </div>

      <SectionTitle>Vendor Details</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Vendor Category"
          required
          value={form.category}
          options={expoVendorCategories}
          onChange={(v) => set("category", v as ExpoVendorInput["category"])}
          error={fieldErrors.category}
        />
        <TextField
          label="Years of Experience"
          required
          type="number"
          min="0"
          value={form.experience_years}
          onChange={(v) => set("experience_years", v)}
          error={fieldErrors.experience_years}
        />
        <TextField
          label="Number of Previous Projects / Installations"
          type="number"
          min="0"
          value={form.previous_projects ?? ""}
          onChange={(v) => set("previous_projects", v)}
        />
        <TextField
          label="Service Area"
          value={form.service_area ?? ""}
          onChange={(v) => set("service_area", v)}
          hint="States / districts you serve"
        />
      </div>

      <CheckList
        label="Technology / Products"
        required
        options={expoTechnologies}
        selected={form.technologies}
        onToggle={toggleTech}
        error={fieldErrors.technologies}
      />

      <TextAreaField
        label="Brief Company / Product Description"
        value={form.description ?? ""}
        onChange={(v) => set("description", v)}
      />

      {/* ----- Expo demonstration / stall power ----- */}
      <section className="border border-amber-500/50 bg-amber-50 p-5">
        <h3 className="font-display text-base font-semibold">
          Do you require electricity at your stall to demonstrate your products?
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          This information is specifically required for expo planning and stall power allocation.
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          {[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ].map((o) => (
            <label key={o.label} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                name="requires_electricity"
                checked={form.requires_electricity === o.value}
                onChange={() => set("requires_electricity", o.value)}
                className="size-4 accent-[var(--color-primary)]"
              />
              {o.label}
            </label>
          ))}
        </div>

        {form.requires_electricity && (
          <div className="mt-5 grid gap-5 border-t border-amber-500/40 pt-5 sm:grid-cols-2">
            <TextField
              label="Approximate Power Requirement"
              required
              value={form.power_requirement ?? ""}
              onChange={(v) => set("power_requirement", v)}
              error={fieldErrors.power_requirement}
              placeholder="e.g. 2 kW"
              hint="Total load for your demonstration equipment"
            />
            <SelectField
              label="Phase"
              value={form.power_phase ?? ""}
              options={expoPowerPhases}
              onChange={(v) => set("power_phase", (v || undefined) as ExpoVendorInput["power_phase"])}
            />
            <div className="sm:col-span-2">
              <TextAreaField
                label="Equipment that will be operated"
                required
                rows={2}
                value={form.equipment ?? ""}
                onChange={(v) => set("equipment", v)}
                error={fieldErrors.equipment}
                placeholder="e.g. solar dryer demo, 1 HP pump, display lighting"
              />
            </div>
            <div className="sm:col-span-2">
              <TextAreaField
                label="Any special electrical requirements"
                rows={2}
                value={form.electrical_notes ?? ""}
                onChange={(v) => set("electrical_notes", v)}
                placeholder="Timings, earthing, backup, etc. (optional)"
              />
            </div>
          </div>
        )}
      </section>

      <SubmitButton busy={busy} label="Submit Vendor Registration" />
    </form>
  );
}
