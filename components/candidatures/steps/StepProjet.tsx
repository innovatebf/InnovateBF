"use client";

import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { DOMAINES, CATEGORIES_CANDIDATABLES } from "@/lib/candidatures/enums";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepProjet({ control, errors }: Props) {
  const t = useTranslations("candidatures");
  const tp = useTranslations("candidatures.step_projet");

  const { field: titreField } = useController({ control, name: "projet.titre" });
  const { field: resumeField } = useController({ control, name: "projet.resume" });
  const { field: problemeField } = useController({ control, name: "projet.probleme_endogene" });
  const { field: domaineField } = useController({ control, name: "projet.domaine" });
  const { field: categorieField } = useController({ control, name: "projet.categorie" });

  const selectCls =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20";

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <div>
        <label htmlFor="projet_titre" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("titre_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <input
          id="projet_titre"
          maxLength={150}
          {...titreField}
          aria-invalid={!!errors.projet?.titre}
          aria-describedby="projet_titre-error"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
        />
        <FieldError id="projet_titre-error" message={errors.projet?.titre?.message} />
      </div>

      <div>
        <label htmlFor="projet_domaine" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("domaine_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <select
          id="projet_domaine"
          {...domaineField}
          aria-invalid={!!errors.projet?.domaine}
          className={selectCls}
        >
          <option value="">—</option>
          {DOMAINES.map((d) => (
            <option key={d} value={d}>
              {t(`domaines.${d}` as Parameters<typeof t>[0])}
            </option>
          ))}
        </select>
        <FieldError id="projet_domaine-error" message={errors.projet?.domaine?.message} />
      </div>

      <div>
        <label htmlFor="projet_categorie" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("categorie_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <select
          id="projet_categorie"
          {...categorieField}
          aria-invalid={!!errors.projet?.categorie}
          className={selectCls}
        >
          <option value="">—</option>
          {CATEGORIES_CANDIDATABLES.map((c) => (
            <option key={c} value={c}>
              {t(`categories.${c}` as Parameters<typeof t>[0])}
            </option>
          ))}
        </select>
        <FieldError id="projet_categorie-error" message={errors.projet?.categorie?.message} />
      </div>

      <CharCounter
        id="projet_resume"
        label={tp("resume_label")}
        required
        value={resumeField.value ?? ""}
        max={1500}
        onChange={resumeField.onChange}
        error={errors.projet?.resume?.message}
        rows={5}
      />

      <CharCounter
        id="projet_probleme"
        label={tp("probleme_label")}
        required
        value={problemeField.value ?? ""}
        max={1000}
        onChange={problemeField.onChange}
        error={errors.projet?.probleme_endogene?.message}
        rows={4}
      />
    </fieldset>
  );
}
