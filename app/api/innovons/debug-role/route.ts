import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/innovons/user-queries";
import sql from "@/lib/db/neon";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = await getCurrentUser();

    let dbRow = null;
    if (session?.user?.id) {
      try {
        const rows = await sql`SELECT id, email, role FROM "user" WHERE id = ${session.user.id} LIMIT 1`;
        dbRow = rows[0] ?? null;
      } catch (e) {
        dbRow = { error: String(e) };
      }
    }

    return NextResponse.json({
      sessionUser: session?.user ?? null,
      sessionRole: (session?.user as { role?: string } | undefined)?.role ?? null,
      currentUser: user,
      dbRow,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
