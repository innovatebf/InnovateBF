/**
 * Paramètres de connexion à la base PostgreSQL, partagés par le site, les scripts et drizzle-kit.
 * DATABASE_URL : base Supabase en production (pooler en mode transaction, port 6543).
 * Sans cette variable : base locale (développement).
 */

export const LOCAL_DATABASE_URL = "postgresql://localhost:5432/innovatebf";

export const remoteDatabaseUrl = () => process.env.DATABASE_URL?.trim() || undefined;

export const databaseUrl = () => remoteDatabaseUrl() ?? LOCAL_DATABASE_URL;

/** Une URL d'un autre type (par exemple libsql://, ancienne base Turso) est refusée. */
export const isPostgresUrl = (url: string) => /^postgres(ql)?:\/\//i.test(url);

function parseUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    // Jamais l'adresse dans le message : elle contient le mot de passe
    throw new Error("DATABASE_URL illisible : les caractères spéciaux du mot de passe doivent être encodés.");
  }
}

export const isLocalDatabase = (url: string) => ["localhost", "127.0.0.1", "[::1]"].includes(parseUrl(url).hostname);

/** Hôte et base, à afficher dans les scripts : jamais le mot de passe. */
export function describeDatabase(url: string) {
  const { host, pathname } = parseUrl(url);
  return `${host}${pathname}`;
}

/**
 * Options du pilote `pg`. Une seule connexion par processus, comme le recommande Supabase
 * en serverless : les requêtes simultanées attendent leur tour (son pooler en mode transaction
 * n'accepte pas plusieurs requêtes en attente sur une même connexion). Hors local, la connexion
 * est chiffrée ; `sslmode` est retiré de l'adresse, car `pg` y verrait une vérification stricte
 * du certificat, que Supabase ne permet qu'avec son certificat racine.
 */
export function poolConfig(url = databaseUrl()) {
  const parsed = parseUrl(url);
  parsed.searchParams.delete("sslmode");
  return {
    connectionString: parsed.toString(),
    ssl: isLocalDatabase(url) ? false : { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 10_000,
  };
}
