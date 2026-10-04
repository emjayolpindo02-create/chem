import React, { useState } from 'react';
import { MathView } from '../components/MathView';

export const CombinedSim: React.FC = () => {
  // State 1 parameters
  const [p1, setP1] = useState<number>(1.00); // atm
  const [v1, setV1] = useState<number>(4.00); // L
  const [t1, setT1] = useState<number>(295); // K

  // State 2 parameters (target pressure and temp)
  const [p2, setP2] = useState<number>(0.50); // atm
  const [t2, setT2] = useState<number>(240); // K

  // Calculated V₂: V₂ = (P₁ · V₁ · T₂) / (P₂ · T₁)
  const calculatedV2 = Number(((p1 * v1 * t2) / (p2 * t1)).toFixed(2));

  // Prediction feature
  const [prediction, setPrediction] = useState<'expand' | 'shrink' | 'same' | null>(null);
  const [showPredictionResult, setShowPredictionResult] = useState<boolean>(false);

  // Height representations for visual chambers (0 to 10L scale)
  const height1 = Math.max(30, Math.min(150, (v1 / 10.0) * 150));
  const height2 = Math.max(30, Math.min(150, (calculatedV2 / 10.0) * 150));

  const handlePredict = (choice: 'expand' | 'shrink' | 'same') => {
    setPrediction(choice);
    setShowPredictionResult(true);
  };

  const isExpanding = calculatedV2 > v1;

  return (
    <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📓</span>
            <h3 className="text-base font-bold text-cyan-400">
              Combined Gas Law Dual-State Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Compare State 1 (Initial) vs State 2 (Final) when Pressure, Volume, and Temperature shift together!
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-xs font-semibold self-start sm:self-auto">
          n = Constant (Fixed Sealed Mass)
        </div>
      </div>

      {/* Predict Before Simulate */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <span>🎯</span> PREDICT-BEFORE-SIMULATE
          </span>
          <span className="text-[11px] text-slate-400">
            P dropped ({p1} → {p2} atm), T cooled ({t1} → {t2} K)
          </span>
        </div>
        <p className="text-xs text-slate-200">
          The pressure was cut in half (which favors expansion), but the gas was also cooled (which favors contraction). 
          Which effect dominates? Will <strong>Final Volume (V₂)</strong> expand or shrink compared to {v1.toFixed(1)} L?
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['expand', 'shrink', 'same'] as const).map(option => (
            <button
              key={option}
              onClick={() => handlePredict(option)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                prediction === option
                  ? (option === 'expand' && isExpanding) || (option === 'shrink' && !isExpanding)
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {option === 'expand' && '📈 Net Expansion (V₂ > V₁)'}
              {option === 'shrink' && '📉 Net Contraction (V₂ < V₁)'}
              {option === 'same' && '⏸️ Exactly Same (V₂ = V₁)'}
            </button>
          ))}
        </div>

        {showPredictionResult && (
          <div className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 mt-2">
            {(prediction === 'expand' && isExpanding) || (prediction === 'shrink' && !isExpanding) ? (
              <p className="text-emerald-400 font-semibold">
                ✓ Correct deduction! The calculated V₂ is {calculatedV2.toFixed(2)} L. Notice how the pressure factor and temperature factor compete mathematically!
              </p>
            ) : (
              <p className="text-amber-400 font-semibold">
                ⚠ Reconsider: Evaluate the ratio: (P₁ / P₂) × (T₂ / T₁) = {(p1 / p2).toFixed(2)} × {(t2 / t1).toFixed(2)} = {((p1 / p2) * (t2 / t1)).toFixed(2)}.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Dual State Visual Comparator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* STATE 1: INITIAL */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              State 1 (Initial Condition)
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono">
              Ground / Start
            </span>
          </div>

          {/* Visual Chamber 1 */}
          <div className="h-44 flex items-end justify-center py-2 relative">
            <div className="w-32 bg-slate-900/80 border-2 border-blue-400 rounded-b-xl relative flex flex-col justify-end overflow-hidden" style={{ height: `${height1}px` }}>
              <div className="absolute top-0 left-0 right-0 h-3 bg-blue-500/70 border-b border-blue-400" />
              <div className="p-2 text-center text-xs font-mono font-bold text-blue-200">
                {v1.toFixed(2)} L
              </div>
            </div>
          </div>

          {/* State 1 Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
            <div>
              <div className="flex justify-between font-mono text-slate-300 mb-1">
                <span>Pressure P₁:</span>
                <span className="text-blue-400 font-bold">{p1.toFixed(2)} atm</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={p1}
                onChange={e => setP1(parseFloat(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-slate-300 mb-1">
                <span>Volume V₁:</span>
                <span className="text-emerald-400 font-bold">{v1.toFixed(2)} L</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.2"
                value={v1}
                onChange={e => setV1(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-slate-300 mb-1">
                <span>Temperature T₁:</span>
                <span className="text-amber-400 font-bold">{t1} K ({(t1 - 273.15).toFixed(0)} °C)</span>
              </div>
              <input
                type="range"
                min="200"
                max="400"
                step="5"
                value={t1}
                onChange={e => setT1(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* STATE 2: FINAL */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              State 2 (Final Condition)
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono">
              Altitude / Altered
            </span>
          </div>

          {/* Visual Chamber 2 */}
          <div className="h-44 flex items-end justify-center py-2 relative">
            <div className="w-32 bg-slate-900/80 border-2 border-cyan-400 rounded-b-xl relative flex flex-col justify-end overflow-hidden" style={{ height: `${height2}px` }}>
              <div className="absolute top-0 left-0 right-0 h-3 bg-cyan-500/70 border-b border-cyan-400" />
              <div className="p-2 text-center text-xs font-mono font-bold text-cyan-200">
                {calculatedV2.toFixed(2)} L
              </div>
            </div>
          </div>

          {/* State 2 Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
            <div>
              <div className="flex justify-between font-mono text-slate-300 mb-1">
                <span>Pressure P₂:</span>
                <span className="text-cyan-400 font-bold">{p2.toFixed(2)} atm</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={p2}
                onChange={e => setP2(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-slate-300 mb-1">
                <span>Calculated V₂:</span>
                <span className="text-emerald-400 font-bold">{calculatedV2.toFixed(2)} L (Auto)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all"
                  style={{ width: `${Math.min(100, (calculatedV2 / 10.0) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-slate-300 mb-1">
                <span>Temperature T₂:</span>
                <span className="text-amber-400 font-bold">{t2} K ({(t2 - 273.15).toFixed(0)} °C)</span>
              </div>
              <input
                type="range"
                min="150"
                max="400"
                step="5"
                value={t2}
                onChange={e => setT2(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Mathematical Calculation Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
          <span>Combined Master Ratio Calculation</span>
          <span className="text-slate-400 font-mono text-[10px]">(P₁V₁) / T₁ = (P₂V₂) / T₂</span>
        </div>

        <div className="text-center py-2 bg-slate-900 rounded-lg border border-slate-800">
          <MathView
            block
            math={`V_2 = \\frac{P_1 V_1 T_2}{P_2 T_1} = \\frac{(${p1.toFixed(2)}\\text{ atm})(${v1.toFixed(2)}\\text{ L})(${t2}\\text{ K})}{(${p2.toFixed(2)}\\text{ atm})(${t1}\\text{ K})} = ${calculatedV2.toFixed(2)}\\text{ L}`}
          />
        </div>

        <p className="text-xs text-slate-400 pt-1 text-center">
          Net change: Initial {v1.toFixed(2)} L → Final {calculatedV2.toFixed(2)} L ({((calculatedV2 / v1) * 100).toFixed(0)}% of original volume).
        </p>
      </div>
    </div>
  );
};
