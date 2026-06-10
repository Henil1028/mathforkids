'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Menu, X, LayoutDashboard, History, Trophy, Shield, LogOut } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './theme-toggle';
import { useUser } from '@/hooks/use-user';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: History },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, clearUser } = useUser();

  // Don't show navbar on landing page and register page
  if (pathname === '/' || pathname === '/register') return null;

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      >
        <div
          className="max-w-7xl mx-auto rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Math Master
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive ? 'text-indigo-500 dark:text-indigo-400' : 'hover:bg-[var(--bg-glass)]'
                  }`}
                  style={{ color: isActive ? undefined : 'var(--text-secondary)' }}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{ background: 'var(--bg-glass)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors hover:bg-[var(--bg-glass)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'var(--bg-glass)' }}>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                  style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            )}
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl p-4 md:hidden"
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'text-indigo-500' : ''
                  }`}
                  style={{
                    color: isActive ? undefined : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg-glass)' : undefined,
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Shield className="w-5 h-5" />
              Admin
            </Link>

            {user && (
              <div className="mt-4 pt-4 border-t border-[var(--border-glass)] flex flex-col gap-3">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user.username}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                  style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
