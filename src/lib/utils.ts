import { PERFORMANCE_TIERS } from './constants';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getPerformanceTier(percentage: number) {
  return PERFORMANCE_TIERS.find((tier) => percentage >= tier.min) || PERFORMANCE_TIERS[PERFORMANCE_TIERS.length - 1];
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getOperationLabel(operation: string): string {
  return operation.charAt(0) + operation.slice(1).toLowerCase();
}

export function getDifficultyLabel(difficulty: string): string {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
}
