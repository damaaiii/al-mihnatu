import React from 'react';
import { X, ExternalLink, BookOpen, Download, AlertCircle } from 'lucide-react';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pdfUrl = '/assets/aistudio/MODUL_BAHASA_ARAB_ff97db28.pdf#page=79'; // Hal. 71/79 bab al-mihnah

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Buku Siswa Bahasa Arab MTs Kelas VIII (Kemenag RI 2020)
              </h3>
              <p className="text-[11px] text-slate-400">
                Fokus Bab V: الْـمِهْنَةُ (Halaman 71 – 86) • KMA No. 183
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/assets/aistudio/MODUL_BAHASA_ARAB_ff97db28.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Tab Baru</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe / PDF Viewer */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none"
            title="Buku Siswa Bahasa Arab Kelas VIII Kemenag"
          />
        </div>
      </div>
    </div>
  );
};
