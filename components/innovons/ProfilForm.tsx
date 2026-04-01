"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { User } from "lucide-react";

interface ProfilFormData {
  full_name: string;
  organisation: string;
  bio: string;
}

interface ProfilFormProps {
  initialData: {
    full_name: string;
    organisation: string;
    bio: string;
    role: string;
    avatar_url?: string;
  };
}

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  admin:  { label: "Admin",    className: "bg-primary-100 text-primary-700" },
  editor: { label: "Editeur",  className: "bg-secondary-100 text-secondary-700" },
  guest:  { label: "Invite",   className: "bg-gray-100 text-gray-600" },
  // Legacy fallback values
  ADMINISTRATEUR: { label: "Admin", className: "bg-primary-100 text-primary-700" },
  UTILISATEUR: { label: "Utilisateur", className: "bg-gray-100 text-gray-600" },
};

export function ProfilForm({ initialData }: ProfilFormProps) {
  const t = useTranslations("innovons.mon_espace");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfilFormData>({
    defaultValues: {
      full_name: initialData.full_name,
      organisation: initialData.organisation,
      bio: initialData.bio,
    },
  });

  const bioValue = watch("bio");
  const nameValue = watch("full_name");

  const initials = nameValue
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleBadge = ROLE_BADGE[initialData.role] ?? ROLE_BADGE.guest!;

  async function onSubmit(data: ProfilFormData) {
    setSaveStatus("idle");
    try {
      // TODO: call API to update profile in Neon DB
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Profile update:", data);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,29,0.05)]"
    >
      {/* Avatar section */}
      <div className="flex items-center gap-5">
        {initialData.avatar_url ? (
          <img
            src={initialData.avatar_url}
            alt={initialData.full_name}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary-50 text-lg font-bold text-secondary-700">
            {initials || <User className="size-6" />}
          </div>
        )}
        <div>
          <button
            type="button"
            disabled
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed"
          >
            Changer photo
          </button>
          <p className="mt-1 text-xs text-gray-400">Bientot disponible</p>
        </div>
      </div>

      {/* Role badge (non editable) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Role
        </label>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${roleBadge.className}`}
        >
          {roleBadge.label}
        </span>
      </div>

      {/* Full name */}
      <div>
        <label
          htmlFor="full_name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("profil_full_name")} *
        </label>
        <input
          id="full_name"
          type="text"
          {...register("full_name", { required: true })}
          className="w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30"
        />
        {errors.full_name && (
          <p className="mt-1 text-xs text-red-500">Ce champ est requis.</p>
        )}
      </div>

      {/* Organisation */}
      <div>
        <label
          htmlFor="organisation"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("profil_organisation")}
        </label>
        <input
          id="organisation"
          type="text"
          {...register("organisation")}
          className="w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30"
        />
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t("profil_bio")}
        </label>
        <textarea
          id="bio"
          rows={4}
          maxLength={300}
          {...register("bio", { maxLength: 300 })}
          className="w-full resize-none rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30"
        />
        <p className="mt-1 text-xs text-gray-400">
          {bioValue?.length ?? 0}/300
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600 disabled:opacity-50"
        >
          {isSubmitting ? "..." : t("profil_save")}
        </button>

        <a
          href="#"
          className="text-sm font-medium text-primary-600 hover:opacity-80"
        >
          {t("profil_change_password")}
        </a>
      </div>

      {/* Toast-like feedback */}
      {saveStatus === "success" && (
        <div className="rounded-lg bg-secondary-50 px-4 py-3 text-sm text-secondary-700">
          {t("profil_saved")}
        </div>
      )}
      {saveStatus === "error" && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Une erreur est survenue. Veuillez reessayer.
        </div>
      )}
    </form>
  );
}
