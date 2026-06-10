import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { _count: { select: { quizAttempts: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        createdAt: u.createdAt.toISOString(),
        quizCount: u._count.quizAttempts,
      }))
    );
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json([]);
  }
}
