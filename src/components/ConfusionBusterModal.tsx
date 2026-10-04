import React, { useState } from 'react';
import { GasLawId } from '../types/chemistry';
import { MathView } from './MathView';
import { GAS_LAWS_DATA } from '../data/gasLawsData';

interface ConfusionBusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLaw: (lawId: GasLawId) => void;
}

export const ConfusionBusterModal: React.FC<ConfusionBusterModalProps> = ({
  isOpen,
  onClose,
  onSelectLaw,
}) => {
  // Step 1: Which variables are changing or mentioned?
  const [selectedVars, setSelectedVars] = useState<{
    pressure: boolean;
    volume: boolean;
    temperature: boolean;
    moles: boolean;
  }>({
    pressure: false,
    volume: false,
    temperature: false,
    moles: false,
  });

  // Step 2: What stays constant?
  const [constantVar, setConstantVar] = useState<string>('unknown');

  if (!isOpen) return null;

  const toggleVar = (key: keyof typeof selectedVars) => {
    setSelectedVars(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine deduced law
  const deduceLaw = (): {
    lawId: GasLawId | null;
    reason: string;
    formula: string;
    confidence: 'high' | 'partial' | 'none';
  } => {
    const { pressure, volume, temperature, moles } = selectedVars;

    // Boyle: P and V changing, T & n constant
    if (pressure && volume && !temperature && !moles) {
      return {
        lawId: 'boyles-law',
        reason: 'Pressure and Volume are changing while Temperature is kept constant.',
        formula: 'P_1 V_1 = P_2 V_2',
        confidence: 'high'
      };
    }

    // Charles: V and T changing, P & n constant
    if (volume && temperature && !pressure && !moles) {
      return {
        lawId: 'charles-law',
        reason: 'Volume and Temperature are changing while Pressure is held constant.',
        formula: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
        confidence: 'high'
      };
    }

    // Gay-Lussac: P and T changing, V & n constant
    if (pressure && temperature && !volume && !moles) {
      return {
        lawId: 'gay-lussac-law',
        reason: 'Pressure and Temperature are changing in a rigid container (Volume constant).',
        formula: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
        confidence: 'high'
      };
    }

    // Avogadro: V and n changing, P & T constant
    if (volume && moles && !pressure && !temperature) {
      return {
        lawId: 'avogadro-law',
        reason: 'Volume and Moles (gas particles) are changing at constant P and T.',
        formula: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}',
        confidence: 'high'
      };
    }

    // Combined: P, V, T all changing, only n constant
    if (pressure && volume && temperature && !moles) {
      return {
        lawId: 'combined-gas-law',
        reason: 'Pressure, Volume, and Temperature are all changing simultaneously for a fixed mass of gas.',
        formula: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
        confidence: 'high'
      };
    }

    // Ideal: all 4 or looking for specific state
    if ((pressure && volume && moles && temperature) || (moles && (pressure || volume))) {
      return {
        lawId: 'ideal-gas-law',
        reason: 'Four state variables are involved, or you are finding moles/grams of gas at a single state using the Universal Gas Constant R.',
        formula: 'PV = nRT',
        confidence: 'high'
      };
    }

    // Fallbacks based on constant variable selection
    if (constantVar === 'temperature' && (pressure || volume)) {
      return {
        lawId: 'boyles-law',
        reason: 'Temperature is constant, so Pressure and Volume are the active variables.',
        formula: 'P_1 V_1 = P_2 V_2',
        confidence: 'partial'
      };
    }
    if (constantVar === 'pressure' && (volume || temperature)) {
      return {
        lawId: 'charles-law',
        reason: 'Pressure is constant, so Volume and Temperature are changing.',
        formula: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
        confidence: 'partial'
      };
    }
    if (constantVar === 'volume' && (pressure || temperature)) {
      return {
        lawId: 'gay-lussac-law',
        reason: 'Volume is constant (rigid container), so Pressure and Temperature are changing.',
        formula: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
        confidence: 'partial'
      };
    }

    return {
      lawId: null,
      reason: 'Select the variables mentioned in your problem to narrow down the law.',
      formula: '',
      confidence: 'none'
    };
  };

  const deduction = deduceLaw();
  const matchedLaw = deduction.lawId ? GAS_LAWS_DATA[deduction.lawId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧭</span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                FORMULA CONFUSION BUSTER
              </h2>
              <p className="text-xs text-cyan-300">
                Dr. Kelvin's Step-by-Step Gas Law Diagnostic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Question 1: What variables are changing or mentioned in your problem? */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-900/80 border border-cyan-500 text-cyan-200 text-xs flex items-center justify-center font-bold">1</span>
              Which variables are mentioned or changing in your problem?
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Tap all variables that have given numbers or an unknown question mark (?).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => toggleVar('pressure')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedVars.pressure
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Pressure (P)</span>
                  <span className="text-xs font-mono">{selectedVars.pressure ? '✓' : '+'}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">atm, kPa, mmHg, psi</span>
              </button>

              <button
                type="button"
                onClick={() => toggleVar('volume')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedVars.volume
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Volume (V)</span>
                  <span className="text-xs font-mono">{selectedVars.volume ? '✓' : '+'}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">L, mL, cm³, m³</span>
              </button>

              <button
                type="button"
                onClick={() => toggleVar('temperature')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedVars.temperature
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Temperature (T)</span>
                  <span className="text-xs font-mono">{selectedVars.temperature ? '✓' : '+'}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Kelvin (K), °C</span>
              </button>

              <button
                type="button"
                onClick={() => toggleVar('moles')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedVars.moles
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Moles / Mass (n)</span>
                  <span className="text-xs font-mono">{selectedVars.moles ? '✓' : '+'}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">mol, grams, particles</span>
              </button>
            </div>
          </div>

          {/* Question 2: What variable stays constant? */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-900/80 border border-cyan-500 text-cyan-200 text-xs flex items-center justify-center font-bold">2</span>
              What variable stays CONSTANT or is locked?
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'temperature', label: 'Constant Temp', desc: 'Isothermal' },
                { id: 'pressure', label: 'Constant Press', desc: 'Isobaric' },
                { id: 'volume', label: 'Constant Vol', desc: 'Rigid tank / Isochoric' },
                { id: 'moles', label: 'Constant Gas Moles', desc: 'Sealed container' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setConstantVar(constantVar === opt.id ? 'unknown' : opt.id)}
                  className={`p-2.5 rounded-lg border text-xs text-left transition cursor-pointer ${
                    constantVar === opt.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Deduction Result Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700 relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Dr. Kelvin's Diagnosis</span>
              {deduction.confidence === 'high' && (
                <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Exact Match!
                </span>
              )}
            </div>

            {matchedLaw ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-bold text-cyan-300">
                      {matchedLaw.name}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {deduction.reason}
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
                    <MathView math={matchedLaw.primaryFormulaLatex} />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Scientist: <strong className="text-slate-200">{matchedLaw.scientist}</strong>
                  </div>
                  <button
                    onClick={() => {
                      onSelectLaw(matchedLaw.id);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    Open {matchedLaw.shortName} Study Module →
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                {deduction.reason}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Remember: All gas law calculations require Temperature in Kelvin!</span>
          <button
            onClick={() => {
              setSelectedVars({ pressure: false, volume: false, temperature: false, moles: false });
              setConstantVar('unknown');
            }}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Reset selections
          </button>
        </div>
      </div>
    </div>
  );
};
