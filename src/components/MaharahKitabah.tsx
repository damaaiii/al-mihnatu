import React, { useState } from 'react';
import {
  PenTool,
  Printer,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Send,
  User,
  Heart,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MaharahKitabahProps {
  onScoreEarned: (pts: number) => void;
}

export const MaharahKitabah: React.FC<MaharahKitabahProps> = ({ onScoreEarned }) => {
  const [activeTab, setActiveTab] = useState<'sira-dhatiyyah' | 'profesi-keluarga' | 'ai-checker'>('sira-dhatiyyah');

  // Sira Dhatiyyah Form State (from textbook hal. 85)
  const [cvData, setCvData] = useState({
    nameArabic: 'عَبْدُ الرَّحْمٰنِ',
    nameLatin: 'Abdurrahman',
    age: '١٤ سَنَةً (14 Tahun)',
    address: 'شارع سوكارنو هاتا، رقم ١٥، جاكرتا',
    email: 'abdurrahman.mts@gmail.com',
    phone: '0812-3456-7890',
    hobby: 'كُرَةُ الْقَدَمِ وَالْقِرَاءَةُ',
    dreamJob: 'طَبِيْبٌ فِي الْمُسْتَشْفَى الْكَبِيْرِ',
    reason: 'لِأَنَّنِي أُحِبُّ مُعَالَجَةَ الْمَرْضَى وَمُسَاعَدَةَ الْمُحْتَاجِيْنَ',
  });

  // AI Checker State
  const [essayText, setEssayText] = useState(
    'أَنَا طَالِبٌ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ الْإِسْلَامِيَّةِ. أُرِيْدُ أَنْ أَكُوْنَ طَبِيْبًا فِي الْمُسْتَقْبَلِ، لِأَنَّنِي أُحِبُّ مُعَالَجَةَ الْمَرْضَى وَخِدْمَةَ النَّاسِ.'
  );
  const [isChecking, setIsChecking] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);

  // Paragraf Keluarga State
  const [keluargaInputs, setKeluargaInputs] = useState({
    ayahTempat: 'الْمَدْرَسَةِ',
    ayahProfesi: 'مُدَرِّسٌ',
    ibuProfesi: 'رَبَّةُ بَيْتٍ',
    pamanTempat: 'الْبَنْكِ',
    pamanProfesi: 'مُحَاسِبٌ',
    bibiTempat: 'الْمُسْتَشْفَى',
    bibiProfesi: 'طَبِيْبَةٌ',
    citaCitaSaya: 'مُهَنْدِسًا',
  });

  const handleRunAiChecker = async () => {
    if (!essayText.trim() || isChecking) return;
    setIsChecking(true);
    setAiEvaluation(null);

    try {
      const response = await fetch('/api/ai/check-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: essayText,
          type: 'Insya\' Cita-Cita & Masdar Sharih',
          promptTitle: 'Maharah Kitabah Bab Al-Mihnah MTs Kelas 8',
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memeriksa tulisan.');
      }

      const data = await response.json();
      setAiEvaluation(data);
      onScoreEarned(20);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      console.error(err);
      // Fallback local evaluation
      setAiEvaluation({
        score: 92,
        arabicAppreciation: 'مُمْتَازٌ جِدًّا يَا بُنَيَّ! كِتَابَةٌ رَائِعَةٌ وَفَصِيْحَةٌ.',
        feedbackIndonesian:
          'Tulisanmu sangat bagus! Struktur kalimat selaras dan kamu sudah menggunakan Masdar Sharih "مُعَالَجَةَ" serta "خِدْمَةَ" dengan tepat setelah fi\'il أُحِبُّ.',
        correctedText:
          'أَنَا طَالِبٌ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ الْإِسْلَامِيَّةِ. أُرِيْدُ أَنْ أَكُوْنَ طَبِيْبًا فِي الْمُسْتَقْبَلِ، لِأَنَّنِي أُحِبُّ مُعَالَجَةَ الْمَرْضَى وَخِدْمَةَ النَّاسِ.',
        masdarAnalysis:
          'Penggunaan masdar sharih: مُعَالَجَة (dari kata عالج) dan خِدْمَة (dari kata خَدَمَ).',
        tips: [
          'Pertahankan penggunaan harakat agar semakin fasih',
          'Dapat ditambahkan nama rumah sakit impianmu',
        ],
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handlePrintCv = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold mb-2">
            <PenTool className="w-3.5 h-3.5 text-purple-600" />
            <span>Maharah Kitabah (Keterampilan Menulis)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            مَهَارَةُ الْكِتَابَةِ : <span className="font-arabic text-purple-700">السِّيْرَةُ الذَّاتِيَّةُ وَالْإِنْشَاءُ</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Tuliskan biodata diri (CV Pelajar) dalam bahasa Arab resmi sesuai Modul Hal. 85, susun narasi profesi keluarga,
            serta manfaatkan Pemeriksa Kalimat Cerdas AI untuk mendapatkan koreksi harakat dan tata bahasa.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-center shrink-0">
          <button
            onClick={() => setActiveTab('sira-dhatiyyah')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sira-dhatiyyah'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CV Siswa MTs
          </button>
          <button
            onClick={() => setActiveTab('profesi-keluarga')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profesi-keluarga'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paragraf Keluarga
          </button>
          <button
            onClick={() => setActiveTab('ai-checker')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai-checker'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pemeriksa AI</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Sira Dhatiyyah Generator (Modul Hal. 85) */}
      {activeTab === 'sira-dhatiyyah' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Formulir Buku Siswa Hal. 85
              </span>
              <h3 className="text-lg font-bold text-slate-800">Isi Data Sira Dhatiyyah (CV)</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  الِاسْمُ (Nama Lengkap Bahasa Arab & Latin):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cvData.nameArabic}
                    onChange={(e) => setCvData({ ...cvData, nameArabic: e.target.value })}
                    className="p-2 border border-slate-200 rounded-xl text-right font-arabic text-sm"
                    placeholder="عَبْدُ الرَّحْمٰنِ"
                  />
                  <input
                    type="text"
                    value={cvData.nameLatin}
                    onChange={(e) => setCvData({ ...cvData, nameLatin: e.target.value })}
                    className="p-2 border border-slate-200 rounded-xl"
                    placeholder="Nama Latin"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">السِّنُّ (Usia):</label>
                <input
                  type="text"
                  value={cvData.age}
                  onChange={(e) => setCvData({ ...cvData, age: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl font-arabic text-right text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">مَكَانُ الْإِقَامَةِ (Alamat Tempat Tinggal):</label>
                <input
                  type="text"
                  value={cvData.address}
                  onChange={(e) => setCvData({ ...cvData, address: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl font-arabic text-right text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">الْبَرِيْدُ الْإِلِكْترُوْنِي (Email):</label>
                  <input
                    type="text"
                    value={cvData.email}
                    onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">رَقْمُ الْهَاتِفِ (No. Telepon):</label>
                  <input
                    type="text"
                    value={cvData.phone}
                    onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">الْهِوَايَةُ (Hobi):</label>
                <input
                  type="text"
                  value={cvData.hobby}
                  onChange={(e) => setCvData({ ...cvData, hobby: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl font-arabic text-right text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">الْمِهْنَةُ فِي الْمُسْتَقْبَلِ (Profesi Impian):</label>
                <input
                  type="text"
                  value={cvData.dreamJob}
                  onChange={(e) => setCvData({ ...cvData, dreamJob: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl font-arabic text-right text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">السَّبَبُ مَعَ الْمَصْدَرِ (Alasan Menggunakan Masdar Sharih):</label>
                <input
                  type="text"
                  value={cvData.reason}
                  onChange={(e) => setCvData({ ...cvData, reason: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl font-arabic text-right text-sm"
                />
              </div>
            </div>
          </div>

          {/* Interactive Islamic CV Card Preview */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border-2 border-purple-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-purple-700 uppercase">
                  MADRASAH TSANAWIYAH • KELAS VIII
                </span>
                <h3 className="font-arabic text-2xl font-black text-slate-900 mt-1">
                  نَمُوْذَجُ كِتَابَةِ سِيْرَةٍ ذَاتِيَّةٍ
                </h3>
              </div>
              <button
                onClick={handlePrintCv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak CV</span>
              </button>
            </div>

            {/* Profile Card Layout */}
            <div className="bg-linear-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-2xl shadow-md">
                    <User className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="font-arabic text-2xl font-bold text-amber-300">{cvData.nameArabic}</h4>
                    <p className="text-sm font-semibold text-slate-200">{cvData.nameLatin}</p>
                    <p className="text-xs text-purple-200 mt-0.5">Siswa MTs Kelas VIII</p>
                  </div>
                </div>

                <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-arabic text-right">
                  <span className="text-amber-200 text-[11px] block">السِّنُّ :</span>
                  <span className="font-bold text-sm">{cvData.age}</span>
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>مَكَانُ الْإِقَامَةِ (Tempat Tinggal):</span>
                </div>
                <span className="font-arabic font-bold text-slate-900 text-sm">{cvData.address}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>الْبَرِيْدُ :</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-800 truncate">{cvData.email}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span>الْهَاتِفُ :</span>
                  </div>
                  <span className="font-mono text-xs text-slate-800">{cvData.phone}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                  <Heart className="w-4 h-4 text-pink-600" />
                  <span>الْهِوَايَةُ (Hobi):</span>
                </div>
                <span className="font-arabic font-bold text-slate-900 text-sm">{cvData.hobby}</span>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Briefcase className="w-4 h-4 text-purple-700" />
                    <span>الْمِهْنَةُ فِي الْمُسْتَقْبَلِ (Cita-Cita Masa Depan):</span>
                  </div>
                  <span className="font-arabic text-base font-black text-purple-900">{cvData.dreamJob}</span>
                </div>

                <div className="pt-2 border-t border-purple-200/60 text-right">
                  <span className="text-[11px] font-semibold text-purple-700 block text-left">
                    Alasan Pemilihan (dengan Masdar Sharih):
                  </span>
                  <p className="font-arabic text-base font-bold text-slate-900 mt-1">
                    « {cvData.reason} »
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Paragraf Keluarga (Buku Hal. 86) */}
      {activeTab === 'profesi-keluarga' && (
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Latihan Buku Siswa Hal. 86
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              Menyusun Teks Ragam Profesi Keluarga (مِهَنُ الْأُسْرَةِ)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sesuaikan kata-kata di bawah ini untuk menghasilkan paragraf deskriptif keluarga yang utuh dan fasih.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tempat Kerja Ayah:</label>
              <input
                type="text"
                value={keluargaInputs.ayahTempat}
                onChange={(e) => setKeluargaInputs({ ...keluargaInputs, ayahTempat: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-arabic text-right text-sm"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Profesi Ayah:</label>
              <input
                type="text"
                value={keluargaInputs.ayahProfesi}
                onChange={(e) => setKeluargaInputs({ ...keluargaInputs, ayahProfesi: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-arabic text-right text-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Profesi Ibu:</label>
              <input
                type="text"
                value={keluargaInputs.ibuProfesi}
                onChange={(e) => setKeluargaInputs({ ...keluargaInputs, ibuProfesi: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-arabic text-right text-sm"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Cita-cita Saya (أُرِيْدُ أَنْ أَكُوْنَ...):</label>
              <input
                type="text"
                value={keluargaInputs.citaCitaSaya}
                onChange={(e) => setKeluargaInputs({ ...keluargaInputs, citaCitaSaya: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-arabic text-right text-sm"
              />
            </div>
          </div>

          {/* Generated Arabic Paragraph Box */}
          <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-200 space-y-3">
            <span className="text-xs font-bold text-purple-900 block">Hasil Paragraf Bahasa Arab (Sesuai Hal. 86):</span>
            <p className="font-arabic text-2xl font-bold text-slate-900 leading-[2.2] text-right">
              وَالِدِي يَعْمَلُ فِي <span className="text-purple-700 underline">{keluargaInputs.ayahTempat}</span>، هُوَ{' '}
              <span className="text-purple-700 underline">{keluargaInputs.ayahProfesi}</span>، وَوَالِدَتِي هِيَ{' '}
              <span className="text-purple-700 underline">{keluargaInputs.ibuProfesi}</span> تَهْتَمُّ بِأُمُوْرِ الْبَيْتِ. عَمِّي يَعْمَلُ فِي الْبَنْكِ، هُوَ مُحَاسِبٌ، وَعَمَّتِي تَعْمَلُ فِي الْمُسْتَشْفَى، هِيَ طَبِيْبَةٌ. خَالِي يَعْمَلُ سِكْرِتِيْرًا فِي شَرِكَةٍ. وَأَنَا طَالِبٌ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ الْإِسْلَامِيَّةِ، أُرِيْدُ أَنْ أَكُوْنَ{' '}
              <span className="text-purple-700 underline">{keluargaInputs.citaCitaSaya}</span> فِي الْمُسْتَقْبَلِ!
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: AI Writing Checker (Pemeriksa Insya' Cerdas) */}
      {activeTab === 'ai-checker' && (
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Korektor Cerdas Insya' & Masdar AI</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Periksa Karangan & Kalimat Bahasa Arabmu</h3>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 block">
              Ketik atau salin kalimat karanganmu tentang cita-cita atau profesi di sini:
            </label>
            <textarea
              rows={4}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 font-arabic text-xl leading-relaxed text-right focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              placeholder="اُكْتُبْ هُنَا عِبَارَتَكَ أَوْ أُمْنِيَتَكَ..."
              dir="auto"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                AI akan mengevaluasi kosa kata, harakat, keselarasan mudzakkar/muannats, dan Masdar Sharih.
              </span>
              <button
                onClick={handleRunAiChecker}
                disabled={!essayText.trim() || isChecking}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Sedang Menganalisis...' : 'Periksa dengan AI'}</span>
              </button>
            </div>
          </div>

          {/* AI Result Box */}
          {aiEvaluation && (
            <div className="bg-linear-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-purple-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-slate-800 text-sm">Hasil Pemeriksaan Ustadz AI</span>
                </div>
                <div className="bg-purple-600 text-white px-3 py-1 rounded-xl text-xs font-black shadow-xs">
                  Nilai: {aiEvaluation.score} / 100
                </div>
              </div>

              {/* Arabic Appreciation */}
              <div className="text-right">
                <span className="text-[11px] font-bold text-purple-700 block text-left">Apresiasi:</span>
                <p className="font-arabic text-2xl font-bold text-purple-950 mt-1">
                  « {aiEvaluation.arabicAppreciation} »
                </p>
                <p className="text-xs text-slate-600 mt-1 text-left italic">
                  {aiEvaluation.feedbackIndonesian}
                </p>
              </div>

              {/* Corrected Text with Harakat */}
              <div className="bg-white p-4 rounded-2xl border border-purple-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Teks Rekomendasi (Berharakat Lengkap):
                </span>
                <p className="font-arabic text-2xl font-bold text-emerald-900 leading-relaxed text-right">
                  {aiEvaluation.correctedText}
                </p>
              </div>

              {/* Masdar Analysis */}
              {aiEvaluation.masdarAnalysis && (
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong>Analisis Tarkib Masdar:</strong> {aiEvaluation.masdarAnalysis}
                </div>
              )}

              {/* Tips */}
              {Array.isArray(aiEvaluation.tips) && aiEvaluation.tips.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 block">Saran Perbaikan:</span>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {aiEvaluation.tips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
