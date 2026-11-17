"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { assets } from "@/data/assets";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

const titles = ["Aluna Collection", "Timeless Romance", "A Golden Moment", "Modern Muse", "Evening Reverie"];
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || paused || hovered || focused) return;
    const timer = setInterval(() => setActive(index => (index + 1) % assets.heroes.length), 6000);
    return () => clearInterval(timer);
  }, [paused, reduced, hovered, focused]);
  const slide = assets.heroes[active];
  return <section aria-label="Koleksi pilihan" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} className="relative aspect-[1920/784] w-full overflow-hidden bg-olive">
    <h1 className="sr-only">{brand.name}: {brand.tagline}</h1>
    <AnimatePresence initial={false}><motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .7 }} className="absolute inset-0">
      <Image src={slide.image} alt={slide.title} fill priority={active === 0} sizes="100vw" quality={85} className="object-cover" style={{ objectPosition: slide.position }} />
      <div className="absolute inset-0 bg-gradient-to-l from-charcoal/80 via-charcoal/20 to-transparent" />
      <Link href={slide.href} tabIndex={0} aria-label={`Lihat ${titles[active]}`} className="absolute inset-0 flex items-center justify-end pr-[7%] text-ivory">
        <div className="w-[47%] text-center"><p className="mb-2 text-[7px] font-normal uppercase tracking-[.18em] sm:mb-4 sm:text-[10px] lg:text-xs">{brand.name}</p>
          <h2 className="editorial-heading text-[clamp(24px,6.8vw,104px)] leading-[.98]">{titles[active].split(" ").slice(0, -1).join(" ")}<span className="block italic">{titles[active].split(" ").at(-1)}</span></h2>
          <p className="mt-2 text-[7px] italic sm:mt-5 sm:text-xs lg:text-sm">{brand.tagline}</p>
        </div>
      </Link>
    </motion.div></AnimatePresence>
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-0 sm:bottom-2">
      {assets.heroes.map((_, index) => <button key={index} type="button" onClick={() => setActive(index)} aria-label={`Tampilkan slide ${index + 1}`} aria-current={index === active ? "true" : undefined} className="flex h-11 w-6 items-center justify-center sm:w-7"><span className={cn("h-[7px] w-[7px] rounded-full bg-ivory/55 transition-all", active === index && "w-6 bg-ivory")} /></button>)}
    </div>
    {!reduced && <button type="button" onClick={() => setPaused(!paused)} className="absolute bottom-0 right-2 flex size-11 items-center justify-center text-ivory sm:bottom-2 sm:right-4" aria-label={paused ? "Putar slider" : "Jeda slider"}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>}
  </section>;
}
