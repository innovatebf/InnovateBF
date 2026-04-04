import sql from "../lib/db/neon";

async function main() {
  console.log("Migrating role values...");

  await sql`UPDATE "user" SET role = 'admin'  WHERE role = 'ADMINISTRATEUR'`;
  await sql`UPDATE "user" SET role = 'editor' WHERE role IN ('INNOVATEUR', 'PARRAIN')`;
  await sql`UPDATE "user" SET role = 'guest'  WHERE role NOT IN ('admin', 'editor', 'guest') OR role IS NULL`;
  await sql`ALTER TABLE "user" ALTER COLUMN role SET DEFAULT 'guest'`;

  const users = await sql`SELECT id, email, role FROM "user"`;
  console.log("Users after migration:");
  console.table(users);
}

main().catch(console.error);
