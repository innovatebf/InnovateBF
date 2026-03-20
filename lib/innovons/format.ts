// ── Helpers de formatage (PRD KI-F04) ───────────────────────────────────────

/**
 * Formate un nombre selon la règle K / M / Mds
 * Ex : 992000 → "992K+" | 5800000000 → "5,8 Mds"
 */
export function formatNumber(value: number, suffix = ""): string {
  if (value >= 1_000_000_000) {
    const v = (value / 1_000_000_000).toFixed(1).replace(".", ",");
    return `${v} Mds${suffix}`;
  }
  if (value >= 1_000_000) {
    const v = (value / 1_000_000).toFixed(1).replace(".", ",");
    return `${v} M${suffix}`;
  }
  if (value >= 1_000) {
    const v = Math.floor(value / 1_000);
    return `${v}K+${suffix}`;
  }
  return `${value}${suffix}`;
}

/**
 * Formate un montant en FCFA
 */
export function formatFCFA(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(".", ",")} Mds FCFA`;
  }
  if (value >= 1_000_000) {
    return `${Math.floor(value / 1_000_000)} M FCFA`;
  }
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

/**
 * Nombre de jours jusqu'à une date
 */
export function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
