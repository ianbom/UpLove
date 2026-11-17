import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";

export function generateStaticParams() { return products.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const p = products.find(p => p.slug === slug);
  return p ? { title: p.name, description: p.description, openGraph: { title: `${p.name} | UpLove`, description: p.description, images: [{ url: p.images[0], alt: p.name }] } } : { title: "Produk tidak ditemukan" };
}
export default async function ProductPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ size?: string }> }) {
  const { slug } = await params; const { size } = await searchParams; const product = products.find(p => p.slug === slug);
  if (!product) notFound();
  const related = products.filter(p => p.category === product.category && p.id !== product.id).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  return <div className="container-shop pb-16 pt-12 md:pt-16"><ProductDetail key={`${product.id}-${size || ""}`} product={product} initialSize={size} /><section className="pb-4"><h2 className="editorial-heading mb-8 text-2xl">Related Products</h2><div className="mx-auto grid w-full grid-cols-2 gap-x-4 gap-y-10 md:w-4/5 md:grid-cols-4 md:gap-6">{related.map(p => <ProductCard key={p.id} product={p} />)}</div></section></div>;
}
