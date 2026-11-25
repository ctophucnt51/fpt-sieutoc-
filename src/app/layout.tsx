import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileBar from "@/components/layout/StickyMobileBar";
import MetaPixel from "@/components/tracking/MetaPixel";
import GoogleAds from "@/components/tracking/GoogleAds";
import TrafficTracker from "@/components/tracking/TrafficTracker";
import { getDynamicConfig } from "@/lib/configStorage";
import { ConfigProvider } from "@/context/ConfigContext";
import { LeadModalProvider } from "@/context/LeadModalContext";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
  verification: {
    google: "Lj3Z-qZW24iZE3en8qrzyFuteloAASTXeebu0NN-4p4",
  },
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
        <Script
          id="gtm-n4vb2hj6-src"
          strategy="beforeInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-N4VB2HJ6"
        />
        <Script
          id="gtm-n4vb2hj6-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-[#2F364A] bg-[#F4F6FB] selection:bg-[#FFF4ED] selection:text-[#F37021]">
        <ConfigProvider initialConfig={dynamicConfig}>
          <LeadModalProvider>
            <MetaPixel />
            <GoogleAds />
            <TrafficTracker />
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
