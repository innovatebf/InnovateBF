"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Home,
  FileText,
  Megaphone,
  CalendarDays,
  Globe,
  LogIn,
  Menu,
  X,
  User,
  PlusCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRole } from "@/lib/auth/hooks";

export function IENavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("innovons.nav");
  const { isAuthenticated, can } = useRole();

  const navItems = [
    { key: "home", href: "/innovons", icon: Home },
    { key: "needs", href: "/innovons/besoins", icon: FileText },
    { key: "calls", href: "/innovons/appels", icon: Megaphone },
    { key: "conference", href: "/innovons/conference", icon: CalendarDays },
    { key: "observatoire", href: "/innovons/observatoire", icon: Globe },
  ];

  return (
    <nav
      className="sticky top-[72px] z-40 border-t border-white/10 bg-white/70 backdrop-blur-[16px] text-gray-800 shadow-[0_20px_40px_rgba(25,28,29,0.05)]"
      aria-label="Navigation InnovonsEnsembleLeFaso"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* -- Logo IE -- */}
          <Link href="/innovons" className="flex items-center gap-3 group">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-600 text-sm font-black text-white transition-opacity group-hover:opacity-90">
              IE
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight text-gray-900">
                InnovonsEnsembleLeFaso
              </p>
              <p className="text-[11px] text-gray-500">
                Innovation endogene&nbsp;•&nbsp;Burkina Faso
              </p>
            </div>
          </Link>

          {/* -- Desktop nav -- */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map(({ key, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(key)}
              </Link>
            ))}
          </div>

          {/* -- CTA + mobile toggle -- */}
          <div className="flex items-center gap-3">
            {can('editor') && (
              <Link
                href="/innovons/besoins/deposer"
                className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:inline-flex"
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                {t("submit") ?? "Deposer"}
              </Link>
            )}

            {isAuthenticated ? (
              <Link
                href="/innovons/mon-espace"
                className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600 lg:inline-flex"
              >
                <User className="size-4" aria-hidden="true" />
                {t("my_space") ?? "Mon espace"}
              </Link>
            ) : (
              <Link
                href="/innovons/connexion"
                className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600 lg:inline-flex"
              >
                <LogIn className="size-4" aria-hidden="true" />
                {t("login")}
              </Link>
            )}

            <button
              type="button"
              className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Basculer le menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* -- Mobile menu -- */}
      {mobileOpen && (
        <div className="bg-white/90 backdrop-blur-[16px] lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navItems.map(({ key, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(key)}
              </Link>
            ))}

            {can('editor') && (
              <Link
                href="/innovons/besoins/deposer"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                {t("submit") ?? "Deposer"}
              </Link>
            )}

            {isAuthenticated ? (
              <Link
                href="/innovons/mon-espace"
                className="mt-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
                onClick={() => setMobileOpen(false)}
              >
                <User className="size-4" aria-hidden="true" />
                {t("my_space") ?? "Mon espace"}
              </Link>
            ) : (
              <Link
                href="/innovons/connexion"
                className="mt-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn className="size-4" aria-hidden="true" />
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
