import sql from "../lib/db/neon";

async function migrateAuth() {
  console.log("[migrate-auth] Creating better-auth tables on Neon...");

  try {
    // Create user table
    await sql`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
        image TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        role TEXT NOT NULL DEFAULT 'UTILISATEUR'
      )
    `;
    console.log("[migrate-auth] Created table: user");

    // Create session table
    await sql`
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        token TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
      )
    `;
    console.log("[migrate-auth] Created table: session");

    // Create account table
    await sql`
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" TIMESTAMPTZ,
        "refreshTokenExpiresAt" TIMESTAMPTZ,
        scope TEXT,
        password TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    console.log("[migrate-auth] Created table: account");

    // Create verification table
    await sql`
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ,
        "updatedAt" TIMESTAMPTZ
      )
    `;
    console.log("[migrate-auth] Created table: verification");

    console.log("[migrate-auth] All better-auth tables created successfully.");
  } catch (error) {
    console.error("[migrate-auth] Migration failed:", error);
    process.exit(1);
  }
}

migrateAuth();
