// Types complets pour la plateforme InnovonsEnsembleLeFaso

export type NeedStatus = "BROUILLON" | "VALIDATION" | "PUBLIE" | "ARCHIVE";
export type NeedLevel = "LOCAL" | "NATIONAL" | "REGIONAL" | "INTERNATIONAL";
export type ObstacleNature =
  | "INFRASTRUCTURE"
  | "CAPITAL_HUMAIN"
  | "FINANCEMENT"
  | "REGLEMENTATION"
  | "MARCHE"
  | "CONTEXTUEL";
export type ObstacleCriticite = 1 | 2 | 3;
export type ObstacleControlabilite = "TOTALE" | "PARTIELLE" | "NULLE";
export type ResultatNiveau = "OUTPUT" | "OUTCOME" | "IMPACT";
export type ResultatHorizon = "COURT" | "MOYEN" | "LONG";
export type UserRole = "admin" | "editor" | "guest";
export type CallStatus = "OUVERT" | "FERME" | "SELECTIONNE";

export interface Obstacle {
  id: string;
  intitule: string;
  nature: ObstacleNature;
  description: string;
  criticite: ObstacleCriticite;
  controlabilite: ObstacleControlabilite;
}

export interface Resultat {
  id: string;
  intitule: string;
  niveau: ResultatNiveau;
  quantification: string;
  horizon: ResultatHorizon;
}

export interface Indicateur {
  id: string;
  intitule: string;
  type: "PROCESSUS" | "RESULTAT" | "CONTEXTE";
  resultat_associe: string;
  source: string;
  baseline: string;
  frequence: string;
}

export interface PartiesPrenantes {
  id: string;
  categorie:
    | "Initiateur"
    | "Financeur"
    | "Beneficiaire"
    | "Partie impactee"
    | "Regulateur"
    | "Expert";
  acteur: string;
  role: string;
  position: "Actif" | "Neutre" | "Oppose";
}

export interface Need {
  id: string;
  slug: string;
  titre: string;
  domaine: string;
  secteur: string;
  region: string;
  pays: string;
  niveau: NeedLevel;
  statut: NeedStatus;
  tags: string[];
  question_centrale: string;
  contexte_strategique: string;
  parties_prenantes: PartiesPrenantes[];
  obstacles: Obstacle[];
  resultats: Resultat[];
  indicateurs: Indicateur[];
  synthese_narrative: string;
  population_impact: number;
  budget: number;
  auteur_id?: string;
  auteur_email?: string;
  created_at: string;
  published_at: string | null;
  updated_at: string;
}

export interface Proposal {
  id: string;
  need_id: string;
  titre: string;
  description: string;
  porteur: string;
  organisation: string;
  statut: "EN_ATTENTE" | "RETENU" | "REJETE";
  created_at: string;
}

export interface CallForSolutions {
  id: string;
  need_id: string;
  need: Need;
  titre: string;
  description: string;
  domaine: string;
  deadline: string;
  statut: CallStatus;
  budget_alloue: number;
  nb_proposals: number;
  created_at: string;
}

export interface IEStats {
  needsCount: number;
  proposalsCount: number;
  parrainsCount: number;
  populationImpact: number;
  budgetMobilise: number;
}

export interface NeedFilters {
  search: string;
  domaines: string[];
  secteurs: string[];
  niveaux: NeedLevel[];
  horizons: ResultatHorizon[];
  tags: string[];
  criticite: ObstacleCriticite[];
}
