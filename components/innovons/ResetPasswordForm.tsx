"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { resetPassword } from "@/lib/auth/client";
import { Link } from "@/i18n/routing";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "passwords_mismatch",
    path: ["confirm_password"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const t = useTranslations("innovons.reset_password");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const hasValidSession = !!token;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/innovons/connexion");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setServerError(null);

    try {
      if (!token) {
        setServerError(t("error_invalid_link"));
        return;
      }

      const { error } = await resetPassword({
        newPassword: data.new_password,
        token,
      });

      if (error) {
        setServerError(error.message || t("error_generic"));
        return;
      }

      setSuccess(true);
    } catch {
      setServerError(t("error_generic"));
    }
  }

  // Invalid/expired link (no token in URL)
  if (!hasValidSession) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-50">
          <AlertCircle className="size-6 text-primary-600" aria-hidden="true" />
        </div>
        <p className="text-sm text-gray-700">{t("error_invalid_link")}</p>
        <Link
          href="/innovons/mot-de-passe-oublie"
          className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline"
        >
          {t("request_new_link")}
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary-50">
          <CheckCircle2 className="size-6 text-secondary-600" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("success_title")}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{t("success_message")}</p>
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

      {/* Nouveau mot de passe */}
      <div>
        <label
          htmlFor="new-password"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_password")}
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showNewPwd ? "text" : "password"}
            autoComplete="new-password"
            {...register("new_password")}
            placeholder={t("placeholder_password")}
            className={`w-full rounded-lg bg-gray-50 px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30 ${
              errors.new_password ? "ring-2 ring-primary-500/30" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowNewPwd(!showNewPwd)}
            aria-label={showNewPwd ? "Hide password" : "Show password"}
          >
            {showNewPwd ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.new_password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.new_password.message}
          </p>
        )}
      </div>

      {/* Confirmer mot de passe */}
      <div>
        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_confirm")}
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type={showConfirmPwd ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirm_password")}
            placeholder={t("placeholder_confirm")}
            className={`w-full rounded-lg bg-gray-50 px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30 ${
              errors.confirm_password ? "ring-2 ring-primary-500/30" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
            aria-label={showConfirmPwd ? "Hide password" : "Show password"}
          >
            {showConfirmPwd ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.confirm_password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {/* Bouton soumettre */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-3 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600 disabled:opacity-60"
      >
        {isSubmitting && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
