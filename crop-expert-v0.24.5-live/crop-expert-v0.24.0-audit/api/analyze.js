// Crop Expert AI Vision — Vercel Serverless Function
// API key MUST stay in Vercel Environment Variables as OPENAI_API_KEY.
const MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';
const MAX_IMAGE_CHARS = 8_500_000;

function cors(res, origin) {
  // MVP: allow the PWA hosted on GitHub Pages/Vercel to call this endpoint.
  // Later we can restrict this with ALLOWED_ORIGIN in Vercel.
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

export default async function handler(req, res) {
  cors(res, req.headers.origin);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { image } = req.body || {};
    if (!image || typeof image !== 'string' || !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(image)) {
      return res.status(400).json({ error: 'Foto tidak ditemukan atau format gambar tidak didukung.' });
    }
    if (image.length > MAX_IMAGE_CHARS) {
      return res.status(413).json({ error: 'Ukuran foto terlalu besar. Coba foto yang lebih kecil.' });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY belum diset di server.' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        input: [{
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Kamu adalah Crop Expert AI untuk identifikasi awal OPT tanaman di Indonesia.

Analisis foto secara konservatif. Hanya gunakan ciri yang benar-benar terlihat. Jangan mengarang detail, nama OPT, atau tingkat kepastian.

Tugas:
1. Identifikasi komoditas/tanaman jika terlihat.
2. Klasifikasikan menjadi tepat satu: HAMA, PENYAKIT, GULMA, ABIOTIK, KERUSAKAN_PESTISIDA, atau TIDAK_CUKUP_DATA.
3. Berikan maksimal 3 kandidat yang paling sesuai dengan bukti visual.
4. Untuk setiap kandidat: nama/label, nama ilmiah bila dapat ditentukan, confidence high/medium/low, ciri visual pendukung, dan pembeda dari kandidat lain.
5. Jika foto tidak cukup, needs_more_photo=true dan jelaskan foto/observasi tambahan yang spesifik.
6. Jangan memberi dosis pestisida, campuran tangki, atau klaim diagnosis pasti.
7. Gunakan Bahasa Indonesia. Pertahankan nama ilmiah dan istilah teknis resmi.
8. Bila gejala dapat disebabkan banyak hal, nyatakan ketidakpastian tersebut.
9. database_queries berisi nama/kata kunci yang paling berguna untuk mencocokkan hasil ke database Crop Expert.

Keluarkan hanya JSON sesuai schema.`
            },
            { type: 'input_image', image_url: image }
          ]
        }],
        text: {
          format: {
            type: 'json_schema',
            name: 'crop_expert_scan',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                crop: { type: 'string' },
                category: { type: 'string', enum: ['HAMA', 'PENYAKIT', 'GULMA', 'ABIOTIK', 'KERUSAKAN_PESTISIDA', 'TIDAK_CUKUP_DATA'] },
                visual_summary: { type: 'string' },
                needs_more_photo: { type: 'boolean' },
                follow_up: { type: 'string' },
                candidates: {
                  type: 'array', maxItems: 3,
                  items: {
                    type: 'object', additionalProperties: false,
                    properties: {
                      name: { type: 'string' },
                      scientific_name: { type: 'string' },
                      confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
                      supporting_signs: { type: 'array', items: { type: 'string' } },
                      differential: { type: 'string' }
                    },
                    required: ['name', 'scientific_name', 'confidence', 'supporting_signs', 'differential']
                  }
                },
                database_queries: { type: 'array', maxItems: 5, items: { type: 'string' } }
              },
              required: ['crop', 'category', 'visual_summary', 'needs_more_photo', 'follow_up', 'candidates', 'database_queries']
            }
          }
        }
      })
    });

    const raw = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: raw?.error?.message || 'OpenAI API error' });
    const text = raw.output_text;
    if (!text) return res.status(502).json({ error: 'AI tidak mengembalikan hasil terstruktur.' });
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err?.message || 'Gagal menganalisis foto.' });
  }
}
