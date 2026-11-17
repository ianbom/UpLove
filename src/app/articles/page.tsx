import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/articles";

export const metadata: Metadata = { title: "Jurnal UpLove", description: "Catatan tentang perawatan kebaya, panduan ukuran, dan inspirasi memilih busana untuk momen istimewa." };

export default function ArticlesPage() {
  return <div className="container-shop py-14 md:py-20"><header className="mb-12 text-center md:mb-16"><p className="mb-4 text-xs tracking-[.2em] text-primary">CATATAN DARI UpLove</p><h1 className="editorial-heading text-5xl md:text-6xl">Jurnal UpLove</h1><p className="mt-5 text-muted-foreground">Tentang busana, detail, dan cerita di antaranya.</p></header><div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{articles.map(article => <article key={article.slug}><Link href={`/articles/${article.slug}`} className="group block"><div className="relative aspect-[4/5] overflow-hidden bg-secondary"><Image src={article.image} alt={article.title} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><p className="mb-3 mt-6 text-[11px] tracking-[.16em] text-primary">{article.category}</p><h2 className="editorial-heading text-3xl leading-tight">{article.title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{article.excerpt}</p><span className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-wider underline underline-offset-4">Baca selengkapnya</span></Link></article>)}</div></div>;
}
