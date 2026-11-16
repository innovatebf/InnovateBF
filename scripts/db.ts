/**
 * Outil de base de données.
 *
 *   npm run db:migrate            applique les migrations (dossier drizzle/)
 *   npm run db:seed               amorce le contenu si la base est vide
 *   npm run db:setup              migrate + seed + corrections de contenu (utilisé avant chaque build)
 *   npm run admin:create -- <e-mail> [nom]   crée un administrateur ou réinitialise son mot de passe
 *
 * Variables : DATABASE_URL (défaut : base PostgreSQL locale « innovatebf »),
 * ADMIN_EMAIL / ADMIN_PASSWORD (premier compte créé par db:seed),
 * SUPABASE_URL / SUPABASE_SECRET_KEY (espaces de stockage de fichiers, créés par db:setup).
 */
import { randomBytes } from "node:crypto";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { collectionDefs, collectionSchemas, settingsSchemas, type CollectionName, type SettingsKey } from "../src/lib/content/definitions";
import { emptyValues } from "../src/lib/content/fields";
import { hashPassword, passwordSchema } from "../src/server/auth/password";
import { defaultSettings, seedItems } from "../src/server/content/seed-data";
import { databaseUrl, isPostgresUrl, poolConfig, remoteDatabaseUrl } from "../src/server/db/config";
import * as schema from "../src/server/db/schema";
import { BUCKETS, storageClient, storageEnabled } from "../src/server/storage-config";
import { runContentMigrations } from "./content-migrations";

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

// Mêmes fichiers d'environnement que Next.js en local (.env.local prioritaire, absents sur Vercel)
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* fichier absent */
  }
}

// Sur Vercel, chaque environnement a sa base : sans DATABASE_URL, le build s'arrête plutôt que de deviner
if (process.env.VERCEL && !remoteDatabaseUrl()) {
  fail(`Base de données manquante pour l'environnement « ${process.env.VERCEL_ENV} » : renseignez DATABASE_URL dans les variables du projet Vercel (voir README, « Mise en ligne sur Vercel »).`);
}
const url = databaseUrl();
if (!isPostgresUrl(url)) {
  fail(`URL de base non prise en charge (${url.split(":")[0]}://…) : une base PostgreSQL (postgresql://…) est attendue.`);
}

const pool = new Pool(poolConfig(url));
const db = drizzle(pool, { schema });

async function runMigrations() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations appliquées");
}

async function seedContent() {
  // Blocs : seuls les blocs absents sont créés (rien n'est écrasé)
  let created = 0;
  for (const key of Object.keys(defaultSettings) as SettingsKey[]) {
    const value = settingsSchemas[key].parse(defaultSettings[key]);
    const res = await db.insert(schema.settings).values({ key, value }).onConflictDoNothing().returning({ key: schema.settings.key });
    created += res.length;
  }
  console.log(`✓ Blocs de contenu : ${created} créé(s)`);

  // Collections : amorcées uniquement si elles sont vides
  for (const name of Object.keys(collectionDefs) as CollectionName[]) {
    const [{ n }] = await db.select({ n: count() }).from(schema.items).where(eq(schema.items.collection, name));
    if (n > 0) continue;
    const fields = collectionDefs[name].fields;
    const rows = (seedItems[name] as object[]).map((data, position) => ({
      collection: name,
      position,
      // Champs absents de l'amorçage (versions anglaises facultatives) : valeur vide
      data: collectionSchemas[name].parse({ ...emptyValues(fields), ...data }),
    }));
    if (rows.length) await db.insert(schema.items).values(rows);
    console.log(`✓ Collection « ${name} » : ${rows.length} élément(s)`);
  }
}

/** Espaces de stockage de fichiers : créés s'ils manquent, leurs règles (taille, types) tenues à jour. */
async function setupStorage() {
  if (!storageEnabled()) {
    if (process.env.VERCEL) console.log("! Stockage de fichiers non configuré (SUPABASE_URL, SUPABASE_SECRET_KEY) : téléversements désactivés");
    return;
  }
  const storage = storageClient();
  const { data: existing, error } = await storage.listBuckets();
  if (error) throw new Error(`Stockage Supabase : ${error.message}`);
  let created = 0;
  for (const [id, options] of Object.entries(BUCKETS)) {
    const isNew = !existing.some((b) => b.id === id);
    const { error: failed } = isNew ? await storage.createBucket(id, options) : await storage.updateBucket(id, options);
    if (failed) throw new Error(`Stockage Supabase, espace « ${id} » : ${failed.message}`);
    if (isNew) created++;
  }
  console.log(`✓ Stockage de fichiers : ${created} espace(s) créé(s), ${Object.keys(BUCKETS).length} au total`);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Vérifie le mot de passe administrateur (sans jamais l'afficher). */
function checkPassword(password: string) {
  if (!passwordSchema.safeParse(password).success) {
    fail("ADMIN_PASSWORD refusé : 12 caractères minimum, avec au moins une lettre et un chiffre. Corrigez la variable puis relancez.");
  }
}

async function seedAdmin() {
  const [{ n }] = await db.select({ n: count() }).from(schema.users);
  if (n > 0) return;
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD || "";
  if (!email) {
    console.log("! Aucun compte : définissez ADMIN_EMAIL et ADMIN_PASSWORD, ou lancez « npm run admin:create -- <e-mail> »");
    return;
  }
  if (!EMAIL.test(email)) fail("ADMIN_EMAIL invalide : indiquez une adresse e-mail complète.");
  if (!password) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      console.log("! ADMIN_PASSWORD manquant : aucun compte créé en production");
      return;
    }
    password = randomBytes(12).toString("base64url") + "7";
    console.log(`  Mot de passe généré pour ${email} : ${password}`);
  }
  checkPassword(password);
  await db.insert(schema.users).values({ email, name: "Administrateur", role: "admin", passwordHash: await hashPassword(password) });
  console.log(`✓ Administrateur créé : ${email}`);
}

async function createAdmin(email: string, name: string) {
  const clean = email.trim().toLowerCase();
  if (!EMAIL.test(clean)) throw new Error("Adresse e-mail invalide");
  const password = process.env.ADMIN_PASSWORD || randomBytes(12).toString("base64url") + "7";
  checkPassword(password);
  const passwordHash = await hashPassword(password);
  const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, clean)).limit(1);
  if (existing) {
    await db.update(schema.users).set({ passwordHash, role: "admin", disabled: false }).where(eq(schema.users.id, existing.id));
    await db.delete(schema.sessions).where(eq(schema.sessions.userId, existing.id));
    console.log(`✓ Mot de passe réinitialisé pour ${clean}`);
  } else {
    await db.insert(schema.users).values({ email: clean, name, role: "admin", passwordHash });
    console.log(`✓ Administrateur créé : ${clean}`);
  }
  if (!process.env.ADMIN_PASSWORD) console.log(`  Mot de passe : ${password}  (à changer dans « Mon compte »)`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case "migrate":
      await runMigrations();
      break;
    case "seed":
      await seedContent();
      await seedAdmin();
      break;
    case "setup":
      await runMigrations();
      await seedContent();
      await runContentMigrations(db);
      await seedAdmin();
      await setupStorage();
      break;
    case "create-admin":
      if (!args[0]) throw new Error("Usage : npm run admin:create -- <e-mail> [nom]");
      await runMigrations();
      await createAdmin(args[0], args.slice(1).join(" ") || "Administrateur");
      break;
    default:
      throw new Error("Commandes : migrate | seed | setup | create-admin <e-mail> [nom]");
  }
}

main()
  .then(() => pool.end())
  .catch((e) => {
    // Drizzle enveloppe l'erreur du pilote : la cause dit ce qui ne va pas (jamais l'adresse de la base)
    const cause = (e instanceof Error ? (e.cause ?? e) : e) as Error & { code?: string };
    console.error("✗", cause.message || cause.code || String(cause));
    process.exit(1);
  });
