import "server-only";
import { storageClient, storageOrigin } from "./storage-config";

/** Opérations sur les fichiers (voir storage-config.ts). Une seule instance par processus. */
let client: ReturnType<typeof storageClient> | undefined;
const storage = () => (client ??= storageClient());

/* ---------- Pièces jointes des candidatures (espace privé) ---------- */

// Chemin choisi par le formulaire : dossier aléatoire, nom de fichier assaini
const PIECE_PATH = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[\w.-]{1,120}$/;

const piecesBase = () => `${storageOrigin()}/storage/v1/object/candidatures/`;

export const isPiecePath = (path: string) => PIECE_PATH.test(path);

/** Adresse enregistrée dans le dossier : elle désigne le fichier, mais ne l'ouvre pas (espace privé). */
export const pieceUrl = (path: string) => piecesBase() + path;

/** Chemin d'une pièce de l'espace du site, ou null pour toute autre adresse. */
export function piecePath(url: string) {
  if (!storageOrigin() || !url.startsWith(piecesBase())) return null;
  const path = url.slice(piecesBase().length);
  return isPiecePath(path) ? path : null;
}

/** Autorise l'envoi direct d'un fichier depuis le navigateur, pour ce seul chemin et sans écrasement possible. */
export async function signPieceUpload(path: string) {
  const { data, error } = await storage().from("candidatures").createSignedUploadUrl(path);
  if (error) throw error;
  return data.signedUrl;
}

/** Lien temporaire (5 minutes) pour ouvrir une pièce depuis le back-office, téléchargée sous son nom assaini. */
export async function signPieceDownload(path: string) {
  const { data, error } = await storage().from("candidatures").createSignedUrl(path, 300, { download: true });
  if (error) throw error;
  return data.signedUrl;
}

/* ---------- Images de la médiathèque (espace public) ---------- */

/** Nom aléatoire : le fichier ne change jamais, il peut rester longtemps en cache. */
export async function uploadImage(name: string, body: Buffer, contentType: string) {
  const bucket = storage().from("media");
  const { error } = await bucket.upload(name, body, { contentType, cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return bucket.getPublicUrl(name).data.publicUrl;
}

export async function removeImage(name: string) {
  const { error } = await storage().from("media").remove([name]);
  if (error) throw error;
}
