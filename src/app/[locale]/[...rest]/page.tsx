import { notFound } from "next/navigation";
import { resolveLocale, type LocaleParams } from "@/i18n/server";

/** Toute adresse inconnue du site public : page 404 dans la langue demandée. */
export default async function CatchAll({ params }: LocaleParams) {
  await resolveLocale(params);
  notFound();
}
