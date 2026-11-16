/**
 * Contenus fixes de l'accueil (textes des sections, piliers, programmes).
 * Les actualités (« À la une », « Ressources »), les partenaires et les dates
 * se gèrent dans le back-office ; les chiffres clés sont calculés.
 */

import { tr, type Tr } from "@/i18n";

// Texte alternatif bilingue, vide pour une image décorative
type Img = { src: string; alt: Tr | "" };
export type Accent = "green" | "blue" | "orange";

export const intro = {
  badge: tr("Le think tank de l'innovation endogène au Burkina Faso", "The think tank for indigenous innovation in Burkina Faso"),
  // En anglais, l'ordre des mots change : « A more innovative, more inclusive, more prosperous Burkina Faso. »
  title: [
    tr("Un Burkina Faso", "A more innovative,"),
    tr("plus innovant,", "more inclusive,"),
    tr("plus inclusif,", "more prosperous"),
    tr("plus prospère.", "Burkina Faso."),
  ] as const,
  paragraph: tr(
    "InnovateBF réunit chercheurs, inventeurs, entrepreneurs et décideurs pour faire de la technologie endogène un levier de développement durable.",
    "InnovateBF brings together researchers, inventors, entrepreneurs and decision-makers to make indigenous technology a driver of sustainable development.",
  ),
  primary: { label: tr("Découvrir nos programmes", "Explore our programs"), href: "#programmes" },
  secondary: { label: tr("À propos de nous", "About us"), href: "/about" },
  image: {
    src: "/images/hero-innovatebf.jpg",
    alt: tr(
      "Jeune innovatrice burkinabè, tablette en main, devant le monument de Bobo-Dioulasso",
      "Young Burkinabè woman innovator holding a tablet in front of the Bobo-Dioulasso monument",
    ),
  } satisfies Img,
  script: [tr("Des idées", "Ideas"), tr("d'aujourd'hui", "of today"), tr("pour le Burkina", "for the Burkina"), tr("de demain", "of tomorrow")],
};

/**
 * Une de la période de la conférence : EBC2026 mis en avant jusqu'au dernier
 * jour de l'événement, puis retour automatique à la une habituelle (ci-dessus).
 */
export const eventIntro = {
  title: [tr("Échangeons,", "Exchange,"), tr("Bâtissons,", "Build,"), tr("Contribuons.", "Contribute.")] as const,
  paragraph: tr(
    "Le rendez-vous stratégique dédié à la valorisation de l'innovation technologique et du développement technologique burkinabè : sessions thématiques, pitchs des projets étudiants et des Top 5 Inventeurs, village d'exposition de prototypes et cérémonie des Awards.",
    "The strategic gathering dedicated to showcasing Burkinabè technological innovation and development: thematic sessions, pitches from student projects and the Top 5 Inventors, a prototype exhibition village and the awards ceremony.",
  ),
  primary: { label: tr("Découvrir le programme", "Explore the program"), href: "/innovons/conference/programme" },
  secondary: { label: tr("La conférence", "The conference"), href: "/innovons/conference" },
};

// Photos Pexels (licence libre, usage commercial autorisé) : RF._.studio, Ninthgrid (Lagos),
// Alex Levis (Tanzanie), Zeal Creative Studios (Accra). Recadrées en 4:3 dans public/images/piliers.
export const pillars: { icon: string; title: Tr; text: Tr; image: { src: string; alt: Tr } }[] = [
  {
    icon: "search",
    title: tr("Éclairer par la recherche", "Informing through research"),
    text: tr("Comprendre l'écosystème technologique burkinabè et ses besoins non couverts.", "Understanding the Burkinabè technology ecosystem and its unmet needs."),
    image: {
      src: "/images/piliers/recherche.jpg",
      alt: tr("Jeune chercheuse observant un échantillon au microscope", "Young woman researcher examining a sample under a microscope"),
    },
  },
  {
    icon: "compass",
    title: tr("Conseiller les décideurs", "Advising decision-makers"),
    text: tr("Accompagner les acteurs publics et privés vers des solutions endogènes.", "Guiding public and private stakeholders toward indigenous solutions."),
    image: {
      src: "/images/piliers/conseil.jpg",
      alt: tr("Réunion de travail autour d'une table entre responsables et experts", "Officials and experts in a meeting around a table"),
    },
  },
  {
    icon: "network",
    title: tr("Connecter l'écosystème", "Connecting the ecosystem"),
    text: tr("Relier chercheurs, entrepreneurs, institutions et diaspora.", "Linking researchers, entrepreneurs, institutions and the diaspora."),
    image: {
      src: "/images/piliers/ecosysteme.jpg",
      alt: tr("Vue aérienne d'un groupe réuni en cercle, mains jointes au centre", "Aerial view of a group standing in a circle, hands joined in the center"),
    },
  },
  {
    icon: "graduation",
    title: tr("Former aux technologies", "Training in technology"),
    text: tr("IA, systèmes embarqués, IoT et données : les compétences de demain.", "AI, embedded systems, IoT and data: the skills of tomorrow."),
    image: {
      src: "/images/piliers/formation.jpg",
      alt: tr("Étudiants en atelier de programmation devant leurs ordinateurs", "Students at a coding workshop in front of their computers"),
    },
  },
];

export const featured = {
  label: tr("À la une", "Featured"),
  title: tr("L'innovation au service d'un Burkina Faso résilient", "Innovation for a resilient Burkina Faso"),
  text: tr(
    "Découvrez nos initiatives, nos événements et les opportunités pour faire grandir l'écosystème technologique burkinabè.",
    "Discover our initiatives, events and opportunities to grow the Burkinabè technology ecosystem.",
  ),
  button: { label: tr("Découvrir la conférence", "Explore the conference"), href: "/innovons/conference" },
};

export const eventBlock = {
  label: tr("Conférence EBC2026", "EBC2026 Conference"),
  title: tr("Deux jours pour échanger, bâtir et contribuer", "Two days to exchange, build and contribute"),
  text: tr(
    "Sessions, pitchs, expositions et remise des prix : la deuxième édition réunit l'écosystème de l'innovation endogène à Bobo-Dioulasso.",
    "Sessions, pitches, exhibitions and an awards ceremony: the second edition brings together the indigenous innovation ecosystem in Bobo-Dioulasso.",
  ),
};

export const statsBlock = {
  label: tr("Chiffres clés", "Key figures"),
  title: tr("Une deuxième édition ambitieuse", "An ambitious second edition"),
  text: tr(
    "Grâce à ses organisateurs et partenaires, EBC2026 met en lumière les solutions technologiques conçues au Burkina Faso.",
    "Thanks to its organizers and partners, EBC2026 showcases technology solutions designed in Burkina Faso.",
  ),
};

export const programsBlock = {
  label: tr("Nos programmes", "Our programs"),
  title: tr("Des initiatives pour révéler et accompagner les talents", "Initiatives to uncover and support talent"),
  more: { label: tr("Tous nos domaines d'action", "All our action areas"), href: "/domains" },
};

export const programs: { icon: string; accent: Accent; title: Tr; text: Tr; image: Img; href: string }[] = [
  {
    icon: "rocket",
    accent: "green",
    title: tr("Concours d'innovation", "Innovation competition"),
    text: tr(
      "Un appel à projets pour révéler les solutions technologiques endogènes et les distinguer lors de la remise des prix.",
      "A call for projects to uncover indigenous technology solutions and recognize them at the awards ceremony.",
    ),
    image: { src: "/images/prototype-electronique.jpg", alt: tr("Prototype électronique", "Electronic prototype") },
    href: "/innovons/conference/appel-a-contributions",
  },
  {
    icon: "graduation",
    accent: "blue",
    title: tr("Conférence et sessions thématiques", "Conference and thematic sessions"),
    text: tr(
      "Des sessions thématiques et des pitchs qui réunissent chercheurs, praticiens, entrepreneurs et décideurs.",
      "Thematic sessions and pitches bringing together researchers, practitioners, entrepreneurs and decision-makers.",
    ),
    image: { src: "/images/orateur.jpg", alt: tr("Intervenant en conférence", "Speaker at a conference") },
    href: "/innovons/conference/programme",
  },
  {
    icon: "network",
    accent: "orange",
    title: tr("Expositions et mise en réseau", "Exhibitions and networking"),
    text: tr(
      "Des stands, des démonstrations et un cocktail de réseautage pour connecter inventeurs, entreprises et institutions.",
      "Booths, live demos and a networking reception to connect inventors, businesses and institutions.",
    ),
    image: { src: "/images/ingenieure-laboratoire.jpg", alt: tr("Ingénieure en laboratoire", "Woman engineer in a laboratory") },
    href: "/innovons/conference/expositions",
  },
];

export const ecosystem = {
  label: tr("Un écosystème dynamique", "A dynamic ecosystem"),
  title: tr("Ensemble pour un Burkina Faso plus innovant", "Together for a more innovative Burkina Faso"),
  text: tr(
    "Nous collaborons avec des institutions, des universités, des entreprises et des médias pour renforcer l'écosystème de l'innovation.",
    "We work with institutions, universities, businesses and media outlets to strengthen the innovation ecosystem.",
  ),
};

export const resourcesBlock = {
  label: tr("Ressources", "Resources"),
  title: tr("Actualités, opportunités et connaissances", "News, opportunities and knowledge"),
  more: { label: tr("Toute l'actualité EBC2026", "All EBC2026 news"), href: "/innovons/conference" },
};

export const cta = {
  title: tr("Rejoignez le mouvement", "Join the movement"),
  text: tr(
    "Participez à la transformation technologique du Burkina Faso. Ensemble, faisons de l'innovation endogène un levier de développement durable.",
    "Take part in Burkina Faso's technological transformation. Together, let's make indigenous innovation a driver of sustainable development.",
  ),
  button: { label: tr("Nous contacter", "Contact us"), href: "/contact" },
  image: { src: "/images/hero-bobo-dioulasso.jpg", alt: "" } satisfies Img,
};
