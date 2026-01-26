import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* À propos */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="InnovateBF Logo"
                width={40}
                height={50}
                className="h-10 w-auto"
              />
              <h3 className="text-lg font-bold text-gray-900">InnovateBF</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{t("description")}</p>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {t("links_title")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  {tCommon("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  {tCommon("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/domains"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  {tCommon("domains")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  {tCommon("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {t("legal_title")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t("legal")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            {t("copyright").replace("2026", currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
