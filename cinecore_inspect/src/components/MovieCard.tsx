import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Film, Calendar, Clapperboard, Building, Eye, Edit2, Trash2 } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  directorName?: string;
  producerName?: string;
  onSelect: (movieId: string) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  directorName = 'Unknown Director',
  producerName = 'Independent',
  onSelect,
  onEdit,
  onDelete,
  index = 0
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // Curated cinematic gradient based on industry and genre
  const isHollywood = movie.FilmIndustry === 'Hollywood';
  const headerGradient = isHollywood
    ? 'from-blue-900/40 via-cyan-950/30 to-transparent'
    : 'from-amber-900/40 via-purple-950/30 to-transparent';

  const industryTagStyle = isHollywood
    ? 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30'
    : 'text-amber-400 bg-amber-950/80 border-amber-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.35s ease-out',
      }}
      className="group relative rounded-xl bg-slate-900/70 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-[0_12px_35px_-8px_rgba(6,182,212,0.22)] transition-all duration-300 flex flex-col justify-between overflow-hidden tech-bracket-top-left"
    >
      {/* Top Atmospheric Gradient Banner */}
      <div className={`h-24 w-full bg-gradient-to-b ${headerGradient} relative p-4 flex flex-col justify-between`}>
        {/* Year & Industry */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-slate-300 font-semibold px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
            {movie.ReleaseDate.slice(0, 4)}
          </span>
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${industryTagStyle}`}>
            {movie.FilmIndustry}
          </span>
        </div>

        {/* Floating IMDb Rating Badge with Glow */}
        <div className="self-end flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-heading font-bold text-amber-300 tabular-nums">
            {movie.IMDbRating.toFixed(1)}
          </span>
          <span className="text-[10px] font-mono text-slate-400">/ 10</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Movie Title */}
          <h3
            onClick={() => onSelect(movie.MID)}
            className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1 group-hover:translate-x-0.5 duration-200"
          >
            {movie.Name}
          </h3>

          {/* Genre & Duration */}
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="truncate">{movie.Genre}</span>
            {movie.Duration && (
              <>
                <span className="text-slate-600">·</span>
                <span className="shrink-0 font-mono text-[11px] text-slate-400">{movie.Duration}</span>
              </>
            )}
          </div>

          {/* Technical Metadata Grid */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clapperboard className="w-3 h-3 text-cyan-400" /> Director
              </span>
              <span className="font-medium text-slate-200 truncate max-w-[130px] text-right">
                {directorName}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Building className="w-3 h-3 text-purple-400" /> Studio
              </span>
              <span className="font-medium text-slate-200 truncate max-w-[130px] text-right">
                {producerName}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Calendar className="w-3 h-3 text-slate-400" /> Released
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                {movie.ReleaseDate}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect(movie.MID)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-950/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-cyan-400 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onEdit(movie)}
            className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Edit Movie"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(movie)}
            className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Movie"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
