
# **Product Requirements Document (PRD) – Page « Key Impact » (KI) de la plateforme InnovonsEnsembleLeFaso**  

*Version : 1.0 – 16 mars 2026*  
*Auteur : ChatGPT (support produit)*  

---  

## 1. Contexte & Objectif

| Élément | Description |
|---|---|
| **Produit** | InnovonsEnsembleLeFaso – plateforme collaborative de recensement, de financement et de résolution des besoins sociétaux du Burkina Faso. |
| **Page cible** | **KI (Key Impact)** – page d’accueil (ou section dédiée) qui présente les indicateurs clés d’impact sous forme de cartes statistiques (cards). |
| **Pourquoi** | Permettre à chaque visiteur (administrateur, parrain, porteur de besoin, innovateur, public) de visualiser instantanément l’impact collectif du dispositif : nombre de besoins recensés, solutions proposées, parrains actifs, population impactée et budget mobilisé. |
| **Objectif business** | - Renforcer la transparence et l’engagement des parties prenantes.<br>- Augmenter le taux de conversion des visiteurs en parrains ou porteurs de besoin (+10 % d’inscriptions).<br>- Contribuer à la KPI « Population impactée » du tableau de bord public (objectif ≥ 1 M d’individus d’ici fin 2026). |
| **Vision** | Faire de la page KI le « pointe‑d’yeux » visuel du projet, où chaque chiffre provient de données réelles (mock → production) et se met à jour automatiquement. |

---

## 2. Parties prenantes (Stakeholders)

| Rôle | Responsabilités | Priorité d’implication |
|---|---|---|
| **Product Owner (PO)** | Définit les exigences fonctionnelles, valide les livrables. | Haute |
| **UX‑Designer** | Conçoit les maquettes, définit la grille responsive et le style visuel. | Haute |
| **Développeur Front‑end (React)** | Implémente la page KI, intègre les icônes Lucide‑React, gère le formatage des nombres. | Haute |
| **Développeur Back‑end (NestJS / Python)** | Expose l’API `/stats/summary` alimentée par les mock → données réelles. | Moyenne |
| **Data Analyst** | Vérifie les agrégations (somme populations, budget, comptage besoins/propositions). | Moyenne |
| **QA/Test Engineer** | Rédige les tests unitaires et e2e, assure la conformité aux critères d’acceptation. | Haute |
| **Marketing / Community Manager** | Utilise les KPI pour les newsletters et les campagnes de sensibilisation. | Basse |
| **Compliance / DPO** | Vérifie la conformité RGPD/BF‑DPPA des données affichées. | Basse |

---

## 3. Description fonctionnelle de la page KI

### 3.1. Fonctionnalités principales

| ID | Fonctionnalité | Description | Priorité |
|---|---|---|---|
| **KI‑F01** | **Affichage dynamique de 5 cartes statistiques** | - Chaque carte montre un titre, un icône Lucide‑React, une valeur numérique formatée (ex. « 992K+ »).<br>- Valeurs proviennent d’une API centralisée, calculées à partir des collections `needs`, `proposals`, `users (role=parrain)`, `populations`, `budgets`. | Must‑Have |
| **KI‑F02** | **Grille responsive 5‑colonnes** | - Sur écrans ≥ 1280 px → 5 colonnes.<br>- Tablet (≥ 768 px) → 2‑3 colonnes selon largeur.<br>- Mobile (< 768 px) → 1‑2 colonnes, cartes empilées. | Must‑Have |
| **KI‑F03** | **Icône “UsersRound” pour “Population impactée”** | Utiliser le composant `UsersRound` de `lucide-react` (taille 24 px, couleur `primary`). | Must‑Have |
| **KI‑F04** | **Formattage des nombres** | - > 1 000 → `K` (ex : 1 500 → 1.5K).<br>- > 1 000 000 → `M` (ex : 90 000 000 → 90 M).<br>- > 1 000 000 000 → `Mds`. | Must‑Have |
| **KI‑F05** | **Mise à jour en temps réel (polling ou websockets)** | Requête API toutes les 5 minutes (ou via socket.io) pour refléter les nouveaux besoins/propositions sans re‑chargement. | Nice‑to‑Have |
| **KI‑F06** | **Accessibilité WCAG 2.1 AA** | Contraste couleur, texte alt, navigation clavier. | Must‑Have |
| **KI‑F07** | **Internationalisation (FR/EN)** | Titres des cartes traduits via i18n (`react-intl`). | Must‑Have |
| **KI‑F08** | **Lien « Voir plus »** | chaque carte redirige vers la page concernée (ex : Besoins → `/needs`, Budget → `/dashboard`). | Nice‑to‑Have |

### 3.2. Données affichées (au moment du lancement)

| Carte | Source de données | Calcul |
|---|---|---|
| **Besoins recensés** | `needs` (mockNeeds) | `COUNT(*)` → **6** |
| **Solutions proposées** | `proposals` (mockProposals) | `COUNT(*)` → **4** |
| **Parrain actif** | `users` where `role='parrain'` | `COUNT(*)` → **1** |
| **Population impactée** | `needs.populationImpact` (somme) | `85 000 + 250 000 + 12 000 + 450 000 + 120 000 + 75 000 = 992 000` → **992K+** |
| **Budget mobilisé** | `needs.budget` (somme) | `90 000 000 FCFA` → **90 M** |

---

## 4. User Stories (exemples)

| ID | En tant que | Je veux | Pour que |
|---|---|---|---|
| **KI‑US01** | Visiteur | Voir les indicateurs clés dès la page d’accueil | Comprendre rapidement l’impact du projet |
| **KI‑US02** | Parrain | Cliquer sur la carte “Budget mobilisé” pour accéder aux détails | Vérifier les financements déjà alloués |
| **KI‑US03** | Admin | Savoir que les chiffres sont calculés automatiquement à partir des données | Garantir la fiabilité du reporting |
| **KI‑US04** | Utilisateur mobile | Lire les cartes sans devoir zoomer | Accéder à l’information partout |
| **KI‑US05** | Data Analyst | Recevoir les valeurs via une API JSON | Pouvoir les ré‑utiliser dans d’autres rapports |

---

## 5. Exigences non fonctionnelles (NFR)

| ID | Exigence | Valeur cible | Métrique de vérification |
|---|---|---|---|
| **KI‑NF01** | Performance – Temps de rendu | < 1 s sur 3G | Lighthouse, métrique “First Contentful Paint” |
| **KI‑NF02** | Fiabilité – Disponibilité API | ≥ 99,5 % (SLA) | Monitoring ping (Grafana) |
| **KI‑NF03** | Sécurité – Pas de fuite de données sensibles | Aucun champ personnel dans la réponse | Test d’intrusion OWASP ZAP |
| **KI‑NF04** | Accessibilité – WCAG 2.1 AA | Conformité | Axe‑core audit |
| **KI‑NF05** | Internationalisation – FR & EN | 100 % des strings traduites | Tests unitaires i18n |
| **KI‑NF06** | Maintenabilité – Couverture tests | ≥ 80 % des fonctions de la page | Jest + Cypress coverage |
| **KI‑NF07** | Scalabilité – 10 000 utilisateurs simultanés | Pas de dégradation > 20 % | Load‑test (k6) |

---

## 6. Architecture technique

```
+-------------------+          +--------------------------+
|   Front‑end       |  HTTPS   |   API Gateway (NestJS)   |
|  React (Vite)     | <------> |   /stats/summary         |
|  Lucide‑React     |          +--------------------------+
|  i18n, Redux      |                    |
+-------------------+                    |
          |                               |
          v                               v
+-------------------+          +--------------------------+
|   Cache (Redis)   | <--TTL-- |   Service Stats (Node)   |
|   (optional)      |          |   Calculates aggregates  |
+-------------------+          +--------------------------+
          |
          v
+-------------------+
|   DB (PostgreSQL) |
|   tables: needs, |
|   proposals, users|
+-------------------+
```

* **Front‑end** : composant `StatsGrid` → récupère `GET /api/v1/stats/summary`.  
* **Back‑end** : endpoint qui exécute 5 requêtes agrégées (COUNT / SUM) et renvoie le JSON suivant :

```json
{
  "needsCount": 6,
  "proposalsCount": 4,
  "parrainsCount": 1,
  "populationImpact": 992000,
  "budgetMobilise": 90000000
}
```

* **Cache** (Redis) : stocke le résultat pendant 5 minutes pour réduire la charge DB.

---

## 7. Maquettes & UI (Résumé)

| Élément | Description | Dimensions | Couleurs |
|---|---|---|---|
| **Card** | Fond blanc, ombre légère, bordure radius 8 px, padding 16 px. | 280 × 120 px (min) | Texte `#212529`, icône `#0d6efd` (primary) |
| **Icon** | `UsersRound` (pour Population), `FileText` (Besoins), `CheckCircle` (Solutions), `BadgeDollarSign` (Budget), `UserCheck` (Parrain). | 24 px | `primary` |
| **Titre** | `<h4>` avec poids `600`, taille `1rem`. | — | `#495057` |
| **Valeur** | `<p>` style `font-size: 1.5rem; font-weight: 700`. | — | `#212529` |
| **Lien “Voir plus”** | Sous‑texte bleu souligné, visible au hover. | — | `#0d6efd` |
| **Responsive Grid** | CSS Grid `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));` | — | — |

*Les maquettes haute‑fidélité sont disponibles dans le dossier `design/ki-page/` (Figma link).*

---

## 8. Critères d’acceptation (Definition of Done)

| ID | Condition | Méthode de vérification |
|---|---|---|
| **C‑KI‑01** | Les 5 cartes s’affichent correctement sur desktop (> 1280 px) avec 5 colonnes. | Inspection visuelle + Cypress test de layout |
| **C‑KI‑02** | Sur mobile (< 768 px) les cartes s’empilent (1‑2 par ligne). | Cypress + BrowserStack |
| **C‑KI‑03** | Valeurs affichées correspondent exactement aux agrégats calculés sur la base de données (ex. 992 000 → “992K+”). | Test unitaires du service back‑end + comparaison JSON |
| **C‑KI‑04** | Le formatage des nombres respecte la règle K/M/Mds et ajoute le suffixe “+” pour les valeurs supérieures au seuil (ex. 992 K+). | Unit test `formatNumber()` |
| **C‑KI‑05** | L’icône “UsersRound” apparaît uniquement sur la carte “Population impactée”. | Snapshot visual Cypress |
| **C‑KI‑06** | Le lien “Voir plus” de chaque carte redirige vers la bonne URL et conserve le paramètre de langue. | Cypress navigation test |
| **C‑KI‑07** | La page passe les audits d’accessibilité (axe‑core score ≥ 90). | axe‑core CLI |
| **C‑KI‑08** | Le temps de rendu (FCP) < 1 s sur réseau 3G simulé. | Lighthouse CI |
| **C‑KI‑09** | Aucun champ personnel n’est exposé dans la réponse `/stats/summary`. | OWASP ZAP + revue de code |
| **C‑KI‑10** | La documentation API (`/docs/api#stats-summary`) est à jour et inclut les exemples de réponse. | Review de Swagger/OpenAPI |

Une fois tous les critères validés, la page KI est **Produit‑Ready** et sera déployée dans le cadre du **Release 1.0 (MVP) – 15 août 2026**.

---

## 9. Dépendances & Risques

| Dépendance | Action requise | Date cible |
|---|---|---|
| **API `/stats/summary`** | Implémenter le endpoint backend, ajouter tests. | Sprint 4 (fin avril 2026) |
| **Icônes Lucide‑React** | Installer `lucide-react@^0.300.0`. | Sprint 2 |
| **Mock data** | Intégrer `mockNeeds` et `mockProposals` dans le seed DB. | Sprint 3 |
| **Internationalisation** | Ajouter entries FR/EN dans `src/i18n/ki.json`. | Sprint 3 |
| **Cache Redis** (optionnel) | Provisionner Redis dans l’infrastructure K8s. | Sprint 5 |

| Risque | Impact | Mitigation |
|---|---|---|
| **Déviation entre mock et données réelles** | KPI affichés incohérents → perte de confiance. | Implémenter tests de régression sur agrégations; mise à jour automatique du seed chaque sprint. |
| **Performance sous forte charge** | Temps de rendu > 2 s. | Utiliser Redis cache + pagination des requêtes agrégées. |
| **Non‑conformité RGPD** (exposition de données personnelles) | Blocage juridique. | Filtrer les champs sensibles dans le service stats; audit DPO avant go‑live. |
| **Mauvaise traduction** | Confusion utilisateurs multilingues. | Revue linguistique par le Community Manager avant le sprint 4. |

---

## 10. Planning & Livraison

| Sprint | Dates | Livrable KI |
|---|---|---|
| **S‑02** | 15 – 28 mars 2026 | Architecture, création du repo `frontend/ki-page`, mise en place de `lucide-react`. |
| **S‑03** | 29 mars – 11 avril 2026 | Maquettes UI validées, implémentation du composant `StatsCard`. |
| **S‑04** | 12 – 25 avril 2026 | API `/stats/summary` (backend) + tests unitaires, intégration front‑end. |
| **S‑05** | 26 avril – 9 mai 2026 | Gestion du cache Redis, responsive grid, i18n. |
| **S‑06** | 10 – 23 mai 2026 | Tests e2e Cypress, audit accessibilité, documentation API. |
| **S‑07** | 24 mai – 6 juin 2026 | Validation finale, mise en pré‑production, revue DPO. |
| **Release** | **15 août 2026** | Déploiement en prod, monitoring activé, communication interne & externe. |

---

## 11. Annexes

1. **Schéma JSON de l’API** – `src/api/v1/stats/summary.schema.json`  
2. **Fichier de style SCSS** – `src/styles/ki-grid.scss` (grid + breakpoints)  
3. **Liste des traductions (FR/EN)** – `src/i18n/ki.json`  
4. **Guide de test Cypress** – `cypress/integration/ki_page.spec.js`  
5. **Checklist de conformité WCAG** – annexé (xlsx).  

---

### **Conclusion**

Le PRD ci‑dessus décrit de manière exhaustive la **page “Key Impact” (KI)**, depuis le besoin métier jusqu’aux spécifications techniques et aux critères d’acceptation. En suivant ce document, l’équipe pourra livrer une page d’impact fiable, responsive, multilingue et prête à soutenir les objectifs de visibilité et de mobilisation de la plateforme **InnovonsEnsembleLeFaso**.  

*Préparé pour le sprint 2 – lancement du développement.*