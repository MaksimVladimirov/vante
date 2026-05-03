import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { antdTheme } from '@/shared/config/antd-theme';
import { Header } from '@/widgets/header/ui/Header';
import { Footer } from '@/widgets/footer/ui/Footer';
import { CartDrawer } from '@/widgets/cart-drawer/ui/CartDrawer';
import './globals.css';

export const metadata: Metadata = {
  title: 'vanté by Maxim Vladimirov',
  description: 'Создано для уверенности. Откройте нашу коллекцию костюмов, рубашек и аксессуаров.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={antdTheme}>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <CartDrawer />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
