'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { products } from '@/data/products';
import { brand } from '@/config/brand';
import { parseJSON, storageKeys, validateOrders } from '@/lib/commerce';
import { formatPrice } from '@/lib/utils';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import type { Order } from '@/types/shop';

function Confirmation() {
  const params = useSearchParams();
  const orderId = params.get('order');
  const [state, setState] = useState<{ loaded: boolean; order?: Order }>({ loaded: false });
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      try { const order = validateOrders(parseJSON(localStorage.getItem(storageKeys.orders)), products, brand.shippingFee).find(order => order.id === orderId); if (active) setState({ loaded: true, order }); }
      catch { if (active) setState({ loaded: true }); }
    });
    return () => { active = false; };
  }, [orderId]);
  if (!state.loaded) return <p className="py-16 text-center" role="status">Memuat pesanan…</p>;
  const order = state.order;
  if (!order) return <div className="py-16 text-center"><h1 className="page-heading mb-4">Pesanan tidak ditemukan</h1><p className="mx-auto mb-8 max-w-lg text-muted-foreground">Pesanan hanya tersedia pada browser tempat pesanan dibuat. Periksa kembali tautan pesanan atau mulai memilih koleksi.</p><Link href="/products" className="primary-link">Lihat koleksi</Link></div>;
  return <><CheckoutSteps step={3} /><div className="mx-auto mt-12 max-w-2xl"><div className="mb-10 text-center"><span className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-beige"><Check size={25} /></span><h1 className="page-heading">Pesanan Berhasil Dibuat</h1><p className="mt-4 text-muted-foreground">Terima kasih, {order.customer.name}. Detail pesanan Anda berhasil dicatat.</p><p className="mt-5 font-semibold text-primary">Pembayaran belum dilakukan</p><p className="mt-2 text-sm text-muted-foreground">Pencatatan pesanan ini tidak memulai pembayaran atau pengiriman.</p></div>
  <section aria-label="Rincian pesanan" className="border p-5 sm:p-8"><div className="space-y-2 border-b pb-6 text-sm"><p className="break-all font-semibold">{order.id}</p><p className="text-muted-foreground">{new Date(order.createdAt).toLocaleString('id-ID')}</p><p>Pilihan pembayaran: {order.paymentMethod}</p></div><ul className="divide-y divide-border">{order.items.map(item => <li key={`${item.productId}-${item.variantId}-${item.size}`} className="flex gap-4 py-5"><div className="relative h-28 w-20 shrink-0"><Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" /></div><div className="space-y-2 text-sm"><p className="font-semibold">{item.name}</p><p className="text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p><p>{formatPrice(item.unitPrice * item.quantity)}</p></div></li>)}</ul><dl className="space-y-3 border-t pt-6 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div><div className="flex justify-between"><dt>Pengiriman</dt><dd>{formatPrice(order.shipping)}</dd></div><div className="flex justify-between border-t pt-4 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div></dl><div className="mt-7 border-t pt-6 text-sm leading-relaxed"><h2 className="mb-2 font-semibold">Alamat pengiriman yang disimpan</h2><p>{order.customer.name}</p><p>{order.customer.address}</p><p>{order.customer.district}, {order.customer.city}</p><p>{order.customer.province}, {order.customer.postalCode}</p>{order.customer.notes && <p className="mt-3 break-words">Catatan: {order.customer.notes}</p>}</div></section><div className="mt-8 flex flex-wrap items-center justify-center gap-5"><Link href="/products" className="primary-link">Lanjutkan belanja</Link><Link href="/" className="px-3 py-3 text-sm underline underline-offset-4">Kembali ke beranda</Link></div></div></>;
}
export default function SuccessPage() { return <div className="container-shop min-h-[60vh] py-12 md:py-16"><Suspense fallback={<p role="status" className="py-16 text-center">Memuat pesanan…</p>}><Confirmation /></Suspense></div>; }
