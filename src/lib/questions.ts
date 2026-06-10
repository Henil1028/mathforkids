import { Question, OperationType, DifficultyType } from '@/types';
import { OPERATOR_SYMBOLS } from './constants';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddition(difficulty: DifficultyType): Question {
  let num1: number, num2: number;

  switch (difficulty) {
    case 'EASY':
      num1 = randomInt(1, 100);
      num2 = randomInt(1, 100);
      break;
    case 'MEDIUM':
      num1 = randomInt(100, 1000);
      num2 = randomInt(100, 1000);
      break;
    case 'HARD':
      num1 = randomInt(1000, 10000);
      num2 = randomInt(1000, 10000);
      break;
  }

  return {
    id: 0,
    num1,
    num2,
    operator: '+',
    answer: num1 + num2,
    questionText: `${num1} + ${num2}`,
  };
}

function generateSubtraction(difficulty: DifficultyType): Question {
  let num1: number, num2: number;

  switch (difficulty) {
    case 'EASY':
      num1 = randomInt(1, 100);
      num2 = randomInt(1, 100);
      break;
    case 'MEDIUM':
      num1 = randomInt(100, 1000);
      num2 = randomInt(100, 1000);
      break;
    case 'HARD':
      num1 = randomInt(1000, 10000);
      num2 = randomInt(1000, 10000);
      break;
  }

  // Ensure answer is never negative
  if (num1 < num2) {
    [num1, num2] = [num2, num1];
  }

  return {
    id: 0,
    num1,
    num2,
    operator: '−',
    answer: num1 - num2,
    questionText: `${num1} − ${num2}`,
  };
}

function generateMultiplication(difficulty: DifficultyType): Question {
  let num1: number, num2: number;

  switch (difficulty) {
    case 'EASY':
      num1 = randomInt(1, 12);
      num2 = randomInt(1, 12);
      break;
    case 'MEDIUM':
      num1 = randomInt(10, 99);
      num2 = randomInt(10, 99);
      break;
    case 'HARD':
      num1 = randomInt(100, 999);
      num2 = randomInt(10, 99);
      break;
  }

  return {
    id: 0,
    num1,
    num2,
    operator: '×',
    answer: num1 * num2,
    questionText: `${num1} × ${num2}`,
  };
}

function generateDivision(difficulty: DifficultyType): Question {
  let answer: number, num2: number, num1: number;

  switch (difficulty) {
    case 'EASY':
      answer = randomInt(1, 12);
      num2 = randomInt(2, 12);
      break;
    case 'MEDIUM':
      answer = randomInt(10, 50);
      num2 = randomInt(10, 30);
      break;
    case 'HARD':
      answer = randomInt(20, 100);
      num2 = randomInt(12, 50);
      break;
  }

  num1 = answer * num2;

  return {
    id: 0,
    num1,
    num2,
    operator: '÷',
    answer,
    questionText: `${num1} ÷ ${num2}`,
  };
}

export function generateQuestion(operation: OperationType, difficulty: DifficultyType): Question {
  switch (operation) {
    case 'ADDITION':
      return generateAddition(difficulty);
    case 'SUBTRACTION':
      return generateSubtraction(difficulty);
    case 'MULTIPLICATION':
      return generateMultiplication(difficulty);
    case 'DIVISION':
      return generateDivision(difficulty);
  }
}

export function generateQuiz(operation: OperationType, difficulty: DifficultyType, count: number = 10): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const question = generateQuestion(operation, difficulty);
    question.id = i + 1;
    questions.push(question);
  }
  return questions;
}

export function getOperatorSymbol(operation: OperationType): string {
  return OPERATOR_SYMBOLS[operation];
}

export function getDifficultyRangeDescription(operation: OperationType, difficulty: DifficultyType): string {
  const descriptions: Record<OperationType, Record<DifficultyType, string>> = {
    ADDITION: {
      EASY: 'Numbers between 1 and 100',
      MEDIUM: 'Numbers between 100 and 1,000',
      HARD: 'Numbers between 1,000 and 10,000',
    },
    SUBTRACTION: {
      EASY: 'Numbers between 1 and 100',
      MEDIUM: 'Numbers between 100 and 1,000',
      HARD: 'Numbers between 1,000 and 10,000',
    },
    MULTIPLICATION: {
      EASY: 'Multiplication tables (1–12)',
      MEDIUM: 'Two-digit × two-digit numbers',
      HARD: 'Three-digit × two-digit numbers',
    },
    DIVISION: {
      EASY: 'Simple exact divisions (÷ 2–12)',
      MEDIUM: 'Larger exact divisions (÷ 10–30)',
      HARD: 'Complex exact divisions (÷ 12–50)',
    },
  };

  return descriptions[operation][difficulty];
}
