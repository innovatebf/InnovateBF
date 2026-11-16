import type { Metadata } from "next";
import { CallButton } from "@/components/ebc";
import { Callout, Card, Cards, InfoTable, NumRows, PageHero, Section } from "@/components/ui";
import { callContent, objectives, themes } from "@/content/conference";
import { localize, translator } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { CONFERENCE_BASE, conferenceDates, formatDate, formatTime, isCallOpen } from "@/lib/site";
import { getPublicContent } from "@/server/content/repository";

const long = { day: "numeric", month: "long", year: "numeric" } as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { calendar } = (await getPublicContent(locale)).settings;
  const { intro } = localize(callContent, locale);
  const closes = formatDate(calendar.callCloses, long, locale);
  return pageMetadata(locale, {
    path: `${CONFERENCE_BASE}/appel-a-contributions`,
    title: t("Appel à contributions EBC'26", "EBC'26 Call for contributions"),
    description: t(`${intro} Clôture des candidatures le ${closes}.`, `${intro} Applications close on ${closes}.`),
  });
}

export default async function CallPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { conference, calendar } = (await getPublicContent(locale)).settings;
  const call = localize(callContent, locale);
  const open = isCallOpen(calendar);
  const closes = formatDate(calendar.callCloses, long, locale);
  const deadline = t(`${closes} à ${formatTime("23:59", locale)}`, `${closes}, at ${formatTime("23:59", locale)}`);
  const notOpen = t("L'appel n'est pas ouvert actuellement.", "The call is not currently open.");
  return (
    <>
      <PageHero
        label={
          open
            ? t("Appel à projets ouvert · candidature gratuite", "Open call for projects · free to apply")
            : t("Candidatures closes", "Applications closed")
        }
        crumbs={[
          { href: CONFERENCE_BASE, label: "EBC2026" },
          { href: `${CONFERENCE_BASE}/appel-a-contributions`, label: t("Appel à contributions", "Call for contributions") },
        ]}
        title={t("Candidature", "EBC'26 project")}
        highlight={t("Projets EBC'26", "application")}
        lead={call.intro}
        actions={
          <>
            <CallButton open={open} />
            <a href="#dossier" className="btn btn-line">
              {t("Le dossier en 7 étapes", "The 7-step application")}
            </a>
          </>
        }
        stats={[
          { value: String(call.categories.length), label: t("catégories d'Awards", "Award categories") },
          { value: String(call.domains.length), label: t("domaines d'application", "application domains") },
          { value: t("Gratuit", "Free"), label: t("individuel ou en équipe", "individuals or teams") },
        ]}
        aside={
          <InfoTable
            rows={[
              { icon: "check", term: t("Statut", "Status"), value: open ? t("Appel ouvert", "Call open") : notOpen },
              { icon: "calendar", term: t("Ouverture", "Opens"), value: formatDate(calendar.callOpens, long, locale) },
              { icon: "clock", term: t("Clôture", "Closes"), value: deadline },
              { icon: "trophy", term: t("Awards", "Awards"), value: `${conferenceDates(conference, locale)}, ${conference.city}` },
            ]}
          />
        }
      />

      <Section label={t("Objectifs et axes", "Objectives and themes")} grey>
        <Cards cols={2}>
          <Card
            index={0}
            icon="trophy"
            accent="orange"
            kicker={t("Objectifs", "Objectives")}
            title={t("Ce que valorise le concours", "What the competition values")}
            list={localize(objectives, locale)}
          />
          <Card
            index={1}
            icon="grid"
            kicker={t("Axes thématiques", "Thematic areas")}
            title={t("Six axes de la conférence", "Six conference themes")}
            list={localize(themes, locale)}
          />
        </Cards>
      </Section>

      <Section
        label={t("Éligibilité", "Eligibility")}
        title={t("Qui peut candidater, et dans quelles catégories.", "Who can apply, and in which categories.")}
      >
        <Cards cols={3}>
          <Card
            index={0}
            icon="users"
            accent="green"
            kicker={t("Qui peut candidater ?", "Who can apply?")}
            title={t("Porteurs de projet", "Project leads")}
            list={call.eligible}
          />
          <Card
            index={1}
            icon="compass"
            kicker={t("Domaines fonctionnels", "Functional domains")}
            title={t("Secteurs d'application", "Application sectors")}
            list={call.domains}
          />
          <Card
            index={2}
            icon="medal"
            accent="orange"
            kicker={t("Catégories", "Categories")}
            title={t("Catégories des Awards", "Award categories")}
            list={call.categories}
          />
        </Cards>
      </Section>

      <Section
        id="dossier"
        label={t("Le dossier", "The application")}
        title={t("Un formulaire en sept étapes.", "A seven-step form.")}
        intro={call.files}
        grey
      >
        <NumRows items={call.steps.map((s) => ({ title: s.title, text: s.text }))} />
      </Section>

      <Section label={t("Évaluation", "Evaluation")} title={t("Critères de sélection", "Selection criteria")} intro={call.criteriaNote}>
        <Cards cols={3}>
          {call.criteria.map((c, i) => (
            <Card key={c} index={i} num={String(i + 1).padStart(2, "0")} title={c} />
          ))}
        </Cards>
        <div className="mt-12">
          <Callout
            text={open ? t("Prêt à présenter votre innovation ?", "Ready to present your innovation?") : notOpen}
            sub={
              open
                ? t(`Clôture des candidatures le ${deadline}. La candidature est gratuite.`, `Applications close on ${deadline}. Applying is free of charge.`)
                : undefined
            }
          >
            <CallButton open={open} />
          </Callout>
        </div>
      </Section>
    </>
  );
}
