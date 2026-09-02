export type CalculationMode = 'bill' | 'units' | 'roof';
export type CustomerType = 'residential' | 'commercial' | 'industrial';

export type EstimateInput = {
  mode: CalculationMode;
  bill?: number;
  units?: number;
  roofArea?: number;
  roofUnit?: 'sqft' | 'sqm';
  state?: string;
  customerType?: CustomerType;
  tariff?: number;
  includeResidentialSubsidy?: boolean;
};

export type SolarEstimate = {
  tariffUsed: number;
  recommendedSystemKw: number;
  generationKwhPerMonth: number;
  monthlySavings: number;
  annualSavings: number;
  investment: number;
  paybackYears: number;
  lifetimeSavings: number;
  co2AvoidedTonnes: number;
  treesEquivalent: number;
  subsidyAmount: number;
  subsidyEligible: boolean;
  recommendation: string;
};

const STATE_TARIFFS: Record<string, number> = {
  'Andhra Pradesh': 8,
  Telangana: 8.5,
  Karnataka: 7.5,
  Maharashtra: 9,
  Gujarat: 7.5,
  'Tamil Nadu': 8,
  Rajasthan: 8,
  'West Bengal': 9,
};

const CUSTOMER_MULTIPLIERS: Record<CustomerType, number> = {
  residential: 1,
  commercial: 0.88,
  industrial: 0.82,
};

function normalizeCustomerType(customerType?: CustomerType): CustomerType {
  return customerType ?? 'commercial';
}

export function estimateSolarProject(input: EstimateInput): SolarEstimate {
  const customerType = normalizeCustomerType(input.customerType);
  const tariffUsed = input.tariff ?? STATE_TARIFFS[input.state ?? ''] ?? 8;
  const roofFactor = input.roofUnit === 'sqm' ? 10.764 : 1;
  const roofArea = (input.roofArea ?? 500) * roofFactor;

  const billBasedUsage = (input.bill ?? 15000) / tariffUsed;
  const usageBased = input.units ?? 1875;
  const roofBased = roofArea * 0.012;

  const currentDemand =
    input.mode === 'bill' ? billBasedUsage : input.mode === 'units' ? usageBased : roofBased;

  const recommendedSystemKw = Math.max(
    1,
    Math.min(500, Math.round(Math.min(currentDemand / 120, roofArea / 100))),
  );

  const generationKwhPerMonth = Math.round(recommendedSystemKw * 120);
  const categoryFactor = CUSTOMER_MULTIPLIERS[customerType];
  const monthlySavings = Math.round(generationKwhPerMonth * tariffUsed * categoryFactor);
  const annualSavings = monthlySavings * 12;

  const baseCost =
    recommendedSystemKw * (customerType === 'industrial' ? 56000 : customerType === 'residential' ? 60000 : 62000);
  const subsidyEligible = customerType === 'residential' && Boolean(input.includeResidentialSubsidy);
  const subsidyAmount = subsidyEligible ? Math.min(78000, recommendedSystemKw * 18000) : 0;
  const investment = Math.max(0, baseCost - subsidyAmount);
  const paybackYears = investment > 0 && monthlySavings > 0 ? investment / (monthlySavings * 12) : 0;
  const lifetimeSavings = annualSavings * 25;
  const co2AvoidedTonnes = (generationKwhPerMonth * 12 * 25 * 0.7) / 1000;
  const treesEquivalent = Math.round(co2AvoidedTonnes * 16);

  const recommendation =
    customerType === 'residential'
      ? 'Best suited for rooftop and small-load domestic optimization.'
      : customerType === 'commercial'
        ? 'Good fit for daytime business loads and cost-reduction opportunities.'
        : 'Well suited for larger load centers and operational savings.';

  return {
    tariffUsed,
    recommendedSystemKw,
    generationKwhPerMonth,
    monthlySavings,
    annualSavings,
    investment,
    paybackYears: Number(paybackYears.toFixed(1)),
    lifetimeSavings,
    co2AvoidedTonnes: Number(co2AvoidedTonnes.toFixed(1)),
    treesEquivalent,
    subsidyAmount,
    subsidyEligible,
    recommendation,
  };
}
