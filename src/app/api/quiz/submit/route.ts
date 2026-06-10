import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, operation, difficulty, score, totalQuestions, timeTaken, questionResults } = body;

    if (!userId || !operation || !difficulty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        operation,
        difficulty,
        score,
        totalQuestions,
        timeTaken,
      },
    });

    // Create question history records
    if (questionResults && questionResults.length > 0) {
      await prisma.questionHistory.createMany({
        data: questionResults.map((q: { question: string; correctAnswer: number; userAnswer: number | null; isCorrect: boolean }) => ({
          userId,
          attemptId: attempt.id,
          question: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: q.userAnswer,
          isCorrect: q.isCorrect,
        })),
      });
    }

    return NextResponse.json({ success: true, attemptId: attempt.id }, { status: 201 });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
