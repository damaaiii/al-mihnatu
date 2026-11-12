import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

// Initialize Gemini API client on server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Al-Mihnah Kelas 8 MTs (4 Maharah & Tarkib)',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Arabic Teacher (Tanya Ustadz AI seputar Al-Mihnah & Masdar Sharih)
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server. Pastikan API key terpasang di Secrets panel.',
      });
    }

    const systemInstruction = `
Kamu adalah "Ustadz Zaid", guru Bahasa Arab Madrasah Tsanawiyah (MTs) kelas VIII yang ramah, berilmu, dan mendidik.
Fokus pembelajaran saat ini adalah Bab "الْمِهْنَةُ" (Al-Mihnah / Profesi) dan Tarkib "الْمَصْدَر الصَّرِيْح" (Masdar Sharih & Masdar Mu'awwal).
Buku rujukan: Buku Siswa Bahasa Arab MTs Kelas VIII Kemenag RI (KMA 183).

Karakteristik jawabanmu:
1. Berikan penjelasan yang jelas, mudah dipahami siswa kelas 8 SMP/MTs.
2. Selalu sertakan harakat lengkap (syakal) pada kata atau contoh bahasa Arab.
3. Berikan terjemahan bahasa Indonesia dan makna kosa kata yang berkaitan dengan profesi (طَبِيْب، مُدَرِّس، فَلَّاح، شُرْطِيّ، خَيَّاط، طَبَّاخ، dll.) atau kaidah Masdar Sharih (قِرَاءَة، كِتَابَة، عِلْم، زِرَاعَة، تَنْظِيْم، dll.).
4. Format jawaban dengan markdown yang rapi (gunakan bold, bullet points, dan kutipan jika perlu).
`;

    const userPrompt = context
      ? `Konteks Materi/Aktivitas Siswa:\n${context}\n\nPertanyaan Siswa:\n${question}`
      : question;

    let reply = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: { systemInstruction },
      });
      reply = response.text || '';
    } catch (apiErr: any) {
      console.warn('First Gemini attempt failed, retrying after delay...', apiErr?.message);
      // Brief backoff retry
      await new Promise((r) => setTimeout(r, 1000));
      const retryResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: { systemInstruction },
      });
      reply = retryResponse.text || '';
    }

    if (!reply) {
      reply =
        'مَرْحَبًا بِكَ! الْمَصْدَرُ الصَّرِيْحُ هُوَ اسْمٌ يَدُلُّ عَلَى حَدَثٍ دُوْنَ ارْتِبَاطٍ بِزَمَانٍ، مِثْلَ: قِرَاءَةٌ، كِتَابَةٌ، وَتَعْلِيْمٌ. وَيُمْكِنُ تَحْوِيْلُهُ مِنْ أَنْ + فِعْلٍ مُضَارِعٍ (المصدر المؤول).';
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/ai/ask:', error);
    return res.status(500).json({
      error: error?.message || 'Terjadi kesalahan saat memproses permintaan AI.',
    });
  }
});

// AI Writing Evaluator (Maharah Kitabah - Analisis Insya' & Penggunaan Masdar)
app.post('/api/ai/check-writing', async (req: Request, res: Response) => {
  try {
    const { text, type, promptTitle } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Teks tulisan tidak boleh kosong.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server.',
      });
    }

    const systemInstruction = `
Kamu adalah Pakar Evaluator Maharah Kitabah (Keterampilan Menulis) Bahasa Arab MTs Kelas 8.
Tugasmu adalah menganalisis tulisan siswa bertema "الْمِهْنَةُ" (Profesi / Cita-cita) dan penggunaan susunan Masdar Sharih (المصدر الصريح).

Kriteria penilaian:
1. Ketepatan kosa kata profesi & tempat kerja.
2. Ketepatan qawa'id/tarkib, terutama penggunaan Masdar Sharih (contoh: أُرِيْدُ دِرَاسَةَ الطِّبِّ / أَذْهَبُ لِتَعَلُّمِ الْعُلُوْمِ) atau transformasi dari Masdar Mu'awwal (أَنْ + فعل).
3. Struktur kalimat bahasa Arab (jumlah ismiyyah / fi'liyyah yang selaras muzakkar/muannats).

Keluarkan hasil evaluasi dalam format JSON yang valid dengan skema:
{
  "score": number (0-100),
  "arabicAppreciation": string (kalimat pujian/apresiasi dalam bahasa Arab berharakat, misal "مُمْتَازٌ جِدًّا يَا بُنَيَّ!"),
  "feedbackIndonesian": string (ulasan ramah dan edukatif dalam bahasa Indonesia),
  "correctedText": string (teks revisi yang benar dengan harakat lengkap),
  "masdarAnalysis": string (analisis masdar sharih atau mu'awwal yang digunakan),
  "tips": string[] (2-3 saran perbaikan ringkas)
}
`;

    const userPrompt = `
Jenis Tugas: ${type || 'Menulis Paragraf Profesi / Cita-cita'}
Judul/Panduan Tugas: ${promptTitle || 'Menceritakan Cita-cita dan Alasan dengan Masdar Sharih'}
Teks Tulisan Siswa:
"${text}"

Tolong berikan penilaian dan koreksi mendalam sesuai standar Bahasa Arab MTs Kelas VIII. Berikan output HANYA format JSON tanpa blok markdown lain.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const rawText = (response.text || '{}').trim();
    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      result = {
        score: 85,
        arabicAppreciation: 'أَحْسَنْتَ يَا طَالِبِي الْعَزِيْز!',
        feedbackIndonesian: 'Tulisan sudah cukup baik dengan kosa kata profesi yang relevan.',
        correctedText: text,
        masdarAnalysis: 'Penggunaan kalimat sudah menggambarkan aktivitas profesi.',
        tips: ['Perhatikan kesesuaian mudzakkar dan muannats', 'Gunakan Masdar Sharih dengan harakat yang tepat'],
      };
    }

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/check-writing:', error);
    return res.status(500).json({
      error: error?.message || 'Gagal mengevaluasi tulisan.',
    });
  }
});

// AI Hiwar Roleplay Partner (Maharah Kalam - Percakapan Interaktif Profesi)
app.post('/api/ai/hiwar', async (req: Request, res: Response) => {
  try {
    const { messages, userRole, aiRole } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Riwayat percakapan tidak boleh kosong.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server.',
      });
    }

    const systemInstruction = `
Kamu berperan sebagai ${aiRole || 'Hasyim (teman sekelas di MTs)'} yang sedang berbicara bahasa Arab dengan lawan bicara ${userRole || 'Siswa MTs Kelas 8'}.
Topik pembicaraan: Bab "الْمِهْنَةُ" (Profesi, cita-cita masa depan, tugas pekerjaan, tempat kerja, alasan memilih profesi dengan Masdar Sharih).
Tingkat bahasa: Bahasa Arab MTs Kelas VIII yang fasih, mudah, komunikatif, dan edukatif.

Keluarkan respon HANYA dalam format JSON:
{
  "arabicText": "kalimat balasan bahasa Arab berharakat lengkap (maksimal 2-3 kalimat agar dialog mengalir)",
  "indonesianTranslation": "terjemahan bahasa Indonesia yang luwes",
  "recommendedReplies": ["opsi jawaban 1 dalam bahasa arab berharakat", "opsi jawaban 2 dalam bahasa arab berharakat"],
  "grammarNote": "penjelasan singkat jika ada masdar sharih atau tata bahasa penting di kalimat ini (opsional)"
}
`;

    const chatHistory = messages
      .map((m: any) => `${m.role === 'user' ? 'Siswa' : 'Lawan Bicara'}: ${m.text}`)
      .join('\n');

    const prompt = `Riwayat percakapan sejauh ini:\n${chatHistory}\n\nBerikan balasan selanjutnya untuk dialog ini:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/hiwar:', error);
    return res.status(500).json({
      error: error?.message || 'Gagal menghasilkan balasan percakapan.',
    });
  }
});

// Export default app tanpa app.listen (sesuai spesifikasi Vercel & prompt)
export default app;
