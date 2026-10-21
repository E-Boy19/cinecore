import React from 'react';
import { motion } from 'motion/react';
import {
  Film,
  Users,
  Video,
  Building2,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Movie, Director, Producer, PageId } from '../types';
import { StatCard } from '../components/StatCard';
import { HeroHoloOrb } from '../components/HeroHoloOrb';
import { MovieCard } from '../components/MovieCard';

interface DashboardProps {
  movies: Movie[];
  actorCount: number;
  directors: Director[];
  producers: Producer[];
  onNavigate: (page: PageId) => void;
  onSelectMovie: (movieId: string) => void;
  onOpenAddModal: () => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  movies,
  actorCount,
  directors,
  producers,
  onNavigate,
  onSelectMovie,
  onOpenAddModal,
  onEditMovie,
  onDeleteMovie
}) => {
  const totalMovies = movies.length;
  const avgRating = totalMovies > 0
    ? movies.reduce((acc, m) => acc + m.IMDbRating, 0) / totalMovies
    : 0;

  // Top 4 highest rated movies
  const topRated = [...movies]
    .sort((a, b) => b.IMDbRating - a.IMDbRating)
    .slice(0, 4);

  // Latest 4 releases
  const recentReleases = [...movies]
    .sort((a, b) => new Date(b.ReleaseDate).getTime() - new Date(a.ReleaseDate).getTime())
    .slice(0, 4);

  const getDirectorName = (did: string) =>
    directors.find((d) => d.DID.toLowerCase() === did.toLowerCase())?.Name || 'Unknown Director';

  const getProducerName = (pid: string) =>
    producers.find((p) => p.PID.toLowerCase() === pid.toLowerCase())?.CompanyName || 'Independent Studio';

  return (
    <div className="space-y-10 pb-12">
      {/* 3D Hero Section */}
      <section className="relative rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950 border border-cyan-500/20 shadow-2xl overflow-hidden tech-bracket-top-left tech-bracket-bottom-right">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>COLLECTION ACTIVE & READY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-[1.1]">
              YOUR CINEMATIC
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                MOVIE LIBRARY
              </span>
            </h1>

            <p className="mt-4 text-sm text-slate-300 max-w-xl leading-relaxed">
              Explore, manage, and analyze your movie collection. Seamlessly organize titles, discover star performers, and review directors and studio releases.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ADD MOVIE</span>
              </button>

              <button
                onClick={() => onNavigate('movies')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-medium border border-slate-700 hover:border-cyan-500/40 transition-all"
              >
                <Film className="w-4 h-4 text-cyan-400" />
                <span>EXPLORE MOVIES ({totalMovies})</span>
              </button>

              <button
                onClick={() => onNavigate('insights')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-900 text-xs font-medium transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>VIEW INSIGHTS</span>
              </button>
            </div>
          </div>

          {/* Hero Right 3D Orb */}
          <div className="lg:col-span-5 p-4 flex items-center justify-center">
            <HeroHoloOrb movieCount={totalMovies} ratingAvg={avgRating} />
          </div>
        </div>
      </section>

      {/* 5 Animated Stat Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px]">COLLECTION OVERVIEW</span>
          <span className="text-cyan-400 font-mono">5 KEY METRICS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Movies"
            value={totalMovies}
            icon={Film}
            colorScheme="cyan"
            changeText="Movies in your library"
            index={0}
          />
          <StatCard
            label="Total Actors"
            value={actorCount}
            icon={Users}
            colorScheme="neon-blue"
            changeText="Cast across titles"
            index={1}
          />
          <StatCard
            label="Total Directors"
            value={directors.length}
            icon={Video}
            colorScheme="violet"
            changeText="Visionary directors"
            index={2}
          />
          <StatCard
            label="Total Producers"
            value={producers.length}
            icon={Building2}
            colorScheme="neon-blue"
            changeText="Production studios"
            index={3}
          />
          <StatCard
            label="Average IMDb Rating"
            value={avgRating}
            isDecimal={true}
            suffix="/10"
            icon={Star}
            colorScheme="amber"
            changeText="Audience rating score"
            index={4}
          />
        </div>
      </section>

      {/* Hall of Fame / Highest Rated Highlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>CRITICS' CHOICE // TOP RATED</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-white mt-0.5">
              Highest Rated Movies
            </h2>
          </div>

          <button
            onClick={() => onNavigate('movies')}
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topRated.map((movie, idx) => (
            <MovieCard
              key={movie.MID}
              movie={movie}
              directorName={getDirectorName(movie.DID)}
              producerName={getProducerName(movie.PID)}
              onSelect={onSelectMovie}
              onEdit={onEditMovie}
              onDelete={onDeleteMovie}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* Recent Releases / Timeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>RECENT RELEASES</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-white mt-0.5">
              Latest Additions
            </h2>
          </div>

          <button
            onClick={() => onNavigate('movies')}
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Browse Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentReleases.map((movie, idx) => (
            <MovieCard
              key={movie.MID}
              movie={movie}
              directorName={getDirectorName(movie.DID)}
              producerName={getProducerName(movie.PID)}
              onSelect={onSelectMovie}
              onEdit={onEditMovie}
              onDelete={onDeleteMovie}
              index={idx}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
