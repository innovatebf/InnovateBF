-- ============================================================================
-- InnovonsEnsembleLeFaso — Donnees de seed
-- 5 profils (dont 2 parrains), 12 besoins publies, 8 appels
-- ============================================================================

-- ── Profils ────────────────────────────────────────────────────────────────
-- Note : En production, les profils sont crees via le trigger on_auth_user_created.
-- Ces seeds supposent que les UUIDs existent dans auth.users (environnement de dev).

INSERT INTO public.ie_profiles (id, email, full_name, role, organisation) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@innovonslefaso.bf', 'Amadou Ouedraogo', 'ADMINISTRATEUR', 'InnovateBF'),
  ('00000000-0000-0000-0000-000000000002', 'parrain1@exemple.bf', 'Fatimata Sawadogo', 'PARRAIN', 'Ministere de la Sante'),
  ('00000000-0000-0000-0000-000000000003', 'parrain2@exemple.bf', 'Ibrahim Compaore', 'PARRAIN', 'SONABEL'),
  ('00000000-0000-0000-0000-000000000004', 'innovateur@exemple.bf', 'Mariam Kone', 'INNOVATEUR', 'FasoTech Lab'),
  ('00000000-0000-0000-0000-000000000005', 'user@exemple.bf', 'Moussa Traore', 'UTILISATEUR', NULL)
ON CONFLICT (id) DO NOTHING;

-- ── 12 Besoins publies ────────────────────────────────────────────────────

INSERT INTO public.ie_needs (
  id, slug, titre, domaine, secteur, region, pays, niveau, statut,
  tags, question_centrale, contexte_strategique, synthese_narrative,
  population_impact, budget, auteur_id, published_at
) VALUES
-- 1. Sante
(
  'a0000000-0000-0000-0000-000000000001',
  'souverainete-sanitaire-respirateurs',
  'Souverainete sanitaire : production locale de respirateurs',
  'Sante',
  'Equipements medicaux',
  'Centre',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['sante', 'industrie', 'souverainete'],
  'Comment garantir un approvisionnement fiable en respirateurs fabriques localement ?',
  'La crise COVID-19 a revele la dependance totale du Burkina Faso aux importations d''equipements medicaux critiques. Le projet Faso-Air vise a concevoir et produire des respirateurs adaptes au contexte local.',
  'Projet strategique pour reduire la dependance aux importations medicales et creer une filiere industrielle locale.',
  2500000,
  850000000,
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '30 days'
),
-- 2. Agriculture
(
  'a0000000-0000-0000-0000-000000000002',
  'irrigation-solaire-intelligente',
  'Systeme d''irrigation solaire intelligent pour le Sahel',
  'Agriculture',
  'AgriTech',
  'Sahel',
  'Burkina Faso',
  'REGIONAL',
  'PUBLIE',
  ARRAY['agriculture', 'solaire', 'iot', 'sahel'],
  'Comment optimiser l''utilisation de l''eau agricole dans les zones arides grace a l''IoT et l''energie solaire ?',
  'Le Sahel burkinabe fait face a une rarefaction croissante des ressources en eau. L''irrigation traditionnelle gaspille jusqu''a 60% de l''eau utilisee.',
  'Solution combinant capteurs IoT et pompes solaires pour une irrigation de precision adaptee au contexte sahelien.',
  180000,
  420000000,
  '00000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '25 days'
),
-- 3. Securite
(
  'a0000000-0000-0000-0000-000000000003',
  'drones-surveillance-autonomes',
  'Drones de surveillance autonomes pour la securite territoriale',
  'Securite',
  'Defense',
  'Est',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['securite', 'drones', 'ia', 'defense'],
  'Comment deployer un systeme de surveillance aerienne autonome pour securiser les zones fragiles ?',
  'Les regions frontalières du Burkina Faso font face a des defis securitaires majeurs. La surveillance terrestre classique est insuffisante sur de vastes territoires.',
  'Programme de developpement de drones de surveillance adaptes aux conditions climatiques locales avec traitement d''image embarque.',
  500000,
  1200000000,
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '20 days'
),
-- 4. Education
(
  'a0000000-0000-0000-0000-000000000004',
  'plateforme-elearning-langues-nationales',
  'Plateforme e-learning en langues nationales',
  'Education',
  'EdTech',
  'Centre',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['education', 'numerique', 'langues', 'inclusion'],
  'Comment rendre l''education numerique accessible aux populations non francophones ?',
  'Plus de 70% de la population burkinabe ne maitrise pas le francais. L''acces au savoir numerique reste limite aux elites urbaines francophones.',
  'Plateforme educative multilingue (moore, dioula, fulfulde) avec contenus audio-visuels adaptes.',
  3000000,
  380000000,
  '00000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '18 days'
),
-- 5. Energie
(
  'a0000000-0000-0000-0000-000000000005',
  'mini-grids-solaires-communautaires',
  'Mini-grids solaires communautaires pour l''electrification rurale',
  'Energie',
  'Energies renouvelables',
  'Boucle du Mouhoun',
  'Burkina Faso',
  'REGIONAL',
  'PUBLIE',
  ARRAY['energie', 'solaire', 'rural', 'communautaire'],
  'Comment electrifier durablement les villages non connectes au reseau national ?',
  'Le taux d''electrification rurale au Burkina Faso reste inferieur a 5%. Les mini-grids solaires representent la solution la plus viable economiquement.',
  'Deploiement de micro-reseaux solaires avec gestion communautaire et paiement mobile.',
  120000,
  750000000,
  '00000000-0000-0000-0000-000000000003',
  NOW() - INTERVAL '15 days'
),
-- 6. Eau et assainissement
(
  'a0000000-0000-0000-0000-000000000006',
  'stations-traitement-eau-low-cost',
  'Stations de traitement d''eau a faible cout',
  'Eau et Assainissement',
  'Infrastructure',
  'Nord',
  'Burkina Faso',
  'REGIONAL',
  'PUBLIE',
  ARRAY['eau', 'assainissement', 'sante-publique', 'low-cost'],
  'Comment fournir de l''eau potable a moindre cout dans les zones rurales isolees ?',
  'Pres de 30% de la population burkinabe n''a pas acces a l''eau potable. Les solutions conventionnelles sont trop couteuses pour les communautes rurales.',
  'Conception de stations de traitement d''eau compactes utilisant des materiaux locaux et l''energie solaire.',
  450000,
  280000000,
  '00000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '12 days'
),
-- 7. Transport
(
  'a0000000-0000-0000-0000-000000000007',
  'mobilite-electrique-ouagadougou',
  'Mobilite electrique pour Ouagadougou',
  'Transport',
  'Mobilite urbaine',
  'Centre',
  'Burkina Faso',
  'LOCAL',
  'PUBLIE',
  ARRAY['transport', 'electrique', 'urbain', 'pollution'],
  'Comment reduire la pollution atmospherique liee aux deux-roues motorises a Ouagadougou ?',
  'Ouagadougou compte plus de 2 millions de motos thermiques. La pollution de l''air est devenue un enjeu de sante publique majeur.',
  'Programme de conversion et de fabrication locale de motos et tricycles electriques avec infrastructure de recharge solaire.',
  800000,
  520000000,
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '10 days'
),
-- 8. Numerique
(
  'a0000000-0000-0000-0000-000000000008',
  'identite-numerique-biometrique',
  'Systeme d''identite numerique biometrique',
  'Numerique',
  'GovTech',
  'Centre',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['numerique', 'identite', 'biometrie', 'gouvernance'],
  'Comment garantir une identite numerique fiable et inclusive pour tous les citoyens ?',
  'Des millions de burkinabe ne disposent pas de documents d''identite fiables, ce qui les exclut des services publics et financiers.',
  'Plateforme d''identite numerique basee sur la biometrie avec integration aux services publics et financiers.',
  5000000,
  680000000,
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '8 days'
),
-- 9. Industrie
(
  'a0000000-0000-0000-0000-000000000009',
  'transformation-karite-mecanisee',
  'Mecanisation de la transformation du karite',
  'Industrie',
  'Agroalimentaire',
  'Hauts-Bassins',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['industrie', 'karite', 'femmes', 'agroalimentaire'],
  'Comment moderniser la filiere karite tout en preservant les savoir-faire traditionnels ?',
  'Le Burkina Faso est le premier producteur mondial de karite. Pourtant, 95% de la transformation reste artisanale avec des rendements faibles.',
  'Equipements de transformation semi-industriels adaptes aux cooperatives feminines avec formation technique integree.',
  200000,
  350000000,
  '00000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '6 days'
),
-- 10. Sante (2)
(
  'a0000000-0000-0000-0000-000000000010',
  'telemedecine-zones-rurales',
  'Telemedecine pour les zones rurales',
  'Sante',
  'HealthTech',
  'Centre-Ouest',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['sante', 'telemedecine', 'rural', 'numerique'],
  'Comment offrir un acces aux soins specialises dans les zones eloignees des centres hospitaliers ?',
  'La densite medicale au Burkina Faso est de 0,05 medecin pour 1000 habitants en zone rurale. Les patients parcourent en moyenne 50 km pour une consultation specialisee.',
  'Reseau de cabines de telemedecine connectees aux CHU avec diagnostic assiste par IA.',
  1500000,
  420000000,
  '00000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '5 days'
),
-- 11. Environnement
(
  'a0000000-0000-0000-0000-000000000011',
  'recyclage-dechets-plastiques',
  'Filiere de recyclage des dechets plastiques',
  'Environnement',
  'Economie circulaire',
  'Centre',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['environnement', 'recyclage', 'plastique', 'emploi'],
  'Comment transformer le probleme des dechets plastiques en opportunite economique ?',
  'Ouagadougou genere plus de 100 000 tonnes de dechets plastiques par an. Moins de 5% sont recycles.',
  'Creation d''une filiere structuree de collecte, tri et transformation des plastiques en materiaux de construction.',
  600000,
  280000000,
  '00000000-0000-0000-0000-000000000003',
  NOW() - INTERVAL '3 days'
),
-- 12. Finance
(
  'a0000000-0000-0000-0000-000000000012',
  'monnaie-mobile-microfinance',
  'Microfinance mobile pour les artisans',
  'Finance',
  'FinTech',
  'Centre',
  'Burkina Faso',
  'NATIONAL',
  'PUBLIE',
  ARRAY['finance', 'mobile', 'microfinance', 'artisans'],
  'Comment donner acces au microcredit aux artisans non bancarises ?',
  'Plus de 80% des artisans burkinabe n''ont pas acces au credit formel. Le mobile money offre une infrastructure de base pour democratiser la microfinance.',
  'Application mobile de microcredit avec scoring alternatif base sur l''historique de transactions mobile money.',
  350000,
  180000000,
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- ── 8 Appels a solutionnement ─────────────────────────────────────────────

INSERT INTO public.ie_calls (id, need_id, titre, description, domaine, deadline, statut, budget_alloue) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Appel a prototypes : Respirateur Faso-Air v2',
  'Recherche d''equipes capables de concevoir un prototype fonctionnel de respirateur adapte aux standards OMS, a partir de composants disponibles localement.',
  'Sante',
  NOW() + INTERVAL '90 days',
  'OUVERT',
  150000000
),
(
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'Appel a solutions : Capteurs IoT pour irrigation sahelienne',
  'Developpement de capteurs d''humidite et de debit low-cost resistants aux conditions extremes du Sahel.',
  'Agriculture',
  NOW() + INTERVAL '60 days',
  'OUVERT',
  80000000
),
(
  'c0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000004',
  'Appel a contenus : E-learning en moore et dioula',
  'Production de contenus pedagogiques en langues nationales pour les niveaux primaire et secondaire.',
  'Education',
  NOW() + INTERVAL '45 days',
  'OUVERT',
  50000000
),
(
  'c0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000005',
  'Appel a deploiement : Mini-grids solaires Mouhoun',
  'Selection d''operateurs pour l''installation et la gestion de 20 mini-grids solaires dans la Boucle du Mouhoun.',
  'Energie',
  NOW() + INTERVAL '120 days',
  'OUVERT',
  200000000
),
(
  'c0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000007',
  'Appel a innovation : Motos electriques Made in Faso',
  'Conception et prototypage de motos electriques adaptees aux conditions routieres de Ouagadougou.',
  'Transport',
  NOW() + INTERVAL '75 days',
  'OUVERT',
  120000000
),
(
  'c0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000009',
  'Appel a equipements : Transformation du karite',
  'Conception de presses et broyeuses adaptees aux cooperatives feminines avec formation technique incluse.',
  'Industrie',
  NOW() + INTERVAL '30 days',
  'OUVERT',
  65000000
),
(
  'c0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000010',
  'Appel a deploiement : Cabines de telemedecine',
  'Installation de 15 cabines de telemedecine pilotes dans les CSPSs du Centre-Ouest.',
  'Sante',
  NOW() + INTERVAL '100 days',
  'OUVERT',
  90000000
),
(
  'c0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000011',
  'Appel a projets : Recyclage plastique Ouagadougou',
  'Mise en place d''une unite pilote de collecte, tri et transformation de dechets plastiques en paves.',
  'Environnement',
  NOW() + INTERVAL '55 days',
  'OUVERT',
  45000000
)
ON CONFLICT (id) DO NOTHING;
