import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const operation = searchParams.get('operation');
    const difficulty = searchParams.get('difficulty');
    const sort = searchParams.get('sort') || 'date';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const where: Record<string, unknown> = { userId };
    if (operation) where.operation = operation;
    if (difficulty) where.difficulty = difficulty;

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case 'score':
        orderBy.score = 'desc';
        break;
      case 'operation':
        orderBy.operation = 'asc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const [attempts, total] = await Promise.all([
      prisma.quizAttempt.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quizAttempt.count({ where }),
    ]);

    const history = attempts.map((a) => ({
      id: a.id,
      operation: a.operation,
      difficulty: a.difficulty,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: Math.round((a.score / (a.totalQuestions * 10)) * 100),
      timeTaken: a.timeTaken,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({
      history,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
