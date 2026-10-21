import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, PieChart, Star, Clapperboard, Award } from 'lucide-react';
import { Movie } from '../types';

interface InsightsProps {
  movies: Movie[];
}

export const Statistics: React.FC<InsightsProps> = ({ movies }) => {
  const total = movies.length;

  // 1. Movies by Industry
  const industryStats = useMemo(() => {
    const hollywood = movies.filter((m) => m.FilmIndustry === 'Hollywood').length;
    const bollywood = movies.filter((m) => m.FilmIndustry === 'Bollywood').length;
    const hwAvg = hollywood > 0
      ? movies.filter((m) => m.FilmIndustry === 'Hollywood').reduce((a, b) => a + b.IMDbRating, 0) / hollywood
      : 0;
    const bwAvg = bollywood > 0
      ? movies.filter((m) => m.FilmIndustry === 'Bollywood').reduce((a, b) => a + b.IMDbRating, 0) / bollywood
      : 0;

    return { hollywood, bollywood, hwAvg, bwAvg };
  }, [movies]);

  // 2. Movies by Genre
  const genreStats = useMemo(() => {
    const map: Record<string, number> = {};
    movies.forEach((m) => {
      m.Genre.split('/').forEach((g) => {
        const clean = g.trim();
        map[clean] = (map[clean] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [movies]);

  // 3. Rating Distribution
  const ratingDist = useMemo(() => {
    const brackets = [
      { label: '8.5 - 10.0 (Masterpieces)', min: 8.5, max: 10, count: 0, color: 'bg-amber-400' },
      { label: '8.0 - 8.4 (Great)', min: 8.0, max: 8.49, count: 0, color: 'bg-cyan-400' },
      { label: '7.5 - 7.9 (Good)', min: 7.5, max: 7.99, count: 0, color: 'bg-blue-400' },
      { label: '7.0 - 7.4 (Above Average)', min: 7.0, max: 7.49, count: 0, color: 'bg-indigo-400' },
      { label: 'Under 7.0', min: 0, max: 6.99, count: 0, color: 'bg-slate-500' },
    ];

    movies.forEach((m) => {
      for (const b of brackets) {
        if (m.IMDbRating >= b.min && m.IMDbRating <= b.max) {
          b.count++;
          break;
        }
      }
    });

    return brackets;
  }, [movies]);

  // 4. Decades distribution
  const decadeStats = useMemo(() => {
    const decades: Record<string, number> = {
      '1980s': 0,
      '1990s': 0,
      '2000s': 0,
      '2010s': 0,
      '2020s': 0,
    };

    movies.forEach((m) => {
      const year = parseInt(m.ReleaseDate.slice(0, 4), 10);
      if (year < 1990) decades['1980s']++;
      else if (year < 2000) decades['1990s']++;
      else if (year < 2010) decades['2000s']++;
      else if (year < 2020) decades['2010s']++;
      else decades['2020s']++;
    });

    return Object.entries(decades).map(([decade, count]) => ({ decade, count }));
  }, [movies]);

  // 5. Top 5 Movies
  const topMovies = useMemo(() => {
    return [...movies].sort((a, b) => b.IMDbRating - a.IMDbRating).slice(0, 5);
  }, [movies]);

  const maxGenreCount = Math.max(...genreStats.map((g) => g.count), 1);
  const maxDecadeCount = Math.max(...decadeStats.map((d) => d.count), 1);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md tech-bracket-top-left">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <BarChart3 className="w-4 h-4" />
          <span>LIBRARY INSIGHTS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
          INSIGHTS
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Visual overview of genres, industry shares, ratings, and release eras across your library.
        </p>
      </div>

      {/* Grid Row 1: Movies by Industry & Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movies by Industry */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 tech-bracket-top-left">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Movies by Industry</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{total} Movies Total</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Hollywood */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
              <div className="text-xs font-semibold text-cyan-300">
                Hollywood
              </div>
              <div className="text-2xl font-heading font-bold text-white tabular-nums">
                {industryStats.hollywood} <span className="text-xs text-slate-400 font-sans">({total > 0 ? Math.round((industryStats.hollywood / total) * 100) : 0}%)</span>
              </div>
              <div className="text-xs text-cyan-400">
                Avg Rating: ★ {industryStats.hwAvg.toFixed(1)}
              </div>
            </div>

            {/* Bollywood */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
              <div className="text-xs font-semibold text-amber-300">
                Bollywood
              </div>
              <div className="text-2xl font-heading font-bold text-white tabular-nums">
                {industryStats.bollywood} <span className="text-xs text-slate-400 font-sans">({total > 0 ? Math.round((industryStats.bollywood / total) * 100) : 0}%)</span>
              </div>
              <div className="text-xs text-amber-400">
                Avg Rating: ★ {industryStats.bwAvg.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Combined Visual Bar */}
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(industryStats.hollywood / total) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-cyan-500"
              title="Hollywood"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(industryStats.bollywood / total) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-amber-500"
              title="Bollywood"
            />
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Rating Distribution</span>
            </h3>
            <span className="text-xs text-slate-400">Audience Consensus</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {ratingDist.map((item) => {
              const pct = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-400 font-mono tabular-nums">
                      {item.count} movies ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Movies by Genre & Movies by Release Year */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movies by Genre */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-purple-400" />
              <span>Movies by Genre</span>
            </h3>
            <span className="text-xs text-slate-400">Top Categories</span>
          </div>

          <div className="space-y-3 pt-2">
            {genreStats.map((item, idx) => {
              const widthPct = (item.count / maxGenreCount) * 100;
              return (
                <div key={item.genre} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-200">{item.genre}</span>
                    <span className="font-mono text-cyan-400 font-bold tabular-nums">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Movies by Release Year / Decade */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Movies by Release Year</span>
            </h3>
            <span className="text-xs text-slate-400">1980s to 2020s</span>
          </div>

          <div className="space-y-3 pt-2">
            {decadeStats.map((item, idx) => {
              const widthPct = (item.count / maxDecadeCount) * 100;
              return (
                <div key={item.decade} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.decade}</span>
                    <span className="text-emerald-400 font-mono font-bold tabular-nums">
                      {item.count} movies
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Rated Movies */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Top Rated Movies</span>
          </h3>
          <span className="text-xs font-mono text-amber-400">LEADERBOARD</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {topMovies.map((movie, idx) => (
            <div
              key={movie.MID}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-cyan-400 font-bold">#{idx + 1}</span>
                <span>{movie.ReleaseDate.slice(0, 4)}</span>
              </div>
              <div className="font-heading font-bold text-sm text-white truncate">
                {movie.Name}
              </div>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{movie.IMDbRating.toFixed(1)} / 10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Insights = Statistics;
