import React, { useState } from 'react';
import { getStoredProgress, saveNote } from '../utils/storage';
import { GAS_LAWS_DATA } from '../data/gasLawsData';
import { GasLawId } from '../types/chemistry';

interface ProgressTrackerProps {
  onSelectLaw: (lawId: GasLawId) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onSelectLaw }) => {
  const [progress, setProgress] = useState(getStoredProgress());
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>(progress.notes);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const totalLessons = Object.keys(GAS_LAWS_DATA).length;
  const completedCount = progress.completedLessons.length;
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);

  const handleSaveNote = (topicId: string) => {
    saveNote(topicId, noteInputs[topicId] || '');
    setProgress(getStoredProgress());
    setSavedStatus(topicId);
    setTimeout(() => setSavedStatus(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Student Mastery Dashboard &amp; Notes
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            100% offline local progress tracking, quiz performance, and personal chemistry study notes.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>🖨️</span> Print / Export Notes
        </button>
      </div>

      {/* Progress Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Gas Law Modules Completed */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-cyan-400 block tracking-wider">
            Curriculum Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">
              {completionPercentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({completedCount}/{totalLessons} Gas Laws)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Practice Accuracy */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
            Practice Center Accuracy
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {progress.quizScores.totalAttempted > 0
                ? Math.round((progress.quizScores.totalCorrect / progress.quizScores.totalAttempted) * 100)
                : 100}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({progress.quizScores.totalCorrect}/{progress.quizScores.totalAttempted} Solved)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Across beginner, intermediate, and challenge tiers.
          </p>
        </div>

        {/* Card 3: Frequently Confused Focus */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
            Focus &amp; Trap Watchlist
          </span>
          <div className="text-xs text-slate-300">
            {progress.frequentlyConfusedLaws.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {progress.frequentlyConfusedLaws.map(lawId => (
                  <span
                    key={lawId}
                    className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 text-[10px] font-semibold"
                  >
                    {GAS_LAWS_DATA[lawId]?.shortName || lawId}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-emerald-400 font-semibold">No identified weak spots! Great job!</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">
            Auto-detected based on quiz hesitation and retries.
          </p>
        </div>
      </div>

      {/* Common Difficulties Reminder Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <span>⚠️</span> High-Frequency Student Chemistry Traps
        </span>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
          <li><strong>Forgetting Kelvin conversion:</strong> Always add 273.15 to Celsius before doing any multiplication or division!</li>
          <li><strong>Rigid Container = Constant Volume:</strong> When a problem says "sealed steel tank", V cannot change; use Gay-Lussac's Law.</li>
          <li><strong>Matching Units for Gas Constant R:</strong> If pressure is in atm and volume in Liters, use R = 0.08206. If in Joules or kPa·dm³, use 8.314.</li>
        </ul>
      </div>

      {/* Personal Notes Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>📝</span> Personal Chemistry Notebook
        </h3>
        <p className="text-xs text-slate-400">
          Write reminders, mnemonics, or class notes for each gas law. Notes are stored safely in browser storage and remain available offline.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(GAS_LAWS_DATA).map(law => (
            <div
              key={law.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-cyan-300">
                    {law.name}
                  </h4>
                  <button
                    onClick={() => onSelectLaw(law.id)}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Open Module →
                  </button>
                </div>
                <textarea
                  value={noteInputs[law.id] || ''}
                  onChange={e =>
                    setNoteInputs(prev => ({ ...prev, [law.id]: e.target.value }))
                  }
                  placeholder={`Write your personal notes for ${law.shortName}...`}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-emerald-400">
                  {savedStatus === law.id && '✓ Note Saved to Local Device'}
                </span>
                <button
                  onClick={() => handleSaveNote(law.id)}
                  className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 text-xs font-semibold transition cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
