import Link from "next/link";
import { fontVariables } from "./fonts";

/** Adresse inconnue hors du site public (le site public a sa propre page 404, dans chaque langue). */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="grid min-h-dvh place-items-center bg-[#f3f6fa] p-6 text-center">
        <main>
          <p className="label">Erreur 404 · Error 404</p>
          <h1 className="mt-3 text-3xl font-bold text-navy">Page introuvable · Page not found</h1>
          <p className="mt-6">
            <Link href="/" className="btn btn-primary">
              Accueil · Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
