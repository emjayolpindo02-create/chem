import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../components/MathView';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const CharlesSim: React.FC = () => {
  // Temperature in Celsius (-50 to 200 °C)
  const [tempCelsius, setTempCelsius] = useState<number>(25);
  const tempKelvin = Number((tempCelsius + 273.15).toFixed(2));

  // Initial reference: At 25 °C (298.15 K), Volume is 3.00 L
  const initialT = 298.15;
  const initialV = 3.00;
  // V₂ = (V₁ · T₂) / T₁
  const calculatedV = Number(((initialV * tempKelvin) / initialT).toFixed(2));

  // Prediction feature
  const [prediction, setPrediction] = useState<'expand' | 'shrink' | 'same' | null>(null);
  const [showPredictionResult, setShowPredictionResult] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: 40 + Math.random() * 220,
        y: 100 + Math.random() * 120,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
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

    // Thermal kinetic speed scaling with sqrt(T)
    const speedFactor = Math.sqrt(tempKelvin / 298.15) * 1.6;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const chamberX = 40;
      const chamberWidth = 240;
      const chamberBottom = 230;
      // Height scales with calculated volume (range ~1.5L to ~5L)
      const chamberHeight = Math.max(50, Math.min(190, (calculatedV / 5.0) * 190));
      const topWallY = chamberBottom - chamberHeight;

      // Draw Bunsen Burner or Ice Bath under container
      const burnerCenterX = chamberX + chamberWidth / 2;
      if (tempCelsius > 30) {
        // Flame drawing
        const flameHeight = Math.min(35, (tempCelsius / 200) * 35);
        ctx.fillStyle = tempCelsius > 100 ? '#f97316' : '#eab308';
        ctx.beginPath();
        ctx.moveTo(burnerCenterX - 18, chamberBottom + 25);
        ctx.quadraticCurveTo(burnerCenterX, chamberBottom + 25 - flameHeight, burnerCenterX + 18, chamberBottom + 25);
        ctx.fill();

        // Inner blue flame core
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(burnerCenterX - 8, chamberBottom + 25);
        ctx.quadraticCurveTo(burnerCenterX, chamberBottom + 25 - flameHeight * 0.6, burnerCenterX + 8, chamberBottom + 25);
        ctx.fill();
      } else if (tempCelsius < 10) {
        // Ice cubes under chamber
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        for (let i = -2; i <= 2; i++) {
          ctx.fillRect(burnerCenterX + i * 22 - 9, chamberBottom + 8, 18, 14);
          ctx.strokeRect(burnerCenterX + i * 22 - 9, chamberBottom + 8, 18, 14);
        }
      }

      // Draw Heat Stand
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(chamberX - 10, chamberBottom + 4);
      ctx.lineTo(chamberX + chamberWidth + 10, chamberBottom + 4);
      ctx.stroke();

      // Draw Flexible Container Body (Flexible expandable bellows/chamber)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(chamberX, topWallY);
      ctx.lineTo(chamberX, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, chamberBottom);
      ctx.lineTo(chamberX + chamberWidth, topWallY);
      ctx.stroke();

      // Top floating barrier (free to expand under constant 1 atm pressure)
      ctx.fillStyle = '#065f46';
      ctx.fillRect(chamberX + 2, topWallY - 10, chamberWidth - 4, 10);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(chamberX + 4, topWallY - 3, chamberWidth - 8, 3);

      // Volume indicator ticks
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      for (let v = 1; v <= 5; v++) {
        const tickY = chamberBottom - (v / 5.0) * 190;
        ctx.fillRect(chamberX - 5, tickY, 5, 2);
        ctx.fillText(`${v}L`, chamberX - 22, tickY + 3);
      }

      // Render gas particles with kinetic energy tint
      // Warmer = yellow/red tint; colder = cyan/blue tint
      const pColor = tempCelsius > 80 ? '#fb923c' : tempCelsius < 0 ? '#38bdf8' : '#34d399';
      ctx.fillStyle = pColor;

      particlesRef.current.forEach(p => {
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

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
  }, [calculatedV, tempKelvin, tempCelsius]);

  const handlePredict = (choice: 'expand' | 'shrink' | 'same') => {
    setPrediction(choice);
    setShowPredictionResult(true);
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📗</span>
            <h3 className="text-base font-bold text-emerald-400">
              Charles's Law Interactive Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Cause: Alter Temperature (T) → Observe Volume (V) with constant Pressure (1.0 atm)
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-xs font-semibold self-start sm:self-auto">
          P = Constant (1.0 atm) | n = Constant
        </div>
      </div>

      {/* Predict Before Simulate */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <span>🎯</span> PREDICT-BEFORE-SIMULATE
          </span>
          <span className="text-[11px] text-slate-400">
            Current: {tempCelsius}°C ({tempKelvin} K)
          </span>
        </div>
        <p className="text-xs text-slate-200">
          If you light the Bunsen burner and <strong>raise the temperature to 150 °C</strong>, what will happen to the gas volume?
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['expand', 'shrink', 'same'] as const).map(option => (
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
              {option === 'expand' && '📈 Gas Volume will Expand'}
              {option === 'shrink' && '📉 Gas Volume will Shrink'}
              {option === 'same' && '⏸️ Gas Volume will Stay Same'}
            </button>
          ))}
        </div>

        {showPredictionResult && (
          <div className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 mt-2">
            {prediction === 'expand' ? (
              <p className="text-emerald-400 font-semibold">
                ✓ Correct! As temperature rises, molecules fly faster and push the top barrier outward until internal pressure re-balances with 1 atm.
              </p>
            ) : (
              <p className="text-amber-400 font-semibold">
                ⚠ Reconsider: Charles's Law is a DIRECT relationship. Heating gives particles more kinetic energy, driving volume expansion!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Simulation Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Visual Container */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 relative">
          <canvas
            ref={canvasRef}
            width={320}
            height={270}
            className="w-full max-w-[320px] h-auto"
          />

          {/* Temperature & Volume Gauges */}
          <div className="w-full grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Celsius (°C)</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {tempCelsius} °C
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Kelvin (K)</span>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {tempKelvin} K
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Volume (V)</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {calculatedV.toFixed(2)} L
              </span>
            </div>
          </div>
        </div>

        {/* Live Controls & Mathematical Connection */}
        <div className="lg:col-span-6 space-y-4">
          {/* Temperature Burner Slider */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Thermal Source (Burner / Ice):</span>
              <span className="font-mono text-amber-400 font-bold">
                {tempCelsius > 0 ? `+${tempCelsius}` : tempCelsius} °C ({tempKelvin} K)
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="200"
              step="5"
              value={tempCelsius}
              onChange={(e) => setTempCelsius(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50 °C (Ice Bath, 223 K)</span>
              <span>25 °C (Room, 298 K)</span>
              <span>200 °C (Flame, 473 K)</span>
            </div>
          </div>

          {/* Dynamic Formula Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Dynamic Formula Coupling</span>
              <span className="text-slate-400 font-mono text-[10px]">V₁ / T₁ = V₂ / T₂</span>
            </div>

            <div className="text-center py-2 bg-slate-900/90 rounded-lg border border-slate-800">
              <MathView
                block
                math={`V_2 = \\frac{V_1 T_2}{T_1} = \\frac{(3.00\\text{ L})(${tempKelvin}\\text{ K})}{298.15\\text{ K}} = ${calculatedV.toFixed(2)}\\text{ L}`}
              />
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <p>
                <strong>Mandatory Kelvin Conversion:</strong> <MathView math={`K = ${tempCelsius}^\\circ\\text{C} + 273.15 = ${tempKelvin}\\text{ K}`} />
              </p>
              <p>
                <strong>What the formula predicts:</strong> Volume is directly proportional to absolute temperature (<MathView math={`V_2 \\propto T_2`} />).
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong>Kinetic molecular theory:</strong> Particles move with average translational kinetic speed <MathView math={`v_{\\text{rms}} \\propto \\sqrt{T}`} />. Higher velocity imparts greater outward momentum, requiring a larger volume to keep pressure at 1 atm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
