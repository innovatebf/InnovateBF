import { getServerSession } from "@/lib/auth/server";
import sql from "@/lib/db/neon";
import type { Need, Proposal } from "./types";
import { MOCK_NEEDS } from "./mock-data";

// Profil utilisateur
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("your-"),
  );
}

const MOCK_USER_PROFILE: UserProfile = {
  id: "mock-user-001",
  name: "Adama Ouedraogo",
  email: "adama@example.com",
  role: "UTILISATEUR",
};

// Mock proposals soumises par l'utilisateur
const MOCK_USER_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    need_id: "need-001",
    titre: "Application mobile de diagnostic precoce",
    description:
      "Plateforme mobile permettant aux agents de sante communautaires de faire des diagnostics precoces via IA.",
    porteur: "Adama Ouedraogo",
    organisation: "TechBF Lab",
    statut: "EN_ATTENTE",
    created_at: "2026-02-10T00:00:00Z",
  },
  {
    id: "prop-2",
    need_id: "need-003",
    titre: "Systeme d'alerte meteo agricole SMS",
    description:
      "Solution SMS pour alerter les agriculteurs des risques meteorologiques en temps reel.",
    porteur: "Adama Ouedraogo",
    organisation: "TechBF Lab",
    statut: "RETENU",
    created_at: "2026-01-20T00:00:00Z",
  },
];

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const session = await getServerSession();
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name ?? session.user.email,
      email: session.user.email,
      role: (session.user as { role?: string }).role ?? "UTILISATEUR",
    };
  } catch {
    return null;
  }
}

export async function getUserNeeds(
  userId: string,
  userEmail?: string,
): Promise<Need[]> {
  if (!isNeonConfigured()) {
    return MOCK_NEEDS.slice(0, 3).map((n) => ({ ...n, auteur_id: userId }));
  }

  try {
    const emailFilter = userEmail ?? "";
    const result = await sql`
      SELECT * FROM ie_needs
      WHERE auteur_id = ${userId}
         OR auteur_email = ${emailFilter}
      ORDER BY created_at DESC
    `;
    return (result ?? []) as Need[];
  } catch {
    return [];
  }
}

export async function getUserProposals(userId: string): Promise<Proposal[]> {
  if (!isNeonConfigured()) return MOCK_USER_PROPOSALS;

  try {
    const result = await sql`
      SELECT * FROM ie_proposals
      WHERE auteur_id = ${userId}
      ORDER BY created_at DESC
    `;
    return (result ?? []) as Proposal[];
  } catch {
    return MOCK_USER_PROPOSALS;
  }
}
