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
} from "lucide-react";
import { useTranslations } from "next-intl";

export function IENavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("innovons.nav");

  const navItems = [
    { key: "home", href: "/innovons", icon: Home },
    { key: "needs", href: "/innovons/besoins", icon: FileText },
    { key: "calls", href: "/innovons/appels", icon: Megaphone },
    { key: "conference", href: "/innovons/conference", icon: CalendarDays },
    { key: "observatoire", href: "/innovons/observatoire", icon: Globe },
  ];

  return (
    <nav
      className="sticky top-[72px] z-40 border-b border-white/10 bg-gray-900 text-white shadow-md"
      aria-label="Navigation InnovonsEnsembleLeFaso"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* ── Logo IE ── */}
          <Link href="/innovons" className="flex items-center gap-3 group">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-600 text-sm font-black text-white transition-colors group-hover:bg-green-500">
              IE
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight text-white">
                InnovonsEnsembleLeFaso
              </p>
              <p className="text-[11px] text-gray-400">
                Innovation endogène&nbsp;•&nbsp;Burkina Faso
              </p>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map(({ key, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(key)}
              </Link>
            ))}
          </div>

          {/* ── CTA + mobile toggle ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/innovons/connexion"
              className="hidden items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-500 lg:inline-flex"
            >
              <LogIn className="size-4" aria-hidden="true" />
              {t("login")}
            </Link>

            <button
              type="button"
              className="rounded-md p-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white lg:hidden"
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

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-gray-900 lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navItems.map(({ key, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(key)}
              </Link>
            ))}

            <Link
              href="/innovons/connexion"
              className="mt-2 flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-500"
              onClick={() => setMobileOpen(false)}
            >
              <LogIn className="size-4" aria-hidden="true" />
              {t("login")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
