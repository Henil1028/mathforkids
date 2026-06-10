'use client';

import { Calculator, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="relative mt-20 border-t"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
    >
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Math Master
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Helping students master mathematics through fun and interactive quizzes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Dashboard', 'Leaderboard', 'History'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm transition-colors hover:text-indigo-500"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              About
            </h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'FAQ'].map((item) => (
                <li key={item}>
                  <span className="text-sm cursor-pointer transition-colors hover:text-indigo-500" style={{ color: 'var(--text-muted)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Legal
            </h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <span className="text-sm cursor-pointer transition-colors hover:text-indigo-500" style={{ color: 'var(--text-muted)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Math Master Quiz. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
}
