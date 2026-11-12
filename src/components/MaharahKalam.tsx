import React, { useState } from 'react';
import {
  MessageCircle,
  Volume2,
  Mic,
  Send,
  Sparkles,
  Bot,
  User,
  Eye,
  EyeOff,
  RefreshCw,
  Info,
  CheckCircle2
} from 'lucide-react';
import { HIWAR_DATA } from '../data/alMihnahData';
import { playArabicAudio, stopArabicAudio } from '../utils/arabicTTS';

interface MaharahKalamProps {
  onScoreEarned: (pts: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  arabic: string;
  indo?: string;
  grammarNote?: string;
}

export const MaharahKalam: React.FC<MaharahKalamProps> = ({ onScoreEarned }) => {
  const [activeTab, setActiveTab] = useState<'teks-dialog' | 'ai-partner'>('teks-dialog');
  const [selectedHiwarIndex, setSelectedHiwarIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [activePlayingLine, setActivePlayingLine] = useState<number | null>(null);

  // AI Hiwar Partner State
  const [aiRole, setAiRole] = useState<'Hasyim' | 'Dokter' | 'Guru' | 'Polisi'>('Hasyim');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      arabic: 'السَّلَامُ عَلَيْكُمْ يَا صَدِيْقِي! أَهْلًا وَسَهْلًا بِكَ. مَاذَا تُرِيْدُ أَنْ تَكُوْنَ فِي الْمُسْتَقْبَلِ؟',
      indo: 'Assalamu\'alaikum sahabatku! Selamat datang. Kamu ingin menjadi apa di masa depan nanti?',
      grammarNote: 'Menggunakan fi\'il mudhari\' "تُرِيْدُ أَنْ تَكُوْنَ" (Masdar Mu\'awwal).',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    'أُرِيْدُ أَنْ أَكُوْنَ طَبِيْبًا لِمُعَالَجَةِ الْمَرْضَى',
    'أَنَا أُحِبُّ أَنْ أَكُوْنَ مُدَرِّسًا لِتَعْلِيْمِ التَّلَامِيْذِ',
    'أُرِيْدُ أَنْ أَكُوْنَ شُرْطِيًّا لِتَنْظِيْمِ الْمُرُوْرِ',
  ]);

  const currentHiwar = HIWAR_DATA[selectedHiwarIndex];

  const handlePlayLine = (idx: number, arabicText: string) => {
    stopArabicAudio();
    setActivePlayingLine(idx);
    playArabicAudio(
      arabicText,
      0.85,
      () => setActivePlayingLine(idx),
      () => setActivePlayingLine(null),
      () => setActivePlayingLine(null)
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || userInput).trim();
    if (!text || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      arabic: text,
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setUserInput('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai/hiwar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.sender,
            text: m.arabic,
          })),
          userRole: 'Siswa MTs Kelas 8',
          aiRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi teman dialog AI.');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        arabic: data.arabicText || 'مَا شَاءَ اللّٰهُ، كَلَامٌ جَمِيْلٌ!',
        indo: data.indonesianTranslation,
        grammarNote: data.grammarNote,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      if (Array.isArray(data.recommendedReplies) && data.recommendedReplies.length > 0) {
        setSuggestedReplies(data.recommendedReplies);
      }
      onScoreEarned(5);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        arabic: 'أَحْسَنْتَ يَا أَخِي! اللُّغَةُ الْعَرَبِيَّةُ لُغَةٌ جَمِيْلَةٌ، وَالْعَمَلُ الشَّرِيْفُ عِبَادَةٌ.',
        indo: 'Bagus sekali saudaraku! Bahasa Arab adalah bahasa yang indah, dan pekerjaan mulia adalah ibadah.',
        grammarNote: 'Latihan mandiri percakapan seputar profesi.',
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: 'init-1',
        sender: 'ai',
        arabic: 'السَّلَامُ عَلَيْكُمْ يَا صَدِيْقِي! أَهْلًا وَسَهْلًا بِكَ. مَاذَا تُرِيْدُ أَنْ تَكُوْنَ فِي الْمُسْتَقْبَلِ؟',
        indo: 'Assalamu\'alaikum sahabatku! Selamat datang. Kamu ingin menjadi apa di masa depan nanti?',
      },
    ]);
    setSuggestedReplies([
      'أُرِيْدُ أَنْ أَكُوْنَ طَبِيْبًا لِمُعَالَجَةِ الْمَرْضَى',
      'أَنَا أُحِبُّ أَنْ أَكُوْنَ مُدَرِّسًا لِتَعْلِيْمِ التَّلَامِيْذِ',
      'أُرِيْدُ أَنْ أَكُوْنَ شُرْطِيًّا لِتَنْظِيْمِ الْمُرُوْرِ',
    ]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Maharah Kalam (Keterampilan Berbicara)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            مَهَارَةُ الْكَلَامِ : <span className="font-arabic text-blue-700">الْحِوَارُ عَنِ الْمِهْنَةِ</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Latih kelancaran lidah dalam berbicara bahasa Arab (Hiwar) tentang cita-cita profesi, alasan pemilihan
            dengan Masdar Sharih, dan lokasi kerja.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-center shrink-0">
          <button
            onClick={() => setActiveTab('teks-dialog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'teks-dialog'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teks Dialog Buku
          </button>
          <button
            onClick={() => setActiveTab('ai-partner')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai-partner'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Teman Percakapan AI</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Teks Dialog Buku */}
      {activeTab === 'teks-dialog' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            {/* Hiwar Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Pilih Percakapan:</span>
              <div className="flex gap-2">
                {HIWAR_DATA.map((h, idx) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSelectedHiwarIndex(idx);
                      stopArabicAudio();
                      setActivePlayingLine(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedHiwarIndex === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Hiwar {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranslation ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan'}</span>
            </button>
          </div>

          {/* Dialogue Presentation */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 text-center">
              <h3 className="font-arabic text-2xl font-bold text-slate-900">{currentHiwar.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{currentHiwar.desc}</p>
            </div>

            <div className="space-y-4">
              {currentHiwar.lines.map((line, idx) => {
                const isPlaying = activePlayingLine === idx;
                const isFirstSpeaker = line.speaker === currentHiwar.lines[0].speaker;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isFirstSpeaker
                        ? 'bg-blue-50/50 border-blue-100 mr-4 md:mr-16'
                        : 'bg-emerald-50/50 border-emerald-100 ml-4 md:ml-16'
                    } ${isPlaying ? 'ring-2 ring-amber-400 bg-amber-50/60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isFirstSpeaker
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {line.speaker}
                      </span>

                      <button
                        onClick={() => handlePlayLine(idx, line.textArabic)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-600'
                        }`}
                        title="Dengarkan & Ikuti"
                      >
                        <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-arabic text-2xl font-bold text-slate-900 leading-relaxed">
                        {line.textArabic}
                      </p>
                      {showTranslation && (
                        <p className="text-xs text-slate-600 mt-2 text-left italic border-t border-slate-200/50 pt-2">
                          "{line.textIndo}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Teman Dialog AI (Hiwar Partner) */}
      {activeTab === 'ai-partner' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[650px]">
          {/* Chat Header */}
          <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Teman Dialog Bahasa Arab (AI Partner)</h3>
                <p className="text-[11px] text-blue-200">
                  Praktik bercakap seputar profesi dan cita-cita (Bab Al-Mihnah)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={aiRole}
                onChange={(e) => setAiRole(e.target.value as any)}
                className="bg-white/10 text-white border border-white/20 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-hidden"
              >
                <option value="Hasyim" className="text-slate-900">Peran: Hasyim (Teman MTs)</option>
                <option value="Dokter" className="text-slate-900">Peran: Dokter di RS</option>
                <option value="Guru" className="text-slate-900">Peran: Guru Madrasah</option>
                <option value="Polisi" className="text-slate-900">Peran: Polisi Lalu Lintas</option>
              </select>

              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Mulai Ulang Percakapan"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-xs space-y-2 ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-arabic text-xl font-bold leading-relaxed text-right w-full">
                        {msg.arabic}
                      </p>
                      <button
                        onClick={() => playArabicAudio(msg.arabic)}
                        className={`p-1.5 rounded-lg shrink-0 cursor-pointer ${
                          isUser
                            ? 'hover:bg-blue-700 text-blue-100'
                            : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title="Dengarkan Suara"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {msg.indo && (
                      <p className={`text-xs italic pt-1 border-t ${isUser ? 'border-blue-500/60 text-blue-100' : 'border-slate-100 text-slate-500'}`}>
                        "{msg.indo}"
                      </p>
                    )}

                    {msg.grammarNote && (
                      <div className="bg-amber-50 text-amber-900 border border-amber-200 p-2 rounded-lg text-[11px] flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{msg.grammarNote}</span>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Teman dialog sedang menyusun kalimat Arab...</span>
              </div>
            )}
          </div>

          {/* Quick Response Suggestions */}
          <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Pilihan Balasan Cepat:
            </span>
            {suggestedReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(reply)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-arabic text-sm border border-blue-200/70 transition-colors cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Tulis kalimat bahasa Arab atau pilih balasan cepat di atas..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right font-arabic"
              dir="auto"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim() || isAiLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all cursor-pointer shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
