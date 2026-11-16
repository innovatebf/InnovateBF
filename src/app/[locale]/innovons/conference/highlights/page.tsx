import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Callout, Card, Cards, NumRows, PageHero, Section } from "@/components/ui";
import { conferenceImages, highlightMoments, highlightResults } from "@/content/conference";
import { localize, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { getPublicContent } from "@/server/content/repository";
import { CONFERENCE_BASE, conferenceDay, formatDate, formatTime, isPitchSession } from "@/lib/site";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: `${CONFERENCE_BASE}/highlights`,
    title: t("Highlights EBC2026", "EBC2026 Highlights"),
    description: t(
      "Top 5 Inventeurs, projets étudiants inter-structures, projets CITADEL, BSB et UNB, et temps forts d'EBC2026.",
      "Top 5 Inventors, cross-institution student projects, CITADEL, BSB and UNB projects, and EBC2026 highlights.",
    ),
  });
}

const resultIcons = ["trophy", "star", "graduation", "spark"];
const momentIcons = ["mic", "bulb", "medal"];
const accents = ["orange", "blue", "green", "navy"] as const;

export default async function HighlightsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { settings, collections } = await getPublicContent(locale);
  const { inventors } = collections;
  // Session de pitchs, d'après le programme (« le vendredi 27 novembre à 13 h 00 »)
  const pitch = collections.programme.find(isPitchSession);
  const pitchWhen = pitch
    ? `${formatDate(conferenceDay(settings.conference, Number(pitch.day) - 1), { weekday: "long", day: "numeric", month: "long" }, locale)} ${t("à", "at")} ${formatTime(pitch.time, locale)}`
    : "";
  const results = localize(highlightResults, locale);
  const moments = localize(highlightMoments, locale);
  const images = localize(conferenceImages, locale);
  return (
    <>
      <PageHero
        label="Highlights"
        crumbs={[
          { href: CONFERENCE_BASE, label: "EBC2026" },
          { href: `${CONFERENCE_BASE}/highlights`, label: "Highlights" },
        ]}
        title={t("Les résultats et", "The results and")}
        highlight={t("temps forts d'EBC2026", "highlights of EBC2026")}
        lead={t(
          "Inventions lauréates, projets étudiants inter-structures, résultats de CITADEL, BSB et UNB : ce qui sera présenté pendant les deux jours de la conférence.",
          "Top 5 inventions, cross-institution student projects and results from CITADEL, BSB and UNB: everything that will be presented over the two days of the conference.",
        )}
        stats={[
          { value: String(inventors.length), label: t("inventions lauréates", "Top 5 inventions") },
          { value: String(results.length), label: t("familles de résultats", "result categories") },
          { value: String(moments.length), label: t("temps forts", "highlights") },
        ]}
        photo={{ ...images.top5, position: "60% 40%" }}
        chips={[{ icon: "trophy", title: "Awards", text: t("inventeurs, projets étudiants, innovations", "inventors, student projects, innovations") }]}
      />

      <Section
        label={t("Top 5 Inventeurs", "Top 5 Inventors")}
        title={t("Des talents burkinabè qui innovent pour demain", "Burkinabè talent innovating for tomorrow")}
        intro={t(
          `Sélectionnées par le jury, les cinq inventions lauréates sont exposées pendant les deux jours et présentées en pitch${pitch ? ` lors de la session « ${pitch.title} », le ${pitchWhen}` : ""}. Les prix sont remis lors de la cérémonie des Awards.`,
          `Selected by the jury, the Top 5 inventions are on display throughout both days and pitched${pitch ? ` during the “${pitch.title}” session on ${pitchWhen}` : ""}. Prizes are awarded at the awards ceremony.`,
        )}
      >
        <NumRows
          items={inventors.map((inv) => ({
            title: inv.project,
            text: inv.pitch,
            meta: (
              <>
                <span>
                  <b>{inv.owner}</b>
                </span>
                <span>{inv.org}</span>
                <span>{inv.category}</span>
                {inv.link && (
                  <a href={inv.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:underline">
                    {t("Site du projet ↗", "Project website ↗")}
                  </a>
                )}
              </>
            ),
          }))}
        />
      </Section>

      <Section label={t("Résultats présentés", "Results presented")} title={t("Quatre familles de résultats exposées à EBC2026.", "Four categories of results showcased at EBC2026.")} grey>
        <Cards cols={4}>
          {results.map((r, i) => (
            <Card key={r.title} index={i} icon={resultIcons[i % resultIcons.length]} accent={accents[i % accents.length]} kicker={r.subtitle} title={r.title} list={r.items} />
          ))}
        </Cards>
      </Section>

      <Section label={t("Temps forts", "Highlights")} title={t("Au programme des deux journées.", "On the program for both days.")}>
        <Cards cols={3}>
          {moments.map((m, i) => (
            <Card key={m.title} index={i} icon={momentIcons[i % momentIcons.length]} num={`0${i + 1}`} kicker={t("Temps fort", "Highlight")} title={m.title} list={m.items} />
          ))}
        </Cards>
        <div className="mt-12">
          <Callout
            text={t("Venez découvrir les inventions sur les stands.", "Come discover the inventions at the booths.")}
            sub={t("Les lauréats exposent pendant les deux jours de la conférence.", "The laureates exhibit throughout both days of the conference.")}
          >
            <Link href={`${CONFERENCE_BASE}/expositions`} className="btn btn-primary">
              {t("Voir les expositions", "View the exhibitions")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
            <Link href={`${CONFERENCE_BASE}/programme`} className="btn btn-line">
              {t("Programme", "Program")}
            </Link>
          </Callout>
        </div>
      </Section>
    </>
  );
}
