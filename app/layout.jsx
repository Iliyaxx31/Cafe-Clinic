import "./globals.css";
import Script from "next/script";
import { Vazirmatn, Rubik } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadataBase = new URL("https://www.cafe-clinic-amol.ir");

export const metadata = {
  title: "Cafe Clinic Amol | کافه کلینیک آمل | منوی دیجیتال و سفارش آنلاین",
  description:
    "Cafe Clinic Amol - منوی دیجیتال کافه کلینیک آمل. قهوه تخصصی، نوشیدنی‌های سرد و گرم، دسر و سفارش آنلاین. بهترین کافه آمل | Digital menu coffee shop in Amol",
  keywords: [
    "cafe clinic amol",
    "cafe amol",
    "coffee amol",
    "کافه کلینیک آمل",
    "منوی دیجیتال آمل",
    "قهوه آمل",
    "کافی شاپ آمل",
    "کافه آمل",
    "نوشیدنی آمل",
    "منوی کافه کلینیک آمل",
    "سفارش آنلاین کافه آمل",
    "قهوه تخصصی آمل",
  ],
  authors: [{ name: "Cafe Clinic Amol" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cafe Clinic Amol | کافه کلینیک آمل",
    description:
      "منوی دیجیتال کافه کلینیک آمل - قهوه تخصصی، نوشیدنی‌های سرد و گرم، دسر و سفارش آنلاین",
    url: "https://www.cafe-clinic-amol.ir",
    siteName: "Cafe Clinic Amol",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cafe Clinic Amol - کافه کلینیک آمل",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cafe Clinic Amol | کافه کلینیک آمل",
    description:
      "منوی دیجیتال کافه کلینیک آمل - قهوه تخصصی، نوشیدنی‌های سرد و گرم، دسر و سفارش آنلاین",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.cafe-clinic-amol.ir",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" className={`${vazirmatn.variable} ${rubik.variable}`}>
      <head>
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Cafe",
              name: "Cafe Clinic Amol",
              description:
                "منوی دیجیتال کافه کلینیک آمل - قهوه تخصصی، نوشیدنی‌های سرد و گرم، دسر و سفارش آنلاین",
              url: "https://www.cafe-clinic-amol.ir",
              telephone: "۰۹۰۱۷۸۳۱۲۹۸",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Amol",
                addressCountry: "IR",
              },
              openingHours: "Mo-Su 08:00-23:00",
              servesCuisine: "Coffee, Tea, Desserts",
              image: "https://www.cafe-clinic-amol.ir/og-image.jpg",
              hasMenu: "https://www.cafe-clinic-amol.ir",
            }),
          }}
        />
      </head>
      <body className={`${vazirmatn.className} antialiased`}>{children}</body>
    </html>
  );
}