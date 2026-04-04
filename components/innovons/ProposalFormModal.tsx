"use client";

import { useState } from "react";
import { X, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ProposalFormModalProps {
  appel: {
    id: string;
    need_id: string;
    titre: string;
    domaine?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  titre: string;
  description: string;
  approche: string;
  equipe: string;
  budget_estime: string;
  delai: string;
  porteur_nom: string;
  porteur_email: string;
  porteur_organisation: string;
}

const EMPTY_FORM: FormData = {
  titre: "",
  description: "",
  approche: "",
  equipe: "",
  budget_estime: "",
  delai: "",
  porteur_nom: "",
  porteur_email: "",
  porteur_organisation: "",
};

export function ProposalFormModal({ appel, isOpen, onClose }: ProposalFormModalProps) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/innovons/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          need_id: appel.need_id,
          titre: form.titre,
          description: form.description,
          approche: form.approche || undefined,
          equipe: form.equipe || undefined,
          budget_estime: form.budget_estime ? Number(form.budget_estime) : undefined,
          delai: form.delai || undefined,
          porteur_nom: form.porteur_nom,
          porteur_email: form.porteur_email,
          porteur_organisation: form.porteur_organisation || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la soumission");
      }

      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  function handleClose() {
    setStatus("idle");
    setForm(EMPTY_FORM);
    setErrorMessage("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-600 mb-1">
              Soumettre une proposition
            </p>
            <h2 id="modal-title" className="text-lg font-bold text-gray-900 leading-snug">
              {appel.titre}
            </h2>
            {appel.domaine && (
              <span className="mt-1.5 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {appel.domaine}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Success state */}
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary-50">
              <CheckCircle className="size-8 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Proposition soumise !</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                Votre proposition a bien été reçue. L'équipe InnovateBF l'examinera et vous contactera sous 5 jours ouvrables.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-primary-700 hover:to-primary-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

            {/* Error banner */}
            {status === "error" && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Section : Votre solution */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                Votre solution
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="titre">
                    Titre de la proposition <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="titre"
                    name="titre"
                    type="text"
                    required
                    value={form.titre}
                    onChange={handleChange}
                    placeholder="Ex : Système de filtration solaire low-cost"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="description">
                    Description de la solution <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre solution, comment elle répond au besoin, ses points forts..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition resize-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="approche">
                    Approche technique{" "}
                    <span className="font-normal text-gray-400">(optionnel)</span>
                  </label>
                  <textarea
                    id="approche"
                    name="approche"
                    rows={3}
                    value={form.approche}
                    onChange={handleChange}
                    placeholder="Méthodologie, technologies utilisées, étapes de mise en œuvre..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section : Équipe & Budget */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                Équipe & Ressources
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="equipe">
                    Composition de l'équipe{" "}
                    <span className="font-normal text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    id="equipe"
                    name="equipe"
                    type="text"
                    value={form.equipe}
                    onChange={handleChange}
                    placeholder="Ex : 2 ingénieurs, 1 agronome"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="budget_estime">
                    Budget estimé (FCFA){" "}
                    <span className="font-normal text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    id="budget_estime"
                    name="budget_estime"
                    type="number"
                    min="0"
                    value={form.budget_estime}
                    onChange={handleChange}
                    placeholder="Ex : 25000000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="delai">
                    Délai de réalisation{" "}
                    <span className="font-normal text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    id="delai"
                    name="delai"
                    type="text"
                    value={form.delai}
                    onChange={handleChange}
                    placeholder="Ex : 6 mois, 18 mois"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section : Porteur */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                Porteur de la proposition
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="porteur_nom">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="porteur_nom"
                    name="porteur_nom"
                    type="text"
                    required
                    value={form.porteur_nom}
                    onChange={handleChange}
                    placeholder="Prénom Nom"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="porteur_email">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="porteur_email"
                    name="porteur_email"
                    type="email"
                    required
                    value={form.porteur_email}
                    onChange={handleChange}
                    placeholder="email@exemple.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="porteur_organisation">
                    Organisation / Structure{" "}
                    <span className="font-normal text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    id="porteur_organisation"
                    name="porteur_organisation"
                    type="text"
                    value={form.porteur_organisation}
                    onChange={handleChange}
                    placeholder="Ex : Startup, Université, ONG..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-primary-700 hover:to-primary-600 transition-colors disabled:opacity-60"
              >
                {status === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {status === "loading" ? "Envoi en cours…" : "Soumettre ma proposition"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
