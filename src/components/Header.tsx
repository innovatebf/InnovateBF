"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALE_TAGS, LOCALES, localize, stripLocale, switchLocaleHref } from "@/i18n";
import { useLocale, useT } from "@/i18n/client";
import { Link } from "@/i18n/Link";
import { nav } from "@/lib/site";
import styles from "./chrome.module.css";
import { Icon } from "./Icon";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Brand({ name = "InnovateBF" }: { name?: string }) {
  return (
    <>
      <Image src="/logo-innovatebf-emblem.png" alt="" width={150} height={127} priority className={styles.brandIcon} />
      <span className={styles.brandName}>{name}</span>
    </>
  );
}

/**
 * Sélecteur FR / EN : même page dans l'autre langue. Le paramètre « lang » fait
 * mémoriser le choix par le middleware (cookie d'un an), y compris pour un lien
 * ouvert dans un nouvel onglet.
 */
function LanguageSwitch({ className }: { className?: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useT();
  return (
    <nav aria-label={t("Langue", "Language")} className={`${styles.lang} ${className ?? ""}`}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={`${switchLocaleHref(pathname, l)}?lang=${l}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale}
          aria-label={LOCALE_TAGS[l].name}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}

/** Bouton d'action : programme de la conférence pendant la période EBC2026, contact ensuite. */
export function Header({ cta }: { cta: { label: string; href: string } }) {
  const pathname = stripLocale(usePathname());
  const t = useT();
  const items = localize(nav, useLocale());
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={styles.header} data-scrolled={scrolled || open}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label={t("InnovateBF, accueil", "InnovateBF, home")}>
          <Brand />
        </Link>

        <nav aria-label={t("Navigation principale", "Main navigation")} className={styles.nav}>
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitch className={styles.langBar} />
          <Link href={cta.href} className={styles.cta}>
            {cta.label}
            <Icon name="arrow" className="size-[1.05em]" strokeWidth={2.2} />
          </Link>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? t("Fermer le menu", "Close menu") : t("Ouvrir le menu", "Open menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label={t("Navigation mobile", "Mobile navigation")} className={styles.mobileMenu}>
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} className={styles.mobileLink}>
                  {item.label}
                  <Icon name="arrow" className="size-5 text-ink-3" />
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileLang}>
            {t("Langue du site", "Site language")}
            <LanguageSwitch />
          </div>
          <Link href={cta.href} className={`btn btn-primary ${styles.mobileCta}`}>
            {cta.label}
            <Icon name="arrow" className="size-4" />
          </Link>
        </nav>
      )}
    </header>
  );
}
