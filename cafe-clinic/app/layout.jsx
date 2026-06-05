import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Cafe Clinic | منوی دیجیتال",
//   description:
//     "Cafe Clinic منوی دیجیتال - قهوه، نوشیدنی‌های سرد، شیک، چای و دمنوش",
//   keywords:
//     "cafe, menu, coffee, digital menu, کافه, منوی دیجیتال, قهوه, کافه کلینیک",
//   authors: [{ name: "Cafe Clinic" }],
//   viewport:
//     "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes",
//   robots: "index, follow",
//   icons: {
//     icon: "/favicon.ico",
//     apple: "/icon-192.png",
//   },
//   openGraph: {
//     title: "Cafe Clinic | منوی دیجیتال",
//     description: "به منوی دیجیتال Cafe Clinic خوش آمدید",
//     url: "https://cafeclinic.com",
//     siteName: "Cafe Clinic",
//     images: [
//       {
//         url: "/og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Cafe Clinic Menü",
//       },
//     ],
//     locale: "fa_IR",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Cafe Clinic | منوی دیجیتال",
//     description: "به منوی دیجیتال Cafe Clinic خوش آمدید",
//     images: ["/og-image.jpg"],
//   },
//   alternates: {
//     canonical: "https://cafeclinic.com",
//   },
// };

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <head></head>
      <body className={inter.className}>
        <Script
  strategy="afterInteractive"
  src="/api/socket"
/>
        {children}</body>
    </html>
  );
}
