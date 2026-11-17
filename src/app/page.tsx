import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { assets } from "@/data/assets";
import { products } from "@/data/products";
import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/product/product-card";
import styles from "@/components/home/home.module.css";

const readyToWearCategory = products.filter(product => product.category === "ready-to-wear");
const readyToWear = [...readyToWearCategory, ...products.filter(product => product.category !== "ready-to-wear")].slice(0, 4);
const readyStock = products.filter(product => product.readyStock).slice(0, 4);

function SeeMore({ href, label }: { href: string; label: string }) {
  return <Link href={href} aria-label={`Lihat semua ${label}`} className={styles.seeMore}>See more <ArrowRight size={30} strokeWidth={1} aria-hidden="true" /></Link>;
}

export default function HomePage() {
  return (
    <div className={styles.home}>
      <Hero />
      <div className={styles.content}>
        <section className={styles.productSection} aria-labelledby="ready-to-wear-title">
          <div className={styles.sectionHeader}>
            <h2 id="ready-to-wear-title">READY-TO-WEAR</h2>
            <SeeMore href={readyToWearCategory.length >= 4 ? "/category/ready-to-wear" : "/products"} label="Ready-to-Wear" />
          </div>
          <div className={styles.productGrid}>
            {readyToWear.map(product => <ProductCard key={product.id} product={product} presentation="home-portrait" />)}
          </div>
        </section>

        <section className={styles.editorial} aria-labelledby="new-collections-title">
          <Link href="/category/dress" className={styles.editorialMain} aria-label="Jelajahi koleksi Dress UpLove">
            <Image src={assets.dress} alt="Gaun panjang UpLove dengan hiasan keemasan" fill sizes="(max-width: 767px) 58vw, 38vw" />
          </Link>
          <div className={styles.editorialHeader}>
            <h2 id="new-collections-title">NEW<br />COLLECTIONS</h2>
            <SeeMore href="/category/new-arrivals" label="New Collections" />
          </div>
          <Link href="/category/kebaya" className={styles.editorialSecondary} aria-label="Jelajahi koleksi Kebaya UpLove">
            <Image src={assets.kebaya} alt="Kebaya lilac dengan selendang bernuansa hangat" fill sizes="(max-width: 767px) 35vw, 23vw" />
          </Link>
          <div className={styles.editorialCopy}>
            <p>Keanggunan hadir dalam detail yang terasa personal. Siluet lembut, tekstur pilihan, dan sentuhan kontemporer bertemu dalam koleksi terbaru UpLove.</p>
            <p>Dari kebaya untuk perayaan hingga gaun yang menemani malam istimewa, temukan busana yang memberi ruang bagi gaya Anda sendiri.</p>
          </div>
        </section>

        <section className={styles.productSection} aria-labelledby="ready-stock-title">
          <div className={styles.sectionHeader}>
            <h2 id="ready-stock-title">READY STOCK</h2>
            <SeeMore href="/category/ready-stock" label="Ready Stock" />
          </div>
          <div className={styles.productGrid}>
            {readyStock.map(product => <ProductCard key={product.id} product={product} presentation="home-square" />)}
          </div>
        </section>
      </div>
    </div>
  );
}
