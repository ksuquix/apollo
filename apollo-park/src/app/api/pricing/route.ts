import { NextRequest, NextResponse } from "next/server";
import { computePrice } from "@/lib/pricing";
import type { PricingInput } from "@/types";

// POST /api/pricing — TECHNICAL_SPEC.md §2.1
// Real-time itemized price display with discounts, fees, Lunar Tax Authority rate.
export async function POST(req: NextRequest) {
  const input = (await req.json()) as PricingInput;
  const breakdown = computePrice(input);
  return NextResponse.json(breakdown);
}
