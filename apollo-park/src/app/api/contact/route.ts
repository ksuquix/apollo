import { NextRequest, NextResponse } from "next/server";

// POST /api/contact — TECHNICAL_SPEC.md §5
// Channel-routing abstraction: normalizes email / HoloPhone / telepathic submissions
// into one support queue.
export async function POST(req: NextRequest) {
  const { channel, message } = await req.json();

  if (!["email", "holophone", "telepathic"].includes(channel)) {
    return NextResponse.json({ error: "Unsupported channel" }, { status: 400 });
  }

  // TODO: route to support queue.
  return NextResponse.json({ received: true, channel, message });
}
