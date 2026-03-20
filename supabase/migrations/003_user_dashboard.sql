-- Sprint 5: Vue pour le dashboard utilisateur
-- Ajoute des colonnes manquantes si nécessaires

-- Vue pour les stats par utilisateur
CREATE OR REPLACE VIEW ie_user_stats AS
SELECT
  p.id as user_id,
  p.full_name,
  p.role,
  COUNT(DISTINCT n.id) as needs_count,
  COUNT(DISTINCT pr.id) as proposals_count
FROM ie_profiles p
LEFT JOIN ie_needs n ON n.auteur_id = p.id
LEFT JOIN ie_proposals pr ON pr.auteur_id = p.id
GROUP BY p.id, p.full_name, p.role;

-- Politique: chaque user voit ses propres stats
-- (déjà géré par RLS sur ie_needs et ie_proposals)
