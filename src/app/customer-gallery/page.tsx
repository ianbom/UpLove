import type { Metadata } from "next";
import { assets } from "@/data/assets";
import { GalleryGrid } from "@/components/information/gallery-lightbox";

export const metadata: Metadata = { title: "UpLove Gallery", description: "Siluet, tekstur, dan inspirasi busana untuk momen istimewa dalam galeri editorial UpLove." };

export default function GalleryPage() {
  return <div className="container-shop py-14 md:py-20"><header className="mb-10 text-center md:mb-14"><h1 className="text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl">UpLove GALLERY</h1><p className="mt-5 text-muted-foreground">Siluet, tekstur, dan inspirasi untuk momen istimewa.</p><p className="mt-4 text-xs tracking-wider text-muted-foreground">{assets.gallery.length} FOTO EDITORIAL</p></header><GalleryGrid images={assets.gallery} /></div>;
}
