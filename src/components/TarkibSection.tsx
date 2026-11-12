import React, { useState } from 'react';
import {
  BrainCircuit,
  Volume2,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { TARKIB_LESSONS } from '../data/alMihnahData';
import { playArabicAudio } from '../utils/arabicTTS';
import confetti from 'canvas-confetti';

interface TarkibSectionProps {
  onScoreEarned: (pts: number) => void;
}

export const TarkibSection: React.FC<TarkibSectionProps> = ({ onScoreEarned }) => {
  const [activeSubTab, setActiveSubTab] = useState<'konsep' | 'transformasi' | 'wazan' | 'latihan'>('konsep');
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillSelected, setDrillSelected] = useState<number | null>(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillCompleted, setDrillCompleted] = useState(false);

  const currentDrill = TARKIB_LESSONS.tarkibDrills[drillIndex % TARKIB_LESSONS.tarkibDrills.length];

  const handleSelectDrill = (optIndex: number) => {
    if (drillSelected !== null) return;
    setDrillSelected(optIndex);
    if (optIndex === currentDrill.correct) {
      setDrillScore((prev) => prev + 20);
      onScoreEarned(20);
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const handleNextDrill = () => {
    if (drillIndex + 1 >= TARKIB_LESSONS.tarkibDrills.length) {
      setDrillCompleted(true);
    } else {
      setDrillIndex((prev) => prev + 1);
      setDrillSelected(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-rose-600" />
            <span>Al-Qawa'id wat-Tarkib (Tata Bahasa Arab)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            الْقَوَاعِدُ وَالتَّرَاكِيْبُ : <span className="font-arabic text-rose-700">الْـمَصْدَرُ الصَّرِيْحُ</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Kuasai susunan gramatikal Masdar Sharih (المصدر الصريح) dan perbedaannya dengan Masdar Mu'awwal
            (المصدر المؤول: أنْ + فعل مضارع), beserta 5 wazan utama fi'il tsulatsi.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-center shrink-0">
          <button
            onClick={() => setActiveSubTab('konsep')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'konsep' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Konsep Dasar
          </button>
          <button
            onClick={() => setActiveSubTab('transformasi')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'transformasi' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tabel Transformasi
          </button>
          <button
            onClick={() => setActiveSubTab('wazan')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'wazan' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5 Wazan Masdar
          </button>
          <button
            onClick={() => setActiveSubTab('latihan')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'latihan' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Latihan Tarkib
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Konsep Dasar Masdar */}
      {activeSubTab === 'konsep' && (
        <div className="space-y-6">
          {/* Definition Banner */}
          <div className="bg-linear-to-r from-rose-900 via-pink-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block mb-2">
              Pengertian Gramatikal (المفهوم)
            </span>
            <h3 className="font-arabic text-3xl font-extrabold text-amber-300 mb-3">
              « الْمَصْدَرُ هُوَ اسْمٌ يَدُلُّ عَلَى حَدَثٍ مُجَرَّدٍ عَنِ الزَّمَانِ »
            </h3>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-3xl">
              <strong>Masdar</strong> adalah kata benda (isim) yang menunjukkan terjadinya suatu perbuatan atau peristiwa,
              namun <em>bebas/tidak terikat</em> oleh dimensi waktu (baik waktu lampau, sekarang, maupun masa depan).
            </p>
          </div>

          {/* Sharih vs Mu'awwal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Isim Asli Mandiri
                </span>
                <span className="font-arabic text-xl font-bold text-emerald-700">المصدر الصريح</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800">1. Masdar Sharih (المصدر الصريح)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kata masdar yang bentuk lafalnya sudah jelas, langsung berupa satu kata isim asli (bukan gabungan partikel).
              </p>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <span className="text-[11px] font-bold text-emerald-900 block">Contoh Kalimat:</span>
                <div className="flex items-center justify-between">
                  <p className="font-arabic text-2xl font-bold text-emerald-950 text-right">
                    أُرِيْدُ <span className="underline text-emerald-700">قِرَاءَةَ</span> الْقُرْآنِ
                  </p>
                  <button
                    onClick={() => playArabicAudio('أُرِيْدُ قِرَاءَةَ الْقُرْآنِ')}
                    className="p-1.5 rounded-lg bg-emerald-200/60 hover:bg-emerald-300 text-emerald-900 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Saya ingin membaca Al-Qur'an" (kata <span className="font-bold">قِرَاءَةَ</span> adalah masdar sharih).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                  Susunan Partikel + Fi'il
                </span>
                <span className="font-arabic text-xl font-bold text-amber-700">المصدر المؤول</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800">2. Masdar Mu'awwal (المصدر المؤول)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Susunan frasa yang terdiri dari huruf masdariyah (seperti <strong className="text-slate-800">أَنْ</strong> atau <strong className="text-slate-800">لِـ</strong>) yang diikuti oleh fi'il mudhari' manshub.
              </p>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 space-y-2">
                <span className="text-[11px] font-bold text-amber-900 block">Contoh Kalimat:</span>
                <div className="flex items-center justify-between">
                  <p className="font-arabic text-2xl font-bold text-amber-950 text-right">
                    أُرِيْدُ <span className="underline text-amber-700">أَنْ أَقْرَأَ</span> الْقُرْآنَ
                  </p>
                  <button
                    onClick={() => playArabicAudio('أُرِيْدُ أَنْ أَقْرَأَ الْقُرْآنَ')}
                    className="p-1.5 rounded-lg bg-amber-200/60 hover:bg-amber-300 text-amber-900 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Saya ingin (agar saya) membaca Al-Qur'an" (susunan <span className="font-bold">أَنْ أَقْرَأَ</span> adalah masdar mu'awwal).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Tabel Transformasi Step-by-Step */}
      {activeSubTab === 'transformasi' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Tabel Komparasi Buku Siswa Hal. 79
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Transformasi: Dari Masdar Mu'awwal (أَنْ + فعل) ke Masdar Sharih
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Perhatikan bagaimana susunan "أَنْ + فعل مضارع" dapat diubah secara luwes menjadi satu kata Masdar Sharih.
            </p>
          </div>

          <div className="space-y-4">
            {TARKIB_LESSONS.transformationRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Left: Mu'awwal */}
                  <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                      المصدر المؤول (أَنْ / لِـ + الفعل)
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-arabic text-2xl font-bold text-slate-900 text-right w-full">
                        {rule.muawwal}
                      </p>
                      <button
                        onClick={() => playArabicAudio(rule.muawwal)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 shrink-0 cursor-pointer"
                        title="Dengarkan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Sharih */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      المصدر الصريح (Kata Masdar Asli)
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-arabic text-2xl font-bold text-emerald-950 text-right w-full">
                        {rule.sharih}
                      </p>
                      <button
                        onClick={() => playArabicAudio(rule.sharih)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 shrink-0 cursor-pointer"
                        title="Dengarkan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-rose-50/60 p-3 rounded-xl border border-rose-100 flex items-start gap-2">
                  <span className="font-bold text-rose-800 shrink-0">Catatan Kaidah:</span>
                  <span>{rule.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: 5 Wazan Masdar Fi'il Tsulatsi */}
      {activeSubTab === 'wazan' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Wazan Masdar Tsulatsi (Modul Hal. 80)
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              5 Pola / Wazan Utama Masdar Fi'il Tsulatsi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sebagian masdar tsulatsi bersifat sima'i, namun ada pola-pola kiasan baku yang menjadi patokan maknanya:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TARKIB_LESSONS.wazans.map((w, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-arabic text-2xl font-bold text-rose-800">{w.wazan}</span>
                </div>

                <p className="text-xs font-semibold text-slate-700">{w.meaning}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 block">Contoh Fi'il & Masdarnya:</span>
                  {w.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="bg-white p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <div className="text-slate-600 font-medium">
                        {ex.arti} ({ex.fiil})
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-arabic font-bold text-base text-slate-900">{ex.masdar}</span>
                        <button
                          onClick={() => playArabicAudio(ex.masdar)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Latihan Interaktif Tarkib */}
      {activeSubTab === 'latihan' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Latihan Soal {drillIndex + 1} dari {TARKIB_LESSONS.tarkibDrills.length}
              </span>
              <h3 className="text-lg font-bold text-slate-800">
                Latihan Pemahaman Tarkib Masdar (Hal. 81)
              </h3>
            </div>
            <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 font-bold px-3 py-1 rounded-full text-xs border border-rose-200">
              <Award className="w-4 h-4 text-rose-600" />
              <span>Skor: {drillScore}</span>
            </div>
          </div>

          {!drillCompleted ? (
            <div className="space-y-6">
              {/* Sentence Presentation */}
              <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-200 text-center space-y-3">
                <span className="text-xs font-bold text-rose-800 block">Perhatikan Kalimat Berikut:</span>
                <p className="font-arabic text-3xl font-bold text-slate-900 leading-relaxed">
                  « {currentDrill.sentence} »
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => playArabicAudio(currentDrill.sentence)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan Kalimat</span>
                  </button>
                </div>
              </div>

              {/* Question */}
              <div className="text-sm font-bold text-slate-800">{currentDrill.question}</div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentDrill.options.map((opt, idx) => {
                  const isSelected = drillSelected === idx;
                  const isCorrect = idx === currentDrill.correct;
                  let style = 'bg-slate-50 border-slate-200 hover:border-rose-300 text-slate-800';

                  if (drillSelected !== null) {
                    if (isCorrect) {
                      style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isSelected) {
                      style = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    } else {
                      style = 'bg-slate-50 border-slate-200 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={drillSelected !== null}
                      onClick={() => handleSelectDrill(idx)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${style}`}
                    >
                      <span className="text-sm font-semibold">{opt}</span>
                      {drillSelected !== null && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {drillSelected !== null && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Next */}
              {drillSelected !== null && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs text-slate-700 font-medium">
                    <strong>Penjelasan:</strong> {currentDrill.explanation}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextDrill}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      Lanjut Latihan Berikutnya →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🎯
              </div>
              <h4 className="text-xl font-bold text-slate-900">Alhamdulillah! Latihan Tarkib Tuntas</h4>
              <p className="text-xs text-slate-600">
                Kamu telah menuntaskan seluruh latihan kaidah Masdar Sharih dengan skor{' '}
                <strong className="text-rose-700">{drillScore} poin</strong>.
              </p>
              <button
                onClick={() => {
                  setDrillIndex(0);
                  setDrillScore(0);
                  setDrillSelected(null);
                  setDrillCompleted(false);
                }}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Latihan Tarkib</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
