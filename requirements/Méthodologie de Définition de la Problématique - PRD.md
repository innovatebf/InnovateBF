# Product Requirements Document
## Plateforme FDP — Bibliothèque des Fiches de Définition de la Problématique
**Version 1.0 | Mars 2026 | Statut : Draft pour validation**

---

## Sommaire Exécutif

**Objet.** Ce document définit l'ensemble des exigences produit de la Plateforme FDP, application web permettant la saisie structurée, la gestion et la consultation publique des Fiches de Définition de la Problématique (FDP) produites selon la Méthodologie MDP v1.0.

**Problème adressé.** Les fiches FDP produites manuellement sont dispersées, non consultables de manière structurée, non filtrables selon les dimensions analytiques qui les constituent, et inaccessibles à distance aux parties prenantes concernées. L'absence d'une plateforme centralisée empêche la capitalisation, la réutilisation et la mise en valeur du corpus produit.

**Solution.** Une application web à deux espaces distincts : un espace d'administration sécurisé pour la saisie guidée et la gestion du cycle de vie des fiches, et un espace utilisateur authentifié pour la navigation, la recherche et la consultation des fiches publiées.

**Périmètre de la V1.** Phase problème exclusivement — saisie, gestion et consultation des FDP. La phase solution (conception, priorisation, suivi des interventions) est explicitement hors périmètre de la V1.

**Contraintes structurantes.** Déploiement Netlify Free, backend Supabase Free tier, authentification obligatoire pour tout accès, accès immédiat après inscription, promotion admin manuelle.

**Indicateurs de succès V1.** Dix fiches publiées dans les 60 premiers jours, vingt utilisateurs inscrits, zéro erreur de sécurité (accès non autorisé à des fiches non publiées ou à l'administration).

---

## 1. Contexte Produit

### 1.1 Origine et justification

La Méthodologie de Définition de la Problématique (MDP v1.0) est un protocole analytique structuré en quatre phases produisant comme livrable central une Fiche de Définition de la Problématique (FDP). Cette fiche comprend sept dimensions interdépendantes organisées autour d'une question centrale, et constitue le document de référence partagé entre toutes les parties prenantes d'un problème stratégique avant toute phase de conception de solution.

La valeur de ce corpus de fiches est proportionnelle à sa consultabilité, sa structuration et sa disponibilité. Un corpus de fiches non numérisées ou stockées dans des formats non interrogeables ne remplit pas sa fonction de capitalisation analytique et ne peut pas servir de base comparative pour des problèmes similaires dans des contextes différents.

### 1.2 Positionnement produit

La Plateforme FDP n'est pas un outil de gestion de projet, un wiki, un système de knowledge management générique ou une plateforme de publication de rapports. Elle est spécifiquement conçue pour la structure analytique de la FDP et intègre les règles métier de la MDP comme contraintes de validation, non comme options.

| Ce que la plateforme est | Ce que la plateforme n'est pas |
|---|---|
| Outil de saisie guidée selon la méthodologie MDP | Éditeur de texte générique |
| Bibliothèque structurée de problèmes analysés | Plateforme de publication de solutions |
| Moteur de recherche et filtrage multi-dimensionnel | Outil de reporting ou de tableau de bord analytique |
| Système de gestion du cycle de vie des fiches | Outil de gestion de projet ou de suivi d'interventions |
| Garant de la discipline méthodologique MDP | Outil collaboratif temps réel |

### 1.3 Hypothèses de travail

| Hypothèse | Statut | Impact si invalide |
|---|---|---|
| Les utilisateurs ont une connaissance de base de la méthodologie MDP | Supposée | Interface plus explicative nécessaire, vidéos de formation à ajouter |
| Le volume de fiches en V1 reste inférieur à 200 | Supposée | Optimisation des requêtes de filtrage à anticiper |
| Les utilisateurs accèdent principalement depuis un poste de travail | Supposée | Refonte du layout mobile à prioriser |
| Supabase Free tier suffit pour les 12 premiers mois | Vérifiée | Migration vers plan payant à anticiper si > 500 MB ou 50k requêtes/mois |

---

## 2. Utilisateurs et Cas d'Usage

### 2.1 Personas

#### Persona 1 — L'Utilisateur lecteur

| Attribut | Description |
|---|---|
| Profil | Chercheur, décideur, praticien du développement, partenaire institutionnel |
| Motivation principale | Consulter des analyses de problèmes dans son domaine ou sa zone géographique, identifier des problèmes comparables à celui qu'il traite |
| Niveau technique | Faible à moyen |
| Fréquence d'utilisation | Épisodique (1 à 4 fois par mois) |
| Besoin critique | Trouver rapidement les fiches pertinentes par domaine, pays, criticité des obstacles ou horizon des résultats |
| Point de friction anticipé | S'inscrire avant de pouvoir consulter — friction à minimiser par un formulaire d'inscription court et un accès immédiat |

#### Persona 2 — L'Administrateur auteur

| Attribut | Description |
|---|---|
| Profil | Analyste, consultant, facilitateur formé à la méthodologie MDP |
| Motivation principale | Saisir, structurer et publier des fiches en respectant les règles métier MDP |
| Niveau technique | Moyen à élevé |
| Fréquence d'utilisation | Régulière (plusieurs fois par semaine en phase active) |
| Besoin critique | Formulaire guidé qui l'empêche de faire des erreurs méthodologiques, sauvegarde automatique, workflow de statuts clair |
| Point de friction anticipé | Saisie des obstacles et indicateurs en JSONB — nécessite une interface de formulaire suffisamment intuitive |

#### Persona 3 — L'Administrateur gestionnaire

| Attribut | Description |
|---|---|
| Profil | Responsable de la plateforme, coordinateur de programme |
| Motivation principale | Gérer les accès utilisateurs, superviser l'état du corpus, valider les fiches avant publication |
| Niveau technique | Faible à moyen |
| Fréquence d'utilisation | Hebdomadaire |
| Besoin critique | Vue d'ensemble du corpus par statut, promotion de rôles simplifiée, workflow de validation sans friction |
| Point de friction anticipé | Absence de notifications — doit consulter le tableau de bord activement |

### 2.2 Cas d'usage principaux

| ID | Cas d'usage | Persona | Priorité |
|---|---|---|---|
| CU-01 | S'inscrire et obtenir un accès en lecture immédiat | Lecteur | Critique |
| CU-02 | Se connecter et accéder au catalogue | Lecteur, Admin | Critique |
| CU-03 | Naviguer le catalogue avec filtres combinés | Lecteur | Critique |
| CU-04 | Consulter une fiche dans son intégralité | Lecteur | Critique |
| CU-05 | Partager le lien permanent d'une fiche | Lecteur | Haute |
| CU-06 | Exporter une fiche en PDF | Lecteur | Haute |
| CU-07 | Créer une nouvelle fiche via le stepper guidé | Auteur | Critique |
| CU-08 | Sauvegarder une fiche en cours de saisie | Auteur | Critique |
| CU-09 | Passer une fiche du statut Brouillon à Publié | Auteur | Critique |
| CU-10 | Recevoir des alertes métier en temps réel (solutions détectées) | Auteur | Haute |
| CU-11 | Visualiser le score de cohérence interne C1–C7 | Auteur | Haute |
| CU-12 | Gérer les utilisateurs (promotion, consultation) | Gestionnaire | Critique |
| CU-13 | Archiver une fiche publiée | Gestionnaire | Moyenne |
| CU-14 | Réinitialiser les filtres et relancer une recherche | Lecteur | Haute |
| CU-15 | Basculer entre vue grille et vue liste dans le catalogue | Lecteur | Basse |

---

## 3. Exigences Fonctionnelles

### 3.1 Module Authentification

#### EF-AUTH-01 — Inscription
- L'utilisateur fournit un nom complet, une adresse email et un mot de passe (minimum 8 caractères).
- Le compte est créé avec le rôle `UTILISATEUR` par défaut.
- L'accès est accordé immédiatement après la soumission du formulaire, sans étape de validation par email et sans approbation admin.
- Un message de confirmation est affiché et l'utilisateur est redirigé vers `/connexion` après 3 secondes.
- Si l'email est déjà utilisé, un message d'erreur explicite est affiché.

#### EF-AUTH-02 — Connexion
- L'utilisateur fournit email et mot de passe.
- En cas de succès, il est redirigé vers la page qu'il tentait d'accéder (paramètre `from`) ou vers `/catalogue` par défaut.
- En cas d'échec, un message d'erreur générique est affiché (ne pas distinguer email inconnu et mot de passe incorrect pour des raisons de sécurité).
- La session est gérée par Supabase Auth avec token JWT persisté en localStorage.

#### EF-AUTH-03 — Déconnexion
- L'utilisateur peut se déconnecter depuis la barre de navigation.
- La session est invalidée côté Supabase.
- L'utilisateur est redirigé vers `/connexion`.

#### EF-AUTH-04 — Protection des routes
- Toute route autre que `/connexion` et `/inscription` requiert une session active.
- Les routes `/admin/*` requièrent en plus le rôle `ADMINISTRATEUR`.
- Un utilisateur non authentifié est redirigé vers `/connexion` avec conservation de l'URL cible.
- Un utilisateur authentifié sans rôle admin tentant d'accéder à `/admin/*` est redirigé vers `/catalogue` avec un message d'accès refusé.

### 3.2 Module Catalogue (Espace Utilisateur)

#### EF-CAT-01 — Affichage du catalogue
- Le catalogue affiche uniquement les fiches au statut `PUBLIE`.
- Chaque fiche est représentée par une carte affichant : titre, domaine, pays, tags, statut, question centrale (tronquée à 2 lignes), indicateur de criticité maximale des obstacles, date de publication.
- Le catalogue supporte deux modes d'affichage : grille (3 colonnes) et liste.
- L'ordre par défaut est chronologique inversé (plus récent en premier).

#### EF-CAT-02 — Système de filtrage
Les filtres suivants sont disponibles en combinaison (logique AND entre catégories, logique OR au sein d'une catégorie) :

| Filtre | Type | Logique |
|---|---|---|
| Recherche textuelle | Saisie libre | Plein-texte sur titre, question centrale, domaine |
| Domaine | Multi-sélection | OR |
| Pays | Multi-sélection | OR |
| Niveau d'intervention | Multi-sélection | OR |
| Tags (URGENT, COMPLEXE, QUICK-WIN, DONNÉES MANQUANTES) | Cases à cocher | OR |
| Horizon des résultats (COURT, MOYEN, LONG) | Multi-sélection | OR |
| Criticité maximale des obstacles (C1, C2, C3) | Multi-sélection | OR |

- Le nombre de résultats est mis à jour en temps réel à chaque modification d'un filtre.
- Un bouton de réinitialisation globale est disponible dès qu'au moins un filtre est actif.
- Les filtres sont appliqués côté client sur les données déjà chargées (pas de requête supplémentaire à chaque filtre).

#### EF-CAT-03 — Chargement des données
- Au chargement initial, toutes les fiches publiées sont récupérées en une seule requête (colonnes sélectionnées : id, slug, titre, domaine, pays, niveau, statut, tags, question\_centrale, obstacles, resultats, published\_at, updated\_at).
- Si le volume de fiches publiées dépasse 100, une pagination de 50 fiches par page est activée.

### 3.3 Module Fiche Détaillée (Espace Utilisateur)

#### EF-FICHE-01 — Affichage
- La fiche est accessible via son slug unique (`/fiche/:slug`).
- Les sept dimensions sont affichées dans des sections dépliables numérotées.
- La question centrale est mise en valeur dans un bloc distinct au-dessus des sections.
- L'Annexe A (solutions émergentes) est affichée si elle contient des entrées, avec un encadré avertissant de son statut méthodologique.
- Les tableaux (parties prenantes, indicateurs) sont affichés avec défilement horizontal sur mobile.

#### EF-FICHE-02 — URL permanente
- Chaque fiche dispose d'un slug unique généré automatiquement à partir du titre.
- L'URL est stable (le slug ne change pas lors des modifications ultérieures de la fiche).
- L'URL peut être copiée et partagée entre utilisateurs inscrits.

#### EF-FICHE-03 — Export PDF
- Un bouton "Exporter PDF" est disponible sur la fiche détaillée.
- Le PDF généré contient l'intégralité des sept dimensions dans un format imprimable.
- La génération est effectuée côté serveur (Netlify Function).
- En cas d'échec de génération (timeout ou erreur), un message d'erreur explicite est affiché et l'utilisateur est invité à réessayer.

### 3.4 Module Saisie (Espace Administration)

#### EF-FORM-01 — Stepper à 8 étapes
Le formulaire de création et d'édition est organisé en 8 étapes séquentielles :

| Étape | Contenu | Champs critiques |
|---|---|---|
| 1 — Contexte | Métadonnées + contexte stratégique | Titre (requis), contexte (100–150 mots) |
| 2 — Décideurs | Parties prenantes | Catégorie, acteur, rôle, position |
| 3 — Périmètre | Axes inclus et exclusions | Axe (requis pour inclus), motif (requis pour exclus) |
| 4 — Question | Question centrale + 6 tests | Question (requis) |
| 5 — Obstacles | Caractérisation des obstacles | Intitulé, nature, criticité, contrôlabilité (tous requis) |
| 6 — Résultats | Résultats attendus | Intitulé, niveau, horizon (tous requis) |
| 7 — Indicateurs | Mesures de suivi | Intitulé, type, source (requis) |
| 8 — Révision | Grille C1–C7 + synthèse + Annexe A | Synthèse narrative |

- La navigation entre étapes est libre (clic sur un numéro d'étape ou boutons Précédent/Suivant).
- La progression n'est pas bloquée par les validations — des alertes sont affichées mais l'utilisateur peut continuer.
- Exception : l'étape 8 affiche le score de cohérence et indique clairement si la fiche est prête à être publiée.

#### EF-FORM-02 — Sauvegarde
- La fiche est sauvegardée manuellement via le bouton "Sauvegarder".
- Une confirmation visuelle ("Sauvegardé") est affichée pendant 2 secondes après chaque sauvegarde réussie.
- Une nouvelle fiche est créée en base dès la première sauvegarde, avec le statut `BROUILLON`.
- Si la session expire en cours de saisie, les données non sauvegardées sont perdues — un avertissement est affiché si l'utilisateur tente de quitter la page avec des modifications non sauvegardées (événement `beforeunload`).

#### EF-FORM-03 — Validations métier MDP

| Règle | Déclencheur | Comportement |
|---|---|---|
| Détection de termes prescriptifs | Saisie dans le contexte ou la question centrale | Alerte orange listant les termes détectés |
| Compteur de mots contexte | Saisie dans le contexte stratégique | Indicateur en temps réel, rouge si > 150 mots |
| 6 tests question centrale | Saisie de la question | Tableau de tests avec statut ✓/○ par test |
| Grille C1–C7 | Étape 8 — Révision | Score /7 avec détail par vérification |
| Indicateur sans résultat associé | Étape 7 | Avertissement si indicateur sans résultat lié |

#### EF-FORM-04 — Gestion des items JSONB
Pour chaque dimension structurée (parties prenantes, obstacles, résultats, indicateurs, périmètre, solutions émergentes) :
- Bouton d'ajout d'un nouvel item.
- Bouton de suppression par item.
- Formulaire inline par item (pas de modale).
- Pas de limite maximale d'items en V1.

### 3.5 Module Tableau de Bord (Espace Administration)

#### EF-DASH-01 — Vue d'ensemble
- Affichage du nombre de fiches par statut (BROUILLON, VALIDATION, PUBLIE, ARCHIVE) sous forme de compteurs.
- Liste de toutes les fiches avec tri par date de modification décroissante.
- Filtrage de la liste par statut via onglets.

#### EF-DASH-02 — Workflow des statuts
Le workflow suit la séquence : `BROUILLON → VALIDATION → PUBLIE → ARCHIVE`.

| Transition | Action disponible dans le tableau de bord |
|---|---|
| BROUILLON → VALIDATION | Bouton "→ Validation" sur la ligne de la fiche |
| VALIDATION → PUBLIE | Bouton "→ Publier" ; déclenche l'enregistrement de `published_at` |
| PUBLIE → ARCHIVE | Bouton "Archiver" |
| Tout statut | Bouton d'édition (retour au formulaire) |
| Tout statut | Bouton de prévisualisation (vue fiche détaillée) |

- Les fiches archivées ne sont plus visibles dans le catalogue public.
- Il n'existe pas de suppression définitive de fiche en V1.

### 3.6 Module Gestion des Utilisateurs (Espace Administration)

#### EF-USERS-01 — Listing
- Liste de tous les comptes inscrits avec : nom complet, email, rôle, date d'inscription.
- Séparation visuelle entre administrateurs et utilisateurs.
- Compteurs globaux (nombre d'admins, nombre d'utilisateurs).

#### EF-USERS-02 — Promotion et rétrogradation
- Un administrateur peut promouvoir un utilisateur au rôle `ADMINISTRATEUR`.
- Un administrateur peut rétrograder un autre administrateur au rôle `UTILISATEUR`.
- Un administrateur ne peut pas modifier son propre rôle.
- L'opération est immédiate et reflétée dans la liste sans rechargement de page.
- Il n'existe pas de suppression de compte utilisateur en V1.

---

## 4. Exigences Non Fonctionnelles

### 4.1 Performance

| Métrique | Cible | Condition |
|---|---|---|
| Chargement initial du catalogue | < 2 secondes | Réseau standard (10 Mbps), < 100 fiches publiées |
| Application des filtres | < 100 ms | Filtrage côté client |
| Chargement d'une fiche détaillée | < 1,5 seconde | Requête Supabase unique |
| Génération PDF | < 8 secondes | Dans la limite de timeout Netlify Functions (10s) |
| Score Lighthouse Performance | > 80 | Build de production |

### 4.2 Sécurité

| Exigence | Mécanisme |
|---|---|
| Authentification | Supabase Auth — JWT avec expiration configurable |
| Autorisation | Row Level Security (RLS) Supabase — appliquée en base, non bypassable côté client |
| Protection des routes | ProtectedRoute React + vérification rôle côté serveur |
| Données sensibles | Aucune donnée sensible stockée côté client au-delà du token de session |
| HTTPS | Garanti par Netlify (certificat SSL automatique) |
| Clés API | Supabase anon key uniquement côté client (accès limité par RLS) |
| Variables d'environnement | Jamais commitées — fichier `.env` exclu par `.gitignore` |

**Règles RLS critiques :**
- Un utilisateur authentifié avec le rôle `UTILISATEUR` ne peut lire que les fiches au statut `PUBLIE`.
- Un utilisateur authentifié avec le rôle `UTILISATEUR` ne peut pas lire, modifier ou créer des données de type BROUILLON, VALIDATION ou ARCHIVE.
- Seul un `ADMINISTRATEUR` peut écrire dans la table `fdp`.
- La modification de rôle dans la table `profiles` est restreinte aux administrateurs.

### 4.3 Accessibilité

| Exigence | Standard |
|---|---|
| Contraste des couleurs | WCAG AA minimum (ratio 4.5:1 pour le texte courant) |
| Navigation clavier | Tous les éléments interactifs accessibles au clavier |
| Attributs ARIA | Labels sur les boutons icônes, rôles sur les éléments de navigation |
| Textes alternatifs | N/A en V1 (aucune image fonctionnelle) |

### 4.4 Compatibilité navigateurs

| Navigateur | Support |
|---|---|
| Chrome 110+ | Complet |
| Firefox 110+ | Complet |
| Safari 16+ | Complet |
| Edge 110+ | Complet |
| IE 11 | Non supporté |
| Mobile Chrome / Safari | Partiel (responsive, non optimisé) |

### 4.5 Internationalisation

- V1 : Français uniquement, interface et données.
- V2 (hors périmètre) : Architecture i18n à anticiper — utilisation de clés de traduction plutôt que de chaînes de caractères brutes.

---

## 5. Modèle de Données

### 5.1 Entités principales

#### Table `profiles`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| id | UUID | PK, FK → auth.users | Identifiant utilisateur |
| email | TEXT | NOT NULL | Adresse email |
| full\_name | TEXT | | Nom complet |
| role | TEXT | CHECK IN ('UTILISATEUR','ADMINISTRATEUR') | Rôle système |
| created\_at | TIMESTAMPTZ | DEFAULT NOW() | Date d'inscription |
| updated\_at | TIMESTAMPTZ | DEFAULT NOW() | Dernière modification |

#### Table `fdp`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| id | UUID | PK | Identifiant fiche |
| slug | TEXT | UNIQUE | URL permanente générée du titre |
| titre | TEXT | NOT NULL | Titre de la problématique |
| domaine | TEXT | | Domaine d'application |
| pays | TEXT | | Pays |
| region | TEXT | | Région |
| niveau | TEXT | CHECK | LOCAL / NATIONAL / REGIONAL / INTERNATIONAL |
| secteur | TEXT | | Secteur |
| version | TEXT | DEFAULT '1.0' | Version de la fiche |
| statut | TEXT | CHECK | BROUILLON / VALIDATION / PUBLIE / ARCHIVE |
| tags | TEXT[] | DEFAULT '{}' | Tags libres et système |
| contexte\_strategique | TEXT | | Dimension 1 |
| parties\_prenantes | JSONB | DEFAULT '[]' | Dimension 2 — tableau d'objets |
| perimetre\_inclus | JSONB | DEFAULT '[]' | Dimension 3a |
| perimetre\_exclus | JSONB | DEFAULT '[]' | Dimension 3b |
| question\_centrale | TEXT | | Dimension 4 |
| question\_versions | JSONB | DEFAULT '[]' | Historique des versions de la question |
| obstacles | JSONB | DEFAULT '[]' | Dimension 5 — tableau d'objets |
| resultats | JSONB | DEFAULT '[]' | Dimension 6 — tableau d'objets |
| indicateurs | JSONB | DEFAULT '[]' | Dimension 7 — tableau d'objets |
| synthese\_narrative | TEXT | | Synthèse 3 paragraphes |
| solutions\_emergentes | JSONB | DEFAULT '[]' | Annexe A |
| coherence\_interne | JSONB | DEFAULT '{}' | Résultats vérifications C1–C7 |
| auteur\_id | UUID | FK → profiles | Auteur de la fiche |
| created\_at | TIMESTAMPTZ | DEFAULT NOW() | Création |
| updated\_at | TIMESTAMPTZ | AUTO-UPDATE | Dernière modification |
| published\_at | TIMESTAMPTZ | | Date de publication |

### 5.2 Structures JSONB

#### parties\_prenantes (array)
```
[{
  categorie:   string,  // Initiateur / Financeur / Bénéficiaire / Partie impactée / Régulateur / Expert
  acteur:      string,
  role:        string,
  position:    string   // Actif / Neutre / Opposé / description libre
}]
```

#### obstacles (array)
```
[{
  intitule:        string,
  nature:          string,  // INFRASTRUCTURE / CAPITAL_HUMAIN / FINANCEMENT / REGLEMENTATION / MARCHE / CONTEXTUEL
  description:     string,
  criticite:       integer, // 1 | 2 | 3
  controlabilite:  string   // TOTALE | PARTIELLE | NULLE
}]
```

#### resultats (array)
```
[{
  intitule:        string,
  niveau:          string,  // OUTPUT | OUTCOME | IMPACT
  quantification:  string,
  horizon:         string   // COURT | MOYEN | LONG
}]
```

#### indicateurs (array)
```
[{
  intitule:          string,
  type:              string,  // PROCESSUS | RESULTAT | CONTEXTE
  resultat_associe:  string,
  source:            string,
  baseline:          string,
  frequence:         string
}]
```

---

## 6. Architecture Technique

### 6.1 Diagramme de composants

```
NETLIFY (Free)
├── /dist                     Build statique React
│   ├── index.html            Point d'entrée SPA
│   └── assets/               JS + CSS minifiés
└── /netlify/functions/       [V2] Fonctions serverless
    └── generate-pdf.js       Export PDF

SUPABASE (Free Tier)
├── auth                      Gestion sessions JWT
├── database (PostgreSQL)
│   ├── profiles              Comptes et rôles
│   └── fdp                   Fiches avec JSONB
├── Row Level Security        Contrôle d'accès en base
└── storage                   [V2] Stockage exports PDF
```

### 6.2 Flux de données principaux

#### Flux inscription

```
Navigateur
    → POST /auth/signup (Supabase Auth)
    → Trigger SQL : INSERT INTO profiles
    → Réponse : session JWT + profil rôle UTILISATEUR
    → Redirection /catalogue
```

#### Flux consultation catalogue

```
Navigateur (utilisateur authentifié)
    → GET /fdp?select=...&statut=eq.PUBLIE (Supabase RLS)
    → RLS vérifie : statut = 'PUBLIE' OR auteur = current_user OR admin
    → Retour JSON → Filtrage client → Affichage
```

#### Flux publication d'une fiche

```
Administrateur
    → PATCH /fdp?id=eq.{id} { statut: 'PUBLIE', published_at: now() }
    → RLS vérifie : role admin
    → Trigger SQL : updated_at = NOW()
    → Confirmation UI
```

### 6.3 Gestion des erreurs

| Scénario | Comportement |
|---|---|
| Supabase indisponible | Message d'erreur générique + bouton de rechargement |
| Token expiré | Redirection automatique vers `/connexion` |
| Fiche introuvable (slug invalide) | Message "Fiche introuvable" + lien retour catalogue |
| Erreur de sauvegarde | Message d'erreur en ligne, données préservées dans le formulaire |
| Timeout export PDF | Message d'erreur + invitation à réessayer |
| Accès non autorisé (403) | Redirection `/catalogue` + message |

---

## 7. Interfaces Utilisateur — Spécifications

### 7.1 Système de design

| Élément | Spécification |
|---|---|
| Police principale | DM Sans (sans-serif) — corps, labels, navigation |
| Police titre | Crimson Pro (serif) — titres, questions centrales, accents éditoriaux |
| Police technique | DM Mono (monospace) — codes, tags, métriques |
| Couleur dominante | Navy `#0D1B2A` — fond global |
| Couleur accent primaire | Amber `#C17B2A` — actions, liens actifs, question centrale |
| Couleur succès | Sage `#4A8C6B` — statut publié, obstacle C1, validation |
| Couleur alerte | Amber clair — avertissements méthodologiques |
| Couleur erreur | Terra `#C44B36` — obstacle C3, erreurs, suppression |
| Grille | Tailwind CSS, max-width 7xl (1280px), padding latéral 24px |
| Coins | Aucun arrondi (esthétique angulaire délibérée) |
| Ombres | Aucune ombre portée — profondeur par gradients et bordures |

### 7.2 Composants réutilisables

| Composant | Usage | Variantes |
|---|---|---|
| `Badge` | Tags, statuts, rôles | default, amber, sage, terra, PUBLIE, BROUILLON, VALIDATION, ARCHIVE, URGENT, COMPLEXE, QUICK-WIN |
| `FDPCard` | Carte catalogue | Grille (défaut), liste |
| `FilterPanel` | Panneau de filtres | Fixe en position sticky |
| `ItemCard` | Encart formulaire (obstacle, résultat, etc.) | Avec bordure gauche colorée selon criticité |
| `Section` | Accordéon de la fiche détaillée | Ouverte / Fermée |
| `Field` | Champ formulaire avec label | Standard, pleine largeur |
| `Badge` criticité | Indicateur d'obstacle | C1 (sage), C2 (amber), C3 (terra) |
| `InfoBox` | Message d'aide méthodologique | Amber (avertissement) |
| `SolutionAlert` | Alerte termes prescriptifs | Terra (erreur) |
| `WordCount` | Compteur de mots | Vert (OK), rouge (dépassement) |

### 7.3 États de l'interface

| État | Représentation |
|---|---|
| Chargement | Spinner amber centré + texte "Chargement" en monospace |
| Vide (aucun résultat) | Symbole ∅ + message + suggestion d'action |
| Erreur réseau | Encadré terra + message + bouton retry |
| Succès sauvegarde | Icône checkmark sage + "Sauvegardé" (2 secondes) |
| Alerte métier | Encadré amber avec icône AlertCircle + texte descriptif |

---

## 8. Règles Métier MDP — Spécification Formelle

### 8.1 Règle R1 — Détection de termes prescriptifs

**Champs concernés.** `contexte_strategique`, `question_centrale`.

**Liste de termes détectés (version V1).**
```
"mettre en place", "créer un programme", "lancer une initiative",
"développer un système", "implémenter", "solution", "réponse",
"mesure corrective", "action concrète", "recommandation"
```

**Comportement.** Alerte non bloquante affichée sous le champ concerné, listant les termes détectés. L'utilisateur peut poursuivre la saisie.

**Note.** La liste de termes est extensible sans modification de code (configuration future).

### 8.2 Règle R2 — Contrainte de mots du contexte stratégique

**Champ concerné.** `contexte_strategique`.

**Cible.** 100 à 150 mots.

**Comportement.** Compteur en temps réel : gris si < 100, vert si 100–150, rouge si > 150. Non bloquant.

### 8.3 Règle R3 — Six tests de la question centrale

| Test | Implémentation |
|---|---|
| T1 — Ouverture | `question.length > 20` et absence de réponse présupposée (heuristique longueur) |
| T2 — Neutralité | `detectSolutions(question).length === 0` |
| T3 — Pertinence | `contexte.length > 0 && question.length > 30` |
| T4 — Délimitation | `perimetre_inclus.length > 0` |
| T5 — Actionnabilité | `obstacles.length > 0 || question.length > 50` |
| T6 — Unicité | Absence de structure multi-questions (heuristique virgule + "et" + "?") |

**Comportement.** Tableau de tests affiché à l'étape 4. Indicateur ✓ ou ○ par test. Non bloquant.

### 8.4 Règle R4 — Grille de cohérence interne C1–C7

| Vérification | Condition |
|---|---|
| C1 — Contexte → Question | `contexte != '' && question != ''` |
| C2 — Obstacles → Périmètre | `perimetre_inclus.length > 0 && obstacles.length > 0` |
| C3 — Périmètre → Résultats | `resultats.length > 0 && perimetre_inclus.length > 0` |
| C4 — Résultats → Indicateurs | `indicateurs.length >= resultats.length && resultats.length > 0` |
| C5 — Décideurs → Périmètre | `parties_prenantes.length > 0 && perimetre_inclus.length > 0` |
| C6 — Absence de solutions | `detectSolutions(contexte).length === 0 && detectSolutions(question).length === 0` |
| C7 — Niveau de certitude | `contexte.split(' ').length > 50` |

**Score.** Nombre de vérifications passées sur 7. Affiché à l'étape 8 avec code couleur : rouge (0–3), amber (4–5), vert (6–7).

### 8.5 Règle R5 — Obstacles ne formulés pas comme solutions manquantes

**Champ concerné.** `obstacles[*].intitule` et `obstacles[*].description`.

**Comportement V1.** Information affichée dans l'InfoBox de l'étape 5. Validation manuelle (pas de détection automatique en V1 — à ajouter en V2 avec une liste de patterns négatifs : "absence de", "manque de", "insuffisance de" suivi d'un programme ou d'une action).

---

## 9. Exigences de Déploiement

### 9.1 Environnements

| Environnement | Hébergement | Base de données | Usage |
|---|---|---|---|
| Développement local | `localhost:5173` (Vite) | Supabase projet de dev | Développement actif |
| Staging | Netlify preview (branche `develop`) | Supabase projet de dev | Tests avant production |
| Production | Netlify (branche `main`) | Supabase projet de prod | Utilisateurs finaux |

### 9.2 Pipeline CI/CD

```
Push sur branche develop
    → Build automatique Netlify (preview URL)
    → Tests manuels sur preview
    → Merge vers main
    → Build automatique Netlify (production URL)
    → Déploiement sans downtime (atomic deploy Netlify)
```

### 9.3 Variables d'environnement requises

| Variable | Environnement | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Dev + Staging + Prod | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Dev + Staging + Prod | Clé anon Supabase (lecture publique contrôlée par RLS) |

### 9.4 Limites du Free Tier et seuils d'alerte

| Ressource | Limite | Seuil d'alerte | Action si dépassement |
|---|---|---|---|
| Netlify Bandwidth | 100 GB/mois | 80 GB | Optimisation assets ou upgrade plan |
| Netlify Build minutes | 300 min/mois | 240 min | Réduire fréquence de déploiement |
| Supabase Database | 500 MB | 400 MB | Archivage ou upgrade plan |
| Supabase Auth | 50 000 utilisateurs | N/A en V1 | N/A |
| Netlify Functions | 125 000 req/mois | 100 000 | Mise en cache des PDFs générés |

---

## 10. Hors Périmètre V1 — Backlog V2

Les fonctionnalités suivantes sont documentées et délibérément exclues de la V1.

| Fonctionnalité | Justification de l'exclusion | Priorité V2 |
|---|---|---|
| Export PDF côté serveur | Complexité Netlify Functions, timeout 10s | Haute |
| Assistance IA à la saisie (Claude API) | Coût + complexité d'intégration | Haute |
| Notifications email (nouveau statut, nouveau utilisateur) | Dépendance service email externe | Moyenne |
| Recherche plein-texte PostgreSQL (FTS) | Suffisant côté client en V1 | Moyenne |
| Historique des versions par dimension | Schéma JSONB à étendre | Moyenne |
| Module phase solution | Hors périmètre méthodologique V1 | Basse |
| Export DOCX | Bibliothèque supplémentaire | Basse |
| Internationalisation (EN, AR) | Volume de travail de traduction | Basse |
| API publique REST | Aucun cas d'usage identifié en V1 | Basse |
| Statistiques et analytics du corpus | Supabase Analytics ou Metabase | Basse |
| Commentaires et annotations sur les fiches | Collaboration asynchrone | Basse |
| Import de fiches depuis DOCX ou PDF | Complexité de parsing | Très basse |

---

## 11. Critères d'Acceptation

### 11.1 Critères d'acceptation par module

#### Authentification
- [ ] Un utilisateur peut s'inscrire avec email + mot de passe + nom complet.
- [ ] L'accès au catalogue est disponible immédiatement après inscription sans étape supplémentaire.
- [ ] Un utilisateur non inscrit accédant à `/catalogue` est redirigé vers `/connexion`.
- [ ] Un utilisateur avec rôle `UTILISATEUR` accédant à `/admin` est redirigé vers `/catalogue`.
- [ ] La déconnexion invalide la session et redirige vers `/connexion`.

#### Catalogue et filtres
- [ ] Seules les fiches au statut `PUBLIE` apparaissent dans le catalogue.
- [ ] La combinaison de deux filtres de catégories différentes produit une intersection (AND).
- [ ] La sélection de deux valeurs dans la même catégorie de filtre produit une union (OR).
- [ ] Le compteur de résultats se met à jour immédiatement à chaque changement de filtre.
- [ ] Le bouton de réinitialisation est visible uniquement si au moins un filtre est actif.

#### Fiche détaillée
- [ ] Toutes les dimensions saisies sont affichées dans la fiche.
- [ ] La question centrale est affichée dans le bloc de mise en valeur.
- [ ] L'Annexe A est affichée uniquement si elle contient des entrées.
- [ ] L'URL `/fiche/:slug` est stable et accessible directement.

#### Formulaire admin
- [ ] Le stepper permet la navigation libre entre toutes les étapes.
- [ ] Une alerte est affichée si un terme prescriptif est détecté dans le contexte ou la question.
- [ ] Le score de cohérence C1–C7 est affiché à l'étape 8 avec le détail par vérification.
- [ ] La sauvegarde produit une confirmation visuelle.
- [ ] La publication enregistre `published_at` et rend la fiche visible dans le catalogue.

#### Sécurité RLS
- [ ] Un utilisateur authentifié avec rôle `UTILISATEUR` ne peut pas lire une fiche `BROUILLON` via une requête directe à l'API Supabase.
- [ ] Un utilisateur authentifié avec rôle `UTILISATEUR` ne peut pas écrire dans la table `fdp` via une requête directe.
- [ ] La modification de rôle dans `profiles` est impossible pour un utilisateur sans rôle admin.

### 11.2 Critères de performance
- [ ] Le catalogue se charge en moins de 2 secondes sur une connexion 10 Mbps.
- [ ] L'application des filtres prend moins de 100 ms.
- [ ] Le score Lighthouse Performance est supérieur à 80 en production.

### 11.3 Critères de déploiement
- [ ] Le build `npm run build` se termine sans erreur.
- [ ] L'application est accessible sur l'URL Netlify de production.
- [ ] Les variables d'environnement sont correctement injectées en production.
- [ ] Le routing SPA fonctionne sur toutes les routes (redirections Netlify configurées).

---

## 12. Glossaire

| Terme | Définition dans le contexte de ce document |
|---|---|
| FDP | Fiche de Définition de la Problématique — document structuré en 7 dimensions produit par la MDP |
| MDP | Méthodologie de Définition de la Problématique — protocole en 4 phases |
| Grille C1–C7 | Sept vérifications de cohérence interne de la FDP |
| RLS | Row Level Security — mécanisme de contrôle d'accès PostgreSQL/Supabase |
| JSONB | Format de stockage de données JSON binaire dans PostgreSQL |
| Slug | Identifiant textuel unique dérivé du titre, utilisé dans l'URL |
| Terme prescriptif | Mot ou expression indiquant une solution plutôt qu'une description de problème |
| Baseline | Valeur de référence d'un indicateur au moment du cadrage |
| Criticité | Niveau d'impact d'un obstacle : 1 (mineur), 2 (significatif), 3 (bloquant) |
| Contrôlabilité | Capacité d'agir sur un obstacle : totale, partielle ou nulle |
| Free Tier | Plan gratuit des services Netlify et Supabase, avec limites de ressources |

---

*PRD Plateforme FDP — Version 1.0. Document de référence pour le développement de la V1. Toute modification substantielle du périmètre ou des exigences doit faire l'objet d'une nouvelle version numérotée avec changelog.*