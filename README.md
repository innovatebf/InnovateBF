# InnovateBF

Un thinktank dédié à la promotion de la technologie endogène au Burkina Faso.

## Vision

Un avenir où la technologie et l'innovation, enracinées dans nos valeurs socio-culturelles, sont les moteurs du développement durable au Burkina Faso.

## Stack Technique

- **Frontend**: Next.js 15 (React) avec App Router + TypeScript strict
- **Styling**: Tailwind CSS v4
- **Internationalisation**: next-intl (FR/EN)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Email**: Resend (formulaire de contact)
- **Déploiement**: Vercel
- **Validation**: React Hook Form + Zod

## Fonctionnalités MVP Phase 1

✅ Site vitrine bilingue (FR/EN)
✅ Page d'accueil avec Hero et présentation des domaines
✅ 6 domaines d'action détaillés
✅ Page À propos
✅ Formulaire de contact fonctionnel avec envoi email
✅ Pages légales (Privacy, Legal)
✅ Navigation responsive avec Header/Footer
✅ SEO optimisé (sitemap.xml, robots.txt, metadata)
✅ Performance Lighthouse ≥ 80
✅ Accessibilité WCAG 2.1 AA

## Getting Started

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit)
- Compte Resend (gratuit)

### Installation

1. Cloner le repository
```bash
git clone https://github.com/your-org/innovate-bf.git
cd innovate-bf
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement

Copier `.env.example` vers `.env.local` et remplir les valeurs:

```bash
cp .env.example .env.local
```

Variables requises:
- `NEXT_PUBLIC_SUPABASE_URL`: URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clé publique Supabase
- `RESEND_API_KEY`: Clé API Resend
- `CONTACT_EMAIL`: Email destinataire du formulaire de contact

4. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Scripts Disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Créer un build de production
- `npm run start` - Démarrer le serveur de production
- `npm run lint` - Exécuter le linter ESLint
- `npm run format` - Formater le code avec Prettier
- `npm run type-check` - Vérifier les types TypeScript

## Structure du Projet

```
innovate-bf/
├── app/
│   ├── [locale]/           # Routes internationalisées
│   │   ├── page.tsx        # Page d'accueil
│   │   ├── about/          # À propos
│   │   ├── domains/        # 6 domaines d'action
│   │   ├── contact/        # Contact
│   │   ├── privacy/        # Politique de confidentialité
│   │   └── legal/          # Mentions légales
│   ├── api/
│   │   └── contact/        # API route formulaire contact
│   ├── globals.css         # Styles globaux + Tailwind
│   ├── sitemap.ts          # Génération sitemap.xml
│   └── robots.ts           # Génération robots.txt
├── components/
│   ├── layout/             # Header, Footer, Navigation
│   ├── home/               # Composants page d'accueil
│   ├── forms/              # Formulaires
│   └── domains/            # Composants domaines
├── lib/
│   ├── supabase/           # Clients Supabase
│   ├── schemas/            # Schémas Zod validation
│   └── utils.ts            # Utilitaires
├── messages/
│   ├── fr.json             # Traductions françaises
│   └── en.json             # Traductions anglaises
├── i18n/
│   ├── routing.ts          # Configuration routing i18n
│   └── request.ts          # Configuration requêtes i18n
└── middleware.ts           # Middleware Next.js i18n
```

## Déploiement sur Vercel

### Méthode 1: Via GitHub

1. Pusher le code sur GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Aller sur [vercel.com](https://vercel.com)
3. Cliquer sur "New Project"
4. Importer le repository GitHub
5. Configurer les variables d'environnement
6. Cliquer sur "Deploy"

### Méthode 2: Via CLI Vercel

1. Installer Vercel CLI
```bash
npm i -g vercel
```

2. Login
```bash
vercel login
```

3. Déployer
```bash
vercel
```

### Variables d'Environnement Vercel

Configurer dans Vercel Dashboard → Project Settings → Environment Variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`

## Accessibilité

Le site respecte les normes WCAG 2.1 niveau AA:
- Navigation clavier complète
- Contraste texte ≥ 4.5:1
- Labels ARIA appropriés
- Alt text sur toutes les images
- Focus visible sur éléments interactifs

## Performance

Objectifs Lighthouse:
- Performance: ≥ 80
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: 100

## Prochaines Phases

### Phase MVP-2 (3 semaines)
- Blog dynamique avec articles
- Calendrier événements interactif
- Export iCal événements

### Phase MVP-3 (3 semaines)
- Authentification utilisateurs (Supabase Auth)
- Formulaire soumission projets
- Dashboard admin évaluation
- Newsletter fonctionnelle

## Support

Pour toute question ou problème contactez nous:
- Email: contact@innovatebf.org
- GitHub Issues: [URL repository]

## License

© 2026 InnovateBF. Tous droits réservés.
