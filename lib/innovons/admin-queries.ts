import type { Need, NeedStatus } from "./types";
import { MOCK_NEEDS } from "./mock-data";
import sql from "@/lib/db/neon";

// Statuts etendus pour la moderation
type ModerationNeedStatus = NeedStatus | "REJETE" | "REVISION_DEMANDEE";

// ── Helpers ─────────────────────────────────────────────────────────────────

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("your-") &&
      !process.env.DATABASE_URL.includes("placeholder"),
  );
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface ModerationItem {
  id: string;
  slug: string;
  titre: string;
  domaine: string;
  niveau: string;
  statut: ModerationNeedStatus;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_email: string;
  moderation_count: number;
}

export interface ModerationStats {
  pending: number;
  published: number;
  rejected: number;
  revision: number;
  total: number;
}

export type ModerationActionType =
  | "APPROVED"
  | "REJECTED"
  | "REVISION_REQUESTED";

export interface ModerationAction {
  needId: string;
  action: ModerationActionType;
  comment: string;
}

// ── Mock data ───────────────────────────────────────────────────────────────

const MOCK_MODERATION_QUEUE: ModerationItem[] = MOCK_NEEDS.filter(
  (n) => n.statut === "VALIDATION",
)
  .slice(0, 5)
  .map((n, i) => ({
    id: n.id,
    slug: n.slug,
    titre: n.titre,
    domaine: n.domaine,
    niveau: n.niveau,
    statut: n.statut,
    created_at: n.created_at,
    updated_at: n.updated_at,
    author_name: (([
      "Amadou Traore",
      "Fatima Ouedraogo",
      "Boukary Compaore",
      "Mariam Sawadogo",
      "Ibrahim Kabore",
    ][i % 5]) as string),
    author_email: `user${i + 1}@example.com`,
    moderation_count: 0,
  }));

const MOCK_MODERATION_STATS: ModerationStats = {
  pending: 0,
  published: 0,
  rejected: 0,
  revision: 0,
  total: 0,
};

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Retourne la file de moderation (besoins en attente de validation).
 */
export async function getModerationQueue(): Promise<ModerationItem[]> {
  if (!isNeonConfigured()) return MOCK_MODERATION_QUEUE;

  try {
    const rows = await sql`
      SELECT
        n.id,
        n.slug,
        n.titre,
        n.domaine,
        n.niveau,
        n.statut,
        n.created_at,
        n.updated_at,
        COALESCE(u.name, n.auteur_email, 'Inconnu') AS author_name,
        COALESCE(n.auteur_email, '') AS author_email,
        0 AS moderation_count
      FROM ie_needs n
      LEFT JOIN "user" u ON u.email = n.auteur_email
      WHERE n.statut = 'VALIDATION'
      ORDER BY n.created_at ASC
    `;
    return rows as unknown as ModerationItem[];
  } catch (err) {
    console.error("[getModerationQueue] Neon error:", err);
    return [];
  }
}

/**
 * Retourne les statistiques de moderation depuis Neon.
 */
export async function getModerationStats(): Promise<ModerationStats> {
  if (!isNeonConfigured()) return MOCK_MODERATION_STATS;

  try {
    const rows = await sql`
      SELECT
        COUNT(*) FILTER (WHERE statut = 'VALIDATION')::int        AS pending,
        COUNT(*) FILTER (WHERE statut = 'PUBLIE')::int            AS published,
        COUNT(*) FILTER (WHERE statut = 'REJETE')::int            AS rejected,
        COUNT(*) FILTER (WHERE statut = 'REVISION_DEMANDEE')::int AS revision,
        COUNT(*)::int                                             AS total
      FROM ie_needs
    `;
    const row = rows[0] as {
      pending: number;
      published: number;
      rejected: number;
      revision: number;
      total: number;
    } | undefined;
    return {
      pending: Number(row?.pending) || 0,
      published: Number(row?.published) || 0,
      rejected: Number(row?.rejected) || 0,
      revision: Number(row?.revision) || 0,
      total: Number(row?.total) || 0,
    };
  } catch (err) {
    console.error("[getModerationStats] Neon error:", err);
    return MOCK_MODERATION_STATS;
  }
}

/**
 * Retourne un besoin par id ou slug pour la revue de moderation.
 */
export async function getNeedForReview(id: string): Promise<Need | null> {
  if (!isNeonConfigured()) {
    return MOCK_NEEDS.find((n) => n.id === id || n.slug === id) ?? MOCK_NEEDS[0] ?? null;
  }

  try {
    const rows = await sql`
      SELECT * FROM ie_needs
      WHERE id = ${id} OR slug = ${id}
      LIMIT 1
    `;
    if (rows[0]) return rows[0] as unknown as Need;
    return MOCK_NEEDS.find((n) => n.id === id || n.slug === id) ?? null;
  } catch (err) {
    console.error("[getNeedForReview] Neon error:", err);
    return MOCK_NEEDS.find((n) => n.id === id || n.slug === id) ?? null;
  }
}

/**
 * Soumet une action de moderation (approbation, rejet, demande de revision).
 */
export async function submitModerationAction(
  action: ModerationAction,
): Promise<{ success: boolean; error?: string }> {
  if (!isNeonConfigured()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const statusMap: Record<ModerationActionType, ModerationNeedStatus> = {
    APPROVED: "PUBLIE",
    REJECTED: "REJETE",
    REVISION_REQUESTED: "REVISION_DEMANDEE",
  };
  const newStatus = statusMap[action.action];

  try {
    if (action.action === "APPROVED") {
      await sql`
        UPDATE ie_needs
        SET statut = ${newStatus}, updated_at = NOW(), published_at = NOW()
        WHERE id = ${action.needId}
      `;
    } else {
      await sql`
        UPDATE ie_needs
        SET statut = ${newStatus}, updated_at = NOW()
        WHERE id = ${action.needId}
      `;
    }
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    console.error("[submitModerationAction] Neon error:", message);
    return { success: false, error: message };
  }
}
