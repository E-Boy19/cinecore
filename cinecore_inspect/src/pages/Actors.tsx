import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, Film, Star, X, ChevronRight } from 'lucide-react';
import { Actor, Movie } from '../types';

interface ActorsProps {
  actors: Actor[];
  movies: Movie[];
  movieActors: { MID: string; AID: string; Role?: string }[];
  onSelectMovie: (movieId: string) => void;
}

export const Actors: React.FC<ActorsProps> = ({
  actors,
  movies,
  movieActors,
  onSelectMovie
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  const filteredActors = useMemo(() => {
    if (!searchQuery.trim()) return actors;
    const q = searchQuery.toLowerCase().trim();
    return actors.filter((a) => a.Name.toLowerCase().includes(q));
  }, [actors, searchQuery]);

  // Map movies for an actor
  const getActorFilmography = (actorId: string): { movie: Movie; role?: string }[] => {
    const junctions = movieActors.filter(
      (ma) => ma.AID.toLowerCase() === actorId.toLowerCase()
    );
    return junctions.flatMap((j) => {
      const movie = movies.find((m) => m.MID.toLowerCase() === j.MID.toLowerCase());
      return movie ? [{ movie, role: j.Role }] : [];
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md tech-bracket-top-left">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <Users className="w-4 h-4" />
            <span>CAST DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
            ACTORS
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Discover star performers and their filmographies across your movie collection.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actors by name..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Actors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredActors.map((actor, idx) => {
          const filmography = getActorFilmography(actor.AID);
          return (
            <motion.div
              key={actor.AID}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
              onClick={() => setSelectedActor(actor)}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="group p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 hover:shadow-[0_8px_25px_-5px_rgba(168,85,247,0.2)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-300 font-medium">
                    {actor.Gender}
                  </span>
                  <span className="text-xs text-slate-400">
                    Age {actor.Age}
                  </span>
                </div>

                <h3 className="text-base font-heading font-bold text-white group-hover:text-purple-300 transition-colors mt-2">
                  {actor.Name}
                </h3>

                {actor.Bio && (
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {actor.Bio}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Film className="w-3 h-3 text-cyan-400" />
                  {filmography.length} Featured Movies
                </span>
                <span className="text-purple-400 text-xs font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actor Portfolio Drawer / Modal */}
      <AnimatePresence>
        {selectedActor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActor(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-slate-950 rounded-2xl border border-purple-500/30 p-6 shadow-2xl z-10 tech-bracket-top-left"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">
                    ACTOR PROFILE
                  </span>
                  <h2 className="text-2xl font-heading font-bold text-white mt-0.5">
                    {selectedActor.Name}
                  </h2>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    Age {selectedActor.Age} · {selectedActor.Gender}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedActor(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedActor.Bio && (
                <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                  {selectedActor.Bio}
                </p>
              )}

              {/* Filmography List */}
              <div className="mt-5 space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
                  <span>FILMOGRAPHY</span>
                  <span className="text-cyan-400">
                    {getActorFilmography(selectedActor.AID).length} MOVIES
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {getActorFilmography(selectedActor.AID).map(({ movie, role }) => (
                    <div
                      key={movie.MID}
                      onClick={() => {
                        setSelectedActor(null);
                        onSelectMovie(movie.MID);
                      }}
                      className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {movie.Name}
                        </div>
                        {role && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Character: <span className="text-slate-200">{role}</span>
                          </div>
                        )}
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
