"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";
import { collectionDefs, type CollectionName } from "@/lib/content/definitions";
import { FieldsForm, normalizeValues } from "./FieldsForm";

export function ItemEditor({
  name,
  id,
  initial,
  initialVisible,
}: {
  name: CollectionName;
  id: number | null;
  initial: Record<string, unknown>;
  initialVisible: boolean;
}) {
  const router = useRouter();
  const def = collectionDefs[name];
  const [values, setValues] = useState(initial);
  const [visible, setVisible] = useState(initialVisible);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({ kind: "idle" });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "saving" });
    setErrors({});
    const body = { data: normalizeValues(def.fields, values), visible };
    try {
      if (id === null) {
        await api(`/api/admin/collections/${name}`, { method: "POST", body });
        router.push(`/admin/collections/${name}`);
        router.refresh();
        return;
      }
      const { item } = await api<{ item: { data: Record<string, unknown> } }>(`/api/admin/collections/${name}/${id}`, { method: "PATCH", body });
      setValues(item.data);
      setStatus({ kind: "saved", message: "Modifications enregistrées et publiées sur le site." });
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Les erreurs de champ arrivent préfixées par « data. »
        setErrors(Object.fromEntries(Object.entries(err.fields).map(([k, v]) => [k.replace(/^data\./, ""), v])));
        setStatus({ kind: "error", message: err.message });
      } else setStatus({ kind: "error", message: "Enregistrement impossible." });
    }
  }

  return (
    <form onSubmit={save} className="adm-card adm-card-pad">
      <FieldsForm fields={def.fields} values={values} onChange={setValues} errors={errors} />
      <label className="mt-6 inline-flex cursor-pointer items-center gap-2.5 border-t border-[#eef0ee] pt-5">
        <input type="checkbox" className="size-4 accent-[#0a3a8f]" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
        <span className="text-sm font-semibold">Afficher sur le site</span>
      </label>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="adm-btn adm-btn-primary" disabled={status.kind === "saving"}>
          {status.kind === "saving" ? "Enregistrement…" : id === null ? `Ajouter le ${def.singular}` : "Enregistrer"}
        </button>
        <button type="button" className="adm-btn adm-btn-ghost" onClick={() => router.push(`/admin/collections/${name}`)}>
          Retour à la liste
        </button>
        {status.message && (
          <p role="status" className={`adm-alert ${status.kind === "error" ? "adm-alert-error" : "adm-alert-success"}`}>
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
