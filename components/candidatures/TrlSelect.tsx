"use client";

import { useTranslations } from "next-intl";
import { TRL_NIVEAUX } from "@/lib/candidatures/enums";
import { FieldError } from "./FieldError";

interface TrlSelectProps {
  value: number | "";
  onChange: (v: number) => void;
  error?: string;
  id?: string;
}

export function TrlSelect({ value, onChange, error, id = "trl_declare" }: TrlSelectProps) {
  const t = useTranslations("candidatures");

  return (
    <div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
      >
        <option value="">—</option>
        {TRL_NIVEAUX.map(({ value: v, i18nKey }) => (
          <option key={v} value={v}>
            {t(i18nKey as Parameters<typeof t>[0])}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
