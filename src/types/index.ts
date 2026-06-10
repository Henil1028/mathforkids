// TypeScript type definitions for Math Master Quiz

export type OperationType = 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION';
export type DifficultyType = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: number;
  num1: number;
  num2: number;
  operator: string;
  answer: number;
  questionText: string;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  correctCount: number;
  wrongCount: number;
  score: number;
  startTime: number;
  isComplete: boolean;
}

export interface QuizResult {
  score: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  operation: OperationType;
  difficulty: DifficultyType;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  question: string;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean;
}

export interface UserSession {
  id: string;
  username: string;
  email: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  highestScore: number;
  totalQuizzes: number;
  userId: string;
}

export interface HistoryEntry {
  id: string;
  operation: OperationType;
  difficulty: DifficultyType;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalQuizzes: number;
  averageScore: number;
  dailyActiveUsers: number;
}

export interface OperationConfig {
  name: string;
  operation: OperationType;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  bgGradient: string;
}

export interface DifficultyConfig {
  name: string;
  difficulty: DifficultyType;
  color: string;
  gradient: string;
  description: string;
  range: string;
}
