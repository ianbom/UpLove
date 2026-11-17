export type Category = "kebaya" | "dress" | "ready-to-wear";
export type ProductVariant = {
  id: string; color: string; colorHex: string;
  sizes: { size: string; stock: number }[];
  images: string[];
};
export type Product = {
  id: string; slug: string; name: string; category: Category; collections: string[];
  price: number; description: string; material: string; care: string; images: string[];
  variants: ProductVariant[]; readyStock: boolean; newArrival: boolean;
  popularity: number; createdAt: string;
};
export type Collection = { slug: string; name: string; description: string };
export type CartLine = { productId: string; variantId: string; size: string; quantity: number };
export type Customer = {
  name: string; email: string; phone: string; province: string;
  city: string; district: string; postalCode: string; address: string; notes: string;
};
export type OrderItem = CartLine & { name: string; image: string; slug: string; color: string; unitPrice: number };
export type Order = {
  id: string; createdAt: string; customer: Customer; items: OrderItem[];
  subtotal: number; shipping: number; total: number; paymentMethod: string;
};
