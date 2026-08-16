// CLIENT ONLY — uses sessionStorage
const KEY = "ebc26_idempotency_key";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getOrCreateIdempotencyKey(): string {
  if (typeof window === "undefined") return uuid();
  const existing = window.sessionStorage.getItem(KEY);
  if (existing) return existing;
  const next = uuid();
  window.sessionStorage.setItem(KEY, next);
  return next;
}

export function resetIdempotencyKey(): void {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(KEY);
}
