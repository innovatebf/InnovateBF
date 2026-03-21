-- ============================================================================
-- InnovonsEnsembleLeFaso — Migration 004 : Moderation admin
-- Ajoute la table de commentaires de moderation, les politiques RLS associees
-- et une vue pour la file de moderation.
-- ============================================================================

-- ── Etendre les statuts de besoins pour la moderation ────────────────────────
-- Le schema initial n'inclut que BROUILLON, VALIDATION, PUBLIE, ARCHIVE.
-- On ajoute REJETE et REVISION_DEMANDEE pour le workflow de moderation.
ALTER TABLE public.ie_needs DROP CONSTRAINT IF EXISTS ie_needs_statut_check;
ALTER TABLE public.ie_needs ADD CONSTRAINT ie_needs_statut_check
  CHECK (statut IN ('BROUILLON', 'VALIDATION', 'PUBLIE', 'ARCHIVE', 'REJETE', 'REVISION_DEMANDEE'));

-- ── Table pour les commentaires de moderation ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.ie_moderation_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES public.ie_needs(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.ie_profiles(id),
  action TEXT NOT NULL CHECK (action IN ('APPROVED', 'REJECTED', 'REVISION_REQUESTED')),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches par need
CREATE INDEX idx_moderation_need ON public.ie_moderation_comments(need_id);

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.ie_moderation_comments ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent creer des commentaires de moderation
CREATE POLICY "Admins can insert moderation comments" ON public.ie_moderation_comments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ie_profiles WHERE id = auth.uid() AND role = 'ADMINISTRATEUR')
  );

-- Les admins peuvent tout lire
CREATE POLICY "Admins can read moderation comments" ON public.ie_moderation_comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ie_profiles WHERE id = auth.uid() AND role = 'ADMINISTRATEUR')
  );

-- Les auteurs des besoins peuvent lire les commentaires les concernant
CREATE POLICY "Need authors can read their moderation comments" ON public.ie_moderation_comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ie_needs WHERE id = need_id AND auteur_id = auth.uid())
  );

-- ── Vue pour la file de moderation (besoins en attente) ─────────────────────
CREATE OR REPLACE VIEW public.ie_moderation_queue AS
SELECT
  n.id,
  n.slug,
  n.titre,
  n.domaine,
  n.niveau,
  n.statut,
  n.created_at,
  n.updated_at,
  p.full_name AS author_name,
  p.email AS author_email,
  COUNT(mc.id) AS moderation_count
FROM public.ie_needs n
JOIN public.ie_profiles p ON n.auteur_id = p.id
LEFT JOIN public.ie_moderation_comments mc ON mc.need_id = n.id
WHERE n.statut IN ('VALIDATION', 'REVISION_DEMANDEE')
GROUP BY n.id, n.slug, n.titre, n.domaine, n.niveau, n.statut, n.created_at, n.updated_at, p.full_name, p.email
ORDER BY n.created_at ASC;
