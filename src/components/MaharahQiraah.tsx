import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle,
  XCircle,
  Award,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { QIRAAH_TEXT } from '../data/alMihnahData';
import { playArabicAudio, stopArabicAudio } from '../utils/arabicTTS';
import confetti from 'canvas-confetti';

interface MaharahQiraahProps {
  onScoreEarned: (pts: number) => void;
}

export const MaharahQiraah: React.FC<MaharahQiraahProps> = ({ onScoreEarned }) => {
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [activeReadingParagraph, setActiveReadingParagraph] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handlePlayParagraph = (id: number, text: string) => {
    stopArabicAudio();
    setActiveReadingParagraph(id);
    playArabicAudio(
      text,
      0.82,
      () => setActiveReadingParagraph(id),
      () => setActiveReadingParagraph(null),
      () => setActiveReadingParagraph(null)
    );
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    QIRAAH_TEXT.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 20;
      }
    });

    setQuizScore(score);
    setSubmittedQuiz(true);
    onScoreEarned(score);
    if (score >= 60) {
      try {
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Maharah Qira'ah (Keterampilan Membaca)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            مَهَارَةُ الْقِرَاءَةِ : <span className="font-arabic text-emerald-700">{QIRAAH_TEXT.titleArabic}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Bacalah teks naratif autentik dari Buku Siswa Kemenag hal. 83 dengan cermat, pahami isi cerita ketiga
            bersaudara saat berkunjung ke pameran profesi, lalu selesaikan uji pemahaman bacaan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setShowAllTranslations(!showAllTranslations)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            {showAllTranslations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAllTranslations ? 'Tutup Semua Arti' : 'Tampilkan Arti Cerita'}</span>
          </button>
        </div>
      </div>

      {/* Reading Text Container */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-md space-y-8">
        <div className="text-center border-b border-slate-100 pb-6">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            {QIRAAH_TEXT.intro}
          </span>
          <h3 className="font-arabic text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
            « {QIRAAH_TEXT.titleArabic} »
          </h3>
          <p className="text-sm font-semibold text-slate-500 mt-1">({QIRAAH_TEXT.titleIndo})</p>
        </div>

        {/* Paragraphs with interactive audio and translations */}
        <div className="space-y-6">
          {QIRAAH_TEXT.paragraphs.map((para) => {
            const isPlaying = activeReadingParagraph === para.id;

            return (
              <div
                key={para.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isPlaying
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40 shadow-md'
                    : 'bg-slate-50/60 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    {para.id}
                  </span>

                  <button
                    onClick={() => handlePlayParagraph(para.id, para.arabic)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlaying ? 'Membaca...' : 'Dengarkan Paragraf'}</span>
                  </button>
                </div>

                <p className="font-arabic text-2xl md:text-3xl font-bold text-slate-900 leading-[2.2] text-right">
                  {para.arabic}
                </p>

                {showAllTranslations && (
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 italic bg-white p-3 rounded-xl">
                    <strong>Terjemahan:</strong> "{para.indo}"
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vocabulary Box */}
        <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200/60 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Kamus Kosakata Penting (الْـمُفْرَدَاتُ الْـهَامَّةُ)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {QIRAAH_TEXT.vocabulary.map((voc, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <div className="font-arabic text-lg font-bold text-emerald-950 text-right">{voc.arabic}</div>
                <div className="text-xs text-slate-600 font-medium">{voc.indo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fahm al-Maqru' (Uji Pemahaman Membaca) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>فَهْمُ الْمَقْرُوْءِ (Latihan Pemahaman Teks Hal. 84)</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Jawab Pertanyaan Berdasarkan Teks di Atas</h3>
          </div>

          {submittedQuiz && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 font-bold px-4 py-2 rounded-2xl border border-emerald-200">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Skor Pemahaman: {quizScore} / 100</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {QIRAAH_TEXT.questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctIndex;

            return (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400">Pertanyaan #{idx + 1}</span>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-arabic text-xl font-bold text-slate-900 mt-1">{q.questionArabic}</p>
                    <button
                      onClick={() => playArabicAudio(q.questionArabic)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
                      title="Dengarkan Soal"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 italic">{q.questionIndo}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    let style = 'bg-white border-slate-200 hover:border-emerald-400 text-slate-800';

                    if (submittedQuiz) {
                      if (optIdx === q.correctIndex) {
                        style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected) {
                        style = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                      } else {
                        style = 'bg-white border-slate-200 opacity-50';
                      }
                    } else if (isSelected) {
                      style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submittedQuiz}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
                      >
                        <span className="font-arabic text-base font-bold w-full">{opt}</span>
                        {submittedQuiz && optIdx === q.correctIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submittedQuiz && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submittedQuiz && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <strong>Kunci & Pembahasan:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {!submittedQuiz ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < QIRAAH_TEXT.questions.length}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Periksa Jawaban Pemahaman ({Object.keys(selectedAnswers).length} / {QIRAAH_TEXT.questions.length})
            </button>
          ) : (
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis Pemahaman</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
