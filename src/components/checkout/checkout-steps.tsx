import Link from 'next/link';

export function CheckoutSteps({ step }: { step: 1 | 2 | 3 }) {
  return <nav aria-label="Tahapan pemesanan"><ol className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs sm:gap-x-10 sm:text-sm">{['Keranjang', 'Informasi', 'Selesai'].map((label, index) => <li key={label} aria-current={index + 1 === step ? 'step' : undefined} className={`flex items-center gap-2 ${index + 1 === step ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}><span className={`flex size-7 items-center justify-center rounded-full border ${index + 1 === step ? 'border-primary bg-primary text-primary-foreground' : 'border-sage'}`}>{index + 1}</span>{index === 0 && step !== 1 ? <Link href="/cart" className="underline-offset-4 hover:underline">{label}</Link> : label}</li>)}</ol></nav>;
}
