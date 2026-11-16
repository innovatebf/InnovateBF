import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Callout, Card, Cards, Chips, NumRows, PageHero, pageStyles, Quote, Section } from "@/components/ui";
import { analysis, expertise, thinkTank } from "@/content/innovatebf";
import { localize, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: "/domains/analysis",
    title: t("Analyse, Concept et Conseil", "Analysis, Concept and Consulting"),
    description: t(
      "InnovateBF accompagne les acteurs publics, privés et académiques de l'analyse à l'action pour prioriser des solutions technologiques endogènes.",
      "InnovateBF helps public, private and academic stakeholders prioritize indigenous technology solutions, from analysis to action.",
    ),
  });
}

const blockerIcons = ["network", "graduation", "building"];
// Pictogrammes repérés par l'intitulé français de l'expertise
const expertiseIcons: Record<string, string> = {
  "Intelligence artificielle": "spark",
  "Big Data": "grid",
  "Systèmes embarqués": "settings",
  IoT: "network",
  "Business intelligence": "chart",
  Cybersécurité: "lock",
};

export default async function AnalysisPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { vision } = localize(thinkTank, locale);
  const { challenge, obstacle, blockers, method } = localize(analysis, locale);
  return (
    <>
      <PageHero
        label={t("Domaine d'action", "Action area")}
        crumbs={[
          { href: "/domains", label: t("Domaines d'action", "Action areas") },
          { href: "/domains/analysis", label: t("Analyse, Concept et Conseil", "Analysis, Concept and Consulting") },
        ]}
        title={t("Analyse,", "Analysis,")}
        highlight={t("Concept et Conseil", "Concept and Consulting")}
        lead={t(
          "De l'analyse à l'action : aider les décideurs à identifier, prioriser et lancer des solutions technologiques endogènes.",
          "From analysis to action: helping decision-makers identify, prioritize and launch indigenous technology solutions.",
        )}
        actions={
          <>
            <Link href="/contact" className="btn btn-primary">
              {t("Nous contacter", "Contact us")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
            <Link href="/domains" className="btn btn-line">
              {t("Tous les domaines", "All action areas")}
            </Link>
          </>
        }
        stats={[
          { value: "< 24 h", label: t("objectif pour lancer le tri des projets", "target to start screening projects") },
          { value: String(method.length), label: t("étapes de la méthode", "steps in the method") },
        ]}
        photo={{ src: "/images/ingenieure-ordinateur.jpg", alt: t("Analyste au travail sur son ordinateur", "Analyst working at a computer"), position: "50% 30%" }}
        chips={[{ icon: "chart", title: t("Intelligence collective", "Collective intelligence"), text: t("structurée pour décider vite", "structured for fast decisions") }]}
      />

      <Section label={t("Le défi concret", "A real-world challenge")} grey>
        <Quote text={challenge} />
        <p className={pageStyles.bodyText} data-reveal>
          {obstacle}
        </p>
      </Section>

      <Section label={t("Pourquoi agir maintenant", "Why act now")} title={t("Trois blocages de l'écosystème technologique burkinabè.", "Three barriers in the Burkinabè technology ecosystem.")}>
        <Cards cols={3}>
          {blockers.map((b, i) => (
            <Card
              key={b.title}
              index={i}
              icon={blockerIcons[i % blockerIcons.length]}
              accent="orange"
              kicker={t(`Blocage 0${i + 1}`, `Barrier 0${i + 1}`)}
              title={b.title}
              text={b.text}
            />
          ))}
        </Cards>
      </Section>

      <Section label={t("Méthodologie", "Methodology")} title={t("De l'analyse à l'action en trois étapes.", "From analysis to action in three steps.")} grey>
        <NumRows items={method.map((m) => ({ title: m.title, text: m.text }))} />
      </Section>

      <Section label={t("Expertises techniques", "Technical expertise")} title={t("Des experts sur les technologies qui comptent.", "Experts in the technologies that matter.")}>
        <Chips items={expertise.map((e) => ({ label: localize(e, locale), icon: expertiseIcons[e.fr] ?? "spark" }))} />
      </Section>

      <Section label="Vision" grey>
        <Quote text={vision} caption={t("Hermann Bayala, janvier 2026", "Hermann Bayala, January 2026")} />
        <div className="mt-8">
          <Callout
            text={t(
              "Structures gouvernementales, entreprises, institutions : parlons de vos projets à prioriser.",
              "Government agencies, businesses, institutions: let's talk about the projects you need to prioritize.",
            )}
          >
            <Link href="/contact" className="btn btn-primary">
              {t("Nous contacter", "Contact us")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
          </Callout>
        </div>
      </Section>
    </>
  );
}
