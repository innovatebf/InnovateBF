"use client";

import NextLink from "next/link";
import { localizeHref } from ".";
import { useLocale } from "./client";

/** Lien interne dans la langue de la page : « /about » devient « /en/about » sur le site anglais. */
export function Link({ href, ...props }: Omit<React.ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  return <NextLink href={localizeHref(href, useLocale())} {...props} />;
}
