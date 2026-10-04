import React, { useState, useEffect } from 'react';
import { MiniChemistMood } from '../types/chemistry';

interface MiniChemistProps {
  mood: MiniChemistMood;
  onAskHelp?: () => void;
  floating?: boolean;
  className?: string;
  onDismissTip?: () => void;
}

export const MiniChemist: React.FC<MiniChemistProps> = ({
  mood,
  onAskHelp,
  floating = false,
  className = '',
  onDismissTip
}) => {
  const [minimized, setMinimized] = useState(false);
  const [bubbleAnim, setBubbleAnim] = useState(true);

  useEffect(() => {
    setBubbleAnim(true);
    const timer = setTimeout(() => setBubbleAnim(false), 500);
    return () => clearTimeout(timer);
  }, [mood.message]);

  const getChemistPose = () => {
    switch (mood.state) {
      case 'celebrating':
        return {
          armLeft: 'rotate-[-35deg] translate-y-[-6px]',
          armRight: 'rotate-[35deg] translate-y-[-6px]',
          flaskGlow: 'fill-emerald-400 animate-pulse',
          goggleGlow: '#10b981',
          mouth: 'M 44 64 Q 50 72 56 64' // Big smile
        };
      case 'thinking':
        return {
          armLeft: 'rotate-[-10deg]',
          armRight: 'rotate-[-45deg] translate-y-[-8px]', // hand to chin
          flaskGlow: 'fill-amber-400',
          goggleGlow: '#f59e0b',
          mouth: 'M 45 66 Q 50 63 55 66' // Contemplating
        };
      case 'explaining':
        return {
          armLeft: 'rotate-[-10deg]',
          armRight: 'rotate-[40deg] translate-y-[-4px]', // pointing
          flaskGlow: 'fill-cyan-400',
          goggleGlow: '#38bdf8',
          mouth: 'M 45 65 Q 50 69 55 65'
        };
      case 'mistake_help':
        return {
          armLeft: 'rotate-[15deg]',
          armRight: 'rotate-[-15deg]',
          flaskGlow: 'fill-amber-300',
          goggleGlow: '#fbbf24',
          mouth: 'M 46 67 Q 50 64 54 67' // Empathetic
        };
      case 'prediction':
        return {
          armLeft: 'rotate-[-25deg]',
          armRight: 'rotate-[25deg]',
          flaskGlow: 'fill-purple-400 animate-ping',
          goggleGlow: '#a855f7',
          mouth: 'M 45 65 Q 50 70 55 65'
        };
      case 'simulation':
        return {
          armLeft: 'rotate-[-10deg]',
          armRight: 'rotate-[10deg]',
          flaskGlow: 'fill-sky-400',
          goggleGlow: '#38bdf8',
          mouth: 'M 45 65 Q 50 68 55 65'
        };
      default: // idle
        return {
          armLeft: 'rotate-[0deg]',
          armRight: 'rotate-[0deg]',
          flaskGlow: 'fill-cyan-400',
          goggleGlow: '#06b6d4',
          mouth: 'M 45 65 Q 50 69 55 65'
        };
    }
  };

  const pose = getChemistPose();

  return (
    <div
      className={`relative inline-flex items-end gap-3 transition-all duration-300 ${
        floating
          ? 'fixed bottom-4 right-4 z-40 max-w-sm pointer-events-auto'
          : 'max-w-xl'
      } ${className}`}
    >
      {/* Dialogue / Speech Bubble */}
      {!minimized && (
        <div
          className={`relative bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-3.5 shadow-xl backdrop-blur-md text-xs sm:text-sm text-slate-100 flex-1 transform transition-transform ${
            bubbleAnim ? 'scale-102' : 'scale-100'
          }`}
        >
          {/* Speech bubble pointer triangle */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900 border-r border-b border-cyan-500/40 transform rotate-45" />

          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[11px] font-semibold text-cyan-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              MINI CHEMIST
            </span>
            <div className="flex items-center gap-2">
              {onAskHelp && (
                <button
                  onClick={onAskHelp}
                  className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/60 font-medium transition cursor-pointer text-[10px]"
                >
                  Help Me Choose
                </button>
              )}
              <button
                onClick={() => setMinimized(true)}
                title="Minimize guide"
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <p className="leading-relaxed text-slate-200 font-sans">{mood.message}</p>
        </div>
      )}

      {/* Mini Chemist Character SVG */}
      <div
        onClick={() => setMinimized(!minimized)}
        className="relative group cursor-pointer flex-shrink-0 select-none"
        title="Dr. Kelvin — Click to show/hide guidance"
      >
        <div className="w-16 h-20 sm:w-20 sm:h-24 relative flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(6,182,212,0.35)]">
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            {/* Soft shadow */}
            <ellipse cx="50" cy="114" rx="28" ry="5" fill="#020617" opacity="0.6" />

            {/* Hair (Wild scientist hair) */}
            <path
              d="M 28 36 C 24 22 35 14 50 14 C 65 14 76 22 72 36 C 78 30 76 20 68 12 C 55 6 42 6 32 12 C 24 18 22 30 28 36 Z"
              fill="#94a3b8"
            />
            {/* Tufts */}
            <path d="M 24 28 Q 18 24 22 18 Q 28 20 28 26 Z" fill="#94a3b8" />
            <path d="M 76 28 Q 82 24 78 18 Q 72 20 72 26 Z" fill="#94a3b8" />

            {/* Head */}
            <ellipse cx="50" cy="46" rx="22" ry="20" fill="#fde047" />

            {/* Safety Goggles Straps */}
            <rect x="26" y="42" width="48" height="5" rx="2" fill="#0f172a" />

            {/* Safety Goggles Lenses */}
            <circle cx="41" cy="45" r="9" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="59" cy="45" r="9" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
            <rect x="49" y="43" width="2" height="4" fill="#38bdf8" />

            {/* Eyes through goggles */}
            <circle cx="41" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="42" cy="45" r="2" fill="#0f172a" />
            <circle cx="59" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="60" cy="45" r="2" fill="#0f172a" />

            {/* Goggle Reflection Highlight */}
            <line x1="36" y1="40" x2="43" y2="47" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="54" y1="40" x2="61" y2="47" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

            {/* Cheeks */}
            <circle cx="34" cy="54" r="3.5" fill="#f43f5e" opacity="0.35" />
            <circle cx="66" cy="54" r="3.5" fill="#f43f5e" opacity="0.35" />

            {/* Nose & Smile */}
            <path d="M 49 53 Q 50 56 52 53" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d={pose.mouth} stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Lab Coat Collar & Shirt */}
            <path d="M 44 66 L 50 78 L 56 66 Z" fill="#0284c7" /> {/* Teal tie */}
            <path d="M 36 68 L 50 96 L 64 68 Z" fill="#ffffff" />

            {/* Lab Coat Body */}
            <path
              d="M 30 70 L 28 108 L 72 108 L 70 70 Q 50 76 30 70 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {/* Coat Pocket with chemistry pen */}
            <rect x="34" y="86" width="10" height="12" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <line x1="37" y1="82" x2="37" y2="88" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="40" y1="84" x2="40" y2="88" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />

            {/* Left Arm & Hand */}
            <g className={`transition-transform duration-300 origin-[30px_72px] ${pose.armLeft}`}>
              <path d="M 30 72 L 20 90" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
              <circle cx="18" cy="92" r="4.5" fill="#fde047" />
            </g>

            {/* Right Arm & Bubbling Erlenmeyer Flask */}
            <g className={`transition-transform duration-300 origin-[70px_72px] ${pose.armRight}`}>
              <path d="M 70 72 L 78 88" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
              <circle cx="80" cy="90" r="4.5" fill="#fde047" />

              {/* Erlenmeyer Flask held in right hand */}
              <g transform="translate(80, 84)">
                <path
                  d="M -3 0 L 3 0 L 3 5 L 8 16 A 2 2 0 0 1 6 19 L -6 19 A 2 2 0 0 1 -8 16 L -3 5 Z"
                  fill="#1e293b"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                {/* Glowing liquid */}
                <path d="M -5 13 L 5 13 L 6 17 L -6 17 Z" className={pose.flaskGlow} />
                {/* Bubble */}
                <circle cx="0" cy="8" r="1.5" fill="#ffffff" opacity="0.8" />
                <circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.6" />
              </g>
            </g>

            {/* Shoes */}
            <ellipse cx="40" cy="110" rx="7" ry="4" fill="#1e293b" />
            <ellipse cx="60" cy="110" rx="7" ry="4" fill="#1e293b" />
          </svg>

          {/* Minimize badge */}
          {minimized && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[9px] text-slate-950 font-bold items-center justify-center">
                !
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
