"use client";

import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";

export function PasswordForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("next") !== data.get("confirm")) {
      setErrors({ confirm: "Les deux mots de passe ne correspondent pas" });
      return;
    }
    setBusy(true);
    setErrors({});
    setMessage(null);
    try {
      await api("/api/auth/password", { method: "POST", body: { current: data.get("current"), next: data.get("next") } });
      form.reset();
      setMessage({ kind: "success", text: "Mot de passe modifié. Vos autres sessions ont été fermées." });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrors(err.fields);
        setMessage({ kind: "error", text: err.message });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="adm-card adm-card-pad grid max-w-lg gap-4">
      <h2 className="text-lg font-semibold">Changer de mot de passe</h2>
      {[
        { name: "current", label: "Mot de passe actuel", auto: "current-password" },
        { name: "next", label: "Nouveau mot de passe", auto: "new-password", help: "12 caractères minimum, avec au moins une lettre et un chiffre." },
        { name: "confirm", label: "Confirmer le nouveau mot de passe", auto: "new-password" },
      ].map((f) => (
        <label key={f.name}>
          <span className="adm-label">{f.label}</span>
          <input name={f.name} type="password" required maxLength={200} autoComplete={f.auto} className="adm-input" aria-invalid={!!errors[f.name]} />
          {f.help && <span className="adm-help">{f.help}</span>}
          {errors[f.name] && <span className="adm-error">{errors[f.name]}</span>}
        </label>
      ))}
      {message && <p className={`adm-alert ${message.kind === "error" ? "adm-alert-error" : "adm-alert-success"}`}>{message.text}</p>}
      <div>
        <button type="submit" className="adm-btn adm-btn-primary" disabled={busy}>
          {busy ? "Enregistrement…" : "Changer le mot de passe"}
        </button>
      </div>
    </form>
  );
}
