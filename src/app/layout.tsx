import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/*
 * Racine commune : le site public (app/[locale]) et le back-office (app/admin)
 * posent chacun leur balise <html>, avec la langue de la page.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Le gabarit « … · InnovateBF » est posé par chaque partie du site (app/[locale], app/admin)
  title: { default: "InnovateBF", template: "%s" },
};

export const viewport: Viewport = {
  themeColor: "#072a6b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
