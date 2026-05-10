import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/shared/api/supabase";
import styles from "./Hero.module.css";

const DEFAULTS = {
  image: "/images/hero.jpg",
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
    return {
      image: map.hero_image || DEFAULTS.image,
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
  const isExternal = s.image.startsWith("http");

  return (
    <section className={styles.hero}>
      <Image
        src={s.image}
        alt="MVXIII hero"
        fill
        className={styles.bg}
        priority
        unoptimized={isExternal}
      />
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
