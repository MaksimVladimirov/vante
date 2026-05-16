import { notFound } from "next/navigation";
import { LangProvider } from "@/shared/i18n/LangContext";
import { getDictionary } from "@/shared/i18n/getDictionary";
import { isLocale } from "@/shared/i18n/locales";
import { SetLang } from "@/shared/i18n/SetLang";
import { HeaderWrapper } from "@/widgets/header/ui/HeaderWrapper";
import { Footer } from "@/widgets/footer/ui/Footer";
import { CartDrawer } from "@/widgets/cart-drawer/ui/CartDrawer";

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <LangProvider lang={lang} dict={dict}>
      <SetLang lang={lang} />
      <HeaderWrapper lang={lang} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <CartDrawer />
    </LangProvider>
  );
}
