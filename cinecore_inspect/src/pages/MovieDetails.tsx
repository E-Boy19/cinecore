import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  DollarSign,
  Clapperboard,
  Building,
  Edit2,
  Trash2,
  Users,
  ExternalLink
} from 'lucide-react';
import { Movie, Director, Producer, Actor, PageId } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  director?: Director;
  producer?: Producer;
  cast: { actor: Actor; role?: string }[];
  onBack: () => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onSelectActor?: (actorId: string) => void;
  onNavigate?: (page: PageId) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  director,
  producer,
  cast,
  onBack,
  onEdit,
  onDelete,
  onSelectActor,
  onNavigate
}) => {
  const isHollywood = movie.FilmIndustry === 'Hollywood';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-16"
    >
      {/* Top Navigation & Action Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Library</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onEdit(movie)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Movie</span>
          </button>

          <button
            onClick={() => onDelete(movie)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-xs font-medium text-rose-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Movie</span>
          </button>
        </div>
      </div>

      {/* Large Cinematic Hero Showcase */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden tech-bracket-top-left tech-bracket-bottom-right">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 font-semibold">
                {movie.ReleaseDate.slice(0, 4)}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase font-semibold ${
                  isHollywood
                    ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                    : 'bg-amber-950/70 border border-amber-500/40 text-amber-300'
                }`}
              >
                {movie.FilmIndustry}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {movie.Genre}
              </span>
            </div>

            {/* Movie Title */}
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              {movie.Name}
            </h1>

            {/* Synopsis */}
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {movie.Synopsis || 'A celebrated cinematic feature cataloged in your CineCore library collection.'}
            </p>

            {/* Meta Row: Release, Duration, BoxOffice */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Released: {movie.ReleaseDate}</span>
              </div>

              {movie.Duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{movie.Duration}</span>
                </div>
              )}

              {movie.BoxOffice && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Box Office: <strong className="text-emerald-300">{movie.BoxOffice}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Rating Card & Studio Highlight */}
          <div className="lg:col-span-4 space-y-4">
            {/* Rating Callout */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                AUDIENCE & CRITIC RATING
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                <span className="text-4xl font-heading font-bold text-amber-300 tabular-nums">
                  {movie.IMDbRating.toFixed(1)}
                </span>
                <span className="text-sm font-mono text-slate-400">/ 10</span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${(movie.IMDbRating / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Director & Production Studio Cards */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clapperboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Director</span>
                </div>
                <div className="font-semibold text-white text-right">
                  {director?.Name || 'Unknown Director'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400">
                  <Building className="w-3.5 h-3.5 text-purple-400" />
                  <span>Production Studio</span>
                </div>
                <div className="font-semibold text-white text-right">
                  {producer?.CompanyName || 'Independent Studio'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section with sequential animation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Users className="w-3.5 h-3.5" />
              <span>STARRING CAST</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-white mt-0.5">
              Cast & Performers ({cast.length})
            </h2>
          </div>

          <button
            onClick={() => onNavigate?.('actors')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Actors</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {cast.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 font-mono">
            No cast members assigned yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cast.map((item, idx) => (
              <motion.div
                key={item.actor.AID}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="group p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all cursor-pointer"
                onClick={() => onSelectActor?.(item.actor.AID)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {item.actor.Name}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Age {item.actor.Age}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Character:</span>
                  <span className="font-medium text-slate-200 truncate max-w-[150px] text-right">
                    {item.role || 'Principal Cast'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};
