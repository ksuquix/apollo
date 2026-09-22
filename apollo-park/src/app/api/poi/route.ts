import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/poi — TECHNICAL_SPEC.md §3
// Short-TTL cache recommended at the edge/CDN layer given real-time wait-time requirement.
export async function GET() {
  const poi = await prisma.pointOfInterest.findMany({ include: { offerings: true } });
  return NextResponse.json(poi);
}
