"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fait apparaître les éléments marqués data-reveal quand ils entrent à l'écran
 * (styles dans globals.css). Relancé à chaque changement de page.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    (window as Window & { __revealReady?: boolean }).__revealReady = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // Contenus ajoutés après coup (onglets, filtres, formulaires)
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

/**
 * Script en ligne (avant l'affichage) : active les animations seulement si
 * JavaScript s'exécute, et les annule si la page ne s'hydrate pas en 4 s.
 */
export const revealBootScript = `(function(){var d=document.documentElement;d.classList.add("reveal-on");setTimeout(function(){if(!window.__revealReady)d.classList.remove("reveal-on")},4000)})();`;
