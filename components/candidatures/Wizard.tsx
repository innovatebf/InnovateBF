"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { candidatureSchema, type CandidaturePayload } from "@/lib/candidatures/schema";
import { getOrCreateIdempotencyKey, resetIdempotencyKey } from "@/lib/candidatures/idempotency";
import { StepPorteur } from "./steps/StepPorteur";
import { StepProjet } from "./steps/StepProjet";
import { StepTechnique } from "./steps/StepTechnique";
import { StepImpact } from "./steps/StepImpact";
import { StepPieces } from "./steps/StepPieces";
import { StepPresentation } from "./steps/StepPresentation";
import { StepDeclarations } from "./steps/StepDeclarations";
import { Recapitulatif } from "./Recapitulatif";

// Step order: A B C D E G F recap
const TOTAL_STEPS = 8;
const STEP_LABELS_FR = [
  "Porteur",
  "Projet",
  "Technique",
  "Impact",
  "Pièces",
  "Présentation",
  "Déclarations",
  "Récap",
];

type SectionKey =
  | "porteur"
  | "projet"
  | "technique"
  | "impact"
  | "pieces"
  | "presentation"
  | "declarations";

const STEP_TO_SECTION: Record<number, SectionKey> = {
  0: "porteur",
  1: "projet",
  2: "technique",
  3: "impact",
  4: "pieces",
  5: "presentation",
  6: "declarations",
};

export function Wizard({ locale }: { locale: string }) {
  const t = useTranslations("candidatures.wizard");
  const te = useTranslations("candidatures.erreurs");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    register,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CandidaturePayload>({
    resolver: standardSchemaResolver(candidatureSchema) as Resolver<CandidaturePayload>,
    defaultValues: {
      langue: locale as "fr" | "en",
      idempotency_key: getOrCreateIdempotencyKey(),
      honeypot: "",
      porteur: { affiliation_organisateur: false },
    },
  });

  const isRecap = step === TOTAL_STEPS - 1;

  async function next() {
    if (isRecap) return;
    const section = STEP_TO_SECTION[step];
    if (section) {
      const valid = await trigger(section as keyof CandidaturePayload);
      if (!valid) return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prev() {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(data: CandidaturePayload) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/candidatures/ebc26", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": data.idempotency_key,
        },
        body: JSON.stringify(data),
      });

      if (res.status === 409) {
        const json = await res.json();
        if (json.code === "closed") {
          setError(te("clos"));
          return;
        }
      }

      if (!res.ok) {
        setError(te("reseau"));
        return;
      }

      const { dossier_numero } = await res.json();
      resetIdempotencyKey();
      router.push(`/${locale}/submit/ebc26/confirmation?numero=${encodeURIComponent(dossier_numero)}`);
    } catch {
      setError(te("reseau"));
    } finally {
      setSubmitting(false);
    }
  }

  const stepProps = { control, register, errors, watch };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress bar + step label */}
      <nav aria-label={t("etape", { courante: step + 1, total: TOTAL_STEPS })}>
        <ol className="mb-4 flex gap-1.5" role="list">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <li key={i} className="flex-1" aria-current={i === step ? "step" : undefined}>
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  i < step
                    ? "bg-[#006e2d]"
                    : i === step
                      ? "bg-[#b70011]"
                      : "bg-gray-200"
                }`}
              />
              <span className="sr-only">{STEP_LABELS_FR[i]}</span>
            </li>
          ))}
        </ol>
        <p className="mb-6 text-center text-sm text-gray-500">
          {t("etape", { courante: step + 1, total: TOTAL_STEPS })}
        </p>
      </nav>

      {/* Session warning */}
      <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700" role="note">
        {t("avertissement_session")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Hidden honeypot — invisible to humans, traps bots */}
        <input
          type="text"
          {...register("honeypot")}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          autoComplete="off"
        />

        <div aria-live="polite">
          {step === 0 && <StepPorteur {...stepProps} />}
          {step === 1 && <StepProjet control={control} errors={errors} />}
          {step === 2 && <StepTechnique control={control} errors={errors} />}
          {step === 3 && <StepImpact control={control} errors={errors} />}
          {step === 4 && <StepPieces control={control} errors={errors} />}
          {step === 5 && <StepPresentation control={control} errors={errors} />}
          {step === 6 && <StepDeclarations control={control} errors={errors} />}
          {isRecap && <Recapitulatif data={watch()} onEdit={setStep} />}
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="flex-1 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("precedent")}
            </button>
          )}

          {!isRecap && (
            <button
              type="button"
              onClick={next}
              className="flex-1 rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010] focus:outline-none focus:ring-2 focus:ring-[#b70011]/50"
            >
              {t("suivant")}
            </button>
          )}

          {isRecap && (
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#b70011]/50"
            >
              {submitting ? "…" : t("soumettre")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
