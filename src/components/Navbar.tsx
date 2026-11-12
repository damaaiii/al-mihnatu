import React from 'react';
import {
  BookOpen,
  Headphones,
  MessageCircle,
  FileText,
  PenTool,
  BrainCircuit,
  Award,
  Sparkles,
  FileCode,
  Volume2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPdf: () => void;
  onOpenAiChat: () => void;
  totalScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPdf,
  onOpenAiChat,
  totalScore,
}) => {
  const navItems = [
    { id: 'beranda', label: 'Beranda', arabic: 'الرَّئِيْسِيَّة', icon: BookOpen },
    { id: 'istima', label: 'Istima\'', arabic: 'الِاسْتِمَاع', icon: Headphones },
    { id: 'kalam', label: 'Kalam', arabic: 'الْكَلَام', icon: MessageCircle },
    { id: 'qiraah', label: 'Qira\'ah', arabic: 'الْقِرَاءَة', icon: FileText },
    { id: 'kitabah', label: 'Kitabah', arabic: 'الْكِتَابَة', icon: PenTool },
    { id: 'tarkib', label: 'Tarkib', arabic: 'التَّرَاكِيْب', icon: BrainCircuit },
    { id: 'ikhtibar', label: 'Ikhtibar', arabic: 'الِاخْتِبَار', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide">
              KMA 183 Kemenag RI
            </span>
            <span className="hidden sm:inline text-emerald-100/90">
              Bahasa Arab Madrasah Tsanawiyah (MTs) Kelas VIII • Bab V: الْـمِهْنَةُ (Profesi)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPdf}
              className="flex items-center gap-1.5 hover:text-emerald-200 transition-colors cursor-pointer bg-white/10 px-2.5 py-0.5 rounded-full"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-300" />
              <span>Buku Siswa PDF</span>
            </button>
            <div className="flex items-center gap-1 bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full font-semibold">
              <Award className="w-3 h-3 text-amber-300" />
              <span>{totalScore} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('beranda')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="font-serif font-bold text-xl leading-none">م</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-800 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">
                Al-Mihnah
              </h1>
              <span className="text-sm font-arabic font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-200/60">
                الْـمِهْنَةُ
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">4 Maharah & Tarkib Masdar Sharih</p>
          </div>
        </button>

        {/* Navigation Items (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-xs shadow-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                <span className="font-arabic text-[11px] text-slate-400 font-normal">
                  ({item.arabic})
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action Button: AI Assistant */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiChat}
            className="flex items-center gap-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Ustadz AI</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>

      {/* Sub-nav scrollable for Mobile */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200/60 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
