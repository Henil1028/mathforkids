'use client';

import { useRouter, useParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Sparkles, Flame, Zap, ArrowLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { DIFFICULTIES, OPERATIONS } from '@/lib/constants';
import { getDifficultyRangeDescription } from '@/lib/questions';
import { OperationType, DifficultyType } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Flame, Zap,
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring' } },
};

export default function DifficultyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useUser();

  const operationSlug = (params.operation as string).toUpperCase() as OperationType;
  const operationConfig = OPERATIONS.find((o) => o.operation === operationSlug);

  useEffect(() => {
    if (!loading && !user) router.push('/register');
  }, [user, loading, router]);

  if (!operationConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p style={{ color: 'var(--text-muted)' }}>Invalid operation</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-indigo-500"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}
          >
            {operationConfig.name} Quiz
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Choose your difficulty level
          </p>
        </motion.div>

        {/* Difficulty cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {DIFFICULTIES.map((diff) => {
            const Icon = iconMap[diff.icon];
            const rangeDesc = getDifficultyRangeDescription(operationSlug, diff.difficulty as DifficultyType);
            return (
              <motion.div
                key={diff.difficulty}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`glass-card p-8 cursor-pointer group text-center relative overflow-hidden ${diff.borderColor} border-2`}
                onClick={() => router.push(`/quiz/${operationSlug.toLowerCase()}/${diff.difficulty.toLowerCase()}`)}
              >
                {/* Background glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(circle at center, ${diff.color}15, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${diff.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-9 h-9 text-white" />
                  </div>

                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}
                  >
                    {diff.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    {diff.description}
                  </p>
                  <p className="text-xs mb-6 px-3 py-1.5 rounded-full inline-block" style={{
                    background: 'var(--bg-glass)',
                    color: 'var(--text-secondary)',
                  }}>
                    {rangeDesc}
                  </p>

                  <div className="flex items-center justify-center gap-1 font-medium text-sm" style={{ color: diff.color }}>
                    Start
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
