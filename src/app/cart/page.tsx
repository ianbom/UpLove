'use client';

import Link from 'next/link';
import { CartLines, CartTotals } from '@/components/cart/cart-lines';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import { useShop } from '@/stores/shop';
import { brand } from '@/config/brand';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, hydrated } = useShop();
  return <div className="container-shop min-h-[55vh] py-12 md:py-16"><CheckoutSteps step={1} /><h1 className="page-heading mt-10">Keranjang Belanja</h1>{!hydrated ? <p className="py-12" role="status">Memuat keranjang…</p> : cart.length ? <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]"><CartLines /><aside className="h-fit space-y-6 bg-beige/40 p-6 md:p-8"><h2 className="text-lg font-semibold">Ringkasan Belanja</h2><CartTotals /><p className="text-sm text-muted-foreground">Pengiriman {formatPrice(brand.shippingFee)} ditambahkan saat checkout.</p><Link href="/checkout" className="primary-link w-full">Lanjut ke checkout</Link><Link href="/products" className="block py-2 text-center text-sm underline underline-offset-4">Lanjutkan belanja</Link></aside></div> : <div className="py-16 text-center"><h2 className="mb-3 text-2xl">Keranjang Anda masih kosong</h2><p className="mb-7 text-muted-foreground">Pilih busana yang ingin Anda bawa pulang.</p><Link href="/products" className="primary-link">Lihat koleksi</Link></div>}</div>;
}
