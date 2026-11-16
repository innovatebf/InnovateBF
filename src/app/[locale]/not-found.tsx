import { PageHero } from "@/components/ui";
import { getT } from "@/i18n/server";
import { Link } from "@/i18n/Link";
import { CONFERENCE_BASE } from "@/lib/site";

export default function NotFound() {
  const t = getT();
  return (
    <PageHero
      label={t("Erreur 404", "Error 404")}
      title={t("Page introuvable", "Page not found")}
      lead={t("Cette page a peut-être été déplacée ou n'existe plus.", "This page may have been moved or no longer exists.")}
      actions={
        <>
          <Link href="/" className="btn btn-primary">
            {t("Retour à l'accueil", "Back to home")}
          </Link>
          <Link href={CONFERENCE_BASE} className="btn btn-line">
            {t("Conférence EBC2026", "EBC2026 Conference")}
          </Link>
        </>
      }
    />
  );
}
