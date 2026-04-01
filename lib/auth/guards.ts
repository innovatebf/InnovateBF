import { getServerSession } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { hasMinRole, type AppRole } from './roles';
import { getSql } from '@/lib/db/neon';

type SessionResult = NonNullable<Awaited<ReturnType<typeof getServerSession>>>;

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('your-'),
  );
}

/** Normalize legacy/uppercase role values (e.g. ADMINISTRATEUR → admin) */
function normalizeRole(raw: string | undefined | null): string {
  if (!raw) return 'guest';
  switch (raw.toUpperCase()) {
    case 'ADMIN':
    case 'ADMINISTRATEUR':
      return 'admin';
    case 'EDITOR':
    case 'EDITEUR':
      return 'editor';
    default:
      return 'guest';
  }
}

/** Resolve role: session first, DB fallback if guest, always normalize legacy values */
async function resolveRole(userId: string, sessionRole?: string): Promise<string> {
  const role = normalizeRole(sessionRole);
  if (role !== 'guest') return role;
  if (!isNeonConfigured()) return role;
  try {
    const rows = await getSql()`SELECT role FROM "user" WHERE id = ${userId} LIMIT 1`;
    return normalizeRole(rows[0]?.role as string | undefined);
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
