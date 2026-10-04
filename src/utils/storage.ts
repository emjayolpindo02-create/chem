import { StudentProgress, GasLawId } from '../types/chemistry';

const STORAGE_KEY = 'chem_navigator_progress_v1';

const DEFAULT_PROGRESS: StudentProgress = {
  completedLessons: ['boyles-law'],
  solvedProblems: [],
  quizScores: {
    totalAttempted: 0,
    totalCorrect: 0,
    byLaw: {}
  },
  frequentlyConfusedLaws: ['gay-lussac-law', 'combined-gas-law'],
  commonDifficulties: [
    'Converting Celsius to Kelvin before calculating',
    'Cross-multiplying fractions in Combined Gas Law',
    'Selecting correct Gas Constant R for given units'
  ],
  bookmarks: ['boyles-law', 'ideal-gas-law', 'periodic-trends'],
  notes: {
    'boyles-law': 'Remember: P and V are INVERSE. When P goes up, V goes down!',
    'charles-law': 'CRITICAL: Must add 273.15 to convert Celsius to Kelvin every single time.'
  },
  lastStudiedLaw: 'boyles-law'
};

export function getStoredProgress(): StudentProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
      return DEFAULT_PROGRESS;
    }
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed reading progress from localStorage:', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: StudentProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed saving progress to localStorage:', e);
  }
}

export function markLessonCompleted(lessonId: string): StudentProgress {
  const current = getStoredProgress();
  if (!current.completedLessons.includes(lessonId)) {
    const updated = {
      ...current,
      completedLessons: [...current.completedLessons, lessonId]
    };
    saveProgress(updated);
    return updated;
  }
  return current;
}

export function recordProblemResult(problemId: string, lawOrTopicId: string, isCorrect: boolean): StudentProgress {
  const current = getStoredProgress();
  const lawStats = current.quizScores.byLaw[lawOrTopicId] || { attempted: 0, correct: 0 };
  const updatedLawStats = {
    attempted: lawStats.attempted + 1,
    correct: isCorrect ? lawStats.correct + 1 : lawStats.correct
  };

  const solvedSet = new Set(current.solvedProblems);
  if (isCorrect) {
    solvedSet.add(problemId);
  }

  // Update frequently confused laws if failed twice
  const confusedSet = new Set(current.frequentlyConfusedLaws);
  if (!isCorrect && updatedLawStats.attempted - updatedLawStats.correct >= 2) {
    confusedSet.add(lawOrTopicId);
  } else if (isCorrect && updatedLawStats.correct >= 3) {
    confusedSet.delete(lawOrTopicId);
  }

  const updated: StudentProgress = {
    ...current,
    solvedProblems: Array.from(solvedSet),
    quizScores: {
      totalAttempted: current.quizScores.totalAttempted + 1,
      totalCorrect: current.quizScores.totalCorrect + (isCorrect ? 1 : 0),
      byLaw: {
        ...current.quizScores.byLaw,
        [lawOrTopicId]: updatedLawStats
      }
    },
    frequentlyConfusedLaws: Array.from(confusedSet)
  };

  saveProgress(updated);
  return updated;
}

export function toggleBookmark(topicId: string): boolean {
  const current = getStoredProgress();
  const isBookmarked = current.bookmarks.includes(topicId);
  const updatedBookmarks = isBookmarked
    ? current.bookmarks.filter(id => id !== topicId)
    : [...current.bookmarks, topicId];

  saveProgress({
    ...current,
    bookmarks: updatedBookmarks
  });
  return !isBookmarked;
}

export interface DailyStreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null; // 'YYYY-MM-DD'
  totalCompleted: number;
  history: string[]; // list of completed 'YYYY-MM-DD'
}

const STREAK_STORAGE_KEY = 'chem_navigator_daily_streak_v1';

const DEFAULT_STREAK: DailyStreakData = {
  currentStreak: 0,
  bestStreak: 0,
  lastCompletedDate: null,
  totalCompleted: 0,
  history: []
};

export function getDailyStreakData(): DailyStreakData {
  if (typeof window === 'undefined') return DEFAULT_STREAK;
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(DEFAULT_STREAK));
      return DEFAULT_STREAK;
    }
    const parsed: DailyStreakData = JSON.parse(raw);
    
    // Check if streak was broken (more than 1 day missed since lastCompletedDate)
    if (parsed.lastCompletedDate) {
      const todayStr = getTodayDateString();
      const diffDays = getDaysDifference(parsed.lastCompletedDate, todayStr);
      if (diffDays > 1) {
        // Streak broken
        parsed.currentStreak = 0;
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(parsed));
      }
    }
    return parsed;
  } catch (e) {
    console.warn('Failed to load streak data:', e);
    return DEFAULT_STREAK;
  }
}

export function saveDailyStreakData(data: DailyStreakData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save streak data:', e);
  }
}

export function recordDailyChallengeCompleted(): { streakData: DailyStreakData; isNewCompletionToday: boolean } {
  const current = getDailyStreakData();
  const todayStr = getTodayDateString();

  if (current.lastCompletedDate === todayStr) {
    // Already completed today
    return { streakData: current, isNewCompletionToday: false };
  }

  let newCurrentStreak = 1;
  if (current.lastCompletedDate) {
    const diffDays = getDaysDifference(current.lastCompletedDate, todayStr);
    if (diffDays === 1) {
      // Consecutive day!
      newCurrentStreak = current.currentStreak + 1;
    } else {
      // Streak reset to 1
      newCurrentStreak = 1;
    }
  }

  const newBestStreak = Math.max(current.bestStreak, newCurrentStreak);
  const updatedHistory = Array.from(new Set([...current.history, todayStr]));

  const updated: DailyStreakData = {
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastCompletedDate: todayStr,
    totalCompleted: current.totalCompleted + 1,
    history: updatedHistory
  };

  saveDailyStreakData(updated);
  return { streakData: updated, isNewCompletionToday: true };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function saveNote(topicId: string, noteText: string): void {
  const current = getStoredProgress();
  saveProgress({
    ...current,
    notes: {
      ...current.notes,
      [topicId]: noteText
    }
  });
}

export function exportAllUserData(): string {
  const progress = getStoredProgress();
  const streak = getDailyStreakData();
  const exportPayload = {
    appName: 'Chem-Navigator',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    progress,
    streak
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importAllUserData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.progress) {
      saveProgress(data.progress);
    }
    if (data.streak) {
      saveDailyStreakData(data.streak);
    }
    return true;
  } catch (e) {
    console.error('Failed to import user data:', e);
    return false;
  }
}
