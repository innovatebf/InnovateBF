"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { useT } from "@/i18n/client";
import { Link } from "@/i18n/Link";
import type { CollectionData } from "@/lib/content/definitions";
import styles from "./landing.module.css";

const AUTOPLAY_MS = 6500;

/**
 * Carrousel « À la une » : défilement natif (glisser au doigt), points de
 * navigation et lecture automatique, suspendue au survol, au focus clavier
 * et si l'utilisateur limite les animations.
 */
export function FeaturedCarousel({ slides }: { slides: CollectionData<"highlights">[] }) {
  const t = useT();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) go((index + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, index, slides.length, go]);

  if (slides.length === 0) return null;

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription={t("carrousel", "carousel")}
      aria-label={t("À la une", "Featured")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={track} className={styles.track}>
        {slides.map((s, i) => (
          <Link
            key={i}
            href={s.href}
            className={styles.slide}
            aria-roledescription={t("diapositive", "slide")}
            aria-label={t(`${s.title} (${i + 1} sur ${slides.length})`, `${s.title} (${i + 1} of ${slides.length})`)}
          >
            {s.image.src && (
              <Image
                src={s.image.src}
                alt={s.image.alt}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className={styles.slideImg}
                priority={i === 0}
              />
            )}
            <span className={styles.slideShade} aria-hidden="true" />
            <span className={styles.slideBody}>
              {s.badge && <span className={styles.slideBadge}>{s.badge}</span>}
              <span className={styles.slideTitle}>{s.title}</span>
              <span className={styles.slideText}>{s.text}</span>
            </span>
            <span className={styles.slideArrow} aria-hidden="true">
              <Icon name="arrow" className="size-5" strokeWidth={2.2} />
            </span>
          </Link>
        ))}
      </div>
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              className={styles.dot}
              aria-label={t(`Afficher : ${s.title}`, `Show: ${s.title}`)}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
