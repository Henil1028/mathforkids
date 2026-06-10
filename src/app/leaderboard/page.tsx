'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { LeaderboardEntry } from '@/types';

const rankStyles = [
  { bg: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', icon: Crown, color: 'text-yellow-500' },
  { bg: 'from-gray-300/20 to-slate-400/20', border: 'border-gray-400/30', icon: Medal, color: 'text-gray-400' },
  { bg: 'from-orange-600/20 to-amber-700/20', border: 'border-orange-600/30', icon: Medal, color: 'text-orange-600' },
];

export default function LeaderboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/register');
  }, [user, loading, router]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then(setLeaderboard)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}
          >
            Leaderboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Top 10 math champions</p>
        </motion.div>

        {/* Leaderboard */}
        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No entries yet</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Be the first to complete a quiz!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, i) => {
              const isTop3 = i < 3;
              const style = rankStyles[i];
              const isCurrentUser = entry.userId === user?.id;

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass-card p-5 flex items-center gap-4 ${isCurrentUser ? 'ring-2 ring-indigo-500' : ''} ${isTop3 ? `border ${style.border}` : ''}`}
                >
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    isTop3 ? `bg-gradient-to-br ${style.bg}` : ''
                  }`} style={{ background: isTop3 ? undefined : 'var(--bg-glass)' }}>
                    {isTop3 ? (
                      <span className={`text-lg ${style.color}`}>
                        {i === 0 ? '👑' : i === 1 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>#{entry.rank}</span>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {entry.username}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-medium">You</span>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {entry.totalQuizzes} quizzes completed
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-primary)' }}>
                        {entry.highestScore}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Best Score</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
