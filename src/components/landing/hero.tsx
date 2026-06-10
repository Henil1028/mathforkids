'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Grade 8 & Below
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          <span className="gradient-text">Math Master</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Quiz</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Improve your math skills with fun and interactive quizzes.
          Practice addition, subtraction, multiplication, and division!
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-lg bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 transition-shadow"
            >
              Start Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <BookOpen className="w-5 h-5" />
            Learn More
          </motion.button>
        </motion.div>

        {/* Decorative math expression */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 inline-flex items-center gap-4 px-6 py-3 rounded-2xl"
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {['12 + 8 = 20', '45 × 3 = 135', '100 ÷ 4 = 25'].map((expr, i) => (
            <span key={i} className="text-sm font-mono hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
              {expr}
              {i < 2 && <span className="mx-4 text-indigo-400">•</span>}
            </span>
          ))}
          <span className="text-sm font-mono sm:hidden" style={{ color: 'var(--text-muted)' }}>
            12 + 8 = 20
          </span>
        </motion.div>
      </div>
    </section>
  );
}
