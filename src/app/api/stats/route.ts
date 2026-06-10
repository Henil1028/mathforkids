import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalUsers, totalQuizzes, avgResult] = await Promise.all([
      prisma.user.count(),
      prisma.quizAttempt.count(),
      prisma.quizAttempt.aggregate({
        _avg: { score: true },
      }),
    ]);

    const averageScore = avgResult._avg.score
      ? Math.round((avgResult._avg.score / 100) * 100)
      : 0;

    return NextResponse.json({
      totalUsers,
      totalQuizzes,
      averageScore,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({
      totalUsers: 0,
      totalQuizzes: 0,
      averageScore: 0,
    });
  }
}
