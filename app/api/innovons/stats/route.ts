import { NextResponse } from "next/server";
import { getStats } from "@/lib/innovons/queries";

/**
 * GET /api/innovons/stats
 *
 * Retourne les 5 indicateurs cles d'impact (KI) de la plateforme IE.
 * - Essaie Supabase (vue ie_stats) en priorite
 * - Fallback sur donnees mock si Supabase non configure
 * - Cache : revalidate toutes les 5 minutes (PRD KI-F05)
 * - Aucune donnee personnelle dans la reponse (PRD KI-NF03)
 */
export const revalidate = 300; // 5 minutes

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    const stats = await getStats();

    // PRD KI-NF03 : aucune donnee personnelle dans la reponse
    return NextResponse.json(stats, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        ...corsHeaders,
      },
    });
  } catch {
    // Fallback complet en cas d'erreur inattendue — retourne des zeros
    // plutot qu'une erreur 500 pour ne pas casser l'UI
    return NextResponse.json(
      {
        needsCount: 0,
        proposalsCount: 0,
        parrainsCount: 0,
        populationImpact: 0,
        budgetMobilise: 0,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          ...corsHeaders,
        },
      },
    );
  }
}
