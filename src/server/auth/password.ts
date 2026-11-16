import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { z } from "@/lib/zod-fr";

/**
 * Hachage des mots de passe avec scrypt (module crypto de Node.js) :
 * sel aléatoire de 16 octets, paramètres stockés avec le hachage.
 * Format : scrypt$N$r$p$sel$hachage (base64url)
 */

const N = 2 ** 15;
const R = 8;
const P = 1;
const KEYLEN = 64;
const MAXMEM = 128 * N * R * 2;

function derive(password: string, salt: Buffer, n: number, r: number, p: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEYLEN, { N: n, r, p, maxmem: MAXMEM }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, keyB64] = parts;
  const expected = Buffer.from(keyB64, "base64url");
  const key = await derive(password, Buffer.from(saltB64, "base64url"), Number(n), Number(r), Number(p));
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** Hachage factice : la vérification prend le même temps qu'un compte existe ou non. */
let dummyHash: Promise<string> | null = null;
export function getDummyHash() {
  dummyHash ??= hashPassword(randomBytes(24).toString("base64url"));
  return dummyHash;
}

/** Politique : 12 caractères minimum, avec au moins une lettre et un chiffre. */
export const passwordSchema = z
  .string()
  .min(12, "12 caractères minimum")
  .max(200, "200 caractères maximum")
  .refine((v) => /[A-Za-zÀ-ÿ]/.test(v) && /\d/.test(v), "Au moins une lettre et un chiffre");
