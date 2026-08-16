import { z } from "zod";
import {
  STATUT_PORTEUR,
  DOMAINES,
  CATEGORIES_CANDIDATABLES,
  PRESENTATION_MODE,
  CANAL_INFORMATION,
  LANGUES,
} from "./enums";

export const porteurSchema = z
  .object({
    nom: z.string().min(2).max(120),
    structure: z.string().max(120).default(""),
    statut: z.enum(STATUT_PORTEUR),
    email: z.string().email(),
    telephone: z
      .string()
      .regex(/^\+?[0-9\s]{6,20}$/)
      .optional()
      .or(z.literal("")),
    pays_ville: z.string().min(2).max(120),
    affiliation_organisateur: z.boolean(),
    affiliation_precision: z.string().max(120).optional().or(z.literal("")),
  })
  .refine((v) => !v.affiliation_organisateur || !!v.affiliation_precision, {
    message: "Précision requise si affilié à une structure organisatrice.",
    path: ["affiliation_precision"],
  });

export const projetSchema = z.object({
  titre: z.string().min(3).max(150),
  domaine: z.enum(DOMAINES),
  categorie: z.enum(CATEGORIES_CANDIDATABLES),
  resume: z.string().min(1).max(1500),
  probleme_endogene: z.string().min(1).max(1000),
});

export const techniqueSchema = z.object({
  description: z.string().min(1).max(3000),
  innovation: z.string().min(1).max(1500),
  trl_declare: z.coerce.number().int().min(1).max(9),
  faisabilite: z.string().min(1).max(1500),
});

export const impactSchema = z.object({
  societal: z.string().min(1).max(1200),
  economique: z.string().min(1).max(1200),
  environnemental: z.string().max(800).optional().or(z.literal("")),
  contribution_endogene: z.string().min(1).max(1000),
});

export const piecesSchema = z.object({
  demonstrateur_url: z.string().url().optional().or(z.literal("")),
  references: z.string().max(1000).optional().or(z.literal("")),
});

export const presentationSchema = z.object({
  mode: z.enum(PRESENTATION_MODE),
  besoins: z.string().max(500).optional().or(z.literal("")),
  diaspora: z.boolean().optional(),
});

export const declarationsSchema = z.object({
  originalite: z.literal(true, {
    message: "La déclaration d'originalité est obligatoire.",
  }),
  conflit_interets: z.literal(true, {
    message: "La déclaration de conflit d'intérêts est obligatoire.",
  }),
  consentement_traitement: z.literal(true, {
    message: "Le consentement au traitement des données est obligatoire.",
  }),
  consentement_publication: z.boolean().optional(),
  consentement_communication: z.boolean().optional(),
});

export const candidatureSchema = z.object({
  langue: z.enum(LANGUES),
  porteur: porteurSchema,
  projet: projetSchema,
  technique: techniqueSchema,
  impact: impactSchema,
  pieces: piecesSchema,
  presentation: presentationSchema,
  declarations: declarationsSchema,
  canal_information: z.enum(CANAL_INFORMATION).optional(),
  idempotency_key: z.string().uuid(),
  honeypot: z.string().max(0, { message: "Champ réservé aux robots." }),
});

export type CandidaturePayload = z.infer<typeof candidatureSchema>;

export const stepSchemas = {
  porteur: porteurSchema,
  projet: projetSchema,
  technique: techniqueSchema,
  impact: impactSchema,
  pieces: piecesSchema,
  presentation: presentationSchema,
  declarations: declarationsSchema,
} as const;

export const regularisationSchema = z.object({
  demonstrateur_url: z.string().url().optional().or(z.literal("")),
});
export type RegularisationPayload = z.infer<typeof regularisationSchema>;
