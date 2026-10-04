import React, { useState, useMemo } from 'react';
import { 
  PERIODIC_ELEMENTS, 
  PERIODIC_TREND_DEFINITIONS, 
  ChemicalElement, 
  TrendDefinition 
} from '../data/periodicTableData';
import { 
  Compass, 
  Flame, 
  Zap, 
  Maximize2, 
  Info, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp,
  Layers, 
  GitCompare, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  BookOpen,
  Search,
  Filter,
  Check
} from 'lucide-react';

interface PeriodicTableTrendsProps {
  onNavigateToTopic?: (topicId: string) => void;
  onNavigateToPractice?: (topicId: string) => void;
}

type TrendMode = 'radius' | 'electronegativity' | 'ionization' | 'affinity' | 'valence' | 'category';

export const PeriodicTableTrends: React.FC<PeriodicTableTrendsProps> = ({
  onNavigateToTopic,
  onNavigateToPractice
}) => {
  const [activeTrend, setActiveTrend] = useState<TrendMode>('radius');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(
    PERIODIC_ELEMENTS.find(e => e.symbol === 'F') || PERIODIC_ELEMENTS[0]
  );
  const [compareElementA, setCompareElementA] = useState<ChemicalElement>(
    PERIODIC_ELEMENTS.find(e => e.symbol === 'Na') || PERIODIC_ELEMENTS[0]
  );
  const [compareElementB, setCompareElementB] = useState<ChemicalElement>(
    PERIODIC_ELEMENTS.find(e => e.symbol === 'Cl') || PERIODIC_ELEMENTS[1]
  );
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('all');

  // Quiz state
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [showQuizExplanation, setShowQuizExplanation] = useState<boolean>(false);

  // Mini-Quizzes for Periodic Trends
  const trendQuizzes = [
    {
      question: 'Which of the following atoms has the LARGEST atomic radius?',
      options: ['Sodium (Na)', 'Chlorine (Cl)', 'Magnesium (Mg)', 'Argon (Ar)'],
      correctIndex: 0,
      explanation: 'All four are in Period 3. Moving left-to-right, effective nuclear charge (Zeff) increases, drawing the valence electrons closer. Sodium (Z=11) has the lowest Zeff and the largest radius (190 pm).'
    },
    {
      question: 'Which element possesses the HIGHEST electronegativity on the Pauling scale?',
      options: ['Cesium (Cs)', 'Oxygen (O)', 'Fluorine (F)', 'Chlorine (Cl)'],
      correctIndex: 2,
      explanation: 'Fluorine (F) has an electronegativity of 3.98 (highest). Its small 2p valence shell and high effective nuclear charge exert maximum electrostatic pull on shared electron pairs.'
    },
    {
      question: 'Why does Nitrogen (1402 kJ/mol) have a HIGHER first ionization energy than Oxygen (1314 kJ/mol)?',
      options: [
        'Nitrogen has more protons than Oxygen',
        'Nitrogen has a stable half-filled 2p³ subshell, while Oxygen has pairing repulsion in 2p⁴',
        'Nitrogen has a much larger atomic radius',
        'Nitrogen has extra inner shielding shells'
      ],
      correctIndex: 1,
      explanation: 'Nitrogen’s 2p³ subshell is half-filled with parallel electron spins (Hund’s rule exchange energy). In Oxygen (2p⁴), two electrons share the same 2px orbital, causing electrostatic repulsion that makes electron removal easier.'
    },
    {
      question: 'What happens to the first ionization energy as you move DOWN Group 1 from Lithium to Francium?',
      options: [
        'Increases because atomic mass increases',
        'Stays constant because all have 1 valence electron',
        'Decreases because valence electrons are farther from the nucleus and shielded by core shells',
        'Fluctuates randomly'
      ],
      correctIndex: 2,
      explanation: 'Down a group, each step adds an entire principal quantum shell (n). The valence electron is situated significantly farther from the nucleus and is shielded by core inner electrons, requiring less energy to detach.'
    }
  ];

  // Helper to compute min/max for coloring
  const trendRange = useMemo(() => {
    const validElements = PERIODIC_ELEMENTS.filter(e => {
      if (activeTrend === 'radius') return e.atomicRadiusPm !== null;
      if (activeTrend === 'electronegativity') return e.electronegativity !== null;
      if (activeTrend === 'ionization') return e.ionizationEnergyKj !== null;
      if (activeTrend === 'affinity') return e.electronAffinityKj !== null;
      return true;
    });

    let min = Infinity;
    let max = -Infinity;

    validElements.forEach(e => {
      let val: number | null = null;
      if (activeTrend === 'radius') val = e.atomicRadiusPm;
      if (activeTrend === 'electronegativity') val = e.electronegativity;
      if (activeTrend === 'ionization') val = e.ionizationEnergyKj;
      if (activeTrend === 'affinity') val = e.electronAffinityKj;
      if (activeTrend === 'valence') val = e.valenceElectrons;

      if (val !== null) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    });

    return { min, max };
  }, [activeTrend]);

  // Color generator for trend heatmaps
  const getElementColor = (el: ChemicalElement): string => {
    // Check if element is dimmed by search or filter
    const matchesSearch = !searchQuery || 
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.z.toString() === searchQuery.trim();

    const matchesCategory = selectedCategoryFilter === 'all' || el.category === selectedCategoryFilter;
    const matchesBlock = selectedBlockFilter === 'all' || el.block === selectedBlockFilter;

    if (!matchesSearch || !matchesCategory || !matchesBlock) {
      return 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-25';
    }

    if (activeTrend === 'category') {
      switch (el.category) {
        case 'alkali-metal': return 'bg-rose-950/80 border-rose-500/70 text-rose-200';
        case 'alkaline-earth': return 'bg-orange-950/80 border-orange-500/70 text-orange-200';
        case 'transition-metal': return 'bg-blue-950/80 border-blue-500/70 text-blue-200';
        case 'post-transition-metal': return 'bg-cyan-950/80 border-cyan-500/70 text-cyan-200';
        case 'metalloid': return 'bg-teal-950/80 border-teal-500/70 text-teal-200';
        case 'nonmetal': return 'bg-emerald-950/80 border-emerald-500/70 text-emerald-200';
        case 'halogen': return 'bg-amber-950/80 border-amber-500/70 text-amber-200';
        case 'noble-gas': return 'bg-purple-950/80 border-purple-500/70 text-purple-200';
        case 'lanthanide': return 'bg-pink-950/80 border-pink-500/70 text-pink-200';
        case 'actinide': return 'bg-violet-950/80 border-violet-500/70 text-violet-200';
        default: return 'bg-slate-800 border-slate-700 text-slate-200';
      }
    }

    let val: number | null = null;
    if (activeTrend === 'radius') val = el.atomicRadiusPm;
    if (activeTrend === 'electronegativity') val = el.electronegativity;
    if (activeTrend === 'ionization') val = el.ionizationEnergyKj;
    if (activeTrend === 'affinity') val = el.electronAffinityKj;
    if (activeTrend === 'valence') val = el.valenceElectrons;

    if (val === null) {
      return 'bg-slate-900/60 border-slate-800 text-slate-500';
    }

    const { min, max } = trendRange;
    const ratio = max > min ? Math.max(0, Math.min(1, (val - min) / (max - min))) : 0.5;

    if (activeTrend === 'radius') {
      if (ratio > 0.75) return 'bg-purple-900/80 border-purple-400 text-purple-100 shadow-sm shadow-purple-900/40';
      if (ratio > 0.5) return 'bg-indigo-900/70 border-indigo-400 text-indigo-100';
      if (ratio > 0.25) return 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200';
      return 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200';
    }

    if (activeTrend === 'electronegativity') {
      if (ratio > 0.75) return 'bg-rose-900/80 border-rose-400 text-rose-100 shadow-sm shadow-rose-900/40';
      if (ratio > 0.5) return 'bg-amber-900/70 border-amber-400 text-amber-100';
      if (ratio > 0.25) return 'bg-teal-950/70 border-teal-500/60 text-teal-200';
      return 'bg-sky-950/70 border-sky-500/60 text-sky-200';
    }

    if (activeTrend === 'ionization') {
      if (ratio > 0.75) return 'bg-amber-900/80 border-amber-400 text-amber-100 shadow-sm shadow-amber-900/40';
      if (ratio > 0.5) return 'bg-orange-950/70 border-orange-500/60 text-orange-200';
      if (ratio > 0.25) return 'bg-blue-950/70 border-blue-500/60 text-blue-200';
      return 'bg-slate-900/80 border-slate-700 text-slate-300';
    }

    if (activeTrend === 'affinity') {
      if (ratio > 0.75) return 'bg-emerald-900/80 border-emerald-400 text-emerald-100';
      if (ratio > 0.5) return 'bg-teal-950/70 border-teal-500/60 text-teal-200';
      if (ratio > 0.25) return 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200';
      return 'bg-slate-900/80 border-slate-700 text-slate-400';
    }

    // Valence
    if (ratio > 0.7) return 'bg-violet-900/80 border-violet-400 text-violet-100';
    if (ratio > 0.4) return 'bg-blue-950/70 border-blue-500/60 text-blue-200';
    return 'bg-sky-950/70 border-sky-500/60 text-sky-200';
  };

  const getMetricDisplay = (el: ChemicalElement): string => {
    if (activeTrend === 'radius') return el.atomicRadiusPm ? `${el.atomicRadiusPm} pm` : 'N/A';
    if (activeTrend === 'electronegativity') return el.electronegativity ? `${el.electronegativity}` : '—';
    if (activeTrend === 'ionization') return el.ionizationEnergyKj ? `${el.ionizationEnergyKj} kJ` : 'N/A';
    if (activeTrend === 'affinity') return el.electronAffinityKj !== null ? `${el.electronAffinityKj} kJ` : 'N/A';
    if (activeTrend === 'valence') return `${el.valenceElectrons} val`;
    return el.category.replace('-', ' ');
  };

  const currentDefinition: TrendDefinition | null = 
    activeTrend in PERIODIC_TREND_DEFINITIONS ? PERIODIC_TREND_DEFINITIONS[activeTrend] : null;

  // Lanthanides & Actinides element arrays
  const lanthanides = useMemo(() => {
    return PERIODIC_ELEMENTS.filter(e => e.z >= 57 && e.z <= 71);
  }, []);

  const actinides = useMemo(() => {
    return PERIODIC_ELEMENTS.filter(e => e.z >= 89 && e.z <= 103);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            Complete 118-Element Periodic Table &amp; Trends Explorer
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300">Periodic Table (1-118)</span>
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            All 118 elements fully mapped across Periods 1 to 7, Groups 1 to 18, Lanthanides, and Actinides. Visualize live heatmaps for <strong>Atomic Radii</strong>, <strong>Electronegativity</strong>, and <strong>Ionization Energy</strong>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToTopic?.('periodic-trends')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Periodic Trends Volume</span>
            </button>

            {onNavigateToPractice && (
              <button
                onClick={() => onNavigateToPractice('periodic-trends')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-all border border-slate-700 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Practice Periodic Trend Problems</span>
              </button>
            )}

            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all border cursor-pointer ${
                isCompareMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>{isCompareMode ? 'Hide Element Comparator' : 'Compare 2 Elements Side-by-Side'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Heatmap Mode, Search, Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        {/* Trend Mode Tabs */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Select Trend Heatmap Overlay:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'radius', label: 'Atomic Radius', icon: Maximize2, badge: 'pm' },
              { id: 'electronegativity', label: 'Electronegativity', icon: Flame, badge: 'Pauling' },
              { id: 'ionization', label: '1st Ionization Energy', icon: Zap, badge: 'kJ/mol' },
              { id: 'affinity', label: 'Electron Affinity', icon: Sparkles, badge: 'kJ/mol' },
              { id: 'valence', label: 'Valence Electrons', icon: Layers, badge: '1-8' },
              { id: 'category', label: 'Chemical Categories', icon: Compass, badge: '10 Families' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTrend === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrend(tab.id as TrendMode)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Block Filter Row */}
        <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 118 elements by name, symbol, or atomic number (e.g. Au, Iron, 79)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Block:</span>
              {['all', 's', 'p', 'd', 'f'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBlockFilter(b)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-bold transition cursor-pointer ${
                    selectedBlockFilter === b
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-950 text-slate-300 text-xs font-medium rounded-xl px-3 py-1.5 border border-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All 10 Chemical Categories</option>
              <option value="alkali-metal">Alkali Metals</option>
              <option value="alkaline-earth">Alkaline Earth Metals</option>
              <option value="transition-metal">Transition Metals</option>
              <option value="lanthanide">Lanthanides (Rare Earths)</option>
              <option value="actinide">Actinides (Radioactive)</option>
              <option value="post-transition-metal">Post-Transition Metals</option>
              <option value="metalloid">Metalloids / Semimetals</option>
              <option value="nonmetal">Reactive Nonmetals</option>
              <option value="halogen">Halogens</option>
              <option value="noble-gas">Noble Gases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Element Comparator */}
      {isCompareMode && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <GitCompare className="w-4 h-4" />
              <span>Side-by-Side Element Trend Comparator</span>
            </div>
            <button
              onClick={() => setIsCompareMode(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Element A */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Element A</span>
                <select
                  value={compareElementA.symbol}
                  onChange={(e) => {
                    const el = PERIODIC_ELEMENTS.find(el => el.symbol === e.target.value);
                    if (el) setCompareElementA(el);
                  }}
                  className="bg-slate-800 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none"
                >
                  {PERIODIC_ELEMENTS.map(e => (
                    <option key={e.symbol} value={e.symbol}>{e.z}. {e.name} ({e.symbol})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-950/80 border border-indigo-500/50 flex flex-col items-center justify-center">
                  <span className="text-xs text-indigo-300 font-mono">{compareElementA.z}</span>
                  <span className="text-2xl font-extrabold text-white">{compareElementA.symbol}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{compareElementA.name}</h4>
                  <div className="text-xs text-slate-400">Period {compareElementA.period}, Group {compareElementA.group} • {compareElementA.block}-block</div>
                  <div className="text-xs text-indigo-400 font-mono mt-0.5">{compareElementA.electronConfig}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="bg-slate-900 rounded-lg p-2">
                  <div className="text-[10px] text-slate-400 uppercase">Radius</div>
                  <div className="text-xs font-bold text-white">{compareElementA.atomicRadiusPm ? `${compareElementA.atomicRadiusPm} pm` : 'N/A'}</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-2">
                  <div className="text-[10px] text-slate-400 uppercase">EN (Pauling)</div>
                  <div className="text-xs font-bold text-white">{compareElementA.electronegativity ?? '—'}</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-2">
                  <div className="text-[10px] text-slate-400 uppercase">1st IE</div>
                  <div className="text-xs font-bold text-white">{compareElementA.ionizationEnergyKj ? `${compareElementA.ionizationEnergyKj} kJ` : 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Element B */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Element B</span>
                <select
                  value={compareElementB.symbol}
                  onChange={(e) => {
                    const el = PERIODIC_ELEMENTS.find(el => el.symbol === e.target.value);
                    if (el) setCompareElementB(el);
                  }}
                  className="bg-slate-800 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none"
                >
                  {PERIODIC_ELEMENTS.map(e => (
                    <option key={e.symbol} value={e.symbol}>{e.z}. {e.name} ({e.symbol})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-amber-950/80 border border-amber-500/50 flex flex-col items-center justify-center">
                  <span className="text-xs text-amber-300 font-mono">{compareElementB.z}</span>
                  <span className="text-2xl font-extrabold text-white">{compareElementB.symbol}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{compareElementB.name}</h4>
                  <div className="text-xs text-slate-400">Period {compareElementB.period}, Group {compareElementB.group} • {compareElementB.block}-block</div>
                  <div className="text-xs text-amber-400 font-mono mt-0.5">{compareElementB.electronConfig}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="bg-slate-900 rounded-lg p-2">
                  <div className="text-[10px] text-slate-400 uppercase">Radius</div>
                  <div className="text-xs font-bold text-white">{compareElementB.atomicRadiusPm ? `${compareElementB.atomicRadiusPm} pm` : 'N/A'}</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-2">
                  <div className="text-[10px] text-slate-400 uppercase">EN (Pauling)</div>
                  <div className="text-xs font-bold text-white">{compareElementB.electronegativity ?? '—'}</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-2">
                  <div className="text-[10px] text-slate-400 uppercase">1st IE</div>
                  <div className="text-xs font-bold text-white">{compareElementB.ionizationEnergyKj ? `${compareElementB.ionizationEnergyKj} kJ` : 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Periodic Grid & Selected Element Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Periodic Table Grid Container */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl overflow-x-auto">
          <div className="min-w-[720px] space-y-1">
            {/* Table Header: Group Numbers 1-18 */}
            <div
              className="grid gap-1 mb-2 text-center text-[10px] font-bold text-slate-500 font-mono"
              style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map(g => (
                <div key={g} className="py-1">
                  <span>{g}</span>
                </div>
              ))}
            </div>

            {/* Periods 1 to 7 */}
            {[1, 2, 3, 4, 5, 6, 7].map(periodNum => {
              return (
                <div
                  key={periodNum}
                  className="grid gap-1 items-center"
                  style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                >
                  {Array.from({ length: 18 }, (_, idx) => {
                    const groupNum = idx + 1;

                    // Handle placeholder for Lanthanides (Period 6, Group 3)
                    if (periodNum === 6 && groupNum === 3) {
                      const isLanthanideSelected = selectedElement.z >= 57 && selectedElement.z <= 71;
                      return (
                        <button
                          key="lanthanides-anchor"
                          onClick={() => {
                            const la = PERIODIC_ELEMENTS.find(e => e.z === 57);
                            if (la) setSelectedElement(la);
                          }}
                          className={`h-14 rounded-lg border p-1 flex flex-col justify-center items-center text-center cursor-pointer transition ${
                            isLanthanideSelected
                              ? 'bg-pink-900/80 border-pink-400 text-white ring-2 ring-pink-400'
                              : 'bg-pink-950/40 border-pink-700/50 text-pink-300 hover:bg-pink-900/60'
                          }`}
                          title="Lanthanide Series (57-71)"
                        >
                          <span className="text-[9px] font-mono leading-none opacity-80">57-71</span>
                          <span className="text-xs font-black">La-Lu</span>
                          <span className="text-[8px] opacity-75">4f</span>
                        </button>
                      );
                    }

                    // Handle placeholder for Actinides (Period 7, Group 3)
                    if (periodNum === 7 && groupNum === 3) {
                      const isActinideSelected = selectedElement.z >= 89 && selectedElement.z <= 103;
                      return (
                        <button
                          key="actinides-anchor"
                          onClick={() => {
                            const ac = PERIODIC_ELEMENTS.find(e => e.z === 89);
                            if (ac) setSelectedElement(ac);
                          }}
                          className={`h-14 rounded-lg border p-1 flex flex-col justify-center items-center text-center cursor-pointer transition ${
                            isActinideSelected
                              ? 'bg-violet-900/80 border-violet-400 text-white ring-2 ring-violet-400'
                              : 'bg-violet-950/40 border-violet-700/50 text-violet-300 hover:bg-violet-900/60'
                          }`}
                          title="Actinide Series (89-103)"
                        >
                          <span className="text-[9px] font-mono leading-none opacity-80">89-103</span>
                          <span className="text-xs font-black">Ac-Lr</span>
                          <span className="text-[8px] opacity-75">5f</span>
                        </button>
                      );
                    }

                    // Find element for this period and group (excluding f-block rows handled below)
                    const el = PERIODIC_ELEMENTS.find(
                      e => e.period === periodNum && e.group === groupNum && !(e.z >= 57 && e.z <= 71) && !(e.z >= 89 && e.z <= 103)
                    );

                    if (!el) {
                      return <div key={idx} className="h-14 rounded-lg bg-transparent" />;
                    }

                    const isSelected = selectedElement.symbol === el.symbol;

                    return (
                      <button
                        key={el.symbol}
                        onClick={() => setSelectedElement(el)}
                        className={`h-14 rounded-lg border p-1 flex flex-col justify-between items-center transition-all cursor-pointer relative group ${
                          getElementColor(el)
                        } ${
                          isSelected ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : 'hover:scale-105 hover:z-10'
                        }`}
                        title={`${el.name} (Z=${el.z}) • Mass: ${el.atomicMass}`}
                      >
                        <div className="w-full flex justify-between items-center text-[9px] font-mono leading-none opacity-80">
                          <span>{el.z}</span>
                          <span className="text-[8px] font-semibold">{el.block}</span>
                        </div>
                        <div className="text-xs font-black tracking-tight leading-none">
                          {el.symbol}
                        </div>
                        <div className="text-[8px] font-medium leading-none truncate max-w-full text-center">
                          {getMetricDisplay(el)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* F-BLOCK SEPARATOR & ROWS: Lanthanides & Actinides */}
            <div className="pt-5 mt-4 border-t border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider px-1">
                <span>Lanthanide &amp; Actinide Series (f-block):</span>
                <span className="text-[10px] text-slate-500 font-mono">15 Elements each</span>
              </div>

              {/* Lanthanide Row (57 to 71) */}
              <div className="flex items-center gap-1">
                <div className="w-16 shrink-0 text-[10px] font-bold text-pink-300 font-mono">
                  Lanthanides:
                </div>
                <div
                  className="grid gap-1 flex-1"
                  style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
                >
                  {lanthanides.map(el => {
                    const isSelected = selectedElement.symbol === el.symbol;
                    return (
                      <button
                        key={el.symbol}
                        onClick={() => setSelectedElement(el)}
                        className={`h-14 rounded-lg border p-1 flex flex-col justify-between items-center transition-all cursor-pointer relative group ${
                          getElementColor(el)
                        } ${
                          isSelected ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : 'hover:scale-105 hover:z-10'
                        }`}
                        title={`${el.name} (Z=${el.z})`}
                      >
                        <div className="w-full flex justify-between items-center text-[9px] font-mono leading-none opacity-80">
                          <span>{el.z}</span>
                          <span className="text-[8px]">4f</span>
                        </div>
                        <div className="text-xs font-black leading-none">
                          {el.symbol}
                        </div>
                        <div className="text-[8px] font-medium leading-none truncate max-w-full text-center">
                          {getMetricDisplay(el)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actinide Row (89 to 103) */}
              <div className="flex items-center gap-1">
                <div className="w-16 shrink-0 text-[10px] font-bold text-violet-300 font-mono">
                  Actinides:
                </div>
                <div
                  className="grid gap-1 flex-1"
                  style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
                >
                  {actinides.map(el => {
                    const isSelected = selectedElement.symbol === el.symbol;
                    return (
                      <button
                        key={el.symbol}
                        onClick={() => setSelectedElement(el)}
                        className={`h-14 rounded-lg border p-1 flex flex-col justify-between items-center transition-all cursor-pointer relative group ${
                          getElementColor(el)
                        } ${
                          isSelected ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : 'hover:scale-105 hover:z-10'
                        }`}
                        title={`${el.name} (Z=${el.z})`}
                      >
                        <div className="w-full flex justify-between items-center text-[9px] font-mono leading-none opacity-80">
                          <span>{el.z}</span>
                          <span className="text-[8px]">5f</span>
                        </div>
                        <div className="text-xs font-black leading-none">
                          {el.symbol}
                        </div>
                        <div className="text-[8px] font-medium leading-none truncate max-w-full text-center">
                          {getMetricDisplay(el)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">Heatmap Scale:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px]">Low</span>
                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
                <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px]">High</span>
              </div>
              <div className="text-[11px] text-slate-500 italic">
                *Click any element square (1-118) to inspect its electron configuration, trends, and chemistry.
              </div>
            </div>
          </div>
        </div>

        {/* Selected Element Inspector Card */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-900 border-2 border-indigo-400 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-indigo-200">{selectedElement.z}</span>
                <span className="text-2xl font-black text-white">{selectedElement.symbol}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedElement.name}</h3>
                <div className="text-xs text-slate-400">
                  Period {selectedElement.period} • Group {selectedElement.group} • {selectedElement.block}-block
                </div>
                <div className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/30 capitalize">
                  {selectedElement.category.replace('-', ' ')}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Atomic Mass</span>
              <span className="text-xs font-mono font-bold text-slate-200">{selectedElement.atomicMass}</span>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Atomic Radius</div>
              <div className="text-lg font-extrabold text-indigo-300">
                {selectedElement.atomicRadiusPm ? `${selectedElement.atomicRadiusPm} pm` : 'Not Measured'}
              </div>
              <div className="text-[10px] text-slate-500">Calculated empirical radius</div>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Electronegativity</div>
              <div className="text-lg font-extrabold text-rose-300">
                {selectedElement.electronegativity ?? 'Inert / N/A'}
              </div>
              <div className="text-[10px] text-slate-500">Pauling Scale (0.7 - 4.0)</div>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">1st Ionization Energy</div>
              <div className="text-lg font-extrabold text-amber-300">
                {selectedElement.ionizationEnergyKj ? `${selectedElement.ionizationEnergyKj} kJ/mol` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-500">M(g) → M⁺(g) + e⁻</div>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Electron Affinity</div>
              <div className="text-lg font-extrabold text-emerald-300">
                {selectedElement.electronAffinityKj !== null ? `${selectedElement.electronAffinityKj} kJ/mol` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-500">X(g) + e⁻ → X⁻(g)</div>
            </div>
          </div>

          {/* Electron Configuration */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block">
              Ground-State Electron Configuration
            </span>
            <div className="font-mono text-sm text-cyan-300 font-bold tracking-wide">
              {selectedElement.electronConfig}
            </div>
            <div className="text-[11px] text-slate-400">
              Valence Electrons: <strong className="text-white">{selectedElement.valenceElectrons}</strong>
            </div>
          </div>

          {/* Scientific Summary */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
            <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">
              Chemical &amp; Physical Insight:
            </div>
            <p>{selectedElement.summary}</p>
          </div>
        </div>
      </div>

      {/* Mini Trend Practice Quiz Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Periodic Trends Diagnostic Challenge</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Question {quizQuestionIndex + 1} of {trendQuizzes.length}
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-200">
          {trendQuizzes[quizQuestionIndex].question}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {trendQuizzes[quizQuestionIndex].options.map((option, idx) => {
            const isSelected = quizAnswerSelected === idx;
            const isCorrect = idx === trendQuizzes[quizQuestionIndex].correctIndex;
            let btnClass = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';

            if (quizAnswerSelected !== null) {
              if (isCorrect) {
                btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md';
              } else if (isSelected) {
                btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  if (quizAnswerSelected === null) {
                    setQuizAnswerSelected(idx);
                    setShowQuizExplanation(true);
                  }
                }}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer flex items-center justify-between ${btnClass}`}
              >
                <span>{option}</span>
                {quizAnswerSelected !== null && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {quizAnswerSelected !== null && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {showQuizExplanation && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <strong className="text-indigo-300">Explanation:</strong>
              <button
                onClick={() => {
                  setQuizQuestionIndex((quizQuestionIndex + 1) % trendQuizzes.length);
                  setQuizAnswerSelected(null);
                  setShowQuizExplanation(false);
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                Next Question →
              </button>
            </div>
            <p>{trendQuizzes[quizQuestionIndex].explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
