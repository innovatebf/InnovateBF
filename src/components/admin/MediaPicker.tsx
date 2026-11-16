"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { api, ApiClientError } from "@/lib/api-client";

export type MediaItem = { id: number; url: string; filename: string; alt: string; size: number; contentType: string; createdAt: string };

/** Envoi d'une image dans la médiathèque. */
export async function uploadMedia(file: File, alt = "") {
  const form = new FormData();
  form.append("file", file);
  form.append("alt", alt);
  const { item } = await api<{ item: MediaItem }>("/api/admin/media", { method: "POST", body: form });
  return item;
}

export const ACCEPTED_IMAGES = "image/png,image/jpeg,image/webp,image/gif,image/avif";

/** Fenêtre de choix d'une image (avec envoi direct). */
export function MediaPicker({ onSelect, onClose }: { onSelect: (m: MediaItem) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      setItems((await api<{ items: MediaItem[] }>("/api/admin/media")).items);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Chargement impossible.");
    }
  }, []);

  useEffect(() => {
    load();
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [load, onClose]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const item = await uploadMedia(file, file.name.replace(/\.[^.]+$/, ""));
      onSelect(item);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Envoi impossible.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="adm-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="picker-title" className="adm-modal outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#e1e4e0] bg-white px-5 py-4">
          <h2 id="picker-title" className="text-lg font-semibold">
            Choisir une image
          </h2>
          <div className="flex items-center gap-2">
            <label className={`adm-btn adm-btn-primary adm-btn-sm ${uploading ? "opacity-60" : ""}`}>
              <Icon name="upload" className="size-4" />
              {uploading ? "Envoi…" : "Envoyer une image"}
              <input type="file" accept={ACCEPTED_IMAGES} className="sr-only" onChange={onFile} disabled={uploading} />
            </label>
            <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Fermer">
              <Icon name="close" />
            </button>
          </div>
        </div>
        <div className="p-5">
          {error && <p className="adm-alert adm-alert-error mb-4">{error}</p>}
          <p className="adm-help mb-4">PNG, JPEG, WebP, GIF ou AVIF, 5 Mo maximum.</p>
          {items === null ? (
            <p className="text-[#6b746f]">Chargement…</p>
          ) : items.length === 0 ? (
            <p className="text-[#6b746f]">La médiathèque est vide : envoyez une première image.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {items.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(m)}
                    className="group block w-full overflow-hidden rounded-xl border border-[#e1e4e0] text-left transition hover:border-faso focus:border-faso"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- aperçu d'une image de la médiathèque */}
                    <img src={m.url} alt={m.alt} className="aspect-[4/3] w-full bg-[#f3f6fa] object-contain" loading="lazy" />
                    <span className="block truncate px-2 py-1.5 text-xs text-[#5b6560]">{m.filename}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
