"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { api, ApiClientError } from "@/lib/api-client";
import { ACCEPTED_IMAGES, uploadMedia, type MediaItem } from "./MediaPicker";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} Mo` : `${Math.round(n / 1024)} Ko`);

export function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setMessage(null);
    const added: MediaItem[] = [];
    const failed: string[] = [];
    for (const file of files.slice(0, 20)) {
      try {
        added.push(await uploadMedia(file, file.name.replace(/\.[^.]+$/, "")));
      } catch (err) {
        failed.push(`${file.name} : ${err instanceof ApiClientError ? err.message : "échec"}`);
      }
    }
    setItems((list) => [...added.reverse(), ...list]);
    setMessage(failed.length ? { kind: "error", text: failed.join(" · ") } : { kind: "success", text: `${added.length} image(s) ajoutée(s).` });
    setBusy(false);
    router.refresh();
  }

  async function saveAlt(item: MediaItem, alt: string) {
    if (alt === item.alt) return;
    try {
      const { item: updated } = await api<{ item: MediaItem }>(`/api/admin/media/${item.id}`, { method: "PATCH", body: { alt } });
      setItems((list) => list.map((m) => (m.id === item.id ? updated : m)));
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof ApiClientError ? err.message : "Enregistrement impossible." });
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(`Supprimer « ${item.filename} » ?`)) return;
    setBusy(true);
    setMessage(null);
    try {
      await api(`/api/admin/media/${item.id}`, { method: "DELETE" });
      setItems((list) => list.filter((m) => m.id !== item.id));
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof ApiClientError ? err.message : "Suppression impossible." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="adm-card adm-card-pad mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[#5b6560]">PNG, JPEG, WebP, GIF ou AVIF, 5 Mo maximum par image. Les SVG sont refusés par sécurité.</p>
        <label className={`adm-btn adm-btn-primary ${busy ? "opacity-60" : ""}`}>
          <Icon name="upload" className="size-4" /> {busy ? "Envoi en cours…" : "Envoyer des images"}
          <input type="file" accept={ACCEPTED_IMAGES} multiple className="sr-only" onChange={onFiles} disabled={busy} />
        </label>
      </div>
      {message && <p className={`adm-alert mb-4 ${message.kind === "error" ? "adm-alert-error" : "adm-alert-success"}`}>{message.text}</p>}
      {items.length === 0 ? (
        <div className="adm-card px-5 py-12 text-center text-[#6b746f]">La médiathèque est vide.</div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="adm-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element -- aperçu de la médiathèque */}
              <img src={m.url} alt={m.alt} className="aspect-[4/3] w-full bg-[#f3f6fa] object-contain" loading="lazy" />
              <div className="grid gap-2 p-3">
                <p className="truncate text-sm font-semibold" title={m.filename}>
                  {m.filename}
                </p>
                <p className="text-xs text-[#6b746f]">{kb(m.size)}</p>
                <label>
                  <span className="adm-help">Description (accessibilité)</span>
                  <input className="adm-input" defaultValue={m.alt} maxLength={200} onBlur={(e) => saveAlt(m, e.target.value.trim())} />
                </label>
                <div className="flex gap-2">
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm flex-1" onClick={() => navigator.clipboard?.writeText(m.url)}>
                    Copier le lien
                  </button>
                  <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(m)} disabled={busy} aria-label={`Supprimer ${m.filename}`}>
                    <Icon name="trash" className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
