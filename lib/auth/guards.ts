import { getServerSession } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { hasMinRole, type AppRole } from './roles';
import sql from '@/lib/db/neon';

type SessionResult = NonNullable<Awaited<ReturnType<typeof getServerSession>>>;

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('your-'),
  );
}

/** Resolve role: session first, DB fallback if missing/guest */
async function resolveRole(userId: string, sessionRole?: string): Promise<string> {
  const role = sessionRole ?? 'guest';
  if (role !== 'guest' && role) return role;
  if (!isNeonConfigured()) return role;
  try {
    const rows = await sql`SELECT role FROM "user" WHERE id = ${userId} LIMIT 1`;
    return (rows[0]?.role as string) ?? role;
  } catch {
    return role;
  }
}

export async function requireRole(minRole: AppRole, locale = 'fr'): Promise<SessionResult> {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${locale}/innovons/connexion`);
  }
  const sessionRole = (session.user as { role?: string }).role;
  const role = await resolveRole(session.user.id, sessionRole);
  if (!hasMinRole(role, minRole)) {
    redirect(`/${locale}/innovons`);
  }
  return session as SessionResult;
}

export async function requireRoleForApi(minRole: AppRole): Promise<
  | { session: SessionResult; error: null }
  | { session: null; error: Response }
> {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      session: null,
      error: new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  const sessionRole = (session.user as { role?: string }).role;
  const role = await resolveRole(session.user.id, sessionRole);
  if (!hasMinRole(role, minRole)) {
    return {
      session: null,
      error: new Response(JSON.stringify({ error: 'Accès interdit' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  return { session: session as SessionResult, error: null };
}
