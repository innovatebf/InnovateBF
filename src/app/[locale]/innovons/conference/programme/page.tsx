import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Callout, InfoTable, PageHero, Section } from "@/components/ui";
import { translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { ProgrammeTabs } from "./ProgrammeTabs";
import { village } from "@/content/conference";
import { CONFERENCE_BASE, conferenceDates, conferenceDay, formatDate, formatTime, isPitchSession } from "@/lib/site";
import { speakersFor } from "@/lib/speakers";
import { getPublicContent } from "@/server/content/repository";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { conference } = (await getPublicContent(locale)).settings;
  const dates = conferenceDates(conference, locale);
  return pageMetadata(locale, {
    path: `${CONFERENCE_BASE}/programme`,
    title: t("Programme EBC2026", "EBC2026 Program"),
    description: t(
      `Programme provisoire de la conférence EBC2026, ${dates} à ${conference.city}.`,
      `Preliminary program for the EBC2026 conference in ${conference.city}, ${dates}.`,
    ),
  });
}

export default async function ProgrammePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { settings, collections } = await getPublicContent(locale);
  const { conference } = settings;
  const dates = conferenceDates(conference, locale);
  const { open, close } = village.hours;
  const sessions = collections.programme.filter((s) => s.kind !== "Pause");
  const highlights = collections.programme.filter((s) => s.highlight);
  const days = ["1", "2"].map((day, i) => ({
    label: t(`Jour ${i + 1}`, `Day ${i + 1}`),
    date: formatDate(conferenceDay(conference, i), { weekday: "long", day: "numeric", month: "long" }, locale),
    // Intervenants du back-office rattachés à chaque créneau (par l'intitulé français de la session)
    slots: collections.programme
      .filter((s) => s.day === day)
      .map((s) => ({
        ...s,
        // Les points d'une session citent déjà ses intervenants
        speaker:
          s.points.length > 0
            ? ""
            : speakersFor(s.key, collections.speakers)
                .map((sp) => (sp.demo ? t(`${sp.name} (exemple)`, `${sp.name} (example)`) : sp.name))
                .join(", ") ||
              s.speaker ||
              (isPitchSession(s) ? collections.inventors.map((inv) => inv.owner).join(", ") : ""),
      })),
  }));

  return (
    <>
      <PageHero
        label={t("Programme provisoire", "Preliminary program")}
        crumbs={[
          { href: CONFERENCE_BASE, label: "EBC2026" },
          { href: `${CONFERENCE_BASE}/programme`, label: t("Programme", "Program") },
        ]}
        title={t("Deux jours de sessions et", "Two days of sessions and")}
        highlight={t("un village d'exposition", "an exhibition village")}
        lead={t(
          "Cérémonie d'ouverture, pitchs des projets étudiants et des Top 5 Inventeurs, sessions thématiques et cérémonie des Awards. Le village d'exposition est ouvert en continu les deux jours.",
          "Opening ceremony, pitches from student projects and the Top 5 Inventors, thematic sessions and the awards ceremony. The exhibition village is open throughout both days.",
        )}
        stats={[
          { value: t("2 jours", "2 days"), label: dates },
          { value: String(sessions.length), label: t("sessions et temps d'échange", "sessions and discussions") },
          { value: String(highlights.length), label: t("temps forts", "highlights") },
        ]}
        aside={
          <InfoTable
            rows={[
              { icon: "calendar", term: t("Dates", "Dates"), value: dates },
              { icon: "clock", term: t("Stands", "Booths"), value: t(`Ouverts de ${formatTime(open, locale)} à ${formatTime(close, locale)}`, `Open ${open} – ${close}`) },
              { icon: "pin", term: t("Lieu", "Venue"), value: `${conference.venue}, ${conference.city}` },
            ]}
          />
        }
      />
      <Section
        label={t("Programme détaillé", "Detailed program")}
        title={t("Jour par jour, heure par heure.", "Day by day, hour by hour.")}
        intro={t(
          "Programme provisoire, susceptible d'ajustements. Les noms des intervenants seront publiés après confirmation.",
          "Preliminary program, subject to change. Speaker names will be published once confirmed.",
        )}
        more={{ href: `${CONFERENCE_BASE}/intervenants`, label: t("Les intervenants", "Meet the speakers") }}
      >
        <ProgrammeTabs days={days} />
        <div className="mt-14">
          <Callout
            text={t(`Rendez-vous à ${conference.city}.`, `See you in ${conference.city}.`)}
            sub={`${dates}, ${conference.hours}, ${conference.venue}.`}
          >
            <a href={conference.mapsUrl} target="_blank" rel="noopener" className="btn btn-primary">
              {t("Itinéraire", "Directions")}
              <Icon name="arrow-up-right" className="size-4" />
            </a>
            <Link href={`${CONFERENCE_BASE}/intervenants`} className="btn btn-line">
              {t("Les intervenants", "Meet the speakers")}
            </Link>
          </Callout>
        </div>
      </Section>
    </>
  );
}
