"use client";

import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CANAL_INFORMATION } from "@/lib/candidatures/enums";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepDeclarations({ control, errors }: Props) {
  const t = useTranslations("candidatures");
  const tp = useTranslations("candidatures.step_declarations");

  const { field: origField } = useController({ control, name: "declarations.originalite" });
  const { field: conflitField } = useController({ control, name: "declarations.conflit_interets" });
  const { field: traitField } = useController({ control, name: "declarations.consentement_traitement" });
  const { field: pubField } = useController({ control, name: "declarations.consentement_publication" });
  const { field: commField } = useController({ control, name: "declarations.consentement_communication" });
  const { field: canalField } = useController({ control, name: "canal_information" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      {/* Required declarations */}
      <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={origField.value === true}
            onChange={(e) => origField.onChange(e.target.checked || undefined)}
            className="mt-0.5 size-4 rounded accent-[#b70011]"
          />
          <span>
            {tp("originalite_label")}
            <span className="ml-0.5 text-red-500">*</span>
          </span>
        </label>
        <FieldError id="decl_orig-error" message={errors.declarations?.originalite?.message} />

        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={conflitField.value === true}
            onChange={(e) => conflitField.onChange(e.target.checked || undefined)}
            className="mt-0.5 size-4 rounded accent-[#b70011]"
          />
          <span>
            {tp("conflit_label")}
            <span className="ml-0.5 text-red-500">*</span>
          </span>
        </label>
        <FieldError id="decl_conflit-error" message={errors.declarations?.conflit_interets?.message} />

        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={traitField.value === true}
            onChange={(e) => traitField.onChange(e.target.checked || undefined)}
            className="mt-0.5 size-4 rounded accent-[#b70011]"
          />
          <span>
            {tp("consent_traitement_label")}
            <span className="ml-0.5 text-red-500">*</span>
          </span>
        </label>
        <FieldError id="decl_trait-error" message={errors.declarations?.consentement_traitement?.message} />
      </div>

      {/* Optional consents */}
      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={pubField.value ?? false}
          onChange={(e) => pubField.onChange(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-[#b70011]"
        />
        {tp("consent_publication_label")}
      </label>

      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={commField.value ?? false}
          onChange={(e) => commField.onChange(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-[#b70011]"
        />
        {tp("consent_communication_label")}
      </label>

      <div>
        <label htmlFor="canal_info" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("canal_label")}
        </label>
        <select
          id="canal_info"
          {...canalField}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
        >
          <option value="">—</option>
          {CANAL_INFORMATION.map((c) => (
            <option key={c} value={c}>
              {t(`canaux.${c}` as Parameters<typeof t>[0])}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
