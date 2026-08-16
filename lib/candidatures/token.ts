// SERVER ONLY — never import in client components or pages
import { randomBytes, createHash, timingSafeEqual } from "crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function genererSuiviToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hacherToken(tokenClair: string): string {
  return createHash("sha256").update(tokenClair).digest("hex");
}

export function genererDossierNumero(): string {
  const bloc = (): string => {
    const bytes = randomBytes(4);
    let out = "";
    for (let i = 0; i < 4; i++) out += ALPHABET[bytes[i]! % ALPHABET.length];
    return out;
  };
  return `EBC26-${bloc()}-${bloc()}`;
}

export function verifierToken(tokenClair: string, hashStocke: string): boolean {
  const hash = hacherToken(tokenClair);
  try {
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(hashStocke, "hex"));
  } catch {
    return false;
  }
}
