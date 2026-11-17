'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useShop } from '@/stores/shop';
import { products } from '@/data/products';
import { lineDetails } from '@/lib/commerce';
import { formatPrice } from '@/lib/utils';
import { brand } from '@/config/brand';

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { cart, updateQuantity, removeItem, setCartOpen } = useShop();
  return <ul className="divide-y divide-border">{cart.map(line => {
    const details = lineDetails(line, products);
    if (!details) return null;
    const { product, variant, stock } = details;
    return <li key={`${line.productId}-${line.variantId}-${line.size}`} className="flex gap-4 py-6">
      <Link href={`/products/${product.slug}`} onClick={() => setCartOpen(false)} className={`relative shrink-0 bg-beige ${compact ? 'h-32 w-20' : 'h-40 w-24 sm:w-28'}`}><Image src={variant.images[0] || product.images[0]} alt={`${product.name}, ${variant.color}`} fill sizes={compact ? '80px' : '112px'} className="object-cover" /></Link>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <Link href={`/products/${product.slug}`} onClick={() => setCartOpen(false)} className="font-semibold leading-snug hover:text-primary">{product.name}</Link>
        <p className="text-sm text-muted-foreground">{variant.color} / {line.size}</p>
        <p className="text-sm">{formatPrice(product.price)}</p>
        <div className="mt-auto flex w-full items-center justify-between gap-2">
          <div className="inline-flex items-center border border-input">
            <button type="button" onClick={() => updateQuantity(line, line.quantity - 1)} disabled={line.quantity <= 1} aria-label={`Kurangi jumlah ${product.name}`} className="flex size-10 items-center justify-center disabled:opacity-35"><Minus size={14} /></button>
            <span className="min-w-7 text-center text-sm" aria-label={`Jumlah ${product.name}`}>{line.quantity}</span>
            <button type="button" onClick={() => updateQuantity(line, line.quantity + 1)} disabled={line.quantity >= stock} aria-label={`Tambah jumlah ${product.name}`} className="flex size-10 items-center justify-center disabled:opacity-35"><Plus size={14} /></button>
          </div>
          <button type="button" onClick={() => removeItem(line)} aria-label={`Hapus ${product.name} dari keranjang`} className="icon-button"><Trash2 size={17} /></button>
        </div>
        {!compact && <p className="text-sm font-semibold">{formatPrice(product.price * line.quantity)}</p>}
      </div>
    </li>;
  })}</ul>;
}

export function CartTotals({ showShipping = false }: { showShipping?: boolean }) {
  const cart = useShop(state => state.cart);
  const subtotal = cart.reduce((sum, line) => sum + (lineDetails(line, products)?.product.price || 0) * line.quantity, 0);
  return <dl className="space-y-4 text-sm"><div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>{showShipping && <div className="flex justify-between gap-4"><dt>Pengiriman</dt><dd>{formatPrice(brand.shippingFee)}</dd></div>}<div className="flex justify-between gap-4 border-t pt-4 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(subtotal + (showShipping ? brand.shippingFee : 0))}</dd></div></dl>;
}
