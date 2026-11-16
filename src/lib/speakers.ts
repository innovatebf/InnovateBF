/**
 * Rattachement des intervenants (back-office) aux sessions du programme :
 * le champ « Sujet de l'intervention » reprend l'intitulé de la session.
 * Comparaison sans accents, casse ni ponctuation ; un sujet court ne
 * déclenche qu'une égalité stricte (« IA » ne correspond pas à toutes les sessions).
 */

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const MIN_PARTIAL = 12;

export function topicMatches(topic: string, sessionTitle: string) {
  const a = norm(topic);
  const b = norm(sessionTitle);
  if (!a || !b) return false;
  if (a === b) return true;
  return Math.min(a.length, b.length) >= MIN_PARTIAL && (a.includes(b) || b.includes(a));
}

/** Intervenants d'une session, d'après son intitulé français (`slot.key` sur le site). */
export function speakersFor<S extends { topic: string }>(sessionTitle: string, speakers: S[]) {
  return speakers.filter((s) => topicMatches(s.topic, sessionTitle));
}

/** Organisation à afficher sous le nom, sauf si le nom la contient déjà (« Équipe NOVARK » / « NOVARK »). */
export function orgLine(s: { name: string; org: string }) {
  return s.org && !norm(s.name).includes(norm(s.org)) ? s.org : "";
}
