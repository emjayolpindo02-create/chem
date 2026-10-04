import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../components/MathView';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const GayLussacSim: React.FC = () => {
  // Temperature in Celsius (0 to 300 °C)
  const [tempCelsius, setTempCelsius] = useState<number>(20);
  const tempKelvin = Number((tempCelsius + 273.15).toFixed(2));

  // Reference state: At 20 °C (293.15 K), Pressure is 1.00 atm in a rigid 5.0 L tank
  const initialT = 293.15;
  const initialP = 1.00;
  // P₂ = (P₁ · T₂) / T₁
  const calculatedP = Number(((initialP * tempKelvin) / initialT).toFixed(2));

  // Prediction feature
  const [prediction, setPrediction] = useState<'climb' | 'drop' | 'same' | null>(null);
  const [showPredictionResult, setShowPredictionResult] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: 50 + Math.random() * 200,
        y: 60 + Math.random() * 150,
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

    // Particles speed up with temperature
    const speedFactor = Math.sqrt(tempKelvin / 293.15) * 1.8;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const chamberX = 40;
      const chamberY = 40;
      const chamberWidth = 240;
      const chamberHeight = 180;
      const chamberBottom = chamberY + chamberHeight;

      // Draw Heat Flame under autoclave
      const burnerCenterX = chamberX + chamberWidth / 2;
      const flameHeight = Math.min(35, (tempCelsius / 300) * 35);
      if (tempCelsius > 25) {
        ctx.fillStyle = tempCelsius > 150 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(burnerCenterX - 20, chamberBottom + 25);
        ctx.quadraticCurveTo(burnerCenterX, chamberBottom + 25 - flameHeight, burnerCenterX + 20, chamberBottom + 25);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(burnerCenterX - 8, chamberBottom + 25);
        ctx.quadraticCurveTo(burnerCenterX, chamberBottom + 25 - flameHeight * 0.5, burnerCenterX + 8, chamberBottom + 25);
        ctx.fill();
      }

      // Draw Armored Rigid Steel Autoclave Chamber (Walls NEVER move)
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.fillRect(chamberX, chamberY, chamberWidth, chamberHeight);

      // Heavy steel wall borders with rivets
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(chamberX, chamberY, chamberWidth, chamberHeight);

      // Autoclave bolts/rivets
      ctx.fillStyle = '#d97706';
      for (let x = chamberX + 15; x < chamberX + chamberWidth; x += 30) {
        ctx.beginPath();
        ctx.arc(x, chamberY, 3, 0, Math.PI * 2);
        ctx.arc(x, chamberBottom, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let y = chamberY + 15; y < chamberBottom; y += 30) {
        ctx.beginPath();
        ctx.arc(chamberX, y, 3, 0, Math.PI * 2);
        ctx.arc(chamberX + chamberWidth, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top Mounted Analog Pressure Gauge
      const gaugeCenterX = chamberX + 60;
      const gaugeCenterY = chamberY - 22;
      const gaugeR = 20;

      // Gauge mounting pipe
      ctx.fillStyle = '#64748b';
      ctx.fillRect(gaugeCenterX - 3, chamberY - 10, 6, 10);

      // Gauge circle
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(gaugeCenterX, gaugeCenterY, gaugeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = calculatedP > 1.8 ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Gauge red danger zone (above 1.8 atm)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(gaugeCenterX, gaugeCenterY, gaugeR - 3, Math.PI * 1.5, Math.PI * 2.2);
      ctx.stroke();

      // Needle angle based on calculatedP (1.0 to 2.5 atm)
      const needleAngle = Math.PI * 0.8 + ((calculatedP - 1.0) / 1.5) * (Math.PI * 1.2);
      ctx.strokeStyle = calculatedP > 1.8 ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gaugeCenterX, gaugeCenterY);
      ctx.lineTo(
        gaugeCenterX + Math.cos(needleAngle) * (gaugeR - 5),
        gaugeCenterY + Math.sin(needleAngle) * (gaugeR - 5)
      );
      ctx.stroke();

      // Pressure warning light if over 1.8 atm
      if (calculatedP > 1.8) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(chamberX + chamberWidth - 25, chamberY - 14, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '9px sans-serif';
        ctx.fillText('HIGH PRESSURE', chamberX + chamberWidth - 95, chamberY - 11);
      }

      // Render gas particles with spark collisions against rigid boundary
      const pColor = calculatedP > 1.8 ? '#f87171' : '#fbbf24';
      ctx.fillStyle = pColor;

      particlesRef.current.forEach(p => {
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        // Rigid container boundaries
        if (p.x < chamberX + p.radius + 3) {
          p.x = chamberX + p.radius + 3;
          p.vx = -p.vx;
        } else if (p.x > chamberX + chamberWidth - p.radius - 3) {
          p.x = chamberX + chamberWidth - p.radius - 3;
          p.vx = -p.vx;
        }

        if (p.y < chamberY + p.radius + 3) {
          p.y = chamberY + p.radius + 3;
          p.vy = -p.vy;
        } else if (p.y > chamberBottom - p.radius - 3) {
          p.y = chamberBottom - p.radius - 3;
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
  }, [calculatedP, tempKelvin, tempCelsius]);

  const handlePredict = (choice: 'climb' | 'drop' | 'same') => {
    setPrediction(choice);
    setShowPredictionResult(true);
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📙</span>
            <h3 className="text-base font-bold text-amber-400">
              Gay-Lussac's Law Interactive Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Cause: Heat Rigid Vessel (T) → Observe Pressure (P) with fixed Volume (5.0 L)
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300 font-mono text-xs font-semibold self-start sm:self-auto">
          V = Locked (5.0 L) | n = Constant
        </div>
      </div>

      {/* Predict Before Simulate */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <span>🎯</span> PREDICT-BEFORE-SIMULATE
          </span>
          <span className="text-[11px] text-slate-400">
            Current: {tempCelsius}°C ({tempKelvin} K)
          </span>
        </div>
        <p className="text-xs text-slate-200">
          Because the steel walls <strong>cannot move</strong>, what will happen to the pressure gauge when you crank the heat to 200 °C?
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['climb', 'drop', 'same'] as const).map(option => (
            <button
              key={option}
              onClick={() => handlePredict(option)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                prediction === option
                  ? option === 'climb'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {option === 'climb' && '📈 Pressure will Climb'}
              {option === 'drop' && '📉 Pressure will Drop'}
              {option === 'same' && '⏸️ Pressure will Stay Same'}
            </button>
          ))}
        </div>

        {showPredictionResult && (
          <div className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 mt-2">
            {prediction === 'climb' ? (
              <p className="text-emerald-400 font-semibold">
                ✓ Correct! Trapped particles move faster and hammer the fixed walls with greater momentum and frequency, driving pressure upward!
              </p>
            ) : (
              <p className="text-amber-400 font-semibold">
                ⚠ Reconsider: With volume locked rigid, particles cannot expand the container. The extra kinetic energy directly produces higher wall pressure!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Simulation Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Visual Rigid Vessel */}
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
              <span className="text-[10px] text-slate-400 block uppercase">Temperature</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {tempCelsius} °C
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Kelvin (T)</span>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {tempKelvin} K
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Pressure (P)</span>
              <span className={`text-sm font-bold font-mono ${calculatedP > 1.8 ? 'text-rose-400' : 'text-amber-400'}`}>
                {calculatedP.toFixed(2)} atm
              </span>
            </div>
          </div>
        </div>

        {/* Live Controls & Dynamic Formula */}
        <div className="lg:col-span-6 space-y-4">
          {/* Temperature Slider */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Heating Fire Temperature (T₂):</span>
              <span className="font-mono text-amber-400 font-bold">
                {tempCelsius} °C ({tempKelvin} K)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="5"
              value={tempCelsius}
              onChange={(e) => setTempCelsius(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 °C (273 K)</span>
              <span>20 °C (Room)</span>
              <span>300 °C (Bonfire Heat, 573 K)</span>
            </div>
          </div>

          {/* Dynamic Formula Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2.5">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Dynamic Formula Coupling</span>
              <span className="text-slate-400 font-mono text-[10px]">P₁ / T₁ = P₂ / T₂</span>
            </div>

            <div className="text-center py-2 bg-slate-900/90 rounded-lg border border-slate-800">
              <MathView
                block
                math={`P_2 = \\frac{P_1 T_2}{T_1} = \\frac{(1.00\\text{ atm})(${tempKelvin}\\text{ K})}{293.15\\text{ K}} = ${calculatedP.toFixed(2)}\\text{ atm}`}
              />
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <p>
                <strong>What you changed:</strong> Temperature rose to {tempCelsius} °C ({tempKelvin} K).
              </p>
              <p>
                <strong>What the formula predicts:</strong> Pressure increases in direct proportion (<MathView math={`P_2 \\propto T_2`} />).
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong>Real-world hazard:</strong> At {calculatedP.toFixed(2)} atm, the internal pressure exceeds normal atmospheric levels by{' '}
                <strong className="text-amber-300">{((calculatedP - 1.0) * 100).toFixed(0)}%</strong>, explaining why sealed cans rupture in campfires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
