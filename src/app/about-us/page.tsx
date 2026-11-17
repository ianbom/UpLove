import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Ruler, Scissors, Shirt } from "lucide-react";
import { assets } from "@/data/assets";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "Tentang Kami", description: "Mengenal UpLove dan pilihan busana untuk momen yang berarti." };

export default function AboutPage() {
  return <>
    <section className="relative flex min-h-80 items-center justify-center px-4 py-20 text-center text-ivory md:min-h-[500px]">
      <Image src={assets.atelier} alt="Tekstur dan detail busana di ruang editorial atelier" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-charcoal/65" />
      <div className="relative"><p className="mb-5 text-xs tracking-[.25em]">TENTANG KAMI</p><h1 className="editorial-heading text-5xl md:text-7xl">UpLove</h1><p className="mt-5 text-base tracking-wide md:text-lg">{brand.tagline}</p></div>
    </section>
    <div className="container-shop space-y-14 py-14 md:space-y-20 md:py-20">
      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="prose-shop"><p className="mb-4 text-xs tracking-[.18em] text-primary">SEBUAH PILIHAN PERSONAL</p><h2 className="editorial-heading !mt-0 !text-4xl md:!text-5xl">Untuk momen yang berarti.</h2><p>Busana hadir dalam banyak cerita: pertemuan yang dinanti, perayaan keluarga, hingga langkah baru dalam hidup. UpLove menghadirkan pilihan kebaya dan dress untuk menemani momen-momen tersebut.</p><p>Kami menyukai siluet yang anggun, warna yang mudah dipadukan, dan detail yang memberi karakter. Koleksi kami mengajak Anda memilih busana yang terasa dekat dengan diri sendiri.</p><Link href="/products" className="text-link mt-6 inline-flex min-h-11 items-center font-semibold underline">Temukan koleksi Anda</Link></div>
        <div className="relative aspect-square"><Image src={assets.about[0]} alt="Siluet busana dengan detail kain yang lembut" fill sizes="(max-width: 767px) 100vw, 600px" className="object-cover" /></div>
      </section>
      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[9/16] max-h-[850px]"><Image src={assets.about[1]} alt="Detail tekstur dan potongan busana" fill sizes="(max-width: 767px) 100vw, 600px" className="object-cover" /></div>
        <div className="prose-shop"><p className="mb-4 text-xs tracking-[.18em] text-primary">DETAIL YANG TERJAGA</p><h2 className="editorial-heading !mt-0 !text-4xl md:!text-5xl">Ruang untuk menjadi diri sendiri.</h2><p>Keindahan busana juga terasa saat dikenakan. Karena itu, informasi bahan, pilihan ukuran, serta panduan perawatan menjadi bagian dari setiap pilihan di katalog kami.</p><p>Jelajahi warna dan potongan dengan tenang. Jika Anda membutuhkan titik awal, panduan ukuran dan jurnal kami membantu menyusun pilihan sesuai acara serta kenyamanan Anda.</p><Link href="/articles" className="text-link mt-6 inline-flex min-h-11 items-center font-semibold underline">Baca jurnal UpLove</Link></div>
      </section>
      <section aria-label="Panduan memilih busana" className="grid grid-cols-2 gap-x-6 gap-y-10 border-t pt-12 lg:grid-cols-4">
        {[{ icon: Shirt, title: "Siluet pilihan", text: "Kebaya dan dress untuk beragam suasana." }, { icon: Scissors, title: "Kenali bahannya", text: "Perhatikan tekstur dan detail tiap busana." }, { icon: Ruler, title: "Temukan ukuran", text: "Panduan untuk pilihan yang nyaman." }, { icon: Heart, title: "Rawat dengan baik", text: "Jaga busana untuk momen berikutnya." }].map(({ icon: Icon, title, text }) => <div key={title} className="text-center"><Icon className="mx-auto mb-5 size-8 text-primary" strokeWidth={1.25} aria-hidden="true" /><h3 className="mb-2 text-sm font-semibold">{title}</h3><p className="mx-auto max-w-52 text-sm leading-6 text-muted-foreground">{text}</p></div>)}
      </section>
    </div>
  </>;
}
