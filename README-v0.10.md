# OPT Explorer v0.6

Mobile-first PWA untuk eksplorasi OPT dan MoA.

## Fokus
- Jenis OPT: Hama, Penyakit, Gulma
- Line-art SVG ringan
- Detail OPT: nama ilmiah, nama umum, kelompok, famili, inang, gejala, siklus hidup
- Tanaman & Inang
- IRAC · FRAC · HRAC
- PWA/offline

## Database
Versi ini memperluas starter database untuk penggunaan awal. Data OPT tidak dimaksudkan sebagai pengganti diagnosis lapangan, label produk, atau registrasi pestisida.

## Arsitektur lanjutan
`data/schema.json` sudah menyiapkan entitas untuk:
1. Resistance Management
2. Urutan pencampuran / tank-mix
3. Kalkulator dosis
4. Kalkulator luas lahan & volume semprot
5. Database produk & label

Modul tersebut sengaja dipisahkan dari database OPT agar dapat ditambahkan tanpa membongkar UI utama.


## Foto OPT / penyakit / gulma
Versi ini menyiapkan metadata untuk foto nyata. Jangan mengambil gambar web secara massal tanpa memeriksa lisensinya. Wikimedia Commons dapat menjadi sumber kandidat karena file individual memiliki lisensi yang dapat digunakan kembali dengan syarat tertentu; EPPO memiliki koleksi foto yang sangat besar, tetapi halaman fotonya menyatakan penggunaan untuk tujuan edukasi sehingga izin tambahan diperlukan untuk redistribusi komersial.


## v0.7 — Real Photo Layer
- Detail pages can show licensed real-photo references before the line-art fallback.
- Current pilot images use Wikimedia Commons files with individually checked licensing metadata.
- Each image keeps source URL, license, author and attribution in `data/image_sources.json`.
- If a photo is unavailable/offline, the app falls back to the local SVG illustration.
- EPPO photos are kept as discovery/reference sources only because EPPO states its photos are for educational use and commercial publication requires permission.



## v0.8 — OPT → Bahan Aktif
Ditambahkan `data/opt_control.json` untuk menghubungkan OPT dengan bahan aktif yang terdokumentasi atau masih perlu verifikasi. UI detail OPT sekarang menampilkan bahan aktif, IRAC/FRAC/HRAC group, status evidence, dan catatan kehati-hatian.

**Penting:** relasi bahan aktif bukan rekomendasi aplikasi otomatis. Verifikasi label, komoditas, OPT sasaran, dosis, interval, PHI, registrasi dan status resistensi lokal sebelum digunakan.


## v0.9 — EPPO Viewer
- Added `data/eppo_links.json`.
- Added EPPO photo reference buttons for selected OPT records.
- Added an in-app EPPO viewer using an iframe, with direct-open fallback.
- No EPPO images are copied or redistributed by this project.
- EPPO photo pages state that their pictures are for educational purposes only and require permission from original photographers for publication in commercial websites.


## v0.9.1 — Fokus Padi, Bawang Merah & Cabai
Database diperluas dengan OPT tambahan, terutama hama dan penyakit pada padi, bawang merah, dan cabai. Record baru juga diberi EPPO code/link bila teridentifikasi di EPPO Global Database. Relasi crop → OPT diperjelas untuk tiga komoditas prioritas.


## v0.11 additions
- Agrobiology Library from newly supplied PDFs.
- Structured adjuvant, spray quality, insecticide delivery, mechanism, and Fusarium watermelon knowledge.
- Historical Indonesian crop–pest–product table extracted as source records.
- Source-derived knowledge remains separate from current IRAC/FRAC/HRAC masters.
