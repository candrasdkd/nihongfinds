import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nihong Finds — Jastip Jepang Terpercaya",
    template: "%s | Nihong Finds",
  },
  description:
    "Kurasi pilihan barang langsung dari pusat trend Tokyo. Jastip aman, terpercaya, dan transparan. Pembayaran via QRIS.",
  keywords: ["jastip jepang", "jastip tokyo", "barang jepang", "nihong finds", "titip beli jepang"],
  authors: [
    { name: "Candra Sidik Dermawan" },
    { name: "Diny Kumala Firdaus" },
  ],
  openGraph: {
    title: "Nihong Finds — Jastip Jepang Terpercaya",
    description: "Kurasi pilihan barang langsung dari pusat trend Tokyo. Aman, terpercaya, dan transparan.",
    type: "website",
    locale: "id_ID",
    siteName: "Nihong Finds",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nihong Finds",
    description: "Jastip Jepang langsung dari Tokyo.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
