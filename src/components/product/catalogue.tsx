"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { filterProducts } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/product-card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type CatalogueQuery = Record<string, string | string[] | undefined>;
const categoryNames: Record<string, string> = { dress: "Dress", kebaya: "Kebaya", "ready-to-wear": "Ready-to-Wear" };
const sortOptions = [["popular", "Popular"], ["newest", "Newest"], ["price-asc", "Harga: Terendah"], ["price-desc", "Harga: Tertinggi"], ["name", "Nama: A–Z"]];

export function Catalogue({ query, baseSlug }: { query: CatalogueQuery; baseSlug?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (typeof value === "string" && value) params.set(key, value);
  const value = (key: string) => params.get(key) || "";
  const isCategory = !!baseSlug;
  const isProductCategory = !!baseSlug && Object.hasOwn(categoryNames, baseSlug);
  const title = baseSlug ? (isProductCategory ? categoryNames[baseSlug] : collections.find(c => c.slug === baseSlug)?.name) || "Koleksi" : "All Products";
  const filters = {
    q: value("q"), category: isProductCategory ? baseSlug : value("category"),
    collection: baseSlug && !isProductCategory ? baseSlug : value("collection"),
    size: value("size"), color: value("color"), availability: baseSlug === "ready-stock" ? "ready" : value("availability"),
    sort: value("sort") || (isCategory ? "newest" : "popular"),
  };
  const results = filterProducts(products, filters);
  const perPage = 20;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const page = Math.min(totalPages, Math.max(1, Math.floor(Number(value("page")) || 1)));
  const visible = results.slice((page - 1) * perPage, page * perPage);
  const colors = [...new Set(products.flatMap(p => p.variants.map(v => v.color)))].sort();
  const hasFilters = ["q", "size", "color", "availability", "category", "collection"].some(k => value(k));
  function url(next: Record<string, string>, resetPage = true) {
    const updated = new URLSearchParams(params);
    if (resetPage) updated.delete("page");
    Object.entries(next).forEach(([key, val]) => val ? updated.set(key, val) : updated.delete(key));
    return `${pathname}${updated.size ? `?${updated}` : ""}`;
  }
  function update(key: string, val: string) { startTransition(() => router.replace(url({ [key]: val }), { scroll: false })); }
  const filtering = <>
    <h2 className="mb-4 text-sm font-bold uppercase">Categories</h2>
    <nav aria-label="Kategori produk" className="mb-8 text-sm"><Link href="/products" className={cn("text-link flex min-h-10 items-center", !baseSlug && "font-bold text-primary")}>All Products</Link>{Object.entries(categoryNames).map(([slug, name]) => <Link key={slug} href={`/category/${slug}`} className={cn("text-link flex min-h-10 items-center", baseSlug === slug && "font-bold text-primary")}>{name}</Link>)}{collections.map(c => <Link href={`/category/${c.slug}`} key={c.slug} className={cn("text-link flex min-h-10 items-center", baseSlug === c.slug && "font-bold text-primary")}>{c.name}</Link>)}</nav>
    <div className="space-y-5 border-t pt-5">
      {(!baseSlug || isProductCategory) && <label className="block text-sm"><span className="mb-2 block font-bold">Koleksi</span><select aria-label="Filter koleksi" value={value("collection")} onChange={e => update("collection", e.target.value)} className="field-input text-sm"><option value="">Semua koleksi</option>{collections.filter(c => !["ready-stock", "new-arrivals"].includes(c.slug)).map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>}
      <label className="block text-sm"><span className="mb-2 block font-bold">Ukuran</span><select aria-label="Filter ukuran" value={value("size")} onChange={e => update("size", e.target.value)} className="field-input text-sm"><option value="">Semua ukuran</option>{["S", "M", "L", "XL"].map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="block text-sm"><span className="mb-2 block font-bold">Warna</span><select aria-label="Filter warna" value={value("color")} onChange={e => update("color", e.target.value)} className="field-input text-sm"><option value="">Semua warna</option>{colors.map(c => <option key={c}>{c}</option>)}</select></label>
      {baseSlug !== "ready-stock" && <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5 accent-primary" checked={value("availability") === "ready"} onChange={e => update("availability", e.target.checked ? "ready" : "")} />Ready Stock saja</label>}
      {hasFilters && <Link href={pathname} className="text-link flex min-h-11 items-center gap-2 text-sm"><X size={15} />Hapus filter</Link>}
    </div>
  </>;
  return <div className="container-shop pb-16 pt-12 md:pt-16">
    <div className={cn("mb-8", !isCategory && "text-center")}><h1 className={cn("page-heading", !isCategory && "editorial-heading font-normal")}>{title}</h1>{!isCategory && <p className="mt-3 text-sm text-muted-foreground">Pilihan busana untuk setiap momen Anda.</p>}</div>
    <form role="search" className={cn("relative mb-8", isCategory ? "max-w-sm" : "")} onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); update("q", String(data.get("q") || "").trim()); }}>
      <label htmlFor="catalogue-search" className="sr-only">Cari dalam koleksi</label><input id="catalogue-search" name="q" type="search" key={value("q")} defaultValue={value("q")} maxLength={200} placeholder="SEARCH PRODUCTS..." className="h-11 w-full border-b border-input bg-transparent pr-12 text-sm focus:outline-offset-4" /><button type="submit" aria-label="Cari dalam koleksi" className="icon-button absolute right-0 top-0"><Search size={18} strokeWidth={1.5} /></button>
    </form>
    <div className="flex gap-8"><aside className={cn("hidden w-64 shrink-0 lg:block", isCategory && "lg:hidden")}>{filtering}</aside><div className="min-w-0 flex-1" aria-busy={pending}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6 text-sm"><p className="text-xs text-muted-foreground" aria-live="polite">{results.length ? `Menampilkan ${(page - 1) * perPage + 1}–${Math.min(page * perPage, results.length)} dari ${results.length} produk` : "Tidak ada produk ditemukan"}</p><div className="flex flex-wrap items-center gap-3">
        <Sheet><SheetTrigger asChild><button type="button" className={cn("flex min-h-11 items-center gap-2 text-xs", !isCategory && "lg:hidden")}><SlidersHorizontal size={16} />Filter</button></SheetTrigger><SheetContent side="left" className="w-full max-w-sm overflow-y-auto px-6 pb-8 sm:max-w-sm"><SheetHeader className="px-0"><SheetTitle>Filter Produk</SheetTitle><SheetDescription>Pilih kategori, ukuran, atau warna.</SheetDescription></SheetHeader>{filtering}</SheetContent></Sheet>
        <label className="flex items-center gap-2 text-xs"><span className="hidden sm:inline">Sort by:</span><select aria-label="Urutkan produk" value={filters.sort} onChange={e => update("sort", e.target.value)} className="h-11 max-w-[170px] border border-input bg-background px-3 text-xs">{sortOptions.map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
      </div></div>
      {hasFilters && <div className="mb-6 flex flex-wrap items-center gap-2 text-xs"><span>Filter aktif:</span>{["q", "size", "color", "availability", "collection"].filter(k => value(k)).map(k => <button key={k} onClick={() => update(k, "")} className="flex min-h-11 items-center gap-3 border bg-beige/30 px-3" aria-label={`Hapus filter ${value(k)}`}>{k === "availability" ? "Ready Stock" : value(k)}<X size={12} /></button>)}</div>}
      {visible.length ? <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-6 lg:grid-cols-4", pending && "opacity-60")}>{visible.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} showSizes={baseSlug === "ready-stock"} />)}</div> : <div className="flex min-h-72 flex-col items-center justify-center border-y py-14 text-center"><h2 className="editorial-heading text-3xl">Belum ada pilihan yang sesuai.</h2><p className="mb-6 mt-4 text-sm text-muted-foreground">Coba kata kunci atau pilihan filter lainnya.</p><Link href={pathname} className="primary-link">Lihat koleksi</Link></div>}
      {totalPages > 1 && <nav aria-label="Halaman produk" className="mt-16 flex flex-wrap items-center justify-center gap-2"><Link aria-label="Halaman sebelumnya" aria-disabled={page === 1} tabIndex={page === 1 ? -1 : undefined} href={url({ page: String(Math.max(1, page - 1)) }, false)} className={cn("icon-button border border-input", page === 1 && "pointer-events-none opacity-30")}><ChevronLeft size={16} /></Link>{Array.from({ length: totalPages }, (_, index) => <Link key={index} aria-current={page === index + 1 ? "page" : undefined} aria-label={`Halaman ${index + 1}`} href={url({ page: String(index + 1) }, false)} className={cn("icon-button border border-input text-sm", page === index + 1 && "bg-primary text-ivory")}>{index + 1}</Link>)}<Link aria-label="Halaman berikutnya" aria-disabled={page === totalPages} tabIndex={page === totalPages ? -1 : undefined} href={url({ page: String(Math.min(totalPages, page + 1)) }, false)} className={cn("icon-button border border-input", page === totalPages && "pointer-events-none opacity-30")}><ChevronRight size={16} /></Link></nav>}
    </div></div>
  </div>;
}
