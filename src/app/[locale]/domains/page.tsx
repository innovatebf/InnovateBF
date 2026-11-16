import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Callout, Card, Cards, NumRows, PageHero, Section } from "@/components/ui";
import { analysis, domains } from "@/content/innovatebf";
import { localize, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: "/domains",
    title: t("Domaines d'action", "Action areas"),
    description: t(
      "Axes stratégiques d'InnovateBF pour promouvoir l'innovation technologique burkinabè.",
      "InnovateBF's strategic priorities to promote technological innovation in Burkina Faso.",
    ),
  });
}

// Pictogrammes et couleurs attribués dans l'ordre des domaines (collection du back-office)
const domainIcons = ["chart", "mic", "grid", "eye"];
const accents = ["blue", "orange", "green", "navy"] as const;
const blockerIcons = ["network", "graduation", "building"];

export default async function DomainsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { blockers, method } = localize(analysis, locale);
  const active = domains.filter((d) => d.href).length;
  return (
    <>
      <PageHero
        label={t("Domaines d'action", "Action areas")}
        crumbs={[{ href: "/domains", label: t("Domaines d'action", "Action areas") }]}
        title={t("Axes stratégiques pour promouvoir", "Strategic priorities to promote")}
        highlight={t("l'innovation technologique burkinabè", "technological innovation in Burkina Faso")}
        lead={t(
          "Du conseil aux décideurs jusqu'à la conférence EBC, les chantiers du think tank pour faire émerger des solutions technologiques endogènes.",
          "From advising decision-makers to the EBC conference, the think tank's initiatives to help indigenous technology solutions emerge.",
        )}
        actions={
          <>
            <a href="#axes" className="btn btn-primary">
              {t("Découvrir nos axes", "Explore our priorities")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </a>
            <Link href="/contact" className="btn btn-line">
              {t("Nous contacter", "Contact us")}
            </Link>
          </>
        }
        stats={[
          { value: String(domains.length), label: t("axes stratégiques", "strategic priorities") },
          { value: String(active), label: t("déjà en action", "already underway") },
          { value: String(method.length), label: t("étapes, de l'analyse à l'action", "steps, from analysis to action") },
        ]}
        photo={{ src: "/images/prototype-electronique.jpg", alt: t("Prototype électronique en cours de conception", "Electronic prototype under development"), position: "50% 40%" }}
        chips={[
          { icon: "compass", title: t("Conseil", "Consulting"), text: t("aux décideurs publics et privés", "for public and private decision-makers") },
          { icon: "spark", title: t("Solutions endogènes", "Indigenous solutions"), text: t("priorisées par leur impact", "prioritized by impact") },
        ]}
      />

      <Section id="axes" label={t("Nos axes", "Our priorities")} title={t("Quatre chantiers complémentaires.", "Four complementary initiatives.")}>
        <Cards cols={2}>
          {localize(domains, locale).map((d, i) => (
            <Card
              key={`${d.title}-${i}`}
              index={i}
              icon={domainIcons[i % domainIcons.length]}
              accent={accents[i % accents.length]}
              num={String(i + 1).padStart(2, "0")}
              title={d.title}
              text={d.text}
              href={d.href || undefined}
              foot={d.href ? t("En savoir plus", "Learn more") : undefined}
              footMuted={d.href ? undefined : t("Détails à venir", "Details to come")}
            />
          ))}
        </Cards>
      </Section>

      <Section
        label={t("Notre méthode", "Our method")}
        title={t("De l'analyse à l'action en trois étapes.", "From analysis to action in three steps.")}
        intro={t(
          "Une démarche structurée pour aider les décideurs à identifier, prioriser et lancer des solutions technologiques endogènes.",
          "A structured approach to help decision-makers identify, prioritize and launch indigenous technology solutions.",
        )}
        more={{ href: "/domains/analysis", label: t("Analyse, Concept et Conseil", "Analysis, Concept and Consulting") }}
        grey
      >
        <NumRows items={method.map((m) => ({ title: m.title, text: m.text }))} />
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
        <div className="mt-12">
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
            <Link href="/domains/analysis" className="btn btn-line">
              {t("Notre démarche", "Our approach")}
            </Link>
          </Callout>
        </div>
      </Section>
    </>
  );
}
