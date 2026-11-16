import type { Metadata } from "next";
import { translator } from "@/i18n";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import NotFound from "../not-found";

/*
 * Page 404 du site public, générée dans chaque langue : le middleware y
 * renvoie toute adresse inconnue avec le statut 404 (src/middleware.ts),
 * ce qui donne une page complète dès le serveur (en-tête, pied de page, langue).
 */

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = translator(await resolveLocale(params));
  return { title: t("Page introuvable", "Page not found"), robots: { index: false, follow: true } };
}

export default async function NotFoundPage({ params }: LocaleParams) {
  await resolveLocale(params);
  return <NotFound />;
}
