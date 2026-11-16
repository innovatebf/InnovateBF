import { tr, type Tr } from "@/i18n";
import type { CollectionData } from "@/lib/content/definitions";

/**
 * Programme de référence d'EBC2026 (validé par l'organisation le 30 octobre 2026) :
 * créneaux, intervenants, fiches Top 5 et stands du Village de l'Innovation.
 * Le français reprend le texte de la référence mot pour mot ; l'anglais en est la traduction.
 * Amorce les bases neuves (src/server/content/seed-data.ts) ; une base existante s'y aligne
 * avec scripts/sync-ebc2026-programme.ts.
 */

type Text = string | Tr;
const fr = (t: Text) => (typeof t === "string" ? t : t.fr);
const en = (t: Text) => (typeof t === "string" ? "" : t.en);

/* ---------- Sessions : l'intitulé français rattache les intervenants aux créneaux ---------- */

export const OPENING = tr("Cérémonie d'Ouverture Officielle", "Official Opening Ceremony");
export const VILLAGE_TOUR = tr(
  "Visite du Village de l'Innovation Technologique Endogène (Stands & Expositions)",
  "Tour of the Indigenous Technological Innovation Village (Booths & Exhibitions)",
);
export const SKILLS = tr("L'ingénierie des compétences", "Skills Engineering");
export const LAB_TO_MARKET = tr(
  "Du Labo au Marché – Relier Recherche, Prototypage et Secteurs Productifs",
  "From Lab to Market – Connecting Research, Prototyping and Productive Sectors",
);
export const SOVEREIGNTY = tr(
  "Souveraineté numérique, Intelligence Artificielle et Systèmes Embarqués au Burkina",
  "Digital Sovereignty, Artificial Intelligence and Embedded Systems in Burkina",
);
export const PRIORITY_SECTORS = tr(
  "L'Ingénierie au service des Secteurs Prioritaires (Agriculture, Santé, Énergie)",
  "Engineering for Priority Sectors (Agriculture, Health, Energy)",
);
export const FINANCING = tr(
  "Financement et Incubation de l'Entrepreneuriat Technologique Endogène",
  "Financing and Incubating Indigenous Technology Entrepreneurship",
);
export const AWARDS = tr("Cérémonie des Awards & Clôture Officielle", "Awards Ceremony & Official Closing");
const LUNCH = tr("Pause déjeuner", "Lunch break");
const COFFEE = tr("Pause café", "Coffee break");
const QA = tr("Q&A et discussions", "Q&A and discussion");

/* ---------- NOVARK (document de participation du 6 novembre 2026) : deux interventions à distance ---------- */

const NOVARK_PROFILE = tr(
  "Entreprise technologique de Ouagadougou : IA et vision par ordinateur, robotique et systèmes embarqués, ingénierie logicielle, architecture et BIM",
  "Ouagadougou-based technology company: AI and computer vision, robotics and embedded systems, software engineering, architecture and BIM",
);
const NOVARK_TALKS = {
  // Session « Souveraineté numérique, IA et Systèmes Embarqués »
  embedded: {
    speakers: ["Justin Nabi", "Ousmane Maïga"],
    title: tr(
      "Intelligence artificielle et systèmes embarqués : applications à la robotique mobile et aux systèmes multi-agents",
      "Artificial Intelligence and Embedded Systems: Applications to Mobile Robotics and Multi-Agent Systems",
    ),
  },
  // Session « L'Ingénierie au service des Secteurs Prioritaires »
  bim: {
    speakers: ["Moussa Maïga"],
    title: tr("L'intelligence artificielle dans l'architecture et le BIM", "Artificial Intelligence in Architecture and BIM"),
  },
};
const novarkPoint = (talk: (typeof NOVARK_TALKS)[keyof typeof NOVARK_TALKS]) =>
  tr(
    `${talk.speakers.join(" et ")} (NOVARK), en visioconférence – « ${talk.title.fr} »`,
    `${talk.speakers.join(" and ")} (NOVARK), by videoconference – “${talk.title.en}”`,
  );
const novarkRole = (talk: (typeof NOVARK_TALKS)[keyof typeof NOVARK_TALKS]) =>
  tr(`En visioconférence – « ${talk.title.fr} »`, `By videoconference – “${talk.title.en}”`);

/* ---------- Projets et porteurs : repris dans le programme et dans les stands ---------- */

const STUDENT_PROJECTS = [
  tr("Arroseur automatique intelligent", "Smart automatic sprinkler"),
  tr("Bras robotique multifonction", "Multipurpose robotic arm"),
  tr("Drone de Surveillance", "Surveillance drone"),
  tr("Drone muni de détecteur de métaux", "Drone with a metal detector"),
  tr("Feu tricolore intelligent", "Smart traffic light"),
  tr("Nettoyeur de panneaux solaires", "Solar panel cleaner"),
  tr("Système embarqué agricole intelligent", "Smart agricultural embedded system"),
  tr("Tapis Roulant Industriel Trieur", "Industrial sorting conveyor"),
  tr("Système Antivol Intelligent", "Smart anti-theft system"),
];

const CITADEL_PROJECTS = [
  { project: tr("Traduction automatique français–mooré (modèles de langage)", "French–Mooré machine translation (language models)"), owner: "COMPAORE Walker Stanislas Rocksane" },
  { project: tr("Chaîne de traduction vocale français–mooré", "French–Mooré speech translation pipeline"), owner: "OUEDRAOGO Soutongnoma Alex Fayçal" },
  {
    project: tr("Traitement automatique des relevés de programmes radio et TV au format BBDA", "Automated processing of radio and TV program logs in the BBDA format"),
    owner: "KABRE Hamidou",
  },
  { project: tr("Identification des instruments dans un morceau", "Identifying the instruments in a piece of music"), owner: "DAYAMA Jean Louis" },
  { project: tr("BurkinaRadVL-JEPA : aide à la radiologie", "BurkinaRadVL-JEPA: AI-assisted radiology"), owner: "Angéla Maria J W 2e Jum" },
];

/** Top Inventeurs : `label` est le début de la ligne de la référence (structure et projet). */
const TOP_INVENTORS = [
  {
    project: "Guundi Mobile Security",
    label: "Olorum / E-DEFENCE – Guundi Mobile Security",
    owner: "ZOMBRE Nabiga Yannel Donald",
    org: "Olorum / E-DEFENCE",
    line: tr("protection mobile contre l'arnaque et le phishing, traitement local", "mobile protection against scams and phishing, with local processing"),
  },
  {
    project: "Wefafa",
    label: "Wefafa",
    owner: "NAGALO Alexis",
    org: "Wefafa",
    line: tr("livraison, marketplace, live shopping et assistance", "delivery, marketplace, live shopping and support"),
  },
  {
    project: "KÏSSY",
    label: "KÏSSY",
    owner: "SANKARA Bienvenue Poussy Gabriel Wilfried Lambda",
    org: "KÏSSY",
    line: tr("porte-clé connecté qui coupe l'alimentation en l'absence de l'occupant", "smart keychain that cuts off the power when the occupant is away"),
  },
  {
    project: "SujetsBF",
    label: "SujetsBF",
    owner: "YARO Abdoul Aziz",
    org: "SujetsBF",
    line: tr("sujets, corrigés et révisions du CEP, du BEPC et du BAC", "CEP, BEPC and BAC exam papers, answer keys and review materials"),
  },
  {
    project: "Visit Faso",
    label: "Visit Faso",
    owner: "SANOU Mohamed Bachir",
    org: "Visit Faso",
    line: tr("application de découverte du tourisme, de la culture et des services locaux", "an app for discovering tourism, culture and local services"),
  },
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const numbered = (items: Text[]) => items.map((t, i) => tr(`${i + 1}) ${fr(t)}`, `${i + 1}) ${en(t) || fr(t)}`));

/* ---------- Programme ---------- */

const slot = (
  day: "1" | "2",
  time: string,
  end: string,
  kind: string,
  title: Tr,
  o: { detail?: Tr; points?: Tr[]; highlight?: boolean } = {},
): CollectionData<"programme"> => ({
  day,
  highlight: o.highlight ?? false,
  time,
  end,
  kind,
  // Formats traduits automatiquement (kindLabel, src/i18n/labels.ts)
  kindEn: "",
  title: title.fr,
  titleEn: title.en,
  detail: o.detail?.fr ?? "",
  detailEn: o.detail?.en ?? "",
  points: (o.points ?? []).map((p) => p.fr),
  pointsEn: (o.points ?? []).map((p) => p.en),
  speaker: "",
  speakerEn: "",
});

export const referenceProgramme: CollectionData<"programme">[] = [
  slot("1", "08:30", "10:30", "Cérémonie", OPENING, {
    highlight: true,
    points: [
      tr(
        "Allocutions de bienvenue du Think Tank InnovateBF et de la Présidence de l'Université Nazi Boni.",
        "Welcome addresses by the InnovateBF Think Tank and the Office of the President of Nazi BONI University.",
      ),
      tr(
        "Discours d'ouverture sous la présidence des camarades ministres du MESRI, du MTDPCE et du MESFPT.",
        "Opening speeches under the chairmanship of the Comrade Ministers of MESRI, MTDPCE and MESFPT.",
      ),
    ],
  }),
  slot("1", "10:30", "12:00", "Exposition", VILLAGE_TOUR),
  slot("1", "12:00", "13:00", "Pause", LUNCH),
  slot("1", "13:00", "15:00", "Session", SKILLS, {
    highlight: true,
    detail: tr("Former la jeunesse burkinabè aux technologies de rupture (8 min/pitch)", "Training Burkinabè youth in breakthrough technologies (8 min/pitch)"),
    points: [
      tr("Pitchs des projets BSB + UNB :", "BSB + UNB project pitches:"),
      ...numbered(STUDENT_PROJECTS),
      tr("Pitch compétition Top Inventeurs :", "Top Inventors competition pitches:"),
      ...numbered(TOP_INVENTORS.map((i) => tr(`${i.label} : ${i.line.fr} – ${i.owner}`, `${i.label}: ${i.line.en} – ${i.owner}`))),
      tr("Autres projets étudiants et apprenants", "Other student and trainee projects"),
    ],
  }),
  slot("1", "15:00", "15:30", "Pause", COFFEE),
  slot("1", "15:30", "17:30", "Session", LAB_TO_MARKET, {
    detail: tr(
      "Quels mécanismes pour transformer les brevets, maquettes et prototypes universitaires en applications industrielles prêtes pour l'économie nationale ?",
      "What mechanisms can turn university patents, models and prototypes into industrial applications ready for the national economy?",
    ),
    points: [
      tr("Dre Sylvie Zongo (Directrice des Savoirs Endogènes à la DGRI / MESRI)", "Dr Sylvie Zongo (Director of Indigenous Knowledge at DGRI / MESRI)"),
      tr("Les représentants du CNRST / INERA (Valorisation de la recherche publique)", "CNRST / INERA representatives (Commercialization of public research)"),
      tr("La direction de l'Institut 2iE (Modèles d'ingénierie étudiante appliquée)", "2iE Institute management (Applied student engineering models)"),
      tr("InnovateBF", "InnovateBF"),
      QA,
    ],
  }),
  slot("2", "08:30", "10:30", "Session", SOVEREIGNTY, {
    detail: tr(
      "Comment développer une IA et des architectures matérielles résilientes face aux contraintes locales (faible connectivité, langues locales) ?",
      "How can we build AI and hardware architectures that are resilient to local constraints (low connectivity, local languages)?",
    ),
    points: [
      novarkPoint(NOVARK_TALKS.embedded),
      tr(
        "Chérif Kounta (Créateur de l'IA africaine FasoNova), pour illustrer l'appropriation technologique précoce",
        "Chérif Kounta (Creator of FasoNova, an African AI), illustrating early technological adoption",
      ),
      tr("Dr Bewindin Alfred Sawadogo (Chercheur en politiques d'IA), pour les questions de gouvernance", "Dr Bewindin Alfred Sawadogo (AI policy researcher), on governance issues"),
      tr("Citadel :", "Citadel:"),
      ...numbered(CITADEL_PROJECTS.map((p) => tr(`${p.project.fr} – ${p.owner}`, `${p.project.en} – ${p.owner}`))),
    ],
  }),
  slot("2", "10:30", "11:00", "Pause", COFFEE),
  slot("2", "11:00", "13:00", "Session", PRIORITY_SECTORS, {
    detail: tr(
      "Présentation concrète de technologies « Made in Burkina » au service de l'autosuffisance rurale, de la santé décentralisée et de la sécurité",
      "A hands-on look at “Made in Burkina” technologies serving rural self-sufficiency, decentralized healthcare and security",
    ),
    points: [
      tr("Les responsables de la Ferme pilote de Guiè (Ingénierie rurale et concept endogène du wégoubri)", "Guiè pilot farm managers (Rural engineering and the indigenous concept of wégoubri)"),
      tr("Les innovateurs du réseau Faso Andubè (Équipements et outils connectés locaux)", "Innovators from the Faso Andubè network (Local connected equipment and tools)"),
      tr("SOS Énergie Burkina (Technologies d'accès aux énergies propres)", "SOS Énergie Burkina (Clean energy access technologies)"),
      novarkPoint(NOVARK_TALKS.bim),
      QA,
    ],
  }),
  slot("2", "13:00", "14:00", "Pause", LUNCH),
  slot("2", "14:00", "16:00", "Session", FINANCING, {
    detail: tr(
      "Quels modèles de financement (fonds souverains, business angels, diaspora) et d'incubation pour les projets à fort contenu de R&D locale ?",
      "Which financing models (sovereign funds, business angels, the diaspora) and incubation approaches suit projects with strong local R&D content?",
    ),
    points: [
      tr("La direction de Dunia Labs (Startup Studio de co-création technologique)", "Dunia Labs management (Technology co-creation startup studio)"),
      tr("L'équipe de Startup Café Burkina (Cartographie des opportunités écosystémiques)", "The Startup Café Burkina team (Mapping ecosystem opportunities)"),
      tr(
        "Dr Karim Ganamé (Fondateur de StreamScan), en visioconférence, pour l'apport stratégique et financier de la diaspora technologique",
        "Dr Karim Ganamé (Founder of StreamScan), by videoconference, on the tech diaspora's strategic and financial contribution",
      ),
      tr("Burkina News", "Burkina News"),
      QA,
    ],
  }),
  slot("2", "16:00", "16:30", "Pause", COFFEE),
  slot("2", "16:30", "18:30", "Session", AWARDS, {
    highlight: true,
    points: [
      tr("Remise des prix officiels aux lauréats dans 10 catégories", "Official awards for the winners in 10 categories"),
      tr("Gagnants des challenges jeunesse", "Youth challenge winners"),
      tr("Mot de clôture des Autorités", "Closing remarks by the Authorities"),
      tr("Cocktail de réseautage", "Networking reception"),
    ],
  }),
];

/* ---------- Intervenants : la photo et le lien LinkedIn saisis au back-office sont conservés ---------- */

type SpeakerFields = Pick<CollectionData<"speakers">, "name" | "nameEn" | "org" | "orgEn" | "role" | "roleEn" | "track" | "topic" | "topicEn">;

const speaker = (name: Text, org: Text, role: Text, session: Tr): SpeakerFields => ({
  name: fr(name),
  nameEn: en(name),
  org: fr(org),
  orgEn: en(org),
  role: fr(role),
  roleEn: en(role),
  track: "intervention",
  topic: session.fr,
  topicEn: session.en,
});

export const referenceSpeakers: SpeakerFields[] = [
  // Jour 1 : du labo au marché
  speaker(tr("Dre Sylvie Zongo", "Dr Sylvie Zongo"), "DGRI / MESRI", tr("Directrice des Savoirs Endogènes", "Director of Indigenous Knowledge"), LAB_TO_MARKET),
  speaker(tr("Les représentants du CNRST / INERA", "CNRST / INERA representatives"), "CNRST / INERA", tr("Valorisation de la recherche publique", "Commercialization of public research"), LAB_TO_MARKET),
  speaker(tr("La direction de l'Institut 2iE", "2iE Institute management"), tr("Institut 2iE", "2iE Institute"), tr("Modèles d'ingénierie étudiante appliquée", "Applied student engineering models"), LAB_TO_MARKET),
  speaker("InnovateBF", "", "", LAB_TO_MARKET),
  // Jour 2 : souveraineté numérique
  ...NOVARK_TALKS.embedded.speakers.map((name) => speaker(name, "NOVARK", novarkRole(NOVARK_TALKS.embedded), SOVEREIGNTY)),
  speaker(
    "Chérif Kounta",
    "FasoNova",
    tr("Créateur de l'IA africaine FasoNova, pour illustrer l'appropriation technologique précoce", "Creator of FasoNova, an African AI, illustrating early technological adoption"),
    SOVEREIGNTY,
  ),
  speaker("Dr Bewindin Alfred Sawadogo", "", tr("Chercheur en politiques d'IA, pour les questions de gouvernance", "AI policy researcher, on governance issues"), SOVEREIGNTY),
  speaker("Citadel", "", "", SOVEREIGNTY),
  ...CITADEL_PROJECTS.map((p) => speaker(p.owner, "CITADEL", p.project, SOVEREIGNTY)),
  // Jour 2 : secteurs prioritaires
  speaker(
    tr("Les responsables de la Ferme pilote de Guiè", "Guiè pilot farm managers"),
    tr("Ferme pilote de Guiè", "Guiè pilot farm"),
    tr("Ingénierie rurale et concept endogène du wégoubri", "Rural engineering and the indigenous concept of wégoubri"),
    PRIORITY_SECTORS,
  ),
  speaker(tr("Les innovateurs du réseau Faso Andubè", "Innovators from the Faso Andubè network"), "Faso Andubè", tr("Équipements et outils connectés locaux", "Local connected equipment and tools"), PRIORITY_SECTORS),
  speaker("SOS Énergie Burkina", "SOS Énergie Burkina", tr("Technologies d'accès aux énergies propres", "Clean energy access technologies"), PRIORITY_SECTORS),
  ...NOVARK_TALKS.bim.speakers.map((name) => speaker(name, "NOVARK", novarkRole(NOVARK_TALKS.bim), PRIORITY_SECTORS)),
  // Jour 2 : financement et incubation
  speaker(tr("La direction de Dunia Labs", "Dunia Labs management"), "Dunia Labs", tr("Startup Studio de co-création technologique", "Technology co-creation startup studio"), FINANCING),
  speaker(tr("L'équipe de Startup Café Burkina", "The Startup Café Burkina team"), "Startup Café Burkina", tr("Cartographie des opportunités écosystémiques", "Mapping ecosystem opportunities"), FINANCING),
  speaker(
    "Dr Karim Ganamé",
    "StreamScan",
    tr(
      "Fondateur de StreamScan, en visioconférence, pour l'apport stratégique et financier de la diaspora technologique",
      "Founder of StreamScan, by videoconference, on the tech diaspora's strategic and financial contribution",
    ),
    FINANCING,
  ),
  speaker("Burkina News", "", "", FINANCING),
];

/* ---------- Fiches Top 5 : le domaine, la photo et le lien du projet saisis au back-office sont conservés ---------- */

export const referenceInventors = TOP_INVENTORS.map((i) => ({
  project: i.project,
  owner: i.owner,
  org: i.org,
  pitch: `${capitalize(i.line.fr)}.`,
  pitchEn: `${capitalize(i.line.en)}.`,
}));

/* ---------- Stands du Village, sauf « Organisateurs et partenaires » (hors référence) ---------- */

const stand = (category: CollectionData<"stands">["category"], name: Text, detail: Text = ""): CollectionData<"stands"> => ({
  name: fr(name),
  category,
  nameEn: en(name),
  detail: fr(detail),
  detailEn: en(detail),
});

export const referenceStands: CollectionData<"stands">[] = [
  ...CITADEL_PROJECTS.map((p) => stand("citadel", p.project, p.owner)),
  // NOVARK expose ses travaux de R&D, sans démarche commerciale : pavillon Recherche plutôt que Zone Démo Entreprises
  stand("citadel", "NOVARK", NOVARK_PROFILE),
  ...STUDENT_PROJECTS.map((name) => stand("etudiants", name)),
  stand("entreprises", tr("Ferme pilote de Guiè", "Guiè pilot farm"), tr("Ingénierie rurale et concept endogène du wégoubri", "Rural engineering and the indigenous concept of wégoubri")),
  stand("entreprises", tr("Réseau Faso Andubè", "Faso Andubè network"), tr("Équipements et outils connectés locaux", "Local connected equipment and tools")),
  stand("entreprises", "SOS Énergie Burkina", tr("Technologies d'accès aux énergies propres", "Clean energy access technologies")),
  stand("entreprises", "Startup Café Burkina", tr("Cartographie des opportunités écosystémiques", "Mapping ecosystem opportunities")),
  ...TOP_INVENTORS.map((i) => stand("inventeurs", i.label, tr(`${capitalize(i.line.fr)} – ${i.owner}`, `${capitalize(i.line.en)} – ${i.owner}`))),
  stand("jeunesse", tr("Le « Makathon Flash : Hack ton Quotidien »", "The “Flash Makathon: Hack Your Daily Life”"), tr("De 24\u00a0h avec la boîte mystère", "24 hours with the mystery box")),
  stand("jeunesse", tr("L'Espace « IA Showroom & Coding Arcade »", "The “AI Showroom & Coding Arcade” space"), tr("Par exemple car robot et parcours", "For example, a robot car and its course")),
  stand("jeunesse", tr("Le Grand Quiz de l'Inventeur Endogène", "The Great Indigenous Inventor Quiz")),
];
