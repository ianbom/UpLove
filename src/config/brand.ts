export const brand = {
  name: "UpLove", shortName: "UpLove", tagline: "Elegance in Every Detail",
  description: "Kebaya, dress, dan busana pilihan untuk setiap momen yang berarti. Temukan koleksi UpLove dengan siluet anggun dan detail yang terjaga.",
  email: "hello@uplove.example", phone: "", address: "",
  social: { instagram: "", tiktok: "", facebook: "" },
  shippingFee: 25000,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

const collectionLinks = [
  { label: "Aluna Collection", href: "/category/aluna" },
  { label: "Amara Collection", href: "/category/amara" },
  { label: "Heritage Elegance", href: "/category/heritage-elegance" },
  { label: "Timeless Romance", href: "/category/timeless-romance" },
  { label: "Modern Muse", href: "/category/modern-muse" },
];
export const navigation = [
  { label: "ALUNA", href: "/category/aluna", children: [{ label: "Kebaya Aluna", href: "/category/kebaya?collection=aluna" }, ...collectionLinks.slice(1)] },
  { label: "NEW IN", href: "/category/new-arrivals" },
  { label: "DRESS", href: "/category/dress", children: collectionLinks.map(l => ({ ...l, href: `/category/dress?collection=${l.href.split('/').pop()}` })) },
  { label: "KEBAYA", href: "/category/kebaya", children: collectionLinks.map(l => ({ ...l, href: `/category/kebaya?collection=${l.href.split('/').pop()}` })) },
  { label: "READY STOCK", href: "/category/ready-stock", children: [{ label: "Dress", href: "/category/dress?availability=ready" }, { label: "Kebaya", href: "/category/kebaya?availability=ready" }] },
  { label: "OTHERS", href: "/products", children: [{ label: "Semua Produk", href: "/products" }, { label: "Occasion Wear", href: "/category/occasion-wear" }, { label: "Ready-to-Wear", href: "/category/ready-to-wear" }, { label: "Exclusive Collection", href: "/category/exclusive-collection" }] },
  { label: "GALLERY", href: "/customer-gallery" },
];
