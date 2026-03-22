"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  AlertTriangle,
  Send,
  PartyPopper,
} from "lucide-react";

// ── Zod schema ─────────────────────────────────────────────────────────────

const stakeholderSchema = z.object({
  category: z.string().min(1),
  actor: z.string().min(1),
  role: z.string().min(1),
  position: z.enum(["ACTIF", "NEUTRE", "OPPOSE"]),
});

const scopeIncludedSchema = z.object({
  axis: z.string().min(1),
  justification: z.string().min(1),
});

const scopeExcludedSchema = z.object({
  element: z.string().min(1),
  reason: z.string().min(1),
});

const obstacleSchema = z.object({
  title: z.string().min(1),
  nature: z.string().min(1),
  description: z.string().min(1),
  criticality: z.number().min(1).max(3),
  controllability: z.string().min(1),
});

const resultSchema = z.object({
  title: z.string().min(1),
  level: z.enum(["OUTPUT", "OUTCOME", "IMPACT"]),
  quantification: z.string().min(1),
  horizon: z.enum(["COURT", "MOYEN", "LONG"]),
});

const indicatorSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["PROCESSUS", "RESULTAT", "CONTEXTE"]),
  linkedResult: z.string(),
  source: z.string().min(1),
  baseline: z.string(),
  frequency: z.string().min(1),
});

const needFormSchema = z.object({
  title: z.string().min(5),
  domain: z.string().min(1),
  sector: z.string(),
  country: z.string().min(1),
  level: z.enum(["LOCAL", "NATIONAL", "REGIONAL", "INTERNATIONAL"]),
  region: z.string(),
  strategicContext: z.string(),
  stakeholders: z.array(stakeholderSchema),
  scopeIncluded: z.array(scopeIncludedSchema),
  scopeExcluded: z.array(scopeExcludedSchema),
  centralQuestion: z.string(),
  obstacles: z.array(obstacleSchema),
  results: z.array(resultSchema),
  indicators: z.array(indicatorSchema),
  narrativeSummary: z.string(),
});

type NeedFormData = z.infer<typeof needFormSchema>;

// ── Constants ──────────────────────────────────────────────────────────────

const DOMAINS = [
  "Santé",
  "Agriculture",
  "Éducation",
  "Eau",
  "Énergie",
  "Numérique",
  "Sécurité",
  "Industrie",
  "Environnement",
  "Finance",
  "Transport",
  "Social",
];

const PRESCRIPTIVE_TERMS = [
  "mettre en place",
  "créer un programme",
  "lancer une initiative",
  "développer un système",
  "implémenter",
  "solution",
  "réponse",
];

const STAKEHOLDER_CATEGORIES = [
  "Gouvernement",
  "Secteur privé",
  "Société civile",
  "Partenaire technique",
  "Communauté locale",
  "Organisation internationale",
  "Institution académique",
];

const STEP_COUNT = 8;

// ── Helpers ────────────────────────────────────────────────────────────────

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function detectPrescriptiveTerms(text: string): string[] {
  const lower = text.toLowerCase();
  return PRESCRIPTIVE_TERMS.filter((term) => lower.includes(term));
}

// ── Component ──────────────────────────────────────────────────────────────

export function NeedStepper() {
  const t = useTranslations("innovons.deposer");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<NeedFormData>({
    resolver: zodResolver(needFormSchema),
    defaultValues: {
      title: "",
      domain: "",
      sector: "",
      country: "Burkina Faso",
      level: "NATIONAL",
      region: "",
      strategicContext: "",
      stakeholders: [],
      scopeIncluded: [],
      scopeExcluded: [],
      centralQuestion: "",
      obstacles: [],
      results: [],
      indicators: [],
      narrativeSummary: "",
    },
    mode: "onChange",
  });

  const {
    fields: stakeholderFields,
    append: appendStakeholder,
    remove: removeStakeholder,
  } = useFieldArray({ control, name: "stakeholders" });

  const {
    fields: scopeIncFields,
    append: appendScopeInc,
    remove: removeScopeInc,
  } = useFieldArray({ control, name: "scopeIncluded" });

  const {
    fields: scopeExcFields,
    append: appendScopeExc,
    remove: removeScopeExc,
  } = useFieldArray({ control, name: "scopeExcluded" });

  const {
    fields: obstacleFields,
    append: appendObstacle,
    remove: removeObstacle,
  } = useFieldArray({ control, name: "obstacles" });

  const {
    fields: resultFields,
    append: appendResult,
    remove: removeResult,
  } = useFieldArray({ control, name: "results" });

  const {
    fields: indicatorFields,
    append: appendIndicator,
    remove: removeIndicator,
  } = useFieldArray({ control, name: "indicators" });

  const watchAll = watch();

  const stepLabels = useMemo(
    () => [
      t("step_context"),
      t("step_stakeholders"),
      t("step_scope"),
      t("step_question"),
      t("step_obstacles"),
      t("step_results"),
      t("step_indicators"),
      t("step_review"),
    ],
    [t],
  );

  // ── Word count color for strategic context ────────────────────────────
  const strategicContextWords = countWords(watchAll.strategicContext ?? "");
  const wordCountColor =
    strategicContextWords < 100
      ? "text-gray-400"
      : strategicContextWords <= 150
        ? "text-green-600"
        : "text-red-600";

  // ── Prescriptive term detection ───────────────────────────────────────
  const detectedTerms = detectPrescriptiveTerms(
    watchAll.strategicContext ?? "",
  );

  // ── 6 tests for central question ─────────────────────────────────────
  const centralQuestion = watchAll.centralQuestion ?? "";
  const tests = useMemo(() => {
    const q = centralQuestion;
    const hasMultipleQuestions =
      (q.match(/\?/g) ?? []).length > 1 && q.toLowerCase().includes(" et ");

    return [
      { label: t("test_openness"), pass: q.length > 20 },
      {
        label: t("test_neutrality"),
        pass: detectPrescriptiveTerms(q).length === 0,
      },
      {
        label: t("test_relevance"),
        pass:
          (watchAll.strategicContext ?? "").length > 0 && q.length > 30,
      },
      {
        label: t("test_delimitation"),
        pass: (watchAll.scopeIncluded ?? []).length > 0,
      },
      {
        label: t("test_actionability"),
        pass: (watchAll.obstacles ?? []).length > 0 || q.length > 50,
      },
      {
        label: t("test_uniqueness"),
        pass: !hasMultipleQuestions,
      },
    ];
  }, [centralQuestion, watchAll.strategicContext, watchAll.scopeIncluded, watchAll.obstacles, t]);

  // ── Coherence score C1-C7 ─────────────────────────────────────────────
  const coherenceChecks = useMemo(() => {
    return [
      {
        label: t("review_c1"),
        pass:
          (watchAll.title ?? "").length >= 5 &&
          (watchAll.domain ?? "").length > 0 &&
          (watchAll.strategicContext ?? "").length > 0,
      },
      {
        label: t("review_c2"),
        pass: (watchAll.stakeholders ?? []).length > 0,
      },
      {
        label: t("review_c3"),
        pass: (watchAll.scopeIncluded ?? []).length > 0,
      },
      {
        label: t("review_c4"),
        pass:
          (watchAll.centralQuestion ?? "").length > 30 &&
          tests.filter((t) => t.pass).length >= 4,
      },
      {
        label: t("review_c5"),
        pass: (watchAll.obstacles ?? []).length > 0,
      },
      {
        label: t("review_c6"),
        pass: (watchAll.results ?? []).length > 0,
      },
      {
        label: t("review_c7"),
        pass: (watchAll.indicators ?? []).length > 0,
      },
    ];
  }, [watchAll, tests, t]);

  const coherenceScore = coherenceChecks.filter((c) => c.pass).length;
  const scoreColor =
    coherenceScore <= 3
      ? "text-red-600"
      : coherenceScore <= 5
        ? "text-amber-600"
        : "text-green-600";
  const scoreBgColor =
    coherenceScore <= 3
      ? "bg-red-50 border-red-200"
      : coherenceScore <= 5
        ? "bg-amber-50 border-amber-200"
        : "bg-green-50 border-green-200";

  // ── Navigation ────────────────────────────────────────────────────────
  const goTo = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(STEP_COUNT - 1, step)));
  }, []);

  const onSubmit = async (data: NeedFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        titre: data.title,
        domaine: data.domain,
        secteur: data.sector,
        pays: data.country,
        niveau: data.level,
        region: data.region,
        contexte_strategique: data.strategicContext,
        question_centrale: data.centralQuestion,
        perimetre_inclus: data.scopeIncluded || [],
        perimetre_exclus: data.scopeExcluded || [],
        parties_prenantes: data.stakeholders || [],
        obstacles: data.obstacles || [],
        resultats: data.results || [],
        indicateurs: data.indicators || [],
        synthese_narrative: data.narrativeSummary,
        coherence_score: coherenceScore,
      };

      const res = await fetch("/api/innovons/besoins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la soumission");
      }

      setSubmitted(true);
      setTimeout(() => {
        router.push("/innovons/mon-espace/besoins");
      }, 2500);
    } catch (error) {
      console.error("Erreur soumission:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erreur inconnue",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSavedDraft(false);
    try {
      const data = getValues();
      const payload = {
        titre: data.title || "Brouillon sans titre",
        domaine: data.domain,
        secteur: data.sector,
        pays: data.country,
        niveau: data.level,
        region: data.region,
        contexte_strategique: data.strategicContext,
        question_centrale: data.centralQuestion,
        perimetre_inclus: data.scopeIncluded || [],
        perimetre_exclus: data.scopeExcluded || [],
        parties_prenantes: data.stakeholders || [],
        obstacles: data.obstacles || [],
        resultats: data.results || [],
        indicateurs: data.indicators || [],
        synthese_narrative: data.narrativeSummary,
        coherence_score: coherenceScore,
        statut: "BROUILLON",
      };

      const res = await fetch("/api/innovons/besoins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la sauvegarde");
      }

      setSavedDraft(true);
      setTimeout(() => setSavedDraft(false), 3000);
    } catch (error) {
      console.error("Erreur sauvegarde brouillon:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100">
          <PartyPopper className="size-10 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("success_title")}</h2>
        <p className="mt-3 text-gray-500">{t("success_desc")}</p>
      </div>
    );
  }

  // ── Shared input styles ───────────────────────────────────────────────
  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";
  const selectCls =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";
  const textareaCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-y";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700";
  const errorCls = "mt-1 text-xs text-red-600";

  return (
    <div>
      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-[640px] items-center justify-between">
          {stepLabels.map((label, idx) => {
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <div
                  className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-green-600 text-white"
                      : isDone
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="size-5" aria-hidden="true" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Progress line */}
        <div className="mt-2 h-1 min-w-[640px] rounded-full bg-gray-200">
          <div
            className="h-1 rounded-full bg-green-600 transition-all"
            style={{
              width: `${((currentStep + 1) / STEP_COUNT) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* ── Step content ─────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          {/* ── STEP 1: Contexte ─────────────────────────────────────── */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900">
                {t("step_context")}
              </h3>

              <div>
                <label htmlFor="title" className={labelCls}>
                  {t("title_label")} *
                </label>
                <input
                  id="title"
                  {...register("title")}
                  placeholder={t("title_placeholder")}
                  className={inputCls}
                />
                {errors.title && (
                  <p className={errorCls}>{errors.title.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="domain" className={labelCls}>
                    {t("domain_label")} *
                  </label>
                  <select id="domain" {...register("domain")} className={selectCls}>
                    <option value="">--</option>
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sector" className={labelCls}>
                    {t("sector_label")}
                  </label>
                  <input
                    id="sector"
                    {...register("sector")}
                    placeholder={t("sector_placeholder")}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="country" className={labelCls}>
                    {t("country_label")}
                  </label>
                  <input
                    id="country"
                    {...register("country")}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="level" className={labelCls}>
                    {t("level_label")}
                  </label>
                  <select id="level" {...register("level")} className={selectCls}>
                    <option value="LOCAL">{t("level_local")}</option>
                    <option value="NATIONAL">{t("level_national")}</option>
                    <option value="REGIONAL">{t("level_regional")}</option>
                    <option value="INTERNATIONAL">
                      {t("level_international")}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="region" className={labelCls}>
                  {t("region_label")}
                </label>
                <input
                  id="region"
                  {...register("region")}
                  placeholder={t("region_placeholder")}
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="strategicContext" className={labelCls}>
                  {t("strategic_context_label")}
                </label>
                <textarea
                  id="strategicContext"
                  {...register("strategicContext")}
                  rows={5}
                  placeholder={t("strategic_context_placeholder")}
                  className={textareaCls}
                />
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-xs font-medium ${wordCountColor}`}>
                    {t("word_count", { count: strategicContextWords })}
                  </span>
                </div>
                {detectedTerms.length > 0 && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    <AlertTriangle
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      {t("prescriptive_alert", {
                        terms: detectedTerms.join(", "),
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: Décideurs ────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("step_stakeholders")}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendStakeholder({
                      category: "",
                      actor: "",
                      role: "",
                      position: "NEUTRE",
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t("add_item")}
                </button>
              </div>

              {stakeholderFields.length === 0 && (
                <p className="text-sm text-gray-400">
                  Aucune partie prenante ajoutée.
                </p>
              )}

              {stakeholderFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStakeholder(idx)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={t("remove_item")}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>
                        {t("stakeholder_category")}
                      </label>
                      <select
                        {...register(`stakeholders.${idx}.category`)}
                        className={selectCls}
                      >
                        <option value="">--</option>
                        {STAKEHOLDER_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t("stakeholder_actor")}
                      </label>
                      <input
                        {...register(`stakeholders.${idx}.actor`)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t("stakeholder_role")}
                      </label>
                      <input
                        {...register(`stakeholders.${idx}.role`)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t("stakeholder_position")}
                      </label>
                      <select
                        {...register(`stakeholders.${idx}.position`)}
                        className={selectCls}
                      >
                        <option value="ACTIF">{t("position_active")}</option>
                        <option value="NEUTRE">{t("position_neutral")}</option>
                        <option value="OPPOSE">{t("position_opposed")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 3: Périmètre ───────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-gray-900">
                {t("step_scope")}
              </h3>

              {/* Included */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    {t("scope_included")}
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      appendScopeInc({ axis: "", justification: "" })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    {t("add_item")}
                  </button>
                </div>
                {scopeIncFields.length === 0 && (
                  <p className="text-sm text-gray-400">Aucun axe ajouté.</p>
                )}
                {scopeIncFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeScopeInc(idx)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={t("remove_item")}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>{t("scope_axis")}</label>
                        <input
                          {...register(`scopeIncluded.${idx}.axis`)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("scope_justification")}
                        </label>
                        <input
                          {...register(`scopeIncluded.${idx}.justification`)}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Excluded */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    {t("scope_excluded")}
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      appendScopeExc({ element: "", reason: "" })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    {t("add_item")}
                  </button>
                </div>
                {scopeExcFields.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Aucun élément exclu ajouté.
                  </p>
                )}
                {scopeExcFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeScopeExc(idx)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={t("remove_item")}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>
                          {t("scope_element")}
                        </label>
                        <input
                          {...register(`scopeExcluded.${idx}.element`)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("scope_reason")}
                        </label>
                        <input
                          {...register(`scopeExcluded.${idx}.reason`)}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Question centrale ────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900">
                {t("step_question")}
              </h3>

              <div>
                <label htmlFor="centralQuestion" className={labelCls}>
                  {t("central_question_label")}
                </label>
                <textarea
                  id="centralQuestion"
                  {...register("centralQuestion")}
                  rows={5}
                  placeholder={t("central_question_placeholder")}
                  className={textareaCls}
                />
              </div>

              {/* 6 tests table */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">
                  Tests de validation
                </h4>
                <div className="space-y-2">
                  {tests.map((test, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {test.pass ? (
                        <CheckCircle
                          className="size-5 text-green-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="size-5 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-sm ${test.pass ? "text-green-700" : "text-gray-500"}`}
                      >
                        T{idx + 1} {test.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Obstacles ────────────────────────────────────── */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("step_obstacles")}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendObstacle({
                      title: "",
                      nature: "",
                      description: "",
                      criticality: 1,
                      controllability: "",
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t("add_item")}
                </button>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span>{t("obstacle_warning")}</span>
              </div>

              {obstacleFields.length === 0 && (
                <p className="text-sm text-gray-400">
                  Aucun obstacle ajouté.
                </p>
              )}

              {obstacleFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Obstacle #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeObstacle(idx)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={t("remove_item")}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>
                          {t("obstacle_title")}
                        </label>
                        <input
                          {...register(`obstacles.${idx}.title`)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("obstacle_nature")}
                        </label>
                        <select
                          {...register(`obstacles.${idx}.nature`)}
                          className={selectCls}
                        >
                          <option value="">--</option>
                          <option value="TECHNIQUE">
                            {t("nature_technical")}
                          </option>
                          <option value="FINANCIER">
                            {t("nature_financial")}
                          </option>
                          <option value="POLITIQUE">
                            {t("nature_political")}
                          </option>
                          <option value="SOCIAL">{t("nature_social")}</option>
                          <option value="JURIDIQUE">
                            {t("nature_legal")}
                          </option>
                          <option value="ENVIRONNEMENTAL">
                            {t("nature_environmental")}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>
                        {t("obstacle_description")}
                      </label>
                      <textarea
                        {...register(`obstacles.${idx}.description`)}
                        rows={3}
                        className={textareaCls}
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>
                          {t("obstacle_criticality")}
                        </label>
                        <Controller
                          control={control}
                          name={`obstacles.${idx}.criticality`}
                          render={({ field: f }) => (
                            <div className="flex gap-2">
                              {[1, 2, 3].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => f.onChange(val)}
                                  className={`flex size-10 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                                    f.value === val
                                      ? val === 1
                                        ? "border-green-300 bg-green-100 text-green-700"
                                        : val === 2
                                          ? "border-amber-300 bg-amber-100 text-amber-700"
                                          : "border-red-300 bg-red-100 text-red-700"
                                      : "border-gray-200 bg-white text-gray-400"
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          )}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("obstacle_controllability")}
                        </label>
                        <select
                          {...register(`obstacles.${idx}.controllability`)}
                          className={selectCls}
                        >
                          <option value="">--</option>
                          <option value="FULL">
                            {t("controllability_full")}
                          </option>
                          <option value="PARTIAL">
                            {t("controllability_partial")}
                          </option>
                          <option value="NONE">
                            {t("controllability_none")}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 6: Résultats ────────────────────────────────────── */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("step_results")}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendResult({
                      title: "",
                      level: "OUTPUT",
                      quantification: "",
                      horizon: "COURT",
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t("add_item")}
                </button>
              </div>

              {resultFields.length === 0 && (
                <p className="text-sm text-gray-400">
                  Aucun résultat ajouté.
                </p>
              )}

              {resultFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {t("result_title")} #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeResult(idx)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={t("remove_item")}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>{t("result_title")}</label>
                      <input
                        {...register(`results.${idx}.title`)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t("result_level")}</label>
                      <select
                        {...register(`results.${idx}.level`)}
                        className={selectCls}
                      >
                        <option value="OUTPUT">OUTPUT</option>
                        <option value="OUTCOME">OUTCOME</option>
                        <option value="IMPACT">IMPACT</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t("result_horizon")}
                      </label>
                      <select
                        {...register(`results.${idx}.horizon`)}
                        className={selectCls}
                      >
                        <option value="COURT">{t("horizon_short")}</option>
                        <option value="MOYEN">{t("horizon_medium")}</option>
                        <option value="LONG">{t("horizon_long")}</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>
                        {t("result_quantification")}
                      </label>
                      <input
                        {...register(`results.${idx}.quantification`)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 7: Indicateurs ──────────────────────────────────── */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("step_indicators")}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendIndicator({
                      title: "",
                      type: "PROCESSUS",
                      linkedResult: "",
                      source: "",
                      baseline: "",
                      frequency: "",
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t("add_item")}
                </button>
              </div>

              {indicatorFields.length === 0 && (
                <p className="text-sm text-gray-400">
                  Aucun indicateur ajouté.
                </p>
              )}

              {indicatorFields.map((field, idx) => {
                const linkedVal = watchAll.indicators?.[idx]?.linkedResult;
                const hasNoLinkedResult = !linkedVal || linkedVal === "";

                return (
                  <div
                    key={field.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {t("indicator_title")} #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeIndicator(idx)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={t("remove_item")}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>
                          {t("indicator_title")}
                        </label>
                        <input
                          {...register(`indicators.${idx}.title`)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("indicator_type")}
                        </label>
                        <select
                          {...register(`indicators.${idx}.type`)}
                          className={selectCls}
                        >
                          <option value="PROCESSUS">
                            {t("indicator_type_process")}
                          </option>
                          <option value="RESULTAT">
                            {t("indicator_type_result")}
                          </option>
                          <option value="CONTEXTE">
                            {t("indicator_type_context")}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("indicator_linked_result")}
                        </label>
                        <select
                          {...register(`indicators.${idx}.linkedResult`)}
                          className={selectCls}
                        >
                          <option value="">--</option>
                          {(watchAll.results ?? []).map((r, rIdx) => (
                            <option key={rIdx} value={r.title}>
                              {r.title || `Résultat #${rIdx + 1}`}
                            </option>
                          ))}
                        </select>
                        {hasNoLinkedResult && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle
                              className="size-3"
                              aria-hidden="true"
                            />
                            {t("indicator_no_result_warning")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("indicator_source")}
                        </label>
                        <input
                          {...register(`indicators.${idx}.source`)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t("indicator_baseline")}
                        </label>
                        <input
                          {...register(`indicators.${idx}.baseline`)}
                          className={inputCls}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>
                          {t("indicator_frequency")}
                        </label>
                        <input
                          {...register(`indicators.${idx}.frequency`)}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 8: Révision ─────────────────────────────────────── */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                {t("step_review")}
              </h3>

              {/* Coherence grid */}
              <div className={`rounded-lg border p-5 ${scoreBgColor}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    {t("review_coherence")}
                  </h4>
                  <span className={`text-lg font-black ${scoreColor}`}>
                    {t("coherence_score", { score: coherenceScore })}
                  </span>
                </div>
                <div className="space-y-2">
                  {coherenceChecks.map((check, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {check.pass ? (
                        <CheckCircle
                          className="size-5 text-green-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="size-5 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-sm ${check.pass ? "text-green-700" : "text-gray-500"}`}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrative summary */}
              <div>
                <label htmlFor="narrativeSummary" className={labelCls}>
                  {t("review_narrative_label")}
                </label>
                <textarea
                  id="narrativeSummary"
                  {...register("narrativeSummary")}
                  rows={8}
                  placeholder={t("review_narrative_placeholder")}
                  className={textareaCls}
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <h4 className="mb-4 text-sm font-semibold text-gray-700">
                  {t("review_summary")}
                </h4>
                <dl className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-500">
                      {t("title_label")} :
                    </dt>
                    <dd className="text-gray-900">
                      {watchAll.title || "-"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-500">
                      {t("domain_label")} :
                    </dt>
                    <dd className="text-gray-900">
                      {watchAll.domain || "-"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-500">
                      {t("level_label")} :
                    </dt>
                    <dd className="text-gray-900">
                      {watchAll.level || "-"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-500">
                      {t("step_stakeholders")} :
                    </dt>
                    <dd className="text-gray-900">
                      {(watchAll.stakeholders ?? []).length}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-500">
                      {t("step_obstacles")} :
                    </dt>
                    <dd className="text-gray-900">
                      {(watchAll.obstacles ?? []).length}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-500">
                      {t("step_results")} :
                    </dt>
                    <dd className="text-gray-900">
                      {(watchAll.results ?? []).length}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-500">
                      {t("step_indicators")} :
                    </dt>
                    <dd className="text-gray-900">
                      {(watchAll.indicators ?? []).length}
                    </dd>
                  </div>
                  {(watchAll.centralQuestion ?? "").length > 0 && (
                    <div>
                      <dt className="font-medium text-gray-500">
                        {t("central_question_label")} :
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {watchAll.centralQuestion}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Submit error */}
              {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {/* Publish button */}
              {coherenceScore < 3 && (
                <p className="text-sm text-amber-600">
                  {t("publish_disabled")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Navigation buttons ───────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo(currentStep - 1)}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t("previous")}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              <Save className="size-4" aria-hidden="true" />
              {isSaving ? "Sauvegarde..." : savedDraft ? "✓ Sauvegardé" : t("save")}
            </button>

            {currentStep < STEP_COUNT - 1 ? (
              <button
                type="button"
                onClick={() => goTo(currentStep + 1)}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                {t("next")}
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={coherenceScore < 3 || isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="size-4" aria-hidden="true" />
                {isSubmitting ? t("submitting") || "Envoi en cours..." : t("publish")}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
