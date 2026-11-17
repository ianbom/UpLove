import Link from "next/link";
import { brand } from "@/config/brand";

const links = [
  ["Atelier & Konsultasi", "/store-location"], ["FAQ", "/faq"],
  ["Dress", "/category/dress"], ["About Us", "/about-us"],
  ["Kebaya", "/category/kebaya"], ["Contact Us", "/contact-us"],
  ["Exclusive Collection", "/category/exclusive-collection"], ["Journal", "/articles"],
  ["Appointment", "/appointments"], ["Privacy Policy", "/privacy-policy"],
];
export function Footer() {
  return <footer className="border-t border-charcoal/30 bg-ivory pb-10 pt-10 md:pt-12">
    <div className="container-shop"><nav aria-label="Informasi toko" className="mb-12 grid max-w-xl grid-cols-2 gap-x-12 gap-y-0 text-sm">{links.map(([label, href]) => <Link key={href} href={href} className="text-link flex min-h-9 items-center">{label}</Link>)}</nav>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-beige pt-5 text-center text-xs text-muted-foreground md:flex-row"><p>Copyright © {new Date().getFullYear()} {brand.name}.</p><p className="italic">{brand.tagline}</p><Link href="/customer-gallery" className="text-link inline-flex min-h-11 items-center">{brand.shortName} Gallery</Link></div>
    </div>
  </footer>;
}
