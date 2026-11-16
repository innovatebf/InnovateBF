/**
 * Corrections de contenu ponctuelles, appliquées une seule fois par base (table content_migrations).
 *
 * L'amorçage (db:seed) ne remplit que les collections vides : une base déjà en ligne
 * garde son contenu. Ces corrections y reportent les retours du comité d'organisation,
 * sans écraser ce qui a été modifié depuis le back-office.
 *
 * Aucune pour l'instant : la base PostgreSQL démarre avec un amorçage à jour.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../src/server/db/schema";

type Db = NodePgDatabase<typeof schema>;
type Migration = { id: string; run: (db: Db) => Promise<string> };

const migrations: Migration[] = [];

export async function runContentMigrations(db: Db) {
  const done = new Set((await db.select({ id: schema.contentMigrations.id }).from(schema.contentMigrations)).map((r) => r.id));
  for (const m of migrations) {
    if (done.has(m.id)) continue;
    const result = await db.transaction(async (tx) => {
      const message = await m.run(tx as unknown as Db);
      await tx.insert(schema.contentMigrations).values({ id: m.id });
      return message;
    });
    console.log(`✓ Correction ${m.id} : ${result}`);
  }
}
