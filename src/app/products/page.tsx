import type { Metadata } from "next";
import { Catalogue, type CatalogueQuery } from "@/components/product/catalogue";
export const metadata: Metadata = { title: "All Products", description: "Pilihan kebaya, dress, dan ready-to-wear UpLove. Temukan ukuran, warna, dan koleksi Anda." };
export default async function ProductsPage({ searchParams }: { searchParams: Promise<CatalogueQuery> }) { return <Catalogue query={await searchParams} />; }
