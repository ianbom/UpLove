"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ZoomIn } from "lucide-react";
import type { Product } from "@/types/shop";
import { useShop } from "@/stores/shop";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const chart = [
  ["S", "86–90", "68–72", "92–96"], ["M", "91–96", "73–78", "97–102"],
  ["L", "97–102", "79–84", "103–108"], ["XL", "103–110", "85–92", "109–116"],
];

function SizeChart() {
  return <Dialog><DialogTrigger asChild><button type="button" className="min-h-11 rounded-full bg-primary px-4 py-2 text-[11px] font-bold text-ivory hover:bg-primary-hover">DRESS & KEBAYA SIZE CHART</button></DialogTrigger><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle className="pr-8 text-xl">Panduan Ukuran UpLove</DialogTitle><DialogDescription className="leading-relaxed">Ukur lingkar tubuh dalam sentimeter. Pilih ukuran sesuai bagian tubuh terlebar, lalu periksa kembali sebelum memesan.</DialogDescription></DialogHeader><div className="overflow-x-auto"><table className="mt-3 w-full border-collapse text-center text-xs sm:text-sm"><caption className="sr-only">Ukuran busana dalam sentimeter</caption><thead className="bg-beige"><tr>{["Ukuran", "Dada", "Pinggang", "Pinggul"].map(label => <th key={label} scope="col" className="border p-3 font-bold">{label}</th>)}</tr></thead><tbody>{chart.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row" className="border p-3 font-bold">{cell}</th> : <td key={index} className="border p-3">{cell}</td>)}</tr>)}</tbody></table></div><p className="mt-3 text-xs leading-6 text-muted-foreground">Gunakan pita ukur tanpa menarik terlalu ketat. Ukur dada pada bagian terlebar, pinggang pada bagian terkecil, dan pinggul pada bagian terlebar.</p><Link href="/faq" className="text-link inline-flex min-h-11 w-fit items-center text-sm text-primary">Baca panduan pemilihan ukuran</Link></DialogContent></Dialog>;
}

function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const move = (direction: number) => setSelected(index => (index + direction + images.length) % images.length);
  return <div className="mx-auto w-full max-w-[474px] lg:ml-auto lg:mr-0">
    <div className={cn("flex flex-col gap-4 lg:relative", images.length > 1 && "lg:pl-24")}>
      {images.length > 1 && <div className="order-2 flex shrink-0 gap-3 overflow-x-auto pb-1 lg:absolute lg:inset-y-0 lg:left-0 lg:w-20 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto" aria-label="Foto produk">{images.map((image, index) => <button type="button" key={image} onClick={() => setSelected(index)} aria-label={`Tampilkan foto ${index + 1} ${name}`} aria-pressed={selected === index} className={cn("relative h-[106px] w-20 shrink-0 overflow-hidden rounded-sm border-2 bg-beige", selected === index ? "border-primary" : "border-transparent")}><Image src={image} alt={`${name}, tampilan ${index + 1}`} fill sizes="80px" className="object-cover" /></button>)}</div>}
      <button type="button" onClick={() => setZoom(true)} onPointerMove={e => { if (e.pointerType !== "mouse") return; const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--zoom-x", `${(e.clientX - rect.left) / rect.width * 100}%`); e.currentTarget.style.setProperty("--zoom-y", `${(e.clientY - rect.top) / rect.height * 100}%`); }} className="product-zoom relative order-1 aspect-[9/16] w-full min-w-0 overflow-hidden rounded-sm bg-beige" aria-label={`Perbesar foto ${name}`}>
        <Image src={images[selected]} alt={`${name}, tampilan ${selected + 1}`} fill priority sizes="(max-width: 767px) 92vw, 474px" quality={85} className="object-cover transition-transform duration-500" />
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ivory/95 text-charcoal shadow-sm"><ZoomIn size={20} strokeWidth={1.5} /></span>
      </button>
    </div>
    <Dialog open={zoom} onOpenChange={setZoom}><DialogContent onOpenAutoFocus={() => { previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }} onCloseAutoFocus={event => { event.preventDefault(); previousFocus.current?.focus(); }} className="flex h-[90dvh] max-w-[calc(100%-2rem)] flex-col sm:max-w-4xl" onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}><DialogHeader className="pr-10"><DialogTitle className="text-base">{name}</DialogTitle><DialogDescription>Foto {selected + 1} dari {images.length}</DialogDescription></DialogHeader><div className="relative min-h-0 flex-1"><Image src={images[selected]} alt={`${name}, tampilan diperbesar ${selected + 1}`} fill sizes="(max-width: 767px) 100vw, 900px" quality={85} className="object-contain" />{images.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label="Foto produk sebelumnya" className="icon-button absolute left-0 top-1/2 bg-ivory/90"><ChevronLeft size={20} /></button><button type="button" onClick={() => move(1)} aria-label="Foto produk berikutnya" className="icon-button absolute right-0 top-1/2 bg-ivory/90"><ChevronRight size={20} /></button></>}</div></DialogContent></Dialog>
  </div>;
}

export function ProductDetail({ product, initialSize = "" }: { product: Product; initialSize?: string }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const variant = product.variants.find(v => v.id === variantId)!;
  const [size, setSize] = useState(variant.sizes.some(s => s.size === initialSize && s.stock > 0) ? initialSize : "");
  const [quantity, setQuantity] = useState(1);
  const [optionsOpen, setOptionsOpen] = useState("size");
  const [notice, setNotice] = useState("");
  const addItem = useShop(s => s.addItem);
  const setCartOpen = useShop(s => s.setCartOpen);
  const toggleWishlist = useShop(s => s.toggleWishlist);
  const saved = useShop(s => s.wishlist.includes(product.id));
  const stock = variant.sizes.find(s => s.size === size)?.stock || 0;
  const available = product.variants.some(v => v.sizes.some(s => s.stock > 0));
  const images = variant.images.length ? variant.images : product.images;
  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!size || quantity < 1 || quantity > stock || !Number.isInteger(quantity)) { setNotice("Pilih ukuran dan jumlah yang tersedia."); setOptionsOpen("size"); return; }
    if (addItem({ productId: product.id, variantId: variant.id, size, quantity })) { setNotice(""); setCartOpen(true); }
  }
  return <div className="grid grid-cols-1 gap-12 pb-16 lg:grid-cols-12 lg:gap-20">
    <div className="lg:col-span-6"><ProductGallery key={variant.id} images={images} name={product.name} /></div>
    <div className="w-full lg:col-span-6 lg:max-w-[474px]">
      <h1 className="font-sans text-2xl font-bold leading-tight md:text-[30px]">{product.name}</h1><p className="mt-5 text-2xl font-bold md:text-[30px]">{formatPrice(product.price)}</p>
      <div className="mt-6 border-t pt-6"><p className="text-sm font-bold uppercase">{product.readyStock ? "Ready Stock" : "Pre-order"}</p><p className="mt-3 text-sm leading-6">{product.description}</p><p className="mt-2 text-sm">Warna: {variant.color}</p><p className="mt-2 text-xs text-primary">{available ? "Tersedia dalam pilihan ukuran di bawah." : "Seluruh ukuran sedang tidak tersedia."}</p></div>
      <form onSubmit={add}>
        <div className="my-7 flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-bold">Size Information</span><SizeChart /></div>
        <Accordion type="single" collapsible value={optionsOpen} onValueChange={setOptionsOpen} className="space-y-4">
          <AccordionItem value="size" className="rounded-sm border"><AccordionTrigger className="min-h-14 px-4 text-sm font-bold hover:no-underline">Size Options <span className="mr-auto border border-sage px-2 py-1 text-[10px] font-normal text-primary">Wajib dipilih</span></AccordionTrigger><AccordionContent className="px-4 pb-5"><fieldset><legend className="mb-3 text-sm">Pilih ukuran</legend><div className="flex flex-wrap gap-3">{variant.sizes.map(option => <label key={option.size} className={cn("relative", option.stock < 1 && "cursor-not-allowed opacity-40")}><input name="size" type="radio" value={option.size} checked={size === option.size} onChange={() => { setSize(option.size); setQuantity(1); setNotice(""); }} disabled={option.stock < 1} className="peer sr-only" /><span className={cn("flex size-11 items-center justify-center border border-input text-sm peer-checked:bg-primary peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary", option.stock < 1 && "line-through")}>{option.size}</span></label>)}</div></fieldset><p className="mt-4 text-xs text-muted-foreground">{size ? `Ukuran ${size} dipilih.` : "Gunakan panduan ukuran untuk menemukan pilihan Anda."}</p></AccordionContent></AccordionItem>
          <AccordionItem value="details" className="rounded-sm border"><AccordionTrigger className="min-h-14 px-4 text-sm font-bold hover:no-underline">Detail & Perawatan</AccordionTrigger><AccordionContent className="space-y-3 px-4 pb-5 text-sm leading-6"><p>{product.material}</p><p>{product.care}</p></AccordionContent></AccordionItem>
        </Accordion>
        <fieldset className="mt-8"><legend className="mb-4 text-sm font-bold">Available Colors ({product.variants.length})</legend><div className="flex gap-3 overflow-x-auto pb-1">{product.variants.map(color => <button key={color.id} type="button" aria-pressed={variantId === color.id} aria-label={`Pilih warna ${color.color}`} onClick={() => { setVariantId(color.id); setSize(""); setQuantity(1); setNotice(""); }} className={cn("w-[94px] shrink-0 overflow-hidden rounded-sm border-2 p-1 text-left", color.id === variantId ? "border-primary" : "border-beige")}><span className="relative block aspect-[3/4] bg-beige"><Image src={color.images[0] || product.images[0]} alt={`${product.name} warna ${color.color}`} fill sizes="90px" className="object-cover" /></span><span className="flex min-h-8 items-center gap-2 pt-1 text-[11px]"><span className="size-3 shrink-0 rounded-full border border-charcoal/30" style={{ backgroundColor: color.colorHex }} />{color.color}</span></button>)}</div></fieldset>
        <div className="mt-8 space-y-3 text-xs leading-[1.7] text-muted-foreground"><h2 className="text-sm font-bold text-charcoal">Terms and Conditions</h2><p>Periksa kembali model, warna, ukuran, dan jumlah sebelum melanjutkan pemesanan.</p><p>Warna busana dapat terlihat berbeda karena pencahayaan foto dan pengaturan layar. Panduan ukuran membantu Anda membandingkan pilihan dengan ukuran tubuh.</p><p>Rawat busana sesuai petunjuk pada bagian Detail & Perawatan. Informasi pilihan dan ketentuan pemesanan tersedia di <Link href="/faq" className="text-link text-primary">FAQ</Link>.</p></div>
        <div className="mt-8 border-t pt-6"><div className="mb-4 flex items-center justify-between"><label htmlFor="product-quantity" className="text-sm font-bold">Quantity</label><span className="text-xs text-muted-foreground">{size && stock ? `Ukuran ${size} · ${variant.color}` : "Pilih ukuran terlebih dahulu"}</span></div><div className="flex h-11 w-fit items-center border border-input"><button type="button" aria-label="Kurangi jumlah" className="icon-button" disabled={quantity <= 1} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} className={quantity <= 1 ? "opacity-30" : ""} /></button><input id="product-quantity" aria-label="Jumlah produk" type="number" min={1} max={stock || 1} value={quantity} onChange={e => setQuantity(e.target.value === "" ? 0 : Number(e.target.value))} className="h-full w-12 bg-transparent text-center text-sm outline-offset-2" /><button type="button" aria-label="Tambah jumlah" className="icon-button" disabled={!size || quantity >= stock} onClick={() => setQuantity(Math.min(stock, quantity + 1))}><Plus size={14} className={!size || quantity >= stock ? "opacity-30" : ""} /></button></div></div>
        {notice && <p role="alert" className="mt-4 text-sm text-destructive">{notice}</p>}
        <Button type="submit" disabled={!size || stock < 1} className="mt-5 w-full font-sans text-xs font-semibold tracking-wide">{!available ? "STOK HABIS" : !size ? "PILIH UKURAN TERLEBIH DAHULU" : "TAMBAH KE KERANJANG"}</Button>
        <Button type="button" variant="outline" onClick={() => toggleWishlist(product.id)} aria-pressed={saved} className="mt-3 w-full text-xs"><Heart size={16} fill={saved ? "currentColor" : "none"} />{saved ? "TERSIMPAN DI WISHLIST" : "SIMPAN KE WISHLIST"}</Button>
      </form>
      <Link href="/contact-us" className="text-link mt-4 flex min-h-11 items-center justify-center text-xs text-primary">Butuh bantuan memilih ukuran?</Link>
    </div>
  </div>;
}
