# EBC'26 Candidatures — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the EBC'26 project application call — a 7-step wizard, token-based status tracking, and admin-ready data model — as a no-account submission flow under `/[locale]/submit/ebc26`.

**Architecture:** Raw Neon SQL via `@neondatabase/serverless` (no Prisma); native fetch + React state (no React Query); Route Handlers for the API. File uploads deferred — demonstrateur accepts URL only for now.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Tailwind CSS, React Hook Form + Zod v4, next-intl v4, Resend, `@neondatabase/serverless`, `crypto` (Node built-in for tokens).

**Codebase conventions:**
- SQL migrations go in `supabase/migrations/`
- Messages in `messages/fr.json` + `messages/en.json` (not `locales/`)
- Design primary: `#b70011`, secondary: `#006e2d`
- In-memory rate limiting pattern from `app/api/contact/route.ts`
- Server DB via `lib/db/neon.ts` → `getSql()`

---

## File Map

| Create | Responsibility |
|---|---|
| `supabase/migrations/011_ebc26_candidatures.sql` | Tables: candidature_ebc26, idempotency_key |
| `lib/candidatures/enums.ts` | All TS enumerations |
| `lib/candidatures/schema.ts` | Zod schemas (client + server) |
| `lib/candidatures/token.ts` | CSPRNG token gen/hash (server-only) |
| `lib/candidatures/idempotency.ts` | sessionStorage key (client) |
| `lib/candidatures/db.ts` | All Neon SQL queries |
| `lib/candidatures/email.ts` | Resend transactional emails FR/EN |
| `app/api/candidatures/ebc26/meta/route.ts` | GET metadata |
| `app/api/candidatures/ebc26/route.ts` | POST submit |
| `app/api/candidatures/ebc26/[token]/route.ts` | GET status |
| `app/api/candidatures/ebc26/[token]/regularisation/route.ts` | POST regularisation |
| `app/api/candidatures/ebc26/[token]/effacement/route.ts` | POST erasure |
| `components/candidatures/TrlSelect.tsx` | TRL guided select |
| `components/candidatures/CharCounter.tsx` | Textarea + char counter |
| `components/candidatures/steps/StepPorteur.tsx` | Wizard step A |
| `components/candidatures/steps/StepProjet.tsx` | Wizard step B |
| `components/candidatures/steps/StepTechnique.tsx` | Wizard step C |
| `components/candidatures/steps/StepImpact.tsx` | Wizard step D |
| `components/candidatures/steps/StepPieces.tsx` | Wizard step E |
| `components/candidatures/steps/StepPresentation.tsx` | Wizard step G |
| `components/candidatures/steps/StepDeclarations.tsx` | Wizard step F |
| `components/candidatures/Recapitulatif.tsx` | Final review before submit |
| `components/candidatures/Wizard.tsx` | Step container + stepper |
| `app/[locale]/submit/ebc26/page.tsx` | Landing page |
| `app/[locale]/submit/ebc26/soumettre/page.tsx` | Wizard host page |
| `app/[locale]/submit/ebc26/confirmation/page.tsx` | Post-submit confirmation |
| `app/[locale]/submit/ebc26/suivi/[token]/page.tsx` | Status tracking |
| `app/[locale]/submit/ebc26/suivi/[token]/regulariser/page.tsx` | Add missing docs |

| Modify | What changes |
|---|---|
| `messages/fr.json` | Add `candidatures` namespace |
| `messages/en.json` | Add `candidatures` namespace |

---

## Task 1: SQL Migration

**Files:**
- Create: `supabase/migrations/011_ebc26_candidatures.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Migration 011: EBC'26 candidature tables
-- Run via: npx tsx scripts/migrate-neon.ts (or psql $DATABASE_URL < this file)

CREATE TABLE IF NOT EXISTS ebc26_candidature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_numero TEXT NOT NULL UNIQUE,
  dossier_seq_interne SERIAL,
  suivi_token_hash TEXT NOT NULL UNIQUE,
  statut TEXT NOT NULL DEFAULT 'soumis',
  langue TEXT NOT NULL DEFAULT 'fr',
  projet_organisateur BOOLEAN NOT NULL DEFAULT false,

  -- Section A: porteur
  porteur_nom TEXT NOT NULL,
  structure TEXT NOT NULL DEFAULT '',
  statut_porteur TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  pays_ville TEXT NOT NULL,
  affiliation_organisateur BOOLEAN NOT NULL DEFAULT false,
  affiliation_precision TEXT,

  -- Section B: projet
  projet_titre TEXT NOT NULL,
  domaine TEXT NOT NULL,
  categorie TEXT NOT NULL,
  resume TEXT NOT NULL,
  probleme_endogene TEXT NOT NULL,

  -- Section C: technique
  description_tech TEXT NOT NULL,
  innovation TEXT NOT NULL,
  trl_declare INTEGER NOT NULL,
  faisabilite TEXT NOT NULL,

  -- Section D: impact
  impact_societal TEXT NOT NULL,
  impact_economique TEXT NOT NULL,
  impact_environnemental TEXT,
  contribution_endogene TEXT NOT NULL,

  -- Section E: pièces (URL uniquement, upload différé)
  demonstrateur_url TEXT,
  references_biblio TEXT,

  -- Section G: présentation
  presentation_mode TEXT NOT NULL,
  presentation_besoins TEXT,
  presentation_diaspora BOOLEAN NOT NULL DEFAULT false,

  -- Section F: déclarations
  decl_originalite BOOLEAN NOT NULL,
  decl_conflit BOOLEAN NOT NULL,
  consent_traitement BOOLEAN NOT NULL,
  consent_publication BOOLEAN NOT NULL DEFAULT false,
  consent_communication BOOLEAN NOT NULL DEFAULT false,

  canal_information TEXT,
  motif_non_recevabilite TEXT,
  soumis_le TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  anonymise_le TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ebc26_statut ON ebc26_candidature (statut);
CREATE INDEX IF NOT EXISTS idx_ebc26_domaine ON ebc26_candidature (domaine);
CREATE INDEX IF NOT EXISTS idx_ebc26_categorie ON ebc26_candidature (categorie);

CREATE TABLE IF NOT EXISTS ebc26_idempotency_key (
  key TEXT PRIMARY KEY,
  candidature_id UUID REFERENCES ebc26_candidature(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ebc26_idem_created ON ebc26_idempotency_key (created_at);
```

- [ ] **Step 2: Run migration against Neon**

```bash
npx tsx scripts/migrate-neon.ts
```

Expected: tables created, no errors. If `migrate-neon.ts` doesn't accept a file argument, run via psql:
```bash
psql "$DATABASE_URL" < supabase/migrations/011_ebc26_candidatures.sql
```

- [ ] **Step 3: Verify tables exist**

```bash
npx tsx -e "
import { getSql } from './lib/db/neon';
const sql = getSql();
const rows = await sql\`SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'ebc26%'\`;
console.log(rows);
"
```

Expected: `[ { table_name: 'ebc26_candidature' }, { table_name: 'ebc26_idempotency_key' } ]`

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/011_ebc26_candidatures.sql
git commit -m "feat(ebc26): add candidature SQL migration"
```

---

## Task 2: Enums + Zod Schema

**Files:**
- Create: `lib/candidatures/enums.ts`
- Create: `lib/candidatures/schema.ts`

- [ ] **Step 1: Write enums**

```typescript
// lib/candidatures/enums.ts
export const STATUT_PORTEUR = [
  "etudiant","chercheur","enseignant","startup",
  "industriel","structure_academique","autre",
] as const;
export type StatutPorteur = (typeof STATUT_PORTEUR)[number];

export const DOMAINES = [
  "agriculture","education","energie","environnement",
  "femmes","industrie","numerique","sante",
] as const;
export type Domaine = (typeof DOMAINES)[number];

export const CATEGORIES_CANDIDATABLES = [
  "ia","iot","big_data","embarque_robotique","impact_societal",
  "developpement_endogene","jeune_innovateur","startup_innovante","projet_academique",
] as const;
export type CategorieCandidatable = (typeof CATEGORIES_CANDIDATABLES)[number];

export const PRESENTATION_MODE = ["sur_place","distanciel","indifferent"] as const;
export type PresentationMode = (typeof PRESENTATION_MODE)[number];

export const CANAL_INFORMATION = [
  "site_web","facebook","linkedin","whatsapp","radio",
  "relais_institutionnel","mobilisation_etudiante","diaspora","autre",
] as const;
export type CanalInformation = (typeof CANAL_INFORMATION)[number];

export const STATUT_DOSSIER = [
  "soumis","recu","incomplet","recevable","non_recevable",
  "en_evaluation","retenu","non_retenu","notifie",
] as const;
export type StatutDossier = (typeof STATUT_DOSSIER)[number];

export const LANGUES = ["fr","en"] as const;
export type Langue = (typeof LANGUES)[number];

export const STATUTS_EFFACABLES: readonly StatutDossier[] = [
  "soumis","recu","incomplet","non_recevable",
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
```

- [ ] **Step 2: Write Zod schema**

```typescript
// lib/candidatures/schema.ts
import { z } from "zod";
import {
  STATUT_PORTEUR, DOMAINES, CATEGORIES_CANDIDATABLES,
  PRESENTATION_MODE, CANAL_INFORMATION, LANGUES,
} from "./enums";

export const porteurSchema = z.object({
  nom: z.string().min(2).max(120),
  structure: z.string().max(120).default(""),
  statut: z.enum(STATUT_PORTEUR),
  email: z.string().email(),
  telephone: z.string().regex(/^\+?[0-9\s]{6,20}$/).optional().or(z.literal("")),
  pays_ville: z.string().min(2).max(120),
  affiliation_organisateur: z.boolean(),
  affiliation_precision: z.string().max(120).optional().or(z.literal("")),
}).refine(
  (v) => !v.affiliation_organisateur || !!v.affiliation_precision,
  { message: "Précision requise si affilié.", path: ["affiliation_precision"] },
);

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
  originalite: z.literal(true, { message: "La déclaration d'originalité est obligatoire." }),
  conflit_interets: z.literal(true, { message: "La déclaration de conflit d'intérêts est obligatoire." }),
  consentement_traitement: z.literal(true, { message: "Le consentement au traitement des données est obligatoire." }),
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
  honeypot: z.string().max(0, { message: "Champ réservé." }),
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
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/candidatures/enums.ts lib/candidatures/schema.ts
git commit -m "feat(ebc26): add enums and Zod schema"
```

---

## Task 3: Server Utilities (Token + DB queries)

**Files:**
- Create: `lib/candidatures/token.ts`
- Create: `lib/candidatures/idempotency.ts`
- Create: `lib/candidatures/db.ts`

- [ ] **Step 1: Write token.ts (server-only)**

```typescript
// lib/candidatures/token.ts
// SERVER ONLY — never import in client components
import { randomBytes, createHash, timingSafeEqual } from "crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function genererSuiviToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hacherToken(tokenClair: string): string {
  return createHash("sha256").update(tokenClair).digest("hex");
}

export function genererDossierNumero(): string {
  const bloc = (): string => {
    const bytes = randomBytes(4);
    let out = "";
    for (let i = 0; i < 4; i++) out += ALPHABET[bytes[i]! % ALPHABET.length];
    return out;
  };
  return `EBC26-${bloc()}-${bloc()}`;
}

export function verifierToken(tokenClair: string, hashStocke: string): boolean {
  const hash = hacherToken(tokenClair);
  try {
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(hashStocke, "hex"));
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Write idempotency.ts (client-only)**

```typescript
// lib/candidatures/idempotency.ts
// CLIENT ONLY — uses sessionStorage
const KEY = "ebc26_idempotency_key";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getOrCreateIdempotencyKey(): string {
  if (typeof window === "undefined") return uuid();
  const existing = window.sessionStorage.getItem(KEY);
  if (existing) return existing;
  const next = uuid();
  window.sessionStorage.setItem(KEY, next);
  return next;
}

export function resetIdempotencyKey(): void {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(KEY);
}
```

- [ ] **Step 3: Write db.ts**

```typescript
// lib/candidatures/db.ts
import { getSql } from "@/lib/db/neon";
import type { CandidaturePayload } from "./schema";
import type { StatutDossier } from "./enums";
import { STATUTS_EFFACABLES } from "./enums";
import { genererDossierNumero, genererSuiviToken, hacherToken, verifierToken } from "./token";

export interface DossierRow {
  id: string;
  dossier_numero: string;
  statut: StatutDossier;
  langue: string;
  email: string;
  soumis_le: string;
  motif_non_recevabilite: string | null;
  updated_at: string;
}

// Returns dossier_numero of the submitted or existing dossier
export async function soumettreCandidature(
  payload: CandidaturePayload,
): Promise<{ dossier_numero: string; isNew: boolean }> {
  const sql = getSql();
  const { porteur, projet, technique, impact, pieces, presentation, declarations } = payload;

  // Check idempotency first
  const existing = await sql`
    SELECT c.dossier_numero
    FROM ebc26_idempotency_key ik
    JOIN ebc26_candidature c ON ik.candidature_id = c.id
    WHERE ik.key = ${payload.idempotency_key}
    LIMIT 1
  `;
  if (existing.length > 0) {
    return { dossier_numero: existing[0].dossier_numero as string, isNew: false };
  }

  const tokenClair = genererSuiviToken();
  const tokenHash = hacherToken(tokenClair);
  const dossierNumero = genererDossierNumero();

  // Insert candidature
  const [inserted] = await sql`
    INSERT INTO ebc26_candidature (
      dossier_numero, suivi_token_hash, statut, langue, projet_organisateur,
      porteur_nom, structure, statut_porteur, email, telephone, pays_ville,
      affiliation_organisateur, affiliation_precision,
      projet_titre, domaine, categorie, resume, probleme_endogene,
      description_tech, innovation, trl_declare, faisabilite,
      impact_societal, impact_economique, impact_environnemental, contribution_endogene,
      demonstrateur_url, references_biblio,
      presentation_mode, presentation_besoins, presentation_diaspora,
      decl_originalite, decl_conflit, consent_traitement,
      consent_publication, consent_communication, canal_information
    ) VALUES (
      ${dossierNumero}, ${tokenHash}, 'soumis', ${payload.langue},
      ${porteur.affiliation_organisateur},
      ${porteur.nom}, ${porteur.structure ?? ""}, ${porteur.statut},
      ${porteur.email}, ${porteur.telephone ?? null}, ${porteur.pays_ville},
      ${porteur.affiliation_organisateur}, ${porteur.affiliation_precision ?? null},
      ${projet.titre}, ${projet.domaine}, ${projet.categorie},
      ${projet.resume}, ${projet.probleme_endogene},
      ${technique.description}, ${technique.innovation},
      ${technique.trl_declare}, ${technique.faisabilite},
      ${impact.societal}, ${impact.economique},
      ${impact.environnemental ?? null}, ${impact.contribution_endogene},
      ${pieces.demonstrateur_url ?? null}, ${pieces.references ?? null},
      ${presentation.mode}, ${presentation.besoins ?? null},
      ${presentation.diaspora ?? false},
      ${declarations.originalite}, ${declarations.conflit_interets},
      ${declarations.consentement_traitement},
      ${declarations.consentement_publication ?? false},
      ${declarations.consentement_communication ?? false},
      ${payload.canal_information ?? null}
    )
    RETURNING id, dossier_numero
  `;

  // Record idempotency key
  await sql`
    INSERT INTO ebc26_idempotency_key (key, candidature_id)
    VALUES (${payload.idempotency_key}, ${inserted.id})
    ON CONFLICT (key) DO NOTHING
  `;

  return { dossier_numero: dossierNumero, isNew: true, tokenClair } as unknown as {
    dossier_numero: string;
    isNew: boolean;
  };
}

// Returns the token in plain text (for email) alongside dossier_numero
export async function soumettreCandidatureWithToken(
  payload: CandidaturePayload,
): Promise<{ dossier_numero: string; isNew: boolean; tokenClair?: string }> {
  const sql = getSql();
  const { porteur, projet, technique, impact, pieces, presentation, declarations } = payload;

  const existing = await sql`
    SELECT c.dossier_numero
    FROM ebc26_idempotency_key ik
    JOIN ebc26_candidature c ON ik.candidature_id = c.id
    WHERE ik.key = ${payload.idempotency_key}
    LIMIT 1
  `;
  if (existing.length > 0) {
    return { dossier_numero: existing[0].dossier_numero as string, isNew: false };
  }

  const tokenClair = genererSuiviToken();
  const tokenHash = hacherToken(tokenClair);
  const dossierNumero = genererDossierNumero();

  const [inserted] = await sql`
    INSERT INTO ebc26_candidature (
      dossier_numero, suivi_token_hash, statut, langue, projet_organisateur,
      porteur_nom, structure, statut_porteur, email, telephone, pays_ville,
      affiliation_organisateur, affiliation_precision,
      projet_titre, domaine, categorie, resume, probleme_endogene,
      description_tech, innovation, trl_declare, faisabilite,
      impact_societal, impact_economique, impact_environnemental, contribution_endogene,
      demonstrateur_url, references_biblio,
      presentation_mode, presentation_besoins, presentation_diaspora,
      decl_originalite, decl_conflit, consent_traitement,
      consent_publication, consent_communication, canal_information
    ) VALUES (
      ${dossierNumero}, ${tokenHash}, 'soumis', ${payload.langue},
      ${porteur.affiliation_organisateur},
      ${porteur.nom}, ${porteur.structure ?? ""}, ${porteur.statut},
      ${porteur.email}, ${porteur.telephone ?? null}, ${porteur.pays_ville},
      ${porteur.affiliation_organisateur}, ${porteur.affiliation_precision ?? null},
      ${projet.titre}, ${projet.domaine}, ${projet.categorie},
      ${projet.resume}, ${projet.probleme_endogene},
      ${technique.description}, ${technique.innovation},
      ${technique.trl_declare}, ${technique.faisabilite},
      ${impact.societal}, ${impact.economique},
      ${impact.environnemental ?? null}, ${impact.contribution_endogene},
      ${pieces.demonstrateur_url ?? null}, ${pieces.references ?? null},
      ${presentation.mode}, ${presentation.besoins ?? null},
      ${presentation.diaspora ?? false},
      ${declarations.originalite}, ${declarations.conflit_interets},
      ${declarations.consentement_traitement},
      ${declarations.consentement_publication ?? false},
      ${declarations.consentement_communication ?? false},
      ${payload.canal_information ?? null}
    )
    RETURNING id, dossier_numero
  `;

  await sql`
    INSERT INTO ebc26_idempotency_key (key, candidature_id)
    VALUES (${payload.idempotency_key}, ${inserted.id})
    ON CONFLICT (key) DO NOTHING
  `;

  return { dossier_numero: dossierNumero, isNew: true, tokenClair };
}

export async function getDossierByToken(tokenClair: string): Promise<DossierRow | null> {
  const sql = getSql();
  const hash = hacherToken(tokenClair);
  const rows = await sql`
    SELECT id, dossier_numero, statut, langue, email, soumis_le, motif_non_recevabilite, updated_at
    FROM ebc26_candidature
    WHERE suivi_token_hash = ${hash}
    LIMIT 1
  `;
  return (rows[0] as DossierRow) ?? null;
}

export async function regulariserDossier(
  tokenClair: string,
  url: string | undefined,
): Promise<DossierRow | null> {
  const sql = getSql();
  const hash = hacherToken(tokenClair);
  const rows = await sql`
    UPDATE ebc26_candidature
    SET statut = 'recu',
        demonstrateur_url = COALESCE(${url ?? null}, demonstrateur_url),
        updated_at = now()
    WHERE suivi_token_hash = ${hash} AND statut = 'incomplet'
    RETURNING id, dossier_numero, statut, langue, email, soumis_le, motif_non_recevabilite, updated_at
  `;
  return (rows[0] as DossierRow) ?? null;
}

export async function effacerDossier(
  tokenClair: string,
): Promise<{ efface: boolean; conserve: boolean; motif?: string }> {
  const sql = getSql();
  const hash = hacherToken(tokenClair);
  const rows = await sql`
    SELECT id, statut FROM ebc26_candidature WHERE suivi_token_hash = ${hash} LIMIT 1
  `;
  if (!rows[0]) return { efface: false, conserve: false };

  const { id, statut } = rows[0] as { id: string; statut: StatutDossier };
  if (!STATUTS_EFFACABLES.includes(statut)) {
    return {
      efface: false,
      conserve: true,
      motif: "Dossier en cours d'évaluation ou retenu — conservation obligatoire.",
    };
  }

  await sql`DELETE FROM ebc26_candidature WHERE id = ${id}`;
  return { efface: true, conserve: false };
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add lib/candidatures/token.ts lib/candidatures/idempotency.ts lib/candidatures/db.ts
git commit -m "feat(ebc26): add token, idempotency, and DB query helpers"
```

---

## Task 4: i18n — Add `candidatures` namespace to messages

**Files:**
- Modify: `messages/fr.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add to `messages/fr.json`**

Open the file and add this top-level key alongside the existing ones:

```json
"candidatures": {
  "appel": {
    "titre": "Candidature Projets EBC'26",
    "conference": "Conférence EBC2026 — 13–14 novembre 2026, CEA-UNB, Bobo-Dioulasso",
    "cta_soumettre": "Soumettre un projet",
    "cloture_le": "Clôture des candidatures le {date}",
    "intro": "Présentez votre projet innovant au concours EBC'26. Les meilleurs seront présentés lors de la conférence et distingués par les Awards.",
    "gratuit": "La candidature est gratuite."
  },
  "wizard": {
    "etape": "Étape {courante} sur {total}",
    "precedent": "Précédent",
    "suivant": "Suivant",
    "soumettre": "Soumettre ma candidature",
    "avertissement_session": "Vos réponses ne sont pas enregistrées tant que vous n'avez pas soumis. Ne fermez pas cet onglet avant d'avoir terminé.",
    "caracteres_restants": "{n} caractères restants"
  },
  "step_porteur": {
    "titre": "Porteur du projet",
    "nom_label": "Nom du porteur ou de l'équipe",
    "structure_label": "Structure de rattachement",
    "statut_label": "Statut",
    "email_label": "Adresse email",
    "telephone_label": "Téléphone (facultatif)",
    "pays_ville_label": "Pays et ville",
    "affil_label": "Êtes-vous affilié à une structure organisatrice ?",
    "affil_aide": "Structures organisatrices : CITADEL, BSB, UNB, Abamix, Sankora.",
    "affil_precision_label": "Précisez la structure"
  },
  "step_projet": {
    "titre": "Présentation du projet",
    "titre_label": "Titre du projet",
    "domaine_label": "Domaine",
    "categorie_label": "Catégorie",
    "resume_label": "Résumé du projet",
    "probleme_label": "Problème endogène adressé"
  },
  "step_technique": {
    "titre": "Dossier technique",
    "description_label": "Description technique",
    "innovation_label": "Caractère innovant et différenciation",
    "trl_label": "Niveau de maturité technologique (TRL)",
    "faisabilite_label": "Faisabilité (ressources, calendrier, risques)"
  },
  "step_impact": {
    "titre": "Impact attendu",
    "societal_label": "Impact sociétal",
    "economique_label": "Impact économique",
    "environnemental_label": "Impact environnemental (facultatif)",
    "endogene_label": "Contribution au développement endogène"
  },
  "step_pieces": {
    "titre": "Pièces jointes",
    "aide": "Collez un lien vers votre démonstrateur (Google Drive, YouTube, GitHub…).",
    "demonstrateur_label": "Lien démonstrateur (facultatif)",
    "references_label": "Références et publications"
  },
  "step_presentation": {
    "titre": "Modalités de présentation",
    "mode_label": "Mode de présentation prévu",
    "mode_sur_place": "Sur place",
    "mode_distanciel": "À distance",
    "mode_indifferent": "Indifférent",
    "besoins_label": "Besoins logistiques",
    "diaspora_label": "Je suis basé hors du Burkina Faso"
  },
  "step_declarations": {
    "titre": "Déclarations et consentements",
    "originalite_label": "Je déclare que ce projet est le travail propre de mon équipe et ne porte pas atteinte aux droits de tiers.",
    "conflit_label": "Je déclare l'absence de conflit d'intérêts non signalé.",
    "consent_traitement_label": "J'accepte le traitement de mes données aux fins de l'évaluation (obligatoire).",
    "consent_publication_label": "J'autorise la publication du titre et du résumé de mon projet.",
    "consent_communication_label": "J'accepte de recevoir des communications d'InnovateBF.",
    "canal_label": "Comment avez-vous connu l'appel ?"
  },
  "recapitulatif": {
    "titre": "Vérifiez votre candidature",
    "modifier": "Modifier",
    "confirmer_avant": "Cochez les déclarations obligatoires pour soumettre."
  },
  "confirmation": {
    "titre": "Candidature reçue",
    "numero": "Votre numéro de dossier : {numero}",
    "email_envoye": "Un lien de suivi vous a été envoyé par email.",
    "copier_lien": "Copier le lien de suivi",
    "delais": "Vous pouvez suivre l'état de votre dossier et compléter des pièces manquantes sous 72 heures."
  },
  "suivi": {
    "titre": "Suivi de votre dossier",
    "statut_label": "Statut",
    "soumis_le": "Soumis le {date}",
    "regulariser": "Compléter les pièces manquantes",
    "demander_effacement": "Demander l'effacement de mes données",
    "statuts": {
      "soumis": "Dossier soumis",
      "recu": "Dossier reçu",
      "incomplet": "Pièces manquantes",
      "recevable": "En cours d'évaluation",
      "en_evaluation": "En cours d'évaluation",
      "non_recevable": "Dossier non recevable",
      "retenu": "Décision communiquée",
      "non_retenu": "Décision communiquée",
      "notifie": "Décision communiquée"
    }
  },
  "regularisation": {
    "titre": "Compléter votre dossier",
    "aide": "Déposez uniquement les pièces manquantes indiquées.",
    "confirmer": "Envoyer les pièces"
  },
  "erreurs": {
    "champ_requis": "Ce champ est obligatoire.",
    "trop_long": "Texte trop long.",
    "email_invalide": "Adresse email invalide.",
    "reseau": "Votre candidature n'a pas pu être envoyée. Vérifiez votre connexion et réessayez.",
    "clos": "L'appel à candidatures est clôturé."
  },
  "trl": {
    "n1": "1 — Principes de base observés",
    "n2": "2 — Concept technologique formulé",
    "n3": "3 — Preuve de concept expérimentale",
    "n4": "4 — Validation en laboratoire",
    "n5": "5 — Validation en environnement représentatif",
    "n6": "6 — Démonstrateur en environnement représentatif",
    "n7": "7 — Prototype en conditions réelles",
    "n8": "8 — Système complet qualifié",
    "n9": "9 — Système éprouvé en exploitation"
  },
  "domaines": {
    "agriculture": "Agriculture",
    "education": "Éducation",
    "energie": "Énergie",
    "environnement": "Environnement",
    "femmes": "Femmes",
    "industrie": "Industrie",
    "numerique": "Numérique",
    "sante": "Santé"
  },
  "categories": {
    "ia": "Intelligence artificielle",
    "iot": "Internet des objets (IoT)",
    "big_data": "Big Data",
    "embarque_robotique": "Systèmes embarqués et robotique",
    "impact_societal": "Impact sociétal",
    "developpement_endogene": "Développement endogène",
    "jeune_innovateur": "Jeune innovateur",
    "startup_innovante": "Startup innovante",
    "projet_academique": "Projet académique"
  },
  "statuts_porteur": {
    "etudiant": "Étudiant",
    "chercheur": "Chercheur",
    "enseignant": "Enseignant",
    "startup": "Startup",
    "industriel": "Industriel",
    "structure_academique": "Structure académique",
    "autre": "Autre"
  },
  "canaux": {
    "site_web": "Site web InnovateBF",
    "facebook": "Facebook",
    "linkedin": "LinkedIn",
    "whatsapp": "WhatsApp",
    "radio": "Radio",
    "relais_institutionnel": "Relais institutionnel",
    "mobilisation_etudiante": "Mobilisation étudiante",
    "diaspora": "Réseau diaspora",
    "autre": "Autre"
  }
}
```

- [ ] **Step 2: Add to `messages/en.json`** (same structure, English values)

```json
"candidatures": {
  "appel": {
    "titre": "EBC'26 Project Application",
    "conference": "EBC2026 Conference — 13–14 November 2026, CEA-UNB, Bobo-Dioulasso",
    "cta_soumettre": "Submit a project",
    "cloture_le": "Applications close on {date}",
    "intro": "Present your innovative project to the EBC'26 competition. The best will be showcased at the conference and honoured with the Awards.",
    "gratuit": "Applying is free of charge."
  },
  "wizard": {
    "etape": "Step {courante} of {total}",
    "precedent": "Back",
    "suivant": "Next",
    "soumettre": "Submit my application",
    "avertissement_session": "Your answers are not saved until you submit. Do not close this tab before you finish.",
    "caracteres_restants": "{n} characters left"
  },
  "step_porteur": {
    "titre": "Project applicant",
    "nom_label": "Applicant or team name",
    "structure_label": "Affiliation",
    "statut_label": "Status",
    "email_label": "Email address",
    "telephone_label": "Phone (optional)",
    "pays_ville_label": "Country and city",
    "affil_label": "Are you affiliated with an organising body?",
    "affil_aide": "Organising bodies: CITADEL, BSB, UNB, Abamix, Sankora.",
    "affil_precision_label": "Specify the body"
  },
  "step_projet": {
    "titre": "Project overview",
    "titre_label": "Project title",
    "domaine_label": "Domain",
    "categorie_label": "Category",
    "resume_label": "Project summary",
    "probleme_label": "Endogenous problem addressed"
  },
  "step_technique": {
    "titre": "Technical file",
    "description_label": "Technical description",
    "innovation_label": "Innovation and differentiation",
    "trl_label": "Technology Readiness Level (TRL)",
    "faisabilite_label": "Feasibility (resources, timeline, risks)"
  },
  "step_impact": {
    "titre": "Expected impact",
    "societal_label": "Societal impact",
    "economique_label": "Economic impact",
    "environnemental_label": "Environmental impact (optional)",
    "endogene_label": "Contribution to endogenous development"
  },
  "step_pieces": {
    "titre": "Attachments",
    "aide": "Paste a link to your demonstrator (Google Drive, YouTube, GitHub…).",
    "demonstrateur_label": "Demonstrator link (optional)",
    "references_label": "References and publications"
  },
  "step_presentation": {
    "titre": "Presentation arrangements",
    "mode_label": "Planned presentation mode",
    "mode_sur_place": "On site",
    "mode_distanciel": "Remote",
    "mode_indifferent": "No preference",
    "besoins_label": "Logistics needs",
    "diaspora_label": "I am based outside Burkina Faso"
  },
  "step_declarations": {
    "titre": "Declarations and consent",
    "originalite_label": "I declare that this project is my team's own work and does not infringe the rights of third parties.",
    "conflit_label": "I declare that there is no undisclosed conflict of interest.",
    "consent_traitement_label": "I agree to the processing of my data for evaluation purposes (required).",
    "consent_publication_label": "I authorise publication of my project title and summary.",
    "consent_communication_label": "I agree to receive communications from InnovateBF.",
    "canal_label": "How did you hear about the call?"
  },
  "recapitulatif": {
    "titre": "Review your application",
    "modifier": "Edit",
    "confirmer_avant": "Tick the required declarations to submit."
  },
  "confirmation": {
    "titre": "Application received",
    "numero": "Your reference number: {numero}",
    "email_envoye": "A tracking link has been sent to your email.",
    "copier_lien": "Copy the tracking link",
    "delais": "You can track your application and add missing documents within 72 hours."
  },
  "suivi": {
    "titre": "Track your application",
    "statut_label": "Status",
    "soumis_le": "Submitted on {date}",
    "regulariser": "Add missing documents",
    "demander_effacement": "Request deletion of my data",
    "statuts": {
      "soumis": "Application submitted",
      "recu": "Application received",
      "incomplet": "Missing documents",
      "recevable": "Under evaluation",
      "en_evaluation": "Under evaluation",
      "non_recevable": "Application not eligible",
      "retenu": "Decision communicated",
      "non_retenu": "Decision communicated",
      "notifie": "Decision communicated"
    }
  },
  "regularisation": {
    "titre": "Complete your application",
    "aide": "Only upload the missing documents indicated.",
    "confirmer": "Send documents"
  },
  "erreurs": {
    "champ_requis": "This field is required.",
    "trop_long": "Text is too long.",
    "email_invalide": "Invalid email address.",
    "reseau": "Your application could not be sent. Check your connection and try again.",
    "clos": "The call for applications is closed."
  },
  "trl": {
    "n1": "1 — Basic principles observed",
    "n2": "2 — Technology concept formulated",
    "n3": "3 — Experimental proof of concept",
    "n4": "4 — Validation in laboratory",
    "n5": "5 — Validation in a relevant environment",
    "n6": "6 — Demonstrator in a relevant environment",
    "n7": "7 — Prototype in operational conditions",
    "n8": "8 — Complete, qualified system",
    "n9": "9 — System proven in operation"
  },
  "domaines": {
    "agriculture": "Agriculture",
    "education": "Education",
    "energie": "Energy",
    "environnement": "Environment",
    "femmes": "Women",
    "industrie": "Industry",
    "numerique": "Digital",
    "sante": "Health"
  },
  "categories": {
    "ia": "Artificial intelligence",
    "iot": "Internet of Things (IoT)",
    "big_data": "Big Data",
    "embarque_robotique": "Embedded systems and robotics",
    "impact_societal": "Societal impact",
    "developpement_endogene": "Endogenous development",
    "jeune_innovateur": "Young innovator",
    "startup_innovante": "Innovative startup",
    "projet_academique": "Academic project"
  },
  "statuts_porteur": {
    "etudiant": "Student",
    "chercheur": "Researcher",
    "enseignant": "Teacher",
    "startup": "Startup",
    "industriel": "Industrial",
    "structure_academique": "Academic institution",
    "autre": "Other"
  },
  "canaux": {
    "site_web": "InnovateBF website",
    "facebook": "Facebook",
    "linkedin": "LinkedIn",
    "whatsapp": "WhatsApp",
    "radio": "Radio",
    "relais_institutionnel": "Institutional relay",
    "mobilisation_etudiante": "Student mobilisation",
    "diaspora": "Diaspora network",
    "autre": "Other"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "feat(ebc26): add candidatures i18n namespace (FR + EN)"
```

---

## Task 5: API Route Handlers

**Files:**
- Create: `app/api/candidatures/ebc26/meta/route.ts`
- Create: `app/api/candidatures/ebc26/route.ts`
- Create: `app/api/candidatures/ebc26/[token]/route.ts`
- Create: `app/api/candidatures/ebc26/[token]/regularisation/route.ts`
- Create: `app/api/candidatures/ebc26/[token]/effacement/route.ts`
- Create: `lib/candidatures/email.ts`

- [ ] **Step 1: Write email.ts**

```typescript
// lib/candidatures/email.ts
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

const FROM = "InnovateBF <noreply@resend.dev>";

interface AccuseParams {
  to: string;
  dossierNumero: string;
  suiviUrl: string;
  langue: "fr" | "en";
}

export async function envoyerAccuse({ to, dossierNumero, suiviUrl, langue }: AccuseParams) {
  const subject = langue === "fr"
    ? `Accusé de réception — Candidature EBC'26 ${dossierNumero}`
    : `Acknowledgement — EBC'26 Application ${dossierNumero}`;

  const html = langue === "fr"
    ? `<p>Bonjour,</p>
       <p>Votre candidature EBC'26 a bien été reçue.</p>
       <p><strong>Numéro de dossier :</strong> ${dossierNumero}</p>
       <p><a href="${suiviUrl}">Suivre votre dossier</a></p>
       <p>Vous pouvez compléter des pièces manquantes dans les 72 heures suivant la soumission.</p>
       <p>Dates de la conférence : 13–14 novembre 2026, CEA-UNB, Bobo-Dioulasso.</p>`
    : `<p>Hello,</p>
       <p>Your EBC'26 application has been received.</p>
       <p><strong>Reference number:</strong> ${dossierNumero}</p>
       <p><a href="${suiviUrl}">Track your application</a></p>
       <p>You may add missing documents within 72 hours of submission.</p>
       <p>Conference dates: 13–14 November 2026, CEA-UNB, Bobo-Dioulasso.</p>`;

  await getResend().emails.send({ from: FROM, to, subject, html });
}
```

- [ ] **Step 2: Write meta route**

```typescript
// app/api/candidatures/ebc26/meta/route.ts
import { NextResponse } from "next/server";

// Adjust CLOTURE_LE when the real deadline is confirmed
const CLOTURE_LE = process.env.EBC26_CLOTURE_LE ?? "2026-10-31T23:59:59Z";

export async function GET() {
  const now = new Date();
  const cloture = new Date(CLOTURE_LE);
  return NextResponse.json({
    ouvert: now < cloture,
    clotureLe: CLOTURE_LE,
    dateConference: "2026-11-13",
    lieu: "CEA-UNB, Bobo-Dioulasso",
  });
}
```

- [ ] **Step 3: Write submit route (idempotent POST)**

```typescript
// app/api/candidatures/ebc26/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { candidatureSchema } from "@/lib/candidatures/schema";
import { soumettreCandidatureWithToken } from "@/lib/candidatures/db";
import { envoyerAccuse } from "@/lib/candidatures/email";

const CLOTURE_LE = process.env.EBC26_CLOTURE_LE ?? "2026-10-31T23:59:59Z";

// In-memory rate limit: 3 submissions/hour per IP
const rl = new Map<string, { count: number; reset: number }>();
function checkRl(ip: string): boolean {
  const now = Date.now();
  const entry = rl.get(ip);
  if (!entry || now > entry.reset) {
    rl.set(ip, { count: 1, reset: now + 3600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRl(ip)) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  if (new Date() >= new Date(CLOTURE_LE)) {
    return NextResponse.json({ error: "closed", code: "closed" }, { status: 409 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  let payload;
  try {
    payload = candidatureSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Validation", issues: err.issues }, { status: 422 });
    }
    throw err;
  }

  const result = await soumettreCandidatureWithToken(payload);

  if (result.isNew && result.tokenClair) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const suiviUrl = `${siteUrl}/${payload.langue}/submit/ebc26/suivi/${result.tokenClair}`;
    await envoyerAccuse({
      to: payload.porteur.email,
      dossierNumero: result.dossier_numero,
      suiviUrl,
      langue: payload.langue,
    }).catch(console.error); // never block submission on email failure
  }

  return NextResponse.json({ dossier_numero: result.dossier_numero }, { status: 201 });
}
```

- [ ] **Step 4: Write [token] GET status route**

```typescript
// app/api/candidatures/ebc26/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDossierByToken } from "@/lib/candidatures/db";

const rl = new Map<string, { count: number; reset: number }>();
function checkRl(key: string): boolean {
  const now = Date.now();
  const entry = rl.get(key);
  if (!entry || now > entry.reset) {
    rl.set(key, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const HIDDEN_STATUTS = new Set(["retenu", "non_retenu"]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRl(ip) || !checkRl(token)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const dossier = await getDossierByToken(token);
  if (!dossier) return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });

  const statut = HIDDEN_STATUTS.has(dossier.statut) ? "en_evaluation" : dossier.statut;
  return NextResponse.json({
    dossier_numero: dossier.dossier_numero,
    statut,
    soumis_le: dossier.soumis_le,
    motif_non_recevabilite: dossier.motif_non_recevabilite,
  });
}
```

- [ ] **Step 5: Write regularisation route**

```typescript
// app/api/candidatures/ebc26/[token]/regularisation/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { regularisationSchema } from "@/lib/candidatures/schema";
import { getDossierByToken, regulariserDossier } from "@/lib/candidatures/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const dossier = await getDossierByToken(token);
  if (!dossier) return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  if (dossier.statut !== "incomplet") {
    return NextResponse.json({ error: "Regularisation non applicable." }, { status: 403 });
  }

  // 72h window check
  const soumisLe = new Date(dossier.soumis_le);
  if (Date.now() - soumisLe.getTime() > 72 * 3600 * 1000) {
    return NextResponse.json({ error: "Fenêtre de régularisation expirée." }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  let payload;
  try { payload = regularisationSchema.parse(body); } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: "Validation", issues: err.issues }, { status: 422 });
    throw err;
  }

  const updated = await regulariserDossier(token, payload.demonstrateur_url);
  if (!updated) return NextResponse.json({ error: "Mise à jour échouée." }, { status: 500 });

  return NextResponse.json({ statut: updated.statut, dossier_numero: updated.dossier_numero });
}
```

- [ ] **Step 6: Write effacement route**

```typescript
// app/api/candidatures/ebc26/[token]/effacement/route.ts
import { NextRequest, NextResponse } from "next/server";
import { effacerDossier } from "@/lib/candidatures/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const result = await effacerDossier(token);
  return NextResponse.json(result, { status: 200 });
}
```

- [ ] **Step 7: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add lib/candidatures/email.ts app/api/candidatures/
git commit -m "feat(ebc26): add API route handlers (meta, submit, status, regularisation, effacement)"
```

---

## Task 6: Base UI Components

**Files:**
- Create: `components/candidatures/TrlSelect.tsx`
- Create: `components/candidatures/CharCounter.tsx`
- Create: `components/candidatures/FieldError.tsx`

- [ ] **Step 1: Write TrlSelect**

```tsx
// components/candidatures/TrlSelect.tsx
"use client";
import { useTranslations } from "next-intl";
import { TRL_NIVEAUX } from "@/lib/candidatures/enums";

interface TrlSelectProps {
  value: number | "";
  onChange: (v: number) => void;
  error?: string;
  id?: string;
}

export function TrlSelect({ value, onChange, error, id = "trl_declare" }: TrlSelectProps) {
  const t = useTranslations("candidatures");
  return (
    <div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
      >
        <option value="">—</option>
        {TRL_NIVEAUX.map(({ value: v, i18nKey }) => (
          <option key={v} value={v}>{t(i18nKey as Parameters<typeof t>[0])}</option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write CharCounter**

```tsx
// components/candidatures/CharCounter.tsx
"use client";
import { useTranslations } from "next-intl";

interface CharCounterProps {
  value: string;
  max: number;
  id?: string;
  label: string;
  rows?: number;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}

export function CharCounter({ value, max, id, label, rows = 4, onChange, error, required }: CharCounterProps) {
  const t = useTranslations("candidatures.wizard");
  const remaining = max - value.length;
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "_");
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${fieldId}-counter${error ? ` ${errorId}` : ""}`}
        aria-invalid={!!error}
        required={required}
        className={`w-full resize-none rounded-lg border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-[#b70011] focus:ring-[#b70011]/20"
        }`}
      />
      <div className="mt-0.5 flex items-start justify-between gap-2">
        {error
          ? <p id={errorId} role="alert" className="text-xs text-red-600">{error}</p>
          : <span />}
        <p id={`${fieldId}-counter`} className={`shrink-0 text-xs ${remaining < 50 ? "text-amber-600" : "text-gray-400"}`}>
          {t("caracteres_restants", { n: remaining })}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write FieldError**

```tsx
// components/candidatures/FieldError.tsx
interface FieldErrorProps { id: string; message?: string }

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return <p id={id} role="alert" className="mt-1 text-xs text-red-600">{message}</p>;
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/candidatures/TrlSelect.tsx components/candidatures/CharCounter.tsx components/candidatures/FieldError.tsx
git commit -m "feat(ebc26): add TrlSelect, CharCounter, FieldError UI components"
```

---

## Task 7: Wizard Step Components (A–G)

**Files:**
- Create: `components/candidatures/steps/StepPorteur.tsx`
- Create: `components/candidatures/steps/StepProjet.tsx`
- Create: `components/candidatures/steps/StepTechnique.tsx`
- Create: `components/candidatures/steps/StepImpact.tsx`
- Create: `components/candidatures/steps/StepPieces.tsx`
- Create: `components/candidatures/steps/StepPresentation.tsx`
- Create: `components/candidatures/steps/StepDeclarations.tsx`

Each step receives `{ control, errors, watch }` from React Hook Form and renders its section.

- [ ] **Step 1: Create shared step field wrapper helper (inline, not a file)**

Each step uses this pattern for text inputs (no separate file needed):

```tsx
// Pattern used in every step:
<div>
  <label htmlFor="field_id" className="mb-1.5 block text-sm font-medium text-gray-700">
    {t("label_key")}<span className="ml-0.5 text-red-500">*</span>
  </label>
  <input
    id="field_id"
    {...register("section.field")}
    aria-invalid={!!errors.section?.field}
    aria-describedby="field_id-error"
    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
  />
  <FieldError id="field_id-error" message={errors.section?.field?.message} />
</div>
```

- [ ] **Step 2: Write StepPorteur.tsx**

```tsx
// components/candidatures/steps/StepPorteur.tsx
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

export function StepPorteur({ register, errors, watch }: Props) {
  const t = useTranslations("candidatures");
  const tp = useTranslations("candidatures.step_porteur");
  const affilié = watch("porteur.affiliation_organisateur");

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      {/* Nom */}
      <div>
        <label htmlFor="porteur_nom" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("nom_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <input id="porteur_nom" {...register("porteur.nom")}
          aria-invalid={!!errors.porteur?.nom} aria-describedby="porteur_nom-error"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
        <FieldError id="porteur_nom-error" message={errors.porteur?.nom?.message} />
      </div>

      {/* Structure */}
      <div>
        <label htmlFor="porteur_structure" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("structure_label")}
        </label>
        <input id="porteur_structure" {...register("porteur.structure")}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
      </div>

      {/* Statut porteur */}
      <div>
        <label htmlFor="porteur_statut" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("statut_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <select id="porteur_statut" {...register("porteur.statut")}
          aria-invalid={!!errors.porteur?.statut}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20">
          <option value="">—</option>
          {STATUT_PORTEUR.map((s) => (
            <option key={s} value={s}>{t(`statuts_porteur.${s}` as Parameters<typeof t>[0])}</option>
          ))}
        </select>
        <FieldError id="porteur_statut-error" message={errors.porteur?.statut?.message} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="porteur_email" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("email_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <input id="porteur_email" type="email" {...register("porteur.email")}
          aria-invalid={!!errors.porteur?.email} aria-describedby="porteur_email-error"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
        <FieldError id="porteur_email-error" message={errors.porteur?.email?.message} />
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="porteur_tel" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("telephone_label")}
        </label>
        <input id="porteur_tel" type="tel" {...register("porteur.telephone")}
          placeholder="+226 XX XX XX XX"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
      </div>

      {/* Pays/ville */}
      <div>
        <label htmlFor="porteur_pays" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("pays_ville_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <input id="porteur_pays" {...register("porteur.pays_ville")}
          aria-invalid={!!errors.porteur?.pays_ville} aria-describedby="porteur_pays-error"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
        <FieldError id="porteur_pays-error" message={errors.porteur?.pays_ville?.message} />
      </div>

      {/* Affiliation organisateur */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("affil_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <p className="mb-2 text-xs text-gray-500">{tp("affil_aide")}</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" {...register("porteur.affiliation_organisateur")} value="true"
              className="accent-[#b70011]" /> Oui
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" {...register("porteur.affiliation_organisateur")} value="false"
              className="accent-[#b70011]" /> Non
          </label>
        </div>
        <FieldError id="porteur_affil-error" message={errors.porteur?.affiliation_organisateur?.message} />
      </div>

      {/* Affiliation précision (conditional) */}
      {affilié && (
        <div>
          <label htmlFor="porteur_affil_precision" className="mb-1.5 block text-sm font-medium text-gray-700">
            {tp("affil_precision_label")}<span className="ml-0.5 text-red-500">*</span>
          </label>
          <input id="porteur_affil_precision" {...register("porteur.affiliation_precision")}
            aria-invalid={!!errors.porteur?.affiliation_precision}
            aria-describedby="porteur_affil_precision-error"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
          <FieldError id="porteur_affil_precision-error" message={errors.porteur?.affiliation_precision?.message} />
        </div>
      )}
    </fieldset>
  );
}
```

- [ ] **Step 3: Write StepProjet.tsx**

```tsx
// components/candidatures/steps/StepProjet.tsx
"use client";
import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { DOMAINES, CATEGORIES_CANDIDATABLES } from "@/lib/candidatures/enums";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepProjet({ control, errors }: Props) {
  const t = useTranslations("candidatures");
  const tp = useTranslations("candidatures.step_projet");

  const { field: titreField } = useController({ control, name: "projet.titre" });
  const { field: resumeField } = useController({ control, name: "projet.resume" });
  const { field: problemeField } = useController({ control, name: "projet.probleme_endogene" });
  const { field: domaineField } = useController({ control, name: "projet.domaine" });
  const { field: categorieField } = useController({ control, name: "projet.categorie" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      {/* Titre */}
      <div>
        <label htmlFor="projet_titre" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("titre_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <input id="projet_titre" maxLength={150} {...titreField}
          aria-invalid={!!errors.projet?.titre} aria-describedby="projet_titre-error"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
        <FieldError id="projet_titre-error" message={errors.projet?.titre?.message} />
      </div>

      {/* Domaine */}
      <div>
        <label htmlFor="projet_domaine" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("domaine_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <select id="projet_domaine" {...domaineField}
          aria-invalid={!!errors.projet?.domaine}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20">
          <option value="">—</option>
          {DOMAINES.map((d) => (
            <option key={d} value={d}>{t(`domaines.${d}` as Parameters<typeof t>[0])}</option>
          ))}
        </select>
        <FieldError id="projet_domaine-error" message={errors.projet?.domaine?.message} />
      </div>

      {/* Catégorie */}
      <div>
        <label htmlFor="projet_categorie" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("categorie_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <select id="projet_categorie" {...categorieField}
          aria-invalid={!!errors.projet?.categorie}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20">
          <option value="">—</option>
          {CATEGORIES_CANDIDATABLES.map((c) => (
            <option key={c} value={c}>{t(`categories.${c}` as Parameters<typeof t>[0])}</option>
          ))}
        </select>
        <FieldError id="projet_categorie-error" message={errors.projet?.categorie?.message} />
      </div>

      {/* Résumé */}
      <CharCounter id="projet_resume" label={tp("resume_label")} required
        value={resumeField.value ?? ""} max={1500}
        onChange={resumeField.onChange}
        error={errors.projet?.resume?.message} rows={5} />

      {/* Problème endogène */}
      <CharCounter id="projet_probleme" label={tp("probleme_label")} required
        value={problemeField.value ?? ""} max={1000}
        onChange={problemeField.onChange}
        error={errors.projet?.probleme_endogene?.message} rows={4} />
    </fieldset>
  );
}
```

- [ ] **Step 4: Write StepTechnique.tsx**

```tsx
// components/candidatures/steps/StepTechnique.tsx
"use client";
import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { TrlSelect } from "@/components/candidatures/TrlSelect";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepTechnique({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_technique");

  const { field: descField } = useController({ control, name: "technique.description" });
  const { field: innoField } = useController({ control, name: "technique.innovation" });
  const { field: faisField } = useController({ control, name: "technique.faisabilite" });
  const { field: trlField } = useController({ control, name: "technique.trl_declare" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <CharCounter id="tech_description" label={tp("description_label")} required
        value={descField.value ?? ""} max={3000} onChange={descField.onChange}
        error={errors.technique?.description?.message} rows={6} />

      <CharCounter id="tech_innovation" label={tp("innovation_label")} required
        value={innoField.value ?? ""} max={1500} onChange={innoField.onChange}
        error={errors.technique?.innovation?.message} rows={4} />

      <div>
        <label htmlFor="trl_declare" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("trl_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <TrlSelect id="trl_declare"
          value={trlField.value ?? ""}
          onChange={trlField.onChange}
          error={errors.technique?.trl_declare?.message} />
      </div>

      <CharCounter id="tech_faisabilite" label={tp("faisabilite_label")} required
        value={faisField.value ?? ""} max={1500} onChange={faisField.onChange}
        error={errors.technique?.faisabilite?.message} rows={4} />
    </fieldset>
  );
}
```

- [ ] **Step 5: Write StepImpact.tsx**

```tsx
// components/candidatures/steps/StepImpact.tsx
"use client";
import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CharCounter } from "@/components/candidatures/CharCounter";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepImpact({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_impact");

  const { field: societalField } = useController({ control, name: "impact.societal" });
  const { field: econField } = useController({ control, name: "impact.economique" });
  const { field: envField } = useController({ control, name: "impact.environnemental" });
  const { field: endField } = useController({ control, name: "impact.contribution_endogene" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>
      <CharCounter id="impact_societal" label={tp("societal_label")} required
        value={societalField.value ?? ""} max={1200} onChange={societalField.onChange}
        error={errors.impact?.societal?.message} rows={4} />
      <CharCounter id="impact_economique" label={tp("economique_label")} required
        value={econField.value ?? ""} max={1200} onChange={econField.onChange}
        error={errors.impact?.economique?.message} rows={4} />
      <CharCounter id="impact_environnemental" label={tp("environnemental_label")}
        value={envField.value ?? ""} max={800} onChange={envField.onChange}
        error={errors.impact?.environnemental?.message} rows={3} />
      <CharCounter id="impact_endogene" label={tp("endogene_label")} required
        value={endField.value ?? ""} max={1000} onChange={endField.onChange}
        error={errors.impact?.contribution_endogene?.message} rows={4} />
    </fieldset>
  );
}
```

- [ ] **Step 6: Write StepPieces.tsx**

```tsx
// components/candidatures/steps/StepPieces.tsx
"use client";
import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepPieces({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_pieces");

  const { field: urlField } = useController({ control, name: "pieces.demonstrateur_url" });
  const { field: refField } = useController({ control, name: "pieces.references" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{tp("aide")}</p>

      <div>
        <label htmlFor="pieces_url" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("demonstrateur_label")}
        </label>
        <input id="pieces_url" type="url" {...urlField}
          placeholder="https://"
          aria-invalid={!!errors.pieces?.demonstrateur_url}
          aria-describedby="pieces_url-error"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
        <FieldError id="pieces_url-error" message={errors.pieces?.demonstrateur_url?.message} />
      </div>

      <CharCounter id="pieces_references" label={tp("references_label")}
        value={refField.value ?? ""} max={1000} onChange={refField.onChange}
        error={errors.pieces?.references?.message} rows={3} />
    </fieldset>
  );
}
```

- [ ] **Step 7: Write StepPresentation.tsx**

```tsx
// components/candidatures/steps/StepPresentation.tsx
"use client";
import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { PRESENTATION_MODE } from "@/lib/candidatures/enums";
import { CharCounter } from "@/components/candidatures/CharCounter";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepPresentation({ control, errors }: Props) {
  const tp = useTranslations("candidatures.step_presentation");

  const { field: modeField } = useController({ control, name: "presentation.mode" });
  const { field: besoinsField } = useController({ control, name: "presentation.besoins" });
  const { field: diasporaField } = useController({ control, name: "presentation.diaspora" });

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <div>
        <label htmlFor="pres_mode" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("mode_label")}<span className="ml-0.5 text-red-500">*</span>
        </label>
        <select id="pres_mode" {...modeField}
          aria-invalid={!!errors.presentation?.mode}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20">
          <option value="">—</option>
          {PRESENTATION_MODE.map((m) => (
            <option key={m} value={m}>{tp(`mode_${m}` as Parameters<typeof tp>[0])}</option>
          ))}
        </select>
        <FieldError id="pres_mode-error" message={errors.presentation?.mode?.message} />
      </div>

      <CharCounter id="pres_besoins" label={tp("besoins_label")}
        value={besoinsField.value ?? ""} max={500} onChange={besoinsField.onChange}
        error={errors.presentation?.besoins?.message} rows={3} />

      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input type="checkbox"
          checked={diasporaField.value ?? false}
          onChange={(e) => diasporaField.onChange(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-[#b70011]" />
        {tp("diaspora_label")}
      </label>
    </fieldset>
  );
}
```

- [ ] **Step 8: Write StepDeclarations.tsx**

```tsx
// components/candidatures/steps/StepDeclarations.tsx
"use client";
import { useTranslations } from "next-intl";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import type { CandidaturePayload } from "@/lib/candidatures/schema";
import { CANAL_INFORMATION } from "@/lib/candidatures/enums";
import { FieldError } from "@/components/candidatures/FieldError";

interface Props {
  control: Control<CandidaturePayload>;
  errors: FieldErrors<CandidaturePayload>;
}

export function StepDeclarations({ control, errors }: Props) {
  const t = useTranslations("candidatures");
  const tp = useTranslations("candidatures.step_declarations");

  const { field: origField } = useController({ control, name: "declarations.originalite" });
  const { field: conflitField } = useController({ control, name: "declarations.conflit_interets" });
  const { field: traitField } = useController({ control, name: "declarations.consentement_traitement" });
  const { field: pubField } = useController({ control, name: "declarations.consentement_publication" });
  const { field: commField } = useController({ control, name: "declarations.consentement_communication" });
  const { field: canalField } = useController({ control, name: "canal_information" });

  const required = (field: typeof origField, errorMsg?: string, label?: string) => (
    <label className="flex items-start gap-3 text-sm text-gray-700">
      <input type="checkbox"
        checked={field.value === true}
        onChange={(e) => field.onChange(e.target.checked || undefined)}
        className="mt-0.5 size-4 rounded accent-[#b70011]" />
      <span>{label}<span className="ml-0.5 text-red-500">*</span></span>
      {errorMsg && <span className="sr-only">{errorMsg}</span>}
    </label>
  );

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{tp("titre")}</legend>

      <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
        {required(origField, errors.declarations?.originalite?.message, tp("originalite_label"))}
        <FieldError id="decl_orig-error" message={errors.declarations?.originalite?.message} />

        {required(conflitField, errors.declarations?.conflit_interets?.message, tp("conflit_label"))}
        <FieldError id="decl_conflit-error" message={errors.declarations?.conflit_interets?.message} />

        {required(traitField, errors.declarations?.consentement_traitement?.message, tp("consent_traitement_label"))}
        <FieldError id="decl_trait-error" message={errors.declarations?.consentement_traitement?.message} />
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input type="checkbox"
          checked={pubField.value ?? false}
          onChange={(e) => pubField.onChange(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-[#b70011]" />
        {tp("consent_publication_label")}
      </label>

      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input type="checkbox"
          checked={commField.value ?? false}
          onChange={(e) => commField.onChange(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-[#b70011]" />
        {tp("consent_communication_label")}
      </label>

      <div>
        <label htmlFor="canal_info" className="mb-1.5 block text-sm font-medium text-gray-700">
          {tp("canal_label")}
        </label>
        <select id="canal_info" {...canalField}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20">
          <option value="">—</option>
          {CANAL_INFORMATION.map((c) => (
            <option key={c} value={c}>{t(`canaux.${c}` as Parameters<typeof t>[0])}</option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 9: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add components/candidatures/steps/
git commit -m "feat(ebc26): add all 7 wizard step components"
```

---

## Task 8: Wizard Container + Recapitulatif

**Files:**
- Create: `components/candidatures/Recapitulatif.tsx`
- Create: `components/candidatures/Wizard.tsx`

- [ ] **Step 1: Write Recapitulatif.tsx**

```tsx
// components/candidatures/Recapitulatif.tsx
"use client";
import { useTranslations } from "next-intl";
import type { CandidaturePayload } from "@/lib/candidatures/schema";

interface Props {
  data: Partial<CandidaturePayload>;
  onEdit: (stepIndex: number) => void;
}

function Section({ title, children, onEdit, step }: {
  title: string; children: React.ReactNode; onEdit: (i: number) => void; step: number;
}) {
  const t = useTranslations("candidatures.recapitulatif");
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button type="button" onClick={() => onEdit(step)}
          className="text-xs font-medium text-[#b70011] hover:underline">
          {t("modifier")}
        </button>
      </div>
      <dl className="space-y-1.5 text-sm">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | boolean | number | null }) {
  if (!value && value !== 0) return null;
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
      {presentation && (
        <Section title={t("step_presentation.titre")} onEdit={onEdit} step={5}>
          <Row label={t("step_presentation.mode_label")} value={presentation.mode} />
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
```

- [ ] **Step 2: Write Wizard.tsx**

```tsx
// components/candidatures/Wizard.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { candidatureSchema, stepSchemas, type CandidaturePayload } from "@/lib/candidatures/schema";
import { getOrCreateIdempotencyKey, resetIdempotencyKey } from "@/lib/candidatures/idempotency";
import { StepPorteur } from "./steps/StepPorteur";
import { StepProjet } from "./steps/StepProjet";
import { StepTechnique } from "./steps/StepTechnique";
import { StepImpact } from "./steps/StepImpact";
import { StepPieces } from "./steps/StepPieces";
import { StepPresentation } from "./steps/StepPresentation";
import { StepDeclarations } from "./steps/StepDeclarations";
import { Recapitulatif } from "./Recapitulatif";

// Step order mirrors spec §9.2: A B C D E G F recap
const STEP_KEYS = [
  "porteur","projet","technique","impact","pieces","presentation","declarations","recap",
] as const;
type StepKey = (typeof STEP_KEYS)[number];
const STEP_NAMES_FR = ["Porteur","Projet","Technique","Impact","Pièces","Présentation","Déclarations","Récap"];

export function Wizard({ locale }: { locale: string }) {
  const t = useTranslations("candidatures.wizard");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleSubmit, control, register, watch, trigger, formState: { errors } } =
    useForm<CandidaturePayload>({
      resolver: zodResolver(candidatureSchema),
      defaultValues: {
        langue: locale as "fr" | "en",
        idempotency_key: getOrCreateIdempotencyKey(),
        honeypot: "",
        porteur: { affiliation_organisateur: false },
        projet: {},
        technique: {},
        impact: {},
        pieces: {},
        presentation: { diaspora: false },
        declarations: {},
      },
    });

  const isRecap = step === STEP_KEYS.length - 1;

  const stepSectionMap: Record<number, keyof typeof stepSchemas> = {
    0: "porteur", 1: "projet", 2: "technique", 3: "impact",
    4: "pieces", 5: "presentation", 6: "declarations",
  };

  async function next() {
    if (isRecap) return;
    const sectionKey = stepSectionMap[step];
    if (sectionKey) {
      const valid = await trigger(sectionKey as keyof CandidaturePayload);
      if (!valid) return;
    }
    setStep((s) => s + 1);
  }

  function prev() { setStep((s) => Math.max(0, s - 1)); }

  async function onSubmit(data: CandidaturePayload) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/candidatures/ebc26", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": data.idempotency_key,
        },
        body: JSON.stringify(data),
      });
      if (res.status === 409) {
        const json = await res.json();
        if (json.code === "closed") {
          setError(t("..") ?? "L'appel est clôturé.");
          return;
        }
      }
      if (!res.ok) {
        setError(t("..") ?? "Erreur réseau.");
        return;
      }
      const { dossier_numero } = await res.json();
      resetIdempotencyKey();
      router.push(`/${locale}/submit/ebc26/confirmation?numero=${dossier_numero}`);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepProps = { control, register, errors, watch };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Stepper */}
      <nav aria-label={t("etape", { courante: step + 1, total: STEP_KEYS.length })}>
        <ol className="mb-8 flex gap-1.5" role="list">
          {STEP_KEYS.map((_, i) => (
            <li key={i} className="flex-1" aria-current={i === step ? "step" : undefined}>
              <div className={`h-1.5 rounded-full transition-colors ${
                i < step ? "bg-[#006e2d]" : i === step ? "bg-[#b70011]" : "bg-gray-200"
              }`} />
              <span className="sr-only">{STEP_NAMES_FR[i]}</span>
            </li>
          ))}
        </ol>
        <p className="mb-6 text-center text-sm text-gray-500">
          {t("etape", { courante: step + 1, total: STEP_KEYS.length })}
        </p>
      </nav>

      {/* Session warning */}
      <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700" role="note">
        {t("avertissement_session")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Hidden honeypot */}
        <input type="text" {...register("honeypot")} aria-hidden="true"
          tabIndex={-1} className="sr-only" autoComplete="off" />

        {/* Step panels */}
        <div aria-live="polite">
          {step === 0 && <StepPorteur register={register} errors={errors} watch={watch} />}
          {step === 1 && <StepProjet control={control} errors={errors} />}
          {step === 2 && <StepTechnique control={control} errors={errors} />}
          {step === 3 && <StepImpact control={control} errors={errors} />}
          {step === 4 && <StepPieces control={control} errors={errors} />}
          {step === 5 && <StepPresentation control={control} errors={errors} />}
          {step === 6 && <StepDeclarations control={control} errors={errors} />}
          {isRecap && (
            <>
              <Recapitulatif data={watch()} onEdit={(i) => setStep(i)} />
            </>
          )}
        </div>

        {error && (
          <div role="alert" aria-live="assertive"
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          {step > 0 && (
            <button type="button" onClick={prev}
              className="flex-1 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {t("precedent")}
            </button>
          )}
          {!isRecap && (
            <button type="button" onClick={next}
              className="flex-1 rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010] focus:outline-none focus:ring-2 focus:ring-[#b70011]/50">
              {t("suivant")}
            </button>
          )}
          {isRecap && (
            <button type="submit" disabled={submitting}
              className="flex-1 rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010] disabled:opacity-60">
              {submitting ? "..." : t("soumettre")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/candidatures/Recapitulatif.tsx components/candidatures/Wizard.tsx
git commit -m "feat(ebc26): add Wizard container and Recapitulatif components"
```

---

## Task 9: Pages

**Files:**
- Create: `app/[locale]/submit/ebc26/page.tsx`
- Create: `app/[locale]/submit/ebc26/soumettre/page.tsx`
- Create: `app/[locale]/submit/ebc26/confirmation/page.tsx`
- Create: `app/[locale]/submit/ebc26/suivi/[token]/page.tsx`
- Create: `app/[locale]/submit/ebc26/suivi/[token]/regulariser/page.tsx`

- [ ] **Step 1: Write landing page**

```tsx
// app/[locale]/submit/ebc26/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function EBC26LandingPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "candidatures" });

  const CATEGORIES = [
    "ia","iot","big_data","embarque_robotique","impact_societal",
    "developpement_endogene","jeune_innovateur","startup_innovante","projet_academique",
  ] as const;

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-[#0D0D0D] px-4 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-[#b70011]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#dc2626]">
            EBC&apos;26 Awards
          </span>
          <h1 className="text-4xl font-bold lg:text-5xl">{t("appel.titre")}</h1>
          <p className="mt-4 text-gray-400">{t("appel.conference")}</p>
          <p className="mx-auto mt-6 max-w-xl text-gray-300">{t("appel.intro")}</p>
          <p className="mt-2 text-sm text-gray-500">{t("appel.gratuit")}</p>
          <div className="mt-8">
            <Link
              href="/submit/ebc26/soumettre"
              className="inline-flex items-center gap-2 rounded-xl bg-[#b70011] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#9a0010]"
            >
              {t("appel.cta_soumettre")}
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Catégories Awards</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <div key={c} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                {t(`categories.${c}` as Parameters<typeof t>[0])}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Write wizard host page**

```tsx
// app/[locale]/submit/ebc26/soumettre/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Wizard } from "@/components/candidatures/Wizard";

export default async function EBC26SoumettreePage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "candidatures" });

  return (
    <main>
      <div className="border-b border-gray-100 bg-white px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold text-gray-900">{t("appel.titre")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("appel.conference")}</p>
        </div>
      </div>
      <Wizard locale={locale} />
    </main>
  );
}
```

- [ ] **Step 3: Write confirmation page**

```tsx
// app/[locale]/submit/ebc26/confirmation/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, Copy } from "lucide-react";
import { Suspense } from "react";

function ConfirmationContent() {
  const t = useTranslations("candidatures.confirmation");
  const params = useSearchParams();
  const numero = params.get("numero") ?? "—";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <CheckCircle className="mx-auto mb-6 size-16 text-[#006e2d]" aria-hidden="true" />
      <h1 className="text-3xl font-bold text-gray-900">{t("titre")}</h1>
      <p className="mt-4 text-lg font-semibold text-[#b70011]">
        {t("numero", { numero })}
      </p>
      <p className="mt-3 text-gray-600">{t("email_envoye")}</p>
      <p className="mt-2 text-sm text-gray-500">{t("delais")}</p>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
```

- [ ] **Step 4: Write status tracking page**

```tsx
// app/[locale]/submit/ebc26/suivi/[token]/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getDossierByToken } from "@/lib/candidatures/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SuiviPage({
  params,
}: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "candidatures.suivi" });

  const dossier = await getDossierByToken(token);
  if (!dossier) notFound();

  const HIDDEN = new Set(["retenu", "non_retenu"]);
  const statutVisible = HIDDEN.has(dossier.statut) ? "notifie" : dossier.statut;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t("titre")}</h1>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{t("statut_label")}</span>
          <span className="rounded-full bg-[#b70011]/10 px-3 py-1 text-sm font-semibold text-[#b70011]">
            {t(`statuts.${statutVisible}` as Parameters<typeof t>[0])}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {t("soumis_le", { date: new Date(dossier.soumis_le).toLocaleDateString(locale) })}
        </p>
        <p className="mt-1 font-mono text-xs text-gray-400">{dossier.dossier_numero}</p>

        {dossier.statut === "incomplet" && (
          <div className="mt-6">
            <Link
              href={`/submit/ebc26/suivi/${token}/regulariser`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010]"
            >
              {t("regulariser")}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Write regularisation page**

```tsx
// app/[locale]/submit/ebc26/suivi/[token]/regulariser/page.tsx
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

export default function RegulariserPage() {
  const t = useTranslations("candidatures.regularisation");
  const { token, locale } = useParams<{ token: string; locale: string }>();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/candidatures/ebc26/${token}/regularisation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demonstrateur_url: url || undefined }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? "Erreur");
        return;
      }
      router.push(`/${locale}/submit/ebc26/suivi/${token}`);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{t("titre")}</h1>
      <p className="mb-6 text-sm text-gray-600">{t("aide")}</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="demo_url" className="mb-1.5 block text-sm font-medium text-gray-700">
            Lien démonstrateur (facultatif)
          </label>
          <input id="demo_url" type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20" />
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010] disabled:opacity-60">
          {loading ? "..." : t("confirmer")}
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add app/\[locale\]/submit/ebc26/
git commit -m "feat(ebc26): add landing, wizard, confirmation, suivi, regulariser pages"
```

---

## Task 10: Add EBC26_CLOTURE_LE to env

- [ ] **Step 1: Add env var to .env.local and .env.example**

In `.env.local`:
```
EBC26_CLOTURE_LE=2026-10-31T23:59:59Z
```

In `.env.example`:
```
# EBC'26 deadline (ISO 8601 UTC)
EBC26_CLOTURE_LE=2026-10-31T23:59:59Z
```

- [ ] **Step 2: Final type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify routing**

```bash
npm run dev
```

Open: `http://localhost:3000/submit/ebc26` → landing page loads.
Open: `http://localhost:3000/submit/ebc26/soumettre` → wizard renders.

- [ ] **Step 4: Final commit**

```bash
git add .env.example
git commit -m "feat(ebc26): add EBC26_CLOTURE_LE env var"
```

---

## Self-Review Checklist

- [x] SQL migration covers all 52 spec fields
- [x] Zod schema is shared between client (wizard) and server (route handler)
- [x] Idempotency enforced via DB unique constraint + client sessionStorage key
- [x] Token generated with `crypto.randomBytes`, stored as SHA-256 hash
- [x] Status `retenu`/`non_retenu` hidden until `notifie` in GET route
- [x] 72h window enforced in regularisation route
- [x] RGPD erasure endpoint respects `STATUTS_EFFACABLES`
- [x] Rate limiting on submit (3/h/IP) and status endpoint (10/min/IP+token)
- [x] Honeypot field in schema and form
- [x] Emails via Resend, both FR and EN
- [x] Messages in `messages/{locale}.json` (project convention, not `locales/`)
- [x] Design tokens match project: primary `#b70011`, secondary `#006e2d`
- [x] `aria-invalid`, `aria-describedby`, `aria-current`, `aria-live` on key elements
- [x] `force-dynamic` on suivi page (token-based, can't be static)
- [ ] File uploads deferred — demonstrateur accepts URL only (documented scope limit)
- [ ] reCAPTCHA v3 deferred — honeypot only (documented scope limit)
