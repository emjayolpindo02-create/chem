import React, { useState } from 'react';
import { REAL_LIFE_SCENARIOS, RealLifeScenario } from '../data/realLifeScenarios';
import { MathView } from './MathView';
import { GasLawId } from '../types/chemistry';

interface RealLifeLabProps {
  onSelectLaw: (lawId: GasLawId) => void;
}

export const RealLifeLab: React.FC<RealLifeLabProps> = ({ onSelectLaw }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scenario: RealLifeScenario = REAL_LIFE_SCENARIOS[selectedScenarioIndex];

  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    setSelectedAnswerIndex(null);
    setIsSubmitted(false);
  };

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswerIndex(idx);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Real-Life Gas Laws Laboratory
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Explore where gas laws dictate real physics, safety engineering, and human physiology.
        </p>
      </div>

      {/* Scenario Thumbnails Carousel / Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {REAL_LIFE_SCENARIOS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => handleSelectScenario(idx)}
            className={`px-3 py-2 rounded-xl border text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 flex-shrink-0 ${
              selectedScenarioIndex === idx
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.title.split(' ')[0]} {item.title.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Active Scenario Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Story & Variables */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                {scenario.category}
              </span>
              <span className="text-2xl">{scenario.icon}</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {scenario.title}
            </h3>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {scenario.situation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
                  🔒 Constant Variables
                </span>
                <ul className="text-slate-300 list-disc list-inside space-y-0.5">
                  {scenario.constantVariables.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
                  ⚡ Changing Variables
                </span>
                <ul className="text-slate-300 list-disc list-inside space-y-0.5">
                  {scenario.changingVariables.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Governing Law: <strong className="text-cyan-300">{scenario.governingLawName}</strong>
              </span>
              <button
                onClick={() => onSelectLaw(scenario.governingLawId)}
                className="text-cyan-400 hover:underline cursor-pointer font-semibold"
              >
                Open Law Module →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical connection & Interactive Quiz */}
        <div className="lg:col-span-5 space-y-4">
          {/* Formula Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-center space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              Governing Equation
            </span>
            <MathView block math={scenario.formulaLatex} />
            <p className="text-xs text-slate-300 text-left pt-2 border-t border-slate-800">
              {scenario.explanation}
            </p>
          </div>

          {/* Interactive Scenario Question */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>❓</span> Conceptual Investigation
            </span>
            <p className="text-xs text-slate-200 font-medium">
              {scenario.interactiveQuestion}
            </p>

            <div className="space-y-2">
              {scenario.options.map((opt, i) => {
                const isSelected = selectedAnswerIndex === i;
                const isCorrect = i === scenario.correctOptionIndex;
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';

                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-bold block">Scientific Explanation:</span>
                <p>{scenario.postAnswerInsight}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
