export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
      />
    </div>
  );
}

export function TextArea({
  label,
  name,
  rows = 4,
  required,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="w-full border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
      />
    </div>
  );
}

export function CheckboxGroup({
  label,
  name,
  options,
  className = "",
  columns = "sm:grid-cols-3",
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
  columns?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className={`grid gap-2 ${columns}`}>
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              value={o}
              className="size-4 accent-[oklch(0.42_0.075_152)]"
            />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

export function SubmitRow({ busy, label = "Submit registration" }: { busy: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-forest-deep disabled:opacity-60 md:col-span-2 md:justify-self-start"
    >
      {busy ? "Submitting…" : label}
    </button>
  );
}

export function JoinSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="mb-12 flex flex-wrap gap-6 border-y border-border py-5">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2 text-sm">
          <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          <span className={i === 0 ? "font-medium text-primary" : "text-foreground/80"}>{s}</span>
        </li>
      ))}
    </ol>
  );
}
