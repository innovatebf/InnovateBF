import { z } from "@/lib/zod-fr";

/**
 * Description déclarative des champs éditables : une seule définition sert
 * à valider (zod), à générer les formulaires du back-office et à typer les
 * données lues par le site.
 */

type Base = { name: string; label: string; help?: string; half?: boolean };

export type TextField = Base & { type: "text"; max?: number; multiline?: boolean; optional?: boolean };
export type LinesField = Base & { type: "lines"; maxItems?: number; maxLength?: number; minItems?: number };
export type LinkField = Base & { type: "link"; optional?: boolean };
export type UrlField = Base & { type: "url"; optional?: boolean };
export type EmailField = Base & { type: "email" };
export type ImageField = Base & { type: "image"; optional?: boolean; withAlt?: boolean };
export type BooleanField = Base & { type: "boolean" };
export type SelectField = Base & { type: "select"; options: readonly { value: string; label: string }[] };
export type NumberField = Base & { type: "number"; min: number; max: number };
export type DateField = Base & { type: "date"; optional?: boolean };
export type DateTimeField = Base & { type: "datetime" };
export type TimeField = Base & { type: "time"; optional?: boolean };

export type Field =
  | TextField
  | LinesField
  | LinkField
  | UrlField
  | EmailField
  | ImageField
  | BooleanField
  | SelectField
  | NumberField
  | DateField
  | DateTimeField
  | TimeField;

export type ImageValue = { src: string; alt: string };

type FieldValue<F> = F extends { type: "lines" }
  ? string[]
  : F extends { type: "boolean" }
    ? boolean
    : F extends { type: "number" }
      ? number
      : F extends { type: "image" }
        ? ImageValue
        : F extends { type: "select"; options: readonly { value: infer V }[] }
          ? V
          : string;

export type ValuesOf<Fs extends readonly Field[]> = { [F in Fs[number] as F["name"]]: FieldValue<F> };

/* ---------- Règles de validation ---------- */

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
// Chemin interne : commence par un seul « / », sans espace ni « .. »
const INTERNAL_PATH = /^\/(?!\/)(?!.*\.\.)[^\s<>"'`]*$/;
const ANCHOR = /^#[A-Za-z][\w-]*$/;
// Images : fichiers du site ou de la médiathèque (disque en développement, stockage Supabase en production)
const LOCAL_IMAGE = /^\/(?!\/)(?!.*\.\.)[\w\-./%]+\.(png|jpe?g|webp|gif|avif)$/i;
const STORAGE_IMAGE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/media\/[\w\-./%]+$/i;

function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Lien sûr : chemin interne, ancre, URL http(s) ou mailto (jamais javascript:). */
export function isSafeLink(v: string) {
  if (INTERNAL_PATH.test(v) || ANCHOR.test(v) || isHttpUrl(v)) return true;
  return /^mailto:[^\s@<>"']+@[^\s@<>"']+$/.test(v);
}

export function isSafeImage(v: string) {
  return LOCAL_IMAGE.test(v) || STORAGE_IMAGE.test(v);
}

const trimmed = (max: number) => z.string().trim().max(max, `${max} caractères maximum`);
const required = (s: z.ZodString) => s.min(1, "Champ obligatoire");

function zodFor(f: Field): z.ZodType {
  switch (f.type) {
    case "text": {
      const s = trimmed(f.max ?? (f.multiline ? 2000 : 200));
      return f.optional ? s : required(s);
    }
    case "lines":
      return z
        .array(required(trimmed(f.maxLength ?? 120)))
        .min(f.minItems ?? 0, `${f.minItems} ligne(s) minimum`)
        .max(f.maxItems ?? 12, `${f.maxItems ?? 12} lignes maximum`);
    case "link": {
      const s = trimmed(500).refine((v) => v === "" || isSafeLink(v), "Lien invalide (chemin « /… », URL http(s) ou mailto:)");
      return f.optional ? s : s.refine((v) => v !== "", "Champ obligatoire");
    }
    case "url": {
      const s = trimmed(500).refine((v) => v === "" || isHttpUrl(v), "URL invalide (http:// ou https://)");
      return f.optional ? s : s.refine((v) => v !== "", "Champ obligatoire");
    }
    case "email":
      return z.string().trim().max(200).email("Adresse e-mail invalide");
    case "image": {
      const src = trimmed(500).refine((v) => v === "" || isSafeImage(v), "Image invalide : choisissez-la dans la médiathèque");
      return z.object({
        src: f.optional ? src : src.refine((v) => v !== "", "Image obligatoire"),
        alt: trimmed(200),
      });
    }
    case "boolean":
      return z.boolean();
    case "select":
      return z.enum(f.options.map((o) => o.value) as [string, ...string[]], { message: "Choix invalide" });
    case "number":
      return z.number({ message: "Nombre attendu" }).int().min(f.min).max(f.max);
    case "date": {
      const s = z.string().regex(DATE, "Date invalide (AAAA-MM-JJ)");
      return f.optional ? z.union([z.literal(""), s]) : s;
    }
    case "datetime":
      return z.string().refine((v) => !Number.isNaN(Date.parse(v)) && v.length <= 40, "Date et heure invalides");
    case "time": {
      const s = z.string().regex(TIME, "Heure invalide (HH:MM)");
      return f.optional ? z.union([z.literal(""), s]) : s;
    }
  }
}

export function schemaFor<const Fs extends readonly Field[]>(fields: Fs) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) shape[f.name] = zodFor(f);
  return z.object(shape).strict() as unknown as z.ZodType<ValuesOf<Fs>>;
}

/** Valeur vide d'un champ (création d'un élément dans le back-office). */
export function emptyValue(f: Field): unknown {
  switch (f.type) {
    case "lines":
      return [];
    case "boolean":
      return false;
    case "number":
      return f.min;
    case "image":
      return { src: "", alt: "" };
    case "select":
      return f.options[0]?.value ?? "";
    default:
      return "";
  }
}

export function emptyValues(fields: readonly Field[]) {
  return Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));
}
