import type { Locale } from "@/shared/i18n/locales";
import { pick } from "@/shared/i18n/pick";
import type { Category } from "@/entities/product/model/types";
import { Header } from "./Header";

interface Props {
  lang: Locale;
  categories: Category[];
}

export function HeaderWrapper({ lang, categories }: Props) {
  const navLinks = categories.map((cat) => ({
    href: `/${lang}/${cat.slug}`,
    label: pick(lang, cat.name, cat.name_en),
  }));

  return (
    <Header lang={lang} navLinks={navLinks.length > 0 ? navLinks : undefined} />
  );
}
