import { auth } from "../lib/auth/index";

async function createAdmin() {
  try {
    // Créer l'utilisateur admin via better-auth
    const result = await auth.api.signUpEmail({
      body: {
        name: "Administrateur InnovateBF",
        email: "admin@innovatebf.org",
        password: "InnovateBF@2026!",
      },
    });

    if (result?.user) {
      console.log("✅ Admin créé:", result.user.email);

      // Mettre à jour le rôle en ADMINISTRATEUR directement dans Neon
      const { default: sql } = await import("../lib/db/neon");
      await sql`UPDATE "user" SET role = 'ADMINISTRATEUR' WHERE email = 'admin@innovatebf.org'`;
      console.log("✅ Rôle mis à jour: ADMINISTRATEUR");

      // Vérifier
      const [user] = await sql`SELECT id, name, email, role FROM "user" WHERE email = 'admin@innovatebf.org'`;
      console.log("\n📋 Compte admin:");
      console.log("   Email   :", user.email);
      console.log("   Nom     :", user.name);
      console.log("   Rôle    :", user.role);
      console.log("   ID      :", user.id);
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("already exists")) {
      console.log("ℹ️  Admin existe déjà — mise à jour du rôle...");
      const { default: sql } = await import("../lib/db/neon");
      await sql`UPDATE "user" SET role = 'ADMINISTRATEUR' WHERE email = 'admin@innovatebf.org'`;
      const [user] = await sql`SELECT email, role FROM "user" WHERE email = 'admin@innovatebf.org'`;
      console.log("✅ Rôle:", user?.role);
    } else {
      console.error("❌", e instanceof Error ? e.message : e);
    }
  }
}

createAdmin();
