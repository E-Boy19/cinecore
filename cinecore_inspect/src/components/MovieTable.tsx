import React from 'react';
import { Star, Eye, Edit2, Trash2, ArrowUpDown, Clapperboard, Building } from 'lucide-react';
import { Movie, Director, Producer } from '../types';

interface MovieTableProps {
  movies: Movie[];
  directors: Director[];
  producers: Producer[];
  onSelect: (movieId: string) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  sortBy?: string;
  onToggleSort?: (field: 'rating' | 'date' | 'name') => void;
}

export const MovieTable: React.FC<MovieTableProps> = ({
  movies,
  directors,
  producers,
  onSelect,
  onEdit,
  onDelete,
  sortBy,
  onToggleSort
}) => {
  const getDirectorName = (did: string) =>
    directors.find((d) => d.DID.toLowerCase() === did.toLowerCase())?.Name || 'Unknown Director';

  const getProducerCompany = (pid: string) =>
    producers.find((p) => p.PID.toLowerCase() === pid.toLowerCase())?.CompanyName || 'Independent Studio';

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono uppercase text-slate-400">
            <th
              className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
              onClick={() => onToggleSort?.('name')}
            >
              <div className="flex items-center gap-1.5">
                <span>Movie Title</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th className="py-3 px-4 font-semibold">Genre</th>
            <th className="py-3 px-4 font-semibold">Industry</th>
            <th
              className="py-3 px-4 font-semibold cursor-pointer hover:text-white text-right"
              onClick={() => onToggleSort?.('rating')}
            >
              <div className="flex items-center justify-end gap-1.5">
                <span>IMDb Rating</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th className="py-3 px-4 font-semibold">Director</th>
            <th className="py-3 px-4 font-semibold">Production Company</th>
            <th
              className="py-3 px-4 font-semibold cursor-pointer hover:text-white text-right"
              onClick={() => onToggleSort?.('date')}
            >
              <div className="flex items-center justify-end gap-1.5">
                <span>Released</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th className="py-3 px-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {movies.map((m) => {
            const isHollywood = m.FilmIndustry === 'Hollywood';
            return (
              <tr
                key={m.MID}
                className="group hover:bg-slate-900/50 transition-colors cursor-pointer"
              >
                {/* Movie Title */}
                <td onClick={() => onSelect(m.MID)} className="py-3.5 px-4 font-medium text-white max-w-[220px]">
                  <div className="truncate group-hover:text-cyan-400 transition-colors font-semibold text-sm">
                    {m.Name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {m.ReleaseDate.slice(0, 4)}
                  </div>
                </td>

                {/* Genre */}
                <td onClick={() => onSelect(m.MID)} className="py-3.5 px-4 text-slate-300 max-w-[170px] truncate">
                  {m.Genre}
                </td>

                {/* Industry */}
                <td onClick={() => onSelect(m.MID)} className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      isHollywood
                        ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/20'
                        : 'text-amber-400 bg-amber-950/60 border border-amber-500/20'
                    }`}
                  >
                    {m.FilmIndustry}
                  </span>
                </td>

                {/* IMDb Rating */}
                <td onClick={() => onSelect(m.MID)} className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{m.IMDbRating.toFixed(1)}</span>
                  </div>
                </td>

                {/* Director */}
                <td onClick={() => onSelect(m.MID)} className="py-3.5 px-4 text-slate-200 max-w-[160px] truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <Clapperboard className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" />
                    <span className="truncate">{getDirectorName(m.DID)}</span>
                  </div>
                </td>

                {/* Producer Company */}
                <td onClick={() => onSelect(m.MID)} className="py-3.5 px-4 text-slate-200 max-w-[160px] truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-purple-500/70 shrink-0" />
                    <span className="truncate">{getProducerCompany(m.PID)}</span>
                  </div>
                </td>

                {/* Release Date */}
                <td
                  onClick={() => onSelect(m.MID)}
                  className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-300 whitespace-nowrap"
                >
                  {m.ReleaseDate}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(m.MID);
                      }}
                      className="p-1.5 rounded-md hover:bg-cyan-950/60 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(m);
                      }}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Edit Movie"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(m);
                      }}
                      className="p-1.5 rounded-md hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove Movie"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
