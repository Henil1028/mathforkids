'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, X, Divide } from 'lucide-react';

const features = [
  {
    title: 'Addition Practice',
    description: 'Master adding numbers from simple sums to complex calculations.',
    icon: Plus,
    gradient: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/20',
    iconBg: 'bg-blue-500/10',
  },
  {
    title: 'Subtraction Practice',
    description: 'Build confidence subtracting numbers of increasing difficulty.',
    icon: Minus,
    gradient: 'from-orange-500 to-amber-500',
    shadowColor: 'shadow-orange-500/20',
    iconBg: 'bg-orange-500/10',
  },
  {
    title: 'Multiplication Practice',
    description: 'From times tables to multi-digit multiplication mastery.',
    icon: X,
    gradient: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/20',
    iconBg: 'bg-violet-500/10',
  },
  {
    title: 'Division Practice',
    description: 'Learn division from basic to advanced exact divisions.',
    icon: Divide,
    gradient: 'from-teal-500 to-emerald-500',
    shadowColor: 'shadow-teal-500/20',
    iconBg: 'bg-teal-500/10',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--text-primary)' }}
          >
            Practice Every <span className="gradient-text">Operation</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Choose from four core math operations, each with three difficulty levels to match your skill.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`glass-card p-6 cursor-pointer group ${feature.shadowColor}`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {feature.description}
                </p>

                {/* Decorative gradient line */}
                <div className={`mt-5 h-1 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
