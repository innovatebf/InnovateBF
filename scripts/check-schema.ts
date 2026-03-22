import sql from "../lib/db/neon";
async function check() {
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='ie_needs' ORDER BY ordinal_position`;
  console.log('Colonnes ie_needs:');
  cols.forEach((c: {column_name: string, data_type: string}) => console.log(' -', c.column_name, ':', c.data_type));
  
  const count = await sql`SELECT COUNT(*) FROM ie_needs`;
  console.log('Nb besoins en Neon:', count[0].count);
}
check();
