import Link from "next/link";
import { Icon } from "@/components/Icon";
import { localize } from "@/i18n";
import { APPLY_URL, CONFERENCE_BASE, conferencePages, formatDate, legalLinks, LONG_DATE, nav } from "@/lib/site";
import { AUDIENCE_PERIODS, type Audience as AudienceData, type AudienceDay, type AudienceRow } from "@/server/analytics";

/*
 * Audience du site (tableau de bord) : chiffres clés, visiteurs par jour,
 * pages, sources, appareils, langues et pays. Rendu serveur, sans JavaScript :
 * les infobulles du graphique s'ouvrent au survol et au clavier, et les
 * valeurs restent lisibles dans le tableau de données.
 */

const nf = new Intl.NumberFormat("fr-FR");
const compact = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });
const regions = new Intl.DisplayNames(["fr"], { type: "region" });

const PAGE_LABELS = new Map<string, string>([
  ...localize(nav, "fr").map((n) => [n.href, n.label] as const),
  ...localize(legalLinks, "fr").map((l) => [l.href, l.label] as const),
  ...localize(conferencePages, "fr").map((p) => [`${CONFERENCE_BASE}/${p.slug}`, `EBC2026 · ${p.label}`] as const),
  [CONFERENCE_BASE, "EBC2026 · Présentation"],
  [APPLY_URL, "EBC2026 · Candidature"],
  ["/domains/analysis", "Analyse, Concept et Conseil"],
]);

const DEVICES: Record<string, string> = { mobile: "Mobile", tablet: "Tablette", desktop: "Ordinateur" };
const LANGUAGES: Record<string, string> = { fr: "Français", en: "Anglais" };

const pageLabel = (path: string) => PAGE_LABELS.get(path) ?? path;
const sourceLabel = (key: string) => (!key ? "Accès direct ou inconnu" : key === "google" ? "Google" : key);
function countryLabel(code: string) {
  if (!code) return "Inconnu";
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
}

const shortDay = (day: string) => formatDate(day, { day: "numeric", month: "short" });
const longDay = (day: string) => formatDate(day, { weekday: "long", day: "numeric", month: "long" });
const plural = (n: number, one: string, many: string) => `${nf.format(n)} ${n > 1 ? many : one}`;

/** Évolution par rapport à la période précédente. */
function trend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? { text: "nouveau", tone: "up" as const } : null;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return { text: "stable", tone: "flat" as const };
  return { text: `${pct > 0 ? "+" : "−"}${Math.abs(pct)} %`, tone: pct > 0 ? ("up" as const) : ("down" as const) };
}

/** Haut de l'axe vertical arrondi, dont la moitié reste un nombre rond (120, 150, 200, 250…). */
function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  return [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((m) => m * p >= v)! * p;
}

function Kpi({ label, value, change, period, hint }: { label: string; value: string; change?: ReturnType<typeof trend>; period?: string; hint?: string }) {
  return (
    <div className="adm-card adm-card-pad">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6b746f]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-antonio)] text-4xl font-semibold text-[#0a3a8f]">{value}</p>
      {change && (
        <p className="aud-trend" data-tone={change.tone}>
          {change.tone !== "flat" && <Icon name={change.tone === "down" ? "down" : "up"} className="size-3.5" strokeWidth={2.4} />}
          <strong>{change.text}</strong>
          {period && <span>vs {period}</span>}
        </p>
      )}
      {hint && <p className="mt-1 text-[13px] text-[#6b746f]">{hint}</p>}
    </div>
  );
}

/** Compteur de visiteurs : ne dépend pas de la période choisie et reste affiché à zéro. */
export function VisitorCounter({ visitors, views, since }: AudienceData["allTime"]) {
  return (
    <div className="mb-8">
      <Kpi
        label="Compteur de visiteurs"
        value={nf.format(visitors)}
        hint={
          since
            ? `Depuis le ${formatDate(since, LONG_DATE)} · ${plural(views, "page vue", "pages vues")} · une personne revenue un autre jour compte à nouveau`
            : "Le compteur démarre à la première visite du site."
        }
      />
    </div>
  );
}

function DailyChart({ series }: { series: AudienceDay[] }) {
  const n = series.length;
  const max = niceMax(Math.max(...series.map((d) => d.visitors)));
  // Dates sous l'axe : une sur sept (une sur quinze sur 90 jours), en partant d'aujourd'hui
  const every = n <= 7 ? 1 : n <= 31 ? 7 : 15;
  return (
    <div className="aud-chart">
      <div className="aud-plot">
        <div className="aud-grid" aria-hidden="true">
          {[max, max / 2, 0].map((v) => (
            <span key={v}>
              <em>{compact.format(v)}</em>
            </span>
          ))}
        </div>
        <ol className="aud-bars" aria-label="Visiteurs par jour">
          {series.map((d, i) => (
            <li
              key={d.day}
              tabIndex={0}
              data-side={i < n / 3 ? "left" : i >= (2 * n) / 3 ? "right" : undefined}
              aria-label={`${longDay(d.day)} : ${plural(d.visitors, "visiteur", "visiteurs")}, ${plural(d.views, "page vue", "pages vues")}`}
            >
              <span className="aud-bar" style={{ height: `${(d.visitors / max) * 100}%` }} />
              <span className="aud-tip" aria-hidden="true">
                <strong>{plural(d.visitors, "visiteur", "visiteurs")}</strong>
                <span>{plural(d.views, "page vue", "pages vues")}</span>
                <span className="aud-tip-day">{longDay(d.day)}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <ol className="aud-x" aria-hidden="true">
        {series.map((d, i) => (
          <li key={d.day}>{(n - 1 - i) % every === 0 && <span>{i === n - 1 ? "Auj." : shortDay(d.day)}</span>}</li>
        ))}
      </ol>
      <details className="aud-data">
        <summary>Afficher les données du graphique</summary>
        <table className="adm-table mt-2">
          <thead>
            <tr>
              <th>Jour</th>
              <th className="text-right">Visiteurs</th>
              <th className="text-right">Pages vues</th>
            </tr>
          </thead>
          <tbody>
            {[...series].reverse().map((d) => (
              <tr key={d.day}>
                <td>{longDay(d.day)}</td>
                <td className="text-right tabular-nums">{nf.format(d.visitors)}</td>
                <td className="text-right tabular-nums">{nf.format(d.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

/** Classement (pages, sources…) : visiteurs avec barre de proportion, puis pages vues (visites pour les sources) ou part. */
function Ranking({
  title,
  rows,
  label,
  share,
  total,
  countLabel = "Pages vues",
}: {
  title: string;
  rows: AudienceRow[];
  label: (key: string) => string;
  share?: boolean;
  total: number;
  countLabel?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  return (
    <section className="adm-card adm-card-pad">
      <h3 className="text-[15px] font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-[13.5px] text-[#6b746f]">Pas encore de données.</p>
      ) : (
        <table className="aud-rank">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">{title}</span>
              </th>
              <th scope="col">Visiteurs</th>
              <th scope="col">{share ? "Part" : countLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td>
                  <span className="aud-rank-label">{label(r.key)}</span>
                  <span className="aud-meter" aria-hidden="true">
                    <span style={{ width: `${(r.visitors / max) * 100}%` }} />
                  </span>
                </td>
                <td>{nf.format(r.visitors)}</td>
                <td>{share ? `${Math.round((r.visitors / Math.max(1, total)) * 100)} %` : nf.format(r.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export function AudiencePanel({ data }: { data: AudienceData }) {
  const { totals, previous, days } = data;
  const period = `${days} jours précédents`;
  const perVisit = totals.visits ? (totals.views / totals.visits).toFixed(1).replace(".", ",") : "–";
  return (
    <section aria-labelledby="audience" className="mb-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="audience" className="text-lg font-semibold">
            Audience du site
          </h2>
          <p className="text-[13.5px] text-[#6b746f]">
            Du {formatDate(data.start, { day: "numeric", month: "long" })} au {formatDate(data.end, { day: "numeric", month: "long" })} · visiteurs uniques par jour, additionnés ·
            mesure sans cookie
          </p>
        </div>
        <nav aria-label="Période" className="aud-periods">
          {AUDIENCE_PERIODS.map((p) => (
            <Link key={p} href={p === 30 ? "/admin" : `/admin?periode=${p}`} aria-current={p === days ? "page" : undefined} scroll={false}>
              {p} jours
            </Link>
          ))}
        </nav>
      </div>

      {totals.views === 0 && previous.views === 0 ? (
        <div className="adm-card adm-card-pad text-[14.5px] text-[#5b6560]">
          Aucune visite enregistrée sur cette période. Les statistiques apparaîtront dès les premières visites du site (pages françaises et anglaises).
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Visiteurs" value={nf.format(totals.visitors)} change={trend(totals.visitors, previous.visitors)} period={period} />
            <Kpi label="Pages vues" value={nf.format(totals.views)} change={trend(totals.views, previous.views)} period={period} />
            <Kpi label="Pages par visite" value={perVisit} hint={`${plural(totals.visits, "visite", "visites")} sur la période`} />
            <Kpi label="Aujourd'hui" value={nf.format(data.today.visitors)} hint={plural(data.today.views, "page vue", "pages vues")} />
          </div>

          <section className="adm-card adm-card-pad mt-4">
            <h3 className="text-[15px] font-semibold">Visiteurs par jour</h3>
            <DailyChart series={data.series} />
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Ranking title="Pages les plus consultées" rows={data.pages} label={pageLabel} total={totals.visitors} />
            <Ranking title="D'où viennent les visiteurs" rows={data.sources} label={sourceLabel} total={totals.visitors} countLabel="Visites" />
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-3">
              <Ranking title="Appareils" rows={data.devices} label={(k) => DEVICES[k] ?? k} share total={totals.visitors} />
              <Ranking title="Langue du site" rows={data.locales} label={(k) => LANGUAGES[k] ?? k} share total={totals.visitors} />
              <Ranking title="Pays" rows={data.countries} label={countryLabel} share total={totals.visitors} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
