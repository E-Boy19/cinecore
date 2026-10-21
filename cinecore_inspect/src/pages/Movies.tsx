import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  X,
  RotateCcw
} from 'lucide-react';
import { Movie, Director, Producer, FilmIndustry } from '../types';
import { MovieCard } from '../components/MovieCard';
import { MovieTable } from '../components/MovieTable';

interface MoviesProps {
  movies: Movie[];
  directors: Director[];
  producers: Producer[];
  onSelectMovie: (movieId: string) => void;
  onOpenAddModal: () => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
}

export const Movies: React.FC<MoviesProps> = ({
  movies,
  directors,
  producers,
  onSelectMovie,
  onOpenAddModal,
  onEditMovie,
  onDeleteMovie
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState<FilmIndustry | 'ALL'>('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('rating-desc');

  // Extract unique genres for filter
  const genres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      m.Genre.split('/').forEach((g) => set.add(g.trim()));
    });
    return Array.from(set).sort();
  }, [movies]);

  // Filter & sort logic
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.Name.toLowerCase().includes(q) ||
          m.Genre.toLowerCase().includes(q)
      );
    }

    if (selectedIndustry !== 'ALL') {
      result = result.filter((m) => m.FilmIndustry === selectedIndustry);
    }

    if (selectedGenre !== 'ALL') {
      result = result.filter((m) =>
        m.Genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    if (minRating > 0) {
      result = result.filter((m) => m.IMDbRating >= minRating);
    }

    switch (sortBy) {
      case 'rating-desc':
        result.sort((a, b) => b.IMDbRating - a.IMDbRating);
        break;
      case 'rating-asc':
        result.sort((a, b) => a.IMDbRating - b.IMDbRating);
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.ReleaseDate).getTime() - new Date(a.ReleaseDate).getTime());
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.ReleaseDate).getTime() - new Date(b.ReleaseDate).getTime());
        break;
      case 'name-asc':
        result.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
    }

    return result;
  }, [movies, searchQuery, selectedIndustry, selectedGenre, minRating, sortBy]);

  const activeFilterCount =
    (selectedGenre !== 'ALL' ? 1 : 0) +
    (selectedIndustry !== 'ALL' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('ALL');
    setSelectedIndustry('ALL');
    setMinRating(0);
    setSortBy('rating-desc');
  };

  const getDirectorName = (did: string) =>
    directors.find((d) => d.DID.toLowerCase() === did.toLowerCase())?.Name || 'Unknown Director';

  const getProducerName = (pid: string) =>
    producers.find((p) => p.PID.toLowerCase() === pid.toLowerCase())?.CompanyName || 'Independent Studio';

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md tech-bracket-top-left">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Film className="w-4 h-4" />
            <span>MOVIE COLLECTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
            MOVIE LIBRARY
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage and explore your movie collection with search, genre categories, and industry filters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ADD MOVIE</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value as any)}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Industries</option>
              <option value="Hollywood">Hollywood</option>
              <option value="Bollywood">Bollywood</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 focus:outline-none font-mono"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
              <option value="date-desc">Newest Releases</option>
              <option value="date-asc">Oldest Releases</option>
              <option value="name-asc">A–Z</option>
              <option value="name-desc">Z–A</option>
            </select>
          </div>
        </div>

        {/* Second Row: Active Filter Pills & View Mode Switcher */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Filter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Showing <strong className="text-cyan-400 font-mono">{filteredMovies.length}</strong> of {movies.length} movies
            </span>

            <AnimatePresence>
              {selectedIndustry !== 'ALL' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSelectedIndustry('ALL')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono"
                >
                  <span>Industry: {selectedIndustry}</span>
                  <X className="w-3 h-3 text-cyan-400" />
                </motion.button>
              )}

              {selectedGenre !== 'ALL' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSelectedGenre('ALL')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono"
                >
                  <span>Genre: {selectedGenre}</span>
                  <X className="w-3 h-3 text-purple-400" />
                </motion.button>
              )}

              {searchQuery.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono"
                >
                  <span>Query: "{searchQuery}"</span>
                  <X className="w-3 h-3 text-blue-400" />
                </motion.button>
              )}

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 underline underline-offset-2 ml-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Grid vs Table Toggle */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movie Results View */}
      {filteredMovies.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Film className="w-10 h-10 text-slate-600 mx-auto stroke-[1.5]" />
          <h3 className="mt-3 text-base font-heading font-bold text-white">
            NO MATCHING MOVIES FOUND
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search terms, genre or industry filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-xs text-cyan-400 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMovies.map((movie, idx) => (
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
      ) : (
        <MovieTable
          movies={filteredMovies}
          directors={directors}
          producers={producers}
          onSelect={onSelectMovie}
          onEdit={onEditMovie}
          onDelete={onDeleteMovie}
          sortBy={sortBy}
          onToggleSort={(field) => {
            if (field === 'rating') {
              setSortBy(sortBy === 'rating-desc' ? 'rating-asc' : 'rating-desc');
            } else if (field === 'date') {
              setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc');
            } else if (field === 'name') {
              setSortBy(sortBy === 'name-asc' ? 'name-desc' : 'name-asc');
            }
          }}
        />
      )}
    </div>
  );
};
