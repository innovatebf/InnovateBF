import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IENavbar } from "@/components/innovons/IENavbar";
import { getNeedBySlug } from "@/lib/innovons/queries";
import { MOCK_NEEDS } from "@/lib/innovons/mock-data";
import { NeedDetailClient } from "@/components/innovons/NeedDetailClient";
import { VotePanel } from "@/components/innovons/VotePanel";
import { CommentSection } from "@/components/innovons/CommentSection";
import { getVoteScore, getComments } from "@/lib/innovons/forum-queries";

// ── Static params for mock slugs ────────────────────────────────────────────

export function generateStaticParams() {
  return MOCK_NEEDS.map((need) => ({ id: need.slug }));
}

// ── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const need = await getNeedBySlug(id);
  if (!need) return { title: "Not found" };

  const t = await getTranslations({ locale, namespace: "innovons.need_detail" });
  return {
    title: `${need.titre} - ${t("meta_suffix")}`,
    description: need.question_centrale,
  };
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function NeedDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const need = await getNeedBySlug(id);
  if (!need) notFound();

  const [voteData, comments] = await Promise.all([
    getVoteScore(need.id),
    getComments(need.id),
  ]);

  const t = await getTranslations("innovons.need_detail");

  // Prepare translated labels for client component
  const labels = {
    contexte: t("dim_contexte"),
    parties_prenantes: t("dim_parties_prenantes"),
    perimetre: t("dim_perimetre"),
    question_centrale: t("dim_question_centrale"),
    obstacles: t("dim_obstacles"),
    resultats: t("dim_resultats"),
    indicateurs: t("dim_indicateurs"),
    population: t("population"),
    budget: t("budget"),
    propose_solution: t("propose_solution"),
    synthese: t("synthese"),
    criticite_c1: t("criticite_c1"),
    criticite_c2: t("criticite_c2"),
    criticite_c3: t("criticite_c3"),
    horizon_court: t("horizon_court"),
    horizon_moyen: t("horizon_moyen"),
    horizon_long: t("horizon_long"),
    niveau_output: t("niveau_output"),
    niveau_outcome: t("niveau_outcome"),
    niveau_impact: t("niveau_impact"),
    controlabilite: t("controlabilite"),
    pp_categorie: t("pp_categorie"),
    pp_acteur: t("pp_acteur"),
    pp_role: t("pp_role"),
    pp_position: t("pp_position"),
    ind_intitule: t("ind_intitule"),
    ind_type: t("ind_type"),
    ind_source: t("ind_source"),
    ind_baseline: t("ind_baseline"),
    ind_frequence: t("ind_frequence"),
    region: t("region"),
    secteur: t("secteur"),
    pays: t("pays"),
    published_at: t("published_at"),
    back: t("back"),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <IENavbar />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] px-4 py-14 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary-600/20 px-3 py-1 text-xs font-semibold text-green-400">
              {need.domaine}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-300">
              {need.niveau}
            </span>
            {need.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {need.titre}
          </h1>
        </div>
      </section>

      {/* ── Content (client-side accordion + sidebar) ─────────────── */}
      <NeedDetailClient need={need} labels={labels} locale={locale} />

      {/* ── Forum section ────────────────────────────────────────────── */}
      <div className="bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="flex gap-6 items-start">
            <VotePanel
              needId={need.id}
              initialScore={voteData.vote_score}
              initialCount={voteData.vote_count}
            />
            <div className="flex-1 min-w-0">
              <CommentSection needId={need.id} initialComments={comments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
