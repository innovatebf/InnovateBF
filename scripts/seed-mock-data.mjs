/**
 * Seed: importe les 12 besoins + 8 appels à solutionnement
 * Usage: node --env-file=.env.local scripts/seed-mock-data.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const sql = neon(process.env.DATABASE_URL);

// ── Mock data (copie des données de lib/innovons/mock-data.ts) ─────────────

const MOCK_NEEDS = [
  {
    id: "need-001",
    slug: "souverainete-sanitaire-equipements-medicaux",
    titre: "Souveraineté sanitaire : production locale d'équipements médicaux",
    domaine: "Sante",
    secteur: "Equipements medicaux",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["URGENT", "COMPLEXE"],
    question_centrale: "Comment le Burkina Faso peut-il réduire sa dépendance aux importations d'équipements médicaux essentiels en développant une filière de production locale adaptée aux réalités du terrain ?",
    contexte_strategique: "Le Burkina Faso importe plus de 95% de ses équipements médicaux. La crise sanitaire mondiale a révélé la vulnérabilité du pays face aux ruptures d'approvisionnement. Les structures de santé périphériques manquent cruellement d'équipements de base (concentrateurs d'oxygène, respirateurs, dispositifs de diagnostic rapide). Le Plan National de Développement Sanitaire 2021-2030 identifie la souveraineté sanitaire comme axe prioritaire.",
    parties_prenantes: [
      { id: "pp-001-1", categorie: "Initiateur", acteur: "Ministère de la Santé", role: "Définir les besoins prioritaires et les normes de qualité", position: "Actif" },
      { id: "pp-001-2", categorie: "Financeur", acteur: "Banque Mondiale - Projet PAPS", role: "Financer la R&D et les infrastructures de production", position: "Actif" },
      { id: "pp-001-3", categorie: "Expert", acteur: "Université Joseph Ki-Zerbo - Département Génie Biomédical", role: "Apporter l'expertise technique", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-001-1", intitule: "Absence de normes de certification locale", nature: "REGLEMENTATION", description: "Aucun cadre réglementaire national pour certifier les équipements médicaux produits localement.", criticite: 3, controlabilite: "PARTIELLE" },
      { id: "obs-001-2", intitule: "Déficit de compétences en génie biomédical", nature: "CAPITAL_HUMAIN", description: "Moins de 50 ingénieurs biomédicaux formés par an au Burkina Faso.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-001-1", intitule: "3 types d'équipements médicaux produits localement", niveau: "OUTPUT", quantification: "Concentrateurs O2, kits de diagnostic, stérilisateurs", horizon: "MOYEN" },
      { id: "res-001-2", intitule: "Réduction de 30% de la dépendance aux importations médicales", niveau: "IMPACT", quantification: "De 95% à 65% d'importations sur les équipements ciblés", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-001-1", intitule: "Nombre d'équipements produits et déployés", type: "RESULTAT", resultat_associe: "res-001-1", source: "Registre du Ministère de la Santé", baseline: "0 équipements produits localement", frequence: "Trimestrielle" },
    ],
    synthese_narrative: "Ce besoin vise à établir une filière de production d'équipements médicaux au Burkina Faso pour réduire la dépendance aux importations et améliorer l'accès aux soins dans les zones rurales.",
    population_impact: 120000,
    budget: 750000000,
    created_at: "2025-11-15T10:00:00Z",
    published_at: "2025-12-01T08:00:00Z",
  },
  {
    id: "need-002",
    slug: "irrigation-intelligente-zones-saheliennes",
    titre: "Irrigation intelligente pour les zones sahéliennes",
    domaine: "Agriculture",
    secteur: "Irrigation et eau agricole",
    region: "Sahel",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["URGENT"],
    question_centrale: "Comment concevoir et déployer à grande échelle un système d'irrigation intelligente et économe en eau adapté aux conditions climatiques sahéliennes du Burkina Faso pour sécuriser la production maraîchère des petits agriculteurs ?",
    contexte_strategique: "La région du Sahel au Burkina Faso fait face à une pluviométrie de 300-600 mm/an en déclin constant. 80% des agriculteurs dépendent de l'agriculture pluviale. Les systèmes d'irrigation existants consomment 2 à 3 fois plus d'eau que nécessaire. Les changements climatiques accentuent la pression sur les ressources en eau.",
    parties_prenantes: [
      { id: "pp-002-1", categorie: "Initiateur", acteur: "Ministère de l'Agriculture", role: "Orienter la politique agricole et coordonner le déploiement", position: "Actif" },
      { id: "pp-002-2", categorie: "Bénéficiaire", acteur: "Union des Producteurs Maraîchers du Sahel", role: "Adopter les technologies et former les membres", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-002-1", intitule: "Coût prohibitif des capteurs IoT", nature: "FINANCEMENT", description: "Le coût unitaire des capteurs d'humidité du sol connectés reste élevé (50 000 - 200 000 FCFA) pour les petits exploitants.", criticite: 3, controlabilite: "PARTIELLE" },
      { id: "obs-002-2", intitule: "Faible couverture réseau en zone rurale", nature: "INFRASTRUCTURE", description: "Moins de 40% des zones agricoles du Sahel bénéficient d'une couverture 3G/4G fiable.", criticite: 2, controlabilite: "FAIBLE" },
    ],
    resultats: [
      { id: "res-002-1", intitule: "Réduction de 40% de la consommation d'eau agricole", niveau: "OUTCOME", quantification: "De 8 000 m³/ha à 4 800 m³/ha en irrigué", horizon: "MOYEN" },
      { id: "res-002-2", intitule: "Augmentation de 25% des rendements maraîchers", niveau: "IMPACT", quantification: "Passage de 8 t/ha à 10 t/ha en tomate", horizon: "MOYEN" },
    ],
    indicateurs: [
      { id: "ind-002-1", intitule: "Volume d'eau économisé par saison", type: "RESULTAT", resultat_associe: "res-002-1", source: "Relevés des compteurs d'eau", baseline: "8 000 m³/ha/saison", frequence: "Saisonnière" },
    ],
    synthese_narrative: "Ce besoin vise à révolutionner l'agriculture maraîchère sahélienne par l'irrigation de précision, combinant capteurs bon marché, IA locale et pratiques agroécologiques.",
    population_impact: 250000,
    budget: 1200000000,
    created_at: "2025-10-20T10:00:00Z",
    published_at: "2025-11-10T08:00:00Z",
  },
  {
    id: "need-003",
    slug: "ecoles-numeriques-rurales",
    titre: "Écoles numériques rurales : accès au savoir pour tous",
    domaine: "Education",
    secteur: "Éducation numérique",
    region: "Est",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale: "Comment équiper et former durablement les écoles rurales du Burkina Faso avec des outils numériques éducatifs fonctionnels sans connexion Internet permanente pour réduire la fracture numérique éducative ?",
    contexte_strategique: "70% des écoles primaires rurales du Burkina Faso n'ont pas d'électricité stable. Le taux de scolarisation en zone rurale est de 67% vs 89% en zone urbaine. Les tablettes éducatives pilotes ont montré +35% de rétention des apprentissages. Le gouvernement vise 100% de couverture numérique scolaire d'ici 2030.",
    parties_prenantes: [
      { id: "pp-003-1", categorie: "Initiateur", acteur: "Ministère de l'Éducation Nationale", role: "Définir les curricula numériques et coordonner le déploiement national", position: "Actif" },
      { id: "pp-003-2", categorie: "Financeur", acteur: "UNICEF Burkina Faso", role: "Co-financer l'acquisition des équipements et la formation", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-003-1", intitule: "Absence d'électricité dans 70% des écoles rurales", nature: "INFRASTRUCTURE", description: "Les écoles rurales dépendent de générateurs diesel ou n'ont aucune source d'énergie.", criticite: 3, controlabilite: "TOTALE" },
      { id: "obs-003-2", intitule: "Manque de formation des enseignants aux outils numériques", nature: "CAPITAL_HUMAIN", description: "Moins de 15% des enseignants ruraux ont reçu une formation aux outils numériques.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-003-1", intitule: "500 écoles rurales équipées en kits numériques solaires", niveau: "OUTPUT", quantification: "Kit = serveur offline + 30 tablettes + panneau solaire", horizon: "MOYEN" },
      { id: "res-003-2", intitule: "Réduction de l'écart de compétences urbain-rural", niveau: "IMPACT", quantification: "Score PASEC rural : de 45/100 à 60/100", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-003-1", intitule: "Nombre d'élèves utilisant les outils numériques hebdomadairement", type: "RESULTAT", resultat_associe: "res-003-1", source: "Rapports hebdomadaires des écoles", baseline: "0 élèves en zone ciblée", frequence: "Mensuelle" },
    ],
    synthese_narrative: "Ce besoin adresse la fracture numérique éducative en proposant des solutions hors-ligne adaptées aux contraintes rurales burkinabè.",
    population_impact: 85000,
    budget: 500000000,
    created_at: "2025-09-05T10:00:00Z",
    published_at: "2025-10-01T08:00:00Z",
  },
  {
    id: "need-004",
    slug: "acces-eau-potable-regions-nord",
    titre: "Accès à l'eau potable dans les régions du Nord",
    domaine: "Eau",
    secteur: "Eau et assainissement",
    region: "Nord",
    pays: "Burkina Faso",
    niveau: "REGIONAL",
    statut: "PUBLIE",
    tags: ["URGENT", "COMPLEXE"],
    question_centrale: "Comment garantir un accès pérenne à l'eau potable pour les communautés rurales de la région Nord du Burkina Faso en s'appuyant sur des technologies de pompage solaire et une gestion communautaire viable ?",
    contexte_strategique: "La région Nord du Burkina Faso enregistre un taux d'accès à l'eau potable de 52%, bien en-dessous de la moyenne nationale (68%). Les forages traditionnels tombent souvent en panne par manque de maintenance. Le conflit sécuritaire a aggravé l'accès aux points d'eau dans plusieurs communes.",
    parties_prenantes: [
      { id: "pp-004-1", categorie: "Initiateur", acteur: "Direction Régionale de l'Eau et de l'Assainissement - Nord", role: "Coordonner les interventions et assurer la conformité réglementaire", position: "Actif" },
      { id: "pp-004-2", categorie: "Bénéficiaire", acteur: "Comités de Gestion des Points d'Eau (COGES)", role: "Gérer et maintenir les infrastructures", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-004-1", intitule: "Insécurité limitant l'accès aux zones rurales", nature: "CONTEXTE", description: "Les équipes techniques ne peuvent accéder à certaines communes sans escorte sécurisée.", criticite: 3, controlabilite: "FAIBLE" },
      { id: "obs-004-2", intitule: "Absence de modèle économique de maintenance", nature: "FINANCEMENT", description: "Les COGES ne collectent pas assez de cotisations pour financer les réparations.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-004-1", intitule: "200 nouveaux points d'eau solaires opérationnels", niveau: "OUTPUT", quantification: "Pompes solaires avec système de contrôle à distance", horizon: "MOYEN" },
      { id: "res-004-2", intitule: "Taux d'accès eau potable région Nord à 75%", niveau: "IMPACT", quantification: "De 52% à 75% de la population avec accès à moins de 500m", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-004-1", intitule: "Taux de fonctionnalité des points d'eau après 12 mois", type: "RESULTAT", resultat_associe: "res-004-1", source: "Rapports DREAHA", baseline: "63% de fonctionnalité", frequence: "Semestrielle" },
    ],
    synthese_narrative: "Ce besoin cible l'amélioration durable de l'accès à l'eau dans la région Nord via des solutions solaires robustes et une gouvernance communautaire renforcée.",
    population_impact: 450000,
    budget: 2500000000,
    created_at: "2025-08-10T10:00:00Z",
    published_at: "2025-09-01T08:00:00Z",
  },
  {
    id: "need-005",
    slug: "mini-reseaux-solaires-electrification-rurale",
    titre: "Mini-réseaux solaires pour l'électrification rurale",
    domaine: "Energie",
    secteur: "Énergie solaire décentralisée",
    region: "Boucle du Mouhoun",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale: "Comment concevoir et déployer des mini-réseaux solaires viables économiquement pour électrifier durablement les localités rurales burkinabè de plus de 500 habitants non connectées au réseau national SONABEL ?",
    contexte_strategique: "Seulement 22% des ménages ruraux burkinabè ont accès à l'électricité. SONABEL ne peut pas étendre le réseau national aux 8 000 villages dispersés. Le coût des panneaux solaires a chuté de 80% en 10 ans. Le FONER (Fonds National de l'Énergie Rurale) dispose de ressources sous-utilisées.",
    parties_prenantes: [
      { id: "pp-005-1", categorie: "Initiateur", acteur: "Ministère de l'Énergie (DGE)", role: "Réguler et faciliter les autorisations de mini-réseaux", position: "Actif" },
      { id: "pp-005-2", categorie: "Financeur", acteur: "Banque Africaine de Développement", role: "Financer à hauteur de 60% les infrastructures via le fonds Énergie", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-005-1", intitule: "Cadre réglementaire incomplet pour les mini-réseaux", nature: "REGLEMENTATION", description: "L'absence de tarification réglementée crée une incertitude pour les opérateurs privés.", criticite: 3, controlabilite: "PARTIELLE" },
      { id: "obs-005-2", intitule: "Manque de techniciens locaux qualifiés", nature: "CAPITAL_HUMAIN", description: "Moins de 200 techniciens certifiés en systèmes solaires sur tout le territoire.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-005-1", intitule: "100 mini-réseaux solaires déployés (50-200 kWc)", niveau: "OUTPUT", quantification: "Chaque mini-réseau alimentant 150-400 ménages et entreprises locales", horizon: "MOYEN" },
      { id: "res-005-2", intitule: "Taux d'électrification rurale à 35% d'ici 2028", niveau: "IMPACT", quantification: "De 22% à 35% des ménages ruraux électrifiés", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-005-1", intitule: "Nombre de ménages raccordés aux mini-réseaux", type: "RESULTAT", resultat_associe: "res-005-1", source: "Rapports FONER", baseline: "0 ménages dans la zone ciblée", frequence: "Trimestrielle" },
    ],
    synthese_narrative: "Ce besoin vise à accélérer l'électrification rurale via des mini-réseaux solaires viables, combinant financement innovant, régulation adaptée et entrepreneuriat local.",
    population_impact: 120000,
    budget: 3000000000,
    created_at: "2025-10-15T10:00:00Z",
    published_at: "2025-11-05T08:00:00Z",
  },
  {
    id: "need-006",
    slug: "surveillance-securitaire-drones-autonomes",
    titre: "Surveillance sécuritaire par drones autonomes",
    domaine: "Securite",
    secteur: "Défense et sécurité territoriale",
    region: "Sahel",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["URGENT", "COMPLEXE"],
    question_centrale: "Comment développer et déployer une flotte de drones autonomes de surveillance légère adaptée aux conditions climatiques et géographiques du Burkina Faso pour renforcer la capacité de détection précoce des menaces sécuritaires ?",
    contexte_strategique: "Le Burkina Faso fait face à une crise sécuritaire majeure depuis 2015 avec plus de 2 millions de déplacés internes. Les Forces Armées Nationales (FAN) manquent de capacités de surveillance aérienne légère et économique. Les drones commerciaux disponibles ne résistent pas aux conditions sahéliennes.",
    parties_prenantes: [
      { id: "pp-006-1", categorie: "Initiateur", acteur: "Ministère de la Défense", role: "Définir les besoins opérationnels et les spécifications techniques", position: "Actif" },
      { id: "pp-006-2", categorie: "Expert", acteur: "École Polytechnique de Ouagadougou", role: "Développer les prototypes et former les ingénieurs", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-006-1", intitule: "Transfert de technologie contrôlé internationalement", nature: "REGLEMENTATION", description: "Les technologies de drones militaires sont soumises aux régimes de contrôle MTCR et Wassenaar.", criticite: 3, controlabilite: "FAIBLE" },
      { id: "obs-006-2", intitule: "Conditions climatiques extrêmes (chaleur, sable, vent)", nature: "TECHNIQUE", description: "Les drones standard tombent en panne à des températures > 45°C et dans des conditions de poussière sahélienne.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-006-1", intitule: "Flotte de 50 drones de surveillance opérationnels", niveau: "OUTPUT", quantification: "Drones résistants aux conditions sahéliennes, autonomie 4h", horizon: "MOYEN" },
      { id: "res-006-2", intitule: "Réduction de 20% des incidents sécuritaires dans les zones couvertes", niveau: "IMPACT", quantification: "Zones de déploiement : Sahel, Est, Nord", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-006-1", intitule: "Taux de disponibilité opérationnelle de la flotte", type: "RESULTAT", resultat_associe: "res-006-1", source: "Rapports opérationnels FAN", baseline: "0% (capacité inexistante)", frequence: "Mensuelle" },
    ],
    synthese_narrative: "Ce besoin vise à renforcer la capacité de surveillance territoriale par le développement endogène de drones adaptés aux réalités burkinabè.",
    population_impact: 75000,
    budget: 1500000000,
    created_at: "2026-01-10T10:00:00Z",
    published_at: "2026-01-25T08:00:00Z",
  },
  {
    id: "need-007",
    slug: "plateforme-services-publics-numeriques",
    titre: "Plateforme unifiée de services publics numériques",
    domaine: "Numerique",
    secteur: "E-gouvernement",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale: "Comment concevoir une plateforme numérique unifiée et accessible qui permet aux citoyens burkinabè de réaliser leurs démarches administratives essentielles en ligne, quelle que soit leur localisation ou leur niveau de littératie numérique ?",
    contexte_strategique: "Un Burkinabè effectue en moyenne 12 démarches administratives par an, dont 80% nécessitent un déplacement physique. Le coût moyen d'une démarche (transport + temps perdu) est de 15 000 FCFA. La Stratégie Nationale de l'Économie Numérique 2025-2030 cible 60% des services publics numérisés d'ici 2030.",
    parties_prenantes: [
      { id: "pp-007-1", categorie: "Initiateur", acteur: "Secrétariat Général du Gouvernement / ANSSI", role: "Piloter le projet et assurer l'interopérabilité des systèmes ministériels", position: "Actif" },
      { id: "pp-007-2", categorie: "Partenaire", acteur: "Agence Nationale de l'État Civil", role: "Fournir l'accès aux données d'état civil pour la vérification d'identité", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-007-1", intitule: "Silotage des systèmes informatiques ministériels", nature: "TECHNIQUE", description: "Chaque ministère dispose de son propre système non interopérable.", criticite: 3, controlabilite: "PARTIELLE" },
      { id: "obs-007-2", intitule: "Faible taux d'adoption numérique (42% de la population)", nature: "SOCIOCULTUREL", description: "La fracture numérique touche particulièrement les femmes rurales et les personnes âgées.", criticite: 2, controlabilite: "PARTIELLE" },
    ],
    resultats: [
      { id: "res-007-1", intitule: "20 démarches administratives prioritaires disponibles en ligne", niveau: "OUTPUT", quantification: "CNI, extrait d'acte de naissance, attestation de résidence, impôts...", horizon: "COURT" },
      { id: "res-007-2", intitule: "Réduction de 50% du temps moyen de démarche administrative", niveau: "IMPACT", quantification: "De 3,5 jours à 1,5 jours en moyenne", horizon: "MOYEN" },
    ],
    indicateurs: [
      { id: "ind-007-1", intitule: "Nombre de démarches réalisées en ligne par mois", type: "RESULTAT", resultat_associe: "res-007-1", source: "Logs de la plateforme (anonymisés)", baseline: "0 démarche en ligne", frequence: "Mensuelle" },
    ],
    synthese_narrative: "Ce besoin vise à transformer la relation État-citoyens par une plateforme numérique inclusive, réduisant les coûts et délais des démarches administratives.",
    population_impact: 500000,
    budget: 2000000000,
    created_at: "2025-12-01T10:00:00Z",
    published_at: "2025-12-20T08:00:00Z",
  },
  {
    id: "need-008",
    slug: "reseau-routes-intelligentes-ouagadougou",
    titre: "Réseau de routes intelligentes pour Ouagadougou",
    domaine: "Transport",
    secteur: "Infrastructure routière urbaine",
    region: "Centre",
    pays: "Burkina Faso",
    niveau: "LOCAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale: "Comment intégrer des technologies de routes intelligentes (capteurs embarqués, signalisation adaptative, drainage intelligent) dans le réseau routier ouagalais pour réduire les accidents, la congestion et les inondations urbaines ?",
    contexte_strategique: "Ouagadougou enregistre 1 200 accidents de la route par an dont 180 mortels. Les embouteillages coûtent 50 milliards FCFA/an en productivité perdue. Les inondations récurrentes détruisent annuellement 15% du réseau bitumé. La ville accueille 3,5 millions d'habitants avec une croissance de 5%/an.",
    parties_prenantes: [
      { id: "pp-008-1", categorie: "Initiateur", acteur: "Mairie de Ouagadougou - Direction des Infrastructures", role: "Commander les travaux et assurer la maintenance", position: "Actif" },
      { id: "pp-008-2", categorie: "Financeur", acteur: "Fonds d'Entretien Routier du Burkina Faso (FER-BF)", role: "Cofinancer les innovations technologiques routières", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-008-1", intitule: "Coût élevé des capteurs et systèmes IoT", nature: "FINANCEMENT", description: "L'instrumentation d'un carrefour intelligent coûte 25-50 millions FCFA.", criticite: 3, controlabilite: "PARTIELLE" },
      { id: "obs-008-2", intitule: "Absence de maintenance préventive des infrastructures", nature: "GOUVERNANCE", description: "Le budget de maintenance routière est utilisé à 30% seulement de sa dotation.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-008-1", intitule: "10 carrefours intelligents avec feux adaptatifs déployés", niveau: "OUTPUT", quantification: "Carrefours clés de Ouagadougou instrumentés", horizon: "COURT" },
      { id: "res-008-2", intitule: "Réduction de 25% des accidents aux carrefours instrumentés", niveau: "IMPACT", quantification: "De 180 à 135 morts/an à terme", horizon: "MOYEN" },
    ],
    indicateurs: [
      { id: "ind-008-1", intitule: "Temps moyen de traversée des carrefours instrumentés", type: "RESULTAT", resultat_associe: "res-008-1", source: "Capteurs de flux + caméras IA", baseline: "3,5 minutes/carrefour en heure de pointe", frequence: "Temps réel (rapport hebdomadaire)" },
    ],
    synthese_narrative: "Ce besoin vise à moderniser les infrastructures routières de Ouagadougou avec des technologies intelligentes pour améliorer la sécurité, la fluidité et la résilience face aux inondations.",
    population_impact: 800000,
    budget: 1800000000,
    created_at: "2026-01-05T10:00:00Z",
    published_at: "2026-01-20T08:00:00Z",
  },
  {
    id: "need-009",
    slug: "surveillance-deforestation-satellites",
    titre: "Surveillance de la déforestation par imagerie satellite",
    domaine: "Environnement",
    secteur: "Gestion forestière et couverture végétale",
    region: "Est",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["URGENT"],
    question_centrale: "Comment mettre en place un système national de surveillance quasi-temps réel de la déforestation et de la dégradation forestière au Burkina Faso en exploitant l'imagerie satellite open-source et l'intelligence artificielle ?",
    contexte_strategique: "Le Burkina Faso perd 360 000 hectares de couverture forestière par an. Le couvert forestier est passé de 26% à 20% en 20 ans. Les données de déforestation ne sont disponibles qu'annuellement, empêchant toute intervention rapide. Le pays a pris des engagements de reboisement de 10 millions d'hectares d'ici 2030.",
    parties_prenantes: [
      { id: "pp-009-1", categorie: "Initiateur", acteur: "Ministère de l'Environnement (SP/CONEDD)", role: "Piloter le système et utiliser les données pour les politiques publiques", position: "Actif" },
      { id: "pp-009-2", categorie: "Expert", acteur: "Agence Spatiale Africaine / AGEOS", role: "Fournir l'accès aux données satellite et l'expertise en télédétection", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-009-1", intitule: "Couverture nuageuse occultant les images en saison des pluies", nature: "TECHNIQUE", description: "Pendant 4 mois/an, la couverture nuageuse dépasse 70%, rendant les images optiques inutilisables.", criticite: 2, controlabilite: "PARTIELLE" },
      { id: "obs-009-2", intitule: "Capacités limitées en traitement de données massives", nature: "CAPITAL_HUMAIN", description: "Moins de 15 experts nationaux en télédétection satellite et traitement d'images.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-009-1", intitule: "Système d'alerte précoce déforestation opérationnel", niveau: "OUTPUT", quantification: "Alertes générées dans les 72h suivant la détection", horizon: "COURT" },
      { id: "res-009-2", intitule: "Réduction de 15% du rythme de déforestation annuelle", niveau: "IMPACT", quantification: "De 360 000 ha/an à 306 000 ha/an", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-009-1", intitule: "Nombre d'alertes déforestation générées et traitées", type: "RESULTAT", resultat_associe: "res-009-1", source: "Tableau de bord du système de surveillance", baseline: "0 alerte en temps quasi-réel", frequence: "Hebdomadaire" },
    ],
    synthese_narrative: "Ce besoin vise à doter le Burkina Faso d'un outil de surveillance forestière de pointe, alliant satellites, IA et capacités humaines locales.",
    population_impact: 180000,
    budget: 350000000,
    created_at: "2025-11-20T10:00:00Z",
    published_at: "2025-12-10T08:00:00Z",
  },
  {
    id: "need-010",
    slug: "mobile-money-inclusion-financiere-rurale",
    titre: "Mobile money et inclusion financière en zone rurale",
    domaine: "Finance",
    secteur: "Finance inclusive et mobile banking",
    region: "Centre-Nord",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale: "Comment étendre les services de mobile money et développer des produits financiers adaptés aux besoins et contraintes spécifiques des populations rurales burkinabè pour accélérer leur inclusion financière ?",
    contexte_strategique: "65% des adultes burkinabè n'ont pas de compte bancaire formel. Le mobile money connaît une croissance de 40%/an mais reste concentré en zones urbaines. Les taux d'intérêt des usuriers ruraux atteignent 100-300%/an. La BCEAO pousse pour l'inclusion financière dans le cadre de la stratégie régionale UMOA.",
    parties_prenantes: [
      { id: "pp-010-1", categorie: "Initiateur", acteur: "Ministère des Finances / DGTCP", role: "Cadre réglementaire et coordination avec la BCEAO", position: "Actif" },
      { id: "pp-010-2", categorie: "Partenaire", acteur: "Orange Money / Moov Money", role: "Déployer les solutions techniques et les réseaux d'agents", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-010-1", intitule: "Faible pénétration du réseau mobile en zones rurales profondes", nature: "INFRASTRUCTURE", description: "30% des villages burkinabè n'ont pas de couverture réseau mobile 2G ou plus.", criticite: 3, controlabilite: "PARTIELLE" },
      { id: "obs-010-2", intitule: "Faible niveau d'éducation financière des ruraux", nature: "SOCIOCULTUREL", description: "Moins de 20% des ruraux comprennent les produits financiers formels.", criticite: 2, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-010-1", intitule: "1 million de nouveaux comptes mobile money ruraux ouverts", niveau: "OUTPUT", quantification: "Ciblant les femmes (60%) et les jeunes agriculteurs (40%)", horizon: "MOYEN" },
      { id: "res-010-2", intitule: "Taux d'inclusion financière rurale de 45%", niveau: "IMPACT", quantification: "De 28% à 45% des adultes ruraux avec accès à un service financier formel", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-010-1", intitule: "Nombre de transactions mobile money en zone rurale/mois", type: "RESULTAT", resultat_associe: "res-010-1", source: "Rapports opérateurs télécoms + BCEAO", baseline: "2 millions de transactions/mois en rural", frequence: "Mensuelle" },
    ],
    synthese_narrative: "Ce besoin vise à démocratiser l'accès aux services financiers dans les zones rurales burkinabè via des solutions mobile money adaptées et une éducation financière ciblée.",
    population_impact: 650000,
    budget: 800000000,
    created_at: "2025-10-01T10:00:00Z",
    published_at: "2025-10-25T08:00:00Z",
  },
  {
    id: "need-011",
    slug: "transformation-mangue-unite-industrielle",
    titre: "Unité industrielle de transformation de la mangue",
    domaine: "Industrie",
    secteur: "Agro-industrie et transformation alimentaire",
    region: "Hauts-Bassins",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale: "Comment développer une filière industrielle de transformation de la mangue burkinabè pour réduire les pertes post-récolte (estimées à 40%) et créer de la valeur ajoutée locale exportable sur les marchés régionaux et internationaux ?",
    contexte_strategique: "Le Burkina Faso produit 400 000 tonnes de mangues par an, dont 40% sont perdues par manque de capacités de transformation. Le potentiel d'export est de 50 000 tonnes de mangue séchée vers l'Europe. La filière emploie 50 000 producteurs mais génère peu de valeur ajoutée locale.",
    parties_prenantes: [
      { id: "pp-011-1", categorie: "Initiateur", acteur: "Chambre de Commerce et d'Industrie du Burkina Faso", role: "Fédérer les acteurs privés et accélérer les investissements", position: "Actif" },
      { id: "pp-011-2", categorie: "Bénéficiaire", acteur: "Association des Producteurs de Mangue des Hauts-Bassins", role: "Fournir la matière première et adopter les nouvelles pratiques", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-011-1", intitule: "Saisonnalité marquée (2 mois de récolte intensive)", nature: "ECONOMIQUE", description: "La courte saison crée des difficultés d'amortissement des équipements.", criticite: 2, controlabilite: "PARTIELLE" },
      { id: "obs-011-2", intitule: "Non-conformité aux normes sanitaires d'export européen", nature: "REGLEMENTATION", description: "Seules 15% des unités de transformation actuelles sont certifiées HACCP.", criticite: 3, controlabilite: "TOTALE" },
    ],
    resultats: [
      { id: "res-011-1", intitule: "3 unités agro-industrielles certifiées HACCP opérationnelles", niveau: "OUTPUT", quantification: "Capacité : 5 000 tonnes de mangue fraîche/an chacune", horizon: "MOYEN" },
      { id: "res-011-2", intitule: "Réduction des pertes post-récolte à 20%", niveau: "IMPACT", quantification: "De 40% à 20% de pertes sur la mangue fraîche", horizon: "MOYEN" },
    ],
    indicateurs: [
      { id: "ind-011-1", intitule: "Volume de mangue transformée par an", type: "RESULTAT", resultat_associe: "res-011-1", source: "Rapports de production des unités certifiées", baseline: "8 000 tonnes transformées/an", frequence: "Annuelle" },
    ],
    synthese_narrative: "Ce besoin vise à transformer la mangue burkinabè de produit périssable en produit d'exportation à haute valeur ajoutée, créant emplois et revenus durables.",
    population_impact: 200000,
    budget: 600000000,
    created_at: "2025-09-15T10:00:00Z",
    published_at: "2025-10-10T08:00:00Z",
  },
  {
    id: "need-012",
    slug: "autonomisation-femmes-numerique",
    titre: "Autonomisation des femmes par le numérique",
    domaine: "Femmes",
    secteur: "Genre et inclusion numérique",
    region: "Centre-Est",
    pays: "Burkina Faso",
    niveau: "NATIONAL",
    statut: "PUBLIE",
    tags: ["COMPLEXE"],
    question_centrale: "Comment concevoir et déployer à l'échelle nationale un programme d'autonomisation numérique des femmes burkinabè qui leur permette d'accéder à des opportunités économiques, éducatives et civiques par le numérique malgré les barrières culturelles et socio-économiques ?",
    contexte_strategique: "Les femmes représentent 52% de la population burkinabè mais seulement 20% des utilisatrices d'Internet. Le taux d'alphabétisation des femmes rurales est de 22%. Les violences basées sur le genre augmentent en contexte de crise. L'ODD 5 sur l'égalité femmes-hommes est loin d'être atteint au Burkina Faso.",
    parties_prenantes: [
      { id: "pp-012-1", categorie: "Initiateur", acteur: "Ministère de la Femme, de la Solidarité Nationale et de la Famille", role: "Coordonner le programme et intégrer aux politiques genre", position: "Actif" },
      { id: "pp-012-2", categorie: "Financeur", acteur: "ONU Femmes Burkina Faso", role: "Financer 40% du programme et apporter l'expertise genre", position: "Actif" },
    ],
    obstacles: [
      { id: "obs-012-1", intitule: "Résistances culturelles et familiales à l'autonomie numérique féminine", nature: "SOCIOCULTUREL", description: "Dans certaines communautés, l'utilisation de smartphone par les femmes est contrôlée ou interdite.", criticite: 3, controlabilite: "PARTIELLE" },
      { id: "obs-012-2", intitule: "Faible alphabétisation limitant l'adoption du numérique", nature: "CAPITAL_HUMAIN", description: "22% d'alphabétisation chez les femmes rurales bloque l'usage des interfaces textuelles.", criticite: 2, controlabilite: "PARTIELLE" },
    ],
    resultats: [
      { id: "res-012-1", intitule: "50 000 femmes formées aux compétences numériques de base", niveau: "OUTPUT", quantification: "Formation en présentiel + suivi mobile en langues locales", horizon: "MOYEN" },
      { id: "res-012-2", intitule: "Augmentation de 30% des revenus des femmes formées", niveau: "IMPACT", quantification: "Via commerce en ligne, services numériques, emploi qualifié", horizon: "LONG" },
    ],
    indicateurs: [
      { id: "ind-012-1", intitule: "Nombre de femmes actives sur les plateformes numériques économiques", type: "RESULTAT", resultat_associe: "res-012-1", source: "Rapports partenaires + enquêtes panel", baseline: "2 300 femmes dans les zones ciblées", frequence: "Trimestrielle" },
    ],
    synthese_narrative: "Ce besoin vise à lever les barrières à l'inclusion numérique des femmes burkinabè via une approche culturellement adaptée, en langues locales et en présentiel.",
    population_impact: 350000,
    budget: 900000000,
    created_at: "2025-12-10T10:00:00Z",
    published_at: "2026-01-05T08:00:00Z",
  },
];

const MOCK_CALLS = [
  {
    need_id_mock: "need-001",
    need_slug: "souverainete-sanitaire-equipements-medicaux",
    titre: "Conception d'un concentrateur d'oxygène à fabrication locale",
    description: "Appel aux ingénieurs et entrepreneurs pour proposer un design de concentrateur d'oxygène fabriquable au Burkina Faso avec des composants accessibles localement. Le prototype doit être certifiable et produire 5-10 L/min.",
    domaine: "Sante",
    deadline: "2026-06-15T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 75000000,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    need_id_mock: "need-002",
    need_slug: "irrigation-intelligente-zones-saheliennes",
    titre: "Kit d'irrigation solaire intelligent pour petit exploitant",
    description: "Recherche de solutions d'irrigation solaire connectée adaptées aux parcelles de 0,5 à 2 hectares en zone sahélienne. Le kit doit fonctionner sans connexion Internet permanente et être maintenable par les agriculteurs eux-mêmes.",
    domaine: "Agriculture",
    deadline: "2026-05-30T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 45000000,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    need_id_mock: "need-003",
    need_slug: "ecoles-numeriques-rurales",
    titre: "Serveur éducatif offline pour écoles rurales",
    description: "Développement d'un serveur éducatif autonome (type Raspberry Pi) préchargé avec des contenus pédagogiques adaptés au programme scolaire burkinabè. Interface en français et langues locales (mooré, dioula).",
    domaine: "Education",
    deadline: "2026-05-15T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 30000000,
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    need_id_mock: "need-005",
    need_slug: "mini-reseaux-solaires-electrification-rurale",
    titre: "Modèle de gestion communautaire de mini-réseau solaire",
    description: "Appel à propositions pour un modèle économique et organisationnel de gestion communautaire de mini-réseaux solaires en zone rurale. Le modèle doit assurer la viabilité financière sur 20 ans et la maintenance locale.",
    domaine: "Energie",
    deadline: "2026-06-30T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 50000000,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    need_id_mock: "need-007",
    need_slug: "plateforme-services-publics-numeriques",
    titre: "Application mobile de services publics accessibles",
    description: "Conception d'une application mobile pour accéder aux services publics les plus demandés (état civil, impôts, foncier). L'interface doit être accessible aux personnes à faible littératie numérique avec support vocal en langues locales.",
    domaine: "Numerique",
    deadline: "2026-04-30T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 60000000,
    created_at: "2026-01-20T10:00:00Z",
  },
  {
    need_id_mock: "need-009",
    need_slug: "surveillance-deforestation-satellites",
    titre: "Algorithme IA de détection de déforestation sahélienne",
    description: "Développement d'un modèle d'intelligence artificielle calibré sur les données satellite du Sahel pour détecter la déforestation en quasi-temps réel. Le modèle doit gérer la couverture nuageuse et les changements saisonniers.",
    domaine: "Environnement",
    deadline: "2026-05-01T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 25000000,
    created_at: "2026-02-15T10:00:00Z",
  },
  {
    need_id_mock: "need-012",
    need_slug: "autonomisation-femmes-numerique",
    titre: "Plateforme e-commerce pour femmes entrepreneures",
    description: "Création d'une plateforme de commerce en ligne adaptée aux femmes entrepreneures burkinabè. Fonctionnalités clés : catalogue produits simplifié, paiement mobile money, livraison locale, formation intégrée.",
    domaine: "Femmes",
    deadline: "2026-04-15T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 35000000,
    created_at: "2026-02-05T10:00:00Z",
  },
  {
    need_id_mock: "need-011",
    need_slug: "transformation-mangue-unite-industrielle",
    titre: "Technologie de séchage solaire industriel de mangue",
    description: "Recherche d'une technologie de séchage solaire à échelle semi-industrielle (5 tonnes/jour) pour la mangue. La solution doit respecter les normes HACCP et fonctionner sans connexion au réseau électrique.",
    domaine: "Industrie",
    deadline: "2026-06-01T23:59:59Z",
    statut: "OUVERT",
    budget_alloue: 40000000,
    created_at: "2026-03-10T10:00:00Z",
  },
];

// ── Seed functions ──────────────────────────────────────────────────────────

async function ensureCallsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ie_calls (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      need_id       UUID NOT NULL,
      titre         TEXT NOT NULL,
      description   TEXT,
      domaine       TEXT,
      deadline      TIMESTAMPTZ NOT NULL,
      statut        TEXT NOT NULL DEFAULT 'OUVERT'
                      CHECK (statut IN ('OUVERT','FERME','SELECTIONNE')),
      budget_alloue BIGINT DEFAULT 0,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_calls_need_id ON ie_calls (need_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_calls_statut  ON ie_calls (statut)`;
  console.log("✅ Table ie_calls prête");
}

async function getAdminId() {
  const rows = await sql`SELECT id FROM "user" WHERE email = 'admin@innovatebf.org' LIMIT 1`;
  return rows[0]?.id ?? null;
}

async function seedNeeds(adminId) {
  let inserted = 0;
  let skipped = 0;

  for (const n of MOCK_NEEDS) {
    const existing = await sql`SELECT id FROM ie_needs WHERE slug = ${n.slug} LIMIT 1`;
    if (existing.length > 0) {
      console.log(`  ⏭  Déjà présent: ${n.titre}`);
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO ie_needs (
        slug, titre, domaine, secteur, pays, niveau, region,
        statut, tags, question_centrale, contexte_strategique,
        parties_prenantes, obstacles, resultats, indicateurs,
        synthese_narrative, population_impact, budget,
        auteur_id, auteur_email, coherence_score,
        created_at, published_at, updated_at
      ) VALUES (
        ${n.slug}, ${n.titre}, ${n.domaine ?? null}, ${n.secteur ?? null},
        ${n.pays ?? 'Burkina Faso'}, ${n.niveau ?? 'NATIONAL'}, ${n.region ?? null},
        ${n.statut}, ${JSON.stringify(n.tags ?? [])}::jsonb,
        ${n.question_centrale ?? null}, ${n.contexte_strategique ?? null},
        ${JSON.stringify(n.parties_prenantes ?? [])}::jsonb,
        ${JSON.stringify(n.obstacles ?? [])}::jsonb,
        ${JSON.stringify(n.resultats ?? [])}::jsonb,
        ${JSON.stringify(n.indicateurs ?? [])}::jsonb,
        ${n.synthese_narrative ?? null},
        ${n.population_impact ?? 0}, ${n.budget ?? 0},
        ${null}, ${'admin@innovatebf.org'}, ${7},
        ${n.created_at}, ${n.published_at ?? n.created_at}, ${n.created_at}
      )
    `;
    inserted++;
    console.log(`  ✅ ${n.titre}`);
  }

  console.log(`\n  → ${inserted} insérés, ${skipped} déjà présents`);
}

async function seedCalls() {
  // Récupérer slug → UUID réels
  const dbNeeds = await sql`SELECT id, slug FROM ie_needs`;
  const slugToId = {};
  for (const row of dbNeeds) slugToId[row.slug] = row.id;

  let inserted = 0;
  let skipped = 0;

  for (const c of MOCK_CALLS) {
    const realNeedId = slugToId[c.need_slug];
    if (!realNeedId) {
      console.warn(`  ⚠️  Besoin introuvable pour "${c.titre}"`);
      skipped++;
      continue;
    }

    const existing = await sql`SELECT id FROM ie_calls WHERE titre = ${c.titre} AND need_id = ${realNeedId} LIMIT 1`;
    if (existing.length > 0) {
      console.log(`  ⏭  Déjà présent: ${c.titre}`);
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO ie_calls (need_id, titre, description, domaine, deadline, statut, budget_alloue, created_at)
      VALUES (${realNeedId}, ${c.titre}, ${c.description}, ${c.domaine}, ${c.deadline}, ${c.statut}, ${c.budget_alloue}, ${c.created_at})
    `;
    inserted++;
    console.log(`  ✅ ${c.titre}`);
  }

  console.log(`\n  → ${inserted} insérés, ${skipped} déjà présents`);
}

async function main() {
  console.log("🌱 Seed InnovonsEnsembleLeFaso\n");

  const adminId = await getAdminId();
  console.log(adminId ? `✅ Admin: ${adminId}\n` : "⚠️  Admin non trouvé — auteur_id sera null\n");

  console.log("── Besoins (12) ─────────────────────────");
  await seedNeeds(adminId);

  console.log("\n── Appels à solutionnement (8) ──────────");
  await ensureCallsTable();
  await seedCalls();

  const [{ count: nbNeeds }] = await sql`SELECT COUNT(*) FROM ie_needs`;
  const [{ count: nbCalls }] = await sql`SELECT COUNT(*) FROM ie_calls`;
  console.log(`\n🎉 Résultat final:`);
  console.log(`   ie_needs : ${nbNeeds} besoins`);
  console.log(`   ie_calls : ${nbCalls} appels`);
}

main().catch((e) => { console.error("❌", e.message, e.detail ?? '', e.hint ?? ''); process.exit(1); });
