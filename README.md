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

