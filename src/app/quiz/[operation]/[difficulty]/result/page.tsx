'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { RotateCcw, LayoutDashboard, Trophy, CheckCircle2, XCircle, Clock, Target } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { getPerformanceTier } from '@/lib/utils';
import { QuizResult } from '@/types';

function ConfettiEffect() {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
      color: ['#6366f1', '#ec4899', '#8b5cf6', '#f59e0b', '#22c55e', '#3b82f6'][Math.floor(Math.random() * 6)],
      size: Math.random() * 8 + 4,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

function ScoreCircle({ percentage }: { percentage: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const tier = getPerformanceTier(percentage);

  const strokeColor = percentage >= 90 ? '#f59e0b' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#22c55e' : '#f97316';

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--bg-glass)" strokeWidth="12" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="text-4xl font-extrabold"
          style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-primary)' }}
        >
          {percentage}%
        </motion.span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Score</span>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useUser();

  const [result, setResult] = useState<QuizResult | null>(null);

  const operation = (params.operation as string).toUpperCase();
  const difficulty = (params.difficulty as string).toUpperCase();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/register');
      return;
    }

    const data = searchParams.get('data');
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setResult(parsed);
      } catch {
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  }, [loading, user, searchParams, router]);

  if (!result || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tier = getPerformanceTier(result.percentage);
  const showConfetti = result.percentage >= 70;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      {showConfetti && <ConfettiEffect />}

      <div className="max-w-2xl mx-auto">
        {/* Performance message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
            className="text-6xl mb-4"
          >
            {tier.emoji}
          </motion.div>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-2 ${tier.color}`}
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            {tier.label}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {operation.charAt(0) + operation.slice(1).toLowerCase()} • {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
          </p>
        </motion.div>

        {/* Score circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <ScoreCircle percentage={result.percentage} />
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          <div className="glass-card p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-2 text-indigo-500" />
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{result.score}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Score</p>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <p className="text-xl font-bold text-green-500">{result.correctAnswers}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Correct</p>
          </div>
          <div className="glass-card p-4 text-center">
            <XCircle className="w-5 h-5 mx-auto mb-2 text-red-500" />
            <p className="text-xl font-bold text-red-500">{result.wrongAnswers}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Wrong</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-amber-500" />
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Time</p>
          </div>
        </motion.div>

        {/* Question results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-outfit), sans-serif' }}>
            Question Review
          </h3>
          <div className="space-y-3">
            {result.questionResults.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'var(--bg-glass)' }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${q.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {q.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{q.question}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${q.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {q.userAnswer !== null ? q.userAnswer : '—'}
                  </span>
                  {!q.isCorrect && (
                    <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                      Answer: {q.correctAnswer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/quiz/${operation.toLowerCase()}/${difficulty.toLowerCase()}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Quiz
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
            }}
          >
            <LayoutDashboard className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
