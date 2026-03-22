import { getServerSession } from "@/lib/auth/server";
import sql from "@/lib/db/neon";
import type { Need, Proposal } from "./types";
import { MOCK_NEEDS } from "./mock-data";

// Profil utilisateur étendu
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "guest";
  organisation?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
}

// Mock user
const MOCK_USER_PROFILE: UserProfile = {
  id: "mock-user-1",
  name: "Adama Ouedraogo",
  email: "adama@example.bf",
  role: "guest",
  organisation: "TechBF Lab",
  bio: "Entrepreneur technologique au Burkina Faso, passionné par les solutions locales.",
  avatar_url: undefined,
  created_at: "2025-01-15T00:00:00Z",
};

// Mock proposals soumises par l'utilisateur
const MOCK_USER_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    need_id: "need-001",
    titre: "Application mobile de diagnostic précoce",
    description:
      "Plateforme mobile permettant aux agents de santé communautaires de faire des diagnostics précoces via IA.",
    porteur: "Adama Ouedraogo",
    organisation: "TechBF Lab",
    statut: "EN_ATTENTE",
    created_at: "2026-02-10T00:00:00Z",
  },
  {
    id: "prop-2",
    need_id: "need-003",
    titre: "Système d'alerte météo agricole SMS",
    description:
      "Solution SMS pour alerter les agriculteurs des risques météorologiques en temps réel.",
    porteur: "Adama Ouedraogo",
    organisation: "TechBF Lab",
    statut: "RETENU",
    created_at: "2026-01-20T00:00:00Z",
  },
];

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("your-"),
  );
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const session = await getServerSession();
    if (!session?.user) return null;

    // Role from session (better-auth additionalField)
    let role =
      ((session.user as { role?: string }).role as UserProfile["role"]) ??
      "guest";

    // Fallback: query DB directly if role is missing or default
    // (session might be cached before role migration)
    if (isNeonConfigured() && (role === "guest" || !role)) {
      try {
        const rows = await sql`
          SELECT role FROM "user" WHERE id = ${session.user.id} LIMIT 1
        `;
        if (rows[0]?.role) {
          role = rows[0].role as UserProfile["role"];
        }
      } catch {
        // keep session role
      }
    }

    return {
      id: session.user.id,
      name: session.user.name ?? session.user.email,
      email: session.user.email,
      role,
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
    return result as unknown as Need[];
  } catch {
    return MOCK_NEEDS.slice(0, 3).map((n) => ({ ...n, auteur_id: userId }));
  }
}

export async function getUserProposals(userId: string): Promise<Proposal[]> {
  if (!isNeonConfigured()) return MOCK_USER_PROPOSALS;

  try {
    const result = await sql`
      SELECT * FROM ie_proposals
      WHERE porteur_id = ${userId}
      ORDER BY created_at DESC
    `;
    return result as unknown as Proposal[];
  } catch {
    return MOCK_USER_PROPOSALS;
  }
}
