import sql from "../lib/db/neon";
async function run() {
  const rows = await sql`SELECT id, titre, statut, porteur_email, created_at FROM ie_proposals ORDER BY created_at DESC LIMIT 3`;
  console.log("Proposals en Neon:", rows.length);
  rows.forEach((r: {titre:string, statut:string, porteur_email:string}) => 
    console.log(" -", r.titre?.slice(0,50), "|", r.statut, "|", r.porteur_email)
  );
  const needs = await sql`SELECT id, titre, statut FROM ie_needs ORDER BY created_at DESC LIMIT 3`;
  console.log("\nBesoins en Neon:", needs.length);
  needs.forEach((n: {titre:string, statut:string}) => console.log(" -", n.titre?.slice(0,50), "|", n.statut));
}
run().catch(e => console.error("❌", e instanceof Error ? e.message : e));
