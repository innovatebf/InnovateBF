"use client";

import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { TrlSelect } from "@/components/candidatures/TrlSelect";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepTechnique({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_technique");

  const { field: descField } = useController({ control, name: "technique.description" });
  const { field: innoField } = useController({ control, name: "technique.innovation" });
  const { field: faisField } = useController({ control, name: "technique.faisabilite" });
  const { field: trlField } = useController({ control, name: "technique.trl_declare" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <CharCounter
        id="tech_description"
        label={tp("description_label")}
        required
        value={descField.value ?? ""}
        max={3000}
        onChange={descField.onChange}
        error={errors.technique?.description?.message}
        rows={6}
      />

      <CharCounter
        id="tech_innovation"
        label={tp("innovation_label")}
        required
        value={innoField.value ?? ""}
        max={1500}
        onChange={innoField.onChange}
        error={errors.technique?.innovation?.message}
        rows={4}
      />

      <div>
        <label htmlFor="trl_declare" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("trl_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <TrlSelect
          id="trl_declare"
          value={trlField.value ?? ""}
          onChange={trlField.onChange}
          error={errors.technique?.trl_declare?.message}
        />
      </div>

      <CharCounter
        id="tech_faisabilite"
        label={tp("faisabilite_label")}
        required
        value={faisField.value ?? ""}
        max={1500}
        onChange={faisField.onChange}
        error={errors.technique?.faisabilite?.message}
        rows={4}
      />
    </fieldset>
  );
}
