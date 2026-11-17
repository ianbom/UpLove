'use client';

import { create } from 'zustand';
import { toast } from 'sonner';
import { products } from '@/data/products';
import { lineDetails, parseJSON, readShopStorage, sameLine, storageKeys, validateCart } from '@/lib/commerce';
import type { CartLine } from '@/types/shop';

function persist(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { toast.error('Penyimpanan perangkat tidak tersedia. Perubahan hanya tersimpan selama halaman ini terbuka.'); }
}
type Shop = {
  cart: CartLine[]; wishlist: string[]; hydrated: boolean; cartOpen: boolean;
  setCartOpen: (open: boolean) => void; hydrate: () => void;
  addItem: (item: CartLine) => boolean; updateQuantity: (item: CartLine, quantity: number) => void;
  removeItem: (item: CartLine) => void; toggleWishlist: (productId: string) => void; clearCart: () => void;
};
export const useShop = create<Shop>((set, get) => ({
  cart: [], wishlist: [], hydrated: false, cartOpen: false,
  setCartOpen: cartOpen => set({ cartOpen }),
  hydrate: () => {
    if (get().hydrated) return;
    try {
      const cart = validateCart(parseJSON(readShopStorage(localStorage, storageKeys.cart)), products);
      const savedWishlist = parseJSON(readShopStorage(localStorage, storageKeys.wishlist));
      const wishlist = Array.isArray(savedWishlist) ? [...new Set(savedWishlist.filter((id): id is string => typeof id === 'string' && products.some(p => p.id === id)))] : [];
      set({ cart, wishlist, hydrated: true });
    } catch { set({ hydrated: true }); toast.error('Penyimpanan perangkat tidak dapat dibaca. Anda tetap dapat berbelanja.'); }
  },
  addItem: item => {
    get().hydrate();
    const details = lineDetails(item, products);
    const existing = get().cart.find(line => sameLine(line, item));
    if (!details || !Number.isSafeInteger(item.quantity) || item.quantity <= 0 || item.quantity + (existing?.quantity || 0) > details.stock) { toast.error('Jumlah pilihan melebihi stok yang tersedia.'); return false; }
    const cart = existing ? get().cart.map(line => sameLine(line, item) ? { ...line, quantity: line.quantity + item.quantity } : line) : [...get().cart, { productId: item.productId, variantId: item.variantId, size: item.size, quantity: item.quantity }];
    set({ cart }); persist(storageKeys.cart, cart); return true;
  },
  updateQuantity: (item, quantity) => {
    const details = lineDetails(item, products);
    if (!details || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > details.stock) { toast.error('Jumlah pilihan tidak tersedia.'); return; }
    const cart = get().cart.map(line => sameLine(line, item) ? { ...line, quantity } : line);
    set({ cart }); persist(storageKeys.cart, cart);
  },
  removeItem: item => { const cart = get().cart.filter(line => !sameLine(line, item)); set({ cart }); persist(storageKeys.cart, cart); },
  toggleWishlist: productId => {
    get().hydrate();
    if (!products.some(product => product.id === productId)) return;
    const wishlist = get().wishlist.includes(productId) ? get().wishlist.filter(id => id !== productId) : [...get().wishlist, productId];
    set({ wishlist }); persist(storageKeys.wishlist, wishlist);
  },
  clearCart: () => { set({ cart: [] }); persist(storageKeys.cart, []); },
}));
