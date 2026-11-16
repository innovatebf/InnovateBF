"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Field, ImageValue } from "@/lib/content/fields";
import { MediaPicker } from "./MediaPicker";

type Values = Record<string, unknown>;

/** Nettoie les valeurs avant envoi (lignes vides retirées, espaces superflus). */
export function normalizeValues(fields: readonly Field[], values: Values): Values {
  const out: Values = { ...values };
  for (const f of fields) {
    if (f.type === "lines") out[f.name] = ((values[f.name] as string[]) ?? []).map((l) => l.trim()).filter(Boolean);
  }
  return out;
}

/** Erreur d'un champ : le serveur renvoie des chemins (« titleLines.0 », « image.src »). */
const errorFor = (errors: Record<string, string>, name: string) =>
  errors[name] ?? Object.entries(errors).find(([k]) => k.startsWith(`${name}.`))?.[1];

const toLocal = (iso: string) => (iso ? iso.slice(0, 16) : "");
const fromLocal = (v: string) => (v ? `${v}:00.000Z` : "");

function ImageInput({
  id,
  value,
  onChange,
  withAlt,
  optional,
}: {
  id: string;
  value: ImageValue;
  onChange: (v: ImageValue) => void;
  withAlt?: boolean;
  optional?: boolean;
}) {
  const [picking, setPicking] = useState(false);
  return (
    <div className="mt-2 flex flex-wrap items-start gap-4">
      <div className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e1e4e0] bg-[#f3f6fa]">
        {value.src ? (
          // eslint-disable-next-line @next/next/no-img-element -- aperçu dans le back-office
          <img src={value.src} alt="" className="h-full w-full object-contain" />
        ) : (
          <Icon name="image" className="size-8 text-[#a3aba6]" />
        )}
      </div>
      <div className="grid min-w-[220px] flex-1 gap-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" id={id} className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setPicking(true)}>
            <Icon name="image" className="size-4" /> {value.src ? "Changer d'image" : "Choisir une image"}
          </button>
          {optional && value.src && (
            <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => onChange({ src: "", alt: "" })}>
              Retirer
            </button>
          )}
        </div>
        {value.src && <p className="truncate text-xs text-[#6b746f]">{value.src}</p>}
        {withAlt && (
          <label>
            <span className="adm-help">Description de l&apos;image (accessibilité)</span>
            <input
              className="adm-input"
              value={value.alt}
              maxLength={200}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
            />
          </label>
        )}
      </div>
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onSelect={(m) => {
            onChange({ src: m.url, alt: value.alt || m.alt });
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange, error }: { field: Field; value: unknown; onChange: (v: unknown) => void; error?: string }) {
  const id = useId();
  const invalid = error ? true : undefined;
  const common = { id, "aria-invalid": invalid, className: "adm-input" };

  let control: React.ReactNode;
  switch (field.type) {
    case "text":
      control = field.multiline ? (
        <textarea {...common} rows={4} maxLength={field.max} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} maxLength={field.max} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      );
      break;
    case "lines":
      control = (
        <textarea
          {...common}
          rows={Math.min(8, Math.max(3, ((value as string[]) ?? []).length + 1))}
          value={((value as string[]) ?? []).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
      );
      break;
    case "link":
    case "url":
    case "email":
      control = (
        <input
          {...common}
          type={field.type === "email" ? "email" : "text"}
          inputMode={field.type === "email" ? "email" : "url"}
          maxLength={500}
          placeholder={field.type === "link" ? "/page ou https://…" : field.type === "url" ? "https://…" : undefined}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "boolean":
      control = (
        <label className="mt-2 inline-flex cursor-pointer items-center gap-2.5">
          <input id={id} type="checkbox" className="size-4 accent-[#0a3a8f]" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span className="text-sm">Oui</span>
        </label>
      );
      break;
    case "select":
      control = (
        <select {...common} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "number":
      control = (
        <input
          {...common}
          type="number"
          min={field.min}
          max={field.max}
          value={Number(value ?? field.min)}
          onChange={(e) => onChange(e.target.value === "" ? field.min : Number(e.target.value))}
        />
      );
      break;
    case "date":
      control = <input {...common} type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "datetime":
      control = <input {...common} type="datetime-local" value={toLocal(String(value ?? ""))} onChange={(e) => onChange(fromLocal(e.target.value))} />;
      break;
    case "time":
      control = <input {...common} type="time" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "image":
      control = (
        <ImageInput
          id={id}
          value={(value as ImageValue) ?? { src: "", alt: "" }}
          onChange={onChange}
          withAlt={field.withAlt}
          optional={field.optional}
        />
      );
      break;
  }

  const optional = "optional" in field && field.optional;
  return (
    <div className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
      <label htmlFor={id} className="adm-label">
        {field.label}
        {optional && <span className="font-normal text-[#8a928d]"> (facultatif)</span>}
      </label>
      {field.type === "lines" && <span className="adm-help">Une ligne par entrée.</span>}
      {field.help && <span className="adm-help">{field.help}</span>}
      {control}
      {error && (
        <span className="adm-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function FieldsForm({
  fields,
  values,
  onChange,
  errors,
}: {
  fields: readonly Field[];
  values: Values;
  onChange: (v: Values) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <FieldInput
          key={f.name}
          field={f}
          value={values[f.name]}
          error={errorFor(errors, f.name)}
          onChange={(v) => onChange({ ...values, [f.name]: v })}
        />
      ))}
    </div>
  );
}
