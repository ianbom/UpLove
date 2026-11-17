'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useShop } from '@/stores/shop';
import { products } from '@/data/products';
import { brand } from '@/config/brand';
import { createOrder, lineDetails, paymentMethods, persistOrder, provinces, validateCustomer } from '@/lib/commerce';
import { formatPrice } from '@/lib/utils';
import { CartTotals } from '@/components/cart/cart-lines';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import type { Customer } from '@/types/shop';

const fields: { name: keyof Customer; label: string; type?: string; autoComplete?: string; maxLength: number; full?: boolean }[] = [
  { name: 'name', label: 'Nama lengkap', autoComplete: 'name', maxLength: 100 },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'phone', label: 'Nomor telepon', type: 'tel', autoComplete: 'tel', maxLength: 20, full: true },
  { name: 'city', label: 'Kota / Kabupaten', autoComplete: 'address-level2', maxLength: 100 },
  { name: 'district', label: 'Kecamatan', autoComplete: 'address-level3', maxLength: 100 },
  { name: 'postalCode', label: 'Kode pos', autoComplete: 'postal-code', maxLength: 5 },
];
export default function CheckoutPage() {
  const { cart, hydrated, clearCart } = useShop();
  const router = useRouter();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [submitError, setSubmitError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const customer = Object.fromEntries(['name', 'email', 'phone', 'province', 'city', 'district', 'postalCode', 'address', 'notes'].map(key => [key, String(data.get(key) || '').trim()])) as Customer;
    const nextErrors = validateCustomer(customer);
    setErrors(nextErrors); setSubmitError('');
    if (Object.keys(nextErrors).length) { (form.elements.namedItem(Object.keys(nextErrors)[0]) as HTMLElement | null)?.focus(); return; }
    submitting.current = true; setBusy(true);
    try {
      const order = createOrder(cart, customer, String(data.get('paymentMethod')), products, brand.shippingFee, `UPLOVE-${crypto.randomUUID()}`, new Date().toISOString());
      persistOrder(localStorage, order, products, brand.shippingFee);
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(order.id)}`);
    } catch (error) {
      const message = error instanceof Error && error.message.startsWith('Pilihan') ? error.message : 'Pesanan belum tersimpan. Periksa izin atau ruang penyimpanan browser, lalu coba kembali. Keranjang Anda tetap tersedia.';
      setSubmitError(message); toast.error(message); submitting.current = false; setBusy(false);
    }
  }
  return <div className="container-shop min-h-[60vh] py-12 md:py-16"><CheckoutSteps step={2} /><h1 className="page-heading mt-10">Selesaikan Pesanan Anda</h1>{!hydrated ? <p className="py-12" role="status">Memuat keranjang…</p> : !cart.length ? <div className="py-16 text-center"><h2 className="mb-3 text-xl">Keranjang Anda masih kosong</h2><p className="mb-7 text-muted-foreground">Tambahkan produk sebelum membuat pesanan.</p><Link href="/products" className="primary-link">Lihat koleksi</Link></div> : <div className="mt-10 grid items-start gap-12 lg:grid-cols-[2fr_1fr]">
    <form onSubmit={submit} noValidate className="space-y-10">
      <section aria-labelledby="shipping-heading"><h2 id="shipping-heading" className="mb-6 text-xl font-semibold">Informasi Pengiriman</h2><div className="grid gap-5 sm:grid-cols-2">
        {fields.slice(0, 3).map(field => <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}><label htmlFor={field.name} className="field-label">{field.label} <span aria-hidden="true">*</span></label><input id={field.name} name={field.name} type={field.type || 'text'} autoComplete={field.autoComplete} maxLength={field.maxLength} required className="field-input" aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />{errors[field.name] && <p id={`${field.name}-error`} className="mt-2 text-sm text-destructive">{errors[field.name]}</p>}</div>)}
        <div className="sm:col-span-2"><label htmlFor="province" className="field-label">Provinsi <span aria-hidden="true">*</span></label><select id="province" name="province" autoComplete="address-level1" required defaultValue="" className="field-input" aria-invalid={!!errors.province} aria-describedby={errors.province ? 'province-error' : undefined}><option value="" disabled>Pilih provinsi</option>{provinces.map(province => <option key={province} value={province}>{province}</option>)}</select>{errors.province && <p id="province-error" className="mt-2 text-sm text-destructive">{errors.province}</p>}</div>
        {fields.slice(3).map(field => <div key={field.name}><label htmlFor={field.name} className="field-label">{field.label} <span aria-hidden="true">*</span></label><input id={field.name} name={field.name} type="text" inputMode={field.name === 'postalCode' ? 'numeric' : undefined} autoComplete={field.autoComplete} maxLength={field.maxLength} required className="field-input" aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />{errors[field.name] && <p id={`${field.name}-error`} className="mt-2 text-sm text-destructive">{errors[field.name]}</p>}</div>)}
        <div className="sm:col-span-2"><label htmlFor="address" className="field-label">Alamat lengkap <span aria-hidden="true">*</span></label><textarea id="address" name="address" rows={3} autoComplete="street-address" maxLength={500} required className="field-input resize-y" aria-invalid={!!errors.address} aria-describedby={errors.address ? 'address-error' : undefined} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan" />{errors.address && <p id="address-error" className="mt-2 text-sm text-destructive">{errors.address}</p>}</div>
        <div className="sm:col-span-2"><label htmlFor="notes" className="field-label">Catatan pesanan (opsional)</label><textarea id="notes" name="notes" rows={3} maxLength={1000} className="field-input resize-y" aria-invalid={!!errors.notes} aria-describedby={errors.notes ? 'notes-error' : undefined} />{errors.notes && <p id="notes-error" className="mt-2 text-sm text-destructive">{errors.notes}</p>}</div>
      </div></section>
      <fieldset><legend className="mb-5 text-xl font-semibold">Pilihan Pembayaran</legend><p className="mb-5 text-sm text-muted-foreground">Pilih metode yang Anda inginkan. Tidak ada pembayaran yang ditagihkan saat membuat pesanan.</p><div className="grid gap-3 sm:grid-cols-2">{paymentMethods.map((method, index) => <label key={method} className="flex min-h-14 cursor-pointer items-center gap-3 border border-input p-4"><input type="radio" name="paymentMethod" value={method} defaultChecked={index === 0} className="size-4 accent-primary" /><span className="text-sm">{method}</span></label>)}</div></fieldset>
      <div className="space-y-5"><p className="text-sm leading-relaxed text-muted-foreground">Periksa kembali rincian pesanan dan alamat Anda. Dengan melanjutkan, Anda menyetujui <Link href="/privacy-policy" className="underline underline-offset-4">kebijakan privasi</Link>.</p>{submitError && <p role="alert" className="border border-destructive p-4 text-sm text-destructive">{submitError}</p>}<button type="submit" disabled={busy} className="primary-link w-full disabled:cursor-wait disabled:opacity-60">{busy ? 'Menyimpan pesanan…' : 'Buat pesanan'}</button><Link href="/cart" className="inline-block py-2 text-sm underline underline-offset-4">Kembali ke keranjang</Link></div>
    </form>
    <aside className="space-y-6 bg-beige/40 p-6 lg:sticky lg:top-28"><h2 className="text-xl font-semibold">Pesanan Anda</h2><ul className="divide-y divide-border">{cart.map(line => { const details = lineDetails(line, products); if (!details) return null; const { product, variant } = details; return <li key={`${line.productId}-${line.variantId}-${line.size}`} className="flex gap-4 py-5"><div className="relative h-28 w-20 shrink-0"><Image src={variant.images[0] || product.images[0]} alt={product.name} fill sizes="80px" className="object-cover" /></div><div className="min-w-0 space-y-2 text-sm"><p className="font-semibold">{product.name}</p><p className="text-muted-foreground">{variant.color} / {line.size} × {line.quantity}</p><p>{formatPrice(product.price * line.quantity)}</p></div></li>; })}</ul><CartTotals showShipping /><p className="text-xs leading-relaxed text-muted-foreground">Ongkir tetap berlaku untuk seluruh provinsi.</p></aside>
  </div>}</div>;
}
