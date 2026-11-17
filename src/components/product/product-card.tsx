"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useShop } from "@/stores/shop";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types/shop";

export function ProductCard({ product, priority = false, showSizes = false, presentation = "catalogue" }: { product: Product; priority?: boolean; showSizes?: boolean; presentation?: "catalogue" | "home-portrait" | "home-square" }) {
  const wishlist = useShop(s => s.wishlist);
  const toggleWishlist = useShop(s => s.toggleWishlist);
  const saved = wishlist.includes(product.id);
  const available = product.variants.some(v => v.sizes.some(s => s.stock > 0));
  const sizes = [...new Set(product.variants.flatMap(v => v.sizes.filter(s => s.stock > 0).map(s => s.size)))];
  const home = presentation !== "catalogue";
  return <article className="group relative min-w-0" data-presentation={presentation}>
    <Link href={`/products/${product.slug}`} className="block">
      <div className={cn("relative overflow-hidden bg-beige", presentation === "catalogue" ? "aspect-[9/16]" : presentation === "home-portrait" ? "aspect-[3/4]" : "aspect-square")}>
        <Image src={product.images[0]} alt={product.name} fill sizes={home ? "(max-width: 767px) 46vw, 22vw" : "(max-width: 767px) 46vw, (max-width: 1023px) 31vw, 300px"} priority={priority} className={cn("object-cover transition-transform duration-500 group-hover:scale-[1.025]", home && "object-[center_20%]")} />
        {!available && <span className="absolute bottom-0 inset-x-0 bg-ivory/90 px-3 py-2 text-center text-xs">Stok habis</span>}
      </div>
      <h3 className={cn("mt-3 font-normal transition-colors group-hover:text-primary", home ? "text-xs uppercase leading-[1.4] md:text-[clamp(11px,1vw,16px)]" : "text-sm leading-[22px]")}>{product.name}</h3>
      <p className={cn("leading-5", home ? "mt-1 text-sm font-normal" : "mt-2 text-sm font-bold")}>{formatPrice(product.price)}</p>
    </Link>
    <button type="button" aria-label={saved ? `Hapus ${product.name} dari wishlist` : `Simpan ${product.name} ke wishlist`} aria-pressed={saved} onClick={() => toggleWishlist(product.id)} className={cn("absolute right-1 top-1 flex size-11 items-center justify-center bg-ivory/85 transition-opacity hover:bg-ivory lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100", saved && "text-primary lg:opacity-100")}><Heart size={18} strokeWidth={1.5} fill={saved ? "currentColor" : "none"} /></button>
    {showSizes && sizes.length > 0 && <div className="mt-3 flex gap-1" aria-label="Ukuran tersedia">{sizes.map(size => <Link key={size} href={`/products/${product.slug}?size=${encodeURIComponent(size)}`} className="flex h-11 w-11 min-w-0 items-center justify-center bg-beige/50 text-[11px] hover:bg-sage">{size}</Link>)}</div>}
  </article>;
}
