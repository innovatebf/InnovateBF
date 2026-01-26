import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-2 text-sm text-white shadow-lg">
          <Lightbulb className="size-4" />
          <span>Innovation & Technologie Endogène</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl text-balance">
          {t("hero_title")}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 text-pretty">
          {t("hero_subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary-600 px-8 py-6 text-base font-semibold hover:bg-primary-700"
          >
            <Link href="/domains">
              {t("hero_cta")}
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 text-base font-semibold"
          >
            <Link href="/about">
              {tCommon("readMore")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative gradient */}
      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-accent-200 to-secondary-400 opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
}
