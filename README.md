# OPT Explorer v0.15.0

**Al-Kitab untuk Sales, Formulator dan Petani Mbois**

## v0.12 highlights
- Semua fitur v0.11 dipertahankan.
- Android/browser Back navigation tetap memakai history state.
- Calculator Suite baru, seluruh perhitungan berjalan lokal di browser:
  - Area
  - Spray Volume
  - Dose
  - Backpack Calibration
  - Sprayer Calibration
  - Product / Tank
  - Granule
  - Active Ingredient
  - Seed Treatment
- Calculator hanya menghitung angka input pengguna. Tidak membuat rekomendasi dosis, interval, PHI, produk, atau registrasi.
- Rumus spray/calibration ditampilkan di UI.
- Sumber kalkulasi eksternal dicantumkan di UI untuk audit metode.
- Tambahan source metadata untuk:
  - Fungicide Formulation and Mode of Action
  - Herbicide Mechanism of Action
  - Pests, Diseases and Disorders of Babyleaf Vegetables
  - Onion Seed Treatments
- `data/seed_treatments.json` menyimpan ekstraksi historis/source-derived onion seed-treatment examples.

## Calculation basis
The suite uses metric arithmetic such as:
- Area: m² and ha, with 1 ha = 10,000 m².
- Spray volume: area (ha) × application volume (L/ha).
- Product per tank from area rate: rate per ha × tank capacity ÷ spray volume.
- Backpack calibration: used water ÷ test area × 10,000 = L/ha.
- Boom/nozzle calibration: 10,000 × total flow ÷ (swath × travel speed) = L/ha.
- Liquid AI: g AI/L × L product/ha = g AI/ha.
- Solid AI: kg product/ha × %AI × 10 = g AI/ha.
- Seed treatment: target g AI/kg seed × seed kg ÷ product g AI/kg = product kg.

## Important source status
User-supplied training PDFs are source-derived knowledge, not automatically current regulatory guidance. Historical examples are labeled accordingly. Current IRAC/FRAC/HRAC master classifications remain separate.

## v0.12 source additions
The Australian babyleaf guide explicitly states it was first published in 2014 and that information should be checked for currency; its photographs are copyrighted/used with permission. Therefore the app uses it as identification knowledge/reference, not as a photo redistribution source.

The onion seed-treatment sheet is a historical US/Canada/Mexico-specific source and explicitly says its offerings are specific to those markets. It must not be presented as Indonesian registration data.

- v0.14.0.0: dedicated Tentang Aplikasi screen with creator credit and source-count note.


## v0.14.0.2 Emerging Actives
Added a separate Emerging/Pipeline layer for novel actives that may be absent from the current official AI lists. Isoflualanam is shown with the company-claimed IRAC Group 30 and Indonesia 2026 roadmap, but is explicitly marked as not present in the IRAC v11.5 Appendix 5 AI list in this snapshot.


## v0.13.3 — IRAC Resistance & Nematicide Knowledge Layer
- Added `data/irac_nematicides_2026.json`: N-1/N-2/N-3/N-4 plus N-UN/N-UNX/N-UNB/N-UNF/N-UNE, translated to Bahasa Indonesia.
- Added `data/irac_pests_2026.json`: IRAC resistance directory pest list with Indonesian UI translations and scientific names preserved.
- Added `data/irac_target_site_map.json`: target-site taxonomy derived from the supplied IRAC visual.
- Added `data/irm_spodoptera_exigua_2025.json`: source-derived biology, symptoms, resistance mechanisms, IRM and IPM guidance for *Spodoptera exigua*.
- Added EPPO outdoor Cucurbit and Solanaceous crop knowledge to `data/crop_guidelines.json`.
- Source dates and historical/regulatory caveats are preserved; EPPO examples are not treated as current Indonesian registrations.


## v0.14.0
- Target Site visual explainer: target biologis → efek → kelompok MoA.
- Icon aplikasi baru dari pengguna dipasang sebagai favicon/manifest/PWA icon.
- Scan & Identifikasi aktif: kamera/galeri, preview, prompt analisis Bahasa Indonesia, dan handoff foto ke ChatGPT via Web Share API bila perangkat mendukung.
- Fallback: salin prompt dan buka ChatGPT secara manual.


## v0.15.0 — Database Pestisida Indonesia
- Menambahkan `data/pesticide_database_id.json` dari CSV pengguna (105 record).
- Menambahkan layar **Database Pestisida** untuk pencarian produk, perusahaan, bahan aktif, formulasi, MoA, dan sasaran.
- Produk dapat dibuka ke detail dan ditautkan ke OPT Explorer berdasarkan kecocokan teks sasaran.
- Bahan aktif yang berhasil dicocokkan dengan master MoA ditampilkan sebagai tautan teknis ke klasifikasi IRAC/FRAC/HRAC.
- Koneksi produk ↔ OPT dan produk ↔ MoA bukan validasi label/registrasi atau rekomendasi aplikasi.


## v0.16.1 — UI Home
- Kartu **MoA Explorer** pada Beranda diganti menjadi **Bahan Aktif Pestisida**.
- Ikon diganti menjadi ikon lab/kimia berbasis SVG agar lebih konsisten di Android.
- Jalur dan engine IRAC/FRAC/HRAC tetap menggunakan route `explore`; perubahan ini hanya branding/UI.


## v0.17.0 — Crop OPT mapping
- Relasi Tanaman & Inang diperluas dengan lapisan source-derived dari TABEL HAMA (ID).pdf.
- Bawang merah kini menampilkan Hama, Penyakit, dan Gulma, termasuk multi-name weed/disease rows yang ada di PDF.
- Relasi diterapkan lintas tanaman yang sudah ada di katalog.
- Ikon Tanaman & Inang diganti menjadi ilustrasi crop/host 2D SVG.
- Provenance produk lama tetap dipisahkan dari status registrasi Indonesia saat ini.


## v0.17.1 — Crop Icon Pack
- Seluruh 22 tanaman di katalog menggunakan ikon 2D crop yang dibuat khusus per komoditas.
- Ikon tidak lagi memakai ilustrasi tanaman generik; setiap komoditas memiliki bentuk visual pembeda seperti malai padi, tongkol jagung, buah cabai, umbi bawang, kubis, tomat, kentang, buah kakao, kopi, kelapa, sawit, singkong, kacang tanah, dan lainnya.
- Service worker diperbarui agar ikon crop ikut tersedia untuk penggunaan offline setelah instalasi/cache.


## v0.17.2 — Komoditas tambahan & OPT clickable
- Tambahan komoditas: Sawi, Caisim, Pak Coy, Anggur, Jagung Manis, Kembang Kol, Brokoli, Kailan.
- Setiap komoditas memiliki ilustrasi SVG 2D crop khusus.
- Daftar OPT pada detail tanaman sekarang berupa tombol/kartu yang bisa diklik. Jika OPT sudah ada di Master, dibuka ke detail OPT lengkap; jika hanya berasal dari lapisan relasi sumber, dibuka ke detail provenance ringkas tanpa mengarang data.
- Cache service worker dinaikkan ke v0.17.2.
