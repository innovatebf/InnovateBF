import { tr, type Tr } from "@/i18n";
import type { CollectionData } from "@/lib/content/definitions";
import { AWARDS, FINANCING, LAB_TO_MARKET, PRIORITY_SECTORS, SOVEREIGNTY } from "@/content/ebc2026-programme";

/**
 * Intervenants d'exemple : profils fictifs (nom de famille « Exemple ») pour
 * présenter la page en attendant la liste confirmée. Rattachés aux sessions
 * réelles du programme ; affichés avec la mention « Exemple » sur le site.
 * Ajout et suppression en un clic dans le back-office (Contenus → Intervenants).
 */

type Speaker = CollectionData<"speakers">;

// Organisation de tous les profils d'exemple
const ORG = tr("Organisation à confirmer", "Organization to be confirmed");

// Fonction : tr("français", "English"), enregistrée dans « role » et « roleEn » (de même pour l'organisation)
const demo = ({ role, ...s }: Omit<Speaker, "photo" | "linkedin" | "demo" | "role" | "roleEn" | "org" | "orgEn" | "nameEn" | "topicEn"> & { role: Tr }): Speaker => ({
  ...s,
  nameEn: "",
  // Sujet : intitulé d'une session du programme, affichée dans sa version anglaise
  topicEn: "",
  org: ORG.fr,
  orgEn: ORG.en,
  role: role.fr,
  roleEn: role.en,
  photo: { src: "", alt: "" },
  linkedin: "",
  demo: true,
});

export const demoSpeakers: Speaker[] = [
  demo({
    name: "Awa Exemple",
    role: tr("Chercheuse en intelligence artificielle", "Artificial intelligence researcher"),
    track: "intervention",
    topic: SOVEREIGNTY.fr,
  }),
  demo({
    name: "Boris Exemple",
    role: tr("Expert en financement de l'innovation", "Innovation finance expert"),
    track: "intervention",
    topic: FINANCING.fr,
  }),
  demo({
    name: "Clarisse Exemple",
    role: tr("Spécialiste du traitement automatique des langues", "Natural language processing specialist"),
    track: "intervention",
    topic: SOVEREIGNTY.fr,
  }),
  demo({
    name: "Daouda Exemple",
    role: tr("Médecin radiologue et chercheur en IA", "Radiologist and AI researcher"),
    track: "intervention",
    topic: PRIORITY_SECTORS.fr,
  }),
  demo({
    name: "Esther Exemple",
    role: tr("Responsable d'un programme d'incubation", "Incubation program manager"),
    track: "intervention",
    topic: LAB_TO_MARKET.fr,
  }),
  demo({
    name: "Fabrice Exemple",
    role: tr("Enseignant-chercheur en systèmes embarqués", "Professor and researcher in embedded systems"),
    track: "jury",
    // Pas sur la session de pitchs : un intervenant rattaché y remplacerait les Top 5
    topic: AWARDS.fr,
  }),
  demo({
    name: "Grâce Exemple",
    role: tr("Consultante en politiques publiques du numérique", "Digital public policy consultant"),
    track: "moderation",
    topic: LAB_TO_MARKET.fr,
  }),
  demo({
    name: "Hamidou Exemple",
    role: tr("Journaliste spécialisé en technologies", "Technology journalist"),
    track: "moderation",
    topic: FINANCING.fr,
  }),
];
