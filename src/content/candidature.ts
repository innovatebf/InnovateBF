import { DEFAULT_LOCALE, localize, tr, type Locale } from "@/i18n";
import { z } from "@/lib/zod-fr";

/**
 * Formulaire « Déposer ma candidature » : mêmes champs, listes, longueurs et
 * règles que ebc26.vercel.app/candidater (données de /api/appel).
 * Les listes gardent leur libellé français (`label` : back-office, e-mails à
 * l'équipe) et leur version anglaise (`en` : site anglais). Seuls les codes
 * sont enregistrés.
 */

export const steps = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type StepId = (typeof steps)[number];

// Titres en français (back-office) ; stepTitle(id, locale) pour le site
export const stepTitles: Record<StepId, string> = {
  A: "Porteur",
  B: "Projet",
  C: "Technique",
  D: "Impact",
  E: "Pièces jointes",
  F: "Déclarations",
  G: "Présentation",
};

const stepTitlesEn: Record<StepId, string> = {
  A: "Applicant",
  B: "Project",
  C: "Technical",
  D: "Impact",
  E: "Attachments",
  F: "Declarations",
  G: "Presentation",
};

/** Titre d'une étape dans la langue de la page. */
export const stepTitle = (id: StepId, locale: Locale = DEFAULT_LOCALE) => (locale === "en" ? stepTitlesEn : stepTitles)[id];

export const lengths = { court: 200, resume: 1500, long: 3000, pays: 100 };

/** Élément d'une liste de choix : code enregistré, libellés français et anglais. */
export type Choice = { code: string; label: string; en: string };

export const statutsPorteur: Choice[] = [
  { code: "enseignant_chercheur", label: "Enseignant, formateur ou chercheur", en: "Teacher, trainer or researcher" },
  { code: "etudiant", label: "Étudiant ou apprenant", en: "Student or trainee" },
  { code: "startup_pme", label: "Porteur de startup ou PME technologique", en: "Founder of a tech startup or SME" },
  { code: "professionnel", label: "Professionnel ou industriel", en: "Professional or industry player" },
  { code: "structure_academique", label: "Structure ou club académique", en: "Academic institution or club" },
];

export const domaines: Choice[] = [
  { code: "agriculture", label: "Agriculture", en: "Agriculture" },
  { code: "education", label: "Éducation", en: "Education" },
  { code: "energie", label: "Énergie", en: "Energy" },
  { code: "environnement", label: "Environnement", en: "Environment" },
  { code: "industrie", label: "Industrie", en: "Industry" },
  { code: "numerique", label: "Numérique", en: "Digital" },
  { code: "sante", label: "Santé", en: "Health" },
];

export const categories: Choice[] = [
  { code: "ia", label: "Intelligence artificielle", en: "Artificial intelligence" },
  { code: "iot", label: "Internet des objets (IoT)", en: "Internet of Things (IoT)" },
  { code: "big_data", label: "Big Data", en: "Big Data" },
  { code: "embarques_robotique", label: "Systèmes embarqués et robotique", en: "Embedded systems and robotics" },
  { code: "developpement_endogene", label: "Développement endogène", en: "Endogenous development" },
  { code: "jeune_innovateur", label: "Jeune innovateur", en: "Young innovator" },
  { code: "startup", label: "Startup innovante", en: "Innovative startup" },
  { code: "projet_academique", label: "Projet académique", en: "Academic project" },
];

// Niveaux en français (back-office) ; trlLevels(locale) pour le site
export const niveauxTrl = [
  "Principes de base observés",
  "Concept technologique formulé",
  "Preuve de concept expérimentale",
  "Validation en laboratoire",
  "Validation en environnement représentatif",
  "Démonstration en environnement représentatif",
  "Démonstration en environnement réel",
  "Système complet et qualifié",
  "Système éprouvé en conditions réelles",
];

const niveauxTrlEn = [
  "Basic principles observed",
  "Technology concept formulated",
  "Experimental proof of concept",
  "Validation in a laboratory",
  "Validation in a relevant environment",
  "Demonstration in a relevant environment",
  "Demonstration in an operational environment",
  "Complete and qualified system",
  "System proven in operational conditions",
];

/** Les neuf niveaux de maturité (TRL 1 à 9) dans la langue de la page. */
export const trlLevels = (locale: Locale = DEFAULT_LOCALE) => (locale === "en" ? niveauxTrlEn : niveauxTrl);

export const modes: Choice[] = [
  { code: "sur_place", label: "Sur place", en: "On site" },
  { code: "distanciel", label: "À distance", en: "Remote" },
];

export const pieceTypes = [
  { code: "demonstrateur", label: "Démonstrateur", en: "Demonstrator", required: true },
  { code: "visuel", label: "Visuel", en: "Visual", required: false },
  { code: "reference", label: "Référence", en: "Reference", required: false },
] as const;
export type PieceType = (typeof pieceTypes)[number]["code"];

export const pieceRules = {
  extensions: [".pdf", ".png", ".jpg", ".jpeg", ".mp4", ".zip"],
  contentTypes: ["application/pdf", "image/png", "image/jpeg", "video/mp4", "application/zip"],
  // Type envoyé au stockage : d'après l'extension, car les navigateurs ne s'accordent pas tous (notamment pour .zip)
  contentTypeOf: { ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp4": "video/mp4", ".zip": "application/zip" } as Record<string, string>,
  maxFile: 25 * 1024 * 1024,
  maxTotal: 60 * 1024 * 1024,
};

export const declarations = {
  obligatoires: [
    {
      code: "originalite",
      label: "Je certifie que ce projet est mon travail propre (ou celui de l'équipe) et ne porte pas atteinte aux droits de tiers.",
      en: "I certify that this project is my own work (or my team's) and does not infringe the rights of third parties.",
    },
    {
      code: "conflitInteret",
      label: "Je déclare n'avoir aucun conflit d'intérêts non signalé.",
      en: "I declare that I have no undisclosed conflict of interest.",
    },
    {
      code: "consentementTraitement",
      label: "J'accepte le traitement de mes données aux fins d'évaluation de ma candidature.",
      en: "I agree to the processing of my data for the purpose of evaluating my application.",
    },
  ],
  optionnels: [
    {
      code: "consentementPublication",
      label: "J'autorise la publication du titre, du résumé et des visuels (programme, actes de la conférence).",
      en: "I authorize the publication of the project title, summary and visuals (in the conference program and proceedings).",
    },
    {
      code: "consentementComms",
      label: "J'accepte de recevoir des communications futures d'EBC.",
      en: "I agree to receive future communications from EBC.",
    },
  ],
} as const;

export const affiliationLabel = tr(
  "Êtes-vous affilié(e) à une structure organisatrice (InnovateBF, UNB, BSB, CITADEL, Abamix, Sankora.ai) ?",
  "Are you affiliated with one of the organizing bodies (InnovateBF, UNB, BSB, CITADEL, Abamix, Sankora.ai)?",
);

/* ---------- Données du formulaire ---------- */

export type Piece = { type: PieceType; mode: "upload" | "lien"; url: string; nom?: string; taille?: number };

export type Candidature = {
  porteur: {
    nom: string;
    prenom: string;
    structure: string;
    statut: string;
    email: string;
    telephone: string;
    pays: string;
    ville: string;
    equipe: string;
    affiliationOrganisateur: boolean | null;
    affiliationPrecision: string;
  };
  projet: { titre: string; domaine: string; categorie: string; resume: string; problemeEndogene: string };
  technique: { description: string; caractereInnovant: string; trl: number | null; faisabilite: string };
  impact: { societal: string; economique: string; environnemental: string; contributionEndogene: string };
  pieces: Piece[];
  declarations: {
    originalite: boolean;
    conflitInteret: boolean;
    consentementTraitement: boolean;
    consentementPublication: boolean;
    consentementComms: boolean;
  };
  presentation: { modePrevu: string; besoinsLogistiques: string; diaspora: boolean; paysResidence: string };
};

export const emptyCandidature: Candidature = {
  porteur: {
    nom: "",
    prenom: "",
    structure: "",
    statut: "",
    email: "",
    telephone: "",
    pays: "Burkina Faso",
    ville: "",
    equipe: "",
    affiliationOrganisateur: null,
    affiliationPrecision: "",
  },
  projet: { titre: "", domaine: "", categorie: "", resume: "", problemeEndogene: "" },
  technique: { description: "", caractereInnovant: "", trl: null, faisabilite: "" },
  impact: { societal: "", economique: "", environnemental: "", contributionEndogene: "" },
  pieces: [],
  declarations: {
    originalite: false,
    conflitInteret: false,
    consentementTraitement: false,
    consentementPublication: false,
    consentementComms: false,
  },
  presentation: { modePrevu: "", besoinsLogistiques: "", diaspora: false, paysResidence: "" },
};

/* ---------- Validation (partagée client / serveur) ---------- */

/** Champs obligatoires par étape (identiques à ebc26). */
const requiredByStep: Record<StepId, string[]> = {
  A: ["porteur.nom", "porteur.prenom", "porteur.statut", "porteur.email", "porteur.telephone", "porteur.pays", "porteur.ville"],
  B: ["projet.titre", "projet.domaine", "projet.categorie", "projet.resume", "projet.problemeEndogene"],
  C: ["technique.description", "technique.caractereInnovant", "technique.trl", "technique.faisabilite"],
  D: ["impact.societal", "impact.economique", "impact.environnemental", "impact.contributionEndogene"],
  E: [],
  F: [],
  G: ["presentation.modePrevu"],
};

export const messages = {
  obligatoire: tr("Champ obligatoire", "This field is required."),
  emailInvalide: tr("Adresse email invalide", "Invalid email address."),
  telInvalide: tr("Numéro de téléphone invalide", "Invalid phone number."),
  tropLong: tr("Texte trop long", "Text is too long."),
  choixInvalide: tr("Choix invalide", "Invalid choice."),
  lienInvalide: tr("Lien invalide (doit commencer par http:// ou https://).", "Invalid link (must start with http:// or https://)."),
  // Contrôle du schéma (nombre de pièces), message appliqué par le serveur
  tropDePieces: tr("10 pièces maximum", "You can add up to 10 attachments."),
};

function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj);
}

const isEmpty = (v: unknown) => v == null || (typeof v === "string" && v.trim() === "");

/** Téléphone : 6 à 20 caractères, 8 à 15 chiffres (numéro burkinabè ou international). */
export function isPhone(v: string) {
  if (!/^\+?[0-9 ().-]{6,20}$/.test(v.trim())) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export const isUrl = (v: string) => /^https?:\/\/\S+\.\S+/i.test(v.trim());

const maxLengths: Record<string, number> = {
  "porteur.nom": lengths.court,
  "porteur.prenom": lengths.court,
  "porteur.structure": lengths.court,
  "porteur.affiliationPrecision": lengths.court,
  "porteur.equipe": lengths.long,
  "projet.titre": lengths.court,
  "projet.resume": lengths.resume,
  "projet.problemeEndogene": lengths.long,
  "technique.description": lengths.long,
  "technique.caractereInnovant": lengths.long,
  "technique.faisabilite": lengths.long,
  "impact.societal": lengths.long,
  "impact.economique": lengths.long,
  "impact.environnemental": lengths.long,
  "impact.contributionEndogene": lengths.long,
  "presentation.besoinsLogistiques": lengths.long,
  "presentation.paysResidence": lengths.pays,
};

/** Erreurs d'une étape, dans la langue de la page (formulaire) ou du dépôt (serveur). */
export function validateStep(step: StepId, d: Candidature, locale: Locale = DEFAULT_LOCALE): Record<string, string> {
  const m = localize(messages, locale);
  const errors: Record<string, string> = {};
  for (const path of requiredByStep[step]) if (isEmpty(get(d, path))) errors[path] = m.obligatoire;
  for (const [path, max] of Object.entries(maxLengths)) {
    if (path.startsWith(sectionOf(step)) && String(get(d, path) ?? "").length > max) errors[path] = m.tropLong;
  }
  if (step === "A") {
    const p = d.porteur;
    if (!errors["porteur.email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors["porteur.email"] = m.emailInvalide;
    if (!errors["porteur.telephone"] && !isPhone(p.telephone)) errors["porteur.telephone"] = m.telInvalide;
    if (p.statut && !statutsPorteur.some((s) => s.code === p.statut)) errors["porteur.statut"] = m.choixInvalide;
    if (p.affiliationOrganisateur === null) errors["porteur.affiliationOrganisateur"] = m.obligatoire;
    if (p.affiliationOrganisateur && isEmpty(p.affiliationPrecision)) errors["porteur.affiliationPrecision"] = m.obligatoire;
  }
  if (step === "B") {
    if (d.projet.domaine && !domaines.some((x) => x.code === d.projet.domaine)) errors["projet.domaine"] = m.choixInvalide;
    if (d.projet.categorie && !categories.some((x) => x.code === d.projet.categorie)) errors["projet.categorie"] = m.choixInvalide;
  }
  if (step === "C" && d.technique.trl !== null && !(d.technique.trl >= 1 && d.technique.trl <= 9)) {
    errors["technique.trl"] = m.choixInvalide;
  }
  if (step === "E") {
    d.pieces.forEach((pc, i) => {
      if (!pieceTypes.some((t) => t.code === pc.type) || !isUrl(pc.url)) errors[`pieces.${i}`] = m.lienInvalide;
    });
  }
  if (step === "F") {
    for (const { code } of declarations.obligatoires) if (!d.declarations[code]) errors[`declarations.${code}`] = m.obligatoire;
  }
  if (step === "G" && d.presentation.modePrevu && !modes.some((x) => x.code === d.presentation.modePrevu)) {
    errors["presentation.modePrevu"] = m.choixInvalide;
  }
  return errors;
}

function sectionOf(step: StepId) {
  return { A: "porteur.", B: "projet.", C: "technique.", D: "impact.", E: "pieces", F: "declarations.", G: "presentation." }[step];
}

export const stepOfPath = (path: string): StepId =>
  (({ porteur: "A", projet: "B", technique: "C", impact: "D", pieces: "E", declarations: "F", presentation: "G" }) as const)[
    path.split(".")[0] as "porteur"
  ] ?? "A";

/** Libellé d'un élément de liste dans la langue de la page (`label` en français, `en` en anglais). */
export const labelIn = (item: { label: string; en: string }, locale: Locale = DEFAULT_LOCALE) => (locale === "en" ? item.en : item.label);

/** Libellé d'un code (français par défaut : back-office, e-mails à l'équipe). */
export const labelOf = (list: readonly Choice[], code: string, locale: Locale = DEFAULT_LOCALE) => {
  const item = list.find((x) => x.code === code);
  return item ? labelIn(item, locale) : "";
};

/* ---------- Structure attendue côté serveur (types, tailles, aucun champ en plus) ---------- */


const str = (max: number) => z.string().max(max);

export const candidatureSchema = z
  .object({
    porteur: z
      .object({
        nom: str(lengths.court),
        prenom: str(lengths.court),
        structure: str(lengths.court),
        statut: str(60),
        email: str(200),
        telephone: str(30),
        pays: str(lengths.pays),
        ville: str(lengths.pays),
        equipe: str(lengths.long),
        affiliationOrganisateur: z.boolean().nullable(),
        affiliationPrecision: str(lengths.court),
      })
      .strict(),
    projet: z
      .object({
        titre: str(lengths.court),
        domaine: str(60),
        categorie: str(60),
        resume: str(lengths.resume),
        problemeEndogene: str(lengths.long),
      })
      .strict(),
    technique: z
      .object({
        description: str(lengths.long),
        caractereInnovant: str(lengths.long),
        trl: z.number().int().min(1).max(9).nullable(),
        faisabilite: str(lengths.long),
      })
      .strict(),
    impact: z
      .object({
        societal: str(lengths.long),
        economique: str(lengths.long),
        environnemental: str(lengths.long),
        contributionEndogene: str(lengths.long),
      })
      .strict(),
    pieces: z
      .array(
        z
          .object({
            type: z.enum(["demonstrateur", "visuel", "reference"]),
            mode: z.enum(["upload", "lien"]),
            url: str(1000),
            nom: str(200).optional(),
            taille: z.number().int().min(0).max(pieceRules.maxFile).optional(),
          })
          .strict(),
      )
      // Message dans la langue du dépôt : messages.tropDePieces (src/server/submissions.ts)
      .max(10),
    declarations: z
      .object({
        originalite: z.boolean(),
        conflitInteret: z.boolean(),
        consentementTraitement: z.boolean(),
        consentementPublication: z.boolean(),
        consentementComms: z.boolean(),
      })
      .strict(),
    presentation: z
      .object({
        modePrevu: str(40),
        besoinsLogistiques: str(lengths.long),
        diaspora: z.boolean(),
        paysResidence: str(lengths.pays),
      })
      .strict(),
  })
  .strict() satisfies z.ZodType<Candidature>;
