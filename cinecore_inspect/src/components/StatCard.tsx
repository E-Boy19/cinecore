import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  isDecimal?: boolean;
  icon: LucideIcon;
  colorScheme?: 'cyan' | 'neon-blue' | 'violet' | 'amber';
  changeText?: string;
  index?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix = '',
  isDecimal = false,
  icon: Icon,
  colorScheme = 'cyan',
  changeText,
  index = 0
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = ease * value;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  const colorStyles = {
    cyan: {
      accent: 'text-cyan-400',
      borderHover: 'group-hover:border-cyan-500/50',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)]',
      iconBg: 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30',
      gradient: 'from-cyan-950/20 via-transparent to-transparent'
    },
    'neon-blue': {
      accent: 'text-blue-400',
      borderHover: 'group-hover:border-blue-500/50',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)]',
      iconBg: 'bg-blue-950/40 text-blue-400 border-blue-500/30',
      gradient: 'from-blue-950/20 via-transparent to-transparent'
    },
    violet: {
      accent: 'text-violet-400',
      borderHover: 'group-hover:border-violet-500/50',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.25)]',
      iconBg: 'bg-violet-950/40 text-violet-400 border-violet-500/30',
      gradient: 'from-violet-950/20 via-transparent to-transparent'
    },
    amber: {
      accent: 'text-amber-400',
      borderHover: 'group-hover:border-amber-500/50',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)]',
      iconBg: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
      gradient: 'from-amber-950/20 via-transparent to-transparent'
    }
  }[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative p-5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 ${colorStyles.borderHover} ${colorStyles.glow} transition-all duration-300 overflow-hidden cursor-default tech-bracket-top-left`}
    >
      {/* Background internal gradient shift */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorStyles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-medium">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-heading font-bold text-white tracking-tight tabular-nums">
              {isDecimal ? displayValue.toFixed(1) : Math.round(displayValue)}
            </span>
            {suffix && (
              <span className={`text-base font-bold font-heading ${colorStyles.accent}`}>
                {suffix}
              </span>
            )}
          </div>
          {changeText && (
            <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>{changeText}</span>
            </div>
          )}
        </div>

        <motion.div
          whileHover={{ scale: 1.1, rotate: 6 }}
          className={`p-2.5 rounded-lg border ${colorStyles.iconBg} transition-transform duration-200`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Subtle bottom supporting indicator */}
      <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400">
        <span>CineCore Verified</span>
        <span className={`font-mono ${colorStyles.accent}`}>Collection Metric</span>
      </div>
    </motion.div>
  );
};
