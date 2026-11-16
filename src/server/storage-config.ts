import { createClient } from "@supabase/supabase-js";
import { pieceRules } from "../content/candidature";

/**
 * Stockage de fichiers Supabase : paramètres partagés par le site et les scripts.
 * Espace `media` (public) : images de la médiathèque. Espace `candidatures` (privé) : pièces
 * jointes, ouvertes uniquement par un lien temporaire depuis le back-office.
 * Variables SUPABASE_URL et SUPABASE_SECRET_KEY (clé secrète : jamais envoyée au navigateur).
 * Sans elles, les images vont sur le disque (développement) et les candidats ajoutent leurs pièces par lien.
 */

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export const MEDIA_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
} as const;

export const BUCKETS = {
  media: { public: true, fileSizeLimit: MEDIA_MAX_BYTES, allowedMimeTypes: Object.values(MEDIA_TYPES) as string[] },
  candidatures: { public: false, fileSizeLimit: pieceRules.maxFile, allowedMimeTypes: pieceRules.contentTypes },
};

const env = (name: string) => process.env[name]?.trim() || undefined;

/** Adresse du projet Supabase, sans barre finale. */
export const storageOrigin = () => env("SUPABASE_URL")?.replace(/\/+$/, "");

export const storageEnabled = () => Boolean(storageOrigin() && env("SUPABASE_SECRET_KEY"));

export function storageClient() {
  const client = createClient(storageOrigin()!, env("SUPABASE_SECRET_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
  return client.storage;
}
