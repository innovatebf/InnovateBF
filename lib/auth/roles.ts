export const ROLES = ['admin', 'editor', 'guest'] as const;
export type AppRole = typeof ROLES[number];

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  guest: 1,
  editor: 2,
  admin: 3,
};

export const DEFAULT_ROLE: AppRole = 'guest';

export function hasMinRole(userRole: string | undefined | null, required: AppRole): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole as AppRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[required];
  return userLevel >= requiredLevel;
}

export type SecurityLevel = 'public' | 'internal' | 'private' | 'admin';
