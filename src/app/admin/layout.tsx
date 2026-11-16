import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Back-office InnovateBF" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <div className="min-h-dvh bg-[#f3f6fa] font-[family-name:var(--font-roboto)] text-[15px] text-ink">{children}</div>
      </body>
    </html>
  );
}
