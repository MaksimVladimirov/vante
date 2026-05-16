import Link from "next/link";
import { supabase } from "@/shared/api/supabase";
import styles from "./Hero.module.css";

const DEFAULTS = {
  desktop: "/images/hero.jpg",
  tablet: "/images/hero.jpg",
  mobile: "/images/hero.jpg",
  eyebrow: "Новая коллекция",
  title: "Вне\nвремени",
  subtitle: "Создано для уверенности.",
  ctaText: "Смотреть коллекцию",
  ctaLink: "/suits",
};

async function getHeroSettings() {
  try {
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Record<string, string> = {};
    data?.forEach((row) => {
      map[row.key] = row.value ?? "";
    });

    const desktopImg =
      map.hero_image_desktop || map.hero_image || DEFAULTS.desktop;
    const tabletImg = map.hero_image_tablet || desktopImg;
    const mobileImg = map.hero_image_mobile || tabletImg;

    return {
      desktop: desktopImg,
      tablet: tabletImg,
      mobile: mobileImg,
      eyebrow: map.hero_eyebrow || DEFAULTS.eyebrow,
      title: map.hero_title || DEFAULTS.title,
      subtitle: map.hero_subtitle || DEFAULTS.subtitle,
      ctaText: map.hero_cta_text || DEFAULTS.ctaText,
      ctaLink: map.hero_cta_link || DEFAULTS.ctaLink,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function Hero() {
  const s = await getHeroSettings();

  return (
    <section className={styles.hero}>
      <picture className={styles.picture}>
        {/* Desktop ≥ 992px */}
        <source media="(min-width: 992px)" srcSet={s.desktop} />
        {/* Tablet 768–991px */}
        <source media="(min-width: 768px)" srcSet={s.tablet} />
        {/* Mobile < 768px */}
        <img
          src={s.mobile}
          alt="MVXIII hero"
          className={styles.bg}
          fetchPriority="high"
          loading="eager"
        />
      </picture>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{s.eyebrow}</p>
        <h1 className={styles.title}>
          {s.title.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>{s.subtitle}</p>
        <Link href={s.ctaLink} className={styles.cta}>
          {s.ctaText}
        </Link>
      </div>
    </section>
  );
}
