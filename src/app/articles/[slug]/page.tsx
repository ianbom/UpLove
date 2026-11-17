import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return articles.map(article => ({ slug: article.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const article = articles.find(item => item.slug === slug); return article ? { title: article.title, description: article.excerpt } : { title: "Artikel tidak ditemukan" }; }

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  return <article className="container-shop py-12 md:py-16"><div className="mx-auto max-w-4xl"><Link href="/articles" className="text-link mb-8 inline-flex min-h-11 items-center text-sm underline">Kembali ke jurnal</Link><header className="mb-9 text-center"><p className="mb-4 text-xs tracking-[.18em] text-primary">{article.category}</p><h1 className="editorial-heading text-4xl leading-tight md:text-6xl">{article.title}</h1><p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">{article.excerpt}</p></header><div className="relative aspect-[4/3] bg-secondary md:aspect-[16/9]"><Image src={article.image} alt={article.title} fill priority sizes="(max-width: 900px) 100vw, 896px" className="object-cover" /></div><div className="prose-shop mx-auto max-w-2xl py-6">{article.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}<div className="mt-10 border-t border-border pt-7"><Link href="/products" className="text-link inline-flex min-h-11 items-center font-semibold underline">Jelajahi koleksi UpLove</Link></div></div></div></article>;
}
