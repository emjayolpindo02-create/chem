import React, { useState, useRef } from 'react';
import { downloadOfflineAppFile } from '../utils/offlineBundleGenerator';
import { exportAllUserData, importAllUserData } from '../utils/storage';
import {
  Download,
  FileCode,
  Database,
  Upload,
  CheckCircle2,
  HardDrive,
  Laptop,
  Smartphone,
  ShieldCheck,
  X,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface OfflineDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineDownloadModal: React.FC<OfflineDownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadHtml = () => {
    downloadOfflineAppFile();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleExportJson = () => {
    const jsonStr = exportAllUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chem-navigator-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = importAllUserData(content);
      if (success) {
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => setImportSuccess(false), 3000);
      } else {
        setImportError('Invalid backup file format.');
      }
    };
    reader.onerror = () => {
      setImportError('Failed reading the selected file.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-wide">
              Download Chem-Navigator for Offline Use
            </h3>
            <p className="text-xs text-slate-400">
              Zero internet required. Open from any flash drive, desktop, or mobile device anywhere.
            </p>
          </div>
        </div>

        {/* Option 1: Standalone Single-File HTML Download */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 relative group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Standalone Offline App File (.html)
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A single self-contained HTML file containing all 6 Gas Laws, interactive calculators, offline unit converters, and practice quizzes. Double-click to open in any web browser without needing internet or a server.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/GL-LAB.html"
                download="GL-LAB.html"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer border border-slate-700 shrink-0"
              >
                <span>Direct Link</span>
              </a>
              <button
                onClick={handleDownloadHtml}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download GL-LAB.html</span>
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Downloaded <strong>GL-LAB.html</strong>! Save it to your computer or flash drive and double-click to run 100% offline.
              </span>
            </div>
          )}
        </div>

        {/* Option 2: Export / Import Student Data Backup */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              Student Progress, Streaks &amp; Notes Backup (.json)
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            Export your daily challenge streaks, solved problem history, bookmarks, and formula notes so you can transfer them between devices or restore them anytime.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Progress Backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import / Restore Backup</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {importSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Progress and streaks restored successfully! Refreshing view.</span>
            </div>
          )}

          {importError && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs animate-fadeIn">
              {importError}
            </div>
          )}
        </div>

        {/* Option 3: PWA Browser Installation */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              Install as Native Progressive Web App (PWA)
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chem-Navigator includes a built-in Service Worker and Web App Manifest. You can install it straight to your desktop or mobile home screen via the top right <strong>"Install App"</strong> button or through your browser menu (Chrome / Edge / Safari). Once installed, it launches in fullscreen and continues working offline!
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
