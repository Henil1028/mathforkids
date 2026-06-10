import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.quizAttempt.groupBy({
      by: ['userId'],
      _max: { score: true },
      _count: { id: true },
      orderBy: { _max: { score: 'desc' } },
      take: 10,
    });

    const userIds = leaderboard.map((l) => l.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u.username]));

    const result = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      username: userMap.get(entry.userId) || 'Unknown',
      highestScore: entry._max.score || 0,
      totalQuizzes: entry._count.id,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([]);
  }
}
