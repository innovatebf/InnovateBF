/**
 * Contenus fixes du think tank : identité du site, vision, mission,
 * domaines d'action, pages À propos et Analyse.
 * Les coordonnées (e-mail, siège, réseaux sociaux) se gèrent dans le back-office.
 */

import { tr, type Tr } from "@/i18n";

export const siteIdentity = {
  name: "InnovateBF",
  tagline: tr(
    "Think tank pour la promotion de la technologie endogène au Burkina Faso",
    "A think tank dedicated to promoting indigenous technology in Burkina Faso",
  ),
  description: tr(
    "Think tank pour la promotion de la technologie endogène au Burkina Faso. Organisateur de la conférence EBC2026 à Bobo-Dioulasso.",
    "A think tank dedicated to promoting indigenous technology in Burkina Faso. Organizer of the EBC2026 conference in Bobo-Dioulasso.",
  ),
};

export const thinkTank = {
  logo: { src: "/logos/innovatebf.png", alt: tr("Logo InnovateBF", "InnovateBF logo") },
  vision: tr(
    "Un Burkina Faso où la technologie et l'innovation, enracinées dans nos valeurs socio-culturelles, sont les moteurs d'un développement durable.",
    "A Burkina Faso where technology and innovation, rooted in our sociocultural values, drive sustainable development.",
  ),
  visionCaption: tr("Vision d'InnovateBF", "InnovateBF's vision"),
  presentation: tr(
    "Association apolitique et sans but lucratif, InnovateBF fédère l'expertise nationale et la diaspora pour promouvoir l'innovation technologique au Burkina Faso.",
    "A nonpartisan, nonprofit association, InnovateBF brings together national expertise and the diaspora to promote technological innovation in Burkina Faso.",
  ),
  mission: tr(
    "Faire progresser l'innovation technologique endogène par la recherche, le conseil, la collaboration et l'éducation.",
    "To advance indigenous technological innovation through research, consulting, collaboration and education.",
  ),
};

/** Domaines d'action : sans lien, la carte affiche « Détails à venir ». */
export const domains: { title: Tr; text: Tr; href: string }[] = [
  {
    title: tr("Analyse, Concept et Conseil", "Analysis, Concept and Consulting"),
    text: tr("Services d'analyse et de conseil pour les acteurs de l'innovation au Burkina Faso.", "Analysis and consulting services for innovation stakeholders in Burkina Faso."),
    href: "/domains/analysis",
  },
  {
    title: tr("Conférence EBC", "EBC Conference"),
    text: tr(
      "Le rendez-vous annuel de l'innovation endogène à Bobo-Dioulasso : sessions, stands et prix.",
      "The annual gathering for indigenous innovation in Bobo-Dioulasso: sessions, exhibition booths and awards.",
    ),
    href: "/innovons/conference",
  },
  {
    title: tr("Plateforme InnovonsEnsembleLeFaso", "InnovonsEnsembleLeFaso Platform"),
    text: tr("Tableau de bord de l'écosystème et base de cas d'usage d'intérêt.", "Ecosystem dashboard and database of relevant use cases."),
    href: "",
  },
  {
    title: tr("Observatoire", "Observatory"),
    text: tr("Suivi des tendances technologiques et analyse de l'écosystème de l'innovation.", "Tracking technology trends and analyzing the innovation ecosystem."),
    href: "",
  },
];

export const levers = [
  {
    title: tr("Recherche", "Research"),
    text: tr("Comprendre l'écosystème technologique burkinabè et ses besoins non couverts.", "Understanding the Burkinabè technology ecosystem and its unmet needs."),
  },
  {
    title: tr("Conseil", "Consulting"),
    text: tr("Accompagner les décideurs publics et privés vers des solutions endogènes.", "Guiding public and private decision-makers toward indigenous solutions."),
  },
  {
    title: tr("Collaboration", "Collaboration"),
    text: tr("Relier chercheurs, entrepreneurs, institutions et diaspora.", "Connecting researchers, entrepreneurs, institutions and the diaspora."),
  },
  {
    title: tr("Éducation", "Education"),
    text: tr("Former aux technologies clés : IA, systèmes embarqués, IoT, données.", "Training in key technologies: AI, embedded systems, IoT, data."),
  },
];

export const expertise = [
  tr("Intelligence artificielle", "Artificial intelligence"),
  tr("Big Data", "Big Data"),
  tr("Systèmes embarqués", "Embedded systems"),
  tr("IoT", "IoT"),
  tr("Business intelligence", "Business intelligence"),
  tr("Cybersécurité", "Cybersecurity"),
];

export const analysis = {
  challenge: tr(
    "Un responsable informe ses directeurs qu'il veut budgétiser 10 projets supplémentaires dont les résultats seront rapportés au prochain conseil trimestriel, en priorisant les solutions endogènes.",
    "An executive informs their directors of plans to budget for 10 additional projects, prioritizing indigenous solutions, with results to be reported at the next quarterly board meeting.",
  ),
  obstacle: tr(
    "Le principal obstacle est le temps perdu à rassembler les acteurs, à les aligner et à décider : des mois, parfois des années. InnovateBF vise à identifier les projets candidats et à lancer le tri en moins de 24 heures grâce à une intelligence collective structurée.",
    "The main obstacle is the time lost bringing stakeholders together, aligning them and reaching decisions: months, sometimes years. InnovateBF aims to identify candidate projects and start screening them in under 24 hours through structured collective intelligence.",
  ),
  blockers: [
    {
      title: tr("Fragmentation", "Fragmentation"),
      text: tr(
        "Initiatives isolées et faible coordination entre recherche, formation et secteur privé.",
        "Isolated initiatives and weak coordination between research, training and the private sector.",
      ),
    },
    {
      title: tr("Compétences", "Skills"),
      text: tr(
        "Déficit marqué en IA, systèmes embarqués et IoT, avec seulement 5 % de diplômées STEM féminines.",
        "A marked skills gap in AI, embedded systems and IoT, with women accounting for only 5% of STEM graduates.",
      ),
    },
    {
      title: tr("Infrastructure", "Infrastructure"),
      text: tr(
        "Faible pénétration d'internet en milieu rural (27 % au niveau national) et concentration urbaine des services numériques.",
        "Low internet penetration in rural areas (27% nationwide) and digital services concentrated in cities.",
      ),
    },
  ],
  method: [
    {
      title: tr("Analyser", "Analyze"),
      text: tr(
        "Diagnostic de l'écosystème, cartographie des acteurs, identification des besoins sociétaux non couverts et évaluation de la maturité des initiatives.",
        "Ecosystem assessment, stakeholder mapping, identification of unmet societal needs and evaluation of initiative maturity.",
      ),
    },
    {
      title: tr("Conceptualiser", "Conceptualize"),
      text: tr(
        "Co-construction de solutions alignées sur les valeurs socioculturelles burkinabè, priorisées selon leur impact sociétal et leur faisabilité.",
        "Co-creation of solutions aligned with Burkinabè sociocultural values, prioritized by societal impact and feasibility.",
      ),
    },
    {
      title: tr("Conseiller", "Advise"),
      text: tr(
        "Livrables concrets (note de positionnement, feuille de route technique, brief décisionnel) remis aux acteurs publics, privés et académiques.",
        "Concrete deliverables (position paper, technical roadmap, decision brief) provided to public, private and academic stakeholders.",
      ),
    },
  ],
};
