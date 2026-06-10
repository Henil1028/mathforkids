import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const operationCounts = await prisma.quizAttempt.groupBy({
      by: ['operation'],
      where: { userId },
      _count: { id: true },
      _avg: { score: true },
    });

    const totalQuizzes = await prisma.quizAttempt.count({ where: { userId } });
    const avgScore = await prisma.quizAttempt.aggregate({
      where: { userId },
      _avg: { score: true },
    });

    const stats: Record<string, { count: number; avgScore: number }> = {};
    for (const op of operationCounts) {
      stats[op.operation] = {
        count: op._count.id,
        avgScore: Math.round(op._avg.score || 0),
      };
    }

    return NextResponse.json({
      totalQuizzes,
      averageScore: avgScore._avg.score ? Math.round(avgScore._avg.score) : 0,
      operationStats: stats,
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json({
      totalQuizzes: 0,
      averageScore: 0,
      operationStats: {},
    });
  }
}
