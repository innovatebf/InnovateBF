import type { Need, IEStats, CallForSolutions } from "./types";
import { MOCK_NEEDS, MOCK_STATS, MOCK_CALLS } from "./mock-data";

// ── Helpers ─────────────────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
  );
}

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Retourne tous les besoins publies.
 * Fallback sur les donnees mock si Supabase n'est pas configure.
 */
export async function getPublishedNeeds(): Promise<Need[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_NEEDS.filter((n) => n.statut === "PUBLIE");
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ie_needs")
      .select("*")
      .eq("statut", "PUBLIE")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[getPublishedNeeds] Supabase error:", error.message);
      return MOCK_NEEDS.filter((n) => n.statut === "PUBLIE");
    }

    return (data as Need[]) ?? [];
  } catch (err) {
    console.error("[getPublishedNeeds] Unexpected error:", err);
    return MOCK_NEEDS.filter((n) => n.statut === "PUBLIE");
  }
}

/**
 * Retourne un besoin par son slug.
 * Fallback sur les donnees mock si Supabase n'est pas configure.
 */
export async function getNeedBySlug(slug: string): Promise<Need | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_NEEDS.find((n) => n.slug === slug) ?? null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ie_needs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("[getNeedBySlug] Supabase error:", error.message);
      return MOCK_NEEDS.find((n) => n.slug === slug) ?? null;
    }

    return (data as Need) ?? null;
  } catch (err) {
    console.error("[getNeedBySlug] Unexpected error:", err);
    return MOCK_NEEDS.find((n) => n.slug === slug) ?? null;
  }
}

/**
 * Retourne les 5 KPIs agreges de la plateforme IE.
 * Fallback sur les donnees mock si Supabase n'est pas configure.
 */
export async function getStats(): Promise<IEStats> {
  if (!isSupabaseConfigured()) {
    return MOCK_STATS;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // Utilise la vue ie_stats pour une seule requete
    const { data, error } = await supabase
      .from("ie_stats")
      .select("*")
      .single();

    if (error || !data) {
      console.error("[getStats] Supabase error:", error?.message);
      return MOCK_STATS;
    }

    return {
      needsCount: Number(data.needs_count) || 0,
      proposalsCount: Number(data.proposals_count) || 0,
      parrainsCount: Number(data.parrains_count) || 0,
      populationImpact: Number(data.population_impact) || 0,
      budgetMobilise: Number(data.budget_mobilise) || 0,
    };
  } catch (err) {
    console.error("[getStats] Unexpected error:", err);
    return MOCK_STATS;
  }
}

/**
 * Retourne les appels a solutionnement ouverts.
 * Fallback sur les donnees mock si Supabase n'est pas configure.
 */
export async function getOpenCalls(): Promise<CallForSolutions[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CALLS.filter((c) => c.statut === "OUVERT");
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ie_calls")
      .select("*, need:ie_needs(*)")
      .eq("statut", "OUVERT")
      .order("deadline", { ascending: true });

    if (error) {
      console.error("[getOpenCalls] Supabase error:", error.message);
      return MOCK_CALLS.filter((c) => c.statut === "OUVERT");
    }

    return (data as CallForSolutions[]) ?? [];
  } catch (err) {
    console.error("[getOpenCalls] Unexpected error:", err);
    return MOCK_CALLS.filter((c) => c.statut === "OUVERT");
  }
}
