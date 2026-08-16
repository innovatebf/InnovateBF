"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

function ConfirmationContent() {
  const t = useTranslations("candidatures.confirmation");
  const params = useSearchParams();
  const numero = params.get("numero") ?? "—";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div
        className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#006e2d]/10"
        aria-hidden="true"
      >
        <svg
          className="size-8 text-[#006e2d]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">{t("titre")}</h1>
      <p className="mt-4 text-lg font-semibold text-[#b70011]">
        {t("numero", { numero })}
      </p>
      <p className="mt-3 text-gray-600">{t("email_envoye")}</p>
      <p className="mt-2 text-sm text-gray-500">{t("delais")}</p>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
