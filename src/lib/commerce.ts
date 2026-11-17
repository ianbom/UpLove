import type { CartLine, Customer, Order, OrderItem, Product } from '../types/shop.ts';

export const storageKeys = { cart: 'uplove-cart-v1', wishlist: 'uplove-wishlist-v1', orders: 'uplove-orders-v1' };
export const paymentMethods = ['Bank Transfer', 'QRIS', 'E-Wallet', 'COD'];
export const provinces = ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya'];

export function parseJSON(value: string | null): unknown { try { return value ? JSON.parse(value) : null; } catch { return null; } }
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
export const sameLine = (a: CartLine, b: CartLine) => a.productId === b.productId && a.variantId === b.variantId && a.size === b.size;
export function lineDetails(line: CartLine, products: Product[]) {
  const product = products.find(p => p.id === line.productId);
  const variant = product?.variants.find(v => v.id === line.variantId);
  const stock = variant?.sizes.find(s => s.size === line.size)?.stock ?? 0;
  return product && variant && stock > 0 ? { product, variant, stock } : null;
}
export function validateCart(value: unknown, products: Product[]): CartLine[] {
  if (!Array.isArray(value)) return [];
  const result: CartLine[] = [];
  for (const item of value.slice(0, 500)) {
    if (!record(item) || typeof item.productId !== 'string' || typeof item.variantId !== 'string' || typeof item.size !== 'string' || !Number.isSafeInteger(item.quantity) || (item.quantity as number) <= 0) continue;
    const line = { productId: item.productId, variantId: item.variantId, size: item.size, quantity: item.quantity as number };
    const details = lineDetails(line, products);
    if (!details) continue;
    const existing = result.find(row => sameLine(row, line));
    if (existing) existing.quantity = Math.min(details.stock, existing.quantity + line.quantity);
    else result.push({ ...line, quantity: Math.min(details.stock, line.quantity) });
  }
  return result;
}
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function filterProducts(products: Product[], filters: { q?: string; category?: string; collection?: string; size?: string; color?: string; availability?: string; sort?: string }): Product[] {
  const q = normalize(filters.q || '');
  const filtered = products.filter(p => (!q || normalize(`${p.name} ${p.description} ${p.category} ${p.collections.join(' ')}`).includes(q))
    && (!filters.category || p.category === filters.category)
    && (!filters.collection || p.collections.includes(filters.collection))
    && (filters.availability !== 'ready' || p.readyStock)
    && (!(filters.color || filters.size || filters.availability === 'ready') || p.variants.some(v => (!filters.color || normalize(v.color) === normalize(filters.color)) && v.sizes.some(s => s.stock > 0 && (!filters.size || s.size === filters.size)))));
  return filtered.sort((a, b) => filters.sort === 'price-asc' ? a.price - b.price : filters.sort === 'price-desc' ? b.price - a.price : filters.sort === 'newest' ? Date.parse(b.createdAt) - Date.parse(a.createdAt) : filters.sort === 'name' ? a.name.localeCompare(b.name, 'id') : b.popularity - a.popularity);
}
export function validateCustomer(customer: Customer): Partial<Record<keyof Customer, string>> {
  const errors: Partial<Record<keyof Customer, string>> = {};
  for (const field of ['name', 'city', 'district', 'address'] as const) {
    const value = customer[field].trim();
    if (value.length < (field === 'address' ? 10 : 2) || value.length > (field === 'address' ? 500 : 100)) errors[field] = field === 'address' ? 'Isi alamat lengkap, 10–500 karakter.' : 'Isi 2–100 karakter.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) || customer.email.length > 254) errors.email = 'Masukkan alamat email yang valid.';
  if (!/^(?:\+62|62|0)[0-9]{8,13}$/.test(customer.phone.replace(/[\s()-]/g, ''))) errors.phone = 'Masukkan nomor telepon Indonesia yang valid.';
  if (!provinces.includes(customer.province)) errors.province = 'Pilih provinsi tujuan.';
  if (!/^\d{5}$/.test(customer.postalCode)) errors.postalCode = 'Kode pos harus 5 digit.';
  if (customer.notes.length > 1000) errors.notes = 'Catatan maksimal 1.000 karakter.';
  return errors;
}
export function createOrder(cart: CartLine[], customer: Customer, paymentMethod: string, products: Product[], shipping: number, id: string, createdAt: string): Order {
  if (Object.keys(validateCustomer(customer)).length || !paymentMethods.includes(paymentMethod) || !cart.length || !Number.isSafeInteger(shipping) || shipping < 0 || !/^UPLOVE-[a-zA-Z0-9-]+$/.test(id) || !Number.isFinite(Date.parse(createdAt))) throw new Error('Data pesanan tidak valid.');
  const canonical = validateCart(cart, products);
  if (canonical.length !== cart.length || canonical.some((line, i) => !sameLine(line, cart[i]) || line.quantity !== cart[i].quantity)) throw new Error('Pilihan produk atau jumlah tidak tersedia. Periksa keranjang Anda.');
  const items = canonical.map(line => {
    const { product, variant } = lineDetails(line, products)!;
    return { ...line, name: product.name, slug: product.slug, image: variant.images[0] || product.images[0], color: variant.color, unitPrice: product.price };
  });
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  return { id, createdAt, customer: Object.fromEntries(Object.entries(customer).map(([key, value]) => [key, value.trim()])) as Customer, items, subtotal, shipping, total: subtotal + shipping, paymentMethod };
}
export function validateOrders(value: unknown, products?: Product[], shipping?: number): Order[];
export function validateOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).flatMap(raw => {
    if (!record(raw) || !record(raw.customer) || !Array.isArray(raw.items) || typeof raw.id !== 'string' || typeof raw.createdAt !== 'string' || typeof raw.paymentMethod !== 'string') return [];
    const customer = raw.customer;
    const items = raw.items;
    if (!['name', 'email', 'phone', 'province', 'city', 'district', 'postalCode', 'address', 'notes'].every(key => typeof customer[key] === 'string')) return [];
    if (Object.keys(validateCustomer(customer as Customer)).length || !/^UPLOVE-[a-zA-Z0-9-]+$/.test(raw.id) || raw.id.length > 100 || !Number.isFinite(Date.parse(raw.createdAt)) || !paymentMethods.includes(raw.paymentMethod) || !items.length || items.length > 500) return [];
    const validText = (text: unknown, max = 200): text is string => typeof text === 'string' && text.trim().length > 0 && text.length <= max && !/[\u0000-\u001f\u007f]/.test(text);
    if (items.some(item => !record(item) || !['productId', 'variantId', 'size', 'name', 'color'].every(key => validText(item[key])) || typeof item.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || item.slug.length > 200 || typeof item.image !== 'string' || item.image.length > 300 || !/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:jpg|jpeg|png|webp|avif)$/i.test(item.image) || typeof item.quantity !== 'number' || !Number.isSafeInteger(item.quantity) || item.quantity <= 0 || typeof item.unitPrice !== 'number' || !Number.isSafeInteger(item.unitPrice) || item.unitPrice < 0)) return [];
    const snapshot = items as OrderItem[];
    if (new Set(snapshot.map(item => JSON.stringify([item.productId, item.variantId, item.size]))).size !== snapshot.length) return [];
    const subtotal = snapshot.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (!Number.isSafeInteger(subtotal) || subtotal !== raw.subtotal || !Number.isSafeInteger(raw.shipping) || (raw.shipping as number) < 0 || !Number.isSafeInteger(raw.total) || raw.total !== subtotal + (raw.shipping as number)) return [];
    return [{ id: raw.id, createdAt: raw.createdAt, customer: customer as Customer, items: snapshot, subtotal, shipping: raw.shipping as number, total: raw.total as number, paymentMethod: raw.paymentMethod }];
  });
}
export function persistOrder(storage: Pick<Storage, 'getItem' | 'setItem'>, order: Order, products: Product[], shipping: number) {
  if (!validateOrders([order], products, shipping).length) throw new Error('Data pesanan tidak valid.');
  const orders = validateOrders(parseJSON(storage.getItem(storageKeys.orders)), products, shipping);
  storage.setItem(storageKeys.orders, JSON.stringify([order, ...orders.filter(previous => previous.id !== order.id)].slice(0, 100)));
}
