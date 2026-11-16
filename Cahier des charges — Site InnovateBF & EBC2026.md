# Cahier des charges — Site InnovateBF & EBC2026

Oct 23, 2026 · @mass

## 1. Contexte et objectifs

Le site innovatebf.org (think tank InnovateBF) doit être entièrement refait avec le design de la page [ebc26.vercel.app](https://ebc26.vercel.app), et la conférence EBC2026 doit y devenir une rubrique à part entière. LeGuideIA réalise tout le site, en contrepartie d'une visibilité publicitaire pendant EBC2026.

Objectifs :

- Donner à InnovateBF un site cohérent, en français par défaut, sans contenu « random » ni rubrique vide.
- Faire de la page Conférence EBC2026 la vitrine de l'événement : programme, intervenants, appel à contributions, highlights, expositions, partenaires.
- Être en ligne bien avant la conférence (27-28 novembre 2026 selon les TDR), qui servira aussi à présenter Burkina-news.com et LeGuideIA aux autorités.

Point de départ : la maquette d'accueil `innovatebf-accueil-4Samba.html` proposée par Alfred, validée par Hermann le 23 octobre avec des corrections (voir sections 5 et 6).

## 2. Parties prenantes

| Personne | Organisation | Rôle sur le projet |
| --- | --- | --- |
| Hermann Bayala | InnovateBF / comité EBC2026 | Commanditaire, valide le contenu et le design |
| Alfred Dah | LeGuideIA | Chef de projet, interface avec Hermann |
| Samba Diop | LeGuideIA | Développement et intégration de tout le site |
| Amadou Sienou | InnovateBF | Donne les accès à l'organisation et au repo GitHub |
| Francis Ouédraogo | Sankora.ai | Auteur d'ebc26.vercel.app ; son équipe n'est plus disponible (mémoires jusqu'au 31 octobre) |

Samba porte donc seul le développement : le périmètre et le planning en tiennent compte.

## 3. Arborescence du site

Le menu garde cinq entrées ; trois sous-pages de la conférence sont à créer et deux existent avec des données fictives à remplacer.

&#91;embedded content: arborescence du site · 5 entrées de menu, 13 sous-rubriques\]

Les pages InnovonsEnsembleLeFaso (Besoins, Appels, Connexion) restent en ligne mais ne sont plus reliées au menu.

## 4. Fonctionnalités transverses

Ces exigences s'appliquent à toutes les pages du site.

| # | Fonctionnalité | Exigence |
| --- | --- | --- |
| T1 | Design unifié | Reprendre le design d'ebc26.vercel.app (couleur principale vert #0b6b3a) sur tout innovatebf.org, y compris les pages InnovonsEnsembleLeFaso |
| T2 | Menu principal | Accueil, À propos, Domaines d'action, Conférence EBC2026, Contact |
| T3 | Langue | Français par défaut ; sélecteur FR / EN conservé seulement si la version anglaise est maintenue (point P8) |
| T4 | Responsive | Affichage correct sur mobile, tablette et ordinateur, menu hamburger sur mobile |
| T5 | Pas de rubrique vide | Toute rubrique sans contenu réel est masquée ou affiche « Détails à venir » sans lien |
| T6 | Pas de contenu fictif | Supprimer les données d'exemple : intervenants fictifs, dates « 15 Oct. », téléphone « +226 XX XX XX XX », chiffres non confirmés (500+ participants, 30+ intervenants) |
| T7 | Pied de page | Logo et présentation InnovateBF, liens utiles, Politique de confidentialité, Mentions légales, coordonnées réelles |
| T8 | Référencement | Titre et description par page ; corriger `og:url` qui pointe aujourd'hui sur `localhost:3001` |
| T9 | Performance | Images optimisées (logos et photos des highlights compressés) |
| T10 | Visibilité LeGuideIA | Mention ou logo LeGuideIA / Burkina-news.com, conformément à la contrepartie convenue (emplacement à valider, point P9) |

## 5. Pages InnovateBF

### 5.1 Accueil

- [ ] Partir de la maquette `innovatebf-accueil-4Samba.html` validée par Hermann.
- [ ] Grand logo EBC2026 en haut de page, cliquable vers `/innovons/conference`.
- [ ] Bloc « Candidature Projets EBC'26 » avec bouton Soumettre un projet, tant que l'appel est ouvert.
- [ ] Section Domaines d'action reprenant les cartes de la page dédiée (mêmes règles qu'en 5.3).
- [ ] Retirer le bloc Newsletter « Bientôt disponible » tant qu'il n'est pas fonctionnel.
- [ ] Retirer les rubriques vides de la maquette : Devenir membre, Statuts, Règlement intérieur.

### 5.2 À propos (`/about`)

- [ ] Vision et Mission (contenu actuel conservé).
- [ ] Aucune rubrique Statuts, Règlement intérieur ou Devenir membre tant que les textes ne sont pas fournis.

### 5.3 Domaines d'action (`/domains`)

- [ ] Remplacer « Six axes stratégiques pour promouvoir l'innovation technologique burkinabè » par « Axes stratégiques pour promouvoir l'innovation technologique burkinabè ».
- [ ] Masquer les cartes « Contribuer » et « Calendrier ».
- [ ] Carte « Observatoire » : remplacer « En savoir plus → » par « Détails à venir », sans lien.
- [ ] Carte « Plateforme InnovonsEnsembleLeFaso » : remplacer « En savoir plus → » par « Détails à venir », sans lien.
- [ ] Carte « Conférence EBC » : lien vers `/innovons/conference`.
- [ ] Carte « Analyse, Concept et Conseil » : lien vers `/domains/analysis`.

### 5.4 Analyse, Concept et Conseil (`/domains/analysis`)

- [ ] Remplacer « Un ministre informe ses Directeurs Généraux qu'il veut budgétiser 10 projets supplémentaires dont les résultats seront rapportés au Conseil des Ministres au prochain trimestre, en priorisant les solutions endogènes. »
- [ ] par « Un responsable informe ses directeurs qu'il veut budgétiser 10 projets supplémentaires dont les résultats seront rapportés au prochain conseil trimestriel, en priorisant les solutions endogènes. »

### 5.5 Contact (`/contact`)

- [ ] Formulaire de contact : nom, e-mail, objet, message, envoi vers l'adresse officielle InnovateBF (à fournir, point P10).
- [ ] Coordonnées réelles uniquement.

### 5.6 Pages légales

- [ ] Politique de confidentialité et Mentions légales : vérifier qu'elles ont un contenu réel, sinon les retirer du pied de page.

## 6. Conférence EBC2026

### 6.1 Page centrale (`/innovons/conference`)

- [ ] Logo EBC2026 (fichier `LogoEBC2026.png` fourni) et slogan « Échangeons, Bâtissons, Contribuons ».
- [ ] Dates et **lieu** bien visibles : CEA-UNB, Bobo-Dioulasso ; organisation : CCPS de l'Université Nazi BONI (dates à confirmer, point P1).
- [ ] Cinq boutons visuels vers les sous-pages : Appel à contributions, Programme, Intervenants, Highlights, Expositions.
- [ ] Bloc **Patronage** : Ministre de l'Enseignement supérieur, de la Recherche et de l'Innovation (MESRI).
- [ ] Bloc **Co-parrainage** : Ministre de la Transition digitale, des Postes et des Communications électroniques ; Ministre de l'Enseignement secondaire, de la Formation professionnelle et technique (MESFPT).
- [ ] Bloc **Co-organisateurs** avec les logos fournis par Hermann (partenaires des TDR : InnovateBF, BSB, CITADEL, Abamix, Sankora.ai).
- [ ] Bloc **Sponsors** réservé, affiché « Bientôt disponible » tant qu'aucun accord n'est signé.
- [ ] Retirer les chiffres non confirmés (500+, 30+, « 3 thématiques » alors que les TDR en comptent 6).
- [ ] Formulaire d'inscription : nom, e-mail, organisation, type (Participant, Intervenant, Sponsor, Presse) ; vérifier qu'il enregistre ou envoie réellement les inscriptions.

### 6.2 Appel à contributions (à créer)

- [ ] Reprendre le contenu d'ebc26.vercel.app : objectifs, axes thématiques, modalités, critères.
- [ ] Dates actualisées, dont la clôture (31 octobre 2026 affichée aujourd'hui).
- [ ] Lien vers le formulaire existant `/submit/ebc26/soumettre` ; candidature gratuite.
- [ ] Après la clôture : bouton désactivé et mention « Candidatures closes ».

### 6.3 Programme (existante, à adapter)

- [ ] Remplacer les créneaux fictifs par la grille du fichier `EBC2026_programme_stands_27-28nov2026.xlsx` : 31 créneaux sur 2 jours.
- [ ] Onglets Jour 1 / Jour 2 avec les bonnes dates (aujourd'hui « 15 Oct. / 16 Oct. »).
- [ ] Pour chaque créneau : horaire, type (cérémonie, plénière, atelier), titre, intervenant.
- [ ] Créneaux non confirmés : version allégée ou mention « À confirmer » (point P4).

### 6.4 Intervenants (existante, à adapter)

- [ ] Supprimer les six profils fictifs actuels.
- [ ] Fiche par intervenant confirmé : photo ou initiales, nom, fonction, organisation.
- [ ] Tant que la liste n'est pas fournie : « Liste des intervenants à venir ».

### 6.5 Highlights (à créer)

- [ ] Section Top 5 Inventeurs : Guundi Mobile Security, Wefafa, KÏSSY, SujetsBF, Visit Faso.
- [ ] Par projet : nom, porteur, catégorie, courte présentation et visuel fourni par Hermann ; pas de contacts personnels ni d'analyse du jury.
- [ ] Section Projets inter-universitaires (contenu à fournir).

### 6.6 Expositions (à créer)

- [ ] Liste ou plan des stands à partir du fichier programme/stands : environ 57 stands (organisateurs, Top Inventeurs, CITADEL, projets étudiants UNB/BSB).
- [ ] Filtre par catégorie de stand.
- [ ] Ne pas afficher les sponsors prospects tant qu'ils ne sont pas confirmés.

## 7. Contenus et ressources fournis

Tous ces fichiers sont joints au mail d'Alfred du 23 octobre (fil « Infos pour actualiser les pages web EBC2026 et InnovateBF »).

| Fichier | Contenu | Utilisé pour |
| --- | --- | --- |
| `innovatebf-accueil-4Samba.html` | Maquette de la page d'accueil, validée par Hermann | Accueil, base du design |
| `LogoEBC2026.png` | Logo de la conférence | Accueil, page Conférence |
| `Infos_pour_la_page_web_conference_EBC2026.docx` | TDR : objectifs, public, 6 axes, format, patronage, partenaires | Page centrale, Appel à contributions |
| `EBC2026_programme_stands_27-28nov2026.xlsx` | 31 créneaux et environ 57 stands | Programme, Expositions |
| `Top5_Inventeurs_EBC2026.jpeg` | Visuel du Top 5 | Highlights |
| `Top5_Finalistes_Top_Inventeurs_EBC2026.xlsx` | Fiche détaillée des 5 finalistes | Highlights |
| Images des pièces jointes (`image001.png`, `image002.png`) | Visuels highlights et logos partenaires / organisateurs | Highlights, Co-organisateurs |

Manquent encore : logos officiels des ministères, liste des intervenants confirmés, contenu des projets inter-universitaires.

## 8. Contraintes techniques et workflow

Toute modification passe par GitHub : ce qui arrive sur la branche `main` est déployé automatiquement sur innovatebf.org.

1. Amadou Sienou donne l'accès à l'organisation et au repo GitHub (compte alfred@leguideia.ai, ou compte au nom de Samba : point P7).
2. Chaque lot de travail est développé sur une branche `feature/…`.
3. La branche est soumise par Merge Request vers `main`, puis relue et validée.
4. Après fusion, vérifier le site en ligne.

Autres contraintes :

- Le site actuel est construit en Next.js : on garde la base existante et on refait le design, sans repartir de zéro.
- Ne pas casser les fonctions existantes : formulaire de soumission `/submit/ebc26/soumettre`, inscription à la conférence.
- Les pages InnovonsEnsembleLeFaso (Besoins, Appels, Observatoire, Connexion) restent en place mais ne sont plus mises en avant.
- Tester chaque page sur mobile avant toute Merge Request.

## 9. Points en attente de validation

Le point P1 bloque tout le contenu EBC2026 : les dates s'affichent sur presque toutes les pages.

| # | Question | Pourquoi | Qui tranche |
| --- | --- | --- | --- |
| P1 | Dates de la conférence : 13-14 ou 27-28 novembre 2026 ? | Le site et l'image Top 5 disent 13-14, les TDR et le programme disent 27-28 | Hermann |
| P2 | Mention de l'organisateur : CCPS-UNB ou « CITADEL & EBC » ? | L'image Top 5 diffère des TDR (et contient la coquille « CITDAEL ») | Hermann |
| P3 | Patronage et co-parrainages officiellement acquis ? Qui fournit les logos des ministères ? | Afficher un patronage non confirmé engage les ministères | Hermann / comité |
| P4 | Programme : version allégée ou complète ? Qui valide avant publication ? | Beaucoup de créneaux « à confirmer » | Hermann |
| P5 | Sponsors : bloc vide « Bientôt disponible » jusqu'à signature ? | Le fichier stands ne liste que des prospects | Hermann |
| P6 | Photos des inventeurs ou visuels des projets du Top 5 ? | Nécessaires pour la page Highlights | Hermann |
| P7 | Accès GitHub : compte d'Alfred ou compte de Samba ? | Traçabilité des commits et Merge Requests | Alfred / Amadou |
| P8 | Version anglaise à maintenir ? | Double le travail de contenu | Hermann |
| P9 | Forme et emplacement de la visibilité LeGuideIA / Burkina-news | Contrepartie du développement | Alfred / Hermann |
| P10 | Adresse e-mail et coordonnées officielles d'InnovateBF | Formulaire de contact et pied de page | Hermann |
| P11 | Date de mise en ligne attendue | Fixe le planning (section 10) | Alfred / Hermann |

## 10. Planning et livrables

Le travail est découpé en quatre lots livrés chacun par Merge Request ; les dates seront fixées dès que la date de mise en ligne est connue (P11).

1. **Lot 1 — Corrections immédiates** : menu, français par défaut, logo EBC2026 sur l'accueil, textes des Domaines d'action et d'Analyse, retrait des rubriques vides. Ne dépend d'aucune validation.
2. **Lot 2 — Design unifié** : design ebc26 appliqué à toutes les pages InnovateBF, pied de page, responsive.
3. **Lot 3 — Page centrale EBC2026 et Appel à contributions** : lieu, patronage, co-organisateurs, sponsors, boutons, formulaire. Dépend de P1, P2, P3.
4. **Lot 4 — Programme, Intervenants, Highlights, Expositions** : à partir des fichiers fournis. Dépend de P4, P5, P6.

Livrables :

- Site en ligne sur innovatebf.org, toutes les pages des sections 5 et 6 conformes.
- Une Merge Request par lot, avec la liste des changements.
- Un récapitulatif envoyé à Alfred et Hermann à chaque lot fusionné.
