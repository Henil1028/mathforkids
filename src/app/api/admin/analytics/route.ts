import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, totalQuizzes, avgResult, dailyActiveUsers] = await Promise.all([
      prisma.user.count(),
      prisma.quizAttempt.count(),
      prisma.quizAttempt.aggregate({ _avg: { score: true } }),
      prisma.quizAttempt.findMany({
        where: { createdAt: { gte: todayStart } },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalQuizzes,
      averageScore: avgResult._avg.score ? Math.round(avgResult._avg.score) : 0,
      dailyActiveUsers: dailyActiveUsers.length,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({
      totalUsers: 0,
      totalQuizzes: 0,
      averageScore: 0,
      dailyActiveUsers: 0,
    });
  }
}
