# Crop Expert v0.23.0

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
- Produk dapat dibuka ke detail dan ditautkan ke Crop Expert berdasarkan kecocokan teks sasaran.
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


## v0.18.0 — Header & Padi Expansion
- Hero branding duplikat “Crop Expert · Pest · Disease · Weed · MoA” dihapus agar headline langsung menjadi fokus.
- Ikon aplikasi dikembalikan ke gaya logo daun 2D hijau/putih seperti referensi UI awal.
- Data padi diperluas dari TABEL HAMA (ID).pdf dan ditambah lapisan sumber IRRI Rice Knowledge Bank untuk hama dan penyakit.
- Relasi padi tetap mempertahankan provenance sumber dan tidak mengubahnya menjadi klaim registrasi pestisida.

## v0.20.0 — Crop Growth Stage & OPT Timing
- README version header is now updated to v0.20.0; this file supersedes the older v0.15/v0.12 notes below.
- Added `data/crop_growth_guidelines_2026.json` as a separate crop-phenology layer.
- Padi has a source-supported 0–9 IRRI stage framework: germination, seedling, tillering, stem elongation, panicle initiation/boot, heading, flowering, milk, dough and mature.
- Padi also includes source-derived OPT observation windows from the user's crop-phenology visual and IRRI rice material. These are displayed as observation/phenology relationships, not automatic spray schedules or thresholds.
- All 30 crops now have a growth-stage navigation framework. Non-padi frameworks are explicitly marked `framework_only` and do not claim universal HST or OPT timing until a crop-specific source is added.
- Crop detail now contains a horizontal growth-stage timeline and, when supported, an `OPT menurut fase` mapping.
- OPT detail now contains `Fase serangan / pengamatan` when a source-supported phase relationship exists.
- Existing `data/opt_control.json` has been expanded with provenance-aware active-ingredient relationships derived from source-listed products and the user pesticide database. These are technical/source links, not automatic recommendations or current registration claims.
- Any active-ingredient control information must still be checked against the current Indonesian product label, crop, target OPT, dose, interval, PHI, application restrictions and registration.
- The original user-supplied leaf application icon is restored as `assets/icons/icon.svg` with regenerated PNG PWA icons.
- The header subtitle `Pest · Disease · Weed · MoA` has been removed so the hero can focus on `Kenali OPT sebelum Terlambat`.

### Phenology source notes
IRRI's crop-stage material divides rice development into vegetative (germination, seedling, tillering, stem elongation), reproductive (panicle initiation/boot, heading, flowering) and ripening (milk, dough, mature). The source also records field observations for weeds, insects and diseases by crop stage.

The supplied `Crop phenology: Growth stages and protection.png` is retained as a user-source visual for the rice protection timeline. It shows rice milestones including persemaian, pembentukan anakan, anakan maksimum, bunting-primordia, pengisian bulir and panen, alongside selected OPT timing. The app does not treat that visual as a universal calendar for every rice variety or production system.

### Data architecture
The Crop module is now separated into four layers:
1. **Crop identity** — icon, common name, scientific name.
2. **Crop growth** — phase/stage sequence and source metadata.
3. **Crop ↔ OPT** — pest, disease and weed relationships.
4. **OPT ↔ control knowledge** — active-ingredient/product provenance and MoA links.

This separation makes it possible to expand each crop with crop-specific growth guides and source-backed OPT timing without overwriting the master OPT or MoA datasets.

## v0.20.0 — Media & Thrips Expansion
- Menambahkan galeri visual OPT pada detail Hama.
- Menambahkan referensi siklus hidup *Spodoptera exigua* dan foto larva dari gambar pengguna.
- Menambahkan referensi siklus hidup thrips dan tabel spesies/inang dari gambar pengguna.
- Menambahkan 5 spesies thrips dari tabel pengguna: *Frankliniella occidentalis*, *Frankliniella schultzei*, *Hydatothrips adolfifriderici*, *Megalurothrips sjostedti*, dan *Ceratothripoides brunneus*.
- Menambahkan blok “Siklus hidup” dan “Inang & tingkat kerusakan” pada detail OPT jika data sumber tersedia.
- Media pengguna ditandai sebagai referensi visual; tidak otomatis dianggap sebagai bukti registrasi, diagnosis, atau rekomendasi pengendalian.


## v0.21.0 — Pesticide Database & Google Lens Scan Flow
- Database Pestisida memakai CSV pengguna `database_pestisida_indonesia_DEEP_SCRAPING_v8_Advansia_2026(1).csv` sebagai basis utama.
- 774 baris sumber dikonsolidasikan menjadi 747 nama produk unik dari CSV, dengan 1 record legacy Crop Expert yang dipertahankan; total database aplikasi 748 record.
- Baris sumber duplikat untuk nama produk yang sama dipertahankan sebagai `source_variants` agar provenance tidak hilang.
- Kartu Beranda menempatkan **Database Pestisida** tepat di sebelah **Bahan Aktif Pestisida**.
- Scan & Identifikasi sekarang memprioritaskan **Google Lens** sebagai jalur identifikasi visual eksternal; ChatGPT tetap opsi lanjutan.
- Setelah hasil Lens diperoleh, nama kandidat dapat dimasukkan kembali ke Crop Expert untuk mencari record OPT yang cocok.
- Tidak ada klaim bahwa PWA menerima hasil Lens secara otomatis; Lens berjalan di halaman Google/Chrome dan hasilnya tetap diverifikasi melalui database Crop Expert.
- Status registrasi/pasar, nomor pendaftaran, sumber data dan varian sumber ditampilkan pada detail produk bila tersedia.

## v0.22.0 — Crop Expert + Crop Nutrition Guideline

- Nama aplikasi/brand diganti menjadi **Crop Expert**.
- Ditambahkan modul **Crop Nutrition Guideline**.
- Materi mencakup:
  - unsur esensial non-mineral: C, H, O;
  - makro esensial: N, P, K, Ca, Mg, S;
  - mikro esensial: Fe, Mn, Zn, Cu, B, Mo, Cl, Ni;
  - unsur bermanfaat/non-esensial: Si, Na, Co, Se;
  - biostimulan: asam amino/protein hydrolysates, asam humat, asam fulvat, ekstrak rumput laut;
  - PGR/bioregulator: auksin, giberelin, sitokinin/CPPU, triakontanol, etilen/ethephon.
- Setiap entri menyimpan definisi, bentuk umum, fungsi/peran, dan catatan batasan.
- Struktur data disiapkan agar versi berikutnya dapat menambahkan **Crop Nutrition Profile per crop** berdasarkan 30 crop yang sudah ada, termasuk fase pertumbuhan, kebutuhan nutrisi per fase, gejala kekurangan/kelebihan, dan parameter pemantauan.
- Materi PGR/biostimulan dibedakan dari unsur hara esensial; tidak dianggap sebagai pengganti nutrisi mineral.
