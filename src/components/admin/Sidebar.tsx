"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { SIDEBAR_COOKIE } from "@/lib/admin/labels";
import { api } from "@/lib/api-client";

export type NavGroup = { title?: string; items: { href: string; label: string; icon: string; badge?: number }[] };

export function Sidebar({
  groups,
  user,
  initialCollapsed = false,
}: {
  groups: NavGroup[];
  user: { name: string; email: string; role: string };
  initialCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Ordinateur : barre complète ou réduite aux pictogrammes
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${SIDEBAR_COOKIE}=${collapsed ? "collapsed" : "expanded"}; Path=/admin; Max-Age=31536000; SameSite=Lax${secure}`;
  }, [collapsed]);

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  // Raccourci Ctrl+B (⌘+B sur Mac)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));
  const tip = (label: string) => (collapsed ? label : undefined);
  const toggleLabel = collapsed ? "Déplier le menu" : "Réduire le menu";

  return (
    <aside className="adm-side" data-collapsed={collapsed}>
      <div className="adm-side-head">
        <Link href="/admin" className="flex items-center gap-2.5" title={tip("Tableau de bord")}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
            <Image src="/logo-innovatebf-emblem.png" alt="" width={150} height={127} className="h-6 w-auto" />
          </span>
          <span className="adm-side-text font-[family-name:var(--font-sans)] text-lg font-bold text-white">Back-office</span>
        </Link>
        <button
          type="button"
          className="adm-icon-btn adm-side-toggle hidden text-white/70 hover:bg-white/10 hover:text-white lg:inline-flex"
          aria-expanded={!collapsed}
          aria-controls="adm-nav"
          aria-keyshortcuts="Control+B Meta+B"
          aria-label={toggleLabel}
          title={`${toggleLabel} (Ctrl+B)`}
          onClick={toggle}
        >
          <Icon name="sidebar" />
        </button>
        <button
          type="button"
          className="adm-icon-btn text-white hover:bg-white/10 hover:text-white lg:hidden"
          aria-expanded={open}
          aria-controls="adm-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <nav id="adm-nav" aria-label="Back-office" className={`${open ? "block" : "hidden"} mt-3 lg:block`}>
        {groups.map((g, i) => (
          <div key={g.title ?? i}>
            {g.title && <p className="adm-side-group">{g.title}</p>}
            <ul className="grid gap-0.5">
              {g.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="adm-navlink"
                    aria-current={isActive(item.href) ? "page" : undefined}
                    title={tip(item.badge ? `${item.label} (${item.badge})` : item.label)}
                  >
                    <Icon name={item.icon} className="size-[18px] shrink-0" />
                    <span className="adm-side-text flex-1 truncate">{item.label}</span>
                    {item.badge ? <span className="adm-badge-count">{item.badge}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="adm-side-user mt-6 border-t border-white/15 px-2 pt-4">
          <div className="adm-side-text">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-white/60">
              {user.email} · {user.role === "admin" ? "Administrateur" : "Éditeur"}
            </p>
          </div>
          <div className="adm-side-actions mt-3 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="adm-btn adm-btn-sm border-white/25 bg-transparent text-white hover:bg-white/10"
              title={tip("Voir le site")}
              aria-label="Voir le site"
            >
              <Icon name="external" className="size-4" /> <span className="adm-side-text">Voir le site</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="adm-btn adm-btn-sm border-white/25 bg-transparent text-white hover:bg-white/10"
              title={tip("Déconnexion")}
              aria-label="Déconnexion"
            >
              <Icon name="logout" className="size-4" /> <span className="adm-side-text">Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
