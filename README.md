# WA Cloning RK — Android (versi 1.9.0)

Aplikasi Android ini membuka situs resmi `https://web.whatsapp.com/` di dalam WebView. Ikon launcher menggunakan PNG RK yang diberikan pemilik proyek.

> Ini adalah pembungkus pihak ketiga, bukan aplikasi resmi atau afiliasi WhatsApp. WhatsApp dapat membatasi atau memutus sesi pada browser/aplikasi yang tidak didukung. Tidak ada cara yang sah untuk menjamin sesi selalu tertaut.

## Versi 1.9.0 — bottom bar dan panggilan suara/video

Perubahan:
- **Navigasi bottom bar**: pencarian tombol sidebar asli WhatsApp Web tidak lagi bergantung pada nama kelas CSS. Urutan pencarian: `aria-label`/`title`/teks `<title>` SVG (Inggris dan Indonesia), lalu `data-icon` pada tombol **maupun elemen anak** (sebelumnya hanya pada tombol itu sendiri), lalu `data-testid`, dan terakhir urutan ikon pada rel kiri (khusus Chat, Panggilan, Status, Saluran, Komunitas).
- Daftar chat, area pesan, footer, dan dialog **tidak lagi dipindai** saat mencari menu. Versi lama dapat mengetuk baris chat yang kebetulan berisi kata "status" atau "calls".
- Klik dikirim sebagai urutan pointer/mouse lalu `click()` pada elemen tombol terdekat.
- Setelah menu diketuk, layar diset ke panel kiri (daftar) dahulu, lalu pindah ke panel kanan hanya jika WhatsApp benar-benar membuka panel di sana.
- Rel navigasi desktop tidak pernah lagi memakai header daftar chat sebagai target sembunyi.
- Jika menu tetap tidak ditemukan, aplikasi mencoba ulang dua kali, lalu menampilkan dialog dengan tombol **Salin** berisi daftar kontrol yang terlihat oleh skrip (`__rkNavDebug`). Kirim laporan itu agar selector dapat disesuaikan.
- **Panggilan suara/video**: WhatsApp Web membuka layar panggilan lewat `window.open()`. WebView sekarang mengizinkan multi-jendela (`onCreateWindow`/`onCloseWindow`) dan menampilkannya layar penuh. Tautan biasa yang membuka tab baru tetap dilempar ke browser.
- Autoplay media tidak lagi memerlukan ketukan agar audio lawan bicara dapat terdengar; izin `MODIFY_AUDIO_SETTINGS` ditambahkan.

Belum dibuild di perangkat. Panggilan membutuhkan akun yang sudah mendapat fitur Web Calling dan izin kamera/mikrofon. Tombol Back pada layar panggilan menutup jendela panggilan.

## Perbaikan versi 1.7.0 — layar awal QR

- Saat halaman penautan terdeteksi (QR tersedia, daftar chat belum tersedia), adapter layout percakapan dimatikan sementara. Dengan demikian CSS panel desktop tidak memotong bagian QR.
- Layar QR memakai alur halaman normal, lebar 100% dan gulir vertikal bila diperlukan; elemen yang lebih lebar daripada layar dibatasi.
- QR dikecilkan secara proporsional hingga sekitar 72% lebar layar (maksimal 264 px) agar seluruh pola QR tampak di layar portrait dan dapat dipindai.
- Kontainer flex desktop yang menampung QR dan instruksi disusun vertikal pada layar sempit. Sesudah daftar chat muncul, aturan khusus login dilepas dan adapter chat kembali aktif.
- Naik versi aplikasi menjadi 1.7.0.

> Perbaikan QR ini memerlukan build dan pengujian nyata di HP. Tampilan login WhatsApp dapat berubah sewaktu-waktu, sehingga belum dijamin berhasil pada semua versi WebView.

## Perbaikan versi 1.5.0 (berdasarkan tangkapan layar)

- Memperbaiki penyebab area chat kosong: tata letak luar WhatsApp Web kini dibatasi ke lebar WebView, rel navigasi desktop disembunyikan di mode portrait, dan lebar navbar internal disetel ulang agar tidak menyisakan ruang off-screen.
- Panel yang diganti adalah pembungkus panel daftar dan pembungkus panel percakapan, bukan memaksa `#main` menjadi `display:flex` atau mengecilkan semua elemen chat.
- Saat mengetuk baris kontak, mode chat dipilih setelah event WhatsApp dijalankan; sinkronisasi ulang dilakukan beberapa kali untuk mengakomodasi render React yang terlambat.
- Tombol panah kembali ditambahkan pada bilah aplikasi Android dan ditampilkan saat panel chat/halaman sekunder aktif. Tombol itu memanggil navigasi kembali ke daftar chat tanpa menghapus cookie.
- Penanganan tap memiliki fallback selector untuk beberapa struktur baris chat dan kembali ke daftar dengan beberapa selector ikon/label.
- Naik versi aplikasi menjadi 1.5.0.

## Perubahan versi 1.4.0

- Menghapus bar tombol bawah. **Muat ulang, Unduh media, pilihan mode, browser, dan bantuan sekarang berada di menu tiga titik** di bagian atas.
- Mengunci antarmuka aplikasi dalam mode portrait agar lebih konsisten untuk penggunaan HP.
- Menambahkan **tampilan satu layar HP**: pada layar sempit, daftar chat dan obrolan ditampilkan bergantian, bukan berdampingan seperti tampilan desktop. Ketuk chat dari daftar untuk masuk ke percakapan; tombol Back Android atau menu kembali mengunci mode daftar chat sampai baris chat lain dipilih.
- Menghapus pemaksaan lebar/tinggi pada semua elemen halaman. Hanya panel daftar chat dan panel percakapan yang bergantian memenuhi layar portrait; konten pesan tidak dipaksa gepeng. Kolom pengetikan memakai ukuran dasar 16 px.
- Tidak lagi mengubah lebar atau tinggi panel emoji/stiker secara global, untuk mengurangi risiko pemotongan dan gangguan pengiriman. Fungsi panel tetap bergantung pada versi WhatsApp Web.
- Mempertahankan penyimpanan cookie dan DOM storage WebView. Aplikasi tidak menghapus cookie ketika keluar atau saat memuat ulang.
- Tetap menyediakan pemilih file untuk mengirim foto, video, dan dokumen.
- Menaruh fitur unduh foto/video di menu tiga titik. Tombol itu mencari media yang tampak di halaman, kemudian mencoba menyimpan URL langsung atau media Blob yang dapat dibaca WebView. Ekspor Blob dibatasi maksimal 40 MB untuk mengurangi risiko kehabisan memori.
- Menggunakan ikon RK yang dikirim pemilik proyek di semua kepadatan layar.


## Perbaikan versi 1.4.0 (riwayat)

- Perpindahan layar saat memilih chat dipaksa secara eksplisit setelah ketukan pada baris chat.
- Kembali ke daftar chat mengubah mode layar sampai pengguna memilih chat lain.
- Deteksi daftar dan panel menggunakan beberapa selector alternatif dan observer DOM.
- Versi ini masih memiliki bug pembungkus layout yang menyebabkan tampilan percakapan kosong pada perangkat pengguna; versi 1.5.0 memperbaiki bagian tersebut.

## Catatan penggunaan dan kompatibilitas

- Default tetap menggunakan user-agent desktop yang diperlukan sejumlah alur WhatsApp Web, sementara navigasi portrait dilakukan dengan CSS/JavaScript di WebView. Mode daftar/chat portrait aktif otomatis dan tidak memiliki sakelar yang dapat membuat halaman kembali gepeng. Pilihan user-agent seluler tersedia sebagai opsi uji, tetapi situs WhatsApp mungkin tidak mendukungnya.
- WhatsApp dapat mengubah struktur HTML/selector sewaktu-waktu. Akibatnya, optimasi satu layar, deteksi percakapan, panel stiker, atau deteksi media mungkin perlu diperbarui bila situs berubah. Ini belum diuji pada semua versi WhatsApp Web.
- Kolom teks dibuat lebih ramah layar sentuh, namun bug pengiriman stiker atau masalah server WhatsApp tidak dapat dijamin terselesaikan hanya dengan CSS pada pembungkus.
- Unduhan bukan ekstensi browser dengan akses internal penuh. Tidak semua Status, media yang dilindungi, URL sementara, atau media sekali lihat dapat diunduh. Aplikasi tidak mencoba melewati perlindungan privasi WhatsApp.
- Build dikonfigurasi untuk Android API 24+ termasuk Android Oreo (API 26). Pengalaman WebView juga bergantung pada versi Android System WebView/Chrome yang terpasang di HP.
- Sesi biasanya tetap ada setelah aplikasi ditutup atau HP di-restart karena cookie tidak dihapus. WhatsApp masih bisa meminta tautan ulang atau mencabut sesi, dan Android dapat menghentikan proses aplikasi kapan saja.

## Cara build APK lewat GitHub Actions

1. Ekstrak ZIP source code di komputer.
2. Buat repository GitHub dan unggah **isi folder `wa-cloning-android`** ke root repository, termasuk folder tersembunyi `.github/workflows`. Jangan hanya mengunggah file ZIP.
3. Buka tab **Actions → Build WA Cloning APK → Run workflow**.
4. Tunggu proses build berhasil. Buka run yang selesai dan unduh **Artifacts → `wa-cloning-apk`**.
5. Ekstrak artifact tersebut untuk mendapatkan `app-debug.apk`, lalu kirim ke HP Android dan instal setelah memverifikasi sumber file.

Proyek sumber sudah disesuaikan, tetapi perlu dikompilasi lewat workflow dan diuji di HP sebelum dianggap siap produksi. Uji login/tautkan perangkat, chat teks, emoji/stiker, keyboard, unggah file, navigasi daftar-chat, sesi setelah restart, dan unduhan media.

## Apakah perlu Netlify?

Tidak. Aplikasi langsung membuka situs resmi `web.whatsapp.com`; tidak perlu membuat tiruan WhatsApp Web di Netlify atau menaruh sesi akun di server milik sendiri.




Versi 1.7.0 menambahkan bilah navigasi bawah yang dapat digeser horizontal untuk menu Chat, Panggilan, Status, Saluran, Komunitas, Bisnis, Iklan, Media, Setelan, dan Profil. Struktur menu WhatsApp Web dapat berubah; item yang tidak terdeteksi akan menampilkan pesan dan bukan membuka halaman palsu.


## Versi 1.8.0 — perbaikan scroll, panel kosong, dan lag

Perubahan penting:
- CSS injeksi tidak lagi mengunci `overflow:hidden` pada `html/body` atau panel daftar/chat internal.
- Panel internal WhatsApp tidak lagi dipaksa `display:flex`; aturan layout hanya mengatur panel luar yang bergantian ditampilkan di layar portrait.
- `#pane-side` diberi scroll vertikal sentuh agar daftar chat dapat digulir; area pesan WhatsApp tetap memakai DOM scroll miliknya.
- Tombol kembali menetapkan mode `list` dan mempertahankannya meskipun composer lama masih ada di DOM.
- Pengamatan DOM di-debounce, mutasi pesan/keyboard yang sering terjadi disaring, dan polling permanen 900 ms dihapus untuk mengurangi kerja berulang.
- Kelas responsif sementara QR dibersihkan setelah penautan sehingga tidak tertinggal di halaman chat.
- Pengaturan WebView membiarkan scroll/touch standar bekerja dan mempertahankan `adjustResize` untuk keyboard.

Belum ada APK yang dibuild atau diuji pada perangkat fisik di lingkungan ini. Hasil harus divalidasi melalui GitHub Actions dan perangkat target; WhatsApp Web dapat mengubah selector/struktur sewaktu-waktu.
