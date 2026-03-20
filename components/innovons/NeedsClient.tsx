"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Search,
  X,
  Filter,
  ArrowRight,
  Users,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Need, NeedLevel, ResultatHorizon, NeedFilters } from "@/lib/innovons/types";
import { DOMAINES, TAGS } from "@/lib/innovons/mock-data";

// ── Props ───────────────────────────────────────────────────────────────────

interface NeedsClientProps {
  initialNeeds: Need[];
  locale: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function maxCriticite(need: Need): 1 | 2 | 3 {
  if (need.obstacles.length === 0) return 1;
  return Math.max(...need.obstacles.map((o) => o.criticite)) as 1 | 2 | 3;
}

const NIVEAUX: NeedLevel[] = ["LOCAL", "NATIONAL", "REGIONAL", "INTERNATIONAL"];
const HORIZONS: ResultatHorizon[] = ["COURT", "MOYEN", "LONG"];

const DEFAULT_FILTERS: NeedFilters = {
  search: "",
  domaines: [],
  secteurs: [],
  niveaux: [],
  horizons: [],
  tags: [],
  criticite: [],
};

// ── Criticite badge ─────────────────────────────────────────────────────────

function CriticiteBadge({ level }: { level: 1 | 2 | 3 }) {
  const colors = {
    1: "bg-secondary-50 text-secondary-600 border-secondary-200",
    2: "bg-amber-50 text-amber-700 border-amber-200",
    3: "bg-red-50 text-primary-600 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${colors[level]}`}
    >
      <AlertTriangle className="size-3" aria-hidden="true" />
      C{level}
    </span>
  );
}

// ── Need Card ───────────────────────────────────────────────────────────────

function NeedCard({ need, locale }: { need: Need; locale: string }) {
  const t = useTranslations("innovons.besoins");
  const crit = maxCriticite(need);

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: domaine + niveau */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs font-semibold text-secondary-600">
          {need.domaine}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {need.niveau}
        </span>
        <CriticiteBadge level={crit} />
      </div>

      {/* Titre */}
      <h3 className="mt-3 text-base font-semibold leading-snug text-gray-900">
        {need.titre}
      </h3>

      {/* Question centrale tronquee */}
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
        {need.question_centrale}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {need.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer: stats + date + lien */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {formatPopulation(need.population_impact)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" aria-hidden="true" />
            {formatDate(need.published_at, locale)}
          </span>
        </div>
        <Link
          href={`/innovons/besoins/${need.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-secondary-600 transition-colors hover:text-secondary-700"
        >
          {t("consult")}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

// ── Filter Section (collapsible) ────────────────────────────────────────────

function FilterSection({
  title,
  open,
  toggle,
  children,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-700"
      >
        {title}
        {open ? (
          <ChevronUp className="size-4 text-gray-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-4 text-gray-400" aria-hidden="true" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

// ── Checkbox Group ──────────────────────────────────────────────────────────

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="size-4 rounded border-gray-300 text-secondary-600 focus:ring-secondary-600"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function NeedsClient({ initialNeeds, locale }: NeedsClientProps) {
  const t = useTranslations("innovons.besoins");
  const [filters, setFilters] = useState<NeedFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    domaine: true,
    niveau: true,
    tags: false,
    horizon: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.length > 0 ||
      filters.domaines.length > 0 ||
      filters.niveaux.length > 0 ||
      filters.tags.length > 0 ||
      filters.horizons.length > 0
    );
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // ── Filter logic ────────────────────────────────────────────────────────

  const filteredNeeds = useMemo(() => {
    return initialNeeds.filter((need) => {
      // Text search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          need.titre.toLowerCase().includes(q) ||
          need.question_centrale.toLowerCase().includes(q) ||
          need.domaine.toLowerCase().includes(q) ||
          need.secteur.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Domaine
      if (filters.domaines.length > 0 && !filters.domaines.includes(need.domaine)) {
        return false;
      }

      // Niveau
      if (filters.niveaux.length > 0 && !filters.niveaux.includes(need.niveau)) {
        return false;
      }

      // Tags
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => need.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Horizon (check any resultat matches)
      if (filters.horizons.length > 0) {
        const hasHorizon = need.resultats.some((r) =>
          filters.horizons.includes(r.horizon)
        );
        if (!hasHorizon) return false;
      }

      return true;
    });
  }, [initialNeeds, filters]);

  // ── Filter panel content ────────────────────────────────────────────────

  const filterPanelContent = (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          placeholder={t("filter_search")}
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-secondary-600 focus:outline-none focus:ring-1 focus:ring-secondary-600"
        />
      </div>

      {/* Domaine */}
      <FilterSection
        title={t("filter_domaine")}
        open={openSections.domaine}
        toggle={() => toggleSection("domaine")}
      >
        <CheckboxGroup
          options={DOMAINES}
          selected={filters.domaines}
          onChange={(v) => setFilters((f) => ({ ...f, domaines: v }))}
        />
      </FilterSection>

      {/* Niveau */}
      <FilterSection
        title={t("filter_niveau")}
        open={openSections.niveau}
        toggle={() => toggleSection("niveau")}
      >
        <CheckboxGroup
          options={NIVEAUX}
          selected={filters.niveaux}
          onChange={(v) => setFilters((f) => ({ ...f, niveaux: v as NeedLevel[] }))}
        />
      </FilterSection>

      {/* Tags */}
      <FilterSection
        title={t("filter_tags")}
        open={openSections.tags}
        toggle={() => toggleSection("tags")}
      >
        <CheckboxGroup
          options={TAGS}
          selected={filters.tags}
          onChange={(v) => setFilters((f) => ({ ...f, tags: v }))}
        />
      </FilterSection>

      {/* Horizon */}
      <FilterSection
        title={t("filter_horizon")}
        open={openSections.horizon}
        toggle={() => toggleSection("horizon")}
      >
        <CheckboxGroup
          options={HORIZONS}
          selected={filters.horizons}
          onChange={(v) => setFilters((f) => ({ ...f, horizons: v as ResultatHorizon[] }))}
        />
      </FilterSection>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <X className="size-4" aria-hidden="true" />
          {t("filter_reset")}
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Result count + mobile filter button */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {t("results_count", { count: filteredNeeds.length })}
        </p>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 lg:hidden"
        >
          <Filter className="size-4" aria-hidden="true" />
          {t("filter_domaine")}
        </button>
      </div>

      <div className="flex gap-8">
        {/* ── Desktop filters panel ────────────────────────────────────── */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-40">
            {filterPanelContent}
          </div>
        </aside>

        {/* ── Mobile drawer ────────────────────────────────────────────── */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filtres</h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
              {filterPanelContent}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-6 w-full rounded-lg bg-secondary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary-700"
              >
                {t("results_count", { count: filteredNeeds.length })}
              </button>
            </div>
          </div>
        )}

        {/* ── Cards grid ───────────────────────────────────────────────── */}
        <div className="flex-1">
          {filteredNeeds.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {filteredNeeds.map((need) => (
                <NeedCard key={need.id} need={need} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="size-12 text-gray-300" aria-hidden="true" />
              <p className="mt-4 text-base font-medium text-gray-500">
                {t("no_results")}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-700"
                >
                  {t("filter_reset")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
