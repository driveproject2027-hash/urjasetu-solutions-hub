import { describe, expect, it } from "vitest";

import { expoRegistrationSchema } from "./expo.functions";

const baseEntrepreneur = {
  kind: "entrepreneur" as const,
  payload: {
    full_name: "Test Entrepreneur",
    mobile: "+91 98765 43210",
    participant_type: "MSME" as const,
    interests: ["Solar" as const],
  },
};

const baseVendor = {
  kind: "vendor" as const,
  payload: {
    organisation: "Test Solar Pvt Ltd",
    contact_person: "Test Contact",
    mobile: "+91 98765 43210",
    email: "vendor@example.com",
    category: "Installer / EPC" as const,
    technologies: ["Solar PV" as const],
    experience_years: "10",
    requires_electricity: false,
  },
};

describe("expoRegistrationSchema — entrepreneur", () => {
  it("accepts a valid entrepreneur payload", () => {
    const result = expoRegistrationSchema.safeParse(baseEntrepreneur);
    expect(result.success).toBe(true);
  });

  it("rejects a missing full_name", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseEntrepreneur,
      payload: { ...baseEntrepreneur.payload, full_name: "" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid mobile number", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseEntrepreneur,
      payload: { ...baseEntrepreneur.payload, mobile: "abc!!" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid participant_type enum", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseEntrepreneur,
      payload: { ...baseEntrepreneur.payload, participant_type: "Alien" },
    });
    expect(result.success).toBe(false);
  });

  it("defaults interests to an empty array when omitted", () => {
    const result = expoRegistrationSchema.safeParse({
      kind: "entrepreneur",
      payload: {
        full_name: "Test Entrepreneur",
        mobile: "+91 98765 43210",
        participant_type: "MSME",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kind === "entrepreneur" && result.data.payload.interests).toEqual([]);
    }
  });
});

describe("expoRegistrationSchema — vendor", () => {
  it("accepts a valid vendor payload without electricity", () => {
    const result = expoRegistrationSchema.safeParse(baseVendor);
    expect(result.success).toBe(true);
  });

  it("requires at least one technology", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseVendor,
      payload: { ...baseVendor.payload, technologies: [] },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid vendor category enum", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseVendor,
      payload: { ...baseVendor.payload, category: "Not A Category" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed vendor email", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseVendor,
      payload: { ...baseVendor.payload, email: "not-an-email" },
    });
    expect(result.success).toBe(false);
  });

  it("requires power_requirement and equipment when requires_electricity is true", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseVendor,
      payload: { ...baseVendor.payload, requires_electricity: true },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("payload.power_requirement");
      expect(paths).toContain("payload.equipment");
    }
  });

  it("accepts a vendor with electricity details provided", () => {
    const result = expoRegistrationSchema.safeParse({
      ...baseVendor,
      payload: {
        ...baseVendor.payload,
        requires_electricity: true,
        power_requirement: "5 kW",
        equipment: "Fans, lights, demo units",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown kind (discriminated union)", () => {
    const result = expoRegistrationSchema.safeParse({
      kind: "sponsor",
      payload: baseVendor.payload,
    });
    expect(result.success).toBe(false);
  });
});
