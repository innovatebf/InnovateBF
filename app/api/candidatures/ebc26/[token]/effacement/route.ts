import { NextRequest, NextResponse } from "next/server";
import { effacerDossier } from "@/lib/candidatures/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const result = await effacerDossier(token);
  return NextResponse.json(result, { status: 200 });
}
