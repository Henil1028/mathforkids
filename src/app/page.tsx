'use client';

import FloatingSymbols from '@/components/landing/floating-symbols';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import StatsSection from '@/components/landing/stats-section';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10" style={{ background: 'var(--bg-primary)' }}>
        <FloatingSymbols />
        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent" />
      </div>

      <Hero />
      <Features />
      <StatsSection />
    </div>
  );
}
