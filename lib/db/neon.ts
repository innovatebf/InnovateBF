import { neon } from "@neondatabase/serverless";

type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<any[]>;

let _sql: ReturnType<typeof neon> | null = null;

export function getSql(): SqlTag {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql as unknown as SqlTag;
}
