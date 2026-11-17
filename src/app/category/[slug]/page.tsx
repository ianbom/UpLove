import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalogue, type CatalogueQuery } from "@/components/product/catalogue";
import { collections } from "@/data/collections";
const names: Record<string, string> = { dress: "Dress", kebaya: "Kebaya", "ready-to-wear": "Ready-to-Wear" };
const getName = (slug: string) => Object.hasOwn(names, slug) ? names[slug] : collections.find(c => c.slug === slug)?.name;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: getName(slug) || "Koleksi", description: `Pilihan ${getName(slug) || "busana"} UpLove. Temukan siluet dan detail untuk momen Anda.` }; }
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<CatalogueQuery> }) { const { slug } = await params; if (!getName(slug)) notFound(); return <Catalogue baseSlug={slug} query={await searchParams} />; }
