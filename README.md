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
