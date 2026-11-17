"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { brand, navigation } from "@/config/brand";
import { products } from "@/data/products";
import { filterProducts } from "@/lib/commerce";
import { cn, formatPrice } from "@/lib/utils";
import { useShop } from "@/stores/shop";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Wordmark({ className }: { className?: string }) {
  return <Link href="/" aria-label={`${brand.name}, beranda`} className={cn("wordmark block text-center text-[34px]", className)}>{brand.shortName}</Link>;
}

function ProductSearch({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const result = query.trim() ? filterProducts(products, { q: query }).slice(0, 4) : [];
  return <div className="relative">
    <form role="search" onSubmit={e => { e.preventDefault(); router.push(`/products?q=${encodeURIComponent(query.trim())}`); onNavigate?.(); }} className="relative">
      <label className="sr-only" htmlFor={mobile ? "mobile-search" : "header-search"}>Cari produk</label>
      <input id={mobile ? "mobile-search" : "header-search"} type="search" autoFocus={!mobile} value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari produk..." className="h-11 w-full border border-input bg-background py-2 pl-4 pr-12 text-sm outline-offset-2" />
      <button type="submit" className="icon-button absolute right-0 top-0" aria-label="Cari produk"><Search size={18} strokeWidth={1.5} /></button>
    </form>
    {query.trim() && <div className="absolute inset-x-0 top-full z-50 border border-border bg-background p-3 shadow-sm">
      {result.length ? result.map(p => <Link key={p.id} href={`/products/${p.slug}`} onClick={onNavigate} className="flex items-center gap-3 py-2 hover:text-primary"><Image src={p.images[0]} alt={p.name} width={36} height={54} className="h-[54px] w-9 object-cover" /><span className="text-xs leading-5">{p.name}<span className="block font-bold">{formatPrice(p.price)}</span></span></Link>) : <p className="py-4 text-sm">Produk tidak ditemukan.</p>}
      <Link href={`/products?q=${encodeURIComponent(query.trim())}`} onClick={onNavigate} className="mt-2 flex min-h-11 items-center justify-center border-t text-xs font-bold uppercase tracking-wide">Lihat semua hasil</Link>
    </div>}
  </div>;
}

export function Header() {
  const pathname = usePathname();
  const cart = useShop(s => s.cart);
  const hydrated = useShop(s => s.hydrated);
  const wishlist = useShop(s => s.wishlist);
  const setCartOpen = useShop(s => s.setCartOpen);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const count = hydrated ? cart.reduce((sum, line) => sum + line.quantity, 0) : 0;
  useEffect(() => {
    if (!searchOpen) return;
    function dismiss(e: PointerEvent) { if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false); }
    function escape(e: KeyboardEvent) { if (e.key === "Escape") { setSearchOpen(false); searchTrigger.current?.focus(); } }
    document.addEventListener("pointerdown", dismiss); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, [searchOpen]);
  return <header className="fixed inset-x-0 top-0 z-40 h-[81px] border-b border-beige bg-ivory font-sans">
    <div className="flex h-full items-center justify-between gap-1 px-2 sm:px-4 xl:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><button className="icon-button lg:hidden" aria-label="Buka menu"><Menu size={22} strokeWidth={1.5} /></button></SheetTrigger>
        <SheetContent side="top" showCloseButton={false} className="gap-0 overflow-y-auto p-0 max-h-dvh">
          <SheetTitle className="sr-only">Navigasi {brand.name}</SheetTitle><SheetDescription className="sr-only">Cari produk dan pilih koleksi.</SheetDescription>
          <div className="flex h-[81px] shrink-0 items-center justify-between border-b px-3"><SheetClose asChild><button className="icon-button" aria-label="Tutup menu"><X size={22} strokeWidth={1.5} /></button></SheetClose><Wordmark className="text-[30px]" /><button className="icon-button" aria-label="Buka keranjang" onClick={() => { setOpen(false); setCartOpen(true); }}><ShoppingBag size={20} strokeWidth={1.5} /></button></div>
          <div className="p-4"><ProductSearch mobile onNavigate={() => setOpen(false)} /></div>
          <div className="px-4 pb-4"><button onClick={() => { setOpen(false); setCartOpen(true); }} className="flex min-h-12 w-full items-center gap-3 bg-beige/40 px-4 text-sm"><ShoppingBag size={18} />SHOPPING CART {count > 0 && `(${count})`}</button>
            <nav aria-label="Navigasi mobile" className="pt-3"><Link href="/" onClick={() => setOpen(false)} className="flex min-h-11 items-center bg-beige/40 px-3 text-sm text-primary">BERANDA</Link>
              <Accordion type="single" collapsible>{navigation.map(item => item.children ? <AccordionItem key={item.label} value={item.label} className="border-0"><AccordionTrigger className="min-h-12 px-3 py-3 text-sm font-normal hover:no-underline">{item.label}</AccordionTrigger><AccordionContent className="px-3 pb-2"><Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center border-b px-3 text-sm">Lihat Semua {item.label}</Link>{item.children.map(child => <Link href={child.href} key={child.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center px-3 text-sm text-muted-foreground">{child.label}</Link>)}</AccordionContent></AccordionItem> : <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center px-3 text-sm">{item.label}</Link>)}</Accordion>
              <Link href="/products" onClick={() => setOpen(false)} className="flex min-h-12 items-center border-t px-3 text-sm">SEMUA PRODUK</Link><Link href="/wishlist" onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 px-3 text-sm"><Heart size={18} />WISHLIST</Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <Wordmark className="shrink-0 text-[28px] sm:text-[32px] lg:text-[35px]" />
      <nav aria-label="Navigasi utama" className="mx-auto hidden items-center gap-3 lg:flex xl:gap-6" onKeyDown={e => { if (e.key === "Escape") setDropdown(null); }}>
        {navigation.map(item => <div key={item.label} className="relative" onMouseEnter={() => setDropdown(item.label)} onMouseLeave={() => setDropdown(null)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropdown(null); }}>
          <div className="flex items-center"><Link href={item.href} onClick={() => setDropdown(null)} className={cn("flex min-h-[52px] items-center whitespace-nowrap text-[11px] font-medium transition-colors hover:text-primary xl:text-[13px]", pathname === item.href && "text-primary")}>{item.label}</Link>{item.children && <button aria-label={`Buka koleksi ${item.label}`} aria-expanded={dropdown === item.label} onClick={event => setDropdown(event.detail === 0 && dropdown === item.label ? null : item.label)} className="flex h-11 w-6 items-center justify-center hover:text-primary"><ChevronDown size={12} strokeWidth={1.5} /></button>}</div>
          {item.children && dropdown === item.label && <div className="absolute left-0 top-full w-[260px] border border-beige bg-ivory py-2 shadow-sm">{item.children.map(child => <Link key={child.href} href={child.href} onClick={() => setDropdown(null)} className="flex min-h-11 items-center px-5 text-xs uppercase transition-colors hover:bg-beige/50 hover:text-primary">{child.label}</Link>)}</div>}
        </div>)}
      </nav>
      <div className="flex shrink-0 items-center gap-0 lg:gap-1">
        <div ref={searchRef} className="order-0 lg:order-1"><button ref={searchTrigger} className="icon-button" aria-label="Buka pencarian" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Search size={20} strokeWidth={1.5} /></button>{searchOpen && <div className="absolute inset-x-0 top-[80px] border-b bg-ivory p-4 lg:inset-x-auto lg:right-[112px] lg:top-4 lg:w-[320px] lg:border-0 lg:p-0"><ProductSearch onNavigate={() => setSearchOpen(false)} /></div>}</div>
        <Link href="/wishlist" aria-label={`Wishlist${hydrated && wishlist.length ? `, ${wishlist.length} produk` : ""}`} className="icon-button relative order-1 lg:order-2"><Heart size={20} strokeWidth={1.5} />{hydrated && wishlist.length > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-olive" />}</Link>
        <button className="icon-button relative order-3" aria-label={`Buka keranjang${count ? `, ${count} barang` : ""}`} onClick={() => setCartOpen(true)}><ShoppingBag size={20} strokeWidth={1.5} />{count > 0 && <span className="absolute right-0 top-0 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-4 text-ivory">{count}</span>}</button>
      </div>
    </div>
  </header>;
}
