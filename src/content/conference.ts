/**
 * Contenus fixes de la conférence EBC2026 : identité, patronage, affiche,
 * appel à projets, TDR et highlights.
 * Restent dans le back-office : dates et lieu (infos pratiques), ouverture et
 * clôture, programme, intervenants, Top Inventeurs, partenaires et sponsors, stands.
 */

import { tr, type Tr } from "@/i18n";

type Img = { src: string; alt: string | Tr };

/* ---------- Identité de la conférence ---------- */

export const conferenceIdentity = {
  name: "EBC2026",
  shortName: "EBC'26",
  edition: tr("2ᵉ édition", "2nd edition"),
  slogan: tr("Échangeons, Bâtissons, Contribuons", "Exchange, Build, Contribute"),
  fullName: tr(
    "Conférence pour l'innovation technologique et le développement endogène",
    "Conference on technological innovation and endogenous development",
  ),
  // Suit « organisée par le » sur la page de la conférence
  organizer: tr("think tank InnovateBF et ses partenaires", "the InnovateBF think tank and its partners"),
  logo: { src: "/LogoEBC2026.png", alt: "EBC'26 Bobo-Dioulasso" },
};

/** Photos des pages de la conférence */
export const conferenceImages = {
  speaker: { src: "/images/orateur.jpg", alt: tr("Intervenant en conférence", "Speaker giving a talk") },
  top5: { src: "/images/ingenieure-ordinateur.jpg", alt: tr("Inventrice au travail sur son ordinateur", "Inventor working on her computer") },
} satisfies Record<string, Img>;

/* ---------- Patronage (arrêté par le comité d'organisation) ---------- */

const emblem = { src: "/logos/armoiries-burkina.png", alt: tr("Armoiries du Burkina Faso", "Coat of arms of Burkina Faso") };

/** `minister` : portrait et nom du ministre en poste (photos Wikimedia Commons, domaine public CC0). */
export type PatronageItem = { role: Tr; lines: Tr[]; abbr: string; emblem: Img; minister?: { name: Tr; photo: string } };

export const patronage = {
  label: tr("Patronage", "Patronage"),
  items: [
    {
      role: tr("Sous le patronage de", "Under the patronage of"),
      lines: [
        tr("Camarade Ministre de l'Enseignement", "Comrade Minister of Higher"),
        tr("supérieur, de la Recherche", "Education, Research"),
        tr("et de l'Innovation (MESRI)", "and Innovation (MESRI)"),
      ],
      abbr: "MESRI",
      emblem,
      minister: { name: tr("Pr Adjima THIOMBIANO", "Prof. Adjima THIOMBIANO"), photo: "/images/patronage/thiombiano.jpg" },
    },
    {
      role: tr("Co-parrainage", "Co-sponsored by"),
      lines: [
        tr("Camarade Ministre de la Transition digitale,", "Comrade Minister of Digital Transition,"),
        tr("des Postes et des Communications", "Posts and Electronic"),
        tr("électroniques (MTDPCE)", "Communications (MTDPCE)"),
      ],
      abbr: "MTDPCE",
      emblem,
      minister: { name: tr("Dr Aminata ZERBO/SABANÉ", "Dr Aminata ZERBO/SABANÉ"), photo: "/images/patronage/zerbo.jpg" },
    },
    {
      role: tr("Co-parrainage", "Co-sponsored by"),
      lines: [
        tr("Camarade Ministre de l'Enseignement", "Comrade Minister of Secondary"),
        tr("secondaire, de la Formation", "Education, Vocational"),
        tr("professionnelle et technique (MESFPT)", "and Technical Training (MESFPT)"),
      ],
      abbr: "MESFPT",
      emblem,
      minister: { name: tr("Pr Moumouni ZOUNGRANA", "Prof. Moumouni ZOUNGRANA"), photo: "/images/patronage/zoungrana.jpg" },
    },
  ] satisfies PatronageItem[],
};

/* ---------- Résumé, village d'exposition, Challenge Jeunesse (programme provisoire du comité, novembre 2026) ---------- */

export const summary = [
  tr(
    "Co-organisée par le think tank InnovateBF, l'Université Nazi Boni (UNB), le centre de recherche CITADEL, les centres de formation professionnelle Burkina Suudu Bawdè (BSB), le Groupe Abamix, sankora.ai et leGuideIA.ai, la conférence de Bobo-Dioulasso est le rendez-vous stratégique dédié à la valorisation de l'innovation technologique et au développement endogène au Burkina Faso.",
    "Co-organized by the InnovateBF think tank, Nazi BONI University (UNB), the CITADEL research center, the Burkina Suudu Bawdè (BSB) vocational training centers, the Abamix Group, sankora.ai and leGuideIA.ai, the Bobo-Dioulasso conference is the strategic event dedicated to showcasing technological innovation and to endogenous development in Burkina Faso.",
  ),
  tr(
    "Pendant deux jours, l'écosystème de l'innovation se rassemble autour de sessions thématiques, de pitchs de projets étudiants et des cinq lauréats de la compétition « Top 5 Inventeurs », d'un village d'exposition permanent de prototypes fonctionnels et d'une cérémonie des Awards. En reliant la recherche académique, la formation technique et le secteur productif, la conférence pose les bases d'une souveraineté numérique et industrielle nationale, portée par des solutions conçues par et pour le Burkina Faso.",
    "For two days, the innovation ecosystem comes together for thematic sessions, pitches from student projects and the five “Top 5 Inventors” laureates, an all-day exhibition village of working prototypes and an awards ceremony. By connecting academic research, technical training and the productive sector, the conference lays the foundations for national digital and industrial sovereignty, driven by solutions designed by and for Burkina Faso.",
  ),
];

/**
 * Le Village de l'Innovation Technologique Endogène : stands et expositions, en continu les deux jours.
 * Un espace par catégorie de stands (mêmes icônes que la liste des stands).
 */
export const village = {
  title: tr("Le Village de l'Innovation Technologique Endogène", "The Indigenous Technological Innovation Village"),
  text: tr(
    "Stands et expositions ouverts en continu les 27 et 28 novembre, de 9 h à 18 h.",
    "Booths and exhibitions open throughout November 27 and 28, from 09:00 to 18:00.",
  ),
  // Horaires du village (le programme, lui, va de l'ouverture à la clôture)
  hours: { open: "09:00", close: "18:00" },
  spaces: [
    {
      icon: "spark",
      title: tr("Pavillon Recherche & Algorithmes", "Research & Algorithms Pavilion"),
      text: tr(
        "Travaux scientifiques et modèles de données souverains",
        "Scientific work and sovereign data models",
      ),
    },
    {
      icon: "graduation",
      title: tr("Carrefour des Jeunes Makers", "Young Makers Hub"),
      text: tr(
        "Démonstrations en direct des prototypes et solutions d'ingénierie appliquée conçus par les étudiants et les apprenants",
        "Live demonstrations of prototypes and applied engineering solutions designed by students and trainees",
      ),
    },
    {
      icon: "building",
      title: tr("Zone Démo Entreprises", "Business Demo Zone"),
      text: tr(
        "Solutions technologiques et expertises industrielles",
        "Technology solutions and industrial expertise",
      ),
    },
    {
      icon: "trophy",
      title: tr("Les Top 5", "The Top 5"),
      text: tr("Lauréats de la compétition «\u00a0Top 5 inventeurs\u00a0»", "Laureates of the “Top 5 Inventors” competition"),
    },
    {
      icon: "rocket",
      title: tr("Challenge Jeunesse", "Youth Challenge"),
      text: tr(
        "Le « Makathon Flash : Hack ton Quotidien » de 24\u00a0h avec la boîte mystère, l'Espace « IA Showroom & Coding Arcade » et le Grand Quiz de l'Inventeur Endogène",
        "The 24-hour “Flash Makathon: Hack Your Daily Life” with the mystery box, the “AI Showroom & Coding Arcade” space and the Great Indigenous Inventor Quiz",
      ),
    },
  ],
};

/** Challenge Jeunesse : espaces immersifs pour les élèves des lycées professionnels et les étudiants. */
export const youthZone = {
  title: tr("Challenge Jeunesse : toucher, jouer et créer", "Youth Challenge: touch, play and create"),
  text: tr(
    "Pour les élèves des lycées professionnels, les étudiants et les passionnés de tech : des espaces où l'on teste, construit et échange, loin des codes de la conférence académique. Les gagnants des challenges sont récompensés lors de la cérémonie de clôture.",
    "For vocational high school students, university students and tech enthusiasts: spaces to test, build and share, far from the conventions of an academic conference. Challenge winners receive their prizes at the closing ceremony.",
  ),
  activities: [
    {
      icon: "settings",
      title: tr("Makathon Flash : Hack ton Quotidien", "Flash Makathon: Hack Your Daily Life"),
      text: tr(
        "En équipes de 3 à 4, 24 heures pour assembler, à partir d'une « boîte mystère » de composants, un prototype qui résout un problème du quotidien au Burkina. Présentation en « Pitch Chrono » de 2 minutes.",
        "In teams of 3 to 4, participants have 24 hours to build a prototype that solves an everyday problem in Burkina, using a “mystery box” of components. Each team then presents it in a 2-minute “Chrono Pitch.”",
      ),
    },
    {
      icon: "spark",
      title: tr("IA Showroom & Coding Arcade", "AI Showroom & Coding Arcade"),
      text: tr(
        "Défier l'IA en langues locales avec sankora.ai et leGuideIA.ai, apprendre à formuler des requêtes, piloter des voitures robots sur un parcours et découvrir la vision par ordinateur.",
        "Challenge AI in local languages with sankora.ai and leGuideIA.ai, learn how to write prompts, steer robot cars around a course and discover computer vision.",
      ),
    },
    {
      icon: "trophy",
      title: tr("Le Grand Quiz de l'Inventeur Endogène", "The Great Indigenous Inventor Quiz"),
      text: tr(
        "Un grand jeu-concours en direct dans l'amphithéâtre, sur smartphone : culture tech, histoire des sciences en Afrique et projets exposés.",
        "A live quiz contest in the lecture hall, played on smartphones: tech culture, the history of science in Africa and the projects on display.",
      ),
    },
  ],
};

/* ---------- Affiche « Échangeons, Bâtissons, Contribuons » ---------- */

export type Poster = { sloganLines: Tr[]; image: Img };

export const poster: Poster = {
  sloganLines: [tr("Échangeons,", "Exchange,"), tr("Bâtissons,", "Build,"), tr("Contribuons.", "Contribute.")],
  image: { src: "/images/ingenieure-laboratoire.jpg", alt: "" },
};

/* ---------- Bloc « Appel à projets » (pages Conférence et Expositions) ---------- */

export type CallBlock = {
  label: Tr;
  title: Tr;
  text: Tr;
  participation: Tr;
  image: Img;
  boxWords: Tr[];
  boxText: Tr[];
};

export const callBlock: CallBlock = {
  label: tr("Appel à projets", "Call for projects"),
  title: tr("Candidature Projets EBC'26", "EBC'26 project application"),
  text: tr(
    "L'appel à projets vise à valoriser des solutions technologiques innovantes et endogènes répondant aux défis du Burkina Faso.",
    "The call for projects aims to showcase innovative, indigenous technological solutions that address Burkina Faso's challenges.",
  ),
  participation: tr("gratuite", "free of charge"),
  image: { src: "/images/prototype-electronique.jpg", alt: tr("Prototype électronique", "Electronic prototype") },
  boxWords: [tr("Innover", "Innovate"), tr("Produire", "Produce"), tr("Transformer", "Transform")],
  boxText: [tr("Des solutions", "Solutions"), tr("pour un Burkina Faso", "for a more resilient"), tr("plus résilient", "Burkina Faso")],
};


/* ---------- Objectifs, axes, public (TDR) ---------- */

export const objectives = [
  tr("Valoriser les compétences nationales en ingénierie, recherche et innovation", "Showcase national skills in engineering, research and innovation"),
  tr("Promouvoir des solutions adaptées aux réalités du pays", "Promote solutions tailored to the country's realities"),
  tr("Relier recherche, formation, innovation et secteur productif", "Connect research, training, innovation and the productive sector"),
  tr("Encourager l'entrepreneuriat technologique", "Encourage technology entrepreneurship"),
  tr(
    "Favoriser les partenariats entre porteurs de solutions, institutions et investisseurs",
    "Foster partnerships between solution developers, institutions and investors",
  ),
];

export const themes = [
  tr("Innovation et développement endogène", "Innovation and endogenous development"),
  tr("Systèmes embarqués", "Embedded systems"),
  tr("IA, données et souveraineté numérique", "AI, data and digital sovereignty"),
  tr("Recherche et prototypage", "Research and prototyping"),
  tr("Entrepreneuriat, incubation, financement", "Entrepreneurship, incubation and financing"),
  tr("Ingénierie des secteurs prioritaires", "Engineering for priority sectors"),
];

export const prioritySectors = tr(
  "Agriculture, santé, éducation, énergie, administration publique, sécurité et industrie.",
  "Agriculture, health, education, energy, public administration, security and industry.",
);

export const audience = tr(
  "Enseignants-chercheurs, étudiants et doctorants, start-up, ingénieurs et techniciens, ministères et institutions publiques, partenaires techniques et financiers, entreprises privées, diaspora, incubateurs et organisations professionnelles.",
  "Academics, students and PhD candidates, startups, engineers and technicians, ministries and public institutions, technical and financial partners, private companies, the diaspora, incubators and professional organizations.",
);

/* ---------- Appel à contributions (ebc26.vercel.app) ---------- */

export const callContent = {
  intro: tr(
    "Concours de distinction des meilleures innovations technologiques au service du développement endogène du Burkina Faso. Les meilleurs projets sont présentés pendant la conférence et distingués par des Awards.",
    "A competition recognizing the best technological innovations serving the endogenous development of Burkina Faso. The top projects are showcased during the conference and honored with awards.",
  ),
  domains: [
    tr("Agriculture", "Agriculture"),
    tr("Éducation", "Education"),
    tr("Énergie", "Energy"),
    tr("Environnement", "Environment"),
    tr("Industrie", "Industry"),
    tr("Numérique", "Digital"),
    tr("Santé", "Health"),
  ],
  categories: [
    tr("Intelligence artificielle", "Artificial intelligence"),
    tr("Internet des objets (IoT)", "Internet of Things (IoT)"),
    tr("Big Data", "Big Data"),
    tr("Systèmes embarqués et robotique", "Embedded systems and robotics"),
    tr("Développement endogène", "Endogenous development"),
    tr("Jeune innovateur", "Young innovator"),
    tr("Startup innovante", "Innovative startup"),
    tr("Projet académique", "Academic project"),
  ],
  criteria: [
    tr("Innovation", "Innovation"),
    tr("Faisabilité", "Feasibility"),
    tr("Impact sociétal", "Societal impact"),
    tr("Impact économique", "Economic impact"),
    tr("Maturité technologique", "Technological maturity"),
    tr("Qualité de présentation", "Presentation quality"),
  ],
  criteriaNote: tr(
    "Les critères sont pondérés selon une méthodologie interne ; ils ne sont pas d'égale importance.",
    "Criteria are weighted according to an internal methodology; they are not of equal importance.",
  ),
  eligible: [
    tr("Enseignants, formateurs ou chercheurs", "Teachers, trainers or researchers"),
    tr("Étudiants ou apprenants", "Students or trainees"),
    tr("Porteurs de startup ou de PME technologique", "Founders of tech startups or SMEs"),
    tr("Professionnels ou industriels", "Professionals or industry players"),
    tr("Structures ou clubs académiques", "Academic institutions or clubs"),
  ],
  steps: [
    { title: tr("Porteur", "Applicant"), text: tr("Identité, structure, statut et équipe éventuelle.", "Identity, organization, status and team, if any.") },
    {
      title: tr("Projet", "Project"),
      text: tr("Titre, domaine, catégorie, résumé et problème endogène adressé.", "Title, domain, category, summary and the endogenous problem addressed."),
    },
    {
      title: tr("Technique", "Technical"),
      text: tr("Description, caractère innovant, niveau de maturité (TRL) et faisabilité.", "Description, innovativeness, maturity level (TRL) and feasibility."),
    },
    {
      title: tr("Impact", "Impact"),
      text: tr(
        "Impacts sociétal, économique, environnemental et contribution au développement endogène.",
        "Societal, economic and environmental impact, and contribution to endogenous development.",
      ),
    },
    {
      title: tr("Pièces jointes", "Attachments"),
      text: tr("Un démonstrateur obligatoire, plus visuels et références.", "A required demonstrator, plus visuals and references."),
    },
    {
      title: tr("Déclarations", "Declarations"),
      text: tr("Originalité, absence de conflit d'intérêts, consentements.", "Originality, no conflict of interest, consent."),
    },
    {
      title: tr("Présentation", "Presentation"),
      text: tr("Mode prévu (sur place ou à distance) et besoins logistiques.", "Planned format (on site or remote) and logistics needs."),
    },
  ],
  files: tr(
    "Formats acceptés : PDF, PNG, JPG, MP4, ZIP. 25 Mo par fichier, 60 Mo au total. Pour les contenus volumineux, un lien externe est accepté.",
    "Accepted formats: PDF, PNG, JPG, MP4, ZIP. 25 MB per file, 60 MB in total. For large files, an external link is accepted.",
  ),
};

/* ---------- Highlights : infographie fournie par Hermann Bayala (23 octobre) ---------- */

// Noms de projets : identiques dans les deux langues
export const highlightResults = [
  {
    title: tr("Top-Inventeurs technologiques du Burkina", "Burkina's top technology inventors"),
    subtitle: tr("Résultats de la compétition", "Competition results"),
    items: ["Guundi Mobile Security", "Wefafa", "KÏSSY", "SujetsBF", "Visit Faso"],
  },
  {
    title: tr("Invités spéciaux", "Special guests"),
    subtitle: tr("Technologies conçues au Burkina Faso", "Technologies designed in Burkina Faso"),
    items: [tr("Tracteurs agricoles", "Farm tractors")],
  },
  {
    title: tr("Projets étudiants inter-structures", "Cross-institution student projects"),
    subtitle: tr("Équipes communes UNB et BSB", "Joint UNB and BSB teams"),
    items: [tr("Robotique et drones", "Robotics and drones"), tr("Agriculture et énergie", "Agriculture and energy"), tr("Systèmes embarqués", "Embedded systems")],
  },
  {
    title: tr("Projets CITADEL, BSB et UNB", "CITADEL, BSB and UNB projects"),
    subtitle: tr("Résultats des trois structures", "Results from all three institutions"),
    items: [
      tr("CITADEL : langues locales, médias, musique, radiologie", "CITADEL: local languages, media, music, radiology"),
      tr("BSB : résultats de ses projets", "BSB: project results"),
      tr("UNB : résultats de ses projets", "UNB: project results"),
    ],
  },
];

export const highlightMoments = [
  {
    title: tr("Sessions thématiques", "Thematic sessions"),
    items: [
      tr("Du labo au marché : recherche, prototypage et secteurs productifs", "From lab to market: research, prototyping and productive sectors"),
      tr("Souveraineté numérique, IA et systèmes embarqués", "Digital sovereignty, AI and embedded systems"),
      tr("Secteurs prioritaires, financement et incubation", "Priority sectors, financing and incubation"),
    ],
  },
  {
    title: tr("Think tank InnovateBF", "InnovateBF think tank"),
    items: [
      tr("Plateforme InnovonsEnsembleLeFaso", "InnovonsEnsembleLeFaso platform"),
      tr("Observatoire et veille technologique", "Observatory and technology watch"),
      tr("Allocution de bienvenue et session « Du Labo au Marché »", "Welcome address and “From Lab to Market” session"),
    ],
  },
  {
    title: tr("Awards et récompenses", "Awards and prizes"),
    items: [
      tr("Prix officiels dans dix catégories", "Official prizes in ten categories"),
      tr("Inventeurs et projets étudiants", "Inventors and student projects"),
      tr("Lauréats des challenges jeunesse", "Youth challenge winners"),
    ],
  },
];
