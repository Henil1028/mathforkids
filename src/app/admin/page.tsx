'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, BookCheck, TrendingUp, Activity, Eye } from 'lucide-react';
import { formatDate, getOperationLabel, getDifficultyLabel } from '@/lib/utils';

type Tab = 'analytics' | 'users' | 'attempts';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  quizCount: number;
}

interface AdminAttempt {
  id: string;
  username: string;
  operation: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  createdAt: string;
}

interface Analytics {
  totalUsers: number;
  totalQuizzes: number;
  averageScore: number;
  dailyActiveUsers: number;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('analytics');
  const [analytics, setAnalytics] = useState<Analytics>({ totalUsers: 0, totalQuizzes: 0, averageScore: 0, dailyActiveUsers: 0 });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [attempts, setAttempts] = useState<AdminAttempt[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (default: admin123)
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123')) {
      setAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes, attemptsRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/users'),
          fetch('/api/admin/attempts'),
        ]);

        setAnalytics(await analyticsRes.json());
        setUsers(await usersRes.json());
        setAttempts(await attemptsRes.json());
      } catch {
        console.error('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}>
              Admin Access
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg"
            >
              Enter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const analyticsCards = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Total Quizzes', value: analytics.totalQuizzes, icon: BookCheck, gradient: 'from-purple-500 to-pink-500' },
    { label: 'Avg Score', value: analytics.averageScore, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Active Today', value: analytics.dailyActiveUsers, icon: Activity, gradient: 'from-orange-500 to-red-500' },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'users', label: 'Users' },
    { id: 'attempts', label: 'Attempts' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}>
              Admin Panel
            </h1>
          </div>
        </motion.div>

        {/* Analytics cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {analyticsCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="glass-card p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{loading ? '—' : card.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-indigo-500 text-white' : ''
              }`}
              style={tab !== t.id ? { background: 'var(--bg-glass)', color: 'var(--text-secondary)' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'analytics' && (
          <div className="glass-card p-8 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Analytics Dashboard</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Overview metrics are shown in the cards above. Detailed charts will be available in a future update.
            </p>
          </div>
        )}

        {tab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--bg-glass)' }}>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Username</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Joined</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Quizzes</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.username}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{u.quizCount}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No users yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'attempts' && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--bg-glass)' }}>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Operation</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Difficulty</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Score</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.username}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{getOperationLabel(a.operation)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          a.difficulty === 'EASY' ? 'bg-green-500/10 text-green-500' :
                          a.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {getDifficultyLabel(a.difficulty)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{a.score}/{a.totalQuestions * 10}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(a.createdAt)}</td>
                    </tr>
                  ))}
                  {attempts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No attempts yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
