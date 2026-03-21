# DB-PRD — InnovonsEnsembleLeFaso
## Spécification des exigences base de données

**Version** : 1.0.0
**Date** : 2026-03-21
**Projet** : InnovateBF — Module InnovonsEnsembleLeFaso
**Moteur** : PostgreSQL (Neon — pooler serverless)
**ORM / Client** : `@neondatabase/serverless` (requêtes directes) + Supabase Auth (Auth uniquement)
**Connexion** : `DATABASE_URL` via pooler Neon (`ep-shy-forest-ako4k7fy-pooler.c-3.us-west-2.aws.neon.tech`)

---

## 1. Architecture globale

```
┌─────────────────────────────────────────────────┐
│              Neon PostgreSQL                     │
│                                                 │
│  ie_profiles ──────────────────────────────┐   │
│  ie_needs ──────────────── ie_proposals    │   │
│       └── ie_calls                         │   │
│       └── ie_moderation_comments           │   │
│                                            │   │
│  Vues : ie_stats · ie_user_stats           │   │
│          ie_moderation_queue               │   │
└─────────────────────────────────────────────────┘
          ▲
          │ @neondatabase/serverless (lib/db/neon.ts)
          │
┌─────────────────────────────────────────────────┐
│          Next.js API Routes                     │
│  POST /api/innovons/besoins                     │
│  POST /api/innovons/admin/moderate              │
│  GET  /api/innovons/stats                       │
└─────────────────────────────────────────────────┘
```

**Stratégie de fallback** : toutes les fonctions de lecture (`queries.ts`, `user-queries.ts`, `admin-queries.ts`) vérifient si `NEXT_PUBLIC_SUPABASE_URL` et `DATABASE_URL` sont configurés. Si non, elles retournent des données mock pour le développement local sans base de données.

---

## 2. Tables

### 2.1 `ie_profiles` — Profils utilisateurs

Étend les utilisateurs créés par Supabase Auth. Créée automatiquement par trigger lors de l'inscription.

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | `UUID` | PK, FK → `auth.users(id)` CASCADE | Identifiant Supabase Auth |
| `email` | `TEXT` | NOT NULL | Email de l'utilisateur |
| `full_name` | `TEXT` | — | Nom complet |
| `role` | `TEXT` | NOT NULL, DEFAULT `'UTILISATEUR'` | Rôle applicatif |
| `organisation` | `TEXT` | — | Organisation de rattachement |
| `bio` | `TEXT` | — | Biographie (max 300 chars côté UI) |
| `avatar_url` | `TEXT` | — | URL avatar (Cloudinary / S3) |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Date de création |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Mis à jour par trigger |

**Enum `role`** : `UTILISATEUR` · `ADMINISTRATEUR` · `PARRAIN` · `INNOVATEUR`

**RLS** :
- `SELECT` → utilisateur voit son propre profil (`id = auth.uid()`)
- `UPDATE` → utilisateur modifie son propre profil
- `INSERT` → service role uniquement (via trigger `handle_new_user`)

**Trigger** : `on_auth_user_created` — insère automatiquement une ligne dans `ie_profiles` à chaque nouvel utilisateur Supabase Auth, en lisant `full_name` et `role` depuis `raw_user_meta_data`.

---

### 2.2 `ie_needs` — Besoins sociétaux (table principale)

Table centrale du module. Chaque ligne représente un besoin sociétal structuré selon la méthodologie MDP en 8 étapes.

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | `UUID` | PK, DEFAULT `gen_random_uuid()` | Identifiant unique |
| `slug` | `TEXT` | UNIQUE (version Supabase) | URL-friendly identifier |
| `titre` | `TEXT` | NOT NULL | Titre court du besoin |
| `domaine` | `TEXT` | NOT NULL (Supabase) / nullable (Neon) | Domaine thématique |
| `secteur` | `TEXT` | — | Sous-secteur |
| `pays` | `TEXT` | DEFAULT `'Burkina Faso'` | Pays concerné |
| `niveau` | `TEXT` | CHECK enum | Échelle géographique |
| `region` | `TEXT` | — | Région (si niveau LOCAL/REGIONAL) |
| `contexte_strategique` | `TEXT` | — | Contexte (100-150 mots — règle MDP R2) |
| `question_centrale` | `TEXT` | — | Question MDP (6 tests — règle MDP R3) |
| `perimetre_inclus` | `JSONB` | DEFAULT `'[]'` | Tableau d'axes inclus dans le périmètre |
| `perimetre_exclus` | `JSONB` | DEFAULT `'[]'` | Tableau d'éléments exclus |
| `parties_prenantes` | `JSONB` | DEFAULT `'[]'` | Tableau `PartiesPrenantes[]` |
| `obstacles` | `JSONB` | DEFAULT `'[]'` | Tableau `Obstacle[]` (règle MDP R5) |
| `resultats` | `JSONB` | DEFAULT `'[]'` | Tableau `Resultat[]` |
| `indicateurs` | `JSONB` | DEFAULT `'[]'` | Tableau `Indicateur[]` |
| `synthese_narrative` | `TEXT` | — | Synthèse libre |
| `coherence_score` | `INTEGER` | DEFAULT `0` | Score C1-C7 (0-7), publication si ≥ 5 |
| `statut` | `TEXT` | CHECK enum | État dans le workflow |
| `tags` | `TEXT[]` | DEFAULT `'{}'` | Mots-clés (version Supabase) |
| `solutions_emergentes` | `JSONB` | DEFAULT `'[]'` | Solutions identifiées (v. Supabase) |
| `coherence_interne` | `JSONB` | DEFAULT `'{}'` | Grille C1-C7 sérialisée |
| `population_impact` | `BIGINT` | DEFAULT `0` | Personnes impactées |
| `budget` | `BIGINT` | DEFAULT `0` | Budget mobilisé (FCFA) |
| `auteur_id` | `UUID` | FK → `ie_profiles(id)` | Auteur du besoin |
| `auteur_email` | `TEXT` | — | Email auteur (dénormalisé, Neon) |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Date de soumission |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Mis à jour par trigger |
| `published_at` | `TIMESTAMPTZ` | — | Date de publication |

**Enum `niveau`** : `LOCAL` · `NATIONAL` · `REGIONAL` · `INTERNATIONAL` · `COMMUNAL`

**Enum `statut`** (workflow complet) :

```
BROUILLON → VALIDATION → PUBLIE
                ↓              ↓
         REVISION_DEMANDEE   ARCHIVE
                ↓
             REJETE
```

| Statut | Description |
|--------|-------------|
| `BROUILLON` | Sauvegarde intermédiaire (non soumis) |
| `VALIDATION` | Soumis, en attente de modération |
| `REVISION_DEMANDEE` | Admin demande des corrections |
| `PUBLIE` | Approuvé, visible publiquement |
| `REJETE` | Refusé définitivement |
| `ARCHIVE` | Archivé (obsolète ou traité) |

**Index** : `statut`, `domaine`, `created_at DESC`, `auteur_id`

**RLS** :
- `SELECT` public → besoins avec `statut = 'PUBLIE'` uniquement
- `INSERT` → utilisateurs authentifiés (leur propre `auteur_id`)
- `UPDATE/DELETE` → administrateurs uniquement

---

### 2.3 `ie_proposals` — Propositions de solutions

Proposition de solution associée à un besoin par un innovateur.

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | `UUID` | PK | Identifiant |
| `need_id` | `UUID` | NOT NULL, FK → `ie_needs(id)` CASCADE | Besoin cible |
| `titre` | `TEXT` | NOT NULL | Titre de la proposition |
| `description` | `TEXT` | — | Description détaillée |
| `porteur` | `TEXT` | NOT NULL | Nom du porteur |
| `organisation` | `TEXT` | — | Organisation du porteur |
| `statut` | `TEXT` | CHECK enum | État de la proposition |
| `auteur_id` | `UUID` | FK → `ie_profiles(id)` | Auteur |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Date de soumission |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Mis à jour par trigger |

**Enum `statut`** : `EN_ATTENTE` · `RETENU` · `REJETE`

**RLS** :
- `SELECT` → utilisateurs authentifiés (toutes les propositions)
- `INSERT` → authentifié, avec `auteur_id = auth.uid()`

---

### 2.4 `ie_calls` — Appels à solutionnement

Appel formel à propositions lié à un besoin publié.

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | `UUID` | PK | Identifiant |
| `need_id` | `UUID` | NOT NULL, FK → `ie_needs(id)` | Besoin associé |
| `titre` | `TEXT` | NOT NULL | Titre de l'appel |
| `description` | `TEXT` | — | Description et critères |
| `domaine` | `TEXT` | — | Domaine (dénormalisé pour filtres) |
| `deadline` | `TIMESTAMPTZ` | NOT NULL | Date limite de soumission |
| `statut` | `TEXT` | CHECK enum | État de l'appel |
| `budget_alloue` | `BIGINT` | DEFAULT `0` | Budget alloué (FCFA) |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Date de création |

**Enum `statut`** : `OUVERT` · `FERME` · `SELECTIONNE`

**RLS** :
- `SELECT` public → appels avec `statut = 'OUVERT'`

---

### 2.5 `ie_moderation_comments` — Historique de modération

Trace toutes les décisions de modération admin sur les besoins.

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | `UUID` | PK | Identifiant |
| `need_id` | `UUID` | NOT NULL, FK → `ie_needs(id)` CASCADE | Besoin concerné |
| `admin_id` | `UUID` | NOT NULL, FK → `ie_profiles(id)` | Admin qui décide |
| `action` | `TEXT` | CHECK enum | Décision prise |
| `comment` | `TEXT` | NOT NULL, min 20 chars (UI) | Commentaire justificatif |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Date de la décision |

**Enum `action`** : `APPROVED` · `REJECTED` · `REVISION_REQUESTED`

**Index** : `need_id`

**RLS** :
- `INSERT` → admins uniquement (`role = 'ADMINISTRATEUR'`)
- `SELECT` → admins (toutes) + auteurs du besoin concerné

---

## 3. Vues

### 3.1 `ie_stats` — KPIs de la landing page

Aggrège les 5 métriques affichées sur la landing page IE. Cache de 5 minutes via `revalidate = 300` (API route).

```sql
SELECT
  COUNT(*) FILTER (WHERE statut = 'PUBLIE')   AS needs_count,
  COUNT(*) FROM ie_proposals                   AS proposals_count,
  COUNT(*) FILTER (WHERE role = 'PARRAIN')     AS parrains_count,
  SUM(population_impact) FILTER (PUBLIE)       AS population_impact,
  SUM(budget) FILTER (PUBLIE)                  AS budget_mobilise
```

**Consommée par** : `GET /api/innovons/stats` → `StatsGrid` (Server Component avec Suspense)

---

### 3.2 `ie_user_stats` — Stats par utilisateur (espace perso)

```sql
SELECT
  p.id, p.full_name, p.role,
  COUNT(DISTINCT n.id)  AS needs_count,
  COUNT(DISTINCT pr.id) AS proposals_count
FROM ie_profiles p
LEFT JOIN ie_needs n ON n.auteur_id = p.id
LEFT JOIN ie_proposals pr ON pr.auteur_id = p.id
GROUP BY p.id, p.full_name, p.role
```

**Consommée par** : `/innovons/mon-espace` dashboard

---

### 3.3 `ie_moderation_queue` — File de modération admin

```sql
SELECT n.*, p.full_name AS author_name, p.email AS author_email,
       COUNT(mc.id) AS moderation_count
FROM ie_needs n
JOIN ie_profiles p ON n.auteur_id = p.id
LEFT JOIN ie_moderation_comments mc ON mc.need_id = n.id
WHERE n.statut IN ('VALIDATION', 'REVISION_DEMANDEE')
ORDER BY n.created_at ASC
```

**Consommée par** : `/innovons/admin/moderation`

---

## 4. Triggers

| Trigger | Table | Événement | Fonction | Description |
|---------|-------|-----------|----------|-------------|
| `ie_needs_updated_at` | `ie_needs` | `BEFORE UPDATE` | `handle_updated_at()` | Maintient `updated_at` à jour |
| `ie_proposals_updated_at` | `ie_proposals` | `BEFORE UPDATE` | `handle_updated_at()` | Maintient `updated_at` à jour |
| `ie_profiles_updated_at` | `ie_profiles` | `BEFORE UPDATE` | `handle_updated_at()` | Maintient `updated_at` à jour |
| `on_auth_user_created` | `auth.users` | `AFTER INSERT` | `handle_new_user()` | Crée le profil IE automatiquement |

---

## 5. Types JSONB — Structures attendues

### `obstacles` (tableau de `Obstacle`)
```json
[{
  "id": "string",
  "intitule": "string",
  "nature": "INFRASTRUCTURE | CAPITAL_HUMAIN | FINANCEMENT | REGLEMENTATION | MARCHE | CONTEXTUEL",
  "description": "string",
  "criticite": 1 | 2 | 3,
  "controlabilite": "TOTALE | PARTIELLE | NULLE"
}]
```

### `resultats` (tableau de `Resultat`)
```json
[{
  "id": "string",
  "intitule": "string",
  "niveau": "OUTPUT | OUTCOME | IMPACT",
  "quantification": "string",
  "horizon": "COURT | MOYEN | LONG"
}]
```

### `indicateurs` (tableau de `Indicateur`)
```json
[{
  "id": "string",
  "intitule": "string",
  "type": "PROCESSUS | RESULTAT | CONTEXTE",
  "resultat_associe": "string (id du résultat lié)",
  "source": "string",
  "baseline": "string",
  "frequence": "string"
}]
```

### `parties_prenantes` (tableau de `PartiesPrenantes`)
```json
[{
  "id": "string",
  "categorie": "Initiateur | Financeur | Beneficiaire | Partie impactee | Regulateur | Expert",
  "acteur": "string",
  "role": "string",
  "position": "Actif | Neutre | Oppose"
}]
```

### `perimetre_inclus` / `perimetre_exclus`
```json
[{
  "axe": "string",         // inclus : axe thématique
  "justification": "string"
}]
// ou
[{
  "element": "string",     // exclus : élément hors périmètre
  "raison": "string"
}]
```

---

## 6. API Routes (accès données)

| Route | Méthode | Auth | Description | DB |
|-------|---------|------|-------------|-----|
| `/api/innovons/stats` | GET | Public | KPIs landing page (cache 5 min) | Vue `ie_stats` |
| `/api/innovons/besoins` | POST | Optionnelle | Soumettre un besoin (form MDP) | `ie_needs` INSERT |
| `/api/innovons/admin/moderate` | POST | ADMINISTRATEUR | Décision de modération | `ie_needs` UPDATE + `ie_moderation_comments` INSERT + email |

---

## 7. Migrations — Ordre d'exécution

| # | Fichier | Contenu |
|---|---------|---------|
| 001 | `001_innovons_schema.sql` | Création tables, vue `ie_stats`, RLS, triggers (Supabase Auth) |
| 002 | `002_innovons_seed.sql` | Données de test : 12 besoins, 5 profils, 8 appels |
| 003 | `003_user_dashboard.sql` | Vue `ie_user_stats` |
| 004 | `004_admin_moderation.sql` | Table `ie_moderation_comments`, vue `ie_moderation_queue`, extension contrainte `statut` |
| **005** | **`005_needs_table_neon.sql`** | **Table `ie_needs` standalone Neon (sans Supabase Auth)** |

> **Note** : La migration 005 crée `ie_needs` sans la clé étrangère vers `auth.users` (non disponible sur Neon standalone). Les migrations 001-004 sont prévues pour Supabase (avec `auth.users`).

---

## 8. Variables d'environnement requises

| Variable | Obligatoire | Description |
|----------|------------|-------------|
| `DATABASE_URL` | ✅ Production | URL Neon avec pooler (`?sslmode=require&channel_binding=require`) |
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Auth | URL projet Supabase (pour Auth uniquement) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Auth | Clé anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Admin | Clé service Supabase (opérations admin) |
| `RESEND_API_KEY` | ⚠️ Email | Notifications email modération |

En l'absence de `DATABASE_URL`, l'API route retourne `{ mock: true }` et log la soumission en console.

---

## 9. Règles métier (enforced DB + UI)

| Règle | Niveau | Description |
|-------|--------|-------------|
| MDP-R1 | UI | Détection des termes prescriptifs dans `contexte_strategique` |
| MDP-R2 | UI | Compteur mots `contexte_strategique` : 100-150 mots |
| MDP-R3 | UI | 6 tests de qualité sur `question_centrale` (ouverture, neutralité, pertinence, délimitation, actionnabilité, unicité) |
| MDP-R4 | UI | Grille C1-C7 (cohérence interne), score /7 |
| MDP-R5 | UI | Obstacles = problèmes réels, pas solutions |
| **Pub-R1** | **DB + UI** | `coherence_score >= 5` obligatoire pour soumettre (bouton Publier désactivé sinon) |
| **Pub-R2** | **DB** | Soumission → `statut = 'VALIDATION'` (jamais `PUBLIE` directement) |
| **Mod-R1** | **DB** | Commentaire modération ≥ 20 caractères |
| **Mod-R2** | **DB + RLS** | Seul un `ADMINISTRATEUR` peut changer le statut d'un besoin |

---

## 10. Roadmap base de données

### Sprint 7 — Forum & votes
- [ ] Table `ie_votes` : `(user_id, need_id, value SMALLINT CHECK(value IN (-1,1)))`
- [ ] Table `ie_comments` : commentaires threadés par besoin
- [ ] Vue `ie_needs_ranked` : besoins triés par score de votes

### Sprint 8 — Observatoire
- [ ] Table `ie_watch_items` : articles de veille technologique
- [ ] Table `ie_events` : événements du calendrier
- [ ] Vue `ie_calendar_export` : format iCal-compatible

### Optimisations futures
- [ ] Full-text search avec `tsvector` sur `titre`, `question_centrale`, `contexte_strategique`
- [ ] Index GIN sur colonnes JSONB (`obstacles`, `tags`)
- [ ] Partitionnement de `ie_needs` par `statut` si volume > 10k lignes
- [ ] Audit log table pour traçabilité complète des mutations admin
