import type { Metadata } from "next";
import Link from "next/link";
import { AppointmentForm } from "@/components/information/appointment-form";

export const metadata: Metadata = { title: "Rencanakan Konsultasi", description: "Susun kebutuhan busana dan catatan untuk rencana konsultasi UpLove." };

export default function AppointmentsPage() {
  return <div className="container-shop py-14 md:py-20"><div className="mx-auto max-w-3xl"><header className="mb-10 text-center"><p className="mb-4 text-xs tracking-[.2em] text-primary">ATELIER & KONSULTASI</p><h1 className="editorial-heading text-4xl md:text-6xl">Mulai dari cerita Anda.</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">Pilih tanggal yang Anda pertimbangkan, ceritakan acaranya, dan rangkum busana yang ingin Anda kenakan.</p></header><AppointmentForm /><Link href="/store-location" className="text-link mt-8 inline-flex min-h-11 items-center text-sm underline">Kembali ke informasi atelier</Link></div></div>;
}
