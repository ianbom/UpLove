import type { Metadata, Viewport } from "next";
import { Inter, Lato, Bodoni_Moda } from "next/font/google";
import { brand } from "@/config/brand";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShopProvider } from "@/components/layout/shop-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-lato", display: "swap" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: { default: `${brand.name} | ${brand.tagline}`, template: `%s | ${brand.name}` },
  description: brand.description,
  openGraph: { title: brand.name, description: brand.description, locale: "id_ID", type: "website", siteName: brand.name, images: [{ url: "/images/uplove-og.jpg", width: 1200, height: 630, alt: brand.name }] },
  twitter: { card: "summary_large_image", title: brand.name, description: brand.description, images: ["/images/uplove-og.jpg"] },
};
export const viewport: Viewport = { themeColor: "#F8F7F2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className={`${inter.variable} ${lato.variable} ${bodoni.variable}`}><body>
    <a href="#main-content" className="sr-only fixed left-4 top-2 z-[100] bg-background px-4 py-3 focus:not-sr-only">Langsung ke konten</a>
    <ShopProvider><Header /><main id="main-content" className="min-h-[65vh] pt-[81px]">{children}</main><Footer /></ShopProvider>
  </body></html>;
}
