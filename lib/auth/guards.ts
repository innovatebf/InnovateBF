import { getServerSession } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { hasMinRole, type AppRole } from './roles';

type SessionResult = NonNullable<Awaited<ReturnType<typeof getServerSession>>>;

export async function requireRole(minRole: AppRole, locale = 'fr'): Promise<SessionResult> {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${locale}/innovons/connexion`);
  }
  const role = (session.user as { role?: string }).role;
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
      error: new Response(JSON.stringify({ error: 'Non authentifie' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  const role = (session.user as { role?: string }).role;
  if (!hasMinRole(role, minRole)) {
    return {
      session: null,
      error: new Response(JSON.stringify({ error: 'Acces interdit' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  return { session: session as SessionResult, error: null };
}
