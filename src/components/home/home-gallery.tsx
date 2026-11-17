"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assets } from "@/data/assets";
import { brand } from "@/config/brand";
import { GalleryLightbox } from "@/components/information/gallery-lightbox";
import { cn } from "@/lib/utils";

export function HomeGallery() {
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const pages = Math.ceil(assets.gallery.length / 6);
  const images = assets.gallery.slice(page * 6, page * 6 + 6);
  return <section className="bg-beige/20 py-16 md:py-20"><div className="container-shop">
    <h2 className="editorial-heading text-center text-[30px] leading-tight md:text-[34px]">{brand.shortName} GALLERY</h2>
    <p className="mt-4 text-center text-sm tracking-wide text-muted-foreground">Siluet, tekstur, dan momen penuh inspirasi.</p>
    <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {images.map((image, index) => <button type="button" key={image} onClick={() => setLightbox(page * 6 + index)} aria-label={`Lihat inspirasi busana ${page * 6 + index + 1}`} className={cn("group relative aspect-[3/5] overflow-hidden rounded-sm bg-beige md:aspect-auto md:h-[268px]", index === 0 && "md:col-span-2 md:row-span-2 md:h-[552px]", index === 5 && "md:hidden")}><Image src={image} alt={`Inspirasi busana UpLove ${page * 6 + index + 1}`} fill sizes={index === 0 ? "(max-width: 767px) 46vw, 50vw" : "(max-width: 767px) 46vw, 25vw"} className="object-cover transition-transform duration-700 group-hover:scale-105" /></button>)}
    </div>
    <div className="mt-6 flex items-center justify-center gap-1"><button type="button" className="icon-button" aria-label="Galeri sebelumnya" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={18} className={page === 0 ? "opacity-30" : ""} /></button>{Array.from({ length: pages }, (_, index) => <button type="button" key={index} onClick={() => setPage(index)} aria-label={`Halaman galeri ${index + 1}`} aria-current={page === index ? "page" : undefined} className="flex size-11 items-center justify-center"><span className={cn("h-1 w-2 rounded-full bg-sage", page === index && "w-6 bg-olive")} /></button>)}<button type="button" className="icon-button" aria-label="Galeri berikutnya" disabled={page === pages - 1} onClick={() => setPage(page + 1)}><ChevronRight size={18} className={page === pages - 1 ? "opacity-30" : ""} /></button></div>
    <div className="mt-5 text-center"><Link href="/customer-gallery" className="primary-link">Lihat Semua Galeri</Link></div>
    <GalleryLightbox images={assets.gallery} initialIndex={lightbox} onClose={() => setLightbox(null)} />
  </div></section>;
}
