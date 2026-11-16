# innovatebf.org : site InnovateBF et conférence EBC2026

Nouvelle version du site (refonte 2026) : site vitrine bilingue du think tank, pages de la conférence EBC2026, formulaire de candidature et back-office (`/admin`).

**Démonstration** : https://innovatebf-v2.vercel.app. Elle tourne sur les comptes du développeur (sa base de données, son stockage, ses e-mails). Ce dépôt ne contient **aucune** clé ni adresse de ces services : chaque déploiement utilise ses propres comptes Vercel, Supabase et Resend, à configurer comme décrit ci-dessous.

Next.js 15 (App Router, backend Node.js dans les route handlers), React 19, Tailwind CSS 4, base PostgreSQL (Supabase) avec Drizzle ORM, stockage de fichiers Supabase Storage, e-mails Resend, validation zod. Cahier des charges : `Cahier des charges — Site InnovateBF & EBC2026.md`.

## Sommaire

1. [Ce qui change par rapport à l'ancien site](#1-ce-qui-change-par-rapport-à-lancien-site) (à lire avant de fusionner)
2. [Services nécessaires](#2-services-nécessaires)
3. [Variables d'environnement](#3-variables-denvironnement)
4. [Configurer Supabase](#4-configurer-supabase)
5. [Configurer Resend (e-mails)](#5-configurer-resend-e-mails)
6. [Configurer Vercel](#6-configurer-vercel)
7. [Mise en production, dans l'ordre](#7-mise-en-production-dans-lordre)
8. [En cas d'erreur](#8-en-cas-derreur)
9. [Exploitation courante](#9-exploitation-courante)
10. [Développement local](#10-développement-local)
11. [Documentation technique](#11-documentation-technique)

---

## 1. Ce qui change par rapport à l'ancien site

Cette version **remplace entièrement** l'ancien code (Next.js + next-intl + Neon + Better Auth). Elle a sa propre base de données, avec un schéma différent : elle ne lit aucune table de l'ancienne base Neon.

### Données de l'ancien site : non reprises

- **Candidatures EBC'26 déposées sur l'ancien site** (table `ebc26_candidature` de la base Neon) : elles **n'apparaîtront pas** dans le nouveau back-office. **Exportez-les avant la bascule** (voir [étape 7.1](#7-mise-en-production-dans-lordre)).
- **Comptes de l'ancien espace Innovons** (tables Better Auth `user`, `session`, `account`, `verification`) : non repris. Le nouveau back-office a ses propres comptes (premier administrateur créé au déploiement, voir `ADMIN_EMAIL`).
- **Besoins, propositions, votes et commentaires** (tables `ie_*`) : non repris.

### Pages de l'ancien site supprimées

| Ancienne adresse | Devenir |
| --- | --- |
| `/submit/ebc26` | Redirigée vers `/innovons/conference/appel-a-contributions` |
| `/submit/ebc26/soumettre` | Redirigée vers `/innovons/conference/candidater` |
| `/submit/ebc26/confirmation`, `/submit/ebc26/suivi/<jeton>` (liens de suivi envoyés par e-mail aux candidats), `/submit/ebc26/suivi/<jeton>/regulariser` | Supprimées : page « introuvable ». Prévenir les candidats si nécessaire |
| `/innovons`, `/innovons/connexion`, `/innovons/inscription`, `/innovons/mot-de-passe-oublie`, `/innovons/reset-password`, `/innovons/mon-espace/…`, `/innovons/besoins/…`, `/innovons/appels`, `/innovons/innovation`, `/innovons/observatoire`, `/innovons/admin/…` | Supprimées (espace Innovons). L'administration se fait désormais dans `/admin` |
| `/domains/calendar`, `/domains/contribute` | Supprimées |
| `/`, `/about`, `/domains`, `/domains/analysis`, `/contact`, `/legal`, `/privacy`, `/innovons/conference` | Conservées, avec le nouveau design |

### Variables d'environnement : anciennes et nouvelles

À faire dans **Vercel → Settings → Environment Variables** du projet existant :

| Ancienne variable | Action |
| --- | --- |
| `DATABASE_URL` (Neon) | **Remplacer** par l'adresse de la nouvelle base Supabase (section 4) |
| `NEXT_PUBLIC_SITE_URL` | Conserver ; vérifier qu'elle vaut l'adresse définitive du site |
| `RESEND_API_KEY` | Conserver si le domaine d'envoi est vérifié dans Resend (section 5) |
| `CONTACT_EMAIL` | **Supprimer** : remplacée par `MAIL_TO` |
| `EBC26_CLOTURE_LE` | **Supprimer** : la clôture se règle dans le back-office (**Paramètres → Ouverture et clôture**) |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | **Supprimer** (Better Auth n'est plus utilisé) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | **Supprimer** (le français est la langue par défaut, fixée dans le code) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (si présentes) | **Supprimer** : remplacées par `SUPABASE_URL` et `SUPABASE_SECRET_KEY` |
| Variables ajoutées par l'intégration Neon (`PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `POSTGRES_URL…`, `DATABASE_URL_UNPOOLED`…) | **Supprimer** : déconnecter la base Neon du projet (onglet **Storage**), puis créer `DATABASE_URL` à la main |
| Nouvelles : `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `MAIL_FROM`, `MAIL_TO` | **Ajouter** (section 3) |

> ⚠️ **Configurer Vercel avant de fusionner.** Si la branche est fusionnée alors que `DATABASE_URL` pointe encore vers Neon, le build crée les nouvelles tables **dans l'ancienne base Neon** (les noms ne se chevauchent pas) et le site part en ligne sans stockage de fichiers. Si `DATABASE_URL` est absente, le build s'arrête et l'ancien site reste en ligne.

---

## 2. Services nécessaires

| Service | Rôle | Obligatoire | Plan |
| --- | --- | --- | --- |
| **GitHub** | Code source, déclenche les déploiements Vercel | Oui | — |
| **Vercel** | Hébergement du site, des API et du build | Oui | Gratuit (Hobby) ou Pro |
| **Supabase** | Base PostgreSQL **et** stockage des fichiers (images, pièces jointes) | Oui | Gratuit suffisant pour démarrer |
| **Resend** | Notifications e-mail des formulaires, confirmation aux candidats | Recommandé | Gratuit suffisant pour démarrer |
| Hébergeur DNS du domaine `innovatebf.org` | Domaine du site, vérification du domaine d'envoi Resend | Oui | — |

Aucun autre service n'est utilisé : ni Supabase Auth, ni l'API de données de Supabase, ni Vercel Blob, ni Neon, ni Google Analytics (la mesure d'audience est intégrée et sans cookie).

---

## 3. Variables d'environnement

Liste **complète** : le code n'en lit aucune autre. Toutes se renseignent dans **Vercel → Settings → Environment Variables**, environnement **Production**.

| Variable | Obligatoire | Valeur / où la trouver | Sans elle |
| --- | --- | --- | --- |
| `DATABASE_URL` | **Oui** | Supabase → **Connect** → **Transaction pooler** (port 6543), mot de passe compris. Ex. `postgresql://postgres.<ref>:<mot-de-passe>@aws-0-eu-west-3.pooler.supabase.com:6543/postgres` | Le build s'arrête avec un message explicite |
| `SUPABASE_URL` | **Oui** | `https://<ref>.supabase.co` (Supabase → **Project Settings → Data API → Project URL**). `<ref>` est la même référence que dans `postgres.<ref>` de `DATABASE_URL` | Envoi d'images refusé dans le back-office ; les candidats ne peuvent que coller des liens |
| `SUPABASE_SECRET_KEY` | **Oui** | Supabase → **Project Settings → API Keys** → **Secret keys** (`sb_secret_…`) | Idem |
| `ADMIN_EMAIL` | **Oui** (1er déploiement) | Adresse du premier administrateur, ex. `admin@innovatebf.org` | Aucun compte créé : impossible de se connecter à `/admin` |
| `ADMIN_PASSWORD` | **Oui** (1er déploiement) | 12 caractères minimum, avec au moins une lettre et un chiffre | Aucun compte créé en production |
| `NEXT_PUBLIC_SITE_URL` | Recommandé | Adresse définitive, sans barre finale : `https://www.innovatebf.org` | `https://www.innovatebf.org` est utilisé par défaut |
| `RESEND_API_KEY` | Recommandé | Resend → **API Keys** (`re_…`) | Formulaires enregistrés dans le back-office, sans e-mail |
| `MAIL_FROM` | Recommandé | Expéditeur sur un domaine **vérifié** dans Resend : `InnovateBF <noreply@innovatebf.org>` | Idem |
| `MAIL_TO` | Recommandé | Destinataire(s) des notifications, séparés par des virgules : `contact@innovatebf.org` | Idem |

Précisions :

- **Production uniquement** pour `DATABASE_URL`, `SUPABASE_URL` et `SUPABASE_SECRET_KEY` : décocher **Preview** et **Development** (voir [6.3](#63-déploiements-de-prévisualisation-preview)).
- Cocher **Sensitive** pour `DATABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_PASSWORD` et `RESEND_API_KEY`.
- `NEXT_PUBLIC_SITE_URL` et `SUPABASE_URL` sont lues **au moment du build** (balises, sitemap, politique de sécurité du contenu) : après une modification, **redéployer**. C'est vrai aussi des autres variables : une modification ne s'applique qu'au déploiement suivant.
- `ADMIN_EMAIL` et `ADMIN_PASSWORD` ne servent que si la base ne contient **aucun** compte. Les modifier ensuite ne change rien ; supprimer `ADMIN_PASSWORD` de Vercel après la première connexion.
- **Ne jamais** préfixer `SUPABASE_SECRET_KEY` par `NEXT_PUBLIC_` : elle serait envoyée aux navigateurs.
- **Ne pas créer** `NODE_ENV` : Vercel la gère. Fixée à `production`, elle empêcherait l'installation des outils de build (`devDependencies`) et le build échouerait.
- Fournies automatiquement par Vercel, **à ne pas créer** : `VERCEL`, `VERCEL_ENV`, `VERCEL_GIT_COMMIT_SHA`. Laisser cochée l'option **Automatically expose System Environment Variables** (même page).
- Local uniquement, facultative : `UPLOADS_DIR` (dossier des images sans Supabase, défaut `./data/uploads`). Inutile sur Vercel.

Le modèle commenté se trouve dans `.env.example`.

---

## 4. Configurer Supabase

Créer un **nouveau projet** : la base doit être vide au premier déploiement.

### 4.1 Créer le projet

1. https://supabase.com/dashboard → **New project**.
2. **Name** : `innovatebf` (libre).
3. **Database password** : cliquer **Generate a password**, ou choisir un mot de passe composé uniquement de lettres et de chiffres (pas de caractère spécial à encoder). **Le noter** : il fait partie de `DATABASE_URL`. En cas d'oubli : **Project Settings → Database → Reset database password**.
4. **Region** : **West EU (Paris) — eu-west-3**. Les fonctions Vercel du site tournent à Paris (`"regions": ["cdg1"]` dans `vercel.json`) : la base doit être à côté. Si une autre région est choisie, mettre dans `vercel.json` la région Vercel la plus proche (Francfort `eu-central-1` → `fra1`, Irlande `eu-west-1` → `dub1`, Londres `eu-west-2` → `lhr1`).
5. **Create new project**, attendre la fin de la création.

### 4.2 Récupérer `DATABASE_URL`

1. En haut de la page du projet : bouton **Connect**.
2. Onglet **Connection String**, type **URI**, méthode **Transaction pooler** (port **6543**).
3. Copier l'adresse et remplacer `[YOUR-PASSWORD]` par le mot de passe de la base (sans les crochets) :
   ```
   postgresql://postgres.<ref>:<mot-de-passe>@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
   ```
4. Si le mot de passe contient des caractères spéciaux, les encoder : `@` → `%40`, `#` → `%23`, `/` → `%2F`, `:` → `%3A`, `?` → `%3F`, `%` → `%25`, `&` → `%26`.

Ne pas utiliser **Direct connection** (IPv6 seulement, injoignable depuis Vercel) ni **Session pooler** pour le site (réservé aux sauvegardes, voir 9.2).

### 4.3 Récupérer `SUPABASE_URL` et `SUPABASE_SECRET_KEY`

1. **Project Settings → Data API** : copier **Project URL** (`https://<ref>.supabase.co`) → `SUPABASE_URL`.
2. **Project Settings → API Keys** → section **Secret keys** : copier la clé `default` (`sb_secret_…`), ou en créer une (**New secret key**) → `SUPABASE_SECRET_KEY`.
   - Ne **pas** prendre la clé **publishable** (`sb_publishable_…`) ni la clé `anon` : elles n'ont pas les droits nécessaires.
   - Sur un projet ancien sans clé `sb_secret_`, la clé `service_role` de l'onglet **Legacy API keys** fonctionne aussi.

### 4.4 Ce qu'il ne faut PAS faire à la main

Le build (`npm run build` → `prebuild` → `npm run db:setup`) s'occupe de tout, à chaque déploiement :

- **Tables** : créées par les migrations du dossier `drizzle/`. Ne rien créer dans **Table Editor** ni dans **SQL Editor**.
- **Sécurité par ligne (RLS)** : activée par les migrations sur toutes les tables, sans aucune règle d'accès. L'API de données publique de Supabase ne peut donc rien lire ; le site se connecte directement à PostgreSQL. **Ne pas ajouter de règle (policy)**.
- **Espaces de stockage** (Storage → Buckets) : créés et tenus à jour automatiquement (`src/server/storage-config.ts`) :
  - `media` : **public**, images de la médiathèque (PNG, JPEG, WebP, GIF, AVIF ; 5 Mo maximum) ;
  - `candidatures` : **privé**, pièces jointes des candidatures (25 Mo maximum par fichier), ouvertes uniquement par un lien temporaire de 5 minutes depuis le back-office. **Ne jamais le rendre public.**
- **Inutile** : Supabase Auth, l'intégration « Supabase » de la Marketplace Vercel (elle ajoute des variables que le site n'utilise pas ; renseigner les trois variables à la main).

### 4.5 Plan gratuit : à savoir

- Un projet gratuit est **mis en pause après 7 jours sans activité** (les visites du site suffisent à le garder actif). Une pause rend le site indisponible jusqu'à sa réactivation dans le tableau de bord.
- **Pas de sauvegarde automatique téléchargeable** sur le plan gratuit : faire des sauvegardes manuelles (9.2) ou passer au plan Pro.

---

## 5. Configurer Resend (e-mails)

Facultatif mais recommandé. Le site envoie :

- à l'équipe (`MAIL_TO`) : une notification pour chaque message de contact et chaque candidature ;
- au candidat : un e-mail de confirmation, dans la langue de sa candidature.

Étapes :

1. https://resend.com → **Domains → Add domain** → `innovatebf.org`.
2. Ajouter chez l'hébergeur DNS du domaine les enregistrements affichés par Resend (SPF/MX et DKIM), attendre le statut **Verified**.
3. **API Keys → Create API key**, permission **Sending access**, domaine `innovatebf.org` → `RESEND_API_KEY`. (Une clé de l'ancien site peut être réutilisée si le domaine est déjà vérifié.)
4. `MAIL_FROM` : une adresse **du domaine vérifié**, par exemple `InnovateBF <noreply@innovatebf.org>` (sinon Resend refuse l'envoi).
5. `MAIL_TO` : la ou les adresses de l'équipe, séparées par des virgules.

Sans Resend, ou en cas de panne, les formulaires fonctionnent : tout est enregistré et consultable dans le back-office.

---

## 6. Configurer Vercel

Les réglages ci-dessous valent pour le projet existant (déjà relié à ce dépôt et au domaine `innovatebf.org`) comme pour un nouveau projet (**Add New → Project → Import** ce dépôt GitHub).

### 6.1 Settings → Build and Deployment (ou General)

| Réglage | Valeur |
| --- | --- |
| Framework Preset | **Next.js** |
| Root Directory | vide (racine du dépôt) |
| Build Command | **par défaut** (`npm run build`). Ne pas la remplacer par `next build` : le script `prebuild` (migrations, contenu initial, administrateur, stockage) ne s'exécuterait plus |
| Install Command | **par défaut** (npm, détecté grâce à `package-lock.json`). Ne pas utiliser pnpm ni yarn |
| Output Directory | par défaut |
| Node.js Version | **22.x** (minimum 20.12) |

### 6.2 Settings → Environment Variables

1. Supprimer les anciennes variables (tableau de la [section 1](#variables-denvironnement--anciennes-et-nouvelles)).
2. Ajouter les variables de la [section 3](#3-variables-denvironnement), environnement **Production**.
3. Vérifier que **Automatically expose System Environment Variables** est coché.

### 6.3 Déploiements de prévisualisation (Preview)

`DATABASE_URL` n'existant qu'en Production, **le build de toute autre branche ou pull request s'arrête volontairement** avec le message « Base de données manquante pour l'environnement « preview » ». C'est normal, y compris pour la pull request qui apporte cette refonte : seul le déploiement de `main` compte.

Ne **jamais** donner l'adresse de la base de production à l'environnement Preview : le build d'une branche appliquerait ses migrations à la base de production avant toute fusion. Trois possibilités :

- laisser ces builds échouer (le plus simple) ;
- ne construire que la production : **Settings → Git → Ignored Build Step** → **Only build production** ;
- donner aux prévisualisations leur propre base : un second projet Supabase, avec ses propres `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, renseignées pour **Preview** uniquement.

### 6.4 Settings → Domains

- Domaines : `innovatebf.org` et `www.innovatebf.org`, l'un redirigeant vers l'autre (projet existant : rien à changer).
- `NEXT_PUBLIC_SITE_URL` doit être l'adresse **principale** (celle qui ne redirige pas), avec `https://`.

### 6.5 Région

Fixée par `vercel.json` (`cdg1`, Paris) : rien à régler dans le tableau de bord. À modifier seulement si la base Supabase n'est pas à Paris (4.1).

---

## 7. Mise en production, dans l'ordre

1. **Sauvegarder l'ancienne base Neon** (candidatures EBC'26, comptes, besoins), avant toute modification :
   ```bash
   pg_dump "<ancienne DATABASE_URL Neon>" -Fc -f innovatebf-neon-$(date +%F).dump
   ```
   Pour un tableur : dans la console Neon, **SQL Editor** → `SELECT * FROM ebc26_candidature;` → exporter le résultat en CSV.
2. **Supabase** : créer le projet et relever `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (section 4).
3. **Resend** : vérifier le domaine, créer la clé (section 5).
4. **Vercel** : supprimer les anciennes variables, ajouter les nouvelles en Production, vérifier les réglages (section 6).
5. **Fusionner** la branche dans `main` : Vercel lance le déploiement de production. (Si les variables ont été modifiées sans nouveau commit : **Deployments** → dernier déploiement → **⋯ → Redeploy**.)
6. **Lire le journal du build** (Deployments → le déploiement → **Build Logs**). Il doit contenir :
   ```
   ✓ Migrations appliquées
   ✓ Blocs de contenu : … créé(s)
   ✓ Collection « … » : … élément(s)
   ✓ Administrateur créé : admin@innovatebf.org
   ✓ Stockage de fichiers : 2 espace(s) créé(s), 2 au total
   ```
7. **Vérifier le site** :
   - accueil en français (`/`) et en anglais (`/en`) ;
   - `/admin` : se connecter avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`, puis **changer le mot de passe** dans **Mon compte** ;
   - **Médias** : téléverser une image (vérifie le stockage Supabase) ;
   - **Contact** : envoyer un message (vérifie la base et, avec Resend, l'e-mail) ; il apparaît dans **Formulaires → Messages** ;
   - Supabase : **Table Editor** affiche les tables, **Storage** les espaces `media` et `candidatures`.
8. **Supprimer `ADMIN_PASSWORD`** des variables Vercel (inutile une fois le compte créé).
9. **Contenu** : la base est remplie au premier build à partir du code (`src/server/content/seed-data.ts`, `src/content/ebc2026-programme.ts`) : pages, programme, intervenants, partenaires, stands. Ce qui a été saisi dans le back-office de la démonstration (innovatebf-v2.vercel.app) **n'est pas transféré** : c'est une autre base. Vérifier dans **Paramètres** les coordonnées, les réseaux sociaux et les dates d'**Ouverture et clôture** de l'appel ; supprimer les fiches « Exemple » dans **Contenus → Intervenants** (voir [Pages](#pages)).

---

## 8. En cas d'erreur

Messages du journal de build (`scripts/db.ts`) :

| Message | Cause | Correction |
| --- | --- | --- |
| `Base de données manquante pour l'environnement « production »` | `DATABASE_URL` absente en Production | L'ajouter (section 3), redéployer |
| `Base de données manquante pour l'environnement « preview »` | Build d'une branche autre que `main` | Normal (6.3) |
| `URL de base non prise en charge (libsql://…)` | `DATABASE_URL` n'est pas une adresse PostgreSQL | Mettre l'adresse Supabase `postgresql://…` |
| `DATABASE_URL illisible : les caractères spéciaux du mot de passe doivent être encodés.` | Caractère spécial dans le mot de passe | L'encoder (4.2) ou changer le mot de passe |
| `password authentication failed` | Mauvais mot de passe, ou `[YOUR-PASSWORD]` laissé dans l'adresse | Corriger `DATABASE_URL` |
| `Tenant or user not found` | Référence du projet ou hôte du pooler erronés | Recopier l'adresse depuis **Connect** |
| `timeout` / `ENOTFOUND` | Adresse **Direct connection** utilisée | Prendre l'adresse **Transaction pooler** |
| `ADMIN_PASSWORD refusé : 12 caractères minimum…` | Mot de passe trop faible | Le corriger, redéployer |
| `ADMIN_EMAIL invalide` | Adresse incomplète | La corriger |
| `! ADMIN_PASSWORD manquant : aucun compte créé en production` | `ADMIN_PASSWORD` absente au premier déploiement | L'ajouter, redéployer (ou 9.1) |
| `! Stockage de fichiers non configuré (SUPABASE_URL, SUPABASE_SECRET_KEY)` | Variables de stockage absentes | Les ajouter, redéployer |
| `Stockage Supabase : …` | `SUPABASE_URL` erronée, ou clé publishable/anon au lieu de la clé secrète | Corriger (4.3) |

Sur le site en ligne :

| Symptôme | Correction |
| --- | --- |
| Back-office, envoi d'image : « Stockage non configuré : renseignez SUPABASE_URL et SUPABASE_SECRET_KEY. » | Ajouter les deux variables en Production, redéployer |
| Images de la médiathèque non affichées après un changement de projet Supabase | `SUPABASE_URL` est lue au build : redéployer |
| Pas d'e-mail reçu | Vérifier les trois variables Resend, le domaine **Verified** et les journaux (**Logs**, filtre `[mail]`) ; les envois restent consultables dans le back-office |
| Mot de passe administrateur perdu | Voir 9.1 |

---

## 9. Exploitation courante

### 9.1 Comptes administrateurs

- Depuis le back-office : **Compte → Utilisateurs** (administrateurs seulement).
- Créer un administrateur ou réinitialiser un mot de passe **en production**, depuis un poste de développement (les variables sont passées dans la commande, **jamais** écrites dans `.env`) :
  ```bash
  DATABASE_URL="<adresse Transaction pooler de production>" ADMIN_PASSWORD="<nouveau mot de passe>" \
    npm run admin:create -- prenom.nom@innovatebf.org "Prénom Nom"
  ```
  La réinitialisation ferme les sessions ouvertes du compte.

### 9.2 Sauvegardes

La base se sauvegarde avec `pg_dump` (version de `pg_dump` supérieure ou égale à celle du serveur Supabase), en utilisant l'adresse **Session pooler** (Supabase → **Connect** → méthode **Session pooler**, port 5432) :

```bash
pg_dump "postgresql://postgres.<ref>:<mot-de-passe>@aws-0-eu-west-3.pooler.supabase.com:5432/postgres" -Fc -f innovatebf-$(date +%F).dump
```

Les fichiers (images, pièces jointes) sont dans Supabase Storage et ne font pas partie de cette sauvegarde. Le plan Pro de Supabase ajoute des sauvegardes quotidiennes.

### 9.3 Mettre à jour le site

Chaque commit sur `main` déclenche un déploiement : le build applique les nouvelles migrations et corrections de contenu, sans jamais écraser le contenu saisi dans le back-office. Une modification de variable d'environnement demande un **Redeploy**.

---

## 10. Développement local

Prérequis : **Node.js 22** (minimum 20.12), **npm**, **PostgreSQL 15 ou plus** démarré en local.

```bash
npm install
createdb innovatebf             # base PostgreSQL locale
cp .env.example .env.local      # facultatif en local
ADMIN_EMAIL=vous@exemple.org npm run db:setup   # crée les tables, le contenu initial et un administrateur
npm run dev                     # http://localhost:3000 ; back-office : /admin
```

En local, `npm run db:setup` affiche le mot de passe généré pour l'administrateur (à changer dans **Mon compte**). Laisser `DATABASE_URL`, `SUPABASE_URL` et `SUPABASE_SECRET_KEY` **vides** : le site utilise la base locale `innovatebf`, les images vont dans `data/uploads`. Ne mettez jamais l'adresse de production dans `.env` ou `.env.local` : `npm run dev` et `npm run db:setup` écriraient dans la base en ligne.

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Applique les migrations et amorce le contenu (`prebuild`), puis compile |
| `npm run lint`, `npm run typecheck` | Vérifications |
| `npm run db:setup` | Migrations, contenu initial (n'écrase jamais un contenu existant), corrections de contenu, espaces de stockage |
| `npm run db:generate` | Génère une migration après modification de `src/server/db/schema.ts` |
| `npm run admin:create -- <e-mail> [nom]` | Crée un administrateur, ou réinitialise son mot de passe et ferme ses sessions |

**Corrections de contenu** (`scripts/content-migrations.ts`) : l'amorçage ne remplit que les collections vides, donc une base déjà en ligne garde son contenu. Pour y reporter une correction (retours du comité), on ajoute une entrée à ce fichier : elle s'exécute une seule fois par base au `db:setup` suivant (donc au prochain déploiement) et reste inscrite dans la table `content_migrations`. Aucune en cours.

**Programme de référence** (`src/content/ebc2026-programme.ts`) : créneaux, intervenants, fiches Top 5 et stands du Village. Il amorce les bases neuves. Pour aligner une base existante, `npx tsx scripts/sync-ebc2026-programme.ts --dry-run` affiche le diff sans rien écrire ; `--apply` sauvegarde dans `backups/` (ignoré par git), puis écrit en transaction, ligne par ligne et par identifiant.

Gestionnaire de paquets : **npm uniquement**. `package-lock.json` fait foi et les correctifs de sécurité (`overrides` de `package.json`) sont au format npm. Un `pnpm-lock.yaml` ou `yarn.lock` ferait basculer Vercel sur un autre gestionnaire et casserait l'installation : ces fichiers sont ignorés par git.

---

## 11. Documentation technique

### Back-office (`/admin`)

Le back-office ne contient que ce qui évolue : dates, coordonnées, actualités, programme, intervenants, Top Inventeurs, partenaires et stands. Chaque enregistrement met à jour le site immédiatement. Les textes fixes sont dans le code (voir « Contenus fixes » ci-dessous).

| Menu | Contenu |
| --- | --- |
| **Contenus** | Listes ordonnables (monter, descendre, masquer) : à la une (carrousel de l'accueil), actualités et ressources, intervenants, Top Inventeurs (photo, lien du projet), programme (heure de début et, facultative, heure de fin), partenaires et sponsors (logo et lien vers leur site), stands |
| **Médias** | Médiathèque d'images (PNG, JPEG, WebP, GIF, AVIF, 5 Mo maximum). Une image utilisée ne peut pas être supprimée |
| **Formulaires** | Candidatures (fiche complète, statut du dossier, export CSV), messages (recherche, lu / non lu). Pas d'inscription formelle à la conférence : le menu « Inscriptions » n'apparaît que s'il en reste d'anciennes |
| **Tableau de bord** | Compteur de visiteurs, toujours affiché. Audience du site (mesure sans cookie, voir « Mesure d'audience ») : visiteurs, pages vues, évolution par rapport à la période précédente, visiteurs par jour, pages les plus consultées, sources, appareils, langue, pays, sur 7, 30 ou 90 jours. Puis candidatures, messages et contenus publiés |
| **Paramètres** | Coordonnées et réseaux sociaux d'InnovateBF (LinkedIn, X, Facebook, YouTube, Instagram, TikTok : icônes du pied de page et de la fiche de la page Contact), infos pratiques de la conférence (dates, horaires, lieu, itinéraire), **réseaux sociaux d'EBC2026** (Facebook, LinkedIn, X, YouTube, Instagram, TikTok, WhatsApp : icônes du pied de page, de la barre de la conférence, de la page Conférence et de l'encadré EBC2026 de la page Contact ; seuls les réseaux renseignés s'affichent), **ouverture et clôture** de l'appel à projets |
| **Compte** | Utilisateurs (administrateurs seulement), journal d'activité, changement de mot de passe |

Sur ordinateur, la barre latérale se réduit aux pictogrammes (bouton en haut de la barre, ou Ctrl+B / ⌘+B) ; le choix est mémorisé.

Deux rôles : **administrateur** (tout) et **éditeur** (contenus, médias, lecture et traitement des formulaires ; ni utilisateurs, ni journal, ni suppression de candidatures, inscriptions ou messages).

**Clôture** : les dates se règlent dans **Paramètres → Ouverture et clôture**. Par défaut : appel à projets jusqu'au **31 octobre 2026, 23 h 59**. Après la clôture, les boutons passent en « Candidatures closes », le formulaire affiche « L'appel n'est pas ouvert actuellement. » et le serveur refuse tout envoi.

### API

Toutes les réponses sont en JSON. Erreurs : `{ "error": { "code", "message", "fields?" } }`. Les messages sont en français, ou en anglais pour les formulaires du site anglais (en-tête `X-Site-Locale: en`, envoyé automatiquement par `src/lib/api-client.ts`).

| Méthode | Route | Accès |
| --- | --- | --- |
| GET | `/api/public/content` | Public : contenu publié de l'accueil |
| POST | `/api/public/contact` | Public : formulaire de contact |
| POST | `/api/public/candidatures` | Public : candidature EBC'26 (7 étapes) |
| POST | `/api/public/candidature-files` | Public : autorisation de téléverser une pièce jointe vers le stockage Supabase |
| POST | `/api/public/track` | Public : page vue (mesure d'audience, toujours 204) |
| POST | `/api/auth/login`, `/api/auth/logout` | Connexion, déconnexion |
| GET | `/api/auth/session` | Utilisateur connecté |
| POST | `/api/auth/password` | Changement de mot de passe (ferme les autres sessions) |
| GET | `/api/admin/stats` | Tableau de bord |
| GET, PUT | `/api/admin/settings`, `/api/admin/settings/{clé}` | Blocs de contenu et paramètres |
| GET, POST | `/api/admin/collections/{nom}` | Liste, création |
| GET, PATCH, DELETE | `/api/admin/collections/{nom}/{id}` | Élément |
| PUT | `/api/admin/collections/{nom}/order` | Nouvel ordre (liste complète des identifiants) |
| GET, POST | `/api/admin/media` | Médiathèque, téléversement (multipart) |
| GET, PATCH, DELETE | `/api/admin/media/{id}` | Image (texte alternatif, suppression) |
| GET | `/api/admin/candidatures`, `/registrations`, `/messages` | Listes paginées (`?page`, `?pageSize`, `?q`) ; export `?format=csv` pour les candidatures et les anciennes inscriptions |
| GET, PATCH, DELETE | `/api/admin/candidatures/{id}` | Fiche, statut, suppression (admin) |
| GET | `/api/admin/candidatures/{id}/pieces/{index}` | Pièce jointe (lien temporaire de 5 minutes) |
| PATCH, DELETE | `/api/admin/messages/{id}` | Lu / non lu, suppression (admin) |
| DELETE | `/api/admin/registrations/{id}` | Suppression (admin) |
| GET, POST | `/api/admin/users` | Utilisateurs (admin) |
| PATCH, DELETE | `/api/admin/users/{id}` | Rôle, désactivation, suppression (admin) |
| GET | `/api/admin/audit` | Journal d'activité (admin) |
| GET | `/media/{fichier}` | Images de la médiathèque en stockage local (développement) |

### Sécurité

- **Mots de passe** : scrypt avec sel aléatoire, 12 caractères minimum (lettres et chiffres), comparaison à temps constant. Réponse identique pour un compte inconnu ou un mauvais mot de passe.
- **Sessions** : jeton aléatoire de 256 bits, stocké haché (SHA-256) en base ; cookie `HttpOnly`, `Secure` en production, `SameSite=Lax`, 7 jours. Désactiver un utilisateur ou changer son mot de passe ferme ses sessions.
- **Tentatives limitées** : connexion (5 par compte, 20 par IP, sur 15 min), contact, candidatures et téléversements.
- **CSRF** : toute requête qui modifie des données doit venir du site (en-têtes `Origin` et `Sec-Fetch-Site`) et être envoyée en JSON.
- **Validation stricte** côté serveur (zod) : champ inconnu refusé, longueurs bornées, corps limité à 256 Ko, liens `javascript:` et images externes refusés, identifiants contrôlés. Requêtes SQL paramétrées (Drizzle).
- **Fichiers** : type vérifié sur le contenu réel (signature), SVG refusés, noms aléatoires, images servies avec `nosniff` et une CSP qui interdit tout script. Une pièce « téléversée » doit provenir de l'espace de stockage du site. Les pièces jointes restent privées : le back-office les ouvre par un lien temporaire de 5 minutes.
- **Supabase** : le site se connecte directement à PostgreSQL et n'utilise le stockage que côté serveur, avec la clé secrète. Il n'utilise ni l'API de données, ni l'authentification de Supabase. Les migrations activent la sécurité par ligne (RLS) sur toutes les tables, sans aucune règle d'accès, car l'API de données de Supabase est ouverte sur le schéma public.
- **En-têtes** : Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`. Back-office exclu des moteurs de recherche.
- **Exports CSV** : cellules neutralisées contre l'injection de formules tableur.
- **Journal d'activité** : connexions, modifications de contenu, d'utilisateurs et de formulaires.
- **Anti-spam** : champ piège invisible sur les formulaires publics.

### Structure

| Dossier | Contenu |
| --- | --- |
| `src/app/[locale]/` | Pages publiques, en français et en anglais (lisent le contenu en base, mis en cache et invalidé à chaque modification) |
| `src/i18n/` | Langues du site : textes bilingues, liens, métadonnées, messages de validation |
| `src/app/admin/` | Back-office |
| `src/app/api/` | Endpoints |
| `src/server/` | Code serveur : base (`db/`), authentification (`auth/`), contenu, formulaires, médias, stockage, e-mails |
| `src/lib/content/` | Définition des blocs et collections : une seule description sert à la validation, aux formulaires du back-office et aux types |
| `drizzle/` | Migrations SQL |
| `scripts/db.ts` | Migrations, contenu initial, création d'administrateur, espaces de stockage |
| `requirements/`, `docs/` | Documents de cadrage d'InnovateBF (non utilisés par le site) |

Pour ajouter un champ à un bloc ou à une collection, il suffit de le déclarer dans `src/lib/content/definitions.ts` : le back-office affiche le champ et le serveur le valide automatiquement.

#### Contenus fixes (dans le code)

| Fichier | Contenu |
| --- | --- |
| `src/content/home.ts` | Accueil : une (titre, chapô, boutons, photo, signature), piliers (pictogramme et photo), textes des sections, programmes, bandeau final |
| `src/content/conference.ts` | Identité d'EBC2026 (nom, édition, slogan, intitulé, organisateur, logo), patronage, affiche, bloc « Appel à projets », TDR, appel, highlights |
| `src/content/innovatebf.ts` | Identité du site (nom, accroche, description), vision, mission, domaines d'action, pages À propos et Analyse |

Portraits des ministres du bandeau Patronage (`public/images/patronage`, page Conférence) : photos officielles du 22 janvier 2026 publiées sur Wikimedia Commons sous licence CC0 (domaine public, auteur Bamjo226), recadrées en carré ; à remplacer dans `src/content/conference.ts` (`patronage`) en cas de remaniement.

Photos des piliers (`public/images/piliers`, recadrées en 4:3) : banque [Pexels](https://www.pexels.com/license/), licence libre y compris pour un usage commercial, sans attribution obligatoire. Auteurs : RF._.studio (recherche), Ninthgrid (conseil, Lagos), Alex Levis (écosystème, Tanzanie), Zeal Creative Studios (formation, Accra).

Les chiffres clés de l'accueil sont calculés (jours de conférence, stands, partenaires, inventeurs). Les Top Inventeurs apparaissent sur la session de pitch (pages Intervenants et Programme), sur les Highlights et sur la page Conférence. Une modification de ces fichiers est en ligne au déploiement suivant.

### Pages

| Route | Contenu |
| --- | --- |
| `/` | Accueil : jusqu'au dernier jour de la conférence (`conference.end`), la une présente EBC2026 (logo, dates, lieu, décompte, organisateurs) et le bouton de l'en-tête mène au programme ; ensuite, retour automatique à la une InnovateBF et au bouton « Nous contacter » (`isConferenceAhead`, `src/lib/site.ts`). Les décomptes sont recalculés dans le navigateur du visiteur, au chargement puis à minuit (`src/components/Countdown.tsx`) : ils restent justes même quand la page est servie depuis le cache. Puis piliers, à la une (carrousel), conférence EBC2026, chiffres clés, programmes, écosystème, ressources, bandeau final |
| `/about`, `/domains`, `/domains/analysis`, `/contact` | Think tank |
| `/legal`, `/privacy` | Mentions légales, politique de confidentialité |
| `/innovons/conference` | Page centrale EBC2026 : patronage, la conférence en bref, Village de l'Innovation (cinq espaces), Challenge Jeunesse, intervenants invités, appel à projets, organisateurs, infos pratiques |
| `/innovons/conference/{appel-a-contributions, programme, intervenants, highlights, expositions, candidater}` | Sous-pages : programme en frise par jour, stands filtrables, candidature avec colonne d'aide |
| `/innovons/conference/intervenants` | Intervenants confirmés (collection « Intervenants » : nom, fonction, organisation, type d'intervention, sujet, photo, LinkedIn), pitchs des Top Inventeurs, organisateurs (logos liés à leur site), prises de parole du programme |

Les pages intérieures partagent les composants de `src/components/ui.tsx` (en-tête de page, sections, cartes à pictogramme, frise d'étapes, citation, bandeau d'appel à l'action, colonne latérale) et leur feuille `page.module.css`. **Intervenants invités** : les vingt intervenants du programme provisoire (quatre panels, dont cinq porteurs de projets CITADEL) sont amorcés depuis `src/server/content/seed-data.ts`. **Intervenants d'exemple** (facultatifs) : huit fiches fictives (nom « Exemple », rattachées aux sessions réelles du programme) présentent la page en attendant la liste confirmée. Elles portent la mention « Exemple » sur le site. Dans **Contenus → Intervenants**, un bouton les supprime (les vrais intervenants sont conservés) ou les rajoute ; pour transformer une fiche en vrai intervenant, saisissez les informations réelles et décochez « Fiche d'exemple ». Sans aucune fiche, la page affiche « Liste des intervenants à venir ». Données : `src/content/demo-speakers.ts`.

Le champ « Sujet de l'intervention » rattache un intervenant à une session : en reprenant l'intitulé d'une session du programme, l'intervenant apparaît sur cette session (pages Intervenants et Programme) et sa carte affiche le jour et la plage horaire (`src/lib/speakers.ts`).

Les anciennes adresses `/submit/ebc26` et `/submit/ebc26/soumettre` redirigent vers les nouvelles pages (`next.config.ts`).

### Langues : français et anglais

Le site public existe en français (langue par défaut, adresses sans préfixe : `/about`) et en anglais (adresses préfixées : `/en/about`). Le sélecteur FR / EN de l'en-tête ouvre la même page dans l'autre langue et mémorise le choix (cookie `NEXT_LOCALE`, un an) : un visiteur qui a choisi l'anglais est ensuite renvoyé vers les pages anglaises (`src/middleware.ts`). Les liens du sélecteur portent `?lang=fr|en` : le middleware enregistre le choix puis retire le paramètre, ce qui fonctionne aussi pour un lien ouvert dans un nouvel onglet. Une adresse inconnue reçoit, avec le statut 404, la page « introuvable » de sa langue (`src/app/[locale]/introuvable`), rendue par le serveur. **Toute nouvelle page publique doit être ajoutée à `PUBLIC_PATHS` (`src/lib/site.ts`)** : cette liste sert au middleware, au plan du site et à la mesure d'audience. Chaque page déclare ses versions dans les deux langues (balises `hreflang`, plan du site). Le back-office reste en français.

- **Textes fixes** (`src/content/`, composants) : chaque texte s'écrit en deux langues, `tr("Accueil", "Home")` dans les contenus (résolus par `localize(contenu, locale)`), `t("Accueil", "Home")` dans les composants (`translator(locale)`, `getT()` côté serveur, `useT()` côté client). Liens internes : `Link` de `src/i18n/Link.tsx`, qui ajoute `/en` sur le site anglais.
- **Contenus du back-office** : chaque texte affiché a un champ « (anglais) » facultatif, placé à côté du champ français. Laissé vide, le texte français s'affiche sur le site anglais. Les formats courants du programme (Panel, Pitchs, Pause…) sont traduits automatiquement (`src/i18n/labels.ts`) ; le sujet d'un intervenant rattaché à une session affiche l'intitulé anglais de la session.
- **Dates** : « 27–28 novembre 2026 » en français, « November 27–28, 2026 » en anglais ; les horaires saisis (« 08 h 30 – 18 h 30 ») s'affichent « 08:30 – 18:30 ».
- **Formulaires** : libellés, messages de validation et réponses du serveur dans la langue de la page ; l'e-mail de confirmation d'une candidature part dans la langue du candidat.

### Mesure d'audience

Le tableau de bord du back-office affiche l'audience du site, mesurée sans cookie ni service tiers (`src/server/analytics.ts`, `src/components/Analytics.tsx`) : chaque page vue envoie l'adresse de la page, sa langue et le site d'origine ; le serveur ajoute le type d'appareil et le pays (en-tête `x-vercel-ip-country`, fourni par Vercel). L'adresse IP n'est jamais stockée : un identifiant haché avec un sel aléatoire du jour, supprimé le lendemain, compte les visiteurs uniques de chaque journée sans permettre de les reconnaître d'un jour à l'autre. Le compteur de visiteurs en tête du tableau de bord additionne toutes les pages vues conservées, depuis la date qu'il affiche ; il repart de zéro si le site change de base de données. Les robots et les adresses inconnues sont ignorés, les données sont supprimées après 13 mois. La politique de confidentialité décrit ce dispositif.

### Animations

Apparition au défilement : ajouter `data-reveal` (variantes `fade`, `left`, `right`, `zoom`) et un délai avec `style={delay(120)}` (`src/lib/motion.ts`). Les animations sont désactivées si le système demande de limiter les mouvements, et le contenu reste visible sans JavaScript.

### Images

Les images de `public/images/` ont été fournies avec les maquettes (générées par IA) et optimisées en JPEG ; `hero-innovatebf.jpg` est la photo de la une. Elles peuvent être remplacées depuis le back-office (médiathèque, puis le bloc ou l'élément concerné).

Le monument de la une et la façade de l'Université Nazi BONI sont des lieux imaginés par l'IA : à remplacer par de vraies photos. Les armoiries du Burkina Faso (2025, Wikimedia Commons) remplacent les logos des ministères en attendant les fichiers officiels.

### Design

Maquette 2026 : bleu nuit (`#072a6b`), bleu vif (`#1a6fe8`) et orange (`#f2531c`) sur fonds bleu très clair, cartes et boutons très arrondis. Polices chargées avec `next/font` : Plus Jakarta Sans (texte et titres) et Caveat (signature manuscrite de la une). Les jetons de couleur et de police sont définis dans `src/app/globals.css`. Accueil : `src/app/[locale]/page.tsx` et `landing.module.css`.

Sur ordinateur, les marges suivent la grille « pixels de maquette » (`--lu`, 37 px de maquette de chaque côté) : en-tête, accueil, pages et pied de page sont alignés.
