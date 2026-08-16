"use client";

import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CharCounter } from "@/components/candidatures/CharCounter";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepImpact({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_impact");

  const { field: societalField } = useController({ control, name: "impact.societal" });
  const { field: econField } = useController({ control, name: "impact.economique" });
  const { field: envField } = useController({ control, name: "impact.environnemental" });
  const { field: endField } = useController({ control, name: "impact.contribution_endogene" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <CharCounter
        id="impact_societal"
        label={tp("societal_label")}
        required
        value={societalField.value ?? ""}
        max={1200}
        onChange={societalField.onChange}
        error={errors.impact?.societal?.message}
        rows={4}
      />

      <CharCounter
        id="impact_economique"
        label={tp("economique_label")}
        required
        value={econField.value ?? ""}
        max={1200}
        onChange={econField.onChange}
        error={errors.impact?.economique?.message}
        rows={4}
      />

      <CharCounter
        id="impact_environnemental"
        label={tp("environnemental_label")}
        value={envField.value ?? ""}
        max={800}
        onChange={envField.onChange}
        error={errors.impact?.environnemental?.message}
        rows={3}
      />

      <CharCounter
        id="impact_endogene"
        label={tp("endogene_label")}
        required
        value={endField.value ?? ""}
        max={1000}
        onChange={endField.onChange}
        error={errors.impact?.contribution_endogene?.message}
        rows={4}
      />
    </fieldset>
  );
}
