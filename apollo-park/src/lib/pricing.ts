import type { PricingInput, PricingBreakdown } from "@/types";

const LUNAR_TAX_RATE = 0.05; // Lunar Tax Authority — see TECHNICAL_SPEC.md §2.1

// Discount eligibility per TECHNICAL_SPEC.md §2.1.
// Open question: does the group discount exclude on holidays like child/senior do?
// Flagged in TECHNICAL_SPEC.md §6 — confirm with stakeholder before shipping.
function resolveDiscount(input: PricingInput): { label: string | null; pct: number } {
  if (input.isLunarHoliday) {
    const groupEligible = input.groupSize >= 10;
    return groupEligible ? { label: "group", pct: 0.15 } : { label: null, pct: 0 };
  }

  const isChild =
    (input.species === "TERRAN" && input.age < 12) ||
    (input.species === "CENTAURIAN" && input.age < 14);
  const isSenior =
    (input.species === "TERRAN" && input.age >= 65) ||
    (input.species === "CENTAURIAN" && input.age >= 70);
  const isGroup = input.groupSize >= 10;

  // Highest discount wins when multiple apply; stacking rules unconfirmed (see §6).
  const candidates: Array<{ label: string; pct: number }> = [];
  if (isChild) candidates.push({ label: "child", pct: 0.25 });
  if (isSenior) candidates.push({ label: "senior", pct: 0.3 });
  if (isGroup) candidates.push({ label: "group", pct: 0.15 });

  if (candidates.length === 0) return { label: null, pct: 0 };
  return candidates.reduce((best, c) => (c.pct > best.pct ? c : best));
}

export function computePrice(input: PricingInput): PricingBreakdown {
  const dayCapacityAdjusted =
    input.basePrice * input.dayOfWeekMultiplier * input.projectedCapacityMultiplier;

  const { label, pct } = resolveDiscount(input);
  const subtotal = dayCapacityAdjusted * (1 - pct);
  const lunarTaxAmount = subtotal * LUNAR_TAX_RATE;
  const finalPrice = subtotal + lunarTaxAmount;

  return {
    basePrice: input.basePrice,
    dayOfWeekMultiplier: input.dayOfWeekMultiplier,
    capacityMultiplier: input.projectedCapacityMultiplier,
    discountLabel: label,
    discountPct: pct,
    subtotal,
    lunarTaxRate: LUNAR_TAX_RATE,
    lunarTaxAmount,
    finalPrice,
  };
}
