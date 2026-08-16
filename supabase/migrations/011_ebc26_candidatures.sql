-- Migration 011: EBC'26 candidature tables
-- Ref: Spec §3 (persistance), §7bis (sécurité/conformité)

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

  -- Section E: pièces (URL only — upload infrastructure deferred)
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
