import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../components/MathView';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const AvogadroSim: React.FC = () => {
  // Gas Moles n (0.5 to 3.0 mol)
  const [moles, setMoles] = useState<number>(1.0);
  const initialN = 1.0;
  const initialV = 22.4; // 22.4 L at STP
  // V₂ = (V₁ · n₂) / n₁
  const calculatedV = Number(((initialV * moles) / initialN).toFixed(1));

  // Prediction feature
  const [prediction, setPrediction] = useState<'expand' | 'deflate' | 'same' | null>(null);
  const [showPredictionResult, setShowPredictionResult] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Update particles array when moles change (e.g. 1.0 mol = 30 particles on screen)
  useEffect(() => {
    const targetParticleCount = Math.round(moles * 30);
    const current = particlesRef.current;
    if (current.length < targetParticleCount) {
      const needed = targetParticleCount - current.length;
      for (let i = 0; i < needed; i++) {
        current.push({
          x: 40 + Math.random() * 200,
          y: 70 + Math.random() * 120,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 3.5,
        });
      }
    } else if (current.length > targetParticleCount) {
      current.splice(targetParticleCount);
    }
  }, [moles]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const chamberX = 40;
      const chamberWidth = 240;
      const chamberBottom = 240;
      // Height scales with calculated volume (range 11.2L to 67.2L)
      const chamberHeight = Math.max(50, Math.min(200, (calculatedV / 70.0) * 200));
      const topWallY = chamberBottom - chamberHeight;

      // Draw Gas Injection Nozzle & Syringe on left
      ctx.fillStyle = '#64748b';
      ctx.fillRect(chamberX - 25, chamberBottom - 40, 25, 12);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(chamberX - 25, chamberBottom - 40, 25, 12);

      // Draw Flexible Expansion Chamber (Purple theme)
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(chamberX, topWallY);
      ctx.lineTo(chamberX, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, topWallY);
      ctx.stroke();

      // Flexible expandable top membrane
      ctx.fillStyle = '#581c87';
      ctx.fillRect(chamberX + 2, topWallY - 10, chamberWidth - 4, 10);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(chamberX + 4, topWallY - 3, chamberWidth - 8, 3);

      // Volume indicator marks
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      for (let v = 20; v <= 60; v += 20) {
        const tickY = chamberBottom - (v / 70.0) * 200;
        ctx.fillRect(chamberX - 5, tickY, 5, 2);
        ctx.fillText(`${v}L`, chamberX - 26, tickY + 3);
      }

      // Render gas molecules
      ctx.fillStyle = '#c084fc';
      particlesRef.current.forEach(p => {
        p.x += p.vx * 1.5;
        p.y += p.vy * 1.5;

        // Boundaries
        if (p.x < chamberX + p.radius) {
          p.x = chamberX + p.radius;
          p.vx = -p.vx;
        } else if (p.x > chamberX + chamberWidth - p.radius) {
          p.x = chamberX + chamberWidth - p.radius;
          p.vx = -p.vx;
        }

        if (p.y > chamberBottom - p.radius) {
          p.y = chamberBottom - p.radius;
          p.vy = -p.vy;
        } else if (p.y < topWallY + p.radius) {
          p.y = topWallY + p.radius;
          p.vy = -p.vy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [calculatedV]);

  const handlePredict = (choice: 'expand' | 'deflate' | 'same') => {
    setPrediction(choice);
    setShowPredictionResult(true);
  };

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📕</span>
            <h3 className="text-base font-bold text-purple-400">
              Avogadro's Law Interactive Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Cause: Inject Moles of Gas (n) → Observe Container Volume (V) at constant P &amp; T
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300 font-mono text-xs font-semibold self-start sm:self-auto">
          P = Constant (1.0 atm) | T = Constant (273 K)
        </div>
      </div>

      {/* Predict Before Simulate */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <span>🎯</span> PREDICT-BEFORE-SIMULATE
          </span>
          <span className="text-[11px] text-slate-400">
            Current Moles: {moles.toFixed(1)} mol
          </span>
        </div>
        <p className="text-xs text-slate-200">
          If you inject <strong>double the amount of gas molecules (2.0 moles)</strong> into this flexible chamber at constant atmospheric pressure, what will happen to the volume?
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['expand', 'deflate', 'same'] as const).map(option => (
            <button
              key={option}
              onClick={() => handlePredict(option)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                prediction === option
                  ? option === 'expand'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {option === 'expand' && '📈 Volume will Expand Proportionally'}
              {option === 'deflate' && '📉 Volume will Deflate'}
              {option === 'same' && '⏸️ Volume will Stay Same'}
            </button>
          ))}
        </div>

        {showPredictionResult && (
          <div className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 mt-2">
            {prediction === 'expand' ? (
              <p className="text-emerald-400 font-semibold">
                ✓ Correct! Avogadro showed that more molecules push the flexible boundary outward so that the collision density remains constant with external pressure!
              </p>
            ) : (
              <p className="text-amber-400 font-semibold">
                ⚠ Reconsider: Adding more particles in a flexible container forces volume expansion directly (V ∝ n)!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Simulation Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Visual Chamber */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 relative">
          <canvas
            ref={canvasRef}
            width={320}
            height={270}
            className="w-full max-w-[320px] h-auto"
          />

          {/* Gauges Bar */}
          <div className="w-full grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Gas Moles (n)</span>
              <span className="text-sm font-bold font-mono text-purple-400">
                {moles.toFixed(2)} mol
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Particles</span>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {(moles * 6.022).toFixed(2)} × 10²³
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Volume (V)</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {calculatedV.toFixed(1)} L
              </span>
            </div>
          </div>
        </div>

        {/* Live Controls & Dynamic Formula */}
        <div className="lg:col-span-6 space-y-4">
          {/* Moles Injector Slider */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Inject Gas Moles (n₂):</span>
              <span className="font-mono text-purple-400 font-bold">
                {moles.toFixed(2)} moles
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={moles}
              onChange={(e) => setMoles(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 mol (11.2 L)</span>
              <span>1.0 mol (STP 22.4 L)</span>
              <span>3.0 mol (67.2 L)</span>
            </div>
          </div>

          {/* Dynamic Formula Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2.5">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
              <span>Dynamic Formula Coupling</span>
              <span className="text-slate-400 font-mono text-[10px]">V₁ / n₁ = V₂ / n₂</span>
            </div>

            <div className="text-center py-2 bg-slate-900/90 rounded-lg border border-slate-800">
              <MathView
                block
                math={`V_2 = \\frac{V_1 n_2}{n_1} = \\frac{(22.414\\text{ L})(${moles.toFixed(2)}\\text{ mol})}{1.00\\text{ mol}} = ${calculatedV.toFixed(1)}\\text{ L}`}
              />
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <p>
                <strong>Standard Molar Volume:</strong> At STP, exactly 1 mole of any ideal gas occupies <strong>22.414 L</strong>.
              </p>
              <p>
                <strong>What the formula predicts:</strong> Volume scales in direct 1:1 proportion with the quantity of molecules (<MathView math={`V_2 \\propto n_2`} />).
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong>Avogadro's hypothesis:</strong> Molecule mass does not affect gas volume! 1 mole of dense SF₆ (146 g/mol) occupies the exact same volume as 1 mole of light H₂ (2 g/mol) at the same P and T.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
