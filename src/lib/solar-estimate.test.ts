import { describe, expect, it } from "vitest";
import { estimateSolarProject } from "./solar-estimate.ts";
describe("estimateSolarProject", () => {
  it("estimateSolarProject returns a sensible commercial bill-based estimate", () => {
    const result = estimateSolarProject({
      mode: "bill",
      bill: 15000,
      state: "Andhra Pradesh",
      customerType: "commercial",
      includeResidentialSubsidy: false,
    });
    expect(result.recommendedSystemKw).toBeGreaterThanOrEqual(1);
    expect(result.generationKwhPerMonth).toBeGreaterThan(0);
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.investment).toBeGreaterThan(0);
    expect(result.paybackYears).toBeGreaterThan(0);
    expect(result.tariffUsed).toBe(8);
  });

  it("estimateSolarProject respects residential subsidy cap", () => {
    const result = estimateSolarProject({
      mode: "units",
      units: 500,
      state: "Karnataka",
      customerType: "residential",
      includeResidentialSubsidy: true,
    });

    expect(result.subsidyAmount).toBeGreaterThanOrEqual(0);
    expect(result.investment).toBeLessThanOrEqual(result.recommendedSystemKw * 65000);
  });
});
