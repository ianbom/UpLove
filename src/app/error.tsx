"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="container-shop py-24 text-center"><h1 className="page-heading">Halaman belum dapat ditampilkan.</h1><p className="my-6">Silakan coba kembali. Isi keranjang Anda tetap tersimpan di perangkat.</p><button onClick={reset} className="primary-link">Coba kembali</button><Link href="/" className="text-link ml-6 inline-flex min-h-11 items-center">Kembali ke beranda</Link></div>; }
