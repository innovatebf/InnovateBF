"use client";

import { useState } from "react";
import { ExternalLink, Tag } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VeilleArticle {
  id: string;
  titre: string;
  source: string;
  url: string;
  categorie: string;
  date: string;
  resume: string;
  tags: string[];
  impact: string;
}

interface ImpactConfig {
  label: string;
  className: string;
}

interface ObservatoireClientProps {
  articles: VeilleArticle[];
  categories: string[];
  impactConfig: Record<string, ImpactConfig>;
  defaultImpact: ImpactConfig;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ObservatoireClient({
  articles,
  categories,
  impactConfig,
  defaultImpact,
}: ObservatoireClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredArticles =
    selectedCategory === "Tous"
      ? articles
      : articles.filter((a) => a.categorie === selectedCategory);

  return (
    <div>
      {/* ── Category filter tabs ── */}
      <div
        className="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filtrer par catégorie"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Article cards ── */}
      <ul className="space-y-4" role="list" aria-label="Articles de veille technologique">
        {filteredArticles.map((article) => {
          const impact = impactConfig[article.impact] ?? defaultImpact;

          return (
            <li
              key={article.id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700"
            >
              {/* Top row — category + impact badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-900/40 px-2.5 py-0.5 text-xs font-semibold text-green-400 border border-green-800/60">
                  {article.categorie}
                </span>
                <span
                  className={[
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    impact.className,
                  ].join(" ")}
                >
                  {impact.label}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-3 text-base font-bold leading-snug text-white">
                {article.titre}
              </h3>

              {/* Source + date */}
              <p className="mt-1 text-xs text-gray-500">
                {article.source}&nbsp;&middot;&nbsp;
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </p>

              {/* Summary */}
              <p className="mt-3 text-sm leading-relaxed text-gray-400 line-clamp-3">
                {article.resume}
              </p>

              {/* Tags */}
              <div
                className="mt-3 flex flex-wrap items-center gap-1.5"
                aria-label="Étiquettes"
              >
                <Tag className="size-3 shrink-0 text-gray-600" aria-hidden="true" />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Read link */}
              <div className="mt-4">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 transition-colors hover:text-green-300"
                >
                  Lire l&apos;article
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </li>
          );
        })}

        {filteredArticles.length === 0 && (
          <li className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-10 text-center text-sm text-gray-500">
            Aucun signal dans cette catégorie pour le moment.
          </li>
        )}
      </ul>
    </div>
  );
}
