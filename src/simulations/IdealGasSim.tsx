import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../components/MathView';

type SolveTarget = 'P' | 'V' | 'n' | 'T';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const IdealGasSim: React.FC = () => {
  const [solveTarget, setSolveTarget] = useState<SolveTarget>('P');
  const R = 0.08206; // L·atm/(mol·K)

  // Sliders values
  const [volume, setVolume] = useState<number>(10.0); // Liters (2 to 25)
  const [moles, setMoles] = useState<number>(1.00); // mol (0.2 to 3.0)
  const [tempKelvin, setTempKelvin] = useState<number>(298); // K (150 to 500)
  const [pressureManual, setPressureManual] = useState<number>(2.44); // atm

  // Calculated values based on solveTarget
  let p = pressureManual;
  let v = volume;
  let n = moles;
  let t = tempKelvin;

  if (solveTarget === 'P') {
    p = Number(((n * R * t) / v).toFixed(2));
  } else if (solveTarget === 'V') {
    v = Number(((n * R * t) / p).toFixed(2));
  } else if (solveTarget === 'n') {
    n = Number(((p * v) / (R * t)).toFixed(2));
  } else if (solveTarget === 'T') {
    t = Number(((p * v) / (n * R)).toFixed(0));
  }

  // Particle simulation canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const targetCount = Math.min(60, Math.max(15, Math.round(n * 25)));
    const current = particlesRef.current;
    if (current.length < targetCount) {
      for (let i = current.length; i < targetCount; i++) {
        current.push({
          x: 40 + Math.random() * 220,
          y: 70 + Math.random() * 120,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 3.5,
        });
      }
    } else if (current.length > targetCount) {
      current.splice(targetCount);
    }
  }, [n]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Speed proportional to sqrt(T)
    const speedFactor = Math.sqrt(Math.max(50, t) / 298) * 1.5;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const chamberX = 40;
      const chamberWidth = 240;
      const chamberBottom = 240;
      const chamberHeight = Math.max(40, Math.min(200, (v / 25.0) * 200));
      const topWallY = chamberBottom - chamberHeight;

      // Draw Chamber
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(chamberX, topWallY);
      ctx.lineTo(chamberX, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, topWallY);
      ctx.stroke();

      // Piston top
      ctx.fillStyle = '#831843';
      ctx.fillRect(chamberX + 2, topWallY - 10, chamberWidth - 4, 10);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(chamberX + 4, topWallY - 3, chamberWidth - 8, 3);

      // Render Particles
      const pColor = t > 350 ? '#fb7185' : t < 220 ? '#38bdf8' : '#f472b6';
      ctx.fillStyle = pColor;

      particlesRef.current.forEach(pt => {
        pt.x += pt.vx * speedFactor;
        pt.y += pt.vy * speedFactor;

        if (pt.x < chamberX + pt.radius) {
          pt.x = chamberX + pt.radius;
          pt.vx = -pt.vx;
        } else if (pt.x > chamberX + chamberWidth - pt.radius) {
          pt.x = chamberX + chamberWidth - pt.radius;
          pt.vx = -pt.vx;
        }

        if (pt.y > chamberBottom - pt.radius) {
          pt.y = chamberBottom - pt.radius;
          pt.vy = -pt.vy;
        } else if (pt.y < topWallY + pt.radius) {
          pt.y = topWallY + pt.radius;
          pt.vy = -pt.vy;
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [v, t, p]);

  return (
    <div className="bg-slate-900 border border-pink-500/30 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📔</span>
            <h3 className="text-base font-bold text-pink-400">
              Ideal Gas Law Universal State Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Relates Pressure, Volume, Moles, and Temperature through the Gas Constant R = 0.08206 L·atm/(mol·K).
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-pink-950/80 border border-pink-800 text-pink-300 font-mono text-xs font-semibold self-start sm:self-auto">
          PV = nRT
        </div>
      </div>

      {/* Target Variable Chooser */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-pink-500/40 space-y-2">
        <span className="text-xs font-bold text-pink-300 block uppercase tracking-wider">
          Select Variable to Solve For (Auto-Calculates):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'P', label: 'Solve for Pressure (P)', latex: 'P = \\frac{nRT}{V}' },
            { id: 'V', label: 'Solve for Volume (V)', latex: 'V = \\frac{nRT}{P}' },
            { id: 'n', label: 'Solve for Moles (n)', latex: 'n = \\frac{PV}{RT}' },
            { id: 'T', label: 'Solve for Temp (T)', latex: 'T = \\frac{PV}{nR}' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSolveTarget(item.id as SolveTarget)}
              className={`p-2.5 rounded-lg border text-xs text-left transition cursor-pointer ${
                solveTarget === item.id
                  ? 'bg-pink-950/80 border-pink-500 text-pink-200 font-bold shadow-md'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div>{item.label}</div>
              <div className="text-[10px] text-pink-400 font-mono mt-0.5">{item.id} = ...</div>
            </button>
          ))}
        </div>
      </div>

      {/* Viewport and Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Visual Viewport */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 relative">
          <canvas
            ref={canvasRef}
            width={320}
            height={270}
            className="w-full max-w-[320px] h-auto"
          />

          {/* 4 State Gauges */}
          <div className="w-full grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-slate-800 text-center">
            <div className={`p-1.5 rounded ${solveTarget === 'P' ? 'bg-pink-950/80 border border-pink-500' : 'bg-slate-900 border border-slate-800'}`}>
              <span className="text-[9px] text-slate-400 block">P (atm)</span>
              <span className="text-xs font-mono font-bold text-pink-300">{p.toFixed(2)}</span>
            </div>
            <div className={`p-1.5 rounded ${solveTarget === 'V' ? 'bg-pink-950/80 border border-pink-500' : 'bg-slate-900 border border-slate-800'}`}>
              <span className="text-[9px] text-slate-400 block">V (L)</span>
              <span className="text-xs font-mono font-bold text-emerald-300">{v.toFixed(1)}</span>
            </div>
            <div className={`p-1.5 rounded ${solveTarget === 'n' ? 'bg-pink-950/80 border border-pink-500' : 'bg-slate-900 border border-slate-800'}`}>
              <span className="text-[9px] text-slate-400 block">n (mol)</span>
              <span className="text-xs font-mono font-bold text-purple-300">{n.toFixed(2)}</span>
            </div>
            <div className={`p-1.5 rounded ${solveTarget === 'T' ? 'bg-pink-950/80 border border-pink-500' : 'bg-slate-900 border border-slate-800'}`}>
              <span className="text-[9px] text-slate-400 block">T (K)</span>
              <span className="text-xs font-mono font-bold text-amber-300">{t}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="lg:col-span-6 space-y-3 text-xs">
          {/* Slider 1: Pressure (editable if not solving for P) */}
          <div className={`p-2.5 rounded-lg border ${solveTarget === 'P' ? 'bg-pink-950/30 border-pink-500/40 opacity-90' : 'bg-slate-950 border-slate-800'}`}>
            <div className="flex justify-between font-mono mb-1">
              <span>Pressure (P): {solveTarget === 'P' && <strong className="text-pink-400 font-sans">(Calculated)</strong>}</span>
              <span className="font-bold text-pink-300">{p.toFixed(2)} atm</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              disabled={solveTarget === 'P'}
              value={solveTarget === 'P' ? p : pressureManual}
              onChange={e => setPressureManual(parseFloat(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Slider 2: Volume */}
          <div className={`p-2.5 rounded-lg border ${solveTarget === 'V' ? 'bg-pink-950/30 border-pink-500/40 opacity-90' : 'bg-slate-950 border-slate-800'}`}>
            <div className="flex justify-between font-mono mb-1">
              <span>Volume (V): {solveTarget === 'V' && <strong className="text-pink-400 font-sans">(Calculated)</strong>}</span>
              <span className="font-bold text-emerald-300">{v.toFixed(1)} L</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="25.0"
              step="0.5"
              disabled={solveTarget === 'V'}
              value={v}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Slider 3: Moles */}
          <div className={`p-2.5 rounded-lg border ${solveTarget === 'n' ? 'bg-pink-950/30 border-pink-500/40 opacity-90' : 'bg-slate-950 border-slate-800'}`}>
            <div className="flex justify-between font-mono mb-1">
              <span>Moles (n): {solveTarget === 'n' && <strong className="text-pink-400 font-sans">(Calculated)</strong>}</span>
              <span className="font-bold text-purple-300">{n.toFixed(2)} mol</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              disabled={solveTarget === 'n'}
              value={n}
              onChange={e => setMoles(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Slider 4: Temperature */}
          <div className={`p-2.5 rounded-lg border ${solveTarget === 'T' ? 'bg-pink-950/30 border-pink-500/40 opacity-90' : 'bg-slate-950 border-slate-800'}`}>
            <div className="flex justify-between font-mono mb-1">
              <span>Absolute Temp (T): {solveTarget === 'T' && <strong className="text-pink-400 font-sans">(Calculated)</strong>}</span>
              <span className="font-bold text-amber-300">{t} K ({(t - 273.15).toFixed(0)} °C)</span>
            </div>
            <input
              type="range"
              min="150"
              max="500"
              step="5"
              disabled={solveTarget === 'T'}
              value={t}
              onChange={e => setTempKelvin(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Verification Box */}
          <div className="p-3 rounded-lg bg-slate-950 border border-pink-500/30 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Active Calculation
            </span>
            {solveTarget === 'P' && (
              <MathView
                block
                math={`P = \\frac{(${n.toFixed(2)}\\text{ mol})(0.08206)(${t}\\text{ K})}{${v.toFixed(1)}\\text{ L}} = ${p.toFixed(2)}\\text{ atm}`}
              />
            )}
            {solveTarget === 'V' && (
              <MathView
                block
                math={`V = \\frac{(${n.toFixed(2)}\\text{ mol})(0.08206)(${t}\\text{ K})}{${p.toFixed(2)}\\text{ atm}} = ${v.toFixed(1)}\\text{ L}`}
              />
            )}
            {solveTarget === 'n' && (
              <MathView
                block
                math={`n = \\frac{(${p.toFixed(2)}\\text{ atm})(${v.toFixed(1)}\\text{ L})}{(0.08206)(${t}\\text{ K})} = ${n.toFixed(2)}\\text{ mol}`}
              />
            )}
            {solveTarget === 'T' && (
              <MathView
                block
                math={`T = \\frac{(${p.toFixed(2)}\\text{ atm})(${v.toFixed(1)}\\text{ L})}{(${n.toFixed(2)}\\text{ mol})(0.08206)} = ${t}\\text{ K}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
