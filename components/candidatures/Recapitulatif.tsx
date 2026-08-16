"use client";

import { useTranslations } from "next-intl";
import type { CandidaturePayload } from "@/lib/candidatures/schema";

interface Props {
  data: Partial<CandidaturePayload>;
  onEdit: (stepIndex: number) => void;
}

function Section({
  title,
  children,
  onEdit,
  step,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: (i: number) => void;
  step: number;
}) {
  const t = useTranslations("candidatures.recapitulatif");
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-xs font-medium text-[#b70011] hover:underline"
        >
          {t("modifier")}
        </button>
      </div>
      <dl className="space-y-1.5 text-sm">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | boolean | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex gap-2">
      <dt className="w-40 shrink-0 text-gray-500">{label}</dt>
      <dd className="text-gray-800">{String(value)}</dd>
    </div>
  );
}

export function Recapitulatif({ data, onEdit }: Props) {
  const t = useTranslations("candidatures");
  const { porteur, projet, technique, impact, pieces, presentation } = data;

  return (
    <div className="space-y-4">
      {porteur && (
        <Section title={t("step_porteur.titre")} onEdit={onEdit} step={0}>
          <Row label={t("step_porteur.nom_label")} value={porteur.nom} />
          <Row label={t("step_porteur.email_label")} value={porteur.email} />
          <Row label={t("step_porteur.pays_ville_label")} value={porteur.pays_ville} />
          {porteur.structure && (
            <Row label={t("step_porteur.structure_label")} value={porteur.structure} />
          )}
        </Section>
      )}

      {projet && (
        <Section title={t("step_projet.titre")} onEdit={onEdit} step={1}>
          <Row label={t("step_projet.titre_label")} value={projet.titre} />
          <Row label={t("step_projet.domaine_label")} value={projet.domaine} />
          <Row label={t("step_projet.categorie_label")} value={projet.categorie} />
        </Section>
      )}

      {technique && (
        <Section title={t("step_technique.titre")} onEdit={onEdit} step={2}>
          <Row label={t("step_technique.trl_label")} value={technique.trl_declare} />
        </Section>
      )}

      {impact && (
        <Section title={t("step_impact.titre")} onEdit={onEdit} step={3}>
          <Row
            label={t("step_impact.societal_label")}
            value={impact.societal ? impact.societal.slice(0, 80) + "…" : undefined}
          />
        </Section>
      )}

      {presentation && (
        <Section title={t("step_presentation.titre")} onEdit={onEdit} step={5}>
          <Row label={t("step_presentation.mode_label")} value={presentation.mode} />
          {presentation.diaspora && (
            <Row label="" value={t("step_presentation.diaspora_label")} />
          )}
        </Section>
      )}

      {pieces?.demonstrateur_url && (
        <Section title={t("step_pieces.titre")} onEdit={onEdit} step={4}>
          <Row label={t("step_pieces.demonstrateur_label")} value={pieces.demonstrateur_url} />
        </Section>
      )}
    </div>
  );
}
