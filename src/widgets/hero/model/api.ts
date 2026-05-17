import { supabase } from "@/shared/api/supabase";
import type { Locale } from "@/shared/i18n/locales";
import { pick } from "@/shared/i18n/pick";
import { DEFAULT_HERO } from "./defaults";

export async function getHeroSettings(lang: Locale) {
  try {
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Record<string, string> = {};
    data?.forEach((row) => {
      map[row.key] = row.value ?? "";
    });

    const defaults = DEFAULT_HERO[lang];
    const desktopImg =
      map.hero_image_desktop || map.hero_image || "/images/hero.jpg";
    const tabletImg = map.hero_image_tablet || desktopImg;
    const mobileImg = map.hero_image_mobile || tabletImg;

    return {
      desktop: desktopImg,
      tablet: tabletImg,
      mobile: mobileImg,
      eyebrow:
        pick(lang, map.hero_eyebrow, map.hero_eyebrow_en) || defaults.eyebrow,
      title: pick(lang, map.hero_title, map.hero_title_en) || defaults.title,
      subtitle:
        pick(lang, map.hero_subtitle, map.hero_subtitle_en) ||
        defaults.subtitle,
      ctaText:
        pick(lang, map.hero_cta_text, map.hero_cta_text_en) || defaults.ctaText,
      ctaLink: map.hero_cta_link || defaults.ctaLink,
    };
  } catch {
    return {
      ...DEFAULT_HERO[lang],
      desktop: "/images/hero.jpg",
      tablet: "/images/hero.jpg",
      mobile: "/images/hero.jpg",
    };
  }
}
