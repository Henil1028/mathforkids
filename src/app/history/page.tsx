'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Calendar, Trophy, Clock } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { HistoryEntry, OperationType, DifficultyType } from '@/types';
import { formatDate, getOperationLabel, getDifficultyLabel } from '@/lib/utils';

export default function HistoryPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOp, setFilterOp] = useState<string>('');
  const [filterDiff, setFilterDiff] = useState<string>('');
  const [sort, setSort] = useState('date');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/register');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);

    const params = new URLSearchParams({ userId: user.id, page: page.toString(), sort });
    if (filterOp) params.set('operation', filterOp);
    if (filterDiff) params.set('difficulty', filterDiff);

    fetch(`/api/quiz/history?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user, page, sort, filterOp, filterDiff]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getScoreColor = (pct: number) => {
    if (pct >= 90) return 'text-yellow-500';
    if (pct >= 70) return 'text-blue-500';
    if (pct >= 50) return 'text-green-500';
    return 'text-orange-500';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <HistoryIcon className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}
            >
              Quiz History
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Review your past quiz attempts</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4"
        >
          <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />

          <select
            value={filterOp}
            onChange={(e) => { setFilterOp(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
          >
            <option value="">All Operations</option>
            <option value="ADDITION">Addition</option>
            <option value="SUBTRACTION">Subtraction</option>
            <option value="MULTIPLICATION">Multiplication</option>
            <option value="DIVISION">Division</option>
          </select>

          <select
            value={filterDiff}
            onChange={(e) => { setFilterDiff(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
            <option value="operation">Sort by Operation</option>
          </select>

          <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
            {total} total attempts
          </span>
        </motion.div>

        {/* History list */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <HistoryIcon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No quizzes yet</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Complete a quiz to see your history here.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block glass-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--bg-glass)' }}>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Operation</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Difficulty</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Score</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Percentage</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, i) => (
                      <tr key={entry.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(entry.createdAt)}</td>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{getOperationLabel(entry.operation)}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            entry.difficulty === 'EASY' ? 'bg-green-500/10 text-green-500' :
                            entry.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {getDifficultyLabel(entry.difficulty)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{entry.score}/{entry.totalQuestions * 10}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-bold ${getScoreColor(entry.percentage)}`}>{entry.percentage}%</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                          {Math.floor(entry.timeTaken / 60)}:{(entry.timeTaken % 60).toString().padStart(2, '0')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {history.map((entry) => (
                  <div key={entry.id} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {getOperationLabel(entry.operation)}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        entry.difficulty === 'EASY' ? 'bg-green-500/10 text-green-500' :
                        entry.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {getDifficultyLabel(entry.difficulty)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className={`text-xl font-bold ${getScoreColor(entry.percentage)}`}>{entry.percentage}%</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Score: {entry.score}/{entry.totalQuestions * 10}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(entry.createdAt)}
                        </p>
                        <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="w-3 h-3" />
                          {Math.floor(entry.timeTaken / 60)}:{(entry.timeTaken % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg disabled:opacity-30 transition-colors hover:bg-[var(--bg-glass)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg disabled:opacity-30 transition-colors hover:bg-[var(--bg-glass)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
