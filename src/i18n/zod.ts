import { z } from "zod";
import type { Locale } from ".";

/**
 * Messages de validation des formulaires publics, dans la langue de la page
 * (passés à safeParse / parse : ils priment sur la langue globale de zod).
 * Les messages courants sont reformulés simplement, les autres viennent de zod.
 */
export function validationErrors(locale: Locale): z.core.$ZodErrorMap {
  const en = locale === "en";
  const fallback = (en ? z.locales.en() : z.locales.fr()).localeError;
  return (issue) => {
    if (issue.code === "too_small" && issue.origin === "string") {
      const min = Number(issue.minimum);
      if (min <= 1) return en ? "This field is required." : "Champ obligatoire";
      return en ? `At least ${min} characters.` : `${min} caractères minimum`;
    }
    if (issue.code === "too_big" && issue.origin === "string") {
      return en ? `At most ${Number(issue.maximum)} characters.` : `${Number(issue.maximum)} caractères maximum`;
    }
    if (issue.code === "invalid_format" && issue.format === "email") return en ? "Invalid email address." : "Adresse e-mail invalide";
    if (issue.code === "invalid_format" && issue.format === "url") return en ? "Invalid link." : "Lien invalide";
    return fallback(issue);
  };
}
