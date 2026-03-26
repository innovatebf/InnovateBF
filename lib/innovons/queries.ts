import type { Need, IEStats, CallForSolutions } from "./types";
import { MOCK_NEEDS, MOCK_STATS, MOCK_CALLS } from "./mock-data";
import sql from "@/lib/db/neon";

// ── Helpers ─────────────────────────────────────────────────────────────────

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("your-") &&
      !process.env.DATABASE_URL.includes("placeholder"),
  );
}

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Retourne tous les besoins publiés.
 * Fallback sur les données mock si Neon n'est pas configuré.
 */
export async function getPublishedNeeds(): Promise<Need[]> {
  if (!isNeonConfigured()) {
    return MOCK_NEEDS.filter((n) => n.statut === "PUBLIE");
  }

  try {
    const rows = await sql`
      SELECT * FROM ie_needs
      WHERE statut = 'PUBLIE'
      ORDER BY published_at DESC NULLS LAST, created_at DESC
    `;
    if (rows.length > 0) return rows as unknown as Need[];
    return MOCK_NEEDS.filter((n) => n.statut === "PUBLIE");
  } catch (err) {
    console.error("[getPublishedNeeds] Neon error:", err);
    return MOCK_NEEDS.filter((n) => n.statut === "PUBLIE");
  }
}

/**
 * Retourne un besoin par son slug.
 */
export async function getNeedBySlug(slug: string): Promise<Need | null> {
  if (!isNeonConfigured()) {
    return MOCK_NEEDS.find((n) => n.slug === slug) ?? null;
  }

  try {
    const rows = await sql`
      SELECT * FROM ie_needs WHERE slug = ${slug} LIMIT 1
    `;
    if (rows[0]) return rows[0] as unknown as Need;
    return MOCK_NEEDS.find((n) => n.slug === slug) ?? null;
  } catch (err) {
    console.error("[getNeedBySlug] Neon error:", err);
    return MOCK_NEEDS.find((n) => n.slug === slug) ?? null;
  }
}

/**
 * Retourne les 5 KPIs agrégés de la plateforme IE depuis Neon.
 * Fallback sur les données mock si Neon n'est pas configuré.
 */
export async function getStats(): Promise<IEStats> {
  if (!isNeonConfigured()) {
    return MOCK_STATS;
  }

  try {
    const [needsRow, proposalsRow, usersRow] = await Promise.all([
      // Besoins publiés + sommes agrégées
      sql`
        SELECT
          COUNT(*)::int                          AS needs_count,
          COALESCE(SUM(population_impact), 0)::bigint AS population_impact,
          COALESCE(SUM(budget), 0)::bigint       AS budget_mobilise
        FROM ie_needs
        WHERE statut = 'PUBLIE'
      `,
      // Propositions soumises
      sql`SELECT COUNT(*)::int AS proposals_count FROM ie_proposals`,
      // Éditeurs = sponsors/parrains (users with role editor or admin)
      sql`SELECT COUNT(*)::int AS parrains_count FROM "user" WHERE role IN ('editor', 'admin')`,
    ]);

    return {
      needsCount: Number(needsRow[0]?.needs_count) || 0,
      proposalsCount: Number(proposalsRow[0]?.proposals_count) || 0,
      parrainsCount: Number(usersRow[0]?.parrains_count) || 0,
      populationImpact: Number(needsRow[0]?.population_impact) || 0,
      budgetMobilise: Number(needsRow[0]?.budget_mobilise) || 0,
    };
  } catch (err) {
    console.error("[getStats] Neon error:", err);
    return MOCK_STATS;
  }
}

/**
 * Retourne les appels à solutionnement ouverts.
 */
export async function getOpenCalls(): Promise<CallForSolutions[]> {
  if (!isNeonConfigured()) {
    return MOCK_CALLS.filter((c) => c.statut === "OUVERT");
  }

  try {
    const rows = await sql`
      SELECT * FROM ie_calls
      WHERE statut = 'OUVERT'
      ORDER BY deadline ASC NULLS LAST
    `;
    if (rows.length > 0) return rows as unknown as CallForSolutions[];
    return MOCK_CALLS.filter((c) => c.statut === "OUVERT");
  } catch (err) {
    console.error("[getOpenCalls] Neon error:", err);
    return MOCK_CALLS.filter((c) => c.statut === "OUVERT");
  }
}
