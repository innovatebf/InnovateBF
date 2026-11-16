import Image from "next/image";
import { localize } from "@/i18n";
import { Link } from "@/i18n/Link";
import { getLocale } from "@/i18n/server";
import { CONFERENCE_BASE, conferencePages, legalLinks, nav } from "@/lib/site";
import type { PublicContent } from "@/server/content/repository";
import styles from "./chrome.module.css";
import { socialLinks, SocialLinks } from "./Social";

export function Footer({ content }: { content: PublicContent }) {
  const locale = getLocale();
  const en = locale === "en";
  const { site, conference, conferenceSocial } = content.settings;
  const hasSocial = socialLinks(site).length > 0;
  const hasEbcSocial = socialLinks(conferenceSocial).length > 0;
  const links = [
    ...localize(nav, locale).filter((item) => item.href !== "/contact"),
    ...localize(conferencePages, locale).map((p) => ({ href: `${CONFERENCE_BASE}/${p.slug}`, label: p.label })),
    { href: "/contact", label: en ? "Contact us" : "Nous contacter" },
  ];
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div>
          <Link href="/" className={styles.fBrand} aria-label={`${site.name}, ${en ? "home" : "accueil"}`}>
            <Image src="/logo-innovatebf-emblem.png" alt="" width={150} height={127} className={styles.brandIcon} />
            <span className={styles.brandName}>{site.name}</span>
          </Link>
          <p className={styles.fTagline}>{site.tagline}</p>
        </div>

        <div>
          <h2 className={styles.fHead}>{en ? "Quick links" : "Liens rapides"}</h2>
          <ul className={styles.fLinks}>
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={styles.fHead}>{hasSocial ? (en ? "Follow us" : "Suivez-nous") : en ? "Email us" : "Nous écrire"}</h2>
          <SocialLinks accounts={site} owner={site.name} on={en ? "on" : "sur"} className={styles.social} />
          <a href={`mailto:${site.email}`} className={styles.fMail}>
            {site.email}
          </a>
          {hasEbcSocial && (
            <>
              <h2 className={`${styles.fHead} ${styles.fHeadSub}`}>{en ? `Follow ${conference.name}` : `Suivre ${conference.name}`}</h2>
              <SocialLinks accounts={conferenceSocial} owner={conference.name} on={en ? "on" : "sur"} className={styles.social} />
            </>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p>
            © {new Date().getFullYear()} {site.name}. {en ? "All rights reserved." : "Tous droits réservés."}
          </p>
          <p className={styles.legal}>
            {localize(legalLinks, locale)
              .filter((l) => l.href !== "/contact")
              .map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
