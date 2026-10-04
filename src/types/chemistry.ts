export type GasLawId = 
  | 'boyles-law'
  | 'charles-law'
  | 'gay-lussac-law'
  | 'avogadro-law'
  | 'combined-gas-law'
  | 'ideal-gas-law';

export interface GasVariable {
  symbol: string;
  name: string;
  standardUnit: string;
  alternateUnits?: string[];
  description: string;
}

export interface FormulaRearrangement {
  targetVariable: string;
  latex: string;
  explanation: string;
  steps: string[];
}

export interface GasLawInfo {
  id: GasLawId;
  name: string;
  shortName: string;
  scientist: string;
  scientistYears: string;
  scientistOrigin: string;
  historicalContext: string;
  coreConcept: string;
  primaryFormulaLatex: string;
  plainTextFormula: string;
  relationshipType: 'inverse' | 'direct' | 'combined' | 'ideal';
  changingVariables: string[];
  constantVariables: string[];
  unitRequirements: string[];
  commonMistakes: {
    mistake: string;
    reason: string;
    correction: string;
    correctionLatex?: string;
  }[];
  workedExample: {
    problemStatement: string;
    given: Record<string, string>;
    unknown: string;
    formulaLatex: string;
    rearrangementLatex: string;
    substitutionLatex: string;
    solutionLatex: string;
    explanation: string;
  };
  rearrangements: FormulaRearrangement[];
  realWorldApplications: {
    title: string;
    icon: string;
    summary: string;
    detail: string;
  }[];
  color: string;
  accentBorder: string;
}

export interface ChemistryTopic {
  id: string;
  category: 'gas-laws' | 'periodic-table' | 'calculations' | 'compounds' | 'reactions' | 'equilibrium';
  categoryLabel: string;
  title: string;
  subtitle?: string;
  summary: string;
  formulaLatex?: string;
  keyPoints: string[];
  keywords: string[];
  relatedLawId?: GasLawId;
  readTime: string;
}

export type ProblemDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'challenge';

export interface PracticeProblem {
  id: string;
  difficulty: ProblemDifficulty;
  topicId: string;
  category: 'gas-laws' | 'periodic-table' | 'calculations' | 'compounds' | 'reactions';
  lawId?: GasLawId;
  lawName: string; // Used as display title for law or topic
  title: string;
  problemStatement: string;
  given: { [key: string]: string };
  unknown: string;
  options: string[];
  correctAnswer: string;
  solutionSteps: {
    step: string;
    latex?: string;
    explanation: string;
  }[];
  hint: string;
  commonMistakeTrap?: string;
}

export interface MiniChemistMood {
  state: 'idle' | 'thinking' | 'explaining' | 'celebrating' | 'mistake_help' | 'prediction' | 'simulation';
  message: string;
  bubbleColor?: string;
}

export interface StudentProgress {
  completedLessons: string[]; // GasLawId or topicId
  solvedProblems: string[];
  quizScores: {
    totalAttempted: number;
    totalCorrect: number;
    byLaw: Record<string, { attempted: number; correct: number }>;
  };
  frequentlyConfusedLaws: string[];
  commonDifficulties: string[];
  bookmarks: string[];
  notes: Record<string, string>; // topicId -> noteText
  lastStudiedLaw: GasLawId;
}
