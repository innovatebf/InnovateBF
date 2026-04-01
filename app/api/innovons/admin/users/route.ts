import { NextResponse } from "next/server";
import { requireRoleForApi } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/neon";

export async function GET() {
  const { error } = await requireRoleForApi("admin");
  if (error) return error;

  try {
    const users = await getSql()`
      SELECT id, name, email, role, "createdAt" as created_at
      FROM "user"
      ORDER BY "createdAt" DESC
    `;
    return NextResponse.json({ users });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
