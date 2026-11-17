'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { CartLines, CartTotals } from './cart-lines';
import { useShop } from '@/stores/shop';

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen } = useShop();
  const previousFocus = useRef<HTMLElement | null>(null);
  return <Sheet open={cartOpen} onOpenChange={setCartOpen}><SheetContent onOpenAutoFocus={() => { previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }} onCloseAutoFocus={event => { event.preventDefault(); if (previousFocus.current?.isConnected) previousFocus.current.focus(); else document.querySelector<HTMLElement>('header button[aria-label^="Buka keranjang"]')?.focus(); }} showCloseButton={false} className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-[448px]">
    <SheetHeader className="border-b px-6 py-7 pr-16 text-left"><SheetTitle className="text-xl font-semibold">Keranjang ({cart.reduce((sum, line) => sum + line.quantity, 0)})</SheetTitle><SheetDescription className="sr-only">Pilihan busana Anda. Ubah jumlah atau lanjutkan pemesanan.</SheetDescription></SheetHeader><SheetClose className="icon-button absolute right-3 top-4" aria-label="Tutup keranjang"><X size={20} /></SheetClose>
    {cart.length ? <><div className="min-h-0 flex-1 overflow-y-auto px-6"><CartLines compact /></div><div className="space-y-5 border-t p-6"><CartTotals /><p className="text-xs text-muted-foreground">Biaya pengiriman dihitung saat checkout.</p><Link href="/checkout" onClick={() => setCartOpen(false)} className="primary-link w-full">Lanjut ke checkout</Link><Link href="/cart" onClick={() => setCartOpen(false)} className="block py-2 text-center text-sm underline underline-offset-4">Lihat keranjang</Link></div></> : <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center"><ShoppingBag size={38} strokeWidth={1} /><h2 className="text-xl">Keranjang Anda masih kosong</h2><p className="text-sm text-muted-foreground">Temukan busana untuk momen istimewa Anda.</p><Link href="/products" onClick={() => setCartOpen(false)} className="primary-link">Lihat koleksi</Link></div>}
  </SheetContent></Sheet>;
}
