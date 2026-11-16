import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isLocale, type Locale } from "@/i18n";
import { validationErrors } from "@/i18n/zod";
import { z } from "@/lib/zod-fr";

/**
 * Outils communs des endpoints : erreurs typées, réponses JSON homogènes,
 * lecture de corps bornée, contrôle d'origine (anti-CSRF).
 *
 * Format d'erreur : { error: { code, message, fields? } }
 * Les formulaires du site public envoient la langue de la page (en-tête
 * X-Site-Locale) : les messages leur sont rendus en français ou en anglais.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
    /** Message pour le site anglais (à défaut, le message français) */
    public messageEn?: string,
  ) {
    super(message);
  }
}

export const errors = {
  badRequest: (message = "Requête invalide.", en = "Invalid request.") => new ApiError(400, "BAD_REQUEST", message, undefined, en),
  unauthorized: () => new ApiError(401, "UNAUTHORIZED", "Authentification requise.", undefined, "Authentication required."),
  forbidden: (message = "Accès refusé.", en = "Access denied.") => new ApiError(403, "FORBIDDEN", message, undefined, en),
  notFound: (message = "Ressource introuvable.", en = "Resource not found.") => new ApiError(404, "NOT_FOUND", message, undefined, en),
  conflict: (message: string) => new ApiError(409, "CONFLICT", message),
  tooLarge: () => new ApiError(413, "PAYLOAD_TOO_LARGE", "Contenu trop volumineux.", undefined, "Content too large."),
  unsupported: () => new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Format de requête non pris en charge.", undefined, "Unsupported request format."),
  tooMany: (retryAfter: number) =>
    new ApiError(
      429,
      "TOO_MANY_REQUESTS",
      `Trop de tentatives. Réessayez dans ${Math.ceil(retryAfter / 60)} min.`,
      undefined,
      `Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} min.`,
    ),
  closed: (message: string, en?: string) => new ApiError(403, "CLOSED", message, undefined, en),
};

/** Langue du site public qui envoie la requête (le back-office n'en envoie pas : français). */
export function requestLocale(req: Request): Locale {
  const value = req.headers.get("x-site-locale");
  return isLocale(value) ? value : "fr";
}

const SECURITY_HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export function json<T>(data: T, init: { status?: number; headers?: Record<string, string> } = {}) {
  return NextResponse.json(data, { status: init.status ?? 200, headers: { ...SECURITY_HEADERS, ...init.headers } });
}

export function noContent() {
  return new NextResponse(null, { status: 204, headers: SECURITY_HEADERS });
}

/** Convertit les erreurs zod en { chemin: message } lisible par les formulaires. */
export function zodFields(e: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of e.issues) {
    const path = issue.path.join(".") || "_";
    fields[path] ??= issue.message;
  }
  return fields;
}

function toResponse(e: unknown, locale: Locale) {
  const en = locale === "en";
  if (e instanceof ApiError) {
    const headers: Record<string, string> = {};
    if (e.status === 429) headers["Retry-After"] = "900";
    const message = en && e.messageEn ? e.messageEn : e.message;
    return json({ error: { code: e.code, message, fields: e.fields } }, { status: e.status, headers });
  }
  if (e instanceof ZodError) {
    return json(
      { error: { code: "VALIDATION_ERROR", message: en ? "Some fields are invalid." : "Certains champs sont invalides.", fields: zodFields(e) } },
      { status: 422 },
    );
  }
  // Erreur inattendue : détail dans les journaux du serveur, jamais dans la réponse
  console.error("[api] erreur inattendue", e);
  return json({ error: { code: "INTERNAL_ERROR", message: en ? "An internal error occurred." : "Une erreur interne est survenue." } }, { status: 500 });
}

type Ctx<P> = { params: Promise<P> };

/** Enveloppe un handler : toute exception devient une réponse JSON propre. */
export function handler<P = Record<string, string>>(fn: (req: Request, ctx: Ctx<P>) => Promise<Response>) {
  return async (req: Request, ctx: Ctx<P>) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      return toResponse(e, requestLocale(req));
    }
  };
}

const MAX_JSON_BYTES = 256 * 1024;

/** Lit un corps JSON (taille bornée, type vérifié) puis le valide. */
export async function readJson<T>(req: Request, schema: z.ZodType<T>, maxBytes = MAX_JSON_BYTES): Promise<T> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) throw errors.unsupported();
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) throw errors.tooLarge();
  const text = await req.text();
  if (Buffer.byteLength(text) > maxBytes) throw errors.tooLarge();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw errors.badRequest("JSON invalide.", "Invalid JSON.");
  }
  // Formulaires du site public : messages simples dans la langue de la page
  return req.headers.has("x-site-locale") ? schema.parse(body, { error: validationErrors(requestLocale(req)) }) : schema.parse(body);
}

/** Identifiant numérique positif issu d'un paramètre d'URL. */
export function parseId(value: string) {
  if (!/^[1-9]\d{0,9}$/.test(value)) throw errors.notFound();
  return Number(value);
}

/**
 * Protection CSRF des requêtes qui modifient des données : l'origine doit
 * être celle du site (en complément du cookie SameSite=Lax).
 */
export function assertSameOrigin(req: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") throw errors.forbidden("Origine non autorisée.");
  const origin = req.headers.get("origin");
  if (!origin) {
    if (fetchSite === "same-origin") return;
    throw errors.forbidden("Origine manquante.");
  }
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const allowed = new Set<string>();
  if (host) allowed.add(host.toLowerCase());
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host.toLowerCase());
    } catch {
      /* URL de configuration invalide : ignorée */
    }
  }
  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    throw errors.forbidden("Origine invalide.");
  }
  if (!allowed.has(originHost)) throw errors.forbidden("Origine non autorisée.");
}

/** Adresse IP du client (en-tête de la plateforme d'hébergement). */
export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip")) ?? "local";
  return ip.trim().slice(0, 64) || "local";
}

/** Échappe une valeur CSV (y compris l'injection de formules tableur). */
export function csvCell(value: unknown) {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function csvResponse(filename: string, header: string[], rows: unknown[][]) {
  const body = "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n");
  return new NextResponse(body, {
    headers: {
      ...SECURITY_HEADERS,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename.replace(/[^\w.-]/g, "_")}"`,
    },
  });
}

/** Pagination : ?page=1&pageSize=25 (bornée à 100). */
export function pagination(url: URL) {
  const page = Math.max(1, Math.min(10_000, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1));
  const pageSize = Math.max(1, Math.min(100, Number.parseInt(url.searchParams.get("pageSize") ?? "25", 10) || 25));
  return { page, pageSize, offset: (page - 1) * pageSize };
}
