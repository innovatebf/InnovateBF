import "server-only";
import { randomBytes } from "node:crypto";
import { z } from "@/lib/zod-fr";
import {
  candidatureSchema,
  categories,
  declarations,
  domaines,
  labelIn,
  labelOf,
  messages,
  modes,
  pieceTypes,
  statutsPorteur,
  steps,
  stepTitle,
  trlLevels,
  validateStep,
  type Candidature,
} from "@/content/candidature";
import { DEFAULT_LOCALE, localize, translator, type Locale } from "@/i18n";
import { validationErrors } from "@/i18n/zod";
import { formatDate, isCallOpen, LONG_DATE } from "@/lib/site";
import { piecePath } from "./storage";
import { readAllSettings } from "./content/repository";
import { db, isUniqueViolation, schema } from "./db/client";
import { ApiError, errors } from "./http";
import { sendMail } from "./mail";

/* ---------- Schémas des formulaires simples ---------- */

const honeypot = z.string().max(200).optional();

export const contactSchema = z
  .object({
    // Messages : validationErrors() (src/i18n/zod.ts), dans la langue de la page
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().max(200).email(),
    subject: z.string().trim().min(1).max(200),
    message: z.string().trim().min(10).max(5000),
    website: honeypot,
  })
  .strict();


/** Les robots remplissent le champ caché « website » : on fait comme si tout allait bien. */
export const isBot = (v: { website?: string }) => Boolean(v.website);

/* ---------- Contact ---------- */

export async function createMessage(input: z.infer<typeof contactSchema>) {
  const [row] = await db
    .insert(schema.messages)
    .values({ name: input.name, email: input.email, subject: input.subject, body: input.message })
    .returning({ id: schema.messages.id });
  await sendMail({
    subject: `[innovatebf.org] ${input.subject}`,
    text: `Nom : ${input.name}\nE-mail : ${input.email}\nObjet : ${input.subject}\n\n${input.message}`,
    replyTo: input.email,
  });
  return row;
}

/* ---------- Candidature EBC'26 ---------- */

function numeroDossier() {
  const ymd = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `EBC26-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

/**
 * Récapitulatif du dossier (e-mails) : en français pour l'équipe, dans la
 * langue du dépôt pour l'accusé de réception du candidat.
 */
export function candidatureSummary(d: Candidature, numero: string, date: string, locale: Locale = DEFAULT_LOCALE) {
  const t = translator(locale);
  const yesNo = (v: boolean | null) => (v ? t("Oui", "Yes") : t("Non", "No"));
  const p = d.porteur;
  return [
    t(`Dossier ${numero} — reçu le ${date}`, `Application ${numero} — received on ${date}`),
    "",
    `A. ${stepTitle("A", locale)}`,
    `${t("Nom :", "Name:")} ${p.prenom} ${p.nom}`,
    `${t("Statut :", "Status:")} ${labelOf(statutsPorteur, p.statut, locale)}`,
    `${t("Structure :", "Organization:")} ${p.structure || "—"}`,
    `${t("Email :", "Email:")} ${p.email}`,
    `${t("Téléphone :", "Phone:")} ${p.telephone}`,
    `${t("Ville :", "City:")} ${p.ville}, ${p.pays}`,
    `${t("Équipe :", "Team:")} ${p.equipe || "—"}`,
    `${t("Affiliation à une structure organisatrice :", "Affiliation with an organizing body:")} ${yesNo(p.affiliationOrganisateur)}${p.affiliationPrecision ? ` — ${p.affiliationPrecision}` : ""}`,
    "",
    `B. ${stepTitle("B", locale)}`,
    `${t("Titre :", "Title:")} ${d.projet.titre}`,
    `${t("Domaine :", "Domain:")} ${labelOf(domaines, d.projet.domaine, locale)}`,
    `${t("Catégorie :", "Category:")} ${labelOf(categories, d.projet.categorie, locale)}`,
    `${t("Résumé :", "Summary:")} ${d.projet.resume}`,
    `${t("Problème endogène adressé :", "Endogenous problem addressed:")} ${d.projet.problemeEndogene}`,
    "",
    `C. ${stepTitle("C", locale)}`,
    `${t("Description technique :", "Technical description:")} ${d.technique.description}`,
    `${t("Caractère innovant :", "Innovativeness:")} ${d.technique.caractereInnovant}`,
    `${t("TRL :", "TRL:")} ${d.technique.trl} — ${trlLevels(locale)[(d.technique.trl ?? 1) - 1]}`,
    `${t("Faisabilité :", "Feasibility:")} ${d.technique.faisabilite}`,
    "",
    `D. ${stepTitle("D", locale)}`,
    `${t("Impact sociétal :", "Societal impact:")} ${d.impact.societal}`,
    `${t("Impact économique :", "Economic impact:")} ${d.impact.economique}`,
    `${t("Impact environnemental :", "Environmental impact:")} ${d.impact.environnemental}`,
    `${t("Contribution au développement endogène :", "Contribution to endogenous development:")} ${d.impact.contributionEndogene}`,
    "",
    `E. ${stepTitle("E", locale)}`,
    ...(d.pieces.length
      ? d.pieces.map((pc) => {
          const type = labelOf(pieceTypes, pc.type, locale);
          const kind = pc.mode === "lien" ? t("lien", "link") : t("fichier", "file");
          // Fichier : espace privé, consultable depuis le back-office (son adresse n'ouvrirait rien)
          const where = pc.mode === "lien" ? pc.url : pc.nom || pc.url.split("/").pop();
          return t(`${type} (${kind}) : ${where}`, `${type} (${kind}): ${where}`);
        })
      : [t("Aucune pièce", "No attachments")]),
    "",
    `F. ${stepTitle("F", locale)}`,
    ...[...declarations.obligatoires, ...declarations.optionnels].map((x) => `${yesNo(d.declarations[x.code])} — ${labelIn(x, locale)}`),
    "",
    `G. ${stepTitle("G", locale)}`,
    `${t("Mode de présentation :", "Presentation mode:")} ${labelOf(modes, d.presentation.modePrevu, locale)}`,
    `${t("Besoins logistiques :", "Logistics needs:")} ${d.presentation.besoinsLogistiques || "—"}`,
    `${t("Diaspora :", "Diaspora:")} ${yesNo(d.presentation.diaspora)}${d.presentation.paysResidence ? ` — ${d.presentation.paysResidence}` : ""}`,
  ].join("\n");
}

/**
 * Messages des contrôles du schéma : ceux de zod en français (src/lib/zod-fr),
 * les messages simples du site public en anglais (src/i18n/zod.ts).
 */
function schemaErrors(locale: Locale): z.core.$ZodErrorMap {
  const english = validationErrors("en");
  return (issue) => {
    if (issue.code === "too_big" && issue.origin === "array") return localize(messages.tropDePieces, locale);
    return locale === "en" ? english(issue) : undefined;
  };
}

export type CandidatureResult = { numero: string; date: string; email: string; emailSent: boolean; missingDemo: boolean };

/** Dépôt d'une candidature : erreurs, date et accusé de réception dans la langue de la page de dépôt. */
export async function createCandidature(input: unknown, locale: Locale = DEFAULT_LOCALE): Promise<CandidatureResult> {
  const t = translator(locale);
  const { calendar } = await readAllSettings();
  // Hors période d'ouverture, rien n'est enregistré (même règle qu'ebc26.vercel.app)
  if (!isCallOpen(calendar)) {
    throw errors.closed("L'appel est clôturé : la candidature n'a pas pu être enregistrée.", "The call is closed, so your application could not be submitted.");
  }

  const d = candidatureSchema.parse(input, { error: schemaErrors(locale) });
  for (let i = 0; i < steps.length; i++) {
    const fields = validateStep(steps[i], d, locale);
    if (Object.keys(fields).length) throw new ApiError(422, "VALIDATION_ERROR", "Certains champs sont invalides.", fields, "Some fields are invalid.");
  }
  const badUpload = d.pieces.findIndex((pc) => pc.mode === "upload" && !piecePath(pc.url));
  if (badUpload >= 0) {
    throw new ApiError(422, "VALIDATION_ERROR", "Fichier invalide.", { [`pieces.${badUpload}`]: t("Fichier invalide.", "Invalid file.") }, "Invalid file.");
  }

  const missingDemo = !d.pieces.some((pc) => pc.type === "demonstrateur");
  // Date de dépôt : en français pour l'équipe, dans la langue du dépôt pour le candidat
  const now = new Date().toISOString();
  // Heure sur 24 h dans les deux langues (« 16:05 », pas « 4:05 PM »)
  const stamp = { dateStyle: "long", timeStyle: "short", hourCycle: "h23" } as const;
  const dateFr = formatDate(now, stamp);
  const date = formatDate(now, stamp, locale);

  let numero = numeroDossier();
  for (let attempt = 0; ; attempt++) {
    try {
      await db.insert(schema.candidatures).values({
        numero,
        status: missingDemo ? "pieces_manquantes" : "recu",
        title: d.projet.titre.trim(),
        applicantName: `${d.porteur.prenom} ${d.porteur.nom}`.trim(),
        email: d.porteur.email.trim(),
        category: d.projet.categorie,
        data: d,
      });
      break;
    } catch (e) {
      // Numéro déjà attribué (très improbable) : nouvel essai
      if (attempt < 3 && isUniqueViolation(e)) numero = numeroDossier();
      else throw e;
    }
  }

  // E-mail à l'équipe : toujours en français
  const body = candidatureSummary(d, numero, dateFr);
  await sendMail({
    subject: `[EBC'26] Candidature ${numero}${missingDemo ? " (pièces manquantes)" : ""} : ${d.projet.titre}`,
    text: locale === "en" ? `Dossier déposé sur le site en anglais : accusé de réception envoyé en anglais.\n\n${body}` : body,
    replyTo: d.porteur.email,
  });
  // Accusé de réception : dans la langue de la page de dépôt
  const closes = formatDate(calendar.callCloses, LONG_DATE, locale);
  const emailSent = await sendMail({
    to: d.porteur.email,
    subject: t(`Candidature EBC'26 reçue — dossier ${numero}`, `EBC'26 application received — reference ${numero}`),
    text: [
      t(`Bonjour ${d.porteur.prenom},`, `Hello ${d.porteur.prenom},`),
      "",
      t(
        `Nous avons bien reçu votre candidature « ${d.projet.titre} » au concours EBC'26.`,
        `We have received your application “${d.projet.titre}” for the EBC'26 competition.`,
      ),
      t(`Numéro de dossier : ${numero}`, `Reference number: ${numero}`),
      t(`Date de soumission : ${date}`, `Submission date: ${date}`),
      missingDemo
        ? t(
            "\nPièce manquante : démonstrateur. Vous avez 72 h pour l'envoyer en répondant à ce message (fichier ou lien).",
            "\nMissing attachment: demonstrator. You have 72 hours to send it by replying to this message (file or link).",
          )
        : "",
      t(`\nClôture des candidatures : ${closes}.`, `\nApplication deadline: ${closes}.`),
      t("Les résultats vous seront communiqués par email.", "You will be notified of the results by email."),
      "",
      t("Le comité d'organisation EBC2026", "The EBC2026 organizing committee"),
      "",
      t("— Récapitulatif —", "— Summary —"),
      locale === "en" ? candidatureSummary(d, numero, date, locale) : body,
    ].join("\n"),
  });

  return { numero, date, email: d.porteur.email, emailSent, missingDemo };
}
