import { notFound } from "next/navigation";
import { LangProvider } from "@/shared/i18n/LangContext";
import { getDictionary } from "@/shared/i18n/getDictionary";
import { isLocale } from "@/shared/i18n/locales";
import { SetLang } from "@/shared/i18n/SetLang";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import { CartDrawer } from "@/widgets/cart-drawer/ui/CartDrawer";
import { fetchCategories } from "@/entities/product/model/api";
import { pick } from "@/shared/i18n/pick";
import styles from "./layout.module.css";

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const [dict, categories] = await Promise.all([
    getDictionary(lang),
    fetchCategories(),
  ]);

  const navLinks = categories.map((cat) => ({
    href: `/${lang}/${cat.slug}`,
    label: pick(lang, cat.name, cat.name_en),
  }));

  return (
    <LangProvider lang={lang} dict={dict}>
      <SetLang lang={lang} />
      <Header lang={lang} navLinks={navLinks.length > 0 ? navLinks : undefined} />
      <main className={styles.main}>{children}</main>
      <Footer lang={lang} dict={dict} categories={categories} />
      <CartDrawer />
    </LangProvider>
  );
}
