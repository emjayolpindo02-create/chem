import React, { useState } from 'react';
import { GAS_LAWS_DATA } from './data/gasLawsData';
import { GasLawId, MiniChemistMood } from './types/chemistry';
import { GasLawModuleView } from './components/GasLawModuleView';
import { ChemistryLibraryView } from './components/ChemistryLibraryView';
import { PeriodicTableTrends } from './components/PeriodicTableTrends';
import { PracticeCenter } from './components/PracticeCenter';
import { FormulaMemoryLab } from './components/FormulaMemoryLab';
import { RealLifeLab } from './components/RealLifeLab';
import { ProgressTracker } from './components/ProgressTracker';
import { ConfusionBusterModal } from './components/ConfusionBusterModal';
import { MiniChemist } from './components/MiniChemist';
import { OfflineBadge } from './components/OfflineBadge';
import { PWAInstallButton } from './components/PWAInstallButton';
import { UnitConverterAndMolesLab } from './components/UnitConverterAndMolesLab';
import { OfflineDownloadModal } from './components/OfflineDownloadModal';
import { Download, Scale } from 'lucide-react';

type MainView = 'library' | 'law' | 'trends' | 'practice' | 'memory' | 'reallife' | 'progress' | 'units';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<MainView>('library');
  const [selectedLawId, setSelectedLawId] = useState<GasLawId>('boyles-law');
  const [practiceTargetTopicId, setPracticeTargetTopicId] = useState<string | null>(null);
  const [libraryInitialShelf, setLibraryInitialShelf] = useState<string>('gas-laws');
  const [showConfusionBuster, setShowConfusionBuster] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mini Chemist guide dynamic state
  const [chemistMood, setChemistMood] = useState<MiniChemistMood>({
    state: 'idle',
    message: "Greetings! I'm Dr. Kelvin. Tap any Gas Law or shelf to begin, or use 'Help Me Choose' if you're stuck on a formula!"
  });

  const handleOpenGasLaw = (lawId: GasLawId) => {
    setSelectedLawId(lawId);
    setCurrentView('law');
    setChemistMood({
      state: 'explaining',
      message: `Examining ${GAS_LAWS_DATA[lawId].name}! Notice which variables change and which stay locked.`
    });
  };

  const handleOpenPracticeForTopic = (topicId?: string) => {
    if (topicId) {
      setPracticeTargetTopicId(topicId);
    }
    setCurrentView('practice');
    setChemistMood({
      state: 'thinking',
      message: topicId 
        ? `Loaded practice problems for topic: ${topicId}. Review given data and identify the unknown!` 
        : 'Practice Center loaded! Filter by any topic or difficulty, and beware of trap answers.'
    });
  };

  const handleSelectView = (view: MainView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);

    if (view === 'practice') {
      setPracticeTargetTopicId(null);
      setChemistMood({
        state: 'thinking',
        message: 'Practice Center loaded! Practice problems are available for each topic in our curriculum.'
      });
    } else if (view === 'trends') {
      setChemistMood({
        state: 'simulation',
        message: 'Periodic Trends Table online! Compare atomic radii, electronegativities, and ionization energies.'
      });
    } else if (view === 'memory') {
      setChemistMood({
        state: 'celebrating',
        message: 'Memory Lab active! Use the Formula Builder and speed matching game to build muscle memory.'
      });
    } else if (view === 'reallife') {
      setChemistMood({
        state: 'simulation',
        message: 'Real-Life Lab! See how scuba diving, car tires, and airbags obey exact gas relationships.'
      });
    } else if (view === 'library') {
      setChemistMood({
        state: 'idle',
        message: 'Exploring the Chemistry Shelves. Choose your subject shelf to see only that shelf without distractions!'
      });
    } else if (view === 'units') {
      setChemistMood({
        state: 'simulation',
        message: 'Units & Moles Laboratory active! Convert Pressure, Kelvin, and calculate exact molar masses and dilutions.'
      });
    } else if (view === 'progress') {
      setChemistMood({
        state: 'explaining',
        message: 'Your progress and notes are stored locally in your browser and work 100% offline!'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => handleSelectView('library')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">⚗️</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider text-white">
                  GL<span className="text-cyan-400">-LAB</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                  OFFLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono leading-none">
                Gas Law Laboratory
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleSelectView('library')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'library'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🏛️ Library &amp; Shelves</span>
            </button>

            {/* Quick Gas Laws Dropdown or selector */}
            <div className="relative group">
              <button
                onClick={() => handleSelectView('law')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  currentView === 'law'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>📘 6 Gas Laws</span>
                <span className="text-[10px]">▾</span>
              </button>

              <div className="absolute left-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50">
                {Object.values(GAS_LAWS_DATA).map(law => (
                  <button
                    key={law.id}
                    onClick={() => handleOpenGasLaw(law.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition cursor-pointer flex items-center justify-between"
                  >
                    <span>{law.shortName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{law.scientistYears}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dedicated Periodic Trends Link */}
            <button
              onClick={() => handleSelectView('trends')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'trends'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>⚛️ Periodic Trends</span>
            </button>

            <button
              onClick={() => handleSelectView('practice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'practice'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>📝 Practice</span>
            </button>

            <button
              onClick={() => handleSelectView('units')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'units'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>⚖️ Units &amp; Moles</span>
            </button>

            <button
              onClick={() => handleSelectView('memory')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'memory'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🧠 Memory Lab</span>
            </button>

            <button
              onClick={() => handleSelectView('reallife')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'reallife'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🌍 Real-Life Lab</span>
            </button>

            <button
              onClick={() => handleSelectView('progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'progress'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>📊 Progress</span>
            </button>
          </nav>

          {/* Right Tools: Diagnostic, Offline status, PWA install */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfusionBuster(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 animate-pulse"
              title="Step-by-step diagnostic to pick the right formula"
            >
              <span>🧭</span>
              <span className="hidden sm:inline">Help Me Choose Law</span>
              <span className="sm:hidden">Choose Law</span>
            </button>

            <button
              onClick={() => setShowDownloadModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyan-500/60 text-cyan-300 font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
              title="Download standalone offline HTML file or backup progress"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download Offline</span>
            </button>

            <OfflineBadge />
            <PWAInstallButton />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => handleSelectView('library')}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-200 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>🏛️ Shelf Hub</span>
              </button>
              <button
                onClick={() => handleSelectView('trends')}
                className="p-2.5 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>⚛️ Periodic Trends</span>
              </button>
              <button
                onClick={() => handleSelectView('units')}
                className="p-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>⚖️ Units &amp; Moles</span>
              </button>
              <button
                onClick={() => handleSelectView('practice')}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-200 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>📝 Practice</span>
              </button>
              <button
                onClick={() => handleSelectView('memory')}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-200 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>🧠 Memory Lab</span>
              </button>
              <button
                onClick={() => handleSelectView('reallife')}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-200 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>🌍 Real-Life Lab</span>
              </button>
              <button
                onClick={() => handleSelectView('progress')}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-200 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>📊 Progress</span>
              </button>
              <button
                onClick={() => {
                  setShowDownloadModal(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>📥 Download App</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                The 6 Gas Laws:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.values(GAS_LAWS_DATA).map(law => (
                  <button
                    key={law.id}
                    onClick={() => handleOpenGasLaw(law.id)}
                    className="p-2 rounded-lg bg-slate-950 text-slate-300 text-left text-xs cursor-pointer hover:text-cyan-300"
                  >
                    {law.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'library' && (
          <ChemistryLibraryView
            onOpenGasLaw={handleOpenGasLaw}
            onOpenPractice={handleOpenPracticeForTopic}
            onOpenTrends={() => handleSelectView('trends')}
            onOpenUnitsLab={() => handleSelectView('units')}
            onOpenDownloadModal={() => setShowDownloadModal(true)}
            initialShelf={libraryInitialShelf}
          />
        )}

        {currentView === 'units' && (
          <UnitConverterAndMolesLab onOpenGasLaw={handleOpenGasLaw} />
        )}

        {currentView === 'law' && (
          <GasLawModuleView
            law={GAS_LAWS_DATA[selectedLawId]}
            onSelectOtherLaw={handleOpenGasLaw}
            onOpenConfusionBuster={() => setShowConfusionBuster(true)}
          />
        )}

        {currentView === 'trends' && (
          <PeriodicTableTrends
            onNavigateToTopic={(topicId) => {
              setLibraryInitialShelf('periodic-table');
              setCurrentView('library');
            }}
            onNavigateToPractice={(topicId) => handleOpenPracticeForTopic(topicId)}
          />
        )}

        {currentView === 'practice' && (
          <PracticeCenter
            onOpenConfusionBuster={() => setShowConfusionBuster(true)}
            targetTopicId={practiceTargetTopicId}
            onClearTargetTopic={() => setPracticeTargetTopicId(null)}
          />
        )}

        {currentView === 'memory' && <FormulaMemoryLab />}

        {currentView === 'reallife' && (
          <RealLifeLab onSelectLaw={handleOpenGasLaw} />
        )}

        {currentView === 'progress' && (
          <ProgressTracker onSelectLaw={handleOpenGasLaw} />
        )}
      </main>

      {/* Standalone Offline Download & Backup Modal */}
      <OfflineDownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

      {/* Global Confusion Buster Diagnostic Modal */}
      <ConfusionBusterModal
        isOpen={showConfusionBuster}
        onClose={() => setShowConfusionBuster(false)}
        onSelectLaw={handleOpenGasLaw}
      />

      {/* Floating Animated Mini Chemist Character (Dr. Kelvin) */}
      <MiniChemist
        floating
        mood={chemistMood}
        onAskHelp={() => setShowConfusionBuster(true)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>
            <strong>Chem-Navigator</strong> • Offline Web-Based Chemistry Learning System
          </p>
          <p className="text-[11px] text-slate-600">
            Covers Boyle, Charles, Gay-Lussac, Avogadro, Combined, &amp; Ideal Gas Laws • Periodic Trends Interactive Table • 100% Offline Progressive Web App (PWA)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
