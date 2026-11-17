import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/assets";
import { brand } from "@/config/brand";
import styles from "./home.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <Image src={assets.heroes[2].image} alt="Gaun keemasan dengan detail bunga dan selendang panjang" fill preload sizes="100vw" className={styles.heroImage} />
      <div className={styles.heroContent}>
        <h1 id="home-title">NEW<br />COLLECTION<span className="sr-only"> {brand.name}</span></h1>
        <Link href="/category/new-arrivals" className={styles.shopNow}>Shop Now</Link>
      </div>
      <div className={styles.heroCaption}>
        <span>Aluna</span>
        <p>{brand.name}<br />ELEGANCE IN EVERY DETAIL</p>
      </div>
    </section>
  );
}
