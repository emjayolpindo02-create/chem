import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { PRACTICE_PROBLEMS } from '../data/practiceProblems';
import { CHEMISTRY_LIBRARY_TOPICS } from '../data/chemistryLibrary';
import { PracticeProblem, ProblemDifficulty } from '../types/chemistry';
import { MathView } from './MathView';
import { recordProblemResult } from '../utils/storage';
import { 
  Filter, 
  FlaskConical, 
  Atom, 
  Scale, 
  Dna, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface PracticeCenterProps {
  onOpenConfusionBuster: () => void;
  targetTopicId?: string | null;
  onClearTargetTopic?: () => void;
}

export const PracticeCenter: React.FC<PracticeCenterProps> = ({ 
  onOpenConfusionBuster,
  targetTopicId,
  onClearTargetTopic
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | 'all'>('all');
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);

  // User interaction state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showVariableHighlights, setShowVariableHighlights] = useState(true);

  // If a target topic is supplied (e.g. from Library or Periodic Table)
  useEffect(() => {
    if (targetTopicId) {
      const topicObj = CHEMISTRY_LIBRARY_TOPICS.find(t => t.id === targetTopicId);
      if (topicObj) {
        setSelectedCategory(topicObj.category);
        setSelectedTopicId(targetTopicId);
      } else {
        setSelectedTopicId(targetTopicId);
      }
      setActiveProblemIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowSolution(false);
    }
  }, [targetTopicId]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Subjects', icon: Filter },
    { id: 'gas-laws', label: 'Gas Laws', icon: FlaskConical },
    { id: 'periodic-table', label: 'Periodic Chemistry', icon: Atom },
    { id: 'calculations', label: 'Chemical Calculations', icon: Scale },
    { id: 'compounds', label: 'Inorganic Compounds', icon: Dna },
    { id: 'reactions', label: 'Chemical Reactions', icon: Zap }
  ];

  // Topics available under selected category
  const availableTopics = useMemo(() => {
    if (selectedCategory === 'all') {
      return CHEMISTRY_LIBRARY_TOPICS;
    }
    return CHEMISTRY_LIBRARY_TOPICS.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  // Filter problems based on category, specific topic, and difficulty
  const filteredProblems = useMemo(() => {
    return PRACTICE_PROBLEMS.filter(p => {
      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Topic match
      if (selectedTopicId !== 'all' && p.topicId !== selectedTopicId && p.lawId !== selectedTopicId) {
        return false;
      }
      // Difficulty match
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedTopicId, selectedDifficulty]);

  const currentProblem: PracticeProblem | undefined = filteredProblems[activeProblemIndex];

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedTopicId('all');
    setActiveProblemIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowSolution(false);
    if (onClearTargetTopic) onClearTargetTopic();
  };

  const handleTopicChange = (topId: string) => {
    setSelectedTopicId(topId);
    setActiveProblemIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowSolution(false);
    if (onClearTargetTopic && topId === 'all') onClearTargetTopic();
  };

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!currentProblem || !selectedOption || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentProblem.correctAnswer;

    if (isCorrect) {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    }

    const topicKey = currentProblem.topicId || currentProblem.lawId || 'general';
    recordProblemResult(currentProblem.id, topicKey, isCorrect);
  };

  const handleNextProblem = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowSolution(false);
    setShowHint(false);
    setActiveProblemIndex(prev => (prev + 1) % filteredProblems.length);
  };

  const isCurrentCorrect = currentProblem && selectedOption === currentProblem.correctAnswer;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Chemistry &amp; Gas Laws Practice Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Targeted problems across each topic: Gas Laws, Periodic Trends, Stoichiometry, Bonding, and Reactions.
          </p>
        </div>

        {/* Global Diagnostic Jump */}
        <button
          onClick={onOpenConfusionBuster}
          className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-700/80 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <span>🧭</span> Need Help Choosing a Formula?
        </button>
      </div>

      {/* FILTER BAR 1: Category Shelf Tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filter by Shelf Discipline:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER BAR 2: Specific Topic Selector & Difficulty Pills */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Specific Topic Dropdown */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Specific Topic:</span>
          <select
            value={selectedTopicId}
            onChange={e => handleTopicChange(e.target.value)}
            className="w-full max-w-sm bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-cyan-500 transition"
          >
            <option value="all">★ All Topics in this Shelf ({availableTopics.length} Topics)</option>
            {availableTopics.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          {(['all', 'beginner', 'intermediate', 'advanced', 'challenge'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                setActiveProblemIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
                setShowSolution(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* No Problems Match Filter State */}
      {!currentProblem ? (
        <div className="p-10 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <h4 className="text-base font-bold text-white">No Practice Problems Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No problems match the current filter combination ({selectedCategory} / {selectedTopicId} / {selectedDifficulty}). Try resetting difficulty to 'All' or selecting another topic.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTopicId('all');
              setSelectedDifficulty('all');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Problem Card */
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  currentProblem.difficulty === 'beginner'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : currentProblem.difficulty === 'intermediate'
                    ? 'bg-sky-950 text-sky-400 border border-sky-800'
                    : currentProblem.difficulty === 'advanced'
                    ? 'bg-purple-950 text-purple-400 border border-purple-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {currentProblem.difficulty}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                {currentProblem.lawName}
              </span>

              <span className="text-xs text-slate-400 font-mono">
                Problem {activeProblemIndex + 1} of {filteredProblems.length}
              </span>
            </div>

            {/* Quick Variable highlighter toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVariableHighlights(!showVariableHighlights)}
                className="text-xs text-slate-400 hover:text-cyan-300 transition cursor-pointer"
              >
                {showVariableHighlights ? 'Hide Given/Unknown 👁️' : 'Show Given/Unknown 🔍'}
              </button>
            </div>
          </div>

          {/* Problem Statement Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{currentProblem.title}</span>
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {currentProblem.problemStatement}
            </p>

            {/* Variable Breakdown Helper Box */}
            {showVariableHighlights && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                    Given Data:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(currentProblem.given).map(([key, val]) => (
                      <span
                        key={key}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[11px] text-slate-300"
                      >
                        <strong>{key}:</strong> {val}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                    Target Variable / Question:
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-950 border border-cyan-500/40 font-mono text-[11px] text-cyan-300 font-bold inline-block">
                    {currentProblem.unknown}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Choose the Correct Answer:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentProblem.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let btnStyle = 'bg-slate-950/90 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900';

                if (isSubmitted) {
                  if (option === currentProblem.correctAnswer) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md';
                  } else {
                    btnStyle = 'bg-slate-950 border-slate-800 text-slate-500 opacity-50';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md';
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(option)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && option === currentProblem.correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isSubmitted && isSelected && option !== currentProblem.correctAnswer && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Controls & Hint */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {!isSubmitted && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                >
                  <span>💡</span> {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>
              )}

              {isSubmitted && (
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition cursor-pointer"
                >
                  {showSolution ? 'Hide KaTeX Solution' : 'View Step-by-Step KaTeX Solution'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer disabled:opacity-40"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextProblem}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Problem</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hint Box */}
          {showHint && currentProblem.hint && !isSubmitted && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
              <strong className="text-amber-300">💡 Helpful Hint:</strong> {currentProblem.hint}
            </div>
          )}

          {/* Result & Common Mistake Trap */}
          {isSubmitted && (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-xl border text-xs ${
                  isCurrentCorrect
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500 text-rose-200'
                }`}
              >
                <div className="font-bold text-sm mb-1">
                  {isCurrentCorrect ? '🎉 Excellent Work! Correct Answer.' : '❌ Incorrect. Review the derivation below!'}
                </div>
                {currentProblem.commonMistakeTrap && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-slate-300">
                    <strong className="text-amber-400">⚠️ Common Student Mistake Trap:</strong>{' '}
                    {currentProblem.commonMistakeTrap}
                  </div>
                )}
              </div>

              {/* Step-by-Step KaTeX Solution */}
              {showSolution && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                    Step-by-Step Mathematical Derivation &amp; Solution:
                  </span>

                  <div className="space-y-3">
                    {currentProblem.solutionSteps.map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-slate-200">
                          {step.step}
                        </div>
                        {step.latex && (
                          <div className="py-1">
                            <MathView block math={step.latex} />
                          </div>
                        )}
                        <div className="text-xs text-slate-400">
                          {step.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
