import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/assets";
import { products } from "@/data/products";
import { Hero } from "@/components/home/hero";
import { HomeGallery } from "@/components/home/home-gallery";
import { ProductCard } from "@/components/product/product-card";

const featured = ["uplove-016", "uplove-017", "uplove-013", "uplove-015"].map(id => products.find(p => p.id === id)!);
const ready = ["uplove-009", "uplove-022", "uplove-024", "uplove-038"].map(id => products.find(p => p.id === id)).filter(p => p && p.readyStock);
const readyProducts = [...ready, ...products.filter(p => p.readyStock && !ready.some(r => r?.id === p.id))].slice(0, 4);

export default function HomePage() {
  return <>
    <Hero />
    <section className="bg-beige/20 py-12 md:py-16"><div className="container-shop"><h2 className="section-heading">ALUNA COLLECTION</h2><div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-12 md:grid-cols-4 md:gap-6">{featured.map(product => <ProductCard product={product} key={product.id} />)}</div><div className="mt-12 text-center md:mt-16"><Link href="/category/aluna" className="primary-link">Lihat Semua Aluna</Link></div></div></section>
    <section className="py-8 md:py-16"><div className="container-shop"><Link href="/store-location" className="group relative block aspect-[1200/490] overflow-hidden rounded-sm bg-beige"><Image src={assets.atelier} alt="Ruang inspirasi dan pilihan busana UpLove" fill sizes="(max-width: 1280px) 100vw, 1248px" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" /><div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/25 to-transparent" /><div className="absolute inset-y-0 left-[6%] flex w-[43%] flex-col justify-center text-ivory"><h2 className="editorial-heading text-[clamp(20px,4vw,56px)] leading-[1.05]">A World of<br />Quiet Elegance</h2><p className="mt-2 max-w-xs text-[8px] leading-relaxed sm:text-xs md:mt-5 md:text-sm">Kenali siluet dan detail yang menjadi bahasa UpLove.</p><span className="mt-3 hidden w-fit border-b border-ivory pb-1 text-xs uppercase tracking-wide sm:block">Tentang Atelier</span></div></Link></div></section>
    <section className="py-12 md:py-16"><div className="container-shop"><h2 className="section-heading">READY STOCK</h2><div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-12 md:grid-cols-4 md:gap-6">{readyProducts.map(product => product && <ProductCard product={product} key={product.id} showSizes />)}</div><div className="mt-12 text-center md:mt-16"><Link href="/category/ready-stock" className="primary-link">Lihat Semua Ready Stock</Link></div></div></section>
    <section className="py-8 md:py-12"><div className="container-shop grid gap-4 md:grid-cols-2 md:gap-6">{[{ name: "Dress", image: assets.dress, href: "/category/dress" }, { name: "Kebaya", image: assets.kebaya, href: "/category/kebaya" }].map(category => <Link key={category.name} href={category.href} className="group relative aspect-square overflow-hidden rounded-sm bg-beige"><Image src={category.image} alt={`Koleksi ${category.name} UpLove`} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-charcoal/80 to-transparent" /><div className="absolute inset-x-0 bottom-6 text-center text-ivory md:bottom-8"><h2 className="editorial-heading text-5xl leading-[.9] md:text-6xl">{category.name}<span className="mt-2 block text-[23px] not-italic uppercase md:text-[28px]">Collection</span></h2><span className="primary-link mt-5 px-6">Shop Now</span></div></Link>)}</div></section>
    <HomeGallery />
  </>;
}
