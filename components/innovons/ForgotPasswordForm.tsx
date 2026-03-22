"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/auth/client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const t = useTranslations("innovons.mot_de_passe_oublie");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setServerError(null);

    try {
      const { error } = await requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/innovons/reset-password`,
      });

      if (error) {
        setServerError(error.message || t("error_generic"));
        return;
      }

      setSuccessEmail(data.email);
    } catch {
      setServerError(t("error_generic"));
    }
  }

  // Success state
  if (successEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-6 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("success_title")}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t("success_message", { email: successEmail })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Erreur serveur */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="forgot-email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_email")}
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          placeholder={t("placeholder_email")}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 ${
            errors.email
              ? "border-red-300 focus:ring-red-100"
              : "border-gray-200 focus:border-green-400 focus:ring-green-100"
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Bouton soumettre */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
      >
        {isSubmitting && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
