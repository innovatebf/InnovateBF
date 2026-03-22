-- ============================================================
-- Migration 007: ie_proposals table (Neon PostgreSQL)
-- Table des propositions de solutions pour les besoins IE
-- ============================================================

CREATE TABLE IF NOT EXISTS ie_proposals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Référence au besoin
  need_id          UUID NOT NULL REFERENCES ie_needs(id) ON DELETE CASCADE,

  -- Contenu de la proposition
  titre            TEXT NOT NULL,
  description      TEXT NOT NULL,
  approche         TEXT,
  equipe           TEXT,

  -- Chiffrage
  budget_estime    NUMERIC(15, 2),
  delai            TEXT, -- '3_mois' | '6_mois' | '1_an' | '2_ans' | '3_ans_plus'

  -- Porteur
  porteur_nom      TEXT NOT NULL,
  porteur_email    TEXT NOT NULL,
  porteur_organisation TEXT,

  -- Workflow
  statut           TEXT NOT NULL DEFAULT 'EN_ATTENTE'
                     CHECK (statut IN ('EN_ATTENTE', 'RETENU', 'REJETE')),

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour chercher les proposals d'un besoin
CREATE INDEX IF NOT EXISTS idx_ie_proposals_need_id
  ON ie_proposals (need_id);

CREATE INDEX IF NOT EXISTS idx_ie_proposals_porteur_email
  ON ie_proposals (porteur_email);

CREATE INDEX IF NOT EXISTS idx_ie_proposals_statut
  ON ie_proposals (statut);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_ie_proposals_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ie_proposals_updated_at ON ie_proposals;
CREATE TRIGGER trg_ie_proposals_updated_at
  BEFORE UPDATE ON ie_proposals
  FOR EACH ROW EXECUTE FUNCTION update_ie_proposals_updated_at();

-- Vue: nb de proposals par besoin
CREATE OR REPLACE VIEW ie_proposal_counts AS
SELECT
  need_id,
  COUNT(*) FILTER (WHERE statut = 'EN_ATTENTE') AS en_attente,
  COUNT(*) FILTER (WHERE statut = 'RETENU')     AS retenu,
  COUNT(*) FILTER (WHERE statut = 'REJETE')     AS rejete,
  COUNT(*)                                       AS total
FROM ie_proposals
GROUP BY need_id;
