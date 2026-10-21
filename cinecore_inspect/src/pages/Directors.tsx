import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Film, Star, X, ChevronRight } from 'lucide-react';
import { Director, Movie } from '../types';

interface DirectorsProps {
  directors: Director[];
  movies: Movie[];
  onSelectMovie: (movieId: string) => void;
}

export const Directors: React.FC<DirectorsProps> = ({
  directors,
  movies,
  onSelectMovie
}) => {
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

  const getDirectorMovies = (did: string) =>
    movies.filter((m) => m.DID.toLowerCase() === did.toLowerCase());

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md tech-bracket-top-left">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Video className="w-4 h-4" />
          <span>FILMMAKERS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
          DIRECTORS
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Visionary filmmakers and their cinematic portfolios across your movie collection.
        </p>
      </div>

      {/* Directors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {directors.map((director, idx) => {
          const portfolio = getDirectorMovies(director.DID);
          const avgScore = portfolio.length > 0
            ? portfolio.reduce((a, b) => a + b.IMDbRating, 0) / portfolio.length
            : 0;

          return (
            <motion.div
              key={director.DID}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
              onClick={() => setSelectedDirector(director)}
              whileHover={{ y: -3 }}
              className="group p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_8px_25px_-5px_rgba(6,182,212,0.2)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-400 font-medium">
                    Filmmaker
                  </span>
                  <span className="text-xs text-slate-400">
                    Age {director.Age}
                  </span>
                </div>

                <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors mt-2">
                  {director.Name}
                </h3>

                {director.Style && (
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {director.Style}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Film className="w-3 h-3 text-cyan-400" />
                  {portfolio.length} Films (avg ★ {avgScore.toFixed(1)})
                </span>
                <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Portfolio <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Director Detail Modal */}
      <AnimatePresence>
        {selectedDirector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDirector(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-slate-950 rounded-2xl border border-cyan-500/30 p-6 shadow-2xl z-10 tech-bracket-top-left"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    DIRECTOR PORTFOLIO
                  </span>
                  <h2 className="text-2xl font-heading font-bold text-white mt-0.5">
                    {selectedDirector.Name}
                  </h2>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    Age {selectedDirector.Age} · {selectedDirector.Style}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDirector(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-5 space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
                  <span>DIRECTED TITLES</span>
                  <span className="text-cyan-400">
                    {getDirectorMovies(selectedDirector.DID).length} TITLES
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {getDirectorMovies(selectedDirector.DID).map((movie) => (
                    <div
                      key={movie.MID}
                      onClick={() => {
                        setSelectedDirector(null);
                        onSelectMovie(movie.MID);
                      }}
                      className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {movie.Name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {movie.Genre} · {movie.ReleaseDate.slice(0, 4)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-300">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{movie.IMDbRating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
