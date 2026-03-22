"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send,
} from "lucide-react";

interface ProposalFormData {
  titre: string;
  description: string;
  approche: string;
  equipe?: string;
  budget_estime?: string;
  delai?: string;
  porteur_nom: string;
  porteur_email: string;
  porteur_organisation?: string;
}

interface ProposerSolutionFormProps {
  needId: string;
  needTitle: string;
  needSlug: string;
}

export function ProposerSolutionForm({
  needId,
  needTitle,
  needSlug,
}: ProposerSolutionFormProps) {
  const t = useTranslations("innovons.proposer");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormData>();

  const onSubmit = async (data: ProposalFormData) => {
    setServerError(null);
    try {
      const res = await fetch("/api/innovons/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, need_id: needId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur serveur");
      }

      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : t("error_message"),
      );
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-8 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("success_title")}</h2>
        <p className="mt-2 text-gray-600">{t("success_message")}</p>
        <Link
          href={`/innovons/besoins/${needSlug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t("back_to_need")}
        </Link>
      </div>
    );
  }

  const delaiOptions = [
    { value: "3_mois", label: t("delai_3m") },
    { value: "6_mois", label: t("delai_6m") },
    { value: "1_an", label: t("delai_1a") },
    { value: "2_ans", label: t("delai_2a") },
    { value: "3_ans_plus", label: t("delai_3a") },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-6"
      noValidate
    >
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">{t("error_title")}</p>
            <p>{serverError}</p>
          </div>
        </div>
      )}

      {/* Titre */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t("subtitle")} : <span className="text-green-600">{needTitle}</span>
        </h3>

        <div className="space-y-5">
          {/* Titre de la solution */}
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

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t("field_description")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              {...register("description", { required: "Champ requis", minLength: { value: 50, message: "Minimum 50 caracteres" } })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Approche */}
          <div>
            <label htmlFor="approche" className="block text-sm font-medium text-gray-700 mb-1">
              {t("field_approche")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="approche"
              rows={4}
              {...register("approche", { required: "Champ requis", minLength: { value: 30, message: "Minimum 30 caracteres" } })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
            />
            {errors.approche && (
              <p className="mt-1 text-xs text-red-600">{errors.approche.message}</p>
            )}
          </div>

          {/* Equipe */}
          <div>
            <label htmlFor="equipe" className="block text-sm font-medium text-gray-700 mb-1">
              {t("field_equipe")}
            </label>
            <textarea
              id="equipe"
              rows={3}
              {...register("equipe")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
            />
          </div>

          {/* Budget + Delai row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget_estime" className="block text-sm font-medium text-gray-700 mb-1">
                {t("field_budget")}
              </label>
              <input
                id="budget_estime"
                type="number"
                min="0"
                {...register("budget_estime")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="delai" className="block text-sm font-medium text-gray-700 mb-1">
                {t("field_delai")}
              </label>
              <select
                id="delai"
                {...register("delai")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
              >
                <option value="">--</option>
                {delaiOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Porteur info */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Informations du porteur
        </h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="porteur_nom" className="block text-sm font-medium text-gray-700 mb-1">
                {t("field_porteur_nom")} <span className="text-red-500">*</span>
              </label>
              <input
                id="porteur_nom"
                type="text"
                {...register("porteur_nom", { required: "Nom requis", minLength: { value: 2, message: "Minimum 2 caracteres" } })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
              />
              {errors.porteur_nom && (
                <p className="mt-1 text-xs text-red-600">{errors.porteur_nom.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="porteur_email" className="block text-sm font-medium text-gray-700 mb-1">
                {t("field_porteur_email")} <span className="text-red-500">*</span>
              </label>
              <input
                id="porteur_email"
                type="email"
                {...register("porteur_email", { required: "Email requis", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email invalide" } })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
              />
              {errors.porteur_email && (
                <p className="mt-1 text-xs text-red-600">{errors.porteur_email.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="porteur_organisation" className="block text-sm font-medium text-gray-700 mb-1">
              {t("field_porteur_org")}
            </label>
            <input
              id="porteur_organisation"
              type="text"
              {...register("porteur_organisation")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
