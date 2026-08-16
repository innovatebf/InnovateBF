"use client";

import { useTranslations } from "next-intl";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { STATUT_PORTEUR } from "@/lib/candidatures/enums";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  register: UseFormRegister<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
  watch: UseFormWatch<CandidaturePayload>;
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20";

export function StepPorteur({ register, errors, watch }: Props) {
  const t = useTranslations("candidatures");
  const tp = useTranslations("candidatures.step_porteur");
  const affilieValue = watch("porteur.affiliation_organisateur");

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <div>
        <label htmlFor="porteur_nom" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("nom_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <input
          id="porteur_nom"
          {...register("porteur.nom")}
          aria-invalid={!!errors.porteur?.nom}
          aria-describedby="porteur_nom-error"
          className={inputCls}
        />
        <FieldError id="porteur_nom-error" message={errors.porteur?.nom?.message} />
      </div>

      <div>
        <label htmlFor="porteur_structure" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("structure_label")}
        </label>
        <input id="porteur_structure" {...register("porteur.structure")} className={inputCls} />
      </div>

      <div>
        <label htmlFor="porteur_statut" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("statut_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <select
          id="porteur_statut"
          {...register("porteur.statut")}
          aria-invalid={!!errors.porteur?.statut}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
        >
          <option value="">—</option>
          {STATUT_PORTEUR.map((s) => (
            <option key={s} value={s}>
              {t(`statuts_porteur.${s}` as Parameters<typeof t>[0])}
            </option>
          ))}
        </select>
        <FieldError id="porteur_statut-error" message={errors.porteur?.statut?.message} />
      </div>

      <div>
        <label htmlFor="porteur_email" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("email_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <input
          id="porteur_email"
          type="email"
          {...register("porteur.email")}
          aria-invalid={!!errors.porteur?.email}
          aria-describedby="porteur_email-error"
          className={inputCls}
        />
        <FieldError id="porteur_email-error" message={errors.porteur?.email?.message} />
      </div>

      <div>
        <label htmlFor="porteur_tel" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("telephone_label")}
        </label>
        <input
          id="porteur_tel"
          type="tel"
          {...register("porteur.telephone")}
          placeholder="+226 XX XX XX XX"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="porteur_pays" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("pays_ville_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <input
          id="porteur_pays"
          {...register("porteur.pays_ville")}
          aria-invalid={!!errors.porteur?.pays_ville}
          aria-describedby="porteur_pays-error"
          className={inputCls}
        />
        <FieldError id="porteur_pays-error" message={errors.porteur?.pays_ville?.message} />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700">
          {tp("affil_label")}
          <span className="ml-0.5 text-red-500">*</span>
        </p>
        <p className="mb-2 text-xs text-gray-500">{tp("affil_aide")}</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              {...register("porteur.affiliation_organisateur")}
              value="true"
              className="accent-[#b70011]"
            />
            Oui
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              {...register("porteur.affiliation_organisateur")}
              value="false"
              className="accent-[#b70011]"
            />
            Non
          </label>
        </div>
        <FieldError
          id="porteur_affil-error"
          message={errors.porteur?.affiliation_organisateur?.message}
        />
      </div>

      {affilieValue && (
        <div>
          <label
            htmlFor="porteur_affil_precision"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {tp("affil_precision_label")}
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            id="porteur_affil_precision"
            {...register("porteur.affiliation_precision")}
            aria-invalid={!!errors.porteur?.affiliation_precision}
            aria-describedby="porteur_affil_precision-error"
            className={inputCls}
          />
          <FieldError
            id="porteur_affil_precision-error"
            message={errors.porteur?.affiliation_precision?.message}
          />
        </div>
      )}
    </fieldset>
  );
}
