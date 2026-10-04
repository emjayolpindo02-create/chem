import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../components/MathView';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const BoyleSim: React.FC = () => {
  // State 1 & State 2 variables
  const [pressure, setPressure] = useState<number>(1.0); // atm (0.5 to 4.0)
  const initialP = 1.0;
  const initialV = 4.0; // Liters
  const calculatedV = Number((initialP * initialV / pressure).toFixed(2));

  // Prediction feature
  const [prediction, setPrediction] = useState<'increase' | 'decrease' | 'same' | null>(null);
  const [showPredictionResult, setShowPredictionResult] = useState<boolean>(false);
  const [targetPressureForPrediction, setTargetPressureForPrediction] = useState<number>(2.0);

  // Canvas particle simulation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // Initialize 40 particles
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: 20 + Math.random() * 260,
        y: 80 + Math.random() * 140,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 3.5,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Piston top boundary moves down as volume decreases
    // V ranges from 1.0 L (high pressure) to 8.0 L (low pressure)
    // Chamber height = 240px. Chamber width = 280px.
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const chamberX = 30;
      const chamberWidth = 260;
      const chamberBottom = 270;
      // Volume = 1.0 L -> height = 50px; Volume = 8.0 L -> height = 220px
      const chamberHeight = Math.max(50, Math.min(220, (calculatedV / 8.0) * 220));
      const pistonY = chamberBottom - chamberHeight;

      // Draw Chamber Cylinder Walls
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(chamberX, 40);
      ctx.lineTo(chamberX, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, 40);
      ctx.stroke();

      // Measurement tick marks on cylinder wall
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      for (let v = 1; v <= 8; v++) {
        const tickY = chamberBottom - (v / 8.0) * 220;
        ctx.fillRect(chamberX - 6, tickY, 6, 2);
        ctx.fillText(`${v}L`, chamberX - 24, tickY + 3);
      }

      // Draw Movable Piston Head
      ctx.fillStyle = '#334155';
      ctx.fillRect(chamberX + 2, pistonY - 14, chamberWidth - 4, 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(chamberX + 4, pistonY - 4, chamberWidth - 8, 4);

      // Piston Rod
      ctx.fillStyle = '#475569';
      ctx.fillRect(chamberX + chamberWidth / 2 - 8, 15, 16, pistonY - 25);
      // Piston Handle
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(chamberX + chamberWidth / 2 - 30, 8, 60, 10);

      // Gas particles collision & update
      // Particle speed increases collision frequency at smaller volume
      const speedMult = 1.2;
      ctx.fillStyle = '#38bdf8';
      particlesRef.current.forEach(p => {
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Boundaries: chamber bottom, sides, and dynamic piston head
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
        } else if (p.y < pistonY + p.radius) {
          p.y = pistonY + p.radius;
          p.vy = -p.vy;
        }

        // Render particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [calculatedV]);

  const handlePredict = (choice: 'increase' | 'decrease' | 'same') => {
    setPrediction(choice);
    setShowPredictionResult(true);
  };

  return (
    <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📘</span>
            <h3 className="text-base font-bold text-sky-400">
              Boyle's Law Interactive Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Cause: Alter Pressure (P) → Observe Volume (V) with constant Temperature (T)
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-sky-950/80 border border-sky-800 text-sky-300 font-mono text-xs font-semibold self-start sm:self-auto">
          T = Constant (298 K) | n = Constant
        </div>
      </div>

      {/* Predict Before Simulation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
            <span>🎯</span> PREDICT-BEFORE-SIMULATE
          </span>
          <span className="text-[11px] text-slate-400">
            Current: {pressure.toFixed(1)} atm → Target: {targetPressureForPrediction} atm
          </span>
        </div>
        <p className="text-xs text-slate-200">
          If you push down on the piston and <strong>increase the pressure to {targetPressureForPrediction} atm</strong>, what will happen to the gas volume?
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['increase', 'decrease', 'same'] as const).map(option => (
            <button
              key={option}
              onClick={() => handlePredict(option)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                prediction === option
                  ? option === 'decrease'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {option === 'increase' && '📈 Volume will Increase'}
              {option === 'decrease' && '📉 Volume will Decrease'}
              {option === 'same' && '⏸️ Volume will Stay the Same'}
            </button>
          ))}
        </div>

        {showPredictionResult && (
          <div className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 mt-2">
            {prediction === 'decrease' ? (
              <p className="text-emerald-400 font-semibold">
                ✓ Correct! As pressure increases, the molecules are compressed into a smaller volume.
              </p>
            ) : (
              <p className="text-amber-400 font-semibold">
                ⚠ Reconsider: Boyle's Law states an INVERSE relationship. Higher pressure forces particles closer together, decreasing volume!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Simulation Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Gas Chamber */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 relative">
          <canvas
            ref={canvasRef}
            width={320}
            height={290}
            className="w-full max-w-[320px] h-auto"
          />

          {/* Overlay Status Gauges */}
          <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Pressure (P)</span>
              <span className="text-base font-bold font-mono text-sky-400">
                {pressure.toFixed(2)} atm
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Volume (V)</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                {calculatedV.toFixed(2)} L
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Math & Cause Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Pressure Slider Control */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Adjust Applied Pressure (P₂):</span>
              <span className="font-mono text-sky-400 font-bold">{pressure.toFixed(2)} atm</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={pressure}
              onChange={(e) => setPressure(parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 atm (Expansion)</span>
              <span>1.0 atm (1x)</span>
              <span>4.0 atm (4x Compression)</span>
            </div>
          </div>

          {/* Live Mathematical Coupling Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2.5">
            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
              <span>Dynamic Formula Coupling</span>
              <span className="text-slate-400 font-mono text-[10px]">P₁V₁ = P₂V₂</span>
            </div>

            <div className="text-center py-2 bg-slate-900/90 rounded-lg border border-slate-800">
              <MathView
                block
                math={`V_2 = \\frac{P_1 V_1}{P_2} = \\frac{(1.00\\text{ atm})(4.00\\text{ L})}{${pressure.toFixed(2)}\\text{ atm}} = ${calculatedV.toFixed(2)}\\text{ L}`}
              />
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <p>
                <strong>What you changed:</strong> Pressure {pressure > 1.0 ? 'increased' : 'decreased'} to {pressure.toFixed(2)} atm.
              </p>
              <p>
                <strong>What the formula predicts:</strong> Volume scales inversely: <MathView math={`V_2 \\propto \\frac{1}{P_2}`} />.
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong>Physical molecular explanation:</strong> With {calculatedV.toFixed(2)} L of space, gas particles strike the piston head at a rate of{' '}
                <strong className="text-sky-300 font-mono">{(pressure * 100).toFixed(0)} collisions/sec</strong>, perfectly balancing the external pressure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
