"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { signUp } from "@/lib/auth/client";
import {
  inscriptionSchema,
  type InscriptionFormData,
} from "@/lib/schemas/inscription";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

type Role = "UTILISATEUR" | "PARRAIN" | "INNOVATEUR";

export function InscriptionForm() {
  const t = useTranslations("innovons.inscription");
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InscriptionFormData>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "UTILISATEUR",
    },
  });

  const currentRole = watch("role");

  const roles: { value: Role; label: string; desc: string }[] = [
    { value: "UTILISATEUR", label: t("role_utilisateur"), desc: t("role_utilisateur_desc") },
    { value: "PARRAIN", label: t("role_parrain"), desc: t("role_parrain_desc") },
    { value: "INNOVATEUR", label: t("role_innovateur"), desc: t("role_innovateur_desc") },
  ];

  async function onSubmit(data: InscriptionFormData) {
    setServerError(null);

    try {
      const { error } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
      });

      if (error) {
        if (error.message?.toLowerCase().includes("already") || error.code === "USER_ALREADY_EXISTS") {
          setServerError(t("error_email_exists"));
        } else {
          setServerError(error.message || t("error_generic"));
        }
        return;
      }

      setSuccess(true);
    } catch {
      setServerError(t("error_generic"));
    }
  }

  // Ecran de succes
  if (success) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary-50">
          <CheckCircle className="size-8 text-secondary-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          {t("success_title")}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t("success_message")}
        </p>
        <Link
          href="/innovons/connexion"
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
        >
          {t("login_link")}
        </Link>
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

      {/* Nom complet */}
      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_name")} <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          {...register("fullName")}
          placeholder={t("placeholder_name")}
          className={`w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30 ${
            errors.fullName ? "ring-2 ring-primary-500/30" : ""
          }`}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_email")} <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          placeholder={t("placeholder_email")}
          className={`w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30 ${
            errors.email ? "ring-2 ring-primary-500/30" : ""
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
          {t("field_password")} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            {...register("password")}
            placeholder={t("placeholder_password")}
            className={`w-full rounded-lg bg-gray-50 px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30 ${
              errors.password ? "ring-2 ring-primary-500/30" : ""
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
      </div>

      {/* Confirmation mot de passe */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("field_confirm_password")} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirmPassword")}
            placeholder={t("placeholder_confirm_password")}
            className={`w-full rounded-lg bg-gray-50 px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30 ${
              errors.confirmPassword ? "ring-2 ring-primary-500/30" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? t("hide_password") : t("show_password")}
          >
            {showConfirm ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Type de compte (role) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {t("field_role")}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {roles.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("role", value, { shouldValidate: true })}
              className={`flex flex-col items-center rounded-xl p-3 text-center transition-colors ${
                currentRole === value
                  ? "bg-primary-50 ring-2 ring-primary-500/30"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="text-sm font-semibold text-gray-900">
                {label}
              </span>
              <span className="mt-0.5 text-[10px] text-gray-500">{desc}</span>
            </button>
          ))}
        </div>
        {errors.role && (
          <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Bouton soumettre */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#b70011] to-[#dc2626] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
