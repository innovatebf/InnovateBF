import { NextRequest, NextResponse } from "next/server";
import { requireRoleForApi } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/neon";
import { ROLES } from "@/lib/auth/roles";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRoleForApi("admin");
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { role } = body as { role: string };

  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }

  if (id === session.user.id && role !== "admin") {
    return NextResponse.json(
      { error: "Vous ne pouvez pas changer votre propre rôle" },
      { status: 400 },
    );
  }

  try {
    await getSql()`UPDATE "user" SET role = ${role} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
