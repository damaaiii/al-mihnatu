/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { MaharahIstima } from './components/MaharahIstima';
import { MaharahKalam } from './components/MaharahKalam';
import { MaharahQiraah } from './components/MaharahQiraah';
import { MaharahKitabah } from './components/MaharahKitabah';
import { TarkibSection } from './components/TarkibSection';
import { IkhtibarSection } from './components/IkhtibarSection';
import { AiUstadzChat } from './components/AiUstadzChat';
import { PdfModal } from './components/PdfModal';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('al_mihnah_score');
      return saved ? Number(saved) : 50;
    }
    return 50;
  });

  const handleScoreEarned = (pts: number) => {
    setTotalScore((prev) => {
      const next = prev + pts;
      if (typeof window !== 'undefined') {
        localStorage.setItem('al_mihnah_score', String(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPdf={() => setIsPdfOpen(true)}
        onOpenAiChat={() => setIsAiOpen(true)}
        totalScore={totalScore}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {activeTab === 'beranda' && (
          <HomeHero
            onSelectTab={setActiveTab}
            onOpenPdf={() => setIsPdfOpen(true)}
            onOpenAi={() => setIsAiOpen(true)}
          />
        )}

        {activeTab === 'istima' && <MaharahIstima onScoreEarned={handleScoreEarned} />}

        {activeTab === 'kalam' && <MaharahKalam onScoreEarned={handleScoreEarned} />}

        {activeTab === 'qiraah' && <MaharahQiraah onScoreEarned={handleScoreEarned} />}

        {activeTab === 'kitabah' && <MaharahKitabah onScoreEarned={handleScoreEarned} />}

        {activeTab === 'tarkib' && <TarkibSection onScoreEarned={handleScoreEarned} />}

        {activeTab === 'ikhtibar' && <IkhtibarSection onScoreEarned={handleScoreEarned} />}
      </main>

      {/* Floating AI Teacher Trigger */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsAiOpen(true)}
          className="flex items-center gap-2.5 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Tanya Ustadz AI</span>
        </button>
      </div>

      {/* Modals */}
      <AiUstadzChat isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <PdfModal isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Al-Mihnah (الْمِهْنَةُ)</span>
            <span>•</span>
            <span>Media Pembelajaran Bahasa Arab MTs Kelas VIII Kemenag RI</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>4 Maharah: الاستماع • الكلام • القراءة • الكتابة</span>
            <span>|</span>
            <span>التراكيب: المصدر الصريح</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
