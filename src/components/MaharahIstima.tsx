import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  Award,
  Filter,
  Play,
  RotateCcw
} from 'lucide-react';
import { PROFESSIONS, ISTIMA_RIDDLES, Profession } from '../data/alMihnahData';
import { playArabicAudio, stopArabicAudio } from '../utils/arabicTTS';
import confetti from 'canvas-confetti';

interface MaharahIstimaProps {
  onScoreEarned: (pts: number) => void;
}

export const MaharahIstima: React.FC<MaharahIstimaProps> = ({ onScoreEarned }) => {
  const [activeSubTab, setActiveSubTab] = useState<'mufradat' | 'tebak-audio' | 'teka-teki'>('mufradat');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Tebak Audio Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Teka-teki State
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [riddleSelected, setRiddleSelected] = useState<string | null>(null);
  const [riddleScore, setRiddleScore] = useState(0);
  const [riddleCompleted, setRiddleCompleted] = useState(false);

  const handlePlayAudio = (id: string, text: string) => {
    stopArabicAudio();
    setPlayingId(id);
    playArabicAudio(
      text,
      0.85,
      () => setPlayingId(id),
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  const filteredProfessions = PROFESSIONS.filter((p) => {
    const matchQuery =
      p.indonesian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.arabic.includes(searchQuery) ||
      p.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  // Tebak Audio Quiz Data (derived from professions)
  const currentQuizItem = PROFESSIONS[quizIndex % PROFESSIONS.length];
  // 4 options: the correct one + 3 random ones
  const quizOptions = React.useMemo(() => {
    const others = PROFESSIONS.filter((p) => p.id !== currentQuizItem.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledOthers, currentQuizItem].sort(() => 0.5 - Math.random());
  }, [quizIndex]);

  const handleAnswerQuiz = (selectedId: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(selectedId);
    if (selectedId === currentQuizItem.id) {
      setQuizScore((prev) => prev + 10);
      onScoreEarned(10);
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex + 1 >= 5) {
      setQuizCompleted(true);
    } else {
      setQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  // Riddle Quiz handlers
  const currentRiddle = ISTIMA_RIDDLES[riddleIndex % ISTIMA_RIDDLES.length];
  const handleAnswerRiddle = (opt: string) => {
    if (riddleSelected !== null) return;
    setRiddleSelected(opt);
    if (opt === currentRiddle.correctArabic) {
      setRiddleScore((prev) => prev + 15);
      onScoreEarned(15);
      try {
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleNextRiddle = () => {
    if (riddleIndex + 1 >= ISTIMA_RIDDLES.length) {
      setRiddleCompleted(true);
    } else {
      setRiddleIndex((prev) => prev + 1);
      setRiddleSelected(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-2">
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Maharah Istima' (Keterampilan Menyimak)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            مَهَارَةُ الِاسْتِمَاعِ : <span className="font-arabic text-emerald-700">الْـمُفْرَدَاتُ وَالْعِبَارَاتُ</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Dengarkan pelafalan bahasa Arab standar yang fasih untuk memperkuat memori auditif tentang nama profesi,
            lingkungan kerja, dan aktivitas tugas sehari-hari.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-center shrink-0">
          <button
            onClick={() => setActiveSubTab('mufradat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'mufradat'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kosakata & Suara
          </button>
          <button
            onClick={() => setActiveSubTab('tebak-audio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tebak-audio'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kuis Menyimak
          </button>
          <button
            onClick={() => setActiveSubTab('teka-teki')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'teka-teki'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teka-Teki Profesi
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Mufradat Cards with Audio */}
      {activeSubTab === 'mufradat' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari profesi (Dokter, Guru, طَبِيْب، خَيَّاط...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {[
                { id: 'all', label: 'Semua' },
                { id: 'kesehatan', label: 'Kesehatan' },
                { id: 'pendidikan', label: 'Pendidikan' },
                { id: 'keamanan', label: 'Keamanan' },
                { id: 'pertanian_kuliner', label: 'Pertanian & Kuliner' },
                { id: 'jasa_teknik', label: 'Teknik & Jasa' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfessions.map((prof) => {
              const isPlaying = playingId === prof.id;
              const isSentencePlaying = playingId === `${prof.id}-sentence`;

              return (
                <div
                  key={prof.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Arabic Title & Audio Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-arabic text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {prof.arabic}
                          </h3>
                          {prof.arabicFemale && (
                            <span className="font-arabic text-lg text-slate-400 font-semibold">
                              / {prof.arabicFemale}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-emerald-700">{prof.transliteration}</p>
                        <h4 className="text-sm font-bold text-slate-800">{prof.indonesian}</h4>
                      </div>

                      <button
                        onClick={() => handlePlayAudio(prof.id, prof.arabic)}
                        className={`p-3 rounded-xl transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 text-white scale-110 shadow-md shadow-amber-500/30'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                        }`}
                        title="Dengarkan Lafal Profesi"
                      >
                        <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
                      </button>
                    </div>

                    {/* Workplace & Task Info */}
                    <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500 block text-[11px]">
                          Tempat Kerja (الْمَكَانُ):
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{prof.workplaceIndo}</span>
                          <span className="font-arabic font-semibold text-emerald-800 text-sm">
                            {prof.workplaceArabic}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="font-semibold text-slate-500 block text-[11px]">
                          Tugas & Masdar Digunakan:
                        </span>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-slate-700">{prof.taskIndo}</span>
                          <span className="font-arabic font-semibold text-teal-800 text-sm shrink-0">
                            {prof.taskArabic}
                          </span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/50">
                          {prof.masdarUsed}
                        </span>
                      </div>
                    </div>

                    {/* Example Sentence with Audio */}
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-900">Contoh Kalimat:</span>
                        <button
                          onClick={() => handlePlayAudio(`${prof.id}-sentence`, prof.exampleSentence)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-emerald-600" />
                          <span>{isSentencePlaying ? 'Memutar...' : 'Dengarkan'}</span>
                        </button>
                      </div>
                      <p className="font-arabic text-base text-slate-900 text-right leading-relaxed font-semibold">
                        {prof.exampleSentence}
                      </p>
                      <p className="text-[11px] text-slate-600 italic">{prof.exampleIndo}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Tebak Audio Quiz */}
      {activeSubTab === 'tebak-audio' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Latihan Mendengar Soal {quizIndex + 1} dari 5
              </span>
              <h3 className="text-lg font-bold text-slate-800">Dengarkan Audio & Tentukan Profesi yang Tepat</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs border border-emerald-200">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Skor: {quizScore}</span>
            </div>
          </div>

          {!quizCompleted ? (
            <div className="space-y-6">
              {/* Audio Box */}
              <div className="bg-linear-to-br from-emerald-800 to-teal-900 rounded-2xl p-6 text-white text-center space-y-4">
                <p className="text-xs text-emerald-200 font-medium">
                  Klik tombol di bawah ini untuk memutar contoh kalimat profesi:
                </p>

                <button
                  onClick={() => handlePlayAudio('quiz-audio', currentQuizItem.exampleSentence)}
                  className="mx-auto w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 flex items-center justify-center shadow-lg shadow-amber-400/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Putar Suara Kalimat"
                >
                  <Volume2 className="w-8 h-8 animate-pulse" />
                </button>

                <p className="text-xs text-emerald-300 italic">
                  Petunjuk: Perhatikan tempat kerja dan kata kerja masdar yang disebutkan!
                </p>
              </div>

              {/* Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizOptions.map((opt) => {
                  const isChosen = selectedAnswer === opt.id;
                  const isCorrect = opt.id === currentQuizItem.id;
                  let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswerQuiz(opt.id)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div>
                        <div className="font-arabic text-xl font-bold">{opt.arabic}</div>
                        <div className="text-xs text-slate-500 font-medium">{opt.indonesian}</div>
                      </div>
                      {selectedAnswer !== null && (
                        <div>
                          {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                          {!isCorrect && isChosen && <XCircle className="w-5 h-5 text-rose-600" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Button & Feedback */}
              {selectedAnswer !== null && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    {selectedAnswer === currentQuizItem.id ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Jawaban Tepat! (+10 XP)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Kurang tepat. Yang dimaksud adalah {currentQuizItem.indonesian}.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Lanjut Soal Berikutnya →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🎉
              </div>
              <h4 className="text-xl font-bold text-slate-900">Selesai Latihan Menyimak!</h4>
              <p className="text-xs text-slate-600">
                Kamu telah menyelesaikan 5 soal menyimak dengan total perolehan skor{' '}
                <strong className="text-emerald-700">{quizScore} poin</strong>.
              </p>
              <button
                onClick={() => {
                  setQuizIndex(0);
                  setQuizScore(0);
                  setSelectedAnswer(null);
                  setQuizCompleted(false);
                }}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Latihan</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Teka-Teki Profesi (أصحاب المهن - Siapakah Aku?) */}
      {activeSubTab === 'teka-teki' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Teka-Teki Buku Siswa Hal. 77
              </span>
              <h3 className="text-lg font-bold text-slate-800">
                عَرِّفْ أَصْحَابَ الْمِهَنِ (Tebak Siapakah Pemilik Profesi Ini?)
              </h3>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full text-xs border border-amber-200">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Skor: {riddleScore}</span>
            </div>
          </div>

          {!riddleCompleted ? (
            <div className="space-y-6">
              {/* Clue Box */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">Teka-teki #{riddleIndex + 1}:</span>
                  <button
                    onClick={() => handlePlayAudio('riddle-audio', currentRiddle.clueArabic)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan Petunjuk</span>
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-arabic text-2xl font-bold text-slate-900 leading-relaxed">
                    « {currentRiddle.clueArabic} »
                  </p>
                  <p className="text-xs text-slate-600 mt-2 italic text-left">
                    Artinya: "{currentRiddle.clueIndo}"
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {currentRiddle.options.map((opt) => {
                  const isChosen = riddleSelected === opt;
                  const isCorrect = opt === currentRiddle.correctArabic;
                  let style = 'bg-slate-50 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-900';

                  if (riddleSelected !== null) {
                    if (isCorrect) {
                      style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      style = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    } else {
                      style = 'bg-slate-50 border-slate-200 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      disabled={riddleSelected !== null}
                      onClick={() => handleAnswerRiddle(opt)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${style}`}
                    >
                      <span className="font-arabic text-xl font-bold">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {riddleSelected !== null && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-slate-700">
                    <strong>Penjelasan:</strong> {currentRiddle.explanation}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextRiddle}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      Lanjut Teka-teki Berikutnya →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🎯
              </div>
              <h4 className="text-xl font-bold text-slate-900">Mumtaz! Semua Teka-teki Terpecahkan</h4>
              <p className="text-xs text-slate-600">
                Total skor kecermatan menyimak kamu:{' '}
                <strong className="text-amber-700">{riddleScore} poin</strong>.
              </p>
              <button
                onClick={() => {
                  setRiddleIndex(0);
                  setRiddleScore(0);
                  setRiddleSelected(null);
                  setRiddleCompleted(false);
                }}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mulai Kembali Teka-teki</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
