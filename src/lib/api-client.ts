/**
 * Client des endpoints JSON du site (formulaires publics et back-office).
 * Les erreurs de l'API ({ error: { code, message, fields } }) deviennent des ApiClientError.
 */

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

type Options = { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown; signal?: AbortSignal };

export async function api<T = unknown>(url: string, { method = "GET", body, signal }: Options = {}): Promise<T> {
  // Site public : la langue de la page (balise <html lang>) choisit la langue des messages de l'API
  const locale = url.startsWith("/api/public/") ? document.documentElement.lang : "";
  const en = locale === "en";
  const headers: Record<string, string> = {};
  if (!(body instanceof FormData) && body !== undefined) headers["Content-Type"] = "application/json";
  if (locale) headers["X-Site-Locale"] = locale;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      signal,
      credentials: "same-origin",
      headers,
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiClientError(
      0,
      "NETWORK_ERROR",
      en ? "Unable to connect. Check your connection and try again." : "Connexion impossible. Vérifiez votre connexion et réessayez.",
    );
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error ?? {};
    throw new ApiClientError(res.status, err.code ?? "ERROR", err.message ?? (en ? "An error occurred." : "Une erreur est survenue."), err.fields ?? {});
  }
  return data as T;
}
