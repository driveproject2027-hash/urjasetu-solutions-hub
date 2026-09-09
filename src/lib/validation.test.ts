import { describe, expect, it } from "vitest";

import {
  authThrottleSchema,
  customerRequestSchema,
  emailSchema,
  firstIssue,
  mobileSchema,
  needResponseSchema,
  openNeedSchema,
  phoneSchema,
  providerApplicationSchema,
  publicFormSchema,
  quoteRequestSchema,
  storySubmissionSchema,
  urlSchema,
} from "./validation";

describe("emailSchema", () => {
  it("accepts a valid email and trims whitespace", () => {
    expect(emailSchema.safeParse("  user@example.com ").success).toBe(true);
  });
  it("rejects an email without @", () => {
    expect(emailSchema.safeParse("userexample.com").success).toBe(false);
  });
  it("rejects an email over 255 characters", () => {
    expect(emailSchema.safeParse(`${"a".repeat(250)}@example.com`).success).toBe(false);
  });
});

describe("phoneSchema / mobileSchema", () => {
  it("accepts a standard Indian mobile number", () => {
    expect(phoneSchema.safeParse("+91 98765 43210").success).toBe(true);
  });
  it("rejects letters or special characters", () => {
    expect(phoneSchema.safeParse("98765abc210").success).toBe(false);
    expect(phoneSchema.safeParse("98765$43210").success).toBe(false);
  });
  it("rejects numbers that are too short or too long", () => {
    expect(phoneSchema.safeParse("123").success).toBe(false);
    expect(phoneSchema.safeParse("1".repeat(25)).success).toBe(false);
  });
  it("is the same schema as mobileSchema", () => {
    expect(phoneSchema).toBe(mobileSchema);
  });
});

describe("urlSchema", () => {
  it("accepts http and https URLs with or without scheme", () => {
    expect(urlSchema.safeParse("https://example.com").success).toBe(true);
    expect(urlSchema.safeParse("http://example.com/path").success).toBe(true);
    expect(urlSchema.safeParse("example.com").success).toBe(true);
  });
  it("rejects non-http protocols", () => {
    expect(urlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });
  it("rejects plain garbage", () => {
    expect(urlSchema.safeParse("not a url").success).toBe(false);
  });
});

describe("customerRequestSchema", () => {
  const valid = { source: "contact" as const };

  it("accepts a minimal customer request", () => {
    expect(customerRequestSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects an unknown source", () => {
    expect(customerRequestSchema.safeParse({ source: "twitter" }).success).toBe(false);
  });
  it("coerces empty optional strings to undefined", () => {
    const result = customerRequestSchema.safeParse({ ...valid, name: "", email: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBeUndefined();
      expect(result.data.email).toBeUndefined();
    }
  });
  it("rejects more than 40 details fields", () => {
    const details = Object.fromEntries(Array.from({ length: 41 }, (_, i) => [`field${i}`, "x"]));
    expect(customerRequestSchema.safeParse({ ...valid, details }).success).toBe(false);
  });
});

describe("providerApplicationSchema", () => {
  const valid = {
    organisation: "Acme Solar",
    contact_person: "Jane Doe",
    email: "jane@acme.com",
    provider_type: "solution" as const,
  };

  it("accepts a valid application", () => {
    expect(providerApplicationSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a missing organisation", () => {
    expect(providerApplicationSchema.safeParse({ ...valid, organisation: "" }).success).toBe(false);
  });
  it("rejects an unknown provider_type", () => {
    expect(providerApplicationSchema.safeParse({ ...valid, provider_type: "broker" }).success).toBe(
      false,
    );
  });
});

describe("openNeedSchema", () => {
  it("accepts a valid need", () => {
    expect(openNeedSchema.safeParse({ title: "Need 5kW rooftop system" }).success).toBe(true);
  });
  it("rejects a missing title", () => {
    expect(openNeedSchema.safeParse({ title: "" }).success).toBe(false);
  });
  it("rejects a malformed contact email", () => {
    expect(openNeedSchema.safeParse({ title: "X", contact_email: "nope" }).success).toBe(false);
  });
});

describe("needResponseSchema", () => {
  const uuid = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
  it("accepts a valid response", () => {
    expect(needResponseSchema.safeParse({ need_id: uuid, message: "We can help" }).success).toBe(
      true,
    );
  });
  it("rejects a non-uuid need_id", () => {
    expect(needResponseSchema.safeParse({ need_id: "abc", message: "We can help" }).success).toBe(
      false,
    );
  });
  it("rejects an empty message", () => {
    expect(needResponseSchema.safeParse({ need_id: uuid, message: "" }).success).toBe(false);
  });
});

describe("quoteRequestSchema", () => {
  it("accepts a quote with a null provider_id", () => {
    expect(quoteRequestSchema.safeParse({ provider_id: null }).success).toBe(true);
  });
  it("rejects a malformed provider_id", () => {
    expect(quoteRequestSchema.safeParse({ provider_id: "xyz" }).success).toBe(false);
  });
});

describe("storySubmissionSchema", () => {
  it("accepts a valid story and rejects an empty title", () => {
    expect(storySubmissionSchema.safeParse({ title: "Our solar journey" }).success).toBe(true);
    expect(storySubmissionSchema.safeParse({ title: "   " }).success).toBe(false);
  });
});

describe("publicFormSchema (discriminated union)", () => {
  it("routes each form literal to its payload schema", () => {
    expect(
      publicFormSchema.safeParse({ form: "customer_request", payload: { source: "contact" } })
        .success,
    ).toBe(true);
  });
  it("rejects an unknown form literal", () => {
    expect(publicFormSchema.safeParse({ form: "spam", payload: {} }).success).toBe(false);
  });
});

describe("authThrottleSchema", () => {
  it("accepts known actions and rejects unknown ones", () => {
    expect(authThrottleSchema.safeParse({ action: "signin", email: "a@b.com" }).success).toBe(true);
    expect(authThrottleSchema.safeParse({ action: "hack", email: "a@b.com" }).success).toBe(false);
  });
});

describe("firstIssue", () => {
  it("returns the first Zod issue message", () => {
    const result = openNeedSchema.safeParse({ title: "" });
    expect(firstIssue(result.error)).toMatch(/Title is required/);
  });
  it("returns null for non-Zod errors", () => {
    expect(firstIssue(new Error("boom"))).toBeNull();
    expect(firstIssue(null)).toBeNull();
  });
});
