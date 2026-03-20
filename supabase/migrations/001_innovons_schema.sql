-- ============================================================================
-- InnovonsEnsembleLeFaso — Schema complet
-- Migration 001 : Tables, vues, RLS, triggers
-- ============================================================================

-- ── Table profiles (étend auth.users de Supabase) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.ie_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'UTILISATEUR'
    CHECK (role IN ('UTILISATEUR', 'ADMINISTRATEUR', 'PARRAIN', 'INNOVATEUR')),
  organisation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Table needs (besoins societaux) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ie_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  domaine TEXT NOT NULL,
  secteur TEXT,
  region TEXT,
  pays TEXT DEFAULT 'Burkina Faso',
  niveau TEXT NOT NULL DEFAULT 'NATIONAL'
    CHECK (niveau IN ('LOCAL', 'NATIONAL', 'REGIONAL', 'INTERNATIONAL')),
  statut TEXT NOT NULL DEFAULT 'BROUILLON'
    CHECK (statut IN ('BROUILLON', 'VALIDATION', 'PUBLIE', 'ARCHIVE')),
  tags TEXT[] DEFAULT '{}',
  question_centrale TEXT,
  contexte_strategique TEXT,
  parties_prenantes JSONB DEFAULT '[]',
  perimetre_inclus JSONB DEFAULT '[]',
  perimetre_exclus JSONB DEFAULT '[]',
  obstacles JSONB DEFAULT '[]',
  resultats JSONB DEFAULT '[]',
  indicateurs JSONB DEFAULT '[]',
  synthese_narrative TEXT,
  solutions_emergentes JSONB DEFAULT '[]',
  coherence_interne JSONB DEFAULT '{}',
  population_impact BIGINT DEFAULT 0,
  budget BIGINT DEFAULT 0,
  auteur_id UUID REFERENCES public.ie_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ── Table proposals (propositions de solutions) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.ie_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES public.ie_needs(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT,
  porteur TEXT NOT NULL,
  organisation TEXT,
  statut TEXT NOT NULL DEFAULT 'EN_ATTENTE'
    CHECK (statut IN ('EN_ATTENTE', 'RETENU', 'REJETE')),
  auteur_id UUID REFERENCES public.ie_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Table calls (appels a solutionnement) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ie_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES public.ie_needs(id),
  titre TEXT NOT NULL,
  description TEXT,
  domaine TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  statut TEXT NOT NULL DEFAULT 'OUVERT'
    CHECK (statut IN ('OUVERT', 'FERME', 'SELECTIONNE')),
  budget_alloue BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Vue agreee pour les stats KI ─────────────────────────────────────────
CREATE OR REPLACE VIEW public.ie_stats AS
SELECT
  (SELECT COUNT(*) FROM public.ie_needs WHERE statut = 'PUBLIE') AS needs_count,
  (SELECT COUNT(*) FROM public.ie_proposals) AS proposals_count,
  (SELECT COUNT(*) FROM public.ie_profiles WHERE role = 'PARRAIN') AS parrains_count,
  (SELECT COALESCE(SUM(population_impact), 0) FROM public.ie_needs WHERE statut = 'PUBLIE') AS population_impact,
  (SELECT COALESCE(SUM(budget), 0) FROM public.ie_needs WHERE statut = 'PUBLIE') AS budget_mobilise;

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

ALTER TABLE public.ie_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ie_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ie_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ie_calls ENABLE ROW LEVEL SECURITY;

-- ── Policies ie_needs ─────────────────────────────────────────────────────

-- Lecture publique des besoins PUBLIE (visiteurs anonymes)
CREATE POLICY "Public can read published needs" ON public.ie_needs
  FOR SELECT USING (statut = 'PUBLIE');

-- Authentifie peut lire tous les besoins PUBLIE
CREATE POLICY "Authenticated can read published" ON public.ie_needs
  FOR SELECT TO authenticated USING (statut = 'PUBLIE');

-- Admin peut tout faire sur ie_needs
CREATE POLICY "Admin full access needs" ON public.ie_needs
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ie_profiles
      WHERE id = auth.uid() AND role = 'ADMINISTRATEUR'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ie_profiles
      WHERE id = auth.uid() AND role = 'ADMINISTRATEUR'
    )
  );

-- ── Policies ie_proposals ─────────────────────────────────────────────────

-- Authentifie peut lire les proposals
CREATE POLICY "Authenticated can read proposals" ON public.ie_proposals
  FOR SELECT TO authenticated USING (true);

-- Auteur peut creer une proposal
CREATE POLICY "Authenticated can insert own proposals" ON public.ie_proposals
  FOR INSERT TO authenticated
  WITH CHECK (auteur_id = auth.uid());

-- ── Policies ie_profiles ──────────────────────────────────────────────────

-- Utilisateur peut lire son propre profil
CREATE POLICY "User can read own profile" ON public.ie_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

-- Utilisateur peut modifier son propre profil
CREATE POLICY "User can update own profile" ON public.ie_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- Service role peut inserer (pour le trigger handle_new_user)
CREATE POLICY "Service can insert profiles" ON public.ie_profiles
  FOR INSERT WITH CHECK (true);

-- ── Policies ie_calls ─────────────────────────────────────────────────────

-- Lecture publique des appels OUVERT
CREATE POLICY "Public can read open calls" ON public.ie_calls
  FOR SELECT USING (statut = 'OUVERT');

-- ============================================================================
-- Triggers
-- ============================================================================

-- Trigger updated_at automatique
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ie_needs_updated_at
  BEFORE UPDATE ON public.ie_needs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER ie_proposals_updated_at
  BEFORE UPDATE ON public.ie_proposals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER ie_profiles_updated_at
  BEFORE UPDATE ON public.ie_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger creation profil apres inscription Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ie_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'UTILISATEUR')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
