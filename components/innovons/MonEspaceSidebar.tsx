"use client";

import {
  LayoutDashboard,
  FileText,
  Lightbulb,
  User,
  ChevronLeft,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
}

const navItems: NavItem[] = [
  {
    href: "/innovons/mon-espace",
    icon: LayoutDashboard,
    labelKey: "nav_dashboard",
  },
  {
    href: "/innovons/mon-espace/besoins",
    icon: FileText,
    labelKey: "nav_besoins",
  },
  {
    href: "/innovons/mon-espace/propositions",
    icon: Lightbulb,
    labelKey: "nav_propositions",
  },
  {
    href: "/innovons/mon-espace/profil",
    icon: User,
    labelKey: "nav_profil",
  },
];

interface MonEspaceSidebarProps {
  userRole?: "UTILISATEUR" | "PARRAIN" | "INNOVATEUR" | "ADMINISTRATEUR";
}

export function MonEspaceSidebar({
  userRole = "UTILISATEUR",
}: MonEspaceSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("innovons.mon_espace");

  function isActive(href: string): boolean {
    if (href === "/innovons/mon-espace") {
      return pathname === "/innovons/mon-espace";
    }
    return pathname.startsWith(href);
  }

  const roleBadgeColors =
    userRole === "PARRAIN" || userRole === "INNOVATEUR"
      ? "bg-secondary-100 text-secondary-700"
      : userRole === "ADMINISTRATEUR"
        ? "bg-primary-100 text-primary-700"
        : "bg-gray-100 text-gray-600";

  const roleLabel =
    userRole === "PARRAIN"
      ? t("role_parrain")
      : userRole === "INNOVATEUR"
        ? t("role_innovateur")
        : userRole === "ADMINISTRATEUR"
          ? t("role_admin")
          : t("role_utilisateur");

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col bg-gray-50 text-gray-800 lg:flex"
      style={{ minHeight: "calc(100vh - 72px)" }}
    >
      {/* Header */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-600 text-xs font-black text-white">
            IE
          </div>
          <span className="text-sm font-bold text-gray-900">{t("nav_dashboard")}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Mon Espace">
        <ul className="space-y-1">
          {navItems.map(({ href, icon: Icon, labelKey }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back link */}
      <div className="px-3 py-3">
        <Link
          href="/innovons"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden="true" />
          {t("nav_back")}
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${roleBadgeColors}`}
        >
          {roleLabel}
        </span>
      </div>
    </aside>
  );
}
