'use client';

import { useSession } from '@/lib/auth/client';
import { hasMinRole, type AppRole } from './roles';

export function useRole() {
  const { data: session, isPending } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? null;

  return {
    role,
    isLoading: isPending,
    isAuthenticated: Boolean(session?.user),
    isGuest: role === 'guest',
    isEditor: role === 'editor',
    isAdmin: role === 'admin',
    can: (minRole: AppRole) => hasMinRole(role, minRole),
  };
}
