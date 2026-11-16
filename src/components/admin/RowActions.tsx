"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { STATUS_LABELS } from "@/lib/admin/labels";
import { api, ApiClientError } from "@/lib/api-client";

/** Bouton de suppression d'une ligne (avec confirmation). */
export function DeleteButton({ url, label, redirectTo }: { url: string; label: string; redirectTo?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function onClick() {
    if (!window.confirm(`Supprimer ${label} ? Cette action est définitive.`)) return;
    setBusy(true);
    try {
      await api(url, { method: "DELETE" });
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (e) {
      window.alert(e instanceof ApiClientError ? e.message : "Suppression impossible.");
      setBusy(false);
    }
  }
  return (
    <button type="button" className="adm-icon-btn hover:text-[#b42318]" onClick={onClick} disabled={busy} aria-label={`Supprimer ${label}`} title="Supprimer">
      <Icon name="trash" className="size-[18px]" />
    </button>
  );
}

/** Bascule lu / non lu d'un message. */
export function ReadToggle({ id, read }: { id: number; read: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function onClick() {
    setBusy(true);
    try {
      await api(`/api/admin/messages/${id}`, { method: "PATCH", body: { read: !read } });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }
  return (
    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={onClick} disabled={busy}>
      {read ? "Marquer non lu" : "Marquer lu"}
    </button>
  );
}


/** Sélecteur de statut d'une candidature. */
export function StatusSelect({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  async function onChange(next: string) {
    const previous = value;
    setValue(next);
    setState("saving");
    try {
      await api(`/api/admin/candidatures/${id}`, { method: "PATCH", body: { status: next } });
      setState("saved");
      router.refresh();
    } catch {
      setValue(previous);
      setState("error");
    }
  }
  return (
    <div className="flex items-center gap-3">
      <select className="adm-input mt-0 w-auto" value={value} onChange={(e) => onChange(e.target.value)} disabled={state === "saving"} aria-label="Statut">
        {Object.entries(STATUS_LABELS).map(([k, l]) => (
          <option key={k} value={k}>
            {l}
          </option>
        ))}
      </select>
      {state === "saved" && <span className="text-sm text-[#082f7a]">Statut enregistré</span>}
      {state === "error" && <span className="text-sm text-[#b42318]">Échec de l&apos;enregistrement</span>}
    </div>
  );
}

