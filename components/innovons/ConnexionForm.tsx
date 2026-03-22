"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { signIn } from "@/lib/auth/client";
import {
  connexionSchema,
  type ConnexionFormData,
} from "@/lib/schemas/inscription";
import { Link } from "@/i18n/routing";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export function ConnexionForm() {
  const t = useTranslations("innovons.connexion");
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConnexionFormData>({
    resolver: zodResolver(connexionSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: ConnexionFormData) {
    setServerError(null);

    try {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message?.includes("Invalid") || error.code === "INVALID_EMAIL_OR_PASSWORD") {
          setServerError(t("error_invalid_credentials"));
        } else {
          setServerError(error.message || t("error_generic"));
        }
        return;
      }

      // Redirection vers la page innovons apres connexion reussie
      router.push("/innovons");
    } catch {
      setServerError(t("error_generic"));
    }
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
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_email")}
        </label>
        <input
          id="email"
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

      {/* Mot de passe */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_password")}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            placeholder={t("placeholder_password")}
            className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 ${
              errors.password
                ? "border-red-300 focus:ring-red-100"
                : "border-gray-200 focus:border-green-400 focus:ring-green-100"
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPwd(!showPwd)}
            aria-label={showPwd ? t("hide_password") : t("show_password")}
          >
            {showPwd ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
        <div className="mt-1.5 text-right">
          <Link
            href="/innovons/mot-de-passe-oublie"
            className="text-xs font-medium text-green-600 hover:underline"
          >
            {t("forgot_password")}
          </Link>
        </div>
      </div>

      {/* Bouton soumettre */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
