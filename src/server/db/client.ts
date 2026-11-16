import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { poolConfig } from "./config";
import * as schema from "./schema";

/**
 * Connexion PostgreSQL : base locale en développement, Supabase en production.
 * Une seule instance par processus.
 */
const globalForDb = globalThis as unknown as { __ibfDb?: NodePgDatabase<typeof schema> };

function connect() {
  const pool = new Pool(poolConfig());
  // Connexion inactive coupée par le pooler : sans cet écouteur, l'erreur arrêterait le processus
  pool.on("error", (e) => console.error("[db] connexion perdue :", e.message));
  return drizzle(pool, { schema });
}

export const db = (globalForDb.__ibfDb ??= connect());
export { schema };

/** Valeur déjà prise dans une colonne unique (code PostgreSQL 23505), l'erreur du pilote étant enveloppée par Drizzle. */
export function isUniqueViolation(e: unknown) {
  const code = (x: unknown) => (x as { code?: string } | null | undefined)?.code;
  return code(e) === "23505" || code((e as { cause?: unknown } | null | undefined)?.cause) === "23505";
}
