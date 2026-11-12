import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { EVALUATION_QUESTIONS } from '../data/alMihnahData';
import confetti from 'canvas-confetti';

interface IkhtibarSectionProps {
  onScoreEarned: (pts: number) => void;
}

export const IkhtibarSection: React.FC<IkhtibarSectionProps> = ({ onScoreEarned }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [studentName, setStudentName] = useState('Ahmad Fauzan');
  const [madrasahName, setMadrasahName] = useState('MTs Negeri 1');

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitExam = () => {
    let score = 0;
    EVALUATION_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        score += 10;
      }
    });

    setFinalScore(score);
    setSubmitted(true);
    onScoreEarned(score);
    if (score >= 70) {
      try {
        confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setFinalScore(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-cyan-600" />
            <span>Al-Ikhtibar an-Nihai (Ujian Evaluasi Bab V)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            الِاخْتِبَارُ النِّهَائِيُّ : <span className="font-arabic text-cyan-700">بَابُ الْمِهْنَةِ</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Uji pemahamanmu secara komprehensif mencakup 4 Maharah dan Tarkib Masdar Sharih. Peroleh nilai dan
            unduh Sertifikat Kelulusan Digital resmi jika mencapai nilai KKM minimal 70.
          </p>
        </div>

        {submitted && (
          <div className="bg-emerald-50 text-emerald-900 border-2 border-emerald-300 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-600" />
            <div>
              <span className="text-[11px] font-bold uppercase text-emerald-700 block">Nilai Ujian Kamu:</span>
              <span className="text-3xl font-black">{finalScore} / 100</span>
            </div>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-slate-500">
            Daftar Soal Pilihan Ganda (10 Butir Soal)
          </span>
          <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            Terjawab: {answeredCount} / {EVALUATION_QUESTIONS.length}
          </span>
        </div>

        <div className="space-y-6">
          {EVALUATION_QUESTIONS.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correct;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400">Nomor {idx + 1}</span>
                    {submitted && (
                      <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isCorrect ? 'Benar (+10)' : 'Salah (0)'}
                      </span>
                    )}
                  </div>
                  <p className="font-arabic text-2xl font-bold text-slate-900 mt-1 text-right leading-relaxed">
                    {q.question}
                  </p>
                  <p className="text-xs text-slate-500 italic mt-0.5">{q.questionIndo}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    let style = 'bg-white border-slate-200 hover:border-cyan-400 text-slate-800';

                    if (submitted) {
                      if (optIdx === q.correct) {
                        style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected) {
                        style = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                      } else {
                        style = 'bg-white border-slate-200 opacity-50';
                      }
                    } else if (isSelected) {
                      style = 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold ring-2 ring-cyan-500/20';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
                      >
                        <span className="text-xs md:text-sm font-semibold">{opt}</span>
                        {submitted && optIdx === q.correct && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600 bg-white p-3 rounded-xl">
                    <strong>Kunci & Pembahasan:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {!submitted ? (
            <button
              onClick={handleSubmitExam}
              disabled={answeredCount < EVALUATION_QUESTIONS.length}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Kirim Lembar Jawaban ({answeredCount} / {EVALUATION_QUESTIONS.length})
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Ujian</span>
            </button>
          )}
        </div>
      </div>

      {/* Digital Certificate Section (if score >= 70) */}
      {submitted && finalScore >= 70 && (
        <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-amber-300 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                PENGHARGAAN PRESTASI BELAJAR
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Sertifikat Kelulusan Bab Al-Mihnah
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sertifikat</span>
            </button>
          </div>

          {/* Certificate Customizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Siswa:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Madrasah / Sekolah:</label>
              <input
                type="text"
                value={madrasahName}
                onChange={(e) => setMadrasahName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
              />
            </div>
          </div>

          {/* Printable Certificate Canvas */}
          <div className="relative border-8 border-double border-amber-400 p-8 md:p-12 rounded-3xl bg-linear-to-b from-amber-50/40 via-white to-amber-50/30 text-center space-y-6 shadow-md">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <h4 className="font-arabic text-3xl md:text-4xl font-extrabold text-emerald-950 mb-1">
                شَهَادَةُ تَقْدِيْرٍ وَتَفَوُّقٍ
              </h4>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                SERTIFIKAT KELULUSAN PEMBELAJARAN BAHASA ARAB
              </p>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Diberikan dengan penuh penghargaan dan kebanggaan kepada:
            </p>

            <div>
              <h5 className="text-2xl md:text-3xl font-black text-slate-900 border-b-2 border-amber-400 inline-block px-6 pb-1">
                {studentName}
              </h5>
              <p className="text-sm font-semibold text-slate-600 mt-2">{madrasahName}</p>
            </div>

            <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed">
              Telah berhasil menyelesaikan seluruh rangkaian materi dan evaluasi kompetensi{' '}
              <strong>Bab V : الْمِهْنَةُ (Profesi)</strong> mencakup 4 Maharah (Istima', Kalam, Qira'ah, Kitabah)
              dan Kaidah Masdar Sharih dengan perolehan nilai mumtaz:
            </p>

            <div className="inline-block bg-emerald-700 text-white px-6 py-2 rounded-2xl font-black text-xl shadow-md">
              SKOR: {finalScore} / 100
            </div>

            <div className="pt-6 border-t border-amber-200 flex justify-between items-end text-xs text-slate-500 max-w-md mx-auto">
              <div className="text-left">
                <span className="block font-semibold">Kurikulum Kemenag</span>
                <span>KMA 183 Tahun 2019</span>
              </div>
              <div className="text-right">
                <span className="block font-semibold">Guru Pengampu</span>
                <span className="font-arabic text-sm font-bold text-slate-800">مُعَلِّمُ اللُّغَةِ الْعَرَبِيَّةِ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
