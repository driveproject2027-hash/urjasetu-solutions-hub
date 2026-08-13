import React from "react";

export function ContactPrompt({ email }: { email: string }) {
  return (
    <div className="rounded-md border border-border bg-ivory p-4">
      <p className="mb-2 text-sm">
        If your situation isn’t listed, we’re here to help — tell us about it and we’ll follow up.
      </p>
      <a href={`mailto:${email}`} className="text-sm font-medium text-primary underline">
        Contact us — {email}
      </a>
    </div>
  );
}
