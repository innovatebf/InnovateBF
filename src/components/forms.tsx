"use client";

import { useState } from "react";
import type { Translate } from "@/i18n";
import { useT } from "@/i18n/client";
import { api, ApiClientError } from "@/lib/api-client";
import f from "./form.module.css";
import { Icon } from "./Icon";

type Status = { kind: "idle" | "success" | "error"; message?: string; fields?: Record<string, string> };

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`${f.field} ${error ? f.invalid : ""}`}>
      <span className={f.labelText}>
        {label}
        {required && <span className={f.req}> *</span>}
      </span>
      {children}
      {error && (
        <span className={f.error} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

/** Champ piège caché aux humains */
function Honeypot() {
  return (
    <div className="hidden" aria-hidden="true">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function Feedback({ status }: { status: Status }) {
  if (status.kind === "idle" || !status.message) return null;
  const ok = status.kind === "success";
  return (
    <p role="status" className={`${f.alert} ${ok ? f.alertSuccess : f.alertError}`}>
      <Icon name={ok ? "check" : "close"} className="mt-0.5 size-4 shrink-0" />
      {status.message}
    </p>
  );
}

/** Envoie le formulaire en JSON vers l'endpoint et renvoie le nouvel état. */
async function submitForm(url: string, form: HTMLFormElement, t: Translate): Promise<Status> {
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await api<{ message: string }>(url, { method: "POST", body });
    return { kind: "success", message: res.message };
  } catch (e) {
    if (e instanceof ApiClientError) return { kind: "error", message: e.message, fields: e.fields };
    return { kind: "error", message: t("Une erreur est survenue. Réessayez dans quelques instants.", "An error occurred. Please try again in a few moments.") };
  }
}

export function ContactForm() {
  const t = useT();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const next = await submitForm("/api/public/contact", form, t);
    setStatus(next);
    setPending(false);
    if (next.kind === "success") form.reset();
  }

  const err = (k: string) => status.fields?.[k];
  return (
    <form onSubmit={onSubmit} className={f.form} noValidate={false}>
      <Honeypot />
      <div className={f.grid2}>
        <Field label={t("Nom", "Name")} required error={err("name")}>
          <input name="name" required maxLength={120} autoComplete="name" className={f.input} />
        </Field>
        <Field label={t("E-mail", "Email")} required error={err("email")}>
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={f.input} />
        </Field>
      </div>
      <Field label={t("Objet", "Subject")} required error={err("subject")}>
        <input name="subject" required maxLength={200} className={f.input} />
      </Field>
      <Field label={t("Message", "Message")} required error={err("message")}>
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className={f.textarea} />
      </Field>
      <Feedback status={status} />
      <div>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? t("Envoi en cours…", "Sending…") : t("Envoyer le message", "Send message")}
          {!pending && <Icon name="arrow" className="size-4" />}
        </button>
      </div>
    </form>
  );
}
