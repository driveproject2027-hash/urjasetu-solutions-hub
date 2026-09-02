import test from 'node:test';
import assert from 'node:assert/strict';

import { estimateSolarProject } from './solar-estimate.ts';

test('estimateSolarProject returns a sensible commercial bill-based estimate', () => {
  const result = estimateSolarProject({
    mode: 'bill',
    bill: 15000,
    state: 'Andhra Pradesh',
    customerType: 'commercial',
    includeResidentialSubsidy: false,
  });

  assert.ok(result.recommendedSystemKw >= 1);
  assert.ok(result.generationKwhPerMonth > 0);
  assert.ok(result.monthlySavings > 0);
  assert.ok(result.investment > 0);
  assert.ok(result.paybackYears > 0);
  assert.equal(result.tariffUsed, 8);
});

test('estimateSolarProject respects residential subsidy cap', () => {
  const result = estimateSolarProject({
    mode: 'units',
    units: 500,
    state: 'Karnataka',
    customerType: 'residential',
    includeResidentialSubsidy: true,
  });

  assert.ok(result.subsidyAmount >= 0);
  assert.ok(result.investment <= result.recommendedSystemKw * 65000);
});
