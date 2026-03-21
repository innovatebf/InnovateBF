"use client";

import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  Megaphone,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: "/innovons/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/innovons/admin/moderation",
    icon: ClipboardList,
    label: "File de moderation",
  },
  {
    href: "/innovons/admin/besoins",
    icon: CheckCircle2,
    label: "Besoins publies",
  },
  {
    href: "/innovons/admin/appels",
    icon: Megaphone,
    label: "Appels",
  },
  {
    href: "/innovons/admin/parametres",
    icon: Settings,
    label: "Parametres",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/innovons/admin") {
      return pathname === "/innovons/admin";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col bg-gray-900 text-white lg:flex"
      style={{ minHeight: "calc(100vh - 72px)" }}
    >
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-600 text-xs font-black text-white">
            IE
          </div>
          <span className="text-sm font-bold text-green-400">
            Administration IE
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Administration">
        <ul className="space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-l-2 border-green-500 bg-green-600/20 text-green-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back link */}
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/innovons"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden="true" />
          Retour plateforme
        </Link>
      </div>

      {/* Role badge */}
      <div className="border-t border-white/10 px-4 py-4">
        <span className="inline-flex items-center rounded-full bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400">
          ADMIN
        </span>
      </div>
    </aside>
  );
}
