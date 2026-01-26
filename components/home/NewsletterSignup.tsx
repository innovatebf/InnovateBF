"use client";

import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

export function NewsletterSignup() {
  const t = useTranslations("home");

  return (
    <section className="bg-gradient-to-br from-primary-600 to-secondary-600 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Mail className="mx-auto size-12 text-white" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("newsletter_title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-primary-100">
            {t("newsletter_subtitle")}
          </p>

          {/* Newsletter form (disabled for Phase 1) */}
          <div className="mt-10">
            <div className="flex max-w-md flex-col gap-4 sm:flex-row sm:gap-3 mx-auto">
              <input
                type="email"
                disabled
                placeholder={t("newsletter_placeholder")}
                className="min-w-0 flex-auto rounded-md border-0 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                disabled
                className="flex-none rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("newsletter_cta")}
              </button>
            </div>
            <p className="mt-4 text-sm text-primary-100">
              {t("newsletter_soon")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
