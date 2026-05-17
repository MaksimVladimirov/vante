import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import { antdTheme } from "@/shared/config/antd-theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "MVXIII by Maxim Vladimirov",
  description: "Откройте нашу коллекцию костюмов, рубашек и аксессуаров.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <ConfigProvider theme={antdTheme}>
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
