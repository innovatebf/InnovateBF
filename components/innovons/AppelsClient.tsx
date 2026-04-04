"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Clock, FileText, Filter } from "lucide-react";
import { ProposalFormModal } from "./ProposalFormModal";

type AppelStatus = "OUVERT" | "FERME" | "SELECTIONNE";

interface Appel {
  id: string;
  need_id: string;
  titre: string;
  domaine: string;
  description: string;
  budget: number;
  deadline: string;
  statut: AppelStatus;
  proposalsCount: number;
}

interface Translations {
  budget: string;
  propose: string;
  filter_status: string;
  filter_domain: string;
  filter_deadline: string;
  all_statuses: string;
  all_domains: string;
  status_open: string;
  status_closed: string;
  status_selected: string;
  cta_title: string;
  cta_desc: string;
  cta_button: string;
}

interface AppelsClientProps {
  appels: Appel[];
  budgetTotal: number;
  domainesUniques: number;
  translations: Translations;
}

function formatBudgetFCFA(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} Mds FCFA`;
  if (amount >= 1_000_000) return `${Math.round(amount / 1_000_000)} M FCFA`;
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

function getDaysLeft(deadline: string): number {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getStatusBadgeClasses(status: AppelStatus): string {
  switch (status) {
    case "OUVERT":    return "bg-secondary-100 text-secondary-700";
    case "FERME":     return "bg-gray-100 text-gray-600";
    case "SELECTIONNE": return "bg-blue-100 text-blue-800";
  }
}

export function AppelsClient({ appels, budgetTotal, domainesUniques, translations: t }: AppelsClientProps) {
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterDomaine, setFilterDomaine] = useState("all");
  const [filterDeadline, setFilterDeadline] = useState("");
  const [modalAppel, setModalAppel] = useState<Appel | null>(null);

  const allDomaines = useMemo(
    () => Array.from(new Set(appels.map((a) => a.domaine))).filter(Boolean).sort(),
    [appels]
  );

  const filtered = useMemo(() => {
    return appels.filter((a) => {
      if (filterStatut !== "all" && a.statut !== filterStatut) return false;
      if (filterDomaine !== "all" && a.domaine !== filterDomaine) return false;
      if (filterDeadline && a.deadline > filterDeadline) return false;
      return true;
    });
  }, [appels, filterStatut, filterDomaine, filterDeadline]);

  const getStatusLabel = (status: AppelStatus) => {
    switch (status) {
      case "OUVERT":      return t.status_open;
      case "FERME":       return t.status_closed;
      case "SELECTIONNE": return t.status_selected;
    }
  };

  return (
    <>
      {/* Modal */}
      {modalAppel && (
        <ProposalFormModal
          appel={modalAppel}
          isOpen={true}
          onClose={() => setModalAppel(null)}
        />
      )}

      {/* Main content */}
      <section className="bg-gray-50 px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Cards */}
            <div className="space-y-6">
              {filtered.length === 0 ? (
                <div className="rounded-xl bg-white py-16 text-center text-gray-400 shadow-sm">
                  Aucun appel ne correspond à vos filtres.
                </div>
              ) : (
                filtered.map((appel) => {
                  const daysLeft = getDaysLeft(appel.deadline);
                  const isOpen = appel.statut === "OUVERT";

                  return (
                    <article
                      key={appel.id}
                      className="overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_rgba(25,28,29,0.05)] transition-shadow hover:shadow-[0_20px_40px_rgba(25,28,29,0.10)]"
                    >
                      <div className="p-6">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClasses(appel.statut)}`}>
                            {getStatusLabel(appel.statut)}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            {appel.domaine}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{appel.titre}</h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                          {appel.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                          {appel.budget > 0 && (
                            <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                              <span className="text-secondary-600">{t.budget} :</span>
                              {formatBudgetFCFA(appel.budget)}
                            </div>
                          )}

                          {isOpen && appel.deadline && (
                            <div className="flex items-center gap-1.5 text-amber-600">
                              <Clock className="size-4" aria-hidden="true" />
                              <span>{daysLeft}j restants</span>
                            </div>
                          )}

                          {appel.proposalsCount > 0 && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <FileText className="size-4" aria-hidden="true" />
                              <span>{appel.proposalsCount} proposition(s)</span>
                            </div>
                          )}
                        </div>

                        {isOpen && (
                          <div className="mt-5">
                            <button
                              onClick={() => setModalAppel(appel)}
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
                            >
                              {t.propose}
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-xl bg-white p-5 shadow-[0_20px_40px_rgba(25,28,29,0.05)]">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Filter className="size-4" aria-hidden="true" />
                  Filtres
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {t.filter_status}
                  </label>
                  <select
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                    className="w-full rounded-lg bg-[#e8eaeb] px-3 py-2 text-sm text-gray-700 outline-none focus:bg-[#f1f3f4] focus:ring-2 focus:ring-[#b70011]/20"
                  >
                    <option value="all">{t.all_statuses}</option>
                    <option value="OUVERT">{t.status_open}</option>
                    <option value="FERME">{t.status_closed}</option>
                    <option value="SELECTIONNE">{t.status_selected}</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {t.filter_domain}
                  </label>
                  <select
                    value={filterDomaine}
                    onChange={(e) => setFilterDomaine(e.target.value)}
                    className="w-full rounded-lg bg-[#e8eaeb] px-3 py-2 text-sm text-gray-700 outline-none focus:bg-[#f1f3f4] focus:ring-2 focus:ring-[#b70011]/20"
                  >
                    <option value="all">{t.all_domains}</option>
                    {allDomaines.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {t.filter_deadline}
                  </label>
                  <input
                    type="date"
                    value={filterDeadline}
                    onChange={(e) => setFilterDeadline(e.target.value)}
                    className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              </div>

              {/* Stats sidebar */}
              <div className="rounded-xl bg-white p-5 shadow-[0_20px_40px_rgba(25,28,29,0.05)]">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Statistiques</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Appels ouverts</span>
                    <span className="font-bold text-secondary-600">
                      {appels.filter((a) => a.statut === "OUVERT").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Domaines couverts</span>
                    <span className="font-bold text-gray-900">{domainesUniques}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget total</span>
                    <span className="font-bold text-gray-900">{formatBudgetFCFA(budgetTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Propositions reçues</span>
                    <span className="font-bold text-gray-900">
                      {appels.reduce((acc, a) => acc + a.proposalsCount, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0D0D0D] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold lg:text-4xl">{t.cta_title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">{t.cta_desc}</p>
          <div className="mt-8">
            <button
              onClick={() => appels.length > 0 ? setModalAppel(appels[0]!) : undefined}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
            >
              {t.cta_button}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
