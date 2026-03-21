import type { Need, NeedStatus } from "./types";
import { MOCK_NEEDS } from "./mock-data";

// Statuts etendus pour la moderation (ajoute REJETE et REVISION_DEMANDEE)
// Ces statuts sont definis dans la migration 004_admin_moderation.sql
// et doivent etre ajoutes au type NeedStatus dans types.ts lors de l'integration.
type ModerationNeedStatus = NeedStatus | "REJETE" | "REVISION_DEMANDEE";

// ── Helpers ─────────────────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
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
    author_name: [
      "Amadou Traore",
      "Fatima Ouedraogo",
      "Boukary Compaore",
      "Mariam Sawadogo",
      "Ibrahim Kabore",
    ][i % 5],
    author_email: `user${i + 1}@example.com`,
    moderation_count: Math.floor(Math.random() * 3),
  }));

const MOCK_MODERATION_STATS: ModerationStats = {
  pending: 12,
  published: 89,
  rejected: 8,
  revision: 7,
  total: 116,
};

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Retourne la file de moderation (besoins en attente de validation).
 * Fallback sur les donnees mock si Supabase n'est pas configure.
 */
export async function getModerationQueue(): Promise<ModerationItem[]> {
  if (!isSupabaseConfigured()) return MOCK_MODERATION_QUEUE;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ie_moderation_queue")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[getModerationQueue] Supabase error:", error.message);
      return MOCK_MODERATION_QUEUE;
    }

    return (data as ModerationItem[]) ?? [];
  } catch (err) {
    console.error("[getModerationQueue] Unexpected error:", err);
    return MOCK_MODERATION_QUEUE;
  }
}

/**
 * Retourne les statistiques de moderation.
 * Fallback sur les donnees mock si Supabase n'est pas configure.
 */
export async function getModerationStats(): Promise<ModerationStats> {
  if (!isSupabaseConfigured()) return MOCK_MODERATION_STATS;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ie_needs")
      .select("statut");

    if (error) {
      console.error("[getModerationStats] Supabase error:", error.message);
      return MOCK_MODERATION_STATS;
    }

    const needs = data ?? [];
    return {
      pending: needs.filter((n) => n.statut === "VALIDATION").length,
      published: needs.filter((n) => n.statut === "PUBLIE").length,
      rejected: needs.filter((n) => n.statut === "REJETE").length,
      revision: needs.filter((n) => n.statut === "REVISION_DEMANDEE").length,
      total: needs.length,
    };
  } catch (err) {
    console.error("[getModerationStats] Unexpected error:", err);
    return MOCK_MODERATION_STATS;
  }
}

/**
 * Retourne un besoin par id ou slug pour la revue de moderation.
 * Fallback sur les donnees mock si Supabase n'est pas configure.
 */
export async function getNeedForReview(id: string): Promise<Need | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_NEEDS.find((n) => n.id === id || n.slug === id) ?? MOCK_NEEDS[0];
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ie_needs")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (error) {
      console.error("[getNeedForReview] Supabase error:", error.message);
      return MOCK_NEEDS.find((n) => n.id === id || n.slug === id) ?? MOCK_NEEDS[0];
    }

    return (data as Need) ?? null;
  } catch (err) {
    console.error("[getNeedForReview] Unexpected error:", err);
    return MOCK_NEEDS[0];
  }
}

/**
 * Soumet une action de moderation (approbation, rejet, demande de revision).
 * Met a jour le statut du besoin et insere un commentaire de moderation.
 * Fallback mock si Supabase n'est pas configure.
 */
export async function submitModerationAction(
  action: ModerationAction,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Mock : simuler un delai et retourner succes
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // Mapper l'action vers un statut de besoin (conventions francaises)
    const statusMap: Record<ModerationActionType, ModerationNeedStatus> = {
      APPROVED: "PUBLIE",
      REJECTED: "REJETE",
      REVISION_REQUESTED: "REVISION_DEMANDEE",
    };
    const newStatus = statusMap[action.action];

    // Mettre a jour le statut du besoin
    const updateData: Record<string, string> = {
      statut: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Si approuve, definir la date de publication
    if (action.action === "APPROVED") {
      updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("ie_needs")
      .update(updateData)
      .eq("id", action.needId);

    if (updateError) throw updateError;

    // Inserer le commentaire de moderation
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: commentError } = await supabase
      .from("ie_moderation_comments")
      .insert({
        need_id: action.needId,
        admin_id: user?.id,
        action: action.action,
        comment: action.comment,
      });

    if (commentError) throw commentError;

    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    console.error("[submitModerationAction] Error:", message);
    return { success: false, error: message };
  }
}
