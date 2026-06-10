'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Minus, X, Divide, Play, Trophy, BarChart3 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { OPERATIONS } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plus, Minus, X, Divide,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<{
    totalQuizzes: number;
    averageScore: number;
    operationStats: Record<string, { count: number; avgScore: number }>;
  }>({ totalQuizzes: 0, averageScore: 0, operationStats: {} });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/register');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch(`/api/quiz/user-stats?userId=${user.id}`)
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}
          >
            Welcome back, <span className="gradient-text">{user.username}</span>! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Choose an operation to start practicing
          </p>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-10"
        >
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalQuizzes}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Quizzes Completed</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.averageScore}%</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Average Score</p>
            </div>
          </div>
        </motion.div>

        {/* Operation cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {OPERATIONS.map((op) => {
            const Icon = iconMap[op.icon];
            const opStats = stats.operationStats[op.operation];
            return (
              <motion.div
                key={op.operation}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card gradient-border p-6 sm:p-8 cursor-pointer group"
                onClick={() => router.push(`/quiz/${op.operation.toLowerCase()}`)}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${op.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {opStats && (
                    <div className="text-right">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Completed</p>
                      <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{opStats.count}</p>
                    </div>
                  )}
                </div>

                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}
                >
                  {op.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  {op.description}
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r ${op.gradient} shadow-md`}
                >
                  <Play className="w-4 h-4" />
                  Start Quiz
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
