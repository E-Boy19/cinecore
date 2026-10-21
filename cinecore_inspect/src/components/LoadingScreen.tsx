import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const steps = [
    'INITIALIZING CINECORE...',
    'LOADING MOVIE COLLECTION (36 TITLES)...',
    'PREPARING DIRECTORS & CAST PROFILES...',
    'COLLECTION READY // WELCOME TO CINECORE'
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgress(45);
    }, 450);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgress(78);
    }, 950);

    const timer3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgress(100);
    }, 1450);

    const timerFinal = setTimeout(() => {
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinal);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 bg-[#07090e] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Glowing circular element */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed"
          />

          {/* Middle counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-t-2 border-r-2 border-cyan-400 border-b-transparent border-l-transparent"
          />

          {/* Inner core pulse */}
          <div className="w-14 h-14 rounded-full bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_25px_#06b6d4] flex items-center justify-center">
            <Film className="w-6 h-6 text-cyan-300 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="mt-8">
          <h1 className="text-xl font-heading font-bold text-white tracking-widest">
            CINECORE
          </h1>
          <p className="mt-1 text-[11px] font-mono text-cyan-400 tracking-wider">
            CINEMATIC MANAGEMENT SUITE
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-6 h-1 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_#06b6d4]"
            initial={{ width: '10%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        {/* Step message */}
        <div className="mt-4 h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-mono text-slate-300 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{steps[currentStepIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Skip button for fast-track */}
        <button
          onClick={onComplete}
          className="mt-8 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider underline underline-offset-4"
        >
          [ Skip Intro ]
        </button>
      </div>
    </motion.div>
  );
};
