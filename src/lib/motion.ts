import type { CSSProperties } from "react";

/** Délai d'apparition (en ms) pour un élément data-reveal : effets en cascade. */
export function delay(ms: number): CSSProperties {
  return { "--d": `${ms}ms` } as CSSProperties;
}
