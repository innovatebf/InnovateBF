"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPending(true);
    setError("");
    try {
      await api("/api/auth/login", { method: "POST", body: { email: data.get("email"), password: data.get("password") } });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Connexion impossible.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <label>
        <span className="adm-label">Adresse e-mail</span>
        <input name="email" type="email" required autoComplete="username" maxLength={200} className="adm-input" autoFocus />
      </label>
      <label>
        <span className="adm-label">Mot de passe</span>
        <input name="password" type="password" required autoComplete="current-password" maxLength={200} className="adm-input" />
      </label>
      {error && (
        <p className="adm-alert adm-alert-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="adm-btn adm-btn-primary mt-1 w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
