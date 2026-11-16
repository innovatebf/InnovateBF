import { schemaFor, type Field, type ValuesOf } from "./fields";

/*
 * Contenus gérés dans le back-office : uniquement ce qui évolue (dates,
 * coordonnées, actualités, programme, intervenants, partenaires, stands).
 * Les textes fixes (sections de l'accueil et des pages, identité du site et
 * de la conférence, patronage, Top 5, domaines) sont dans src/content/.
 */

/* =====================================================================
 * Paramètres
 * ===================================================================== */

// Champs « (anglais) » : version anglaise du site, le texte français est repris s'ils sont vides
const EN = "Version anglaise du site. Laissé vide, le texte français s'affiche.";

const siteFields = [
  { name: "email", label: "E-mail de contact", type: "email" },
  { name: "city", label: "Siège", type: "text", max: 120, half: true },
  { name: "cityEn", label: "Siège (anglais)", type: "text", max: 120, optional: true, half: true, help: EN },
  { name: "linkedin", label: "Page LinkedIn", type: "url", optional: true, half: true },
  { name: "x", label: "Compte X", type: "url", optional: true, half: true },
  { name: "facebook", label: "Page Facebook", type: "url", optional: true, half: true },
  { name: "youtube", label: "Chaîne YouTube", type: "url", optional: true, half: true },
  { name: "instagram", label: "Compte Instagram", type: "url", optional: true, half: true },
  { name: "tiktok", label: "Compte TikTok", type: "url", optional: true, half: true },
] as const satisfies readonly Field[];

const conferenceFields = [
  { name: "start", label: "Premier jour", type: "date", half: true },
  { name: "end", label: "Dernier jour", type: "date", half: true },
  { name: "hours", label: "Horaires affichés", type: "text", max: 60, half: true },
  {
    name: "hoursEn",
    label: "Horaires affichés (anglais)",
    type: "text",
    max: 60,
    optional: true,
    half: true,
    help: "Laissé vide, les horaires français sont convertis (« 08 h 30 – 18 h 30 » devient « 08:30 – 18:30 »).",
  },
  { name: "venue", label: "Lieu", type: "text", max: 120, half: true },
  { name: "venueEn", label: "Lieu (anglais)", type: "text", max: 120, optional: true, half: true, help: EN },
  { name: "city", label: "Ville", type: "text", max: 80, half: true },
  { name: "cityEn", label: "Ville (anglais)", type: "text", max: 80, optional: true, half: true, help: EN },
  { name: "openingTime", label: "Heure d'ouverture (décompte J-)", type: "time", half: true },
  { name: "mapsUrl", label: "Lien Google Maps (itinéraire)", type: "url", half: true },
] as const satisfies readonly Field[];

const calendarFields = [
  { name: "callOpens", label: "Ouverture de l'appel à projets", type: "datetime", half: true, help: "Heure de Ouagadougou (UTC)." },
  { name: "callCloses", label: "Clôture de l'appel à projets", type: "datetime", half: true, help: "Après cette date, le formulaire de candidature est fermé." },
] as const satisfies readonly Field[];

const conferenceSocialFields = [
  { name: "facebook", label: "Page Facebook", type: "url", optional: true, half: true },
  { name: "linkedin", label: "Page LinkedIn", type: "url", optional: true, half: true },
  { name: "x", label: "Compte X", type: "url", optional: true, half: true },
  { name: "youtube", label: "Chaîne YouTube", type: "url", optional: true, half: true },
  { name: "instagram", label: "Compte Instagram", type: "url", optional: true, half: true },
  { name: "tiktok", label: "Compte TikTok", type: "url", optional: true, half: true },
  { name: "whatsapp", label: "Chaîne ou groupe WhatsApp", type: "url", optional: true, half: true, help: "Lien d'invitation (https://whatsapp.com/channel/… ou https://chat.whatsapp.com/…)." },
] as const satisfies readonly Field[];

export const settingsDefs = {
  site: { label: "Coordonnées et réseaux", group: "Paramètres", description: "E-mail de contact, siège et réseaux sociaux d'InnovateBF (pied de page, page Contact).", fields: siteFields },
  conference: { label: "Conférence : infos pratiques", group: "Paramètres", description: "Dates, horaires et lieu d'EBC2026 : repris sur tout le site.", fields: conferenceFields },
  conferenceSocial: {
    label: "Conférence : réseaux sociaux",
    group: "Paramètres",
    description: "Comptes officiels d'EBC2026 : icônes du pied de page, de la barre de la conférence et de la page Conférence. Seuls les réseaux renseignés s'affichent.",
    fields: conferenceSocialFields,
  },
  calendar: { label: "Ouverture et clôture", group: "Paramètres", description: "Dates d'ouverture et de clôture de l'appel à projets.", fields: calendarFields },
} as const;

export type SettingsKey = keyof typeof settingsDefs;
export type SettingsValue<K extends SettingsKey> = ValuesOf<(typeof settingsDefs)[K]["fields"]>;
export type AllSettings = { [K in SettingsKey]: SettingsValue<K> };

export const settingsSchemas = Object.fromEntries(
  Object.entries(settingsDefs).map(([k, d]) => [k, schemaFor(d.fields)]),
) as { [K in SettingsKey]: ReturnType<typeof schemaFor<(typeof settingsDefs)[K]["fields"]>> };

export const isSettingsKey = (k: string): k is SettingsKey => Object.hasOwn(settingsDefs, k);

/* =====================================================================
 * Contenus (éléments ordonnés, masquables)
 * ===================================================================== */

export const partnerGroups = [
  { value: "organisateur", label: "Organisateur", en: "Organizer" },
  { value: "co_organisateur", label: "Co-organisateur", en: "Co-organizer" },
  { value: "autorite", label: "Autorité de tutelle", en: "Supervisory authority" },
  { value: "media", label: "Partenaire média et numérique", en: "Media and digital partner" },
  { value: "sponsor", label: "Sponsor", en: "Sponsor" },
] as const;

// Espaces du Village de l'Innovation Technologique Endogène (document « Programme provisoire et stands »)
export const standCategoryOptions = [
  { value: "organisateurs", label: "Organisateurs et partenaires", en: "Organizers and partners" },
  { value: "citadel", label: "Pavillon Recherche & Algorithmes", en: "Research & Algorithms Pavilion" },
  { value: "etudiants", label: "Carrefour des Jeunes Makers", en: "Young Makers Hub" },
  { value: "entreprises", label: "Zone Démo Entreprises", en: "Business Demo Zone" },
  { value: "inventeurs", label: "Les Top 5", en: "The Top 5" },
  { value: "jeunesse", label: "Challenge Jeunesse", en: "Youth Challenge" },
] as const;

export const resourceTags = [
  { value: "article", label: "Article", en: "Article" },
  { value: "opportunite", label: "Opportunité", en: "Opportunity" },
  { value: "evenement", label: "Événement", en: "Event" },
  { value: "actualite", label: "Actualité", en: "News" },
] as const;

export const speakerTracks = [
  { value: "intervention", label: "Intervention", en: "Presentation" },
  { value: "keynote", label: "Keynote", en: "Keynote" },
  { value: "panel", label: "Panel", en: "Panel" },
  { value: "talk", label: "Talk", en: "Talk" },
  { value: "atelier", label: "Atelier", en: "Workshop" },
  { value: "jury", label: "Jury", en: "Jury" },
  { value: "moderation", label: "Modération", en: "Moderator" },
] as const;

/** Libellé d'une option dans la langue de la page (le back-office affiche `label`). */
export function optionLabel(options: readonly { value: string; label: string; en: string }[], value: string, locale: "fr" | "en") {
  const o = options.find((x) => x.value === value);
  return o ? (locale === "en" ? o.en : o.label) : value;
}

const highlightFields = [
  { name: "badge", label: "Pastille", type: "text", max: 30, half: true, help: "Ex. : Événement, Appel à projets" },
  { name: "badgeEn", label: "Pastille (anglais)", type: "text", max: 30, optional: true, half: true, help: EN },
  { name: "title", label: "Titre", type: "text", max: 80, half: true },
  { name: "titleEn", label: "Titre (anglais)", type: "text", max: 80, optional: true, half: true, help: EN },
  { name: "text", label: "Texte", type: "text", multiline: true, max: 220 },
  { name: "textEn", label: "Texte (anglais)", type: "text", multiline: true, max: 220, optional: true, help: EN },
  { name: "image", label: "Photo", type: "image", withAlt: true },
  { name: "imageAltEn", label: "Description de la photo (anglais)", type: "text", max: 200, optional: true, help: EN },
  { name: "href", label: "Lien de la flèche", type: "link" },
] as const satisfies readonly Field[];

const resourceFields = [
  { name: "tag", label: "Type", type: "select", options: resourceTags, half: true },
  { name: "date", label: "Date", type: "date", optional: true, half: true, help: "Laisser vide pour ne pas afficher de date." },
  { name: "title", label: "Titre", type: "text", max: 120 },
  { name: "titleEn", label: "Titre (anglais)", type: "text", max: 120, optional: true, help: EN },
  { name: "image", label: "Photo", type: "image", withAlt: true },
  { name: "imageAltEn", label: "Description de la photo (anglais)", type: "text", max: 200, optional: true, help: EN },
  { name: "href", label: "Lien", type: "link" },
] as const satisfies readonly Field[];

const speakerFields = [
  { name: "name", label: "Nom", type: "text", max: 120, half: true },
  { name: "org", label: "Organisation", type: "text", max: 120, optional: true, half: true },
  { name: "nameEn", label: "Nom (anglais)", type: "text", max: 120, optional: true, half: true, help: "Pour un nom collectif (« Équipe … », « Direction de … ») ; laissé vide, le nom s'affiche tel quel." },
  { name: "orgEn", label: "Organisation (anglais)", type: "text", max: 120, optional: true, half: true, help: EN },
  { name: "role", label: "Fonction", type: "text", max: 160, optional: true, half: true },
  { name: "roleEn", label: "Fonction (anglais)", type: "text", max: 160, optional: true, half: true, help: EN },
  { name: "track", label: "Type d'intervention", type: "select", options: speakerTracks, half: true },
  { name: "topic", label: "Sujet de l'intervention", type: "text", max: 160, optional: true, half: true, help: "Reprenez l'intitulé d'une session du programme pour y afficher l'intervenant." },
  {
    name: "topicEn",
    label: "Sujet de l'intervention (anglais)",
    type: "text",
    max: 160,
    optional: true,
    half: true,
    help: "Affiché sur le site anglais quand le sujet ne correspond à aucune session (sinon, l'intitulé anglais de la session s'affiche).",
  },
  { name: "photo", label: "Photo", type: "image", optional: true },
  { name: "linkedin", label: "Profil LinkedIn", type: "url", optional: true },
  { name: "demo", label: "Fiche d'exemple (fictive)", type: "boolean", help: "Affiche la mention « Exemple » sur le site. Décochez une fois les informations réelles saisies." },
] as const satisfies readonly Field[];

const inventorFields = [
  { name: "project", label: "Projet", type: "text", max: 80, half: true },
  { name: "projectEn", label: "Projet (anglais)", type: "text", max: 80, optional: true, half: true, help: "Laissé vide, le nom du projet s'affiche tel quel." },
  { name: "owner", label: "Inventeur (porteur du projet)", type: "text", max: 120, half: true },
  { name: "ownerEn", label: "Inventeur (anglais)", type: "text", max: 120, optional: true, half: true, help: "Pour un nom collectif (« Équipe … ») ; laissé vide, le nom s'affiche tel quel." },
  { name: "org", label: "Structure", type: "text", max: 120, half: true },
  { name: "orgEn", label: "Structure (anglais)", type: "text", max: 120, optional: true, half: true, help: EN },
  { name: "category", label: "Domaine", type: "text", max: 60, half: true },
  { name: "categoryEn", label: "Domaine (anglais)", type: "text", max: 60, optional: true, half: true, help: EN },
  { name: "pitch", label: "Présentation courte", type: "text", multiline: true, max: 300 },
  { name: "pitchEn", label: "Présentation courte (anglais)", type: "text", multiline: true, max: 300, optional: true, help: EN },
  { name: "photo", label: "Photo de l'inventeur", type: "image", optional: true, help: "Sans photo, les initiales sont affichées." },
  { name: "link", label: "Site du projet", type: "url", optional: true },
] as const satisfies readonly Field[];

const programmeFields = [
  { name: "day", label: "Jour", type: "select", options: [
    { value: "1", label: "Jour 1" },
    { value: "2", label: "Jour 2" },
  ], half: true },
  { name: "highlight", label: "Temps fort (mis en valeur)", type: "boolean", half: true },
  { name: "time", label: "Heure de début", type: "time", half: true },
  { name: "end", label: "Heure de fin", type: "time", optional: true, half: true, help: "Laissée vide, seule l'heure de début s'affiche." },
  { name: "kind", label: "Format", type: "text", max: 40, optional: true, half: true, help: "Ex. : Session, Pause" },
  {
    name: "kindEn",
    label: "Format (anglais)",
    type: "text",
    max: 40,
    optional: true,
    half: true,
    help: "Les formats courants (Session, Pause, Exposition…) sont traduits automatiquement ; à renseigner pour un autre format.",
  },
  { name: "title", label: "Intitulé complet", type: "text", max: 200 },
  { name: "titleEn", label: "Intitulé complet (anglais)", type: "text", max: 200, optional: true, help: EN },
  { name: "detail", label: "Précisions", type: "text", max: 300, optional: true },
  { name: "detailEn", label: "Précisions (anglais)", type: "text", max: 300, optional: true, help: EN },
  { name: "points", label: "Points de la session", type: "lines", maxItems: 20, maxLength: 200, help: "Une ligne se terminant par « : » devient un intertitre. Remplace la ligne des intervenants sur la page Programme." },
  { name: "pointsEn", label: "Points de la session (anglais)", type: "lines", maxItems: 20, maxLength: 200, help: EN },
  { name: "speaker", label: "Intervenant(s)", type: "text", max: 200, optional: true, half: true },
  { name: "speakerEn", label: "Intervenant(s) (anglais)", type: "text", max: 200, optional: true, half: true, help: EN },
] as const satisfies readonly Field[];

const partnerFields = [
  { name: "name", label: "Nom", type: "text", max: 160, half: true },
  { name: "group", label: "Catégorie", type: "select", options: partnerGroups, half: true },
  { name: "nameEn", label: "Nom (anglais)", type: "text", max: 160, optional: true, half: true, help: "Lu par les lecteurs d'écran sur le site anglais. Laissé vide, le nom français est repris." },
  { name: "logo", label: "Logo", type: "image", optional: true },
  { name: "caption", label: "Légende sous le logo", type: "text", max: 120, optional: true, half: true },
  { name: "captionEn", label: "Légende (anglais)", type: "text", max: 120, optional: true, half: true, help: EN },
  { name: "captionBold", label: "Légende en gras", type: "boolean", half: true },
  { name: "href", label: "Site web", type: "url", optional: true },
  { name: "showOnHome", label: "Afficher sur l'accueil", type: "boolean", half: true },
  { name: "wide", label: "Tuile large (page Conférence)", type: "boolean", half: true },
] as const satisfies readonly Field[];

const standFields = [
  { name: "name", label: "Stand", type: "text", max: 120, half: true },
  { name: "category", label: "Catégorie", type: "select", options: standCategoryOptions, half: true },
  { name: "nameEn", label: "Stand (anglais)", type: "text", max: 120, optional: true, half: true, help: EN },
  { name: "detail", label: "Description", type: "text", max: 300, optional: true },
  { name: "detailEn", label: "Description (anglais)", type: "text", max: 300, optional: true, help: EN },
] as const satisfies readonly Field[];

export const collectionDefs = {
  highlights: { label: "À la une", singular: "diapositive", titleField: "title", subtitleField: "badge", fields: highlightFields, description: "Carrousel « À la une » de l'accueil." },
  resources: { label: "Actualités et ressources", singular: "ressource", titleField: "title", subtitleField: "tag", fields: resourceFields, description: "Cartes « Actualités, opportunités et connaissances » de l'accueil." },
  speakers: { label: "Intervenants", singular: "intervenant", titleField: "name", subtitleField: "org", fields: speakerFields, description: "Pages Intervenants et Conférence : n'ajoutez que des intervenants confirmés." },
  inventors: { label: "Top Inventeurs", singular: "projet", titleField: "project", subtitleField: "owner", fields: inventorFields, description: "Top 5 : pitchs (pages Intervenants et Programme), Highlights et Conférence, dans l'ordre affiché." },
  programme: { label: "Programme", singular: "créneau", titleField: "title", subtitleField: "time", fields: programmeFields, description: "Créneaux des deux jours : pages Programme et Intervenants." },
  partners: { label: "Partenaires et sponsors", singular: "partenaire", titleField: "name", subtitleField: "group", fields: partnerFields, description: "Logos de l'accueil et de la page Conférence (organisateurs, sponsors, médias)." },
  stands: { label: "Stands", singular: "stand", titleField: "name", subtitleField: "category", fields: standFields, description: "Page Expositions." },
} as const;

export type CollectionName = keyof typeof collectionDefs;
export type CollectionData<C extends CollectionName> = ValuesOf<(typeof collectionDefs)[C]["fields"]>;
export type CollectionItem<C extends CollectionName> = { id: number; position: number; visible: boolean; data: CollectionData<C> };

export const collectionSchemas = Object.fromEntries(
  Object.entries(collectionDefs).map(([k, d]) => [k, schemaFor(d.fields)]),
) as { [C in CollectionName]: ReturnType<typeof schemaFor<(typeof collectionDefs)[C]["fields"]>> };

export const isCollectionName = (k: string): k is CollectionName => Object.hasOwn(collectionDefs, k);
