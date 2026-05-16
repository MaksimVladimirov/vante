import Link from "next/link";
import { pick } from "@/shared/i18n/pick";
import type { Locale } from "@/shared/i18n/locales";
import type { Dictionary } from "@/shared/i18n/getDictionary";
import type { Category } from "@/entities/product/model/types";
import styles from "./Footer.module.css";

interface Props {
  lang: Locale;
  dict: Dictionary;
  categories: Category[];
}

export function Footer({ lang, dict, categories }: Props) {
  const f = dict.footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.mainInner}>
          <div>
            <Link href={`/${lang}`} className={styles.brand}>
              MVXIII
            </Link>
            <p className={styles.brandSub}>by Maxim Vladimirov</p>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>{f.shop}</p>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${lang}/${cat.slug}`} className={styles.colLink}>
                {pick(lang, cat.name, cat.name_en)}
              </Link>
            ))}
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>{f.help}</p>
            <Link href={`/${lang}/shipping`} className={styles.colLink}>
              {f.shipping}
            </Link>
            <Link href={`/${lang}/returns`} className={styles.colLink}>
              {f.returns}
            </Link>
            <Link href={`/${lang}/faq`} className={styles.colLink}>
              {f.faq}
            </Link>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>{f.contact}</p>
            <Link href="mailto:hello@mvxiii.ru" className={styles.colLink}>
              {f.contactUs}
            </Link>
            <Link href={`/${lang}/careers`} className={styles.colLink}>
              {f.careers}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          © {new Date().getFullYear()} MVXIII by Maxim Vladimirov. {f.rights}
        </div>
      </div>
    </footer>
  );
}
