import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playArabicAudio } from '../utils/arabicTTS';

interface AiUstadzChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AiUstadzChat: React.FC<AiUstadzChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'أَهْلًا وَسَهْلًا بِكُمْ! أَنَا "أُسْتَاذُ زَيْدٍ"، مُعَلِّمُ اللُّغَةِ الْعَرَبِيَّةِ الذَّكِيُّ.\n\nSelamat datang! Saya Ustadz Zaid, asisten AI guru Bahasa Arab MTs Kelas 8. Ada materi seputar **Al-Mihnah (Profesi)** atau kaidah **Masdar Sharih & Mu\'awwal** yang ingin kamu tanyakan hari ini?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const presetQuestions = [
    'Jelaskan perbedaan Masdar Sharih dan Masdar Mu\'awwal secara ringkas!',
    'Apa saja 5 wazan utama masdar fi\'il tsulatsi dan contohnya?',
    'Bagaimana mengubah "أَنْ أَعْمَلَ" menjadi Masdar Sharih?',
    'Sebutkan 10 kosa kata profesi bahasa Arab beserta tempat kerjanya!',
  ];

  if (!isOpen) return null;

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || input).trim();
    if (!q || loading) return;

    const userMsg: Message = { id: String(Date.now()), sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pertanyaan.');
      }

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: data.reply || 'Maaf, saya belum dapat menjawab pertanyaan tersebut.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: `⚠️ ${err.message || 'Terjadi gangguan koneksi ke server AI.'}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>Ustadz Zaid AI (مُعَلِّمُ اللُّغَةِ الْعَرَبِيَّةِ)</span>
                <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full font-mono text-emerald-200">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200">
                Pakar Pembelajaran Bahasa Arab MTs Kelas 8 (Bab Al-Mihnah & Masdar)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
          {messages.map((m) => {
            const isUser = m.sender === 'user';

            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm shadow-2xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {!isUser && (
                    <div className="flex justify-end pt-1 border-t border-slate-100">
                      <button
                        onClick={() => playArabicAudio(m.text)}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                        title="Dengarkan Suara Teks Arab"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan Pelafalan</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Ustadz Zaid sedang menyiapkan penjelasan lengkap...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Pertanyaan Populer:
          </span>
          {presetQuestions.map((pq, i) => (
            <button
              key={i}
              onClick={() => handleSend(pq)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-medium border border-emerald-200/60 transition-colors cursor-pointer"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan materi bahasa Arab atau minta contoh kalimat..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 px-4 py-2.5 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
