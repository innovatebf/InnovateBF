"use client";

import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { PRESENTATION_MODE } from "@/lib/candidatures/enums";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepPresentation({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_presentation");

  const { field: modeField } = useController({ control, name: "presentation.mode" });
  const { field: besoinsField } = useController({ control, name: "presentation.besoins" });
  const { field: diasporaField } = useController({ control, name: "presentation.diaspora" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <div>
        <label htmlFor="pres_mode" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("mode_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <select
          id="pres_mode"
          {...modeField}
          aria-invalid={!!errors.presentation?.mode}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
        >
          <option value="">—</option>
          {PRESENTATION_MODE.map((m) => (
            <option key={m} value={m}>
              {tp(`mode_${m}` as Parameters<typeof tp>[0])}
            </option>
          ))}
        </select>
        <FieldError id="pres_mode-error" message={errors.presentation?.mode?.message} />
      </div>

      <CharCounter
        id="pres_besoins"
        label={tp("besoins_label")}
        value={besoinsField.value ?? ""}
        max={500}
        onChange={besoinsField.onChange}
        error={errors.presentation?.besoins?.message}
        rows={3}
      />

      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={diasporaField.value ?? false}
          onChange={(e) => diasporaField.onChange(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-[#b70011]"
        />
        {tp("diaspora_label")}
      </label>
    </fieldset>
  );
}
