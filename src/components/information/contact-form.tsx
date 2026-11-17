"use client";

import { useRef, useState } from "react";
import { Check, MessageCircle, Package, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand } from "@/config/brand";

const topics = [
  { title: "Pilihan & ukuran", text: "Susun pertanyaan tentang ukuran, warna, dan detail busana.", icon: Ruler },
  { title: "Pesanan Anda", text: "Catat produk serta pilihan dalam ringkasan pesanan Anda.", icon: Package },
  { title: "Pertanyaan lainnya", text: "Ceritakan kebutuhan Anda untuk momen yang sedang disiapkan.", icon: MessageCircle },
];

export function ContactForm() {
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState<{ name: string; message: string } | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  return <>
    <div className="mb-8 border-b pb-7"><h3 className="text-lg font-semibold">Customer Service</h3><p className="mt-2 select-all text-sm text-primary">{brand.email}</p>{brand.phone && <p className="mt-2 text-sm">{brand.phone}</p>}<p className="mt-3 text-sm leading-6 text-muted-foreground">Siapkan nama busana, ukuran, atau nomor pesanan agar pertanyaan Anda lebih lengkap.</p></div>
    <div className="grid gap-6 md:grid-cols-2">{topics.map(({ title, text, icon: Icon }) => <button key={title} type="button" onClick={() => { setTopic(title); setSummary(null); setError(""); setTimeout(() => { formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); formRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }); }, 0); }} className="group flex min-h-44 gap-5 border p-7 text-left transition-colors hover:border-primary"><Icon className="mt-1 size-7 shrink-0 text-primary" strokeWidth={1.3} aria-hidden="true" /><span><span className="block text-lg font-semibold">{title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{text}</span><span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-primary">Susun pertanyaan</span></span></button>)}</div>
    {topic && <div className="mt-8 border p-6 md:p-8">{summary ? <div role="status">
      <Check className="mb-4 size-7 text-primary" aria-hidden="true" /><h3 className="text-xl font-semibold">Catatan Anda siap, {summary.name}.</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Simpan salinan catatan bila diperlukan. Ringkasan ini belum dikirim ke tim UpLove dan akan hilang saat halaman dimuat ulang.</p>
      <p className="mt-5 text-sm font-semibold">{topic}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">{summary.message}</p><Button type="button" variant="outline" className="mt-6 min-h-11" onClick={() => setSummary(null)}>Susun ulang catatan</Button>
    </div> : <form ref={formRef} onSubmit={event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = String(data.get("name") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();
      if (!name || message.length < 10) { setError("Isi nama dan pertanyaan setidaknya 10 karakter."); return; }
      setError(""); setSummary({ name, message });
    }}>
      <h3 className="text-xl font-semibold">{topic}</h3><p className="mb-6 mt-3 text-sm leading-6 text-muted-foreground">Tulis pertanyaan sebagai catatan Anda. Ringkasan tidak dikirim secara otomatis.</p>
      <div className="grid gap-5 sm:grid-cols-2"><div><label className="field-label" htmlFor="contact-name">Nama</label><Input id="contact-name" name="name" required maxLength={100} autoComplete="name" className="field-input" /></div><div><label className="field-label" htmlFor="contact-email">Email</label><Input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" className="field-input" /></div></div>
      <div className="mt-5"><label htmlFor="contact-message" className="field-label">Pertanyaan Anda</label><textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={5} className="field-input resize-y" aria-describedby={error ? "contact-error" : undefined} /></div>
      {error && <p id="contact-error" role="alert" className="mt-3 text-sm text-destructive">{error}</p>}<Button type="submit" className="mt-6 min-h-11">Lihat ringkasan pertanyaan</Button>
    </form>}</div>}
  </>;
}
