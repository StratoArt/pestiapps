/**
 * PestiApps Data Center Compatibility Layer
 * v0.1.1
 *
 * Read-only compatibility layer.
 * Data Center = primary
 * Local PestiApps data = fallback handled by app.js
 */

const DATA_CENTER_BASE_URL =
  window.PESTIAPPS_DATA_CENTER_URL ||
  'https://raw.githubusercontent.com/StratoArt/Data-Manager/main/';

const PATHS = {
  crops: 'data/master/crops.json',
  pests: 'data/opt/hama.json',
  diseases: 'data/opt/penyakit.json',
  weeds: 'data/opt/gulma.json',
  products: 'data/products/pestisida.json',
  fertilizers: 'data/products/pupuk.json',
  activeIngredients: 'data/master/active_ingredients.json',
  moa: 'data/master/moa.json'
};

async function getJSON(path) {
  const url =
    DATA_CENTER_BASE_URL.replace(/\/+$/, '') +
    '/' +
    path.replace(/^\/+/, '');

  const response = await fetch(url, {
    cache: 'no-cache'
  });

  if (!response.ok) {
    throw new Error(
      `Data Center request failed: ${response.status} ${url}`
    );
  }

  return response.json();
}

function records(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.records)) return data.records;
  return [];
}

const DataCenterCompat = {

  async getOPT() {
    const [crops, pests, diseases, weeds] = await Promise.all([
      getJSON(PATHS.crops),
      getJSON(PATHS.pests),
      getJSON(PATHS.diseases),
      getJSON(PATHS.weeds)
    ]);

    return {
      crops: records(crops),
      pests: records(pests),
      diseases: records(diseases),
      weeds: records(weeds)
    };
  },

  async getCrops() {
    return records(await getJSON(PATHS.crops));
  },

  async getProducts() {
    const data = await getJSON(PATHS.products);

    return records(data).map((record, index) => {
      const moa = record?.moa || {};
      const registration = record?.registration || {};
      const provenance = record?.provenance || {};

      return {
        No: String(index + 1),
        Kategori: record?.product_category || "",
        "Nama Merk": record?.brand_name || "",
        "Perusahaan": record?.company || "",
        "Bahan Aktif": record?.active_ingredients_raw || "",
        "Formulasi": record?.formulation || "",
        "Kemasan": record?.packaging || "",
        "IRAC Group": moa.irac || "",
        "FRAC Group": moa.frac || "",
        "HRAC Group": moa.hrac || "",
        "Sasaran Hama/Penyakit/Gulma": record?.targets_raw || "",
        "Sumber Data": record?.source || "",
        "Status MoA": record?.moa_status || "",
        "Catatan MoA": record?.moa_notes || "",
        "Nomor Pendaftaran": registration.number || "",
        "Status Registrasi": registration.status || "",
        "Status Pasar": record?.market_status || "",
        "Sumber Registri": record?.registry_source || "",
        id: record?.id || ("pestdb-dc-" + String(index + 1).padStart(4, "0")),
        linked_opt_ids: Array.isArray(record?.linked_opt_ids) ? record.linked_opt_ids : [],
        ai_master_matches: Array.isArray(record?.ai_master_matches) ? record.ai_master_matches : [],
        database_source: provenance.database_source || "",
        source_row: provenance.source_row ?? "",
        source_variant_count: provenance.source_variant_count ?? 1,
        _dataCenter: record
      };
    });
  },

  async getFertilizers() {
    return records(await getJSON(PATHS.fertilizers));
  },

  async getActiveIngredients() {
    return records(await getJSON(PATHS.activeIngredients));
  },

  async getMoA() {
    return records(await getJSON(PATHS.moa));
  },

  resolveMediaPath(path) {
    if (!path) return '';

    let value = String(path).trim();

    value = value.replace(
      /^assets\/opt\/photos\//,
      'assets/opt-media/photos/'
    );

    value = value.replace(
      /^assets\/opt\/reference\//,
      'assets/opt-media/reference/'
    );

    return (
      DATA_CENTER_BASE_URL.replace(/\/+$/, '') +
      '/' +
      value.replace(/^\/+/, '')
    );
  },

  getBaseURL() {
    return DATA_CENTER_BASE_URL;
  }
};

window.DataCenterCompat = DataCenterCompat;
