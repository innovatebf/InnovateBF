import { getSql } from "@/lib/db/neon";
import type { CandidaturePayload } from "./schema";
import type { StatutDossier } from "./enums";
import { STATUTS_EFFACABLES } from "./enums";
import { genererDossierNumero, genererSuiviToken, hacherToken } from "./token";

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

export async function soumettreCandidatureWithToken(
  payload: CandidaturePayload,
): Promise<{ dossier_numero: string; isNew: boolean; tokenClair?: string }> {
  const sql = getSql();
  const { porteur, projet, technique, impact, pieces, presentation, declarations } = payload;

  // Idempotency check — return existing dossier if key was already used
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
