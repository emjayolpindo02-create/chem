import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MathView } from './MathView';
import { GAS_LAWS_DATA } from '../data/gasLawsData';
import { GasLawId } from '../types/chemistry';

type LabMode = 'flashcards' | 'builder' | 'matching';

export const FormulaMemoryLab: React.FC = () => {
  const [activeMode, setActiveMode] = useState<LabMode>('flashcards');

  // Flashcards state
  const lawsList = Object.values(GAS_LAWS_DATA);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Formula Builder state
  const [builderTargetLaw, setBuilderTargetLaw] = useState<GasLawId>('boyles-law');
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [builderFeedback, setBuilderFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Matching game state
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLawCard, setSelectedLawCard] = useState<string | null>(null);
  const [selectedFormulaCard, setSelectedFormulaCard] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState(0);

  const currentLaw = lawsList[currentCardIndex];

  // Token banks for formula builder
  const getBuilderTokens = () => {
    switch (builderTargetLaw) {
      case 'boyles-law':
        return ['P_1', 'V_1', '=', 'P_2', 'V_2', 'T_1', '/', '+', 'R'];
      case 'charles-law':
        return ['V_1', '/', 'T_1', '=', 'V_2', 'T_2', 'P_1', '*', 'n'];
      case 'gay-lussac-law':
        return ['P_1', '/', 'T_1', '=', 'P_2', 'T_2', 'V_1', '*', 'R'];
      case 'avogadro-law':
        return ['V_1', '/', 'n_1', '=', 'V_2', 'n_2', 'T_1', 'P_1'];
      case 'combined-gas-law':
        return ['P_1', 'V_1', '/', 'T_1', '=', 'P_2', 'V_2', 'T_2'];
      case 'ideal-gas-law':
        return ['P', 'V', '=', 'n', 'R', 'T', '1', '2', '/'];
      default:
        return ['P_1', 'V_1', '=', 'P_2', 'V_2'];
    }
  };

  const getCorrectBuilderSequence = () => {
    switch (builderTargetLaw) {
      case 'boyles-law':
        return ['P_1', 'V_1', '=', 'P_2', 'V_2'];
      case 'charles-law':
        return ['V_1', '/', 'T_1', '=', 'V_2', '/', 'T_2'];
      case 'gay-lussac-law':
        return ['P_1', '/', 'T_1', '=', 'P_2', '/', 'T_2'];
      case 'avogadro-law':
        return ['V_1', '/', 'n_1', '=', 'V_2', '/', 'n_2'];
      case 'combined-gas-law':
        return ['P_1', 'V_1', '/', 'T_1', '=', 'P_2', 'V_2', '/', 'T_2'];
      case 'ideal-gas-law':
        return ['P', 'V', '=', 'n', 'R', 'T'];
      default:
        return [];
    }
  };

  const handleCheckBuilder = () => {
    const correctSeq = getCorrectBuilderSequence();
    const isCorrect =
      selectedTokens.length === correctSeq.length &&
      selectedTokens.every((token, idx) => token === correctSeq[idx]);

    if (isCorrect) {
      setBuilderFeedback('correct');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
      setBuilderFeedback('wrong');
    }
  };

  const handleMatchingSelection = (type: 'law' | 'formula', id: string) => {
    if (type === 'law') {
      setSelectedLawCard(id);
      if (selectedFormulaCard) {
        checkMatch(id, selectedFormulaCard);
      }
    } else {
      setSelectedFormulaCard(id);
      if (selectedLawCard) {
        checkMatch(selectedLawCard, id);
      }
    }
  };

  const checkMatch = (lawId: string, formulaId: string) => {
    if (lawId === formulaId) {
      // Match!
      setMatchedPairs(prev => [...prev, lawId]);
      setMatchScore(s => s + 10);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    setSelectedLawCard(null);
    setSelectedFormulaCard(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Formula Memory Lab
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Never confuse gas formulas again. Active recall, formula assembly, and concept pairing.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMode('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeMode === 'flashcards'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🃏 Flashcards
          </button>
          <button
            onClick={() => setActiveMode('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeMode === 'builder'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧩 Formula Builder
          </button>
          <button
            onClick={() => setActiveMode('matching')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeMode === 'matching'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Match Game
          </button>
        </div>
      </div>

      {/* MODE 1: FLASHCARDS */}
      {activeMode === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Card {currentCardIndex + 1} of {lawsList.length}</span>
            <span>Tap card to flip</span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[280px] rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/40 p-6 flex flex-col justify-between items-center text-center cursor-pointer shadow-2xl transition-all hover:border-cyan-400 select-none"
          >
            {!isFlipped ? (
              // FRONT OF CARD
              <div className="w-full my-auto space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 block">
                  {currentLaw.shortName} • {currentLaw.scientistYears}
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {currentLaw.name}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {currentLaw.coreConcept}
                </p>
                <div className="pt-4 text-xs text-cyan-400 font-semibold flex items-center justify-center gap-1">
                  <span>🔄 Click or tap to reveal formula &amp; constants</span>
                </div>
              </div>
            ) : (
              // BACK OF CARD
              <div className="w-full my-auto space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 block">
                  Formula &amp; Core Relationships
                </span>
                <div className="py-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <MathView block math={currentLaw.primaryFormulaLatex} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-left max-w-sm mx-auto">
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Changing Variables</span>
                    <span className="text-slate-200 font-semibold">{currentLaw.changingVariables.join(', ')}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Constant Variables</span>
                    <span className="text-slate-200 font-semibold">{currentLaw.constantVariables.join(', ')}</span>
                  </div>
                </div>
                <p className="text-xs text-cyan-300 italic">
                  Key Requirement: {currentLaw.unitRequirements[0]}
                </p>
              </div>
            )}

            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 w-full">
              {isFlipped ? 'Side: Formula & Rearrangements' : 'Side: Concept & Discovery'}
            </div>
          </div>

          {/* Flashcard Navigation */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex(prev => (prev === 0 ? lawsList.length - 1 : prev - 1));
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              ← Previous Law
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex(prev => (prev + 1) % lawsList.length);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              Next Law →
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: FORMULA BUILDER */}
      {activeMode === 'builder' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-purple-300">
                Formula Token Assembly Challenge
              </h3>
              <p className="text-xs text-slate-400">
                Tap mathematical symbols in the correct order to construct the formula.
              </p>
            </div>

            {/* Law Selector */}
            <select
              value={builderTargetLaw}
              onChange={e => {
                setBuilderTargetLaw(e.target.value as GasLawId);
                setSelectedTokens([]);
                setBuilderFeedback('idle');
              }}
              className="bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-purple-200 font-semibold focus:outline-none cursor-pointer"
            >
              {lawsList.map(law => (
                <option key={law.id} value={law.id}>
                  {law.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Law Formula Slot */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assemble formula for:</span>
              <span className="font-bold text-purple-300">{GAS_LAWS_DATA[builderTargetLaw].name}</span>
            </div>

            {/* Assembled Tokens Canvas */}
            <div className="min-h-16 p-3 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-wrap items-center gap-2">
              {selectedTokens.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Tap tokens below to assemble the formula here...
                </span>
              ) : (
                selectedTokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedTokens(prev => prev.filter((_, i) => i !== idx));
                      setBuilderFeedback('idle');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500 text-purple-200 font-mono font-bold text-sm hover:bg-rose-950/80 hover:border-rose-500 hover:text-rose-200 transition cursor-pointer"
                    title="Tap to remove"
                  >
                    {tok}
                  </button>
                ))
              )}
            </div>

            {/* Available Token Bank */}
            <div>
              <span className="text-xs text-slate-400 block mb-2">Available Tokens:</span>
              <div className="flex flex-wrap gap-2">
                {getBuilderTokens().map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedTokens(prev => [...prev, tok]);
                      setBuilderFeedback('idle');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono font-bold text-sm transition cursor-pointer"
                  >
                    {tok}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedTokens([]);
                  setBuilderFeedback('idle');
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Clear All
              </button>

              <button
                onClick={handleCheckBuilder}
                disabled={selectedTokens.length === 0}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-40"
              >
                Verify Formula ✓
              </button>
            </div>

            {/* Feedback alert */}
            {builderFeedback === 'correct' && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-semibold">
                🎉 Perfect! You successfully assembled the correct formula for {GAS_LAWS_DATA[builderTargetLaw].name}!
              </div>
            )}
            {builderFeedback === 'wrong' && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-semibold">
                ❌ Not quite right. Hint: Check which variables belong on top/bottom or left/right. Try again!
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: MATCHING GAME */}
      {activeMode === 'matching' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-emerald-300">
                Speed Matching Challenge
              </h3>
              <p className="text-xs text-slate-400">
                Pair each Gas Law Name with its corresponding mathematical formula.
              </p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold">
              Score: {matchScore} pts
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Column 1: Law Names */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Law Names
              </span>
              {lawsList.map(law => {
                const isMatched = matchedPairs.includes(law.id);
                const isSelected = selectedLawCard === law.id;
                return (
                  <button
                    key={law.id}
                    disabled={isMatched}
                    onClick={() => handleMatchingSelection('law', law.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                      isMatched
                        ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-default opacity-50'
                        : isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
                        : 'bg-slate-950/90 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{law.name}</span>
                    {isMatched && <span className="text-emerald-400 text-xs">✓ Paired</span>}
                  </button>
                );
              })}
            </div>

            {/* Column 2: Formulas (Shuffled layout) */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Mathematical Formulas
              </span>
              {[
                { id: 'ideal-gas-law', formula: 'PV = nRT' },
                { id: 'boyles-law', formula: 'P_1 V_1 = P_2 V_2' },
                { id: 'combined-gas-law', formula: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}' },
                { id: 'charles-law', formula: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}' },
                { id: 'gay-lussac-law', formula: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}' },
                { id: 'avogadro-law', formula: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}' }
              ].map(item => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedFormulaCard === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleMatchingSelection('formula', item.id)}
                    className={`w-full p-2.5 rounded-xl border text-center transition cursor-pointer flex items-center justify-center ${
                      isMatched
                        ? 'bg-slate-950 border-slate-800 opacity-40 cursor-default'
                        : isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-md'
                        : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <MathView math={item.formula} />
                  </button>
                );
              })}
            </div>
          </div>

          {matchedPairs.length === lawsList.length && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-center space-y-2">
              <span className="text-2xl">🏆</span>
              <h4 className="text-base font-bold text-emerald-300">
                Master Chemist! All 6 Gas Laws Successfully Matched!
              </h4>
              <p className="text-xs text-slate-300">
                You've built solid formula recognition neural pathways.
              </p>
              <button
                onClick={() => {
                  setMatchedPairs([]);
                  setMatchScore(0);
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
