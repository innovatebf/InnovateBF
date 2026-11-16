/** Libellés partagés par les pages serveur et les composants client du back-office. */

export const STATUS_LABELS: Record<string, string> = {
  recu: "Reçu",
  pieces_manquantes: "Pièces manquantes",
  en_evaluation: "En évaluation",
  retenu: "Retenu",
  non_retenu: "Non retenu",
};

export const STATUS_TONE: Record<string, string> = {
  recu: "adm-badge-blue",
  pieces_manquantes: "adm-badge-amber",
  en_evaluation: "",
  retenu: "adm-badge-green",
  non_retenu: "adm-badge-red",
};

export const ACTION_LABELS: Record<string, string> = {
  login: "Connexion",
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  reorder: "Réorganisation",
  show: "Affichage",
  hide: "Masquage",
  upload: "Envoi d'image",
  password_change: "Changement de mot de passe",
};

/** Cookie de la barre latérale du back-office (« collapsed » : réduite aux pictogrammes). */
export const SIDEBAR_COOKIE = "adm_sidebar";
