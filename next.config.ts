import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Stockage Supabase : images de la médiathèque, pièces jointes envoyées depuis le navigateur
const storageOrigin = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "") ?? "";
const storageSource = storageOrigin && ` ${storageOrigin}`;

/**
 * Politique de sécurité du contenu : scripts et styles du site uniquement
 * (Next.js injecte des scripts en ligne), images du site et du stockage Supabase,
 * aucun cadre externe, formulaires vers le site uniquement.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${storageSource}`,
  "font-src 'self'",
  `connect-src 'self'${storageSource}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: storageOrigin ? [{ protocol: "https", hostname: new URL(storageOrigin).hostname, pathname: "/storage/v1/object/public/**" }] : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Images de la médiathèque : aucune exécution possible, même ouvertes directement
      { source: "/media/:file*", headers: [{ key: "Content-Security-Policy", value: "default-src 'none'; img-src 'self'; sandbox" }] },
    ];
  },
  // Anciennes adresses du site innovatebf.org : aucun lien existant ne doit casser
  async redirects() {
    return [
      { source: "/submit/ebc26/soumettre", destination: "/innovons/conference/candidater", permanent: true },
      { source: "/submit/ebc26", destination: "/innovons/conference/appel-a-contributions", permanent: true },
    ];
  },
};

export default nextConfig;
