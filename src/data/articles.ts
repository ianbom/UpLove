import { assets } from "@/data/assets";

export const articles = [
  {
    slug: "merawat-kebaya-dan-detail-halus", title: "Menjaga detail, merawat kebaya", category: "PERAWATAN", image: assets.kebaya,
    excerpt: "Langkah sederhana untuk menyimpan dan merawat busana dengan renda, bordir, serta tekstur halus.",
    sections: [
      { title: "Mulai dari petunjuk bahan", paragraphs: ["Setiap bahan memiliki kebutuhan yang berbeda. Baca petunjuk perawatan pada halaman produk dan label busana sebelum mencuci. Untuk detail yang rapuh atau hiasan yang tidak dapat dilepas, pertimbangkan jasa perawatan profesional dan sampaikan jenis hiasannya.", "Setelah dikenakan, angin-anginkan busana di tempat teduh sebelum disimpan. Hindari langsung menutup busana yang masih lembap di dalam kantong pakaian."] },
      { title: "Perlakukan detail dengan lembut", paragraphs: ["Jangan menggosok atau memeras renda dan bordir. Bila petunjuk bahan memperbolehkan pencucian tangan, gunakan air bersuhu sejuk dan deterjen lembut. Uji terlebih dahulu di bagian kecil yang tersembunyi.", "Saat menyetrika, mulai dari suhu rendah dan gunakan kain pelapis. Hindari menekan hiasan secara langsung. Tes pada bagian dalam agar panas tidak mengubah permukaan bahan."] },
      { title: "Beri ruang saat menyimpan", paragraphs: ["Gunakan gantungan berlapis untuk busana ringan yang strukturnya mendukung. Busana dengan hiasan berat lebih baik dilipat mengikuti bentuknya dan diselingi kain bersih agar berat tidak menarik bahu.", "Simpan di tempat kering, jauh dari sinar matahari langsung. Sesekali keluarkan busana untuk memeriksa kelembapan dan memastikan lipatannya tidak menetap terlalu lama."] },
    ],
  },
  {
    slug: "panduan-mengukur-ukuran-busana", title: "Ukuran yang memberi ruang bergerak", category: "PANDUAN UKURAN", image: assets.about[0],
    excerpt: "Tiga ukuran dasar dan beberapa hal kecil yang membantu menemukan potongan paling nyaman.",
    sections: [
      { title: "Siapkan pita ukur", paragraphs: ["Kenakan pakaian tipis saat mengukur tubuh. Berdirilah tegak dengan bahu rileks, lalu gunakan pita ukur yang lentur. Bila memungkinkan, minta bantuan seseorang agar pita tetap sejajar di bagian belakang.", "Catat ukuran dalam sentimeter. Pita sebaiknya menyentuh tubuh tanpa menekan kulit; sisakan ruang untuk bernapas dengan alami."] },
      { title: "Catat tiga ukuran utama", paragraphs: ["Ukur lingkar dada pada bagian terluas, dengan pita melewati punggung secara mendatar. Ukur pinggang di bagian yang paling ramping, lalu ukur pinggul pada bagian terlebar.", "Bandingkan ketiga catatan tersebut dengan panduan ukuran pada produk yang dipilih. Jangan hanya mengandalkan ukuran yang biasa Anda kenakan karena potongan setiap busana dapat berbeda."] },
      { title: "Pertimbangkan siluet dan acara", paragraphs: ["Busana untuk acara panjang perlu nyaman saat duduk, berjalan, dan mengangkat tangan. Pertimbangkan bentuk lengan, panjang rok, serta ruang pada pinggang selain angka ukuran.", "Jika dua bagian tubuh mengarah pada ukuran berbeda, prioritaskan bagian yang membutuhkan ruang lebih besar. Catat pertanyaan Anda sebelum menyusun konsultasi, termasuk ukuran tubuh dan siluet yang disukai."] },
    ],
  },
  {
    slug: "memilih-busana-untuk-momen-istimewa", title: "Satu momen, pilihan yang personal", category: "INSPIRASI", image: assets.dress,
    excerpt: "Menyeimbangkan suasana acara, warna, dan kenyamanan tanpa kehilangan karakter Anda.",
    sections: [
      { title: "Baca suasana acaranya", paragraphs: ["Mulailah dari tempat, waktu, dan ketentuan busana pada undangan. Acara siang di luar ruang mungkin membutuhkan bahan dan siluet yang berbeda dari perayaan malam di dalam ruangan.", "Pilih satu hal yang ingin ditonjolkan: tekstur kebaya, garis leher, warna, atau bentuk rok. Detail lainnya dapat dibuat lebih tenang agar keseluruhan terasa seimbang."] },
      { title: "Warna yang terasa dekat", paragraphs: ["Lihat warna busana di layar dengan tetap mengingat bahwa cahaya dapat mengubah tampilannya. Bayangkan juga aksesori, alas kaki, dan tas yang sudah Anda miliki.", "Palet senada memberi kesan tenang, sementara satu aksesori dengan warna berbeda dapat menjadi titik perhatian. Pilihan yang tepat adalah yang membuat Anda merasa nyaman mengenakannya."] },
      { title: "Coba sambil bergerak", paragraphs: ["Saat mencoba busana, berjalanlah beberapa langkah dan duduk sejenak. Periksa apakah lengan dapat bergerak bebas, bagian pinggang tetap nyaman, dan panjang busana sesuai dengan alas kaki.", "Siapkan busana lebih awal agar ada waktu untuk memeriksa kebersihan dan merapikan lipatan. Sentuhan terakhir sering kali sederhana: busana yang terawat dan ruang untuk menikmati momen."] },
    ],
  },
] as const;
