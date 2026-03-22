-- ============================================================
-- Migration 008: Corrections de schéma Neon (ie_needs)
-- Ajout des colonnes manquantes détectées lors des tests QA
-- ============================================================

-- Ajouter colonne slug (utilisée pour les URLs SEO)
ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE INDEX IF NOT EXISTS idx_ie_needs_slug ON ie_needs (slug);

-- Ajouter colonnes optionnelles manquantes
ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS population_impact INTEGER DEFAULT 0;
ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS budget NUMERIC(15, 2) DEFAULT 0;
ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
