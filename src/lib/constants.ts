import { OperationType, DifficultyType } from '@/types';

export const OPERATIONS: {
  name: string;
  operation: OperationType;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  lightGradient: string;
}[] = [
  {
    name: 'Addition',
    operation: 'ADDITION',
    icon: 'Plus',
    description: 'Practice adding numbers together with increasing difficulty',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    lightGradient: 'from-blue-400/20 to-cyan-400/20',
  },
  {
    name: 'Subtraction',
    operation: 'SUBTRACTION',
    icon: 'Minus',
    description: 'Master subtraction with numbers of varying sizes',
    color: '#f97316',
    gradient: 'from-orange-500 to-amber-500',
    lightGradient: 'from-orange-400/20 to-amber-400/20',
  },
  {
    name: 'Multiplication',
    operation: 'MULTIPLICATION',
    icon: 'X',
    description: 'Sharpen your multiplication skills from tables to complex',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-500',
    lightGradient: 'from-violet-400/20 to-purple-400/20',
  },
  {
    name: 'Division',
    operation: 'DIVISION',
    icon: 'Divide',
    description: 'Learn division from simple to challenging problems',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-emerald-500',
    lightGradient: 'from-teal-400/20 to-emerald-400/20',
  },
];

export const DIFFICULTIES: {
  name: string;
  difficulty: DifficultyType;
  color: string;
  gradient: string;
  borderColor: string;
  description: string;
  icon: string;
}[] = [
  {
    name: 'Easy',
    difficulty: 'EASY',
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/50',
    description: 'Perfect for beginners',
    icon: 'Sparkles',
  },
  {
    name: 'Medium',
    difficulty: 'MEDIUM',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/50',
    description: 'A moderate challenge',
    icon: 'Flame',
  },
  {
    name: 'Hard',
    difficulty: 'HARD',
    color: '#ef4444',
    gradient: 'from-red-500 to-rose-500',
    borderColor: 'border-red-500/50',
    description: 'For math champions',
    icon: 'Zap',
  },
];

export const TIMER_DURATION = 30; // seconds per question
export const QUESTIONS_PER_QUIZ = 10;
export const POINTS_PER_CORRECT = 10;
export const MAX_SCORE = QUESTIONS_PER_QUIZ * POINTS_PER_CORRECT;

export const PERFORMANCE_TIERS = [
  { min: 90, label: 'Excellent!', emoji: '🌟', color: 'text-yellow-400', bgColor: 'from-yellow-500/20 to-amber-500/20' },
  { min: 70, label: 'Very Good!', emoji: '👏', color: 'text-blue-400', bgColor: 'from-blue-500/20 to-cyan-500/20' },
  { min: 50, label: 'Good!', emoji: '👍', color: 'text-green-400', bgColor: 'from-green-500/20 to-emerald-500/20' },
  { min: 0, label: 'Needs Practice', emoji: '📚', color: 'text-orange-400', bgColor: 'from-orange-500/20 to-red-500/20' },
];

export const OPERATOR_SYMBOLS: Record<OperationType, string> = {
  ADDITION: '+',
  SUBTRACTION: '−',
  MULTIPLICATION: '×',
  DIVISION: '÷',
};
