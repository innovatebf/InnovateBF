"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";
import { settingsDefs, type SettingsKey } from "@/lib/content/definitions";
import { FieldsForm, normalizeValues } from "./FieldsForm";

export function SettingsEditor({ settingsKey, initial }: { settingsKey: SettingsKey; initial: Record<string, unknown> }) {
  const router = useRouter();
  const def = settingsDefs[settingsKey];
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({ kind: "idle" });
  const dirty = JSON.stringify(values) !== JSON.stringify(initial);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "saving" });
    setErrors({});
    try {
      const { value } = await api<{ value: Record<string, unknown> }>(`/api/admin/settings/${settingsKey}`, {
        method: "PUT",
        body: { value: normalizeValues(def.fields, values) },
      });
      setValues(value);
      setStatus({ kind: "saved", message: "Modifications enregistrées et publiées sur le site." });
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrors(err.fields);
        setStatus({ kind: "error", message: err.message });
      } else setStatus({ kind: "error", message: "Enregistrement impossible." });
    }
  }

  return (
    <form onSubmit={save} className="adm-card adm-card-pad">
      <FieldsForm fields={def.fields} values={values} onChange={(v) => { setValues(v); setStatus({ kind: "idle" }); }} errors={errors} />
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#eef0ee] pt-5">
        <button type="submit" className="adm-btn adm-btn-primary" disabled={status.kind === "saving" || !dirty}>
          {status.kind === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button type="button" className="adm-btn adm-btn-ghost" disabled={!dirty || status.kind === "saving"} onClick={() => { setValues(initial); setErrors({}); }}>
          Annuler les modifications
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
