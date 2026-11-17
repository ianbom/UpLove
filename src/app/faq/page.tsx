import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/information/faq-list";

export const metadata: Metadata = { title: "Pertanyaan Umum", description: "Panduan ukuran, perawatan, ketersediaan, dan pesanan UpLove." };

export default function FaqPage() {
  return <div className="container-shop py-14 md:py-20"><header className="mb-12 text-center md:mb-16"><h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Pertanyaan Umum</h1><p className="mx-auto mt-5 max-w-xl text-muted-foreground">Beberapa hal yang perlu diketahui sebelum memilih busana Anda.</p></header><FaqList /><div className="mt-16 text-center"><p className="mb-5">Ada hal lain yang ingin Anda tanyakan?</p><Link href="/contact-us" className="primary-link">Hubungi Kami</Link></div></div>;
}
