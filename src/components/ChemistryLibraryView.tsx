import React, { useState, useMemo } from 'react';
import { CHEMISTRY_LIBRARY_TOPICS } from '../data/chemistryLibrary';
import { ChemistryTopic, GasLawId } from '../types/chemistry';
import { MathView } from './MathView';
import { toggleBookmark, getStoredProgress } from '../utils/storage';
import { DailyChemistryChallenge } from './DailyChemistryChallenge';
import { 
  Compass, 
  FlaskConical, 
  Atom, 
  Scale, 
  Dna, 
  Zap, 
  BookOpen, 
  Layers, 
  Search, 
  Sparkles,
  ExternalLink,
  Download,
  Flame,
  Calculator,
  ArrowRightLeft
} from 'lucide-react';

interface ChemistryLibraryViewProps {
  onOpenGasLaw: (lawId: GasLawId) => void;
  onOpenPractice: (topicId?: string) => void;
  onOpenTrends?: () => void;
  onOpenUnitsLab?: () => void;
  onOpenDownloadModal?: () => void;
  initialShelf?: string;
}

export const ChemistryLibraryView: React.FC<ChemistryLibraryViewProps> = ({
  onOpenGasLaw,
  onOpenPractice,
  onOpenTrends,
  onOpenUnitsLab,
  onOpenDownloadModal,
  initialShelf = 'gas-laws'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<ChemistryTopic | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<string>(initialShelf);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getStoredProgress().bookmarks);
  const [showDailyChallenge, setShowDailyChallenge] = useState<boolean>(true);

  // Group definitions for the Shelves
  const shelves = [
    { 
      id: 'gas-laws', 
      title: 'SHELF 1: Gas Law Collection', 
      shortName: 'Gas Laws',
      badge: 'Core Focus',
      icon: FlaskConical,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      activeColor: 'bg-cyan-600 text-white shadow-cyan-600/30 ring-2 ring-cyan-400/50',
      description: 'Boyle, Charles, Gay-Lussac, Avogadro, Combined, & Ideal Gas Laws with simulation links.'
    },
    { 
      id: 'periodic-table', 
      title: 'SHELF 2: Periodic Chemistry', 
      shortName: 'Periodic Trends & Architecture',
      badge: 'Inorganic Foundations',
      icon: Atom,
      color: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
      activeColor: 'bg-indigo-600 text-white shadow-indigo-600/30 ring-2 ring-indigo-400/50',
      description: 'Periodic architecture, atomic radius, ionization energy, electronegativity, and isotopes.'
    },
    { 
      id: 'calculations', 
      title: 'SHELF 3: Chemical Calculations', 
      shortName: 'Stoichiometry & Moles',
      badge: 'Quantitative Chemistry',
      icon: Scale,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      activeColor: 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50',
      description: 'The mole concept, molar mass derivations, limiting reagents, and percent yields.'
    },
    { 
      id: 'compounds', 
      title: 'SHELF 4: Inorganic Compounds', 
      shortName: 'Bonding & Compounds',
      badge: 'Structure & Bonding',
      icon: Dna,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      activeColor: 'bg-amber-600 text-white shadow-amber-600/30 ring-2 ring-amber-400/50',
      description: 'Ionic vs covalent lattices, acids & bases, pH logarithm, and salt solubility rules.'
    },
    { 
      id: 'reactions', 
      title: 'SHELF 5: Chemical Reactions', 
      shortName: 'Reactions & Redox',
      badge: 'Transformation Chemistry',
      icon: Zap,
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
      activeColor: 'bg-rose-600 text-white shadow-rose-600/30 ring-2 ring-rose-400/50',
      description: 'Equation balancing, oxidation-reduction half reactions, and net ionic precipitation.'
    },
  ];

  // Filter topics based on search query AND active shelf
  const filteredTopics = useMemo(() => {
    let list = CHEMISTRY_LIBRARY_TOPICS;

    // Filter by shelf if not "all"
    if (selectedShelf !== 'all') {
      list = list.filter(t => t.category === selectedShelf);
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      topic =>
        topic.title.toLowerCase().includes(q) ||
        (topic.subtitle?.toLowerCase().includes(q) ?? false) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [searchQuery, selectedShelf]);

  const handleToggleBookmark = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(topicId);
    setBookmarkedIds(getStoredProgress().bookmarks);
  };

  const activeShelfObj = shelves.find(s => s.id === selectedShelf);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Library Top Banner & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Inorganic Chemistry Library &amp; Shelf Hub
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Choose a dedicated shelf below to explore specific domains without distraction, or search all reference volumes offline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-cyan-400 font-semibold px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-800">
              📚 {CHEMISTRY_LIBRARY_TOPICS.length} Volumes Stored Locally
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHELF CHOOSER: Dedicated part where users can see and choose their shelf! */}
        {/* ========================================================================= */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Choose Your Subject Shelf:</span>
            </div>
            <button
              onClick={() => setSelectedShelf('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                selectedShelf === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              View All Shelves
            </button>
          </div>

          {/* Shelf Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {shelves.map(shelf => {
              const Icon = shelf.icon;
              const isSelected = selectedShelf === shelf.id;
              const volumeCount = CHEMISTRY_LIBRARY_TOPICS.filter(t => t.category === shelf.id).length;

              return (
                <button
                  key={shelf.id}
                  onClick={() => setSelectedShelf(shelf.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? `${shelf.activeColor} shadow-lg ring-2`
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-cyan-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-950 text-slate-400'
                    }`}>
                      {volumeCount} vol
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{shelf.shortName}</h4>
                    <span className={`text-[9px] block mt-0.5 opacity-80 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {shelf.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Offline Search Bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-3.5 text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search within ${activeShelfObj ? activeShelfObj.shortName : 'all shelves'} (e.g. Boyle, Kelvin, electronegativity, molar mass, pH)...`}
            className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* Quick Search Tag Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          <span>Popular searches:</span>
          {['Boyle', 'Kelvin', 'STP', 'Atomic Radius', 'Electronegativity', 'Molar Mass', 'Redox', 'Acids'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Interactive Actions Hub Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('daily-challenge-bottom');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Daily Challenge ↓</span>
          </button>

          {onOpenUnitsLab && (
            <button
              onClick={onOpenUnitsLab}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-600 transition cursor-pointer flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unit Converter &amp; Moles Lab</span>
            </button>
          )}

          {onOpenTrends && (
            <button
              onClick={onOpenTrends}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-indigo-950 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-600 transition cursor-pointer flex items-center gap-1.5"
            >
              <Atom className="w-3.5 h-3.5 text-indigo-400" />
              <span>Periodic Trends Table</span>
            </button>
          )}
        </div>

        {onOpenDownloadModal && (
          <button
            onClick={onOpenDownloadModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Offline App (.html)</span>
          </button>
        )}
      </div>

      {/* Specific Shelf Callout Banner if Periodic Chemistry is selected */}
      {selectedShelf === 'periodic-table' && onOpenTrends && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Periodic Table for Trends Available!</span>
            </div>
            <p className="text-xs text-slate-300">
              Examine live heatmaps of Atomic Radii, Electronegativity, and Ionization Energy with our side-by-side element comparator.
            </p>
          </div>
          <button
            onClick={onOpenTrends}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md hover:shadow-indigo-600/30"
          >
            <Atom className="w-4 h-4" />
            Launch Periodic Table Tool →
          </button>
        </div>
      )}

      {/* Specific Shelf Callout Banner if Calculations & Moles is selected */}
      {selectedShelf === 'calculations' && onOpenUnitsLab && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <span>Gas Law Unit Converter &amp; Moles Laboratory Available!</span>
            </div>
            <p className="text-xs text-slate-300">
              Calculate exact molecular weights, bridge Mass ⇄ Moles ⇄ Particle Counts, solve dilutions (M₁V₁=M₂V₂), and convert Pressure &amp; Kelvin.
            </p>
          </div>
          <button
            onClick={onOpenUnitsLab}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md hover:shadow-emerald-600/30 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            Launch Units &amp; Moles Lab →
          </button>
        </div>
      )}

      {/* Library Shelves View: Shows ONLY selected shelf or all shelves */}
      <div className="space-y-10">
        {shelves
          .filter(shelf => selectedShelf === 'all' || selectedShelf === shelf.id)
          .map(shelf => {
            const shelfTopics = filteredTopics.filter(t => t.category === shelf.id);
            if (shelfTopics.length === 0 && searchQuery) return null;

            return (
              <div key={shelf.id} className="space-y-3">
                {/* Shelf Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-2">
                      <span>{shelf.title}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-cyan-400 border border-slate-700">
                      {shelf.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">
                      {shelfTopics.length} {shelfTopics.length === 1 ? 'Volume' : 'Volumes'}
                    </span>
                  </div>
                </div>

                {/* Books / Cards on Shelf */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shelfTopics.map(topic => {
                    const isBookmarked = bookmarkedIds.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden"
                      >
                        {/* Spine accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-500 to-blue-600 group-hover:w-2 transition-all" />

                        <div className="pl-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold">
                              {topic.readTime}
                            </span>
                            <button
                              onClick={e => handleToggleBookmark(topic.id, e)}
                              className="text-xs text-slate-500 hover:text-amber-400 cursor-pointer"
                              title={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
                            >
                              {isBookmarked ? '★' : '☆'}
                            </button>
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                            {topic.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                            {topic.summary}
                          </p>
                        </div>

                        {/* Formula preview */}
                        {topic.formulaLatex && (
                          <div className="py-1.5 px-2 bg-slate-950/80 rounded-lg border border-slate-800 text-center text-xs overflow-x-auto">
                            <MathView math={topic.formulaLatex} />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 pl-1">
                          <span>Read volume →</span>
                          <div className="flex items-center gap-2">
                            {topic.relatedLawId && (
                              <span className="text-cyan-400 font-semibold">Sim ⚡</span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPractice(topic.id);
                              }}
                              className="text-amber-400 hover:text-amber-300 font-semibold text-[10px] px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30"
                            >
                              Practice 📝
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Physical Shelf Ledge (Visual Shelf Plinth) */}
                <div className="h-3 w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-b shadow-md border-t border-slate-600/50" />
              </div>
            );
          })}
      </div>

      {/* Topic Detail Modal / Reader */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5 my-8 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] uppercase font-mono text-cyan-400 font-semibold tracking-wider">
                  {selectedTopic.categoryLabel}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-slate-400">{selectedTopic.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-slate-400 hover:text-white p-1 text-sm rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs text-slate-200 leading-relaxed font-sans">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Core Scientific Concept
                </span>
                <p>{selectedTopic.summary}</p>
              </div>

              {selectedTopic.formulaLatex && (
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-center">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                    Fundamental Formula / Governing Equation
                  </span>
                  <MathView block math={selectedTopic.formulaLatex} />
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  Key Principles &amp; Takeaways:
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {selectedTopic.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedTopic.keywords.map(kw => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  toggleBookmark(selectedTopic.id);
                  setBookmarkedIds(getStoredProgress().bookmarks);
                }}
                className="text-xs text-slate-300 hover:text-amber-400 cursor-pointer flex items-center gap-1"
              >
                <span>{bookmarkedIds.includes(selectedTopic.id) ? '★ Bookmarked' : '☆ Bookmark Topic'}</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {selectedTopic.relatedLawId && (
                  <button
                    onClick={() => {
                      if (selectedTopic.relatedLawId) {
                        onOpenGasLaw(selectedTopic.relatedLawId);
                        setSelectedTopic(null);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Launch Interactive Lab Module →
                  </button>
                )}

                {selectedTopic.id === 'periodic-trends' && onOpenTrends && (
                  <button
                    onClick={() => {
                      setSelectedTopic(null);
                      onOpenTrends();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    Open Periodic Table Explorer
                  </button>
                )}

                <button
                  onClick={() => {
                    const tid = selectedTopic.id;
                    setSelectedTopic(null);
                    onOpenPractice(tid);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Practice This Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM SECTION: Daily Chemistry Challenge & Streaks Hub                 */}
      {/* ========================================================================= */}
      <div id="daily-challenge-bottom" className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Daily Chemistry Challenge</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  Streak Practice
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Solve today's question to maintain your daily problem-solving streak and test retention.
              </p>
            </div>
          </div>
        </div>

        <DailyChemistryChallenge onOpenTopicPractice={onOpenPractice} />
      </div>
    </div>
  );
};
