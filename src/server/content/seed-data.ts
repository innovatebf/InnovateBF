import { tr, type Tr } from "@/i18n";
import { referenceInventors, referenceProgramme, referenceSpeakers, referenceStands } from "@/content/ebc2026-programme";
import type { AllSettings, CollectionData, CollectionName } from "@/lib/content/definitions";

/**
 * Contenu initial du back-office (paramètres et contenus qui évoluent).
 * Sert à amorcer la base et de valeur de secours. Les textes fixes sont
 * dans src/content/.
 */

const emblem = { src: "/logos/armoiries-burkina.png", alt: "Armoiries du Burkina Faso" };

export const defaultSettings: AllSettings = {
  site: {
    email: "contact@innovatebf.org",
    city: "Ouagadougou, Burkina Faso",
    cityEn: "",
    linkedin: "",
    x: "",
    facebook: "",
    youtube: "",
    instagram: "",
    tiktok: "",
  },
  conference: {
    start: "2026-11-27",
    end: "2026-11-28",
    openingTime: "08:30",
    hours: "08 h 30 – 18 h 30",
    hoursEn: "",
    venue: "CEA-UNB, Université Nazi BONI",
    venueEn: "CEA-UNB, Nazi BONI University",
    city: "Bobo-Dioulasso",
    cityEn: "",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Universit%C3%A9%20Nazi%20Boni%20Bobo-Dioulasso",
  },
  conferenceSocial: { facebook: "", linkedin: "", x: "", youtube: "", instagram: "", tiktok: "", whatsapp: "" },
  calendar: {
    callOpens: "2026-09-08T00:00:00.000Z",
    callCloses: "2026-10-31T23:59:59.000Z",
  },
};

// Textes bilingues des fonctions d'amorçage : tr("français", "English") remplit le champ et sa version « xxxEn » ;
// une chaîne seule (nom propre, sigle) est reprise telle quelle en anglais
type Text = string | Tr;
const fr = (t: Text) => (typeof t === "string" ? t : t.fr);
const en = (t: Text) => (typeof t === "string" ? t : t.en);
// Nom propre identique dans les deux langues : champ anglais vide (le nom s'affiche tel quel)
const enName = (t: Text) => (typeof t === "string" ? "" : t.en);

// Domaines des Top 5 (palmarès officiel du 23 octobre) ; le reste des fiches vient de la référence
const INVENTOR_CATEGORIES: Record<string, Tr> = {
  "Guundi Mobile Security": tr("Numérique & IA", "Digital & AI"),
  Wefafa: tr("Mobilité", "Mobility"),
  KÏSSY: tr("Énergie", "Energy"),
  SujetsBF: tr("Éducation", "Education"),
  "Visit Faso": tr("Tourisme", "Tourism"),
};

// Les champs anglais (« xxxEn ») sont facultatifs dans l'amorçage : vides, le texte français s'affiche
type EnKeys<T> = Extract<keyof T, `${string}En`>;
type SeedData<C extends CollectionName> = Omit<CollectionData<C>, EnKeys<CollectionData<C>>> & Partial<CollectionData<C>>;
type Seed = { [C in CollectionName]: SeedData<C>[] };

const partner = (
  name: Text,
  group: CollectionData<"partners">["group"],
  logo: string,
  o: { caption?: Text; captionBold?: boolean; href?: string; wide?: boolean; showOnHome?: boolean } = {},
): CollectionData<"partners"> => ({
  name: fr(name),
  nameEn: enName(name),
  group,
  logo: { src: logo, alt: o.caption ? "" : fr(name) },
  caption: fr(o.caption ?? ""),
  captionEn: en(o.caption ?? ""),
  captionBold: o.captionBold ?? false,
  href: o.href ?? "",
  wide: o.wide ?? false,
  showOnHome: o.showOnHome ?? true,
});

const stand = (category: CollectionData<"stands">["category"], name: Text, detail: Text = ""): CollectionData<"stands"> => ({
  name: fr(name),
  category,
  nameEn: en(name),
  detail: fr(detail),
  detailEn: en(detail),
});

/*
 * Sites officiels vérifiés (octobre 2026). Abamix : site du groupe (abamix GmbH,
 * même dirigeant qu'Abamix Burkina SARL). MESFPT : formationpro.gov.bf (domaine gouvernemental).
 */
const PARTNER_LINKS = {
  InnovateBF: "https://www.innovatebf.org",
  "Université Nazi BONI": "https://www.univ-bobo.gov.bf",
  "UNB · CCPS": "https://www.univ-bobo.gov.bf",
  MESRI: "https://www.mesrsi.gov.bf",
  "Ministère de la Transition digitale": "https://www.mdenp.gov.bf",
  "Ministère de l'Enseignement secondaire": "https://formationpro.gov.bf",
  "BSB, Burkina Suudu Bawdè": "https://bsb.gov.bf",
  Abamix: "https://abamix.com",
  CITADEL: "https://citadel.bf",
  "Sankora.ai": "https://sankora.ai",
  LeGuideIA: "https://leguideia.ai",
} as const;

const CO_ORGANIZER = tr("Co-organisateur", "Co-organizer");

export const seedItems: Seed = {
  highlights: [
    {
      badge: "Événement",
      badgeEn: "Event",
      title: "Conférence EBC2026",
      titleEn: "EBC2026 Conference",
      text: "Chercheurs, inventeurs, entrepreneurs et décideurs réunis les 27 et 28 novembre 2026 à Bobo-Dioulasso.",
      textEn: "Researchers, inventors, entrepreneurs and decision-makers come together in Bobo-Dioulasso on November 27–28, 2026.",
      image: { src: "/images/hero-bobo-dioulasso.jpg", alt: "Monument de Bobo-Dioulasso" },
      imageAltEn: "Bobo-Dioulasso monument",
      href: "/innovons/conference",
    },
    {
      badge: "Appel à projets",
      badgeEn: "Call for projects",
      title: "Concours d'innovation EBC'26",
      titleEn: "EBC'26 innovation competition",
      text: "Déposez votre projet technologique endogène et tentez d'être distingué lors de la conférence.",
      textEn: "Submit your indigenous technology project for a chance to be recognized at the conference.",
      image: { src: "/images/prototype-electronique.jpg", alt: "Prototype électronique" },
      imageAltEn: "Electronic prototype",
      href: "/innovons/conference/appel-a-contributions",
    },
    {
      badge: "Top 5",
      badgeEn: "Top 5",
      title: "Des talents burkinabè qui innovent",
      titleEn: "Burkinabè talent driving innovation",
      text: "Cinq inventeurs présentent leurs solutions en pitch devant le jury et le public d'EBC2026.",
      textEn: "Five inventors pitch their solutions to the EBC2026 jury and audience.",
      image: { src: "/images/ingenieure-ordinateur.jpg", alt: "Ingénieure devant son ordinateur" },
      imageAltEn: "Engineer working at her computer",
      href: "/innovons/conference/highlights",
    },
  ],
  resources: [
    {
      tag: "article",
      date: "",
      title: "Analyse : trois blocages de l'écosystème technologique burkinabè",
      titleEn: "Analysis: three barriers in the Burkinabè technology ecosystem",
      image: { src: "/images/ingenieure-ordinateur.jpg", alt: "" },
      href: "/domains/analysis",
    },
    {
      tag: "opportunite",
      date: "2026-09-08",
      title: "Appel à projets EBC'26 : déposez votre candidature",
      titleEn: "EBC'26 call for projects: submit your application",
      image: { src: "/images/prototype-electronique.jpg", alt: "" },
      href: "/innovons/conference/candidater",
    },
    {
      tag: "evenement",
      date: "2026-11-27",
      title: "Conférence EBC2026 à Bobo-Dioulasso",
      titleEn: "EBC2026 Conference in Bobo-Dioulasso",
      image: { src: "/images/orateur.jpg", alt: "" },
      href: "/innovons/conference",
    },
  ],
  // Programme, intervenants, Top 5 et stands du Village : référence d'EBC2026 (src/content/ebc2026-programme.ts)
  programme: referenceProgramme,
  partners: [
    partner("InnovateBF", "co_organisateur", "/logos/innovatebf.png", { href: PARTNER_LINKS.InnovateBF }),
    partner(tr("Université Nazi BONI", "Nazi BONI University"), "organisateur", "/logos/unb.png", { href: PARTNER_LINKS["Université Nazi BONI"] }),
    partner("UNB · CCPS", "organisateur", "/logos/unb-ccps.png", { href: PARTNER_LINKS["UNB · CCPS"] }),
    partner("MESRI", "autorite", emblem.src, { caption: "MESRI", captionBold: true, href: PARTNER_LINKS.MESRI }),
    partner(tr("Ministère de la Transition digitale", "Ministry of Digital Transition"), "autorite", emblem.src, {
      caption: tr(
        "Ministère de la Transition digitale, des Postes et des Communications électroniques",
        "Ministry of Digital Transition, Posts and Electronic Communications",
      ),
      href: PARTNER_LINKS["Ministère de la Transition digitale"],
    }),
    partner(tr("Ministère de l'Enseignement secondaire", "Ministry of Secondary Education"), "autorite", emblem.src, {
      caption: tr(
        "Ministère de l'Enseignement secondaire, de la Formation professionnelle et technique",
        "Ministry of Secondary Education, Vocational and Technical Training",
      ),
      href: PARTNER_LINKS["Ministère de l'Enseignement secondaire"],
    }),
    partner("BSB, Burkina Suudu Bawdè", "co_organisateur", "/logos/bsb.png", { href: PARTNER_LINKS["BSB, Burkina Suudu Bawdè"] }),
    partner(
      tr(
        "CITADEL, Centre d'excellence interdisciplinaire en intelligence artificielle pour le développement",
        "CITADEL, Interdisciplinary Center of Excellence in Artificial Intelligence for Development",
      ),
      "co_organisateur",
      "/logos/citadel.png",
      { wide: true, href: PARTNER_LINKS.CITADEL },
    ),
    partner("Abamix", "co_organisateur", "/logos/abamix.png", { wide: true, href: PARTNER_LINKS.Abamix }),
    partner("Sankora.ai", "co_organisateur", "/logos/sankora.png", { href: PARTNER_LINKS["Sankora.ai"] }),
    partner("LeGuideIA", "co_organisateur", "/logos/leguideia.png", { caption: "LeGuideIA", captionBold: true, href: PARTNER_LINKS.LeGuideIA }),
  ],
  speakers: referenceSpeakers.map((s) => ({ ...s, photo: { src: "", alt: "" }, linkedin: "", demo: false })),
  inventors: referenceInventors.map((i) => ({
    ...i,
    // Noms propres : versions anglaises vides, le nom s'affiche tel quel
    projectEn: "",
    ownerEn: "",
    orgEn: "",
    category: INVENTOR_CATEGORIES[i.project].fr,
    categoryEn: INVENTOR_CATEGORIES[i.project].en,
    photo: { src: "", alt: "" },
    link: "",
  })),
  stands: [
    stand("organisateurs", tr("Université Nazi BONI · CCPS", "Nazi BONI University · CCPS"), tr("Organisateur", "Organizer")),
    stand("organisateurs", "InnovateBF", tr("Think tank, co-organisateur", "Think tank, co-organizer")),
    stand("organisateurs", "BSB, Burkina Suudu Bawdè", CO_ORGANIZER),
    stand("organisateurs", "Abamix", CO_ORGANIZER),
    stand("organisateurs", "Sankora.ai", CO_ORGANIZER),
    stand("organisateurs", "LeGuideIA", CO_ORGANIZER),
    ...referenceStands,
  ],
};
