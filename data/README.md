# Crop Expert Data

## v0.20.0 layers
- `opt.json` — master OPT and crop identity data.
- `crop_opt_sources_2026.json` — source-derived crop ↔ OPT relationships.
- `crop_growth_guidelines_2026.json` — crop growth-stage/phenology layer and source-backed OPT timing where available.
- `opt_control.json` — provenance-aware OPT ↔ active ingredient relationships.
- `pesticide_database_id.json` — user pesticide product dataset.
- `moa_master_2026.json` — IRAC/FRAC/HRAC classification master layer.

### Status rules
`source_supported` means the stage/timing relationship has an identified source in the dataset.

`framework_only` means the phase sequence is a navigation framework only. It must not be interpreted as a universal HST calendar or an evidence-backed OPT attack window.

`source_product` in `opt_control.json` means the active ingredient is derived from a product named in a source table. It is not a current Indonesian registration claim and not an automatic spray recommendation.

`database_link` means the relationship comes from target matching in the user product database and requires label verification.

### Crop Nutrition Guideline 2026
`crop_nutrition_guideline_2026.json` adalah layer pengetahuan nutrisi tanaman yang memisahkan unsur esensial, unsur bermanfaat/non-esensial, biostimulan, dan PGR. Data ini bersifat pengetahuan fisiologi/biologi; bukan rekomendasi dosis aplikasi.
