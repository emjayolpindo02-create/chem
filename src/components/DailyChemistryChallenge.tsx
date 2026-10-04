import React, { useState, useEffect, useMemo } from 'react';
import { PRACTICE_PROBLEMS } from '../data/practiceProblems';
import { PracticeProblem } from '../types/chemistry';
import { MathView } from './MathView';
import {
  getDailyStreakData,
  recordDailyChallengeCompleted,
  getTodayDateString,
  DailyStreakData,
  recordProblemResult
} from '../utils/storage';
import {
  Flame,
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Calendar,
  ChevronRight,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';

interface DailyChemistryChallengeProps {
  onOpenTopicPractice?: (topicId: string) => void;
  variant?: 'card' | 'full';
}

export const DailyChemistryChallenge: React.FC<DailyChemistryChallengeProps> = ({
  onOpenTopicPractice,
  variant = 'card'
}) => {
  const [streakData, setStreakData] = useState<DailyStreakData>(getDailyStreakData());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [customQuestionIndex, setCustomQuestionIndex] = useState<number | null>(null);
  const [justCelebrated, setJustCelebrated] = useState<boolean>(false);

  const todayStr = getTodayDateString();
  const isCompletedToday = streakData.lastCompletedDate === todayStr;

  // Generate deterministic daily challenge from today's date
  const dailyQuestionIndex = useMemo(() => {
    // Hash string 'YYYY-MM-DD'
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    return absHash % PRACTICE_PROBLEMS.length;
  }, [todayStr]);

  const activeIndex = customQuestionIndex !== null ? customQuestionIndex : dailyQuestionIndex;
  const currentProblem: PracticeProblem = PRACTICE_PROBLEMS[activeIndex] || PRACTICE_PROBLEMS[0];

  const isCorrect = isSubmitted && selectedOption === currentProblem.correctAnswer;

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);

    const correct = selectedOption === currentProblem.correctAnswer;
    recordProblemResult(currentProblem.id, currentProblem.topicId, correct);

    if (correct) {
      const { streakData: updatedStreak, isNewCompletionToday } = recordDailyChallengeCompleted();
      setStreakData(updatedStreak);
      if (isNewCompletionToday) {
        setJustCelebrated(true);
      }
    }
  };

  const handleNextRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * PRACTICE_PROBLEMS.length);
    setCustomQuestionIndex(randomIndex);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
    setJustCelebrated(false);
  };

  const handleResetToDaily = () => {
    setCustomQuestionIndex(null);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
    setJustCelebrated(false);
  };

  // Recent 7 days streak dots visualization
  const past7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const iso = `${y}-${m}-${dayNum}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      days.push({
        iso,
        dayName,
        completed: streakData.history.includes(iso),
        isToday: iso === todayStr
      });
    }
    return days;
  }, [streakData.history, todayStr]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                Daily Chemistry Challenge
              </h3>
              {isCompletedToday ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Done Today
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  <Zap className="w-3 h-3" /> Today's Mission
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Keep your chemistry intuition sharp with 1 problem every single day!
            </p>
          </div>
        </div>

        {/* Streaks & Badges */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{streakData.currentStreak}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Day Streak
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 text-xs">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] text-slate-400">Best:</span>
            <span className="font-bold text-yellow-400 font-mono">{streakData.bestStreak}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 text-xs">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-400">Total:</span>
            <span className="font-bold text-cyan-400 font-mono">{streakData.totalCompleted}</span>
          </div>
        </div>
      </div>

      {/* 7-Day Activity Strip */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/60">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-medium">Recent 7 Days:</span>
          <div className="flex items-center gap-1.5">
            {past7Days.map(day => (
              <div
                key={day.iso}
                title={`${day.iso}: ${day.completed ? 'Completed!' : 'Not completed'}`}
                className={`w-6 h-6 rounded-md flex flex-col items-center justify-center text-[10px] font-bold border transition ${
                  day.completed
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : day.isToday
                    ? 'bg-slate-800 border-dashed border-amber-500/60 text-slate-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span>{day.dayName}</span>
              </div>
            ))}
          </div>
        </div>

        {customQuestionIndex !== null && (
          <button
            onClick={handleResetToDaily}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Return to Today's Question
          </button>
        )}
      </div>

      {/* Problem Content Container */}
      <div className="mt-4 space-y-4">
        {/* Category & Difficulty Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {currentProblem.lawName}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                currentProblem.difficulty === 'beginner'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : currentProblem.difficulty === 'intermediate'
                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                  : 'bg-rose-950 text-rose-400 border-rose-800'
              }`}
            >
              {currentProblem.difficulty}
            </span>
            {customQuestionIndex !== null && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                Bonus Practice
              </span>
            )}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            {currentProblem.title}
          </span>
        </div>

        {/* Problem Statement */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 leading-relaxed">
          {currentProblem.problemStatement}
        </div>

        {/* Given and Unknown Data Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
              Given Variables:
            </span>
            <div className="flex flex-wrap gap-2 text-slate-300">
              {Object.entries(currentProblem.given).map(([k, v]) => (
                <span key={k} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px]">
                  <strong>{k}:</strong> {v}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
              Find / Unknown:
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 font-semibold inline-block">
              {currentProblem.unknown}
            </span>
          </div>
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Choose the correct calculation or answer:
          </span>
          <div className="grid grid-cols-1 gap-2">
            {currentProblem.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let optionClass = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200';

              if (isSubmitted) {
                if (opt === currentProblem.correctAnswer) {
                  optionClass = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/20';
                } else if (isSelected) {
                  optionClass = 'bg-rose-950/70 border-rose-500 text-rose-200';
                } else {
                  optionClass = 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionClass = 'bg-cyan-950/70 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between gap-3 ${optionClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400 shrink-0 font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isSubmitted && opt === currentProblem.correctAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && isSelected && opt !== currentProblem.correctAnswer && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons & Feedback */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                  selectedOption
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Submit Challenge
              </button>
            ) : (
              <button
                onClick={handleNextRandomQuestion}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-600/20"
              >
                <Zap className="w-3.5 h-3.5" /> Try Another Question
              </button>
            )}

            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
          </div>

          {onOpenTopicPractice && (
            <button
              onClick={() => onOpenTopicPractice(currentProblem.topicId)}
              className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practice More {currentProblem.lawName}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 animate-fadeIn flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <strong className="block text-amber-300 font-semibold mb-0.5">Chemist Hint:</strong>
              {currentProblem.hint}
            </div>
          </div>
        )}

        {/* Submitted Results & Step-by-Step Breakdown */}
        {isSubmitted && (
          <div className="space-y-3 pt-3 border-t border-slate-800 animate-fadeIn">
            {isCorrect ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Brilliant! That is 100% correct!</span>
                </div>
                <p className="text-xs text-emerald-300/90 mt-1">
                  {justCelebrated ? '🎉 Daily streak recorded! Your chemistry streak is on fire!' : 'Great job working through the variables and calculation.'}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Not quite! Review the steps below to master this concept.</span>
                </div>
                {currentProblem.commonMistakeTrap && (
                  <p className="text-xs text-rose-300/90 mt-1">
                    ⚠️ <strong>Common Trap:</strong> {currentProblem.commonMistakeTrap}
                  </p>
                )}
              </div>
            )}

            {/* Detailed Solution Steps */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step-by-Step Solution Breakdown:</span>
              </div>

              <div className="space-y-2 text-xs">
                {currentProblem.solutionSteps.map((step, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 space-y-1">
                    <span className="font-bold text-slate-300 block">
                      Step {sIdx + 1}: {step.step}
                    </span>
                    {step.latex && (
                      <div className="my-1.5 p-2 bg-slate-950 rounded border border-slate-800 text-center overflow-x-auto text-amber-300 font-mono">
                        <MathView math={step.latex} />
                      </div>
                    )}
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
