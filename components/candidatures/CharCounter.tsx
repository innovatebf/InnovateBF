"use client";

import { useTranslations } from "next-intl";
import { FieldError } from "./FieldError";

interface CharCounterProps {
  value: string;
  max: number;
  id?: string;
  label: string;
  rows?: number;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}

export function CharCounter({
  value,
  max,
  id,
  label,
  rows = 4,
  onChange,
  error,
  required,
}: CharCounterProps) {
  const t = useTranslations("candidatures.wizard");
  const remaining = max - value.length;
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "_");
  const errorId = `${fieldId}-error`;
  const counterId = `${fieldId}-counter`;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${counterId}${error ? ` ${errorId}` : ""}`}
        aria-invalid={!!error}
        required={required}
        className={`w-full resize-none rounded-lg border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-200 focus:border-[#b70011] focus:ring-[#b70011]/20"
        }`}
      />
      <div className="mt-0.5 flex items-start justify-between gap-2">
        {error ? <FieldError id={errorId} message={error} /> : <span />}
        <p
          id={counterId}
          className={`shrink-0 text-xs ${remaining < 50 ? "text-amber-600" : "text-gray-400"}`}
        >
          {t("caracteres_restants", { n: remaining })}
        </p>
      </div>
    </div>
  );
}
