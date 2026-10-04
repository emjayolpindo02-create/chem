import React, { useState } from 'react';
import { GasLawInfo, GasLawId } from '../types/chemistry';
import { MathView } from './MathView';
import { BoyleSim } from '../simulations/BoyleSim';
import { CharlesSim } from '../simulations/CharlesSim';
import { GayLussacSim } from '../simulations/GayLussacSim';
import { AvogadroSim } from '../simulations/AvogadroSim';
import { CombinedSim } from '../simulations/CombinedSim';
import { IdealGasSim } from '../simulations/IdealGasSim';
import { markLessonCompleted, toggleBookmark, getStoredProgress } from '../utils/storage';

interface GasLawModuleViewProps {
  law: GasLawInfo;
  onSelectOtherLaw: (lawId: GasLawId) => void;
  onOpenConfusionBuster: () => void;
}

export const GasLawModuleView: React.FC<GasLawModuleViewProps> = ({
  law,
  onOpenConfusionBuster
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'simulation' | 'rearrangements' | 'example'>('study');
  const [completed, setCompleted] = useState(() => getStoredProgress().completedLessons.includes(law.id));
  const [bookmarked, setBookmarked] = useState(() => getStoredProgress().bookmarks.includes(law.id));

  const handleMarkComplete = () => {
    markLessonCompleted(law.id);
    setCompleted(true);
  };

  const handleToggleBookmark = () => {
    const isNowBookmarked = toggleBookmark(law.id);
    setBookmarked(isNowBookmarked);
  };

  // Render appropriate interactive simulation component
  const renderSimulation = () => {
    switch (law.id) {
      case 'boyles-law':
        return <BoyleSim />;
      case 'charles-law':
        return <CharlesSim />;
      case 'gay-lussac-law':
        return <GayLussacSim />;
      case 'avogadro-law':
        return <AvogadroSim />;
      case 'combined-gas-law':
        return <CombinedSim />;
      case 'ideal-gas-law':
        return <IdealGasSim />;
      default:
        return <BoyleSim />;
    }
  };

  // Derive variable shift explanations based on relationship
  const getWhatHappensScenarios = () => {
    switch (law.relationshipType) {
      case 'inverse':
        return [
          {
            condition: 'When Pressure (P) Increases (plunger pushed in)',
            result: 'Volume (V) Decreases proportionally',
            reason: 'Particles are squeezed into less space; collision frequency doubles when volume is cut in half.'
          },
          {
            condition: 'When Volume (V) Increases (chamber expands)',
            result: 'Pressure (P) Decreases proportionally',
            reason: 'Particles must travel greater distances between wall collisions, reducing measured surface force.'
          }
        ];
      case 'direct':
        return [
          {
            condition: 'When Temperature (T) Increases',
            result: 'Other active variable (V or P) Increases proportionally',
            reason: 'Higher thermal energy makes molecules fly faster with greater momentum, demanding higher volume or exerting higher pressure.'
          },
          {
            condition: 'When Temperature (T) Decreases (cooling/ice)',
            result: 'Other active variable (V or P) Decreases proportionally',
            reason: 'Molecules lose kinetic velocity, striking walls with less vigor.'
          }
        ];
      default:
        return [
          {
            condition: 'When Pressure increases at constant Temperature',
            result: 'Volume decreases inversely',
            reason: 'Molecular collisions scale inversely with available spatial volume.'
          },
          {
            condition: 'When Temperature increases at constant Pressure',
            result: 'Volume expands directly',
            reason: 'Kinetic velocity requires larger boundary displacement to equalize ambient pressure.'
          }
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[11px] font-semibold">
                {law.shortName} • {law.scientistYears}
              </span>
              <span className="text-xs text-slate-400">
                Discovered by {law.scientist} ({law.scientistOrigin})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {law.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-sans">
              {law.coreConcept}
            </p>
          </div>

          {/* Module Action Tools */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                bookmarked
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Bookmark this lesson"
            >
              <span>{bookmarked ? '★ Bookmarked' : '☆ Bookmark'}</span>
            </button>

            <button
              onClick={handleMarkComplete}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                completed
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
              }`}
            >
              <span>{completed ? '✓ Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-thin">
          {[
            { id: 'study', label: '📖 Comprehensive Lesson' },
            { id: 'simulation', label: '🧪 Interactive Simulation' },
            { id: 'rearrangements', label: '🧮 Formula Rearrangements' },
            { id: 'example', label: '✍️ Worked Example' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={onOpenConfusionBuster}
            className="ml-auto px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1"
          >
            <span>🧭</span> Help Me Choose Law
          </button>
        </div>
      </div>

      {/* TAB 1: STUDY & CONCEPTUAL COMPREHENSION */}
      {activeTab === 'study' && (
        <div className="space-y-6">
          {/* Primary Formula Showcase */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
              Primary Mathematical Expression
            </span>
            <div className="py-3 bg-slate-950/80 rounded-xl border border-slate-800 inline-block px-8 max-w-full overflow-x-auto">
              <MathView block math={law.primaryFormulaLatex} />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-1">
              <span>
                <strong>Changing:</strong> {law.changingVariables.join(', ')}
              </span>
              <span>•</span>
              <span>
                <strong>Held Constant:</strong> {law.constantVariables.join(', ')}
              </span>
              <span>•</span>
              <span>
                <strong>Relationship:</strong> <strong className="text-cyan-300 capitalize">{law.relationshipType}</strong>
              </span>
            </div>
          </div>

          {/* Historical Story & Scientific Foundation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <span>🏛️</span> Historical Discovery
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {law.historicalContext}
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                <strong className="text-cyan-400">Researcher:</strong> {law.scientist} ({law.scientistYears})
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <span>🔬</span> Kinetic Molecular Explanation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {law.coreConcept}
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                <strong className="text-emerald-400">Why it works:</strong> Gas particles are in constant, random motion. Wall collisions generate measurable pressure.
              </div>
            </div>
          </div>

          {/* Unit Requirements */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📋</span> Mandatory Unit Conditions &amp; Requirements
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              {law.unitRequirements.map((req, i) => (
                <li key={i} className="leading-relaxed">{req}</li>
              ))}
            </ul>
          </div>

          {/* What Happens When Conditions Change */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📈</span> What Happens When Gas Variables Shift?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getWhatHappensScenarios().map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-cyan-300">
                    {c.condition}
                  </div>
                  <div className="text-xs font-semibold text-emerald-400">
                    {c.result}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {c.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Applications */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🌍</span> Real-World Phenomena &amp; Everyday Applications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {law.realWorldApplications.map((app, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{app.icon}</span>
                    <h4 className="text-xs font-bold text-cyan-300">{app.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300">{app.summary}</p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">{app.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Traps Callout */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <span>⚠️</span> Common Student Misconceptions &amp; Traps
            </h3>
            <div className="space-y-3">
              {law.commonMistakes.map((m, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-rose-300">❌ Mistake: {m.mistake}</div>
                  <div className="text-slate-400"><strong>Why students fail:</strong> {m.reason}</div>
                  <div className="text-emerald-400"><strong>Correct approach:</strong> {m.correction}</div>
                  {m.correctionLatex && (
                    <div className="pt-1">
                      <MathView math={m.correctionLatex} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="space-y-4">
          {renderSimulation()}
        </div>
      )}

      {/* TAB 3: FORMULA REARRANGEMENTS */}
      {activeTab === 'rearrangements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              Formula Rearrangements for Every Variable
            </h3>
            <p className="text-xs text-slate-400">
              Never get stuck in algebra. Here are the step-by-step isolated formulas for every variable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {law.rearrangements.map((rearr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold mb-1">
                    <span>Target: {rearr.targetVariable}</span>
                    <span className="text-[10px] text-slate-500">Algebra</span>
                  </div>
                  <div className="py-2 bg-slate-900 rounded-lg border border-slate-800 text-center my-2">
                    <MathView block math={rearr.latex} />
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
                  <p><strong className="text-slate-300">Explanation:</strong> {rearr.explanation}</p>
                  <div className="text-[11px] text-slate-300">
                    <strong>Steps:</strong>
                    <ol className="list-decimal list-inside space-y-0.5 mt-0.5 text-slate-400">
                      {rearr.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WORKED EXAMPLE */}
      {activeTab === 'example' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              Full Worked Calculation Walkthrough
            </h3>
            <p className="text-xs text-slate-400">
              Complete calculation demonstration with given variables, formula rearrangement, substitution, and units cancellation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-cyan-300">
              Problem Statement
            </h4>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {law.workedExample.problemStatement}
            </p>

            {/* Given & Unknown box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">Given:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(law.workedExample.given).map(([k, v]) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                      {k} = {String(v)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">Unknown:</span>
                <span className="text-cyan-300 font-mono font-bold">{law.workedExample.unknown}</span>
              </div>
            </div>

            {/* Step by step formulas */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">1. Primary Law Formula</span>
                <MathView block math={law.workedExample.formulaLatex} />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">2. Rearranged Formula for Unknown</span>
                <MathView block math={law.workedExample.rearrangementLatex} />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">3. Values Substitution</span>
                <MathView block math={law.workedExample.substitutionLatex} />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">4. Final Calculated Solution</span>
                <MathView block math={law.workedExample.solutionLatex} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/20 text-xs text-slate-300">
              <strong className="text-cyan-400">Sanity &amp; Physical Check:</strong> {law.workedExample.explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
