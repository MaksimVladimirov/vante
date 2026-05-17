import Link from "next/link";
import Image from "next/image";
import { ArrowRightOutlined } from "@ant-design/icons";
import { supabase } from "@/shared/api/supabase";
import type { Locale } from "@/shared/i18n/locales";
import type { Dictionary } from "@/shared/i18n/getDictionary";
import { pick } from "@/shared/i18n/pick";
import styles from "./CategorySection.module.css";

const FALLBACK_IMAGES: Record<string, string> = {
  suits: "/images/category-suits.jpg",
  shirts: "/images/category-shirts.jpg",
  accessories: "/images/category-accessories.jpg",
};

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export async function CategorySection({ lang, dict }: Props) {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at");
  if (!categories?.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{dict.categories.heading}</h2>
      <div className={styles.grid}>
        {categories.map((cat) => {
          const image = cat.image_url || FALLBACK_IMAGES[cat.slug] || null;
          return (
            <Link
              key={cat.slug}
              href={`/${lang}/catalog/${cat.slug}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                {image ? (
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
              </div>
              <div>
                <p className={styles.categoryName}>
                  {pick(lang, cat.name, cat.name_en)}
                </p>
                <span className={styles.viewAll}>
                  {dict.categories.viewAll} <ArrowRightOutlined />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
