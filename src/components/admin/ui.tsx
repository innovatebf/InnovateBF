import Link from "next/link";
import { Icon } from "@/components/Icon";

/** Éléments de présentation du back-office (sans état). */

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="adm-title">{title}</h1>
        {subtitle && <p className="adm-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="px-5 py-10 text-center text-[#6b746f]">{text}</p>;
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Ouagadougou" }).format(new Date(iso));
}

/** Recherche et pagination par paramètres d'URL (fonctionne sans JavaScript). */
export function ListToolbar({ q, placeholder, extra }: { q?: string; placeholder: string; extra?: React.ReactNode }) {
  return (
    <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
      <label className="relative min-w-[240px] flex-1 sm:max-w-sm">
        <span className="sr-only">Rechercher</span>
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b746f]" />
        <input name="q" defaultValue={q} placeholder={placeholder} maxLength={100} className="adm-input mt-0 pl-9" />
      </label>
      {extra}
      <button type="submit" className="adm-btn adm-btn-ghost">
        Rechercher
      </button>
    </form>
  );
}

export function Pager({ page, pageSize, total, base, query }: { page: number; pageSize: number; total: number; base: string; query: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const href = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) if (v) params.set(k, v);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `${base}?${s}` : base;
  };
  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#5b6560]">
      <span>
        {total} élément{total > 1 ? "s" : ""} · page {Math.min(page, pages)} sur {pages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className="adm-btn adm-btn-ghost adm-btn-sm">
            Précédente
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={href(page + 1)} className="adm-btn adm-btn-ghost adm-btn-sm">
            Suivante
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export const pageParam = (v: string | string[] | undefined) => Math.max(1, Math.min(10_000, Number.parseInt(String(v ?? "1"), 10) || 1));
export const textParam = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim().slice(0, 100) : undefined);
