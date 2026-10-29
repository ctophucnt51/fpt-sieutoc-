import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileBar from "@/components/layout/StickyMobileBar";
import MetaPixel from "@/components/tracking/MetaPixel";
import GoogleAds from "@/components/tracking/GoogleAds";
import { getDynamicConfig } from "@/lib/configStorage";
import { ConfigProvider } from "@/context/ConfigContext";
import { LeadModalProvider } from "@/context/LeadModalContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F37021",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.brand.domain),
  title: {
    default: `${siteConfig.brand.name} | Đăng Ký Internet Wi-Fi 6, Truyền Hình FPT Play & Thể Thao Ngoại Hạng Anh`,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.description,
  keywords: [
    "lắp mạng fpt",
    "internet fpt",
    "wifi 6 fpt",
    "combo ngoại hạng anh fpt",
    "truyền hình fpt play",
    "fpt camera",
    "gói cước fpt",
    "đăng ký wifi fpt",
  ],
  authors: [{ name: siteConfig.brand.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.brand.domain,
    siteName: siteConfig.brand.name,
    title: `${siteConfig.brand.name} - Internet Wi-Fi 6 & Ngoại Hạng Anh FPT`,
    description: siteConfig.brand.description,
    images: [
      {
        url: "/images/banners/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.brand.name} - Lắp Mạng FPT Wi-Fi 6`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brand.name,
    description: siteConfig.brand.description,
    images: ["/images/banners/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dynamicConfig = getDynamicConfig();

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-800 bg-white selection:bg-orange-100 selection:text-fpt-dark">
        <ConfigProvider initialConfig={dynamicConfig}>
          <LeadModalProvider>
            <MetaPixel />
            <GoogleAds />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <StickyMobileBar />
          </LeadModalProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
