import React from 'react';
import {
  Headphones,
  MessageCircle,
  FileText,
  PenTool,
  BrainCircuit,
  Award,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Target,
  Layers,
  Flame,
  Volume2
} from 'lucide-react';
import { playArabicAudio } from '../utils/arabicTTS';

interface HomeHeroProps {
  onSelectTab: (tab: string) => void;
  onOpenPdf: () => void;
  onOpenAi: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onSelectTab, onOpenPdf, onOpenAi }) => {
  const quoteArabic = 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ';
  const quoteIndo = 'Sebaik-baik manusia adalah yang paling bermanfaat bagi sesama manusia. (HR. Ahmad - Termaktub di Modul Siswa hal. 84)';

  const modules = [
    {
      id: 'istima',
      name: 'مهارة الاستماع',
      sub: 'Maharah Istima\' (Menyimak)',
      desc: 'Dengarkan pelafalan fasih 20+ mufradat profesi, kuis tebak suara audio, dan teka-teki أصحاب المهن.',
      icon: Headphones,
      color: 'from-amber-500 to-orange-600',
      badge: 'Audio Interaktif',
    },
    {
      id: 'kalam',
      name: 'مهارة الكلام',
      sub: 'Maharah Kalam (Berbicara)',
      desc: 'Praktik percakapan interaktif tentang cita-cita dan tugas kerja, didukung Teman Dialog Roleplay AI.',
      icon: MessageCircle,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Roleplay & AI',
    },
    {
      id: 'qiraah',
      name: 'مهارة القراءة',
      sub: 'Maharah Qira\'ah (Membaca)',
      desc: 'Teks autentik "المهنة في المستقبل" (halaman 83), audio per paragraf, terjemahan, dan soal fahm al-maqru\'.',
      icon: FileText,
      color: 'from-emerald-500 to-teal-700',
      badge: 'Teks & Pemahaman',
    },
    {
      id: 'kitabah',
      name: 'مهارة الكتابة',
      sub: 'Maharah Kitabah (Menulis)',
      desc: 'Generator Sira Dhatiyyah (CV Siswa MTs), menyusun paragraf keluarga, dan Pemeriksa Insya\' Cerdas AI.',
      icon: PenTool,
      color: 'from-purple-500 to-pink-600',
      badge: 'CV & AI Checker',
    },
    {
      id: 'tarkib',
      name: 'القواعد والتراكيب',
      sub: 'Tarkib (Masdar Sharih)',
      desc: 'Pendalaman Masdar Sharih vs Mu\'awwal, 5 Wazan Utama Fi\'il Tsulatsi, rumus transformasi, dan kuis gramatikal.',
      icon: BrainCircuit,
      color: 'from-rose-500 to-red-600',
      badge: 'Tata Bahasa',
    },
    {
      id: 'ikhtibar',
      name: 'الاختبار النهائي',
      sub: 'Ikhtibar (Evaluasi Bab)',
      desc: 'Uji pemahaman menyeluruh Bab Al-Mihnah dengan 10 soal standar madrasah dan peroleh sertifikat digital.',
      icon: Award,
      color: 'from-cyan-600 to-blue-700',
      badge: 'Sertifikat Digital',
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner with Islamic Geometrics style */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 md:p-12 shadow-xl border border-emerald-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kurikulum KMA No. 183 Tahun 2019 • Kelas VIII Semester 2</span>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              الـدَّرْسُ الْـخَامِسُ : <span className="text-amber-300 font-arabic">الْـمِهْنَةُ</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-emerald-200">
              Media Pembelajaran 4 Maharah & Tarkib Masdar Sharih
            </p>
          </div>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
            Selamat datang di portal interaktif pembelajaran Bahasa Arab MTs Kelas VIII. Pelajari ragam profesi,
            asah keterampilan <strong className="text-white">Menyimak (Istima')</strong>, <strong className="text-white">Berbicara (Kalam)</strong>,{' '}
            <strong className="text-white">Membaca (Qira'ah)</strong>, dan <strong className="text-white">Menulis (Kitabah)</strong>, serta kuasai susunan gramatikal{' '}
            <strong className="text-amber-300">المصدر الصريح والمصدر المؤول</strong> dengan bimbingan kecerdasan buatan.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('istima')}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Mulai Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAi}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tanya Ustadz AI</span>
            </button>
            <button
              onClick={onOpenPdf}
              className="bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 font-semibold px-4 py-3 rounded-xl text-sm flex items-center gap-2 border border-emerald-700/60 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Modul Kemenag</span>
            </button>
          </div>
        </div>

        {/* Floating Arabic Quote in Hero */}
        <div className="mt-8 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-950/40 p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <button
              onClick={() => playArabicAudio(quoteArabic)}
              title="Dengarkan Audio Hadits"
              className="p-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div>
              <div className="font-arabic text-xl text-amber-300 font-bold tracking-wide">
                « {quoteArabic} »
              </div>
              <p className="text-xs text-slate-300 mt-1 italic">{quoteIndo}</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-mono self-end sm:self-center shrink-0">
            Kutipan Modul Hal. 84
          </span>
        </div>
      </section>

      {/* 4 Maharah & Tarkib Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-600" />
              <span>Ruang Belajar 4 Maharah & Tarkib</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Pilih pilar kemampuan berbahasa Arab yang ingin kamu pelajari hari ini
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => onSelectTab(m.id)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-bl ${m.color} opacity-5 group-hover:opacity-15 rounded-bl-full transition-opacity`}
                />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${m.color} text-white flex items-center justify-center shadow-md shadow-slate-200 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="font-arabic text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {m.name}
                  </h3>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">{m.sub}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{m.desc}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700 pt-3 border-t border-slate-100">
                  <span>Masuk Materi</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kompetensi Dasar & Peta Konsep (Directly referencing page 72 & 73 of the Modul) */}
      <section className="bg-emerald-50/60 rounded-3xl p-6 md:p-8 border border-emerald-200/60 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">
              Kompetensi Dasar & Indikator Pembelajaran (KMA 183)
            </h3>
            <p className="text-xs text-slate-600">
              Sesuai silabus resmi Kementerian Agama RI untuk jenjang MTs Kelas VIII
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>KD 3.9 & 4.9 (Tindak Tutur & Komunikasi Profesi)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memahami fungsi sosial, struktur teks, dan unsur kebahasaan terkait tindak tutur memberi dan meminta
              informasi profesi dengan memperhatikan susunan gramatikal{' '}
              <strong className="text-emerald-700 font-arabic font-semibold">المصدر الصريح</strong> baik secara lisan maupun tulisan.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>KD 3.10 & 4.10 (Analisis Teks Naratif & Menulis)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menganalisis gagasan dari teks naratif sederhana tentang profesi dan masa depan (المهنة في المستقبل)
              serta menyajikan teks deskriptif/sira dhatiyyah dengan kaidah Masdar Sharih yang benar.
            </p>
          </div>
        </div>

        {/* Peta Konsep Ringkas */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Peta Konsep Materi Al-Mihnah (Kelas VIII)
          </h4>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-100/70 text-emerald-800">
              1. Mufradat Profesi (20+ Kosa Kata)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-100/70 text-emerald-800">
              2. Tempat & Tugas Kerja (أين يعمل؟ ولماذا؟)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-teal-100/70 text-teal-800">
              3. Hiwar Cita-cita (ماذا تريد أن تكون؟)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-blue-100/70 text-blue-800">
              4. Teks Naratif Pameran Profesi (معرض المهن)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-purple-100/70 text-purple-800">
              5. Biodata / Sira Dhatiyyah (السيرة الذاتية)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-rose-100/70 text-rose-800 font-bold">
              6. Tarkib: Masdar Sharih vs Mu'awwal & 5 Wazan Utama
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
