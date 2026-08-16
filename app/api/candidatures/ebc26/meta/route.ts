import { NextResponse } from "next/server";

const CLOTURE_LE = process.env.EBC26_CLOTURE_LE ?? "2026-10-31T23:59:59Z";

export async function GET() {
  const now = new Date();
  const cloture = new Date(CLOTURE_LE);
  return NextResponse.json({
    ouvert: now < cloture,
    clotureLe: CLOTURE_LE,
    dateConference: "2026-11-13",
    lieu: "CEA-UNB, Bobo-Dioulasso",
  });
}
