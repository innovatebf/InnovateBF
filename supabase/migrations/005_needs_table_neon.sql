-- Migration 005: Table ie_needs pour le formulaire MDP (NeedStepper)
-- Compatible Neon PostgreSQL

CREATE TABLE IF NOT EXISTS ie_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  domaine TEXT,
  secteur TEXT,
  pays TEXT DEFAULT 'Burkina Faso',
  niveau TEXT,  -- NATIONAL / REGIONAL / LOCAL / COMMUNAL
  region TEXT,
  contexte_strategique TEXT,
  question_centrale TEXT,
  perimetre_inclus JSONB DEFAULT '[]',
  perimetre_exclus JSONB DEFAULT '[]',
  parties_prenantes JSONB DEFAULT '[]',
  obstacles JSONB DEFAULT '[]',
  resultats JSONB DEFAULT '[]',
  indicateurs JSONB DEFAULT '[]',
  synthese_narrative TEXT,
  coherence_score INTEGER DEFAULT 0,
  statut TEXT DEFAULT 'VALIDATION',
  auteur_id UUID,
  auteur_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les requetes frequentes
CREATE INDEX IF NOT EXISTS idx_ie_needs_statut ON ie_needs (statut);
CREATE INDEX IF NOT EXISTS idx_ie_needs_domaine ON ie_needs (domaine);
CREATE INDEX IF NOT EXISTS idx_ie_needs_created_at ON ie_needs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ie_needs_auteur_id ON ie_needs (auteur_id);
