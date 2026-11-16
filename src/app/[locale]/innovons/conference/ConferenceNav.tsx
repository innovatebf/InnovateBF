"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SocialLinks } from "@/components/Social";
import { localize, stripLocale } from "@/i18n";
import { useLocale, useT } from "@/i18n/client";
import { Link } from "@/i18n/Link";
import { APPLY_URL, CONFERENCE_BASE, conferencePages } from "@/lib/site";

/** Rubriques de la conférence, et réseaux sociaux d'EBC2026 sur ordinateur. */
export function ConferenceNav({ social }: { social: Partial<Record<string, string>> }) {
  const pathname = stripLocale(usePathname());
  const locale = useLocale();
  const t = useT();
  const list = useRef<HTMLUListElement>(null);

  // Sur mobile, la rubrique active est ramenée au centre de la barre défilante
  useEffect(() => {
    const ul = list.current;
    const active = ul?.querySelector<HTMLElement>('[aria-current="page"]');
    if (ul && active) ul.scrollLeft = active.offsetLeft - (ul.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);
  const items = [{ href: CONFERENCE_BASE, label: t("Présentation", "Overview") }]
    .concat(localize(conferencePages, locale).map((p) => ({ href: `${CONFERENCE_BASE}/${p.slug}`, label: p.label })))
    .concat([{ href: APPLY_URL, label: t("Candidater", "Apply") }]);

  return (
    // Collée sous l'en-tête (72 px sur mobile, 84 px sur ordinateur)
    <nav aria-label={t("Navigation EBC2026", "EBC2026 navigation")} className="sticky top-[72px] z-30 border-b border-rule bg-white/85 backdrop-blur-md lg:top-[84px]">
      <div className="wrap flex items-center gap-4">
        <span className="hidden shrink-0 items-center gap-2 border-r border-rule py-1 pr-4 text-sm font-extrabold tracking-tight text-navy sm:inline-flex">
          <span className="size-2 rounded-full bg-orange" aria-hidden="true" />
          EBC2026
        </span>
        <ul ref={list} className="relative flex min-w-0 flex-1 gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="block rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap text-ink-2 transition-colors hover:bg-sky hover:text-navy aria-[current=page]:bg-navy aria-[current=page]:text-white aria-[current=page]:shadow-[0_10px_22px_-14px_rgb(7_42_107/0.9)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <SocialLinks
          accounts={social}
          owner="EBC2026"
          on={t("sur", "on")}
          iconClassName="size-4"
          className="hidden shrink-0 items-center gap-1 border-l border-rule pl-3 xl:flex [&_a]:inline-flex [&_a]:size-8 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-full [&_a]:text-ink-2 [&_a]:transition-colors [&_a:hover]:bg-sky [&_a:hover]:text-navy"
        />
      </div>
    </nav>
  );
}
