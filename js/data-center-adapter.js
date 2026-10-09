/**
 * PestiApps → Crop Expert Data Center Adapter
 * v0.1.0
 *
 * Read-only.
 * Data Center = primary
 * Local PestiApps data = fallback
 */

const DATA_CENTER_BASE_URL =
  window.PESTIAPPS_DATA_CENTER_URL ||
  'https://raw.githubusercontent.com/StratoArt/Data-Manager/main/';

const DATA_CENTER_PATHS = {
  crops: 'data/master/crops.json',

  pests: 'data/opt/hama.json',
  diseases: 'data/opt/penyakit.json',
  weeds: 'data/opt/gulma.json',

  products: 'data/products/pestisida.json',
  fertilizers: 'data/products/pupuk.json',

  activeIngredients: 'data/master/active_ingredients.json',
  moa: 'data/master/moa.json',

  relations: {
    cropHama: 'data/relations/crop_hama.json',
    cropPenyakit: 'data/relations/crop_penyakit.json',
    cropGulma: 'data/relations/crop_gulma.json',
    cropOPT: 'data/relations/crop_opt.json',
    productOPT: 'data/relations/product_opt.json',
    productCrop: 'data/relations/product_crop.json',
    aiMoa: 'data/relations/ai_moa.json'
  },

  assets: {
    icons: 'assets',
    optPhotos: 'assets/opt-media/photos',
    optReference: 'assets/opt-media/reference'
  }
};

function joinURL(base, path) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function getJSON(path, options = {}) {
  const {
    cache = 'no-cache'
  } = options;

  const url = joinURL(DATA_CENTER_BASE_URL, path);

  const response = await fetch(url, { cache });

  if (!response.ok) {
    throw new Error(
      `Data Center request failed: ${response.status} ${url}`
    );
  }

  return response.json();
}

async function get(key, options) {
  const path = DATA_CENTER_PATHS[key];

  if (!path) {
    throw new Error(`Unknown Data Center dataset: ${key}`);
  }

  return getJSON(path, options);
}

export const DataCenterAdapter = {

  baseURL() {
    return DATA_CENTER_BASE_URL;
  },

  getCrops(options) {
    return get('crops', options);
  },

  getPests(options) {
    return get('pests', options);
  },

  getDiseases(options) {
    return get('diseases', options);
  },

  getWeeds(options) {
    return get('weeds', options);
  },

  getProducts(options) {
    return get('products', options);
  },

  getPesticides(options) {
    return get('products', options);
  },

  getFertilizers(options) {
    return get('fertilizers', options);
  },

  getActiveIngredients(options) {
    return get('activeIngredients', options);
  },

  getMoA(options) {
    return get('moa', options);
  },

  getCropHama(options) {
    return getJSON(DATA_CENTER_PATHS.relations.cropHama, options);
  },

  getCropPenyakit(options) {
    return getJSON(DATA_CENTER_PATHS.relations.cropPenyakit, options);
  },

  getCropGulma(options) {
    return getJSON(DATA_CENTER_PATHS.relations.cropGulma, options);
  },

  getCropOPT(options) {
    return getJSON(DATA_CENTER_PATHS.relations.cropOPT, options);
  },

  getProductOPT(options) {
    return getJSON(DATA_CENTER_PATHS.relations.productOPT, options);
  },

  getProductCrop(options) {
    return getJSON(DATA_CENTER_PATHS.relations.productCrop, options);
  },

  getAIMoA(options) {
    return getJSON(DATA_CENTER_PATHS.relations.aiMoa, options);
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

    return joinURL(DATA_CENTER_BASE_URL, value);
  },

  resolveMedia(item) {
    if (!item) return '';

    if (typeof item === 'string') {
      return this.resolveMediaPath(item);
    }

    if (item.local_path) {
      return this.resolveMediaPath(item.local_path);
    }

    if (item.remote_url) {
      return item.remote_url;
    }

    return '';
  },

  async test() {
    const results = {};

    const tests = {
      crops: () => this.getCrops(),
      pests: () => this.getPests(),
      diseases: () => this.getDiseases(),
      weeds: () => this.getWeeds(),
      products: () => this.getProducts(),
      fertilizers: () => this.getFertilizers(),
      activeIngredients: () => this.getActiveIngredients(),
      moa: () => this.getMoA()
    };

    for (const [name, fn] of Object.entries(tests)) {
      try {
        const data = await fn();

        let count = null;

        if (Array.isArray(data)) {
          count = data.length;
        } else if (Array.isArray(data?.records)) {
          count = data.records.length;
        } else if (data?.records && typeof data.records === 'object') {
          count = Object.values(data.records)
            .reduce(
              (total, value) =>
                total + (Array.isArray(value) ? value.length : 0),
              0
            );
        }

        results[name] = {
          ok: true,
          count
        };
      } catch (error) {
        results[name] = {
          ok: false,
          error: error.message
        };
      }
    }

    return {
      baseURL: DATA_CENTER_BASE_URL,
      results
    };
  }
};

export default DataCenterAdapter;
