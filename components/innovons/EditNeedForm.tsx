"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Need } from "@/lib/innovons/types";

interface EditNeedFormData {
  titre: string;
  domaine: string;
  secteur: string;
  region: string;
  question_centrale: string;
  contexte_strategique: string;
  synthese_narrative?: string;
}

interface EditNeedFormProps {
  need: Need;
}

const DOMAINES = [
  "Sante",
  "Education",
  "Agriculture",
  "Energie",
  "Securite",
  "Eau et Assainissement",
  "Numerique",
  "Transport",
  "Environnement",
  "Gouvernance",
];

export function EditNeedForm({ need }: EditNeedFormProps) {
  const t = useTranslations("innovons.modifier");
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditNeedFormData>({
    defaultValues: {
      titre: need.titre,
      domaine: need.domaine,
      secteur: need.secteur,
      region: need.region,
      question_centrale: need.question_centrale,
      contexte_strategique: need.contexte_strategique,
      synthese_narrative: need.synthese_narrative || "",
    },
  });

  const onSubmit = async (data: EditNeedFormData) => {
    setServerError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/innovons/besoins/${need.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur serveur");
      }

      setSuccessMsg(t("success"));
      // Redirect after short delay so user sees success message
      setTimeout(() => {
        router.push("/innovons/mon-espace/besoins");
      }, 1500);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t("error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-6"
      noValidate
    >
      {/* Success banner */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {/* Error banner */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p className="font-medium">{serverError}</p>
        </div>
      )}

      {/* Main fields */}
      <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
        {/* Titre */}
        <div>
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
            {t("field_titre")} <span className="text-red-500">*</span>
          </label>
          <input
            id="titre"
            type="text"
            {...register("titre", { required: "Champ requis", minLength: { value: 5, message: "Minimum 5 caracteres" } })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
          />
          {errors.titre && (
            <p className="mt-1 text-xs text-red-600">{errors.titre.message}</p>
          )}
        </div>

        {/* Domaine + Secteur */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="domaine" className="block text-sm font-medium text-gray-700 mb-1">
              {t("field_domaine")} <span className="text-red-500">*</span>
            </label>
            <select
              id="domaine"
              {...register("domaine", { required: "Domaine requis" })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
            >
              {DOMAINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.domaine && (
              <p className="mt-1 text-xs text-red-600">{errors.domaine.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="secteur" className="block text-sm font-medium text-gray-700 mb-1">
              {t("field_secteur")} <span className="text-red-500">*</span>
            </label>
            <input
              id="secteur"
              type="text"
              {...register("secteur", { required: "Secteur requis" })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
            />
            {errors.secteur && (
              <p className="mt-1 text-xs text-red-600">{errors.secteur.message}</p>
            )}
          </div>
        </div>

        {/* Region */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            {t("field_region")} <span className="text-red-500">*</span>
          </label>
          <input
            id="region"
            type="text"
            {...register("region", { required: "Region requise" })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
          />
          {errors.region && (
            <p className="mt-1 text-xs text-red-600">{errors.region.message}</p>
          )}
        </div>

        {/* Question centrale */}
        <div>
          <label htmlFor="question_centrale" className="block text-sm font-medium text-gray-700 mb-1">
            {t("field_question")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="question_centrale"
            rows={3}
            {...register("question_centrale", { required: "Champ requis", minLength: { value: 10, message: "Minimum 10 caracteres" } })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
          />
          {errors.question_centrale && (
            <p className="mt-1 text-xs text-red-600">{errors.question_centrale.message}</p>
          )}
        </div>

        {/* Contexte strategique */}
        <div>
          <label htmlFor="contexte_strategique" className="block text-sm font-medium text-gray-700 mb-1">
            {t("field_contexte")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contexte_strategique"
            rows={5}
            {...register("contexte_strategique", { required: "Champ requis", minLength: { value: 10, message: "Minimum 10 caracteres" } })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
          />
          {errors.contexte_strategique && (
            <p className="mt-1 text-xs text-red-600">{errors.contexte_strategique.message}</p>
          )}
        </div>

        {/* Synthese narrative */}
        <div>
          <label htmlFor="synthese_narrative" className="block text-sm font-medium text-gray-700 mb-1">
            {t("field_synthese")}
          </label>
          <textarea
            id="synthese_narrative"
            rows={5}
            {...register("synthese_narrative")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/innovons/mon-espace/besoins"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <X className="size-4" aria-hidden="true" />
          {t("cancel")}
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("saving")}
            </>
          ) : (
            <>
              <Save className="size-4" aria-hidden="true" />
              {t("save")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
