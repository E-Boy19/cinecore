import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Plus,
  SlidersHorizontal,
  Film,
  User,
  X,
  ExternalLink,
  ChevronRight,
  Clapperboard,
  Video
} from 'lucide-react';
import { PageId, Movie, Actor, Director } from '../types';
import { movieService } from '../services/movieService';
import { actorService } from '../services/actorService';
import { directorService } from '../services/directorService';
import { auditService } from '../services/auditService';

interface TopBarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenAddModal: () => void;
  onSelectMovie: (movieId: string) => void;
  selectedMovieName?: string;
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigate,
  onOpenAddModal,
  onSelectMovie,
  selectedMovieName,
  isMobileSidebarOpen,
  onToggleMobileSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    movies: Movie[];
    actors: Actor[];
    directors: Director[];
  }>({ movies: [], actors: [], directors: [] });
  const [hasSearched, setHasSearched] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const notifContainerRef = useRef<HTMLDivElement | null>(null);

  // Close search and notification dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch recent activity
  useEffect(() => {
    auditService.getAuditLogs().then((logs) => {
      setRecentAudits(logs.slice(0, 5));
    });
  }, [currentPage, isNotificationsOpen]);

  // Live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ movies: [], actors: [], directors: [] });
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      const q = searchQuery.toLowerCase();
      const [movies, actors, directors] = await Promise.all([
        movieService.getMovies({ searchQuery }),
        actorService.getActors(),
        directorService.getDirectors()
      ]);

      const matchedActors = actors.filter((a) => a.Name.toLowerCase().includes(q)).slice(0, 3);
      const matchedDirectors = directors.filter((d) => d.Name.toLowerCase().includes(q)).slice(0, 3);

      setSearchResults({
        movies: movies.slice(0, 5),
        actors: matchedActors,
        directors: matchedDirectors
      });
      setHasSearched(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pageTitles: Record<PageId, string> = {
    dashboard: 'Dashboard Overview',
    movies: 'Movie Library',
    'movie-detail': selectedMovieName || 'Movie Details',
    actors: 'Actors',
    directors: 'Directors',
    producers: 'Production Studios',
    insights: 'Insights & Trends',
    activity: 'Library Activity',
  };

  const getActionBadge = (actionType: string) => {
    if (actionType === 'INSERT') {
      return { label: 'Added', className: 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' };
    }
    if (actionType === 'UPDATE') {
      return { label: 'Updated', className: 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' };
    }
    return { label: 'Removed', className: 'bg-rose-950 text-rose-400 border border-rose-500/30' };
  };

  return (
    <header className="sticky top-0 z-20 h-16 w-full glass-panel border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          title="Toggle Navigation"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap hidden sm:inline"
          >
            CineCore
          </button>
          <span className="hidden sm:inline">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </span>
          <span className="text-white font-medium truncate text-sm">
            {pageTitles[currentPage]}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
        <div
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border transition-all duration-200 ${
            isSearchFocused
              ? 'border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] bg-slate-950'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search movies, cast, directors... (Ctrl+K)"
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Live Search Popup */}
        {isSearchFocused && hasSearched && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 max-h-[380px] overflow-y-auto z-50 tech-bracket-bottom-right">
            {searchResults.movies.length === 0 &&
            searchResults.actors.length === 0 &&
            searchResults.directors.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching movies or people found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-3">
                {/* Movies Section */}
                {searchResults.movies.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-mono uppercase text-cyan-400 flex items-center justify-between">
                      <span>Movies ({searchResults.movies.length})</span>
                      <Film className="w-3 h-3" />
                    </div>
                    {searchResults.movies.map((m) => (
                      <button
                        key={m.MID}
                        onClick={() => {
                          onSelectMovie(m.MID);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-cyan-950/40 text-xs text-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate font-medium">{m.Name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({m.ReleaseDate.slice(0, 4)})
                          </span>
                          <span className="text-[10px] text-slate-500 hidden sm:inline">
                            · {m.Genre}
                          </span>
                        </div>
                        <span className="text-amber-400 font-mono text-[11px] font-semibold shrink-0 ml-2">
                          ★ {m.IMDbRating.toFixed(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Actors Section */}
                {searchResults.actors.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase text-purple-400 flex items-center justify-between">
                      <span>Actors ({searchResults.actors.length})</span>
                      <User className="w-3 h-3" />
                    </div>
                    {searchResults.actors.map((a) => (
                      <button
                        key={a.AID}
                        onClick={() => {
                          onNavigate('actors');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-purple-950/30 text-xs text-slate-200 transition-colors"
                      >
                        <span className="truncate font-medium">{a.Name}</span>
                        <span className="text-[10px] text-slate-400">Cast</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Directors Section */}
                {searchResults.directors.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase text-blue-400 flex items-center justify-between">
                      <span>Directors ({searchResults.directors.length})</span>
                      <Video className="w-3 h-3" />
                    </div>
                    {searchResults.directors.map((d) => (
                      <button
                        key={d.DID}
                        onClick={() => {
                          onNavigate('directors');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-blue-950/30 text-xs text-slate-200 transition-colors"
                      >
                        <span className="truncate font-medium">{d.Name}</span>
                        <span className="text-[10px] text-slate-400">Director</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick Add Movie CTA */}
        <button
          onClick={onOpenAddModal}
          className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline whitespace-nowrap">Add Movie</span>
        </button>

        {/* Notifications Popover */}
        <div ref={notifContainerRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Recent Activity"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-slate-950 animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 p-3 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">
                  RECENT ACTIVITY
                </span>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    onNavigate('activity');
                  }}
                  className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  View All <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {recentAudits.map((audit) => {
                  const badge = getActionBadge(audit.ActionType);
                  return (
                    <div
                      key={audit.AuditID}
                      className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200 truncate max-w-[170px]">
                          {audit.MovieName}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {audit.ActionTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Curator Profile */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clapperboard className="w-3.5 h-3.5" />
          </div>
          <div className="text-left text-xs">
            <div className="text-[11px] font-semibold text-slate-200 leading-tight">
              Library Curator
            </div>
            <div className="text-[10px] font-mono text-cyan-400/80">CineCore Studio</div>
          </div>
        </div>
      </div>
    </header>
  );
};
