import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { settings } from "@/config/settings";
import { CommonParentProps } from "@/types/global";
import PWAInstallProvider from "@/contexts/PWAInstallContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(settings.url),

  title: {
    default: "سما بلودان للمقاولات والعقارات",
    template: "%s | سما بلودان",
  },

  description:
    "منصة سما بلودان لخدمات المقاولات والعقارات والمشاريع الهندسية الاستثمارية في العالم العربي.",

  keywords: [
    "سما بلودان",
    "سما بلودان للمقاولات والعقارات",
    "إدارة العقارات",
    "مقاولات هندسية",
    "شقق للبيع والايجار",
    "Sama Bludan",
    "Sama Bludan Real Estate",
    "Contracting & Engineering",
  ],

  openGraph: {
    siteName: "Sama Bludan - Contracting & Real Estate Services",
    locale: "ar_SA",
    type: "website",
    url: settings.url,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "سما بلودان للمقاولات والعقارات | Sama Bludan",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "سما بلودان للمقاولات والعقارات | Sama Bludan",
    description: "منصة سما بلودان لخدمات المقاولات والعقارات والمشاريع الهندسية",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children, }: CommonParentProps) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${ibmPlexArabic.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-background text-text font-sans">
        <PWAInstallProvider>
          {children}
        </PWAInstallProvider>
      </body>
    </html>
  );
}