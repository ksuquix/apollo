import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";

// POST /api/tickets — TECHNICAL_SPEC.md §2.3
// Issues QR + Holocube codes; for CYBERNETIC_IMPLANT delivery, hands off to the
// eMAC transfer protocol (not yet implemented — see TECHNICAL_SPEC.md §6 open question).
export async function POST(req: NextRequest) {
  const body = await req.json();

  const ticket = await prisma.ticket.create({
    data: {
      ...body,
      qrCode: randomUUID(),
      holocubeCode: randomUUID(),
    },
  });

  if (ticket.deliveryChannel === "CYBERNETIC_IMPLANT") {
    // TODO: integrate eMAC transfer protocol once a spec/SDK is confirmed.
  }

  return NextResponse.json(ticket, { status: 201 });
}
