import type {
  Need,
  CallForSolutions,
  IEStats,
} from "./types";

// ── 12 besoins realistes pour le Burkina Faso ─────────────────────────────

export const MOCK_NEEDS: Need[] = [
  {
    id: "need-001",
    slug: "souverainete-sanitaire-equipements-medicaux",
    titre: "Souverainete sanitaire : production locale d'equipements medicaux",
    domaine: "Sante",
    secteur: "Equipements medicaux",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["URGENT", "COMPLEXE"],
    question_centrale:
      "Comment le Burkina Faso peut-il reduire sa dependance aux importations d'equipements medicaux essentiels en developpant une filiere de production locale adaptee aux realites du terrain ?",
    contexte_strategique:
      "Le Burkina Faso importe plus de 95% de ses equipements medicaux. La crise sanitaire mondiale a revele la vulnerabilite du pays face aux ruptures d'approvisionnement. Les structures de sante peripheriques manquent cruellement d'equipements de base (concentrateurs d'oxygene, respirateurs, dispositifs de diagnostic rapide). Le Plan National de Developpement Sanitaire 2021-2030 identifie la souverainete sanitaire comme axe prioritaire. Plusieurs initiatives locales (Faso-Air, diagnostics mobiles) montrent un potentiel endogene sous-exploite.",
    parties_prenantes: [
      {
        id: "pp-001-1",
        categorie: "Initiateur",
        acteur: "Ministere de la Sante",
        role: "Definir les besoins prioritaires et les normes de qualite",
        position: "Actif",
      },
      {
        id: "pp-001-2",
        categorie: "Financeur",
        acteur: "Banque Mondiale - Projet PAPS",
        role: "Financer la R&D et les infrastructures de production",
        position: "Actif",
      },
      {
        id: "pp-001-3",
        categorie: "Expert",
        acteur: "Universite Joseph Ki-Zerbo - Departement Genie Biomedical",
        role: "Apporter l'expertise technique et former les ingenieurs",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-001-1",
        intitule: "Absence de normes de certification locale",
        nature: "REGLEMENTATION",
        description:
          "Aucun cadre reglementaire national pour certifier les equipements medicaux produits localement. Les normes OMS sont difficiles a atteindre sans infrastructure de test.",
        criticite: 3,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-001-2",
        intitule: "Deficit de competences en genie biomedical",
        nature: "CAPITAL_HUMAIN",
        description:
          "Moins de 50 ingenieurs biomedicaux formes par an au Burkina Faso. La diaspora detient des competences cles non mobilisees.",
        criticite: 2,
        controlabilite: "TOTALE",
      },
      {
        id: "obs-001-3",
        intitule: "Cout eleve des matieres premieres importees",
        nature: "FINANCEMENT",
        description:
          "Les composants electroniques et plastiques medicaux doivent etre importes, augmentant le cout de production de 40%.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
    ],
    resultats: [
      {
        id: "res-001-1",
        intitule: "3 types d'equipements medicaux produits localement",
        niveau: "OUTPUT",
        quantification: "Concentrateurs O2, kits de diagnostic, sterilisateurs",
        horizon: "MOYEN",
      },
      {
        id: "res-001-2",
        intitule: "Reduction de 30% de la dependance aux importations medicales",
        niveau: "IMPACT",
        quantification: "De 95% a 65% d'importations sur les equipements cibles",
        horizon: "LONG",
      },
    ],
    indicateurs: [
      {
        id: "ind-001-1",
        intitule: "Nombre d'equipements produits et deployes",
        type: "RESULTAT",
        resultat_associe: "res-001-1",
        source: "Registre du Ministere de la Sante",
        baseline: "0 equipements produits localement",
        frequence: "Trimestrielle",
      },
      {
        id: "ind-001-2",
        intitule: "Taux de dependance aux importations medicales",
        type: "CONTEXTE",
        resultat_associe: "res-001-2",
        source: "Douanes / Ministere du Commerce",
        baseline: "95%",
        frequence: "Annuelle",
      },
    ],
    synthese_narrative:
      "Ce besoin vise a etablir une filiere de production d'equipements medicaux au Burkina Faso pour reduire la dependance aux importations et ameliorer l'acces aux soins dans les zones rurales. La mobilisation de la diaspora technique et des universites locales est cle.",
    population_impact: 120000,
    budget: 750000000,
    auteur_id: "user-admin-001",
    created_at: "2025-11-15T10:00:00Z",
    published_at: "2025-12-01T08:00:00Z",
    updated_at: "2026-02-20T14:30:00Z",
  },
  {
    id: "need-002",
    slug: "irrigation-intelligente-zones-saheliennes",
    titre: "Irrigation intelligente pour les zones saheliennes",
    domaine: "Agriculture",
    secteur: "Irrigation et eau agricole",
    region: "Sahel",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["URGENT", "QUICK-WIN"],
    question_centrale:
      "Comment deployer des systemes d'irrigation solaire intelligente adaptes aux petits exploitants des zones saheliennes pour augmenter les rendements et reduire la pression sur les ressources en eau ?",
    contexte_strategique:
      "La region du Sahel burkinabe subit une pluviometrie de plus en plus erratique (350-600mm/an). Plus de 80% des exploitations agricoles dependent de l'agriculture pluviale. Les pertes post-recolte atteignent 30%. L'irrigation traditionnelle par canaux gaspille 60% de l'eau. Des solutions IoT a energie solaire existent mais ne sont pas adaptees au contexte local (cout, maintenance, formation).",
    parties_prenantes: [
      {
        id: "pp-002-1",
        categorie: "Initiateur",
        acteur: "Ministere de l'Agriculture",
        role: "Planification strategique et acces au foncier",
        position: "Actif",
      },
      {
        id: "pp-002-2",
        categorie: "Beneficiaire",
        acteur: "Union des cooperatives agricoles du Sahel",
        role: "Deploiement terrain et retour d'experience",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-002-1",
        intitule: "Faible electrification des zones rurales cibles",
        nature: "INFRASTRUCTURE",
        description:
          "Taux d'electrification inferieur a 5% dans les zones rurales du Sahel. Les panneaux solaires necessitent un investissement initial important.",
        criticite: 3,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-002-2",
        intitule: "Analphabetisme numerique des exploitants",
        nature: "CAPITAL_HUMAIN",
        description:
          "Plus de 70% des exploitants cibles ne savent pas utiliser un smartphone. Les interfaces doivent etre repensees (vocales, pictogrammes).",
        criticite: 2,
        controlabilite: "TOTALE",
      },
    ],
    resultats: [
      {
        id: "res-002-1",
        intitule: "500 exploitations equipees en irrigation solaire intelligente",
        niveau: "OUTPUT",
        quantification: "500 kits deployes dans 3 provinces du Sahel",
        horizon: "MOYEN",
      },
      {
        id: "res-002-2",
        intitule: "Augmentation de 40% des rendements agricoles irrigues",
        niveau: "OUTCOME",
        quantification: "De 1,2t/ha a 1,7t/ha en moyenne sur les cultures maraicheres",
        horizon: "COURT",
      },
    ],
    indicateurs: [
      {
        id: "ind-002-1",
        intitule: "Nombre de kits d'irrigation deployes et fonctionnels",
        type: "RESULTAT",
        resultat_associe: "res-002-1",
        source: "Suivi terrain cooperatives",
        baseline: "12 kits pilotes",
        frequence: "Mensuelle",
      },
      {
        id: "ind-002-2",
        intitule: "Rendement moyen par hectare irrigue",
        type: "RESULTAT",
        resultat_associe: "res-002-2",
        source: "Donnees de recolte cooperatives",
        baseline: "1,2 t/ha",
        frequence: "Saisonniere",
      },
    ],
    synthese_narrative:
      "L'irrigation intelligente solaire represente un levier majeur pour la securite alimentaire au Sahel. En combinant IoT, energie solaire et interfaces adaptees, ce besoin vise a transformer les pratiques agricoles de 500 exploitations familiales.",
    population_impact: 85000,
    budget: 320000000,
    auteur_id: "user-admin-001",
    created_at: "2025-10-20T09:00:00Z",
    published_at: "2025-11-10T08:00:00Z",
    updated_at: "2026-01-15T11:00:00Z",
  },
  {
    id: "need-003",
    slug: "ecoles-numeriques-rurales",
    titre: "Ecoles numeriques rurales : acces au savoir pour tous",
    domaine: "Education",
    secteur: "Numerique educatif",
    region: "Boucle du Mouhoun",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE", "DONNEES MANQUANTES"],
    question_centrale:
      "Comment garantir un acces equitable aux ressources educatives numeriques dans les ecoles rurales du Burkina Faso malgre les contraintes d'infrastructure et de connectivite ?",
    contexte_strategique:
      "Le taux de scolarisation au primaire est de 90% mais la qualite de l'enseignement reste faible, surtout en zone rurale. Le ratio eleve/enseignant atteint 65:1 dans certaines provinces. Moins de 3% des ecoles rurales disposent d'un acces Internet. Le Plan Sectoriel de l'Education prevoit la digitalisation mais sans moyens adaptes au terrain. Des solutions offline-first (tablettes precharges, serveurs locaux Raspberry Pi) sont prometteuses.",
    parties_prenantes: [
      {
        id: "pp-003-1",
        categorie: "Initiateur",
        acteur: "Ministere de l'Education Nationale",
        role: "Cadrage pedagogique et deploiement institutionnel",
        position: "Actif",
      },
      {
        id: "pp-003-2",
        categorie: "Financeur",
        acteur: "UNICEF Burkina Faso",
        role: "Co-financement et assistance technique",
        position: "Actif",
      },
      {
        id: "pp-003-3",
        categorie: "Expert",
        acteur: "Association Burkina Open Source",
        role: "Developpement de contenus educatifs libres",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-003-1",
        intitule: "Absence de connectivite Internet en zone rurale",
        nature: "INFRASTRUCTURE",
        description:
          "Les ecoles cibles sont hors couverture 3G/4G. Les solutions satellitaires sont trop couteuses pour un usage scolaire regulier.",
        criticite: 3,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-003-2",
        intitule: "Manque de formation des enseignants au numerique",
        nature: "CAPITAL_HUMAIN",
        description:
          "85% des enseignants en zone rurale n'ont jamais utilise d'outil pedagogique numerique. Un programme de formation massif est necessaire.",
        criticite: 2,
        controlabilite: "TOTALE",
      },
      {
        id: "obs-003-3",
        intitule: "Risque de vol et vandalisme des equipements",
        nature: "CONTEXTUEL",
        description:
          "Les equipements numeriques representent une valeur importante dans les villages. Le securite et l'implication communautaire sont cruciales.",
        criticite: 1,
        controlabilite: "TOTALE",
      },
    ],
    resultats: [
      {
        id: "res-003-1",
        intitule: "200 ecoles rurales equipees de kits numeriques offline",
        niveau: "OUTPUT",
        quantification: "200 kits (serveur local + 30 tablettes) deployes",
        horizon: "MOYEN",
      },
      {
        id: "res-003-2",
        intitule: "Amelioration de 25% des resultats scolaires en maths et sciences",
        niveau: "OUTCOME",
        quantification: "Hausse du taux de reussite aux evaluations standardisees",
        horizon: "LONG",
      },
    ],
    indicateurs: [
      {
        id: "ind-003-1",
        intitule: "Nombre d'ecoles equipees et actives",
        type: "RESULTAT",
        resultat_associe: "res-003-1",
        source: "Suivi MENAPLN",
        baseline: "8 ecoles pilotes",
        frequence: "Trimestrielle",
      },
    ],
    synthese_narrative:
      "Ce besoin porte sur l'equipement de 200 ecoles rurales en solutions numeriques offline-first pour reduire la fracture educative entre zones urbaines et rurales au Burkina Faso.",
    population_impact: 65000,
    budget: 480000000,
    auteur_id: "user-admin-002",
    created_at: "2025-12-01T10:00:00Z",
    published_at: "2025-12-20T08:00:00Z",
    updated_at: "2026-02-10T09:30:00Z",
  },
  {
    id: "need-004",
    slug: "acces-eau-potable-regions-nord",
    titre: "Acces a l'eau potable dans les regions du Nord",
    domaine: "Eau",
    secteur: "Hydraulique villageoise",
    region: "Nord",
    pays: "Burkina Faso",
    niveau: "LOCAL",
    statut: "PUBLIE",
    tags: ["URGENT"],
    question_centrale:
      "Comment garantir un acces durable a l'eau potable pour les populations deplacees et les communautes hotes dans les regions du Nord affectees par l'insecurite ?",
    contexte_strategique:
      "La region du Nord accueille plus de 300 000 personnes deplacees internes. Les infrastructures hydrauliques existantes sont surchargees (taux de desserte tombe de 72% a 45%). Les forages tombent en panne faute de maintenance et de pieces detachees. L'eau non traitee cause 20% des deces infantiles. Des technologies de potabilisation solaire et de monitoring IoT des forages montrent des resultats prometteurs en phase pilote.",
    parties_prenantes: [
      {
        id: "pp-004-1",
        categorie: "Initiateur",
        acteur: "Ministere de l'Eau et de l'Assainissement",
        role: "Planification et coordination nationale",
        position: "Actif",
      },
      {
        id: "pp-004-2",
        categorie: "Beneficiaire",
        acteur: "Populations deplacees et communautes hotes",
        role: "Utilisateurs finaux et gestion communautaire",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-004-1",
        intitule: "Insecurite limitant l'acces aux zones d'intervention",
        nature: "CONTEXTUEL",
        description:
          "Plusieurs zones sont difficilement accessibles en raison de la presence de groupes armes. Les equipes techniques ne peuvent pas intervenir sans escorte.",
        criticite: 3,
        controlabilite: "NULLE",
      },
      {
        id: "obs-004-2",
        intitule: "Penurie de techniciens hydrauliciens qualifies",
        nature: "CAPITAL_HUMAIN",
        description:
          "La region Nord ne compte que 12 techniciens pour 800 forages. Le temps de reparation moyen depasse 3 mois.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
    ],
    resultats: [
      {
        id: "res-004-1",
        intitule: "150 forages rehabilites et equipes de monitoring IoT",
        niveau: "OUTPUT",
        quantification: "150 forages sur 800 existants",
        horizon: "COURT",
      },
      {
        id: "res-004-2",
        intitule: "Acces a l'eau potable pour 120 000 personnes supplementaires",
        niveau: "IMPACT",
        quantification: "Taux de desserte remonte de 45% a 60%",
        horizon: "MOYEN",
      },
    ],
    indicateurs: [
      {
        id: "ind-004-1",
        intitule: "Nombre de forages rehabilites et fonctionnels",
        type: "RESULTAT",
        resultat_associe: "res-004-1",
        source: "ONEA regional",
        baseline: "0 rehabilites avec monitoring",
        frequence: "Mensuelle",
      },
    ],
    synthese_narrative:
      "La crise humanitaire dans le Nord exige des solutions rapides et durables pour l'acces a l'eau potable. Ce besoin combine rehabilitation de forages, monitoring IoT et formation de techniciens locaux.",
    population_impact: 120000,
    budget: 280000000,
    auteur_id: "user-admin-001",
    created_at: "2025-09-10T10:00:00Z",
    published_at: "2025-10-01T08:00:00Z",
    updated_at: "2026-01-30T15:00:00Z",
  },
  {
    id: "need-005",
    slug: "mini-reseaux-solaires-electrification-rurale",
    titre: "Mini-reseaux solaires pour l'electrification rurale",
    domaine: "Energie",
    secteur: "Electrification rurale",
    region: "Est",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE", "URGENT"],
    question_centrale:
      "Comment accelerer l'electrification des zones rurales par des mini-reseaux solaires geres par les communautes locales, en assurant la viabilite economique et la durabilite technique ?",
    contexte_strategique:
      "Le taux d'electrification rural est de 5,6% au Burkina Faso, un des plus bas d'Afrique de l'Ouest. L'extension du reseau SONABEL est trop couteuse pour les villages isoles (3-5 M FCFA/km). Les mini-reseaux solaires (50-500 kWc) offrent une alternative viable mais les modeles economiques restent fragiles. Le potentiel solaire est exceptionnel (5,5 kWh/m2/jour). La Strategie Nationale d'Electrification prevoit 100% d'acces d'ici 2030.",
    parties_prenantes: [
      {
        id: "pp-005-1",
        categorie: "Regulateur",
        acteur: "ARSE (Autorite de Regulation du Secteur de l'Energie)",
        role: "Regulation tarifaire et normes techniques",
        position: "Actif",
      },
      {
        id: "pp-005-2",
        categorie: "Financeur",
        acteur: "Fonds Vert pour le Climat",
        role: "Financement concessionnel pour les mini-reseaux",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-005-1",
        intitule: "Cadre reglementaire incomplet pour les mini-reseaux",
        nature: "REGLEMENTATION",
        description:
          "Le cadre juridique pour les operateurs de mini-reseaux est en cours d'elaboration. L'incertitude freine les investissements prives.",
        criticite: 3,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-005-2",
        intitule: "Faible capacite de paiement des menages ruraux",
        nature: "MARCHE",
        description:
          "Le revenu moyen en zone rurale est inferieur a 50 000 FCFA/mois. Les tarifs doivent etre subventionnes pour etre accessibles.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-005-3",
        intitule: "Maintenance et gestion des mini-reseaux",
        nature: "CAPITAL_HUMAIN",
        description:
          "Les competences techniques pour maintenir les installations solaires sont quasi inexistantes localement.",
        criticite: 2,
        controlabilite: "TOTALE",
      },
    ],
    resultats: [
      {
        id: "res-005-1",
        intitule: "30 mini-reseaux solaires operationnels",
        niveau: "OUTPUT",
        quantification: "30 villages electrifies (50-200 kWc chacun)",
        horizon: "MOYEN",
      },
      {
        id: "res-005-2",
        intitule: "45 000 personnes ayant acces a l'electricite",
        niveau: "IMPACT",
        quantification: "Taux d'electrification local passe de 5% a 35%",
        horizon: "LONG",
      },
    ],
    indicateurs: [
      {
        id: "ind-005-1",
        intitule: "Nombre de mini-reseaux installes et fonctionnels",
        type: "RESULTAT",
        resultat_associe: "res-005-1",
        source: "ARSE / SONABEL",
        baseline: "3 pilotes existants",
        frequence: "Trimestrielle",
      },
    ],
    synthese_narrative:
      "L'electrification rurale par mini-reseaux solaires est essentielle pour le developpement economique des zones isolees. Ce besoin vise 30 villages de la region Est avec un modele de gestion communautaire viable.",
    population_impact: 45000,
    budget: 800000000,
    auteur_id: "user-admin-002",
    created_at: "2025-08-25T10:00:00Z",
    published_at: "2025-09-15T08:00:00Z",
    updated_at: "2026-02-28T10:00:00Z",
  },
  {
    id: "need-006",
    slug: "surveillance-securitaire-drones-autonomes",
    titre: "Surveillance securitaire par drones autonomes",
    domaine: "Securite",
    secteur: "Defense et surveillance",
    region: "Sahel",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["URGENT", "COMPLEXE"],
    question_centrale:
      "Comment utiliser les drones autonomes de fabrication locale pour ameliorer la surveillance des zones a risque securitaire tout en respectant les droits fondamentaux ?",
    contexte_strategique:
      "Le Burkina Faso fait face a des defis securitaires majeurs depuis 2015. Les forces de defense couvrent un territoire vaste avec des moyens limites. Les drones importes coutent entre 50 et 200 M FCFA par unite. Des ingenieurs burkinabe ont demontre la capacite de concevoir des drones de surveillance a 5 M FCFA l'unite. La cooperation regionale (G5 Sahel) soutient l'innovation defense locale.",
    parties_prenantes: [
      {
        id: "pp-006-1",
        categorie: "Initiateur",
        acteur: "Ministere de la Defense",
        role: "Definition des specifications operationnelles",
        position: "Actif",
      },
      {
        id: "pp-006-2",
        categorie: "Expert",
        acteur: "Ecole Polytechnique de Ouagadougou",
        role: "R&D et prototypage des drones",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-006-1",
        intitule: "Reglementation aerienne restrictive pour les drones",
        nature: "REGLEMENTATION",
        description:
          "L'ANAC n'a pas encore de cadre specifique pour les drones militaires de fabrication locale. Les autorisations de vol sont longues a obtenir.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-006-2",
        intitule: "Acces limite aux composants electroniques avances",
        nature: "MARCHE",
        description:
          "Les sanctions et restrictions a l'exportation compliquent l'acces aux capteurs et processeurs necessaires.",
        criticite: 3,
        controlabilite: "NULLE",
      },
    ],
    resultats: [
      {
        id: "res-006-1",
        intitule: "Prototype de drone de surveillance valide",
        niveau: "OUTPUT",
        quantification: "2 modeles (courte et longue portee) certifies",
        horizon: "COURT",
      },
      {
        id: "res-006-2",
        intitule: "Reduction de 20% des incidents securitaires dans les zones couvertes",
        niveau: "IMPACT",
        quantification: "Donnees comparatives avant/apres deploiement",
        horizon: "LONG",
      },
    ],
    indicateurs: [
      {
        id: "ind-006-1",
        intitule: "Nombre de prototypes valides et operationnels",
        type: "RESULTAT",
        resultat_associe: "res-006-1",
        source: "Ministere de la Defense",
        baseline: "1 prototype experimental",
        frequence: "Semestrielle",
      },
    ],
    synthese_narrative:
      "Ce besoin vise a developper une capacite locale de production de drones de surveillance pour renforcer la securite nationale tout en reduisant les couts d'acquisition et la dependance aux fournisseurs etrangers.",
    population_impact: 450000,
    budget: 500000000,
    auteur_id: "user-admin-001",
    created_at: "2025-07-15T10:00:00Z",
    published_at: "2025-08-01T08:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "need-007",
    slug: "plateforme-services-publics-numeriques",
    titre: "Plateforme unifiee de services publics numeriques",
    domaine: "Numerique",
    secteur: "E-gouvernance",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE", "QUICK-WIN"],
    question_centrale:
      "Comment creer une plateforme unifiee de services publics numeriques accessible a tous les citoyens, y compris ceux ayant un faible niveau de litteratie numerique ?",
    contexte_strategique:
      "Les demarches administratives au Burkina Faso necessitent en moyenne 5 deplacements physiques et 15 jours d'attente. Moins de 10% des services publics sont disponibles en ligne. Le taux de penetration mobile est de 85% mais l'utilisation des services numeriques reste faible (12%). La Strategie Nationale de Transition Numerique 2025-2030 prevoit 50% des services publics en ligne d'ici 2028. Des pays voisins (Senegal, Cote d'Ivoire) ont deja deploye des plateformes similaires.",
    parties_prenantes: [
      {
        id: "pp-007-1",
        categorie: "Initiateur",
        acteur: "Ministere de la Transition Numerique",
        role: "Pilotage strategique et coordination interministerielle",
        position: "Actif",
      },
      {
        id: "pp-007-2",
        categorie: "Beneficiaire",
        acteur: "Citoyens burkinabe",
        role: "Utilisateurs finaux des services",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-007-1",
        intitule: "Silos de donnees entre ministeres",
        nature: "INFRASTRUCTURE",
        description:
          "Chaque ministere utilise des systemes incompatibles. L'interoperabilite necessite une refonte des architectures existantes.",
        criticite: 3,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-007-2",
        intitule: "Resistance au changement dans l'administration",
        nature: "CAPITAL_HUMAIN",
        description:
          "Les fonctionnaires craignent la perte de pouvoir liee a la dematerialisation. Un accompagnement au changement est necessaire.",
        criticite: 2,
        controlabilite: "TOTALE",
      },
    ],
    resultats: [
      {
        id: "res-007-1",
        intitule: "Plateforme unifiee avec 20 services en ligne",
        niveau: "OUTPUT",
        quantification: "Etat civil, foncier, impots, sante, education",
        horizon: "MOYEN",
      },
      {
        id: "res-007-2",
        intitule: "Reduction de 60% du temps de traitement des demarches",
        niveau: "OUTCOME",
        quantification: "De 15 jours en moyenne a 6 jours",
        horizon: "MOYEN",
      },
    ],
    indicateurs: [
      {
        id: "ind-007-1",
        intitule: "Nombre de services publics disponibles en ligne",
        type: "RESULTAT",
        resultat_associe: "res-007-1",
        source: "Ministere de la Transition Numerique",
        baseline: "5 services partiellement en ligne",
        frequence: "Trimestrielle",
      },
    ],
    synthese_narrative:
      "La dematerialisation des services publics est un levier majeur de modernisation de l'Etat et d'amelioration du service rendu aux citoyens. Ce besoin vise a creer un guichet unique numerique accessible via mobile.",
    population_impact: 35000,
    budget: 650000000,
    auteur_id: "user-admin-002",
    created_at: "2025-11-01T10:00:00Z",
    published_at: "2025-11-20T08:00:00Z",
    updated_at: "2026-02-15T14:00:00Z",
  },
  {
    id: "need-008",
    slug: "reseau-routes-intelligentes-ouagadougou",
    titre: "Reseau de routes intelligentes pour Ouagadougou",
    domaine: "Transport",
    secteur: "Mobilite urbaine",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "LOCAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale:
      "Comment reduire les embouteillages et les accidents de la route a Ouagadougou grace a des systemes intelligents de gestion du trafic et d'information des usagers ?",
    contexte_strategique:
      "Ouagadougou compte 3 millions d'habitants avec un parc de 800 000 deux-roues et 200 000 vehicules. Les embouteillages causent des pertes economiques estimees a 50 milliards FCFA/an. Le nombre d'accidents mortels depasse 600/an. Les feux tricolores sont rares et souvent en panne. Il n'existe pas de systeme centralise de gestion du trafic. Des solutions low-cost basees sur des capteurs IoT et l'IA sont envisageables.",
    parties_prenantes: [
      {
        id: "pp-008-1",
        categorie: "Initiateur",
        acteur: "Mairie de Ouagadougou",
        role: "Maitrise d'ouvrage et regulation urbaine",
        position: "Actif",
      },
      {
        id: "pp-008-2",
        categorie: "Expert",
        acteur: "2iE (Institut International d'Ingenierie)",
        role: "Expertise technique en transport intelligent",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-008-1",
        intitule: "Infrastructure routiere degradee",
        nature: "INFRASTRUCTURE",
        description:
          "40% des routes de Ouagadougou sont en mauvais etat. L'installation de capteurs necessite un minimum de qualite de la chaussee.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-008-2",
        intitule: "Comportements routiers non regules",
        nature: "CONTEXTUEL",
        description:
          "Le non-respect du code de la route est generalise. Les solutions technologiques doivent s'accompagner de sensibilisation.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
    ],
    resultats: [
      {
        id: "res-008-1",
        intitule: "50 carrefours equipes de feux intelligents et capteurs",
        niveau: "OUTPUT",
        quantification: "50 intersections principales de Ouagadougou",
        horizon: "MOYEN",
      },
      {
        id: "res-008-2",
        intitule: "Reduction de 15% du temps de trajet moyen",
        niveau: "OUTCOME",
        quantification: "De 45 min a 38 min pour un trajet type",
        horizon: "MOYEN",
      },
    ],
    indicateurs: [
      {
        id: "ind-008-1",
        intitule: "Nombre de carrefours equipes",
        type: "RESULTAT",
        resultat_associe: "res-008-1",
        source: "Direction des transports de Ouagadougou",
        baseline: "3 carrefours pilotes",
        frequence: "Mensuelle",
      },
    ],
    synthese_narrative:
      "La gestion intelligente du trafic est urgente pour Ouagadougou. Ce besoin combine capteurs IoT, feux adaptatifs et information en temps reel pour fluidifier la mobilite urbaine et reduire les accidents.",
    population_impact: 35000,
    budget: 420000000,
    auteur_id: "user-admin-001",
    created_at: "2025-10-05T10:00:00Z",
    published_at: "2025-10-25T08:00:00Z",
    updated_at: "2026-02-05T11:30:00Z",
  },
  {
    id: "need-009",
    slug: "surveillance-deforestation-satellites",
    titre: "Surveillance de la deforestation par imagerie satellite",
    domaine: "Environnement",
    secteur: "Forets et biodiversite",
    region: "Cascades",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["QUICK-WIN", "DONNEES MANQUANTES"],
    question_centrale:
      "Comment utiliser l'imagerie satellite et l'intelligence artificielle pour detecter et prevenir la deforestation en temps reel au Burkina Faso ?",
    contexte_strategique:
      "Le Burkina Faso perd environ 110 000 hectares de foret par an (FAO 2023). La region des Cascades, poumon vert du pays, est particulierement menacee par l'orpaillage et l'agriculture extensive. Les agents des Eaux et Forets ne couvrent que 15% du territoire. L'imagerie satellite (Sentinel-2, Landsat) est gratuite mais son exploitation necessite des competences en teledetection et IA. Des modeles de detection automatique existent mais n'ont pas ete calibres pour le Sahel.",
    parties_prenantes: [
      {
        id: "pp-009-1",
        categorie: "Initiateur",
        acteur: "Ministere de l'Environnement",
        role: "Definition des zones prioritaires et cadre legal",
        position: "Actif",
      },
      {
        id: "pp-009-2",
        categorie: "Expert",
        acteur: "Centre National de Teledetection (BNDT)",
        role: "Analyse des images satellite et modelisation",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-009-1",
        intitule: "Couverture nuageuse perturbant l'imagerie optique",
        nature: "CONTEXTUEL",
        description:
          "Pendant la saison des pluies (juin-octobre), la couverture nuageuse rend l'imagerie optique inutilisable. Le radar (Sentinel-1) est une alternative couteuse a traiter.",
        criticite: 1,
        controlabilite: "NULLE",
      },
      {
        id: "obs-009-2",
        intitule: "Manque de donnees d'entrainement locales pour l'IA",
        nature: "CAPITAL_HUMAIN",
        description:
          "Les modeles d'IA de detection de deforestation sont entraines sur des donnees amazonienne ou congolaise, peu adaptees au Sahel.",
        criticite: 2,
        controlabilite: "TOTALE",
      },
    ],
    resultats: [
      {
        id: "res-009-1",
        intitule: "Systeme d'alerte precoce couvrant 5 regions",
        niveau: "OUTPUT",
        quantification: "Alertes automatiques en moins de 48h apres detection",
        horizon: "COURT",
      },
      {
        id: "res-009-2",
        intitule: "Reduction de 20% du rythme de deforestation",
        niveau: "IMPACT",
        quantification: "De 110 000 ha/an a 88 000 ha/an",
        horizon: "LONG",
      },
    ],
    indicateurs: [
      {
        id: "ind-009-1",
        intitule: "Nombre d'alertes de deforestation generees et traitees",
        type: "PROCESSUS",
        resultat_associe: "res-009-1",
        source: "Plateforme de monitoring",
        baseline: "0 alertes automatiques",
        frequence: "Mensuelle",
      },
    ],
    synthese_narrative:
      "La surveillance satellite de la deforestation est un outil puissant et relativement peu couteux pour proteger les forets burkinabe. Ce besoin vise a deployer un systeme d'alerte IA calibre pour le Sahel.",
    population_impact: 12000,
    budget: 95000000,
    auteur_id: "user-admin-002",
    created_at: "2025-12-10T10:00:00Z",
    published_at: "2026-01-05T08:00:00Z",
    updated_at: "2026-03-10T09:00:00Z",
  },
  {
    id: "need-010",
    slug: "mobile-money-inclusion-financiere-rurale",
    titre: "Mobile money et inclusion financiere en zone rurale",
    domaine: "Finance",
    secteur: "Inclusion financiere",
    region: "Centre-Ouest",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["QUICK-WIN"],
    question_centrale:
      "Comment etendre les services financiers mobiles aux populations rurales non bancarisees en s'appuyant sur les reseaux communautaires existants ?",
    contexte_strategique:
      "Seulement 22% des adultes burkinabe possedent un compte bancaire (Banque Mondiale, 2023). Le mobile money touche 35% de la population mais les zones rurales restent sous-desservies (15% de penetration). Les femmes sont particulierement exclues du systeme financier. Les tontines et les groupements d'epargne traditionnels representent un maillage communautaire inexploite par la fintech. La reglementation UEMOA favorise l'innovation financiere.",
    parties_prenantes: [
      {
        id: "pp-010-1",
        categorie: "Regulateur",
        acteur: "BCEAO / Commission Bancaire",
        role: "Cadre reglementaire et supervision",
        position: "Actif",
      },
      {
        id: "pp-010-2",
        categorie: "Financeur",
        acteur: "Fondation Bill & Melinda Gates",
        role: "Financement de l'inclusion financiere digitale",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-010-1",
        intitule: "Couverture reseau mobile insuffisante",
        nature: "INFRASTRUCTURE",
        description:
          "25% des villages ruraux n'ont aucune couverture reseau. Les transactions necessitent au minimum un reseau 2G.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-010-2",
        intitule: "Mefiance envers les services financiers numeriques",
        nature: "CONTEXTUEL",
        description:
          "Les fraudes au mobile money et le manque de transparence generent de la mefiance. La confiance se construit via les leaders communautaires.",
        criticite: 1,
        controlabilite: "TOTALE",
      },
    ],
    resultats: [
      {
        id: "res-010-1",
        intitule: "100 000 nouveaux comptes mobile money en zone rurale",
        niveau: "OUTPUT",
        quantification: "Dont 60% de femmes",
        horizon: "COURT",
      },
      {
        id: "res-010-2",
        intitule: "Augmentation de 30% de l'epargne formelle en zone rurale",
        niveau: "OUTCOME",
        quantification: "Via digitalisation des tontines et groupements d'epargne",
        horizon: "MOYEN",
      },
    ],
    indicateurs: [
      {
        id: "ind-010-1",
        intitule: "Nombre de comptes mobile money actifs en zone rurale",
        type: "RESULTAT",
        resultat_associe: "res-010-1",
        source: "Operateurs mobile money / BCEAO",
        baseline: "45 000 comptes actifs",
        frequence: "Trimestrielle",
      },
    ],
    synthese_narrative:
      "L'inclusion financiere par le mobile money est un puissant levier de developpement rural. Ce besoin vise a digitaliser les pratiques financieres traditionnelles (tontines, epargne communautaire) pour toucher 100 000 nouveaux utilisateurs.",
    population_impact: 100000,
    budget: 180000000,
    auteur_id: "user-admin-001",
    created_at: "2025-11-20T10:00:00Z",
    published_at: "2025-12-10T08:00:00Z",
    updated_at: "2026-02-25T10:30:00Z",
  },
  {
    id: "need-011",
    slug: "transformation-mangue-unite-industrielle",
    titre: "Unite industrielle de transformation de la mangue",
    domaine: "Industrie",
    secteur: "Agro-industrie",
    region: "Hauts-Bassins",
    pays: "Burkina Faso",
    niveau: "LOCAL",
    statut: "PUBLIE",
    tags: ["QUICK-WIN", "URGENT"],
    question_centrale:
      "Comment developper une filiere industrielle de transformation de la mangue a Bobo-Dioulasso pour reduire les pertes post-recolte et creer de la valeur ajoutee locale ?",
    contexte_strategique:
      "Le Burkina Faso est le 4e producteur africain de mangue (400 000 tonnes/an) mais ne transforme que 5% de sa production. Les pertes post-recolte atteignent 40%. La region des Hauts-Bassins concentre 60% de la production. Les marches europeen et regional (CEDEAO) sont demandeurs de mangue sechee, jus et puree. Les unites artisanales existantes n'atteignent pas les normes d'export. Une unite semi-industrielle creeerait 200 emplois directs.",
    parties_prenantes: [
      {
        id: "pp-011-1",
        categorie: "Initiateur",
        acteur: "Chambre de Commerce des Hauts-Bassins",
        role: "Mobilisation des acteurs economiques locaux",
        position: "Actif",
      },
      {
        id: "pp-011-2",
        categorie: "Beneficiaire",
        acteur: "Cooperatives de producteurs de mangue",
        role: "Fournisseurs de matieres premieres",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-011-1",
        intitule: "Saisonnalite de la production (3 mois de recolte)",
        nature: "MARCHE",
        description:
          "La mangue n'est disponible que de mai a juillet. L'unite doit diversifier ses activites ou stocker pour fonctionner toute l'annee.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-011-2",
        intitule: "Normes d'export europeennes exigeantes",
        nature: "REGLEMENTATION",
        description:
          "Les limites maximales de residus (LMR) et les normes HACCP sont difficiles a atteindre sans investissement significatif en qualite.",
        criticite: 2,
        controlabilite: "TOTALE",
      },
    ],
    resultats: [
      {
        id: "res-011-1",
        intitule: "Unite de transformation operationnelle (5000 t/an)",
        niveau: "OUTPUT",
        quantification: "Mangue sechee, jus, puree - certifiee HACCP",
        horizon: "MOYEN",
      },
      {
        id: "res-011-2",
        intitule: "200 emplois directs crees dont 60% de femmes",
        niveau: "IMPACT",
        quantification: "200 emplois permanents + 500 saisonniers",
        horizon: "MOYEN",
      },
    ],
    indicateurs: [
      {
        id: "ind-011-1",
        intitule: "Volume de mangue transformee par an",
        type: "RESULTAT",
        resultat_associe: "res-011-1",
        source: "Unite de production",
        baseline: "200 t/an (artisanal)",
        frequence: "Annuelle",
      },
    ],
    synthese_narrative:
      "La transformation de la mangue represente une opportunite majeure de creation de valeur ajoutee et d'emplois dans les Hauts-Bassins. Ce besoin vise a passer de l'artisanat a l'industriel avec des normes d'export.",
    population_impact: 25000,
    budget: 350000000,
    auteur_id: "user-admin-002",
    created_at: "2025-10-15T10:00:00Z",
    published_at: "2025-11-05T08:00:00Z",
    updated_at: "2026-01-20T14:00:00Z",
  },
  {
    id: "need-012",
    slug: "autonomisation-femmes-numerique",
    titre: "Autonomisation des femmes par le numerique",
    domaine: "Femmes",
    secteur: "Entrepreneuriat feminin",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["QUICK-WIN", "URGENT"],
    question_centrale:
      "Comment utiliser les outils numeriques pour renforcer l'autonomisation economique des femmes burkinabe, en particulier dans le commerce et l'artisanat ?",
    contexte_strategique:
      "Les femmes representent 52% de la population active mais ne contribuent qu'a 33% du PIB formel. 80% des femmes entrepreneures operent dans le secteur informel sans acces au credit ni a la formation. Le taux de penetration mobile chez les femmes est de 65% (vs 85% pour les hommes). Les plateformes de commerce en ligne (e-commerce) emergent mais excluent les femmes rurales. Le Programme National Genre 2024-2028 identifie le numerique comme levier prioritaire.",
    parties_prenantes: [
      {
        id: "pp-012-1",
        categorie: "Initiateur",
        acteur: "Ministere de la Femme et de la Solidarite Nationale",
        role: "Pilotage strategique et coordination",
        position: "Actif",
      },
      {
        id: "pp-012-2",
        categorie: "Beneficiaire",
        acteur: "Federation des femmes entrepreneures du Burkina",
        role: "Mobilisation et accompagnement des beneficiaires",
        position: "Actif",
      },
      {
        id: "pp-012-3",
        categorie: "Financeur",
        acteur: "ONU Femmes",
        role: "Co-financement et expertise genre",
        position: "Actif",
      },
    ],
    obstacles: [
      {
        id: "obs-012-1",
        intitule: "Fracture numerique de genre",
        nature: "CAPITAL_HUMAIN",
        description:
          "Les femmes ont 20% moins de chances de posseder un smartphone et 40% moins de chances d'utiliser Internet. Les formations doivent etre adaptees.",
        criticite: 2,
        controlabilite: "TOTALE",
      },
      {
        id: "obs-012-2",
        intitule: "Charge domestique limitant le temps de formation",
        nature: "CONTEXTUEL",
        description:
          "Les femmes consacrent en moyenne 5h/jour aux taches domestiques. Les formations doivent etre flexibles et courtes.",
        criticite: 2,
        controlabilite: "PARTIELLE",
      },
      {
        id: "obs-012-3",
        intitule: "Acces limite au credit pour les femmes",
        nature: "FINANCEMENT",
        description:
          "Les institutions financieres exigent des garanties que la majorite des femmes entrepreneures ne peuvent fournir.",
        criticite: 3,
        controlabilite: "PARTIELLE",
      },
    ],
    resultats: [
      {
        id: "res-012-1",
        intitule: "5000 femmes formees aux outils numeriques de commerce",
        niveau: "OUTPUT",
        quantification: "E-commerce, mobile money, marketing digital",
        horizon: "COURT",
      },
      {
        id: "res-012-2",
        intitule: "Augmentation de 40% du revenu moyen des beneficiaires",
        niveau: "OUTCOME",
        quantification: "De 45 000 FCFA/mois a 63 000 FCFA/mois en moyenne",
        horizon: "MOYEN",
      },
    ],
    indicateurs: [
      {
        id: "ind-012-1",
        intitule: "Nombre de femmes formees et actives sur les plateformes",
        type: "RESULTAT",
        resultat_associe: "res-012-1",
        source: "Plateforme de formation",
        baseline: "350 femmes (pilote 2025)",
        frequence: "Mensuelle",
      },
    ],
    synthese_narrative:
      "L'autonomisation des femmes par le numerique est un enjeu de developpement majeur. Ce besoin vise a former 5000 femmes aux outils de commerce numerique et a creer un ecosysteme de soutien (credit, mentorat, plateformes).",
    population_impact: 25000,
    budget: 150000000,
    auteur_id: "user-admin-001",
    created_at: "2025-12-15T10:00:00Z",
    published_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-03-05T10:00:00Z",
  },
  // ── Besoin de TEST en statut BROUILLON (dev only) ─────────────────────────
  {
    id: "need-test-brouillon",
    slug: "test-besoin-brouillon",
    titre: "Besoin test en brouillon (dev only)",
    domaine: "Numerique",
    secteur: "TIC",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "LOCAL",
    statut: "BROUILLON",
    tags: ["test", "brouillon"],
    question_centrale: "Comment tester la modification d'un besoin en statut BROUILLON ?",
    contexte_strategique: "Besoin créé uniquement pour les tests de l'interface de modification.",
    parties_prenantes: [],
    obstacles: [],
    resultats: [],
    indicateurs: [],
    synthese_narrative: "Besoin de test pour valider le formulaire de modification.",
    population_impact: 0,
    budget: 0,
    auteur_id: "user-test-001",
    created_at: "2026-01-01T00:00:00Z",
    published_at: null,
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// population_impact total:
// 120000 + 85000 + 65000 + 120000 + 45000 + 450000 + 35000 + 35000 + 12000 + 100000 + 25000 + 25000 = 1 117 000
// Note: Les stats affichees sont celles de la landing page (992K = plateforme entiere, pas seulement les 12 mocks)

// ── 8 Appels a solutionnement ──────────────────────────────────────────────

export const MOCK_CALLS: CallForSolutions[] = [
  {
    id: "call-001",
    need_id: "need-001",
    need: MOCK_NEEDS[0]!,
    titre: "Conception d'un concentrateur d'oxygene a fabrication locale",
    description:
      "Appel aux ingenieurs et entrepreneurs pour proposer un design de concentrateur d'oxygene fabriquable au Burkina Faso avec des composants accessibles localement. Le prototype doit etre certifiable et produire 5-10 L/min.",
    domaine: "Sante",
    deadline: "2026-06-15T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 75000000,
    nb_proposals: 12,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "call-002",
    need_id: "need-002",
    need: MOCK_NEEDS[1]!,
    titre: "Kit d'irrigation solaire intelligent pour petit exploitant",
    description:
      "Recherche de solutions d'irrigation solaire connectee adaptees aux parcelles de 0,5 a 2 hectares en zone sahelienne. Le kit doit fonctionner sans connexion Internet permanente et etre maintenable par les agriculteurs eux-memes.",
    domaine: "Agriculture",
    deadline: "2026-05-30T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 45000000,
    nb_proposals: 18,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "call-003",
    need_id: "need-003",
    need: MOCK_NEEDS[2]!,
    titre: "Serveur educatif offline pour ecoles rurales",
    description:
      "Developpement d'un serveur educatif autonome (type Raspberry Pi) precharge avec des contenus pedagogiques adaptes au programme scolaire burkinabe. Interface en francais et langues locales (moore, dioula).",
    domaine: "Education",
    deadline: "2026-05-15T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 30000000,
    nb_proposals: 8,
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "call-004",
    need_id: "need-005",
    need: MOCK_NEEDS[4]!,
    titre: "Modele de gestion communautaire de mini-reseau solaire",
    description:
      "Appel a propositions pour un modele economique et organisationnel de gestion communautaire de mini-reseaux solaires en zone rurale. Le modele doit assurer la viabilite financiere sur 20 ans et la maintenance locale.",
    domaine: "Energie",
    deadline: "2026-06-30T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 50000000,
    nb_proposals: 6,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "call-005",
    need_id: "need-007",
    need: MOCK_NEEDS[6]!,
    titre: "Application mobile de services publics accessibles",
    description:
      "Conception d'une application mobile pour acceder aux services publics les plus demandes (etat civil, impots, foncier). L'interface doit etre accessible aux personnes a faible litteratie numerique avec support vocal en langues locales.",
    domaine: "Numerique",
    deadline: "2026-04-30T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 60000000,
    nb_proposals: 22,
    created_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "call-006",
    need_id: "need-009",
    need: MOCK_NEEDS[8]!,
    titre: "Algorithme IA de detection de deforestation sahelienne",
    description:
      "Developpement d'un modele d'intelligence artificielle calibre sur les donnees satellite du Sahel pour detecter la deforestation en quasi-temps reel. Le modele doit gerer la couverture nuageuse et les changements saisonniers.",
    domaine: "Environnement",
    deadline: "2026-05-01T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 25000000,
    nb_proposals: 5,
    created_at: "2026-02-15T10:00:00Z",
  },
  {
    id: "call-007",
    need_id: "need-012",
    need: MOCK_NEEDS[11]!,
    titre: "Plateforme e-commerce pour femmes entrepreneures",
    description:
      "Creation d'une plateforme de commerce en ligne adaptee aux femmes entrepreneures burkinabe. Fonctionnalites cles : catalogue produits simplifie, paiement mobile money, livraison locale, formation integree.",
    domaine: "Femmes",
    deadline: "2026-04-15T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 35000000,
    nb_proposals: 14,
    created_at: "2026-02-05T10:00:00Z",
  },
  {
    id: "call-008",
    need_id: "need-011",
    need: MOCK_NEEDS[10]!,
    titre: "Technologie de sechage solaire industriel de mangue",
    description:
      "Recherche d'une technologie de sechage solaire a echelle semi-industrielle (5 tonnes/jour) pour la mangue. La solution doit respecter les normes HACCP et fonctionner sans connexion au reseau electrique.",
    domaine: "Industrie",
    deadline: "2026-06-01T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 40000000,
    nb_proposals: 9,
    created_at: "2026-03-10T10:00:00Z",
  },
];

// ── Stats agreges (correspondant a la landing page) ────────────────────────

export const MOCK_STATS: IEStats = {
  needsCount: 156,
  proposalsCount: 523,
  parrainsCount: 28,
  populationImpact: 992000,
  budgetMobilise: 5800000000,
};

// ── Domaines disponibles (pour les filtres) ────────────────────────────────

export const DOMAINES = [
  "Sante",
  "Agriculture",
  "Education",
  "Eau",
  "Energie",
  "Securite",
  "Numerique",
  "Transport",
  "Environnement",
  "Finance",
  "Industrie",
  "Femmes",
] as const;

export const TAGS = [
  "URGENT",
  "COMPLEXE",
  "QUICK-WIN",
  "DONNEES MANQUANTES",
] as const;
