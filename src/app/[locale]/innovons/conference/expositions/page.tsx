import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Card, Cards, InfoTable, PageHero, Section } from "@/components/ui";
import { callBlock, village } from "@/content/conference";
import { localize, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { StandExplorer } from "./StandExplorer";
import { CONFERENCE_BASE, conferenceDates, formatTime } from "@/lib/site";
import { getPublicContent } from "@/server/content/repository";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: `${CONFERENCE_BASE}/expositions`,
    title: t("Expositions EBC2026", "EBC2026 Exhibitions"),
    description: t(
      "Les stands du village d'exposition EBC2026 : Top 5 Inventeurs, recherche de CITADEL, projets étudiants UNB et BSB, démonstrations d'entreprises et Challenge Jeunesse.",
      "Booths at the EBC2026 exhibition village: Top 5 Inventors, CITADEL research, student projects from UNB and BSB, business demos and the Youth Challenge.",
    ),
  });
}

export default async function ExpositionsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { settings, collections } = await getPublicContent(locale);
  const { conference } = settings;
  const photo = localize(callBlock, locale).image;
  const v = localize(village, locale);
  const { open, close } = v.hours;
  const count = (category: string) => collections.stands.filter((s) => s.category === category).length;
  const total = collections.stands.length;
  return (
    <>
      <PageHero
        label={t("Expositions", "Exhibitions")}
        crumbs={[
          { href: CONFERENCE_BASE, label: "EBC2026" },
          { href: `${CONFERENCE_BASE}/expositions`, label: t("Expositions", "Exhibitions") },
        ]}
        title={t("Des prototypes à voir,", "Prototypes to see,")}
        highlight={t("à tester et à financer", "test and fund")}
        lead={t(
          "Top 5 Inventeurs, intelligence artificielle de CITADEL, projets étudiants de l'UNB et de BSB, démonstrations d'entreprises et Challenge Jeunesse.",
          "Top 5 Inventors, CITADEL's artificial intelligence work, student projects from UNB and BSB, business demos and the Youth Challenge.",
        )}
        actions={
          <>
            <a href="#stands" className="btn btn-primary">
              {t("Explorer les stands", "Explore the booths")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </a>
            <Link href={`${CONFERENCE_BASE}/highlights`} className="btn btn-line">
              {t("Les highlights", "See the highlights")}
            </Link>
          </>
        }
        stats={[
          { value: String(count("inventeurs")), label: t("lauréats du Top 5", "Top 5 laureates") },
          { value: String(count("citadel")), label: t("démonstrations d'IA", "AI demos") },
          { value: String(count("etudiants")), label: t("projets étudiants", "student projects") },
        ]}
        photo={{ ...photo, position: "50% 40%" }}
        aside={
          <InfoTable
            rows={[
              { icon: "calendar", term: t("Dates", "Dates"), value: conferenceDates(conference, locale) },
              { icon: "clock", term: t("Village", "Village"), value: t(`Ouvert de ${formatTime(open, locale)} à ${formatTime(close, locale)}`, `Open ${open} – ${close}`) },
              {
                icon: "booth",
                term: t("Stands", "Booths"),
                value: t(`${total} stands présentés`, `${total} ${total === 1 ? "booth" : "booths"} on display`),
              },
            ]}
          />
        }
      />
      <Section label={t("Le village", "The village")} title={v.title} intro={v.text} grey>
        <Cards cols={3}>
          {v.spaces.map((sp, i) => (
            <Card key={sp.title} index={i} icon={sp.icon} accent={(["blue", "green", "orange", "navy"] as const)[i % 4]} title={sp.title} text={sp.text} />
          ))}
        </Cards>
      </Section>

      <Section
        id="stands"
        label={t("Les stands", "The booths")}
        title={t("Explorer l'exposition.", "Explore the exhibition.")}
        intro={t("Le plan détaillé des stands sera publié avant la conférence.", "The detailed booth map will be published before the conference.")}
      >
        <StandExplorer stands={collections.stands} />
      </Section>
    </>
  );
}
