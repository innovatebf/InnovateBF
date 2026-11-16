"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { api, ApiClientError } from "@/lib/api-client";
import { collectionDefs, type CollectionName } from "@/lib/content/definitions";

type Item = { id: number; position: number; visible: boolean; data: Record<string, unknown> };

function label(def: (typeof collectionDefs)[CollectionName], field: string | undefined, data: Record<string, unknown>) {
  if (!field) return "";
  const raw = data[field];
  const f = def.fields.find((x) => x.name === field);
  if (f?.type === "select") return f.options.find((o) => o.value === raw)?.label ?? String(raw ?? "");
  return Array.isArray(raw) ? raw.join(" ") : String(raw ?? "");
}

export function CollectionManager({ name, initial }: { name: CollectionName; initial: Item[] }) {
  const router = useRouter();
  const def = collectionDefs[name];
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Action impossible.");
    } finally {
      setBusy(false);
    }
  }

  const move = (index: number, dir: -1 | 1) =>
    run(async () => {
      const next = [...items];
      const [it] = next.splice(index, 1);
      next.splice(index + dir, 0, it);
      setItems(next);
      const res = await api<{ items: Item[] }>(`/api/admin/collections/${name}/order`, { method: "PUT", body: { ids: next.map((i) => i.id) } });
      setItems(res.items);
    });

  const toggle = (item: Item) =>
    run(async () => {
      const { item: updated } = await api<{ item: Item }>(`/api/admin/collections/${name}/${item.id}`, {
        method: "PATCH",
        body: { visible: !item.visible },
      });
      setItems((list) => list.map((i) => (i.id === item.id ? updated : i)));
    });

  const remove = (item: Item) => {
    const title = label(def, def.titleField, item.data) || `#${item.id}`;
    if (!window.confirm(`Supprimer « ${title} » ? Cette action est définitive.`)) return;
    return run(async () => {
      await api(`/api/admin/collections/${name}/${item.id}`, { method: "DELETE" });
      setItems((list) => list.filter((i) => i.id !== item.id));
    });
  };

  return (
    <div className="adm-card overflow-hidden">
      {error && <p className="adm-alert adm-alert-error m-4">{error}</p>}
      {items.length === 0 ? (
        <p className="px-5 py-10 text-center text-[#6b746f]">Aucun {def.singular} pour le moment.</p>
      ) : (
        <ol>
          {items.map((item, i) => (
            <li key={item.id} className={`flex items-center gap-3 border-b border-[#eef0ee] px-4 py-3 last:border-b-0 ${item.visible ? "" : "bg-[#fafbfa]"}`}>
              <span className="w-7 text-right text-sm tabular-nums text-[#8a928d]">{i + 1}</span>
              <div className="flex flex-col">
                <button type="button" className="adm-icon-btn size-6" aria-label="Monter" disabled={busy || i === 0} onClick={() => move(i, -1)}>
                  <Icon name="up" className="size-4" />
                </button>
                <button type="button" className="adm-icon-btn size-6" aria-label="Descendre" disabled={busy || i === items.length - 1} onClick={() => move(i, 1)}>
                  <Icon name="down" className="size-4" />
                </button>
              </div>
              <Link href={`/admin/collections/${name}/${item.id}`} className="min-w-0 flex-1 hover:underline">
                <span className={`block truncate font-semibold ${item.visible ? "" : "text-[#8a928d]"}`}>
                  {label(def, def.titleField, item.data) || `Élément #${item.id}`}
                </span>
                {"subtitleField" in def && (
                  <span className="block truncate text-[13px] text-[#6b746f]">{label(def, def.subtitleField, item.data)}</span>
                )}
              </Link>
              {!item.visible && <span className="adm-badge">Masqué</span>}
              <button
                type="button"
                className="adm-icon-btn"
                aria-label={item.visible ? "Masquer sur le site" : "Afficher sur le site"}
                title={item.visible ? "Masquer sur le site" : "Afficher sur le site"}
                disabled={busy}
                onClick={() => toggle(item)}
              >
                <Icon name={item.visible ? "eye" : "eye-off"} className="size-[18px]" />
              </button>
              <Link href={`/admin/collections/${name}/${item.id}`} className="adm-icon-btn" aria-label="Modifier" title="Modifier">
                <Icon name="edit" className="size-[18px]" />
              </Link>
              <button type="button" className="adm-icon-btn hover:text-[#b42318]" aria-label="Supprimer" title="Supprimer" disabled={busy} onClick={() => remove(item)}>
                <Icon name="trash" className="size-[18px]" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
