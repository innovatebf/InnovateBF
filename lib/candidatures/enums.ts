export const STATUT_PORTEUR = [
  "etudiant",
  "chercheur",
  "enseignant",
  "startup",
  "industriel",
  "structure_academique",
  "autre",
] as const;
export type StatutPorteur = (typeof STATUT_PORTEUR)[number];

export const DOMAINES = [
  "agriculture",
  "education",
  "energie",
  "environnement",
  "femmes",
  "industrie",
  "numerique",
  "sante",
] as const;
export type Domaine = (typeof DOMAINES)[number];

export const CATEGORIES_CANDIDATABLES = [
  "ia",
  "iot",
  "big_data",
  "embarque_robotique",
  "impact_societal",
  "developpement_endogene",
  "jeune_innovateur",
  "startup_innovante",
  "projet_academique",
] as const;
export type CategorieCandidatable = (typeof CATEGORIES_CANDIDATABLES)[number];

export const PRESENTATION_MODE = ["sur_place", "distanciel", "indifferent"] as const;
export type PresentationMode = (typeof PRESENTATION_MODE)[number];

export const CANAL_INFORMATION = [
  "site_web",
  "facebook",
  "linkedin",
  "whatsapp",
  "radio",
  "relais_institutionnel",
  "mobilisation_etudiante",
  "diaspora",
  "autre",
] as const;
export type CanalInformation = (typeof CANAL_INFORMATION)[number];

export const STATUT_DOSSIER = [
  "soumis",
  "recu",
  "incomplet",
  "recevable",
  "non_recevable",
  "en_evaluation",
  "retenu",
  "non_retenu",
  "notifie",
] as const;
export type StatutDossier = (typeof STATUT_DOSSIER)[number];

export const LANGUES = ["fr", "en"] as const;
export type Langue = (typeof LANGUES)[number];

export const STATUTS_EFFACABLES: readonly StatutDossier[] = [
  "soumis",
  "recu",
  "incomplet",
  "non_recevable",
];

export const TRL_NIVEAUX = [
  { value: 1, i18nKey: "trl.n1" },
  { value: 2, i18nKey: "trl.n2" },
  { value: 3, i18nKey: "trl.n3" },
  { value: 4, i18nKey: "trl.n4" },
  { value: 5, i18nKey: "trl.n5" },
  { value: 6, i18nKey: "trl.n6" },
  { value: 7, i18nKey: "trl.n7" },
  { value: 8, i18nKey: "trl.n8" },
  { value: 9, i18nKey: "trl.n9" },
] as const;
