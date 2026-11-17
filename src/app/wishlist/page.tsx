'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/product/product-card';
import { products } from '@/data/products';
import { useShop } from '@/stores/shop';

export default function WishlistPage() {
  const { wishlist, hydrated } = useShop();
  const saved = products.filter(product => wishlist.includes(product.id));
  return <div className="container-shop min-h-[55vh] py-12 md:py-16"><h1 className="page-heading text-center">Wishlist</h1>{!hydrated ? <p className="py-12 text-center" role="status">Memuat wishlist…</p> : saved.length ? <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">{saved.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="py-16 text-center"><h2 className="mb-3 text-xl">Belum ada busana favorit</h2><p className="mb-7 text-muted-foreground">Simpan pilihan Anda melalui ikon hati pada produk.</p><Link href="/products" className="primary-link">Lihat koleksi</Link></div>}</div>;
}
