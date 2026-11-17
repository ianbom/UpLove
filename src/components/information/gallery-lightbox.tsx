"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function GalleryLightbox({ images, initialIndex, onClose }: { images: string[]; initialIndex: number | null; onClose: () => void }) {
  const [offset, setOffset] = useState(0);
  const previousFocus = useRef<HTMLElement | null>(null);
  if (!images.length) return null;
  const index = (((initialIndex ?? 0) + offset) % images.length + images.length) % images.length;
  function close() { setOffset(0); onClose(); }
  return <Dialog open={initialIndex !== null} onOpenChange={open => { if (!open) close(); }}><DialogContent showCloseButton={false} className="flex h-[min(90dvh,900px)] w-[calc(100%-2rem)] max-w-5xl flex-col gap-3 rounded-sm border-border bg-background p-3 sm:max-w-5xl md:p-5" onOpenAutoFocus={() => { previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }} onCloseAutoFocus={event => { event.preventDefault(); previousFocus.current?.focus(); }} onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); setOffset(value => value + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); setOffset(value => value - 1); } }}><div className="flex items-center justify-between gap-4"><div className="pl-2"><DialogTitle className="text-sm tracking-wide">UpLove GALLERY</DialogTitle><DialogDescription className="mt-2 text-xs">Inspirasi {index + 1} dari {images.length}</DialogDescription></div><DialogClose asChild><button type="button" className="icon-button" aria-label="Tutup galeri"><X className="size-6" strokeWidth={1.5} /></button></DialogClose></div><div className="relative min-h-0 flex-1 bg-secondary"><Image src={images[index]} alt={`Inspirasi siluet dan tekstur busana ${index + 1}`} fill sizes="(max-width: 767px) 100vw, 1000px" className="object-contain" />{images.length > 1 && <><button type="button" onClick={() => setOffset(value => value - 1)} aria-label="Foto sebelumnya" className="icon-button absolute left-2 top-1/2 -translate-y-1/2 border border-border bg-background/95 hover:bg-background"><ChevronLeft className="size-6" /></button><button type="button" onClick={() => setOffset(value => value + 1)} aria-label="Foto berikutnya" className="icon-button absolute right-2 top-1/2 -translate-y-1/2 border border-border bg-background/95 hover:bg-background"><ChevronRight className="size-6" /></button></>}</div><p className="text-center text-xs leading-5 text-muted-foreground">Fotografi editorial untuk inspirasi busana.</p></DialogContent></Dialog>;
}

export function GalleryGrid({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (!images.length) return <p className="py-14 text-center text-muted-foreground">Pilihan visual sedang disiapkan. Jelajahi koleksi busana kami sementara ini.</p>;
  return <><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">{images.map((image, item) => <button key={`${image}-${item}`} type="button" onClick={() => setIndex(item)} aria-label={`Lihat inspirasi busana ${item + 1}`} className="group relative aspect-square overflow-hidden rounded-sm bg-secondary"><Image src={image} alt={`Inspirasi siluet dan detail busana ${item + 1}`} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105" /></button>)}</div><GalleryLightbox images={images} initialIndex={index} onClose={() => setIndex(null)} /></>;
}
