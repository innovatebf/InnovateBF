# CLAUDE.md

Ce fichier fournit des instructions à Claude Code pour travailler sur le projet InnovateBF.

## Vue d'ensemble du projet

InnovateBF est un thinktank dédié à la promotion de la technologie endogène au Burkina Faso. Ce projet consiste à développer une plateforme web complète servant de hub pour la coordination, la collaboration et la promotion de l'innovation technologique burkinabè.

**Vision** : Un avenir où la technologie et l'innovation, enracinées dans nos valeurs socio-culturelles, sont les moteurs du développement durable au Burkina Faso.

**Langues** : Français (principal) et Anglais (bilingue)

## Stack technique

### Frontend
- **Framework** : Next.js 14+ (React) avec App Router
- **Styling** : Tailwind CSS
- **State Management** : React Context API / Zustand pour état global
- **Formulaires** : React Hook Form + Zod pour validation
- **Internationalisation** : next-intl ou react-i18next

### Backend & CMS
- **CMS** : Strapi (Headless CMS) ou WordPress avec API REST/GraphQL
- **API** : REST ou GraphQL selon CMS choisi
- **Base de données** : PostgreSQL
- **ORM** : Prisma (si custom backend) ou natif Strapi

### Infrastructure & Services
- **Hébergement** : Vercel (frontend) + service cloud pour backend
- **Stockage médias** : AWS S3 ou compatible (Cloudinary)
- **Authentification** : Auth0 ou NextAuth.js
- **Email** : Mailchimp ou Sendinblue
- **Paiements** : Stripe pour dons/contributions
- **Analytics** : Google Analytics 4 + Matomo (option privacy-first)

### DevOps
- **Version Control** : Git (GitHub)
- **CI/CD** : GitHub Actions
- **Monitoring** : Sentry pour erreurs, Vercel Analytics

## Structure du projet

```
innovate-bf/
├── apps/
│   ├── web/                    # Application Next.js principale
│   │   ├── app/               # App Router (Next.js 14+)
│   │   │   ├── [locale]/     # Routes internationalisées
│   │   │   │   ├── page.tsx  # Page d'accueil
│   │   │   │   ├── about/    # À propos
│   │   │   │   ├── domains/  # 6 domaines d'action
│   │   │   │   ├── submit/   # Soumission projets
│   │   │   │   ├── resources/ # Bibliothèque
│   │   │   │   ├── blog/     # Articles
│   │   │   │   └── contact/  # Contact
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── ui/           # Composants UI basiques
│   │   │   ├── layout/       # Header, Footer, Navigation
│   │   │   ├── domains/      # Composants des domaines
│   │   │   └── forms/        # Formulaires
│   │   ├── lib/              # Utilitaires et helpers
│   │   ├── public/           # Assets statiques
│   │   └── styles/           # Styles globaux
│   │
│   └── cms/                   # Backend Strapi (si utilisé)
│       ├── config/
│       ├── src/
│       │   ├── api/          # Modèles et contrôleurs
│       │   ├── extensions/
│       │   └── plugins/
│       └── database/
│
├── packages/                  # Packages partagés (optionnel)
│   ├── types/                # Types TypeScript partagés
│   └── utils/                # Utilitaires partagés
│
├── docs/                      # Documentation
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
│
└── scripts/                   # Scripts utilitaires
```

## Commandes de développement

### Installation initiale
```bash
# Installer les dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec les configurations nécessaires
```

### Développement
```bash
# Lancer le serveur de développement frontend
npm run dev

# Lancer le CMS Strapi (si applicable)
npm run cms:dev

# Lancer les deux en parallèle
npm run dev:all
```

### Build & Production
```bash
# Build frontend
npm run build

# Vérifier le build localement
npm run start

# Build CMS
npm run cms:build
```

### Tests & Qualité
```bash
# Tests unitaires
npm run test

# Tests end-to-end
npm run test:e2e

# Linter
npm run lint

# Formatter
npm run format

# Vérification TypeScript
npm run type-check

# Audit d'accessibilité
npm run a11y
```

### Base de données
```bash
# Migrations Prisma (si applicable)
npx prisma migrate dev
npx prisma generate
npx prisma studio

# Seeds
npm run db:seed
```

## Architecture & Conventions

### Conventions de code
- **TypeScript strict** : Toujours typer explicitement les fonctions et composants
- **Composants** : Utiliser les composants fonctionnels avec hooks
- **Nommage** :
  - Composants : PascalCase (ex: `ProjectCard.tsx`)
  - Fichiers utilitaires : camelCase (ex: `formatDate.ts`)
  - Constantes : UPPER_SNAKE_CASE
- **Import order** : React → Next.js → externes → internes → relatifs → styles
- **CSS** : Utiliser Tailwind CSS en priorité, éviter le CSS inline sauf exceptions

### Structure des composants
```typescript
// Exemple de structure de composant
interface ComponentProps {
  title: string;
  description?: string;
}

export function Component({ title, description }: ComponentProps) {
  // Hooks en premier
  const [state, setState] = useState();

  // Fonctions handlers
  const handleClick = () => {};

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Gestion des données
- Utiliser **React Query** (TanStack Query) pour le fetching de données
- Cache strategy : stale-while-revalidate
- Optimistic updates pour les mutations
- Error boundaries pour la gestion d'erreurs

### Authentification & Autorisation
Rôles définis :
- `visitor` : Visiteur non connecté
- `member` : Membre vérifié
- `evaluator` : Évaluateur de projets
- `editor` : Éditeur de contenu
- `moderator` : Modérateur
- `admin` : Administrateur

Middleware Next.js pour protection des routes selon rôles.

## Fonctionnalités principales

### 1. Page d'accueil
- Hero avec vision et CTA
- Présentation des 6 domaines d'action (cartes cliquables)
- Calendrier événements à venir
- Dernières actualités
- Newsletter signup

### 2. Six domaines d'action
1. **Analyse, Concept et Conseil** : Services de consulting
2. **Plateforme InnovonsEnsembleLeFaso** : Dashboard projets, forum, matchmaking
3. **Conférence EBC** : Événements, archives vidéos, billetterie
4. **Contribuer** : Financement, appels à projets
5. **Calendrier** : Événements interactifs exportables (iCal)
6. **Observatoire** : Veille technologique, dashboard

### 3. Soumission de projets
- Formulaire structuré avec validation
- Upload de pièces jointes
- Workflow : soumission → évaluation → décision → suivi
- Espace utilisateur pour suivi des candidatures

### 4. Plateforme InnovonsEnsembleLeFaso
- Liste organisée de projets avec filtres
- Vues multiples : besoins sociétaires, secteurs, solutions, maturité
- Forum/board avec système de vote
- Matchmaking projets-experts

### 5. Calendrier & Événements
- Calendrier interactif
- Filtres par type
- Export iCal
- Formulaire de soumission d'événements

### 6. Bibliothèque de ressources
- Rapports, études, outils téléchargeables
- Filtres thématiques
- Search functionality

## Exigences non-fonctionnelles

### Performance (KPIs)
- **Lighthouse Score** : ≥ 80 (mobile & desktop)
- **TTFB** : < 500ms
- **Core Web Vitals** :
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### Accessibilité
- **Conformité WCAG 2.1 niveau AA** obligatoire
- Tests avec lecteurs d'écran (NVDA, JAWS, VoiceOver)
- Navigation clavier complète
- Contraste minimum 4.5:1
- Alt text sur toutes les images
- ARIA labels appropriés

### SEO
- Meta tags optimisés (title, description, OG tags)
- Sitemap.xml automatique
- Robots.txt configuré
- Schema.org structured data :
  - Organization
  - Event
  - Article
  - BreadcrumbList
- URLs sémantiques et propres

### Sécurité
- **HTTPS** obligatoire
- Protection CSRF sur tous les formulaires
- Rate limiting sur API
- Sanitisation des inputs
- Protection anti-spam (reCAPTCHA v3 ou hCaptcha)
- Headers de sécurité (CSP, HSTS, X-Frame-Options)
- Sauvegardes quotidiennes automatiques
- Gestion des secrets via variables d'environnement

### RGPD & Privacy
- Consentement explicite pour newsletter
- Bannière cookies conforme
- Politique de confidentialité
- Droit à l'oubli implémenté
- Minimisation des données collectées

## Internationalisation (i18n)

### Langues supportées
- Français (fr) - défaut
- Anglais (en)

### Structure des traductions
```
locales/
├── fr/
│   ├── common.json
│   ├── domains.json
│   ├── forms.json
│   └── ...
└── en/
    ├── common.json
    ├── domains.json
    ├── forms.json
    └── ...
```

### Convention
- Clés en minuscules avec underscores : `submit_project_title`
- Namespaces par section : `domains.analysis.title`
- Toujours fournir traductions FR et EN

## Intégrations tierces

### Analytics
- **Google Analytics 4** : Tracking complet
- **Search Console** : SEO monitoring
- **Matomo** (optionnel) : Alternative privacy-first

### Communication
- **Mailchimp/Sendinblue** : Newsletter et emails transactionnels
- Webhooks pour synchronisation événements

### Médias
- **YouTube/Vimeo** : Hébergement vidéos conférences
- **Cloudinary** : Optimisation images

### Paiements
- **Stripe** : Dons et contributions
- **PayPal** : Alternative paiements

## Workflows clés

### Workflow de soumission de projet
1. Utilisateur remplit formulaire
2. Validation côté client (Zod schema)
3. Soumission → accusé réception automatique (email)
4. Évaluation par équipe (tableau de bord admin)
5. Notification décision (accepté/refusé)
6. Si accepté → publication sur plateforme
7. Suivi et updates dans espace utilisateur

### Workflow de publication d'article
1. Rédaction dans CMS
2. Relecture par éditeur
3. Approbation par admin
4. Publication automatique
5. Diffusion newsletter + réseaux sociaux

### Workflow d'événement
1. Création événement (formulaire ou CMS)
2. Modération
3. Synchronisation calendrier public
4. Export iCal disponible
5. Rappels automatiques (J-7, J-1)

## KPIs & Mesures de succès

### Métriques à tracker
- Temps moyen sur site : objectif ≥ 2 min
- Taux de conversion newsletter : objectif ≥ 3%
- Soumissions de projets : objectif 10/trimestre
- Croissance visites organiques : +10% mois/mois
- Inscriptions événements calendrier : 10/an
- Téléchargements ressources
- Engagement forum (posts, votes)

### Dashboard Analytics
Créer un dashboard interne pour visualiser :
- Visiteurs uniques et pages vues
- Top pages et temps passé
- Taux de rebond
- Conversions (newsletter, soumissions, dons)
- Événements trackés (clicks CTA, downloads, etc.)

## Roadmap de développement

### Phase 0 : Cadrage (2 semaines)
- [x] PRD finalisé
- [ ] Wireframes et maquettes
- [ ] Arborescence validée
- [ ] Setup projet et repository

### Phase 1 : MVP (4-6 semaines)
- [ ] Home + Header/Footer
- [ ] Pages statiques (About, Domaines overview)
- [ ] Blog basique avec CMS
- [ ] Formulaire contact
- [ ] Formulaire soumission simple
- [ ] Authentification basique
- [ ] Responsive design

### Phase 2 : Fonctions avancées (4 semaines)
- [ ] Plateforme InnovonsEnsembleLeFaso (dashboard projets)
- [ ] Calendrier interactif + export iCal
- [ ] Observatoire (dashboard veille)
- [ ] Gestion utilisateurs avec rôles
- [ ] Workflow complet soumission
- [ ] Forum/board avec votes
- [ ] Espace utilisateur personnel

### Phase 3 : Optimisation (2-4 semaines)
- [ ] Internationalisation FR/EN complète
- [ ] SEO avancé (structured data, sitemap)
- [ ] Analytics et tracking
- [ ] Intégration paiements (Stripe)
- [ ] Performance optimization
- [ ] Tests accessibilité complets
- [ ] Tests de charge

### Phase 4 : Lancement & Maintenance (ongoing)
- [ ] Déploiement production
- [ ] Monitoring et alertes
- [ ] Support technique
- [ ] Plan éditorial contenu
- [ ] Améliorations itératives basées sur feedback

## Variables d'environnement

```bash
# Next.js
NEXT_PUBLIC_SITE_URL=https://innovatebf.org
NEXT_PUBLIC_DEFAULT_LOCALE=fr

# CMS API
CMS_API_URL=http://localhost:1337
CMS_API_TOKEN=your-token-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/innovatebf

# Auth
AUTH_SECRET=your-secret-here
AUTH_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
MAILCHIMP_API_KEY=your-key

# Storage
S3_BUCKET_NAME=innovatebf-media
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
MATOMO_SITE_ID=1
MATOMO_URL=https://analytics.example.com

# Payments
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Other
RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

## Guide de contribution

### Avant de commencer
1. Lire ce CLAUDE.md entièrement
2. Vérifier les issues GitHub pour éviter les duplications
3. Setup l'environnement de développement local

### Workflow Git
```bash
# Créer une branche depuis main
git checkout -b feature/nom-fonctionnalite

# Commits atomiques avec messages clairs
git commit -m "feat(domains): add observatoire dashboard"

# Avant de push, vérifier qualité
npm run lint && npm run type-check && npm run test

# Push et créer PR
git push origin feature/nom-fonctionnalite
```

### Convention de commits
Format : `type(scope): description`

Types :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage, pas de changement de code
- `refactor` : Refactoring
- `test` : Ajout/modification tests
- `chore` : Maintenance, config

### Code Review
- Tous les PRs nécessitent une review
- Tests passants obligatoires
- Lighthouse score maintenu
- Accessibilité vérifiée
- Documentation à jour

## Dépannage & FAQ

### Build fails
```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run build
```

### CMS connection issues
Vérifier `CMS_API_URL` et `CMS_API_TOKEN` dans `.env.local`

### Performance issues
1. Vérifier bundle size : `npm run analyze`
2. Optimiser images (WebP, lazy loading)
3. Code splitting avec dynamic imports
4. Vérifier React Query cache strategy

### i18n not working
Vérifier que les fichiers de traduction existent pour les deux langues (fr, en)

## Ressources utiles

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Strapi Docs](https://docs.strapi.io)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)

### Design System
- Respecter la charte graphique burkinabè
- Couleurs : à définir selon branding
- Typographie : à définir selon branding
- Composants UI : shadcn/ui ou Radix UI

### Accessibilité
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)

## Contact & Support

Pour toute question sur le développement :
- **Repository** : [GitHub URL à ajouter]
- **Documentation** : `/docs` dans ce repository
- **Issues** : GitHub Issues

---

**Dernière mise à jour** : 2026-01-22
**Version** : 1.0.0
**Statut** : En développement actif (Phase 0)
