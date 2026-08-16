import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Trophy, CalendarCheck, MapPin, ArrowRight } from "lucide-react";

const AWARD_TRACKS = [
  "ia",
  "impact_societal",
  "startup_innovante",
  "jeune_innovateur",
] as const;

export function Ebc26FeaturedCard() {
  const t = useTranslations("home");
  const tAppel = useTranslations("candidatures.appel");
  const tCats = useTranslations("candidatures.categories");

  return (
    <section
      aria-label={tAppel("titre")}
      className="relative overflow-hidden bg-[#b70011] py-16 sm:py-20"
    >
      {/* Subtle radial decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 60%, rgba(255,255,255,.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(255,255,255,.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-center">
          {/* Left: Text content */}
          <div>
            {/* Live badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
              <Trophy className="size-3.5" aria-hidden="true" />
              {t("ebc26_badge")}
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              {tAppel("titre")}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 text-pretty">
              {tAppel("intro")}
            </p>

            {/* Event details */}
            <ul className="mt-6 space-y-2.5">
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
                {tAppel("conference")}
              </li>
            </ul>

            {/* Deadline */}
            <p className="mt-3 text-sm text-white/85">
              {t("ebc26_deadline")} &mdash; {tAppel("gratuit")}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={"/submit/ebc26/soumettre" as never}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#b70011] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {tAppel("cta_soumettre")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={"/submit/ebc26" as never}
                className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("ebc26_voir")}
              </Link>
            </div>
          </div>

          {/* Right: Award tracks */}
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/80">
              {t("ebc26_tracks_label")}
            </p>
            {AWARD_TRACKS.map((track) => (
              <div
                key={track}
                className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <span className="size-2 shrink-0 rounded-full bg-white/60" aria-hidden="true" />
                <span className="text-sm font-medium text-white">{tCats(track)}</span>
              </div>
            ))}
            <p className="mt-1 text-right text-xs text-white/80">{t("ebc26_et_plus")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
