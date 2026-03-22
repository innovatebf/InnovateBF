/**
 * Script de configuration des URLs de redirection Supabase
 *
 * Usage:
 *   SUPABASE_PROJECT_REF=xxxxx SUPABASE_ACCESS_TOKEN=sbp_xxx npx tsx scripts/setup-supabase-auth.ts
 *
 * Où trouver ces valeurs :
 *   - SUPABASE_PROJECT_REF : https://supabase.com/dashboard/project/_/settings/general (ex: "abcdefghijklm")
 *   - SUPABASE_ACCESS_TOKEN : https://supabase.com/dashboard/account/tokens → "Generate new token"
 */

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

const REDIRECT_URLS = [
  "http://localhost:3001/innovons/reset-password",
  "http://localhost:3001/innovons/connexion",
  "https://innovatebf.org/innovons/reset-password",
  "https://innovatebf.org/innovons/connexion",
  "https://innovatebf.vercel.app/innovons/reset-password",
  "https://innovatebf.vercel.app/innovons/connexion",
];

const SITE_URL = "https://innovatebf.org";

async function configureSupabaseAuth() {
  if (!PROJECT_REF || !ACCESS_TOKEN) {
    console.error(`
❌ Variables d'environnement manquantes.

Usage:
  SUPABASE_PROJECT_REF=xxxxx SUPABASE_ACCESS_TOKEN=sbp_xxx npx tsx scripts/setup-supabase-auth.ts

Où trouver ces valeurs :
  - SUPABASE_PROJECT_REF  → https://supabase.com/dashboard/project/_/settings/general
  - SUPABASE_ACCESS_TOKEN → https://supabase.com/dashboard/account/tokens
`);
    process.exit(1);
  }

  const apiUrl = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;

  console.log(`🔧 Configuration Supabase Auth pour le projet: ${PROJECT_REF}`);
  console.log(`📍 URLs à configurer:\n${REDIRECT_URLS.map(u => `   • ${u}`).join("\n")}\n`);

  try {
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_url: SITE_URL,
        uri_allow_list: REDIRECT_URLS.join(","),
        mailer_autoconfirm: false,
        smtp_admin_email: "noreply@innovatebf.org",
        smtp_sender_name: "InnovateBF",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error ${response.status}: ${error}`);
    }

    const result = await response.json() as Record<string, unknown>;
    console.log("✅ Configuration Supabase Auth mise à jour !");
    console.log("   site_url:", result.site_url);
    console.log("   uri_allow_list:", result.uri_allow_list);

  } catch (err) {
    console.error("❌ Erreur:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

configureSupabaseAuth();
