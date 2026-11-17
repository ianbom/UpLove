import type { Collection } from "../types/shop.ts";

export const collections: Collection[] = [
  {
    "slug": "aluna",
    "name": "Aluna",
    "description": "Nuansa lembut, brokat bunga, dan pilihan busana untuk perayaan bersama orang terdekat."
  },
  {
    "slug": "amara",
    "name": "Amara",
    "description": "Warna kaya dan detail hias untuk acara yang berkesan."
  },
  {
    "slug": "heritage-elegance",
    "name": "Heritage Elegance",
    "description": "Kebaya tradisional, motif batik, dan siluet khas Indonesia."
  },
  {
    "slug": "timeless-romance",
    "name": "Timeless Romance",
    "description": "Gaun malam dengan draperi lembut, brokat, dan sentuhan berkilau."
  },
  {
    "slug": "modern-muse",
    "name": "Modern Muse",
    "description": "Potongan sederhana dan detail ekspresif untuk gaya masa kini."
  },
  {
    "slug": "ready-stock",
    "name": "Ready Stock",
    "description": "Pilihan busana yang tersedia untuk acara Anda berikutnya."
  },
  {
    "slug": "new-arrivals",
    "name": "New Arrivals",
    "description": "Pilihan terbaru dari koleksi atelier."
  },
  {
    "slug": "exclusive-collection",
    "name": "Exclusive Collection",
    "description": "Siluet menonjol dan detail istimewa untuk acara spesial."
  },
  {
    "slug": "occasion-wear",
    "name": "Occasion Wear",
    "description": "Busana untuk merayakan momen bersama orang-orang terdekat."
  }
];

export const getCollection = (slug: string) => collections.find((collection) => collection.slug === slug);

