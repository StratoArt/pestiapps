# Crop Expert v0.13.2.0

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

## v0.13.2.0
- Added a dedicated **Tentang Aplikasi** screen from the Menu.
- Credit displayed exactly as requested: **Dibuat oleh Amrizal Ivan Pratama S.P. - Bayer District Representative Nganjuk 2026 all rights reserved**.
- Source catalog currently contains 19 entries: 15 user-supplied PDFs and 4 external references (IRAC, FRAC, HRAC, EPPO).


## v0.16.0 — Resistance Action Committee Master Engine
- IRAC MoA Classification v11.5 (Feb 2026) expanded to comprehensive Appendix 5 AI mapping and official physiological categories.
- FRAC Code List 2026 expanded with official target-site/process, group, AI and resistance-risk records, including M03 Propineb.
- HRAC Global 2026 expanded from the official poster/master-layer with current AI mapping.
- Active ingredient → Indonesian product crosswalk added.
- Product examples are a separate Indonesian dataset and do not imply registration.
