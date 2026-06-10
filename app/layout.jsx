import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Cafe Clinic Amol | کافه کلینیک آمل | Digital Menu",
  description: "Cafe Clinic Amol - منوی دیجیتال کافه کلینیک آمل | قهوه، نوشیدنی سرد، شیک، چای | Caffe Clinic Amol digital menu",
  keywords: "cafe clinic amol, caffe clinic amol, کافه کلینیک آمل, منوی دیجیتال آمل, کافه آمل, قهوه آمل, cafe amol, coffee amol",
  authors: [{ name: "Cafe Clinic Amol" }],
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Cafe Clinic Amol | کافه کلینیک آمل",
    description: "منوی دیجیتال کافه کلینیک آمل - قهوه، نوشیدنی سرد، شیک، چای و دمنوش",
    url: "https://cafe-clinici-amol.apps.teh2.abrhapaas.com",
    siteName: "Cafe Clinic Amol",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Cafe Clinic Amol" }],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cafe Clinic Amol | کافه کلینیک آمل",
    description: "منوی دیجیتال کافه کلینیک آمل",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://cafe-clinici-amol.apps.teh2.abrhapaas.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}