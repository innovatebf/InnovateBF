"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

export default function RegulariserPage() {
  const t = useTranslations("candidatures.regularisation");
  const te = useTranslations("candidatures.erreurs");
  const { token, locale } = useParams<{ token: string; locale: string }>();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/candidatures/ebc26/${token}/regularisation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demonstrateur_url: url || undefined }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? te("reseau"));
        return;
      }
      router.push(`/${locale}/submit/ebc26/suivi/${token}`);
    } catch {
      setError(te("reseau"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{t("titre")}</h1>
      <p className="mb-6 text-sm text-gray-600">{t("aide")}</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="demo_url" className="mb-1.5 block text-sm font-medium text-gray-700">
            {locale === "fr" ? "Lien démonstrateur (facultatif)" : "Demonstrator link (optional)"}
          </label>
          <input
            id="demo_url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#b70011] focus:outline-none focus:ring-2 focus:ring-[#b70011]/20"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010] disabled:opacity-60"
        >
          {loading ? "…" : t("confirmer")}
        </button>
      </form>
    </main>
  );
}
