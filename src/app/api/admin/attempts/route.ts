import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(
      attempts.map((a) => ({
        id: a.id,
        username: a.user.username,
        operation: a.operation,
        difficulty: a.difficulty,
        score: a.score,
        totalQuestions: a.totalQuestions,
        timeTaken: a.timeTaken,
        createdAt: a.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Admin attempts error:', error);
    return NextResponse.json([]);
  }
}
