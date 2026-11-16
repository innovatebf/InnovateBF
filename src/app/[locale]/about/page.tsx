import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Callout, Card, Cards, Chips, LogoTile, PageHero, pageStyles, Quote, Section, Split } from "@/components/ui";
import { domains, expertise, levers, thinkTank } from "@/content/innovatebf";
import { localize, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { CONFERENCE_BASE } from "@/lib/site";
import { getPublicContent } from "@/server/content/repository";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: "/about",
    title: t("À propos", "About"),
    description: t(
      "Vision et mission d'InnovateBF, think tank pour la promotion de la technologie endogène au Burkina Faso.",
      "The vision and mission of InnovateBF, a think tank dedicated to promoting indigenous technology in Burkina Faso.",
    ),
  });
}

const leverIcons = ["search", "compass", "network", "graduation"];
const leverAccents = ["blue", "orange", "green", "navy"] as const;
// Pictogrammes repérés par l'intitulé français de l'expertise
const expertiseIcons: Record<string, string> = {
  "Intelligence artificielle": "spark",
  "Big Data": "grid",
  "Systèmes embarqués": "settings",
  IoT: "network",
  "Business intelligence": "chart",
  Cybersécurité: "lock",
};

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { settings } = await getPublicContent(locale);
  const { vision, visionCaption, mission, presentation, logo } = localize(thinkTank, locale);
  return (
    <>
      <PageHero
        label={t("À propos", "About")}
        crumbs={[{ href: "/about", label: t("À propos", "About") }]}
        title={t("La technologie endogène, moteur du", "Indigenous technology, driving")}
        highlight={t("développement durable du Burkina Faso", "sustainable development in Burkina Faso")}
        lead={presentation}
        actions={
          <>
            <Link href="/domains" className="btn btn-primary">
              {t("Nos domaines d'action", "Our action areas")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
            <Link href="/contact" className="btn btn-line">
              {t("Nous contacter", "Contact us")}
            </Link>
          </>
        }
        stats={[
          { value: String(levers.length), label: t("leviers d'action", "levers for action") },
          { value: String(expertise.length), label: t("expertises clés", "key areas of expertise") },
          { value: settings.conference.name, label: t("conférence annuelle", "annual conference") },
        ]}
        photo={{ src: "/images/ingenieure-laboratoire.jpg", alt: t("Ingénieure au travail dans un laboratoire", "Engineer at work in a laboratory"), position: "50% 35%" }}
        chips={[
          { icon: "bulb", title: "Think tank", text: t("Association apolitique et sans but lucratif", "Nonpartisan, nonprofit association") },
          { icon: "network", title: t("Expertise nationale", "National expertise"), text: t("et de la diaspora", "and the diaspora") },
        ]}
      />

      <Section label={t("Qui sommes-nous", "Who we are")} title={t("Fédérer les compétences pour faire émerger des solutions burkinabè.", "Bringing skills together to help Burkinabè solutions emerge.")}>
        <Split
          reverse
          side={logo.src ? <LogoTile src={logo.src} alt={logo.alt} width={300} height={316} /> : null}
          main={
            <div data-reveal>
              <p className={pageStyles.bodyText} style={{ marginTop: 0 }}>
                {mission}
              </p>
              <p className={pageStyles.bodyText}>
                {t(
                  `InnovateBF co-organise la conférence ${settings.conference.name} avec ses partenaires, dont l'Université Nazi BONI : un rendez-vous pour révéler les inventeurs et relier recherche, entreprises et institutions.`,
                  `InnovateBF co-organizes the ${settings.conference.name} conference with its partners, including Nazi BONI University: an event to spotlight inventors and connect research, businesses and institutions.`,
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={CONFERENCE_BASE} className="btn btn-primary">
                  {t(`Découvrir ${settings.conference.name}`, `Discover ${settings.conference.name}`)}
                  <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
                </Link>
                <Link href="/domains/analysis" className="btn btn-line">
                  {t("Analyse, Concept et Conseil", "Analysis, Concept and Consulting")}
                </Link>
              </div>
            </div>
          }
        />
      </Section>

      <Section label="Vision" grey>
        <Quote text={vision} caption={visionCaption} />
      </Section>

      <Section label="Mission" title={t("Quatre leviers pour faire progresser l'innovation endogène.", "Four levers to advance indigenous innovation.")}>
        <Cards cols={4}>
          {localize(levers, locale).map((l, i) => (
            <Card
              key={l.title}
              index={i}
              icon={leverIcons[i % leverIcons.length]}
              accent={leverAccents[i % leverAccents.length]}
              num={String(i + 1).padStart(2, "0")}
              title={l.title}
              text={l.text}
            />
          ))}
        </Cards>
      </Section>

      <Section
        label={t("Expertises", "Expertise")}
        title={t("Des compétences au cœur des technologies clés.", "Skills at the heart of key technologies.")}
        intro={t(
          "InnovateBF mobilise des experts nationaux et de la diaspora sur les technologies qui transforment l'économie et les services publics.",
          "InnovateBF mobilizes national and diaspora experts in the technologies that are transforming the economy and public services.",
        )}
        grey
      >
        <Chips items={expertise.map((e) => ({ label: localize(e, locale), icon: expertiseIcons[e.fr] ?? "spark" }))} />
      </Section>

      {domains.length > 0 && (
        <Section
          label={t("Domaines d'action", "Action areas")}
          title={t("Nos chantiers pour l'innovation endogène.", "Our initiatives for indigenous innovation.")}
          more={{ href: "/domains", label: t("Tous les domaines", "All action areas") }}
        >
          <Cards cols={4}>
            {localize(domains, locale).map((d, i) => (
              <Card
                key={`${d.title}-${i}`}
                index={i}
                num={String(i + 1).padStart(2, "0")}
                title={d.title}
                text={d.text}
                href={d.href || undefined}
                foot={d.href ? t("En savoir plus", "Learn more") : undefined}
                footMuted={d.href ? undefined : t("Détails à venir", "Details to come")}
              />
            ))}
          </Cards>
          <div className="mt-12">
            <Callout
              text={t("Un projet, un besoin d'expertise ?", "Have a project or need expertise?")}
              sub={t(
                "Décideurs publics, entreprises, institutions : parlons de vos projets technologiques à prioriser.",
                "Public decision-makers, businesses, institutions: let's talk about the technology projects you need to prioritize.",
              )}
            >
              <Link href="/contact" className="btn btn-primary">
                {t("Nous contacter", "Contact us")}
                <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
              </Link>
              <Link href="/domains" className="btn btn-line">
                {t("Nos domaines d'action", "Our action areas")}
              </Link>
            </Callout>
          </div>
        </Section>
      )}
    </>
  );
}
