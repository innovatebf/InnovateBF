"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Banknote,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Target,
  Globe,
  MapPin,
  Briefcase,
  CalendarDays,
  Lightbulb,
} from "lucide-react";
import type { Need, ObstacleCriticite, ResultatHorizon, ResultatNiveau } from "@/lib/innovons/types";

// ── Props ───────────────────────────────────────────────────────────────────

interface NeedDetailLabels {
  contexte: string;
  parties_prenantes: string;
  perimetre: string;
  question_centrale: string;
  obstacles: string;
  resultats: string;
  indicateurs: string;
  population: string;
  budget: string;
  propose_solution: string;
  synthese: string;
  criticite_c1: string;
  criticite_c2: string;
  criticite_c3: string;
  horizon_court: string;
  horizon_moyen: string;
  horizon_long: string;
  niveau_output: string;
  niveau_outcome: string;
  niveau_impact: string;
  controlabilite: string;
  pp_categorie: string;
  pp_acteur: string;
  pp_role: string;
  pp_position: string;
  ind_intitule: string;
  ind_type: string;
  ind_source: string;
  ind_baseline: string;
  ind_frequence: string;
  region: string;
  secteur: string;
  pays: string;
  published_at: string;
  back: string;
}

interface NeedDetailClientProps {
  need: Need;
  labels: NeedDetailLabels;
  locale: string;
  /** Slug from the URL segment — fallback when need.slug is null (Neon row without slug) */
  needSlug: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatBudget(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Mds FCFA`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} M FCFA`;
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000).toLocaleString("fr-FR")}K`;
  return n.toLocaleString("fr-FR");
}

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function criticiteColor(c: ObstacleCriticite) {
  const map = {
    1: { bg: "bg-secondary-50", text: "text-secondary-600", border: "border-secondary-200" },
    2: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    3: { bg: "bg-red-50", text: "text-primary-600", border: "border-red-200" },
  };
  return map[c];
}

function horizonLabel(h: ResultatHorizon, labels: NeedDetailLabels): string {
  const map: Record<ResultatHorizon, string> = {
    COURT: labels.horizon_court,
    MOYEN: labels.horizon_moyen,
    LONG: labels.horizon_long,
  };
  return map[h];
}

function niveauLabel(n: ResultatNiveau, labels: NeedDetailLabels): string {
  const map: Record<ResultatNiveau, string> = {
    OUTPUT: labels.niveau_output,
    OUTCOME: labels.niveau_outcome,
    IMPACT: labels.niveau_impact,
  };
  return map[n];
}

function criticiteLabel(c: ObstacleCriticite, labels: NeedDetailLabels): string {
  const map: Record<ObstacleCriticite, string> = {
    1: labels.criticite_c1,
    2: labels.criticite_c2,
    3: labels.criticite_c3,
  };
  return map[c];
}

// ── Accordion Section ───────────────────────────────────────────────────────

function AccordionSection({
  title,
  icon: Icon,
  defaultOpen,
  children,
}: {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <Icon className="size-5 text-secondary-600" aria-hidden="true" />
          <span className="text-base font-semibold text-gray-900">{title}</span>
        </span>
        {open ? (
          <ChevronUp className="size-5 text-gray-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-5 text-gray-400" aria-hidden="true" />
        )}
      </button>
      {open && <div className="border-t border-gray-100 px-6 py-5">{children}</div>}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function NeedDetailClient({ need, labels, locale, needSlug }: NeedDetailClientProps) {
  // Resolve slug: prefer need.slug (set for mock data), fallback to URL segment
  const resolvedSlug = need.slug || needSlug;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Back link */}
      <Link
        href="/innovons/besoins"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-secondary-600"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {labels.back}
      </Link>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Left: 7 dimensions accordion ───────────────────────────── */}
        <div className="flex-1 space-y-4">
          {/* 1. Contexte strategique */}
          <AccordionSection title={labels.contexte} icon={Globe} defaultOpen>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {need.contexte_strategique}
            </p>
          </AccordionSection>

          {/* 2. Parties prenantes */}
          <AccordionSection title={labels.parties_prenantes} icon={Users}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="pb-3 pr-4">{labels.pp_categorie}</th>
                    <th className="pb-3 pr-4">{labels.pp_acteur}</th>
                    <th className="pb-3 pr-4">{labels.pp_role}</th>
                    <th className="pb-3">{labels.pp_position}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {need.parties_prenantes.map((pp) => (
                    <tr key={pp.id}>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-secondary-50 px-2 py-0.5 text-xs font-medium text-secondary-600">
                          {pp.categorie}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-medium text-gray-900">{pp.acteur}</td>
                      <td className="py-3 pr-4 text-gray-600">{pp.role}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            pp.position === "Actif"
                              ? "bg-secondary-50 text-secondary-600"
                              : pp.position === "Oppose"
                                ? "bg-red-50 text-primary-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {pp.position}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionSection>

          {/* 3. Perimetre */}
          <AccordionSection title={labels.perimetre} icon={MapPin}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase text-gray-400">{labels.region}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{need.region}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase text-gray-400">{labels.secteur}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{need.secteur}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase text-gray-400">{labels.pays}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{need.pays}</p>
              </div>
            </div>
          </AccordionSection>

          {/* 4. Question centrale (mise en valeur) */}
          <AccordionSection title={labels.question_centrale} icon={Target} defaultOpen>
            <div className="rounded-xl bg-secondary-50 p-6">
              <p className="text-lg font-medium leading-relaxed text-gray-800">
                {need.question_centrale}
              </p>
            </div>
          </AccordionSection>

          {/* 5. Obstacles */}
          <AccordionSection title={`${labels.obstacles} (${need.obstacles.length})`} icon={AlertTriangle}>
            <div className="grid gap-4 sm:grid-cols-2">
              {need.obstacles.map((obs) => {
                const col = criticiteColor(obs.criticite);
                return (
                  <div
                    key={obs.id}
                    className={`rounded-xl border p-4 ${col.border} ${col.bg}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${col.text}`}>
                        C{obs.criticite} - {criticiteLabel(obs.criticite, labels)}
                      </span>
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                        {obs.nature}
                      </span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-gray-900">{obs.intitule}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{obs.description}</p>
                    <p className="mt-2 text-[11px] text-gray-400">
                      {labels.controlabilite}: {obs.controlabilite}
                    </p>
                  </div>
                );
              })}
            </div>
          </AccordionSection>

          {/* 6. Resultats attendus */}
          <AccordionSection title={`${labels.resultats} (${need.resultats.length})`} icon={Lightbulb}>
            <div className="grid gap-4 sm:grid-cols-2">
              {need.resultats.map((res) => (
                <div
                  key={res.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-secondary-50 px-2 py-0.5 text-xs font-medium text-secondary-600">
                      {niveauLabel(res.niveau, labels)}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      <Clock className="mr-1 inline size-3" aria-hidden="true" />
                      {horizonLabel(res.horizon, labels)}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900">{res.intitule}</h4>
                  <p className="mt-1 text-xs text-gray-500">{res.quantification}</p>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* 7. Indicateurs */}
          <AccordionSection title={`${labels.indicateurs} (${need.indicateurs.length})`} icon={Briefcase}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="pb-3 pr-4">{labels.ind_intitule}</th>
                    <th className="pb-3 pr-4">{labels.ind_type}</th>
                    <th className="pb-3 pr-4">{labels.ind_source}</th>
                    <th className="pb-3 pr-4">{labels.ind_baseline}</th>
                    <th className="pb-3">{labels.ind_frequence}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {need.indicateurs.map((ind) => (
                    <tr key={ind.id}>
                      <td className="py-3 pr-4 font-medium text-gray-900">{ind.intitule}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {ind.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{ind.source}</td>
                      <td className="py-3 pr-4 text-gray-600">{ind.baseline}</td>
                      <td className="py-3 text-gray-600">{ind.frequence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionSection>

          {/* Synthese narrative */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">{labels.synthese}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{need.synthese_narrative}</p>
          </div>
        </div>

        {/* ── Right sidebar ──────────────────────────────────────────── */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-40 space-y-4">
            {/* Stats card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary-50">
                    <Users className="size-5 text-secondary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{labels.population}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPopulation(need.population_impact)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary-50">
                    <Banknote className="size-5 text-secondary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{labels.budget}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatBudget(need.budget)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gray-50">
                    <CalendarDays className="size-5 text-gray-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{labels.published_at}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(need.published_at, locale)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/innovons/besoins/${resolvedSlug}/proposer`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-700"
            >
              <Lightbulb className="size-4" aria-hidden="true" />
              {labels.propose_solution}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
