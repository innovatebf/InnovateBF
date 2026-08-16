"use client";

import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepPieces({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_pieces");

  const { field: urlField } = useController({ control, name: "pieces.demonstrateur_url" });
  const { field: refField } = useController({ control, name: "pieces.references" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{tp("aide")}</p>

      <div>
        <label htmlFor="pieces_url" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("demonstrateur_label")}
        </label>
        <input
          id="pieces_url"
          type="url"
          {...urlField}
          placeholder="https://"
          aria-invalid={!!errors.pieces?.demonstrateur_url}
          aria-describedby="pieces_url-error"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
        />
        <FieldError id="pieces_url-error" message={errors.pieces?.demonstrateur_url?.message} />
      </div>

      <CharCounter
        id="pieces_references"
        label={tp("references_label")}
        value={refField.value ?? ""}
        max={1000}
        onChange={refField.onChange}
        error={errors.pieces?.references?.message}
        rows={3}
      />
    </fieldset>
  );
}
