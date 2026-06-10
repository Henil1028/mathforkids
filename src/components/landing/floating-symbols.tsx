'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SYMBOLS = ['+', '−', '×', '÷', '=', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'π', '%', '√'];

interface FloatingSymbol {
  symbol: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingSymbols() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const symbols = useMemo<FloatingSymbol[]>(() => {
    if (!mounted) return [];
    return Array.from({ length: 24 }, (_, i) => ({
      symbol: SYMBOLS[i % SYMBOLS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 28 + 16,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.15 + 0.05,
    }));
  }, [mounted]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((item, i) => (
        <motion.div
          key={i}
          className="absolute font-bold select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono), monospace',
          }}
          animate={{
            y: [-20, -40, -15, -35, -20],
            x: [-5, 10, -8, 5, -5],
            rotate: [-5, 8, -3, 10, -5],
            scale: [1, 1.05, 0.98, 1.03, 1],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.symbol}
        </motion.div>
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-pink-500/10 blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
  );
}
