"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";
import { Icon } from "@/components/Icon";

/**
 * Intervenants d'exemple : fiches fictives (« Awa Exemple »…) marquées
 * « Exemple » sur le site, ajoutées ou retirées en un clic.
 */
export function DemoSpeakers({ count }: { count: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function run(method: "POST" | "DELETE") {
    if (method === "DELETE" && !window.confirm(`Supprimer les ${count} intervenants d'exemple ? Les vrais intervenants sont conservés.`)) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await api<{ count: number }>("/api/admin/demo/speakers", { method });
      setMessage({
        kind: "success",
        text: method === "POST" ? `${res.count} intervenants d'exemple ajoutés.` : `${res.count} intervenants d'exemple supprimés.`,
      });
      router.refresh();
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof ApiClientError ? e.message : "Une erreur est survenue." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-card adm-card-pad mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="max-w-xl">
        <p className="font-semibold">Intervenants d&apos;exemple</p>
        <p className="mt-1 text-sm text-[#6b746f]">
          {count > 0
            ? `${count} fiches fictives (nom « Exemple ») présentent la page en attendant la liste confirmée. Modifiez-les et décochez « Fiche d'exemple », ou supprimez-les en un clic.`
            : "Ajoutez des fiches fictives (nom « Exemple »), marquées « Exemple » sur le site, pour présenter la page en attendant la liste confirmée."}
        </p>
        {message && <p className={`adm-alert ${message.kind === "success" ? "adm-alert-success" : "adm-alert-error"} mt-3`}>{message.text}</p>}
      </div>
      {count > 0 ? (
        <button type="button" className="adm-btn adm-btn-danger" disabled={busy} onClick={() => run("DELETE")}>
          <Icon name="trash" className="size-4" /> Supprimer les exemples
        </button>
      ) : (
        <button type="button" className="adm-btn adm-btn-ghost" disabled={busy} onClick={() => run("POST")}>
          <Icon name="plus" className="size-4" /> Ajouter les exemples
        </button>
      )}
    </div>
  );
}
