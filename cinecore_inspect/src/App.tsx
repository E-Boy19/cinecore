import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PageId,
  Movie,
  Actor,
  Director,
  Producer,
  MovieActor,
  MovieAudit,
  ToastMessage
} from './types';
import { movieService } from './services/movieService';
import { actorService } from './services/actorService';
import { directorService } from './services/directorService';
import { producerService } from './services/producerService';
import { auditService } from './services/auditService';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BackgroundEffect } from './components/BackgroundEffect';
import { MovieModal } from './components/MovieModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ToastContainer } from './components/Toast';
import { LoadingScreen } from './components/LoadingScreen';

import { Dashboard } from './pages/Dashboard';
import { Movies } from './pages/Movies';
import { MovieDetails } from './pages/MovieDetails';
import { Actors } from './pages/Actors';
import { Directors } from './pages/Directors';
import { Producers } from './pages/Producers';
import { Statistics } from './pages/Statistics';
import { AuditLogs } from './pages/AuditLogs';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [movieActors, setMovieActors] = useState<MovieActor[]>([]);
  const [auditLogs, setAuditLogs] = useState<MovieAudit[]>([]);

  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      type: 'success' | 'warning' | 'error' | 'info',
      title: string,
      message?: string
    ) => {
      setToasts((prev) => [
        ...prev,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type,
          title,
          message,
          timestamp: Date.now()
        }
      ]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    const [movieList, actorList, directorList, producerList, movieActorList, auditList] =
      await Promise.all([
        movieService.getMovies(),
        actorService.getActors(),
        directorService.getDirectors(),
        producerService.getProducers(),
        actorService.getAllMovieActors(),
        auditService.getAuditLogs()
      ]);

    setMovies(movieList);
    setActors(actorList);
    setDirectors(directorList);
    setProducers(producerList);
    setMovieActors(movieActorList);
    setAuditLogs(auditList);
  }, []);

  useEffect(() => {
    refreshData().catch((error) => {
      addToast(
        'error',
        'Connection Failed',
        error?.message || 'Unable to load data from the backend.'
      );
    });
  }, [refreshData, addToast]);

  const handleSelectMovie = useCallback((movieId: string) => {
    setSelectedMovieId(movieId);
    setCurrentPage('movie-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingMovie(null);
    setIsMovieModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((movie: Movie) => {
    setEditingMovie(movie);
    setIsMovieModalOpen(true);
  }, []);

  const handleSaveMovie = async (
    movieData: Partial<Movie> & { actorIds: string[] }
  ) => {
    try {
      if (editingMovie) {
        await movieService.updateMovie(editingMovie.MID, movieData);
        addToast(
          'success',
          'Movie Updated Successfully',
          `Saved changes for "${movieData.Name || editingMovie.Name}"`
        );
      } else {
        const created = await movieService.createMovie(movieData as any);
        addToast(
          'success',
          'Movie Added Successfully',
          `Added "${created.Name}" to your movie library`
        );
      }

      await refreshData();
      setIsMovieModalOpen(false);
      setEditingMovie(null);
    } catch (error: any) {
      addToast(
        'error',
        'Operation Failed',
        error?.message || 'An error occurred while saving the movie.'
      );
      throw error;
    }
  };

  const handlePromptDelete = useCallback((movie: Movie) => {
    setMovieToDelete(movie);
  }, []);

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;

    setIsDeleting(true);

    try {
      await movieService.deleteMovie(movieToDelete.MID);
      await refreshData();

      addToast(
        'success',
        'Movie Removed Successfully',
        `Removed "${movieToDelete.Name}" from your collection`
      );

      if (selectedMovieId === movieToDelete.MID) {
        setCurrentPage('movies');
        setSelectedMovieId(null);
      }

      setMovieToDelete(null);
    } catch (error: any) {
      addToast(
        'error',
        'Removal Failed',
        error?.message || 'Unable to remove movie.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedMovie = selectedMovieId
    ? movies.find(
        (movie) =>
          movie.MID.toLowerCase() === selectedMovieId.toLowerCase()
      ) || null
    : null;

  const selectedMovieDirector = selectedMovie
    ? directors.find(
        (director) =>
          director.DID.toLowerCase() === selectedMovie.DID.toLowerCase()
      )
    : undefined;

  const selectedMovieProducer = selectedMovie
    ? producers.find(
        (producer) =>
          producer.PID.toLowerCase() === selectedMovie.PID.toLowerCase()
      )
    : undefined;

  const selectedMovieCast: { actor: Actor; role?: string }[] = selectedMovie
    ? movieActors
        .filter(
          (link) =>
            link.MID.toLowerCase() === selectedMovie.MID.toLowerCase()
        )
        .flatMap((link) => {
          const actor = actors.find(
            (item) => item.AID.toLowerCase() === link.AID.toLowerCase()
          );
          return actor ? [{ actor, role: link.Role }] : [];
        })
    : [];

  const existingActorIdsForEditing = editingMovie
    ? movieActors
        .filter(
          (link) =>
            link.MID.toLowerCase() === editingMovie.MID.toLowerCase()
        )
        .map((link) => link.AID)
    : [];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex overflow-x-hidden font-sans">
      <AnimatePresence>
        {isInitializing && (
          <LoadingScreen onComplete={() => setIsInitializing(false)} />
        )}
      </AnimatePresence>

      <BackgroundEffect />

      <div className="hidden md:block">
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            if (page !== 'movie-detail') setSelectedMovieId(null);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
          movieCount={movies.length}
        />
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-72 h-full"
            >
              <Sidebar
                currentPage={currentPage}
                onNavigate={(page) => {
                  setCurrentPage(page);
                  if (page !== 'movie-detail') setSelectedMovieId(null);
                  setIsMobileSidebarOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileSidebarOpen(false)}
                movieCount={movies.length}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <TopBar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            if (page !== 'movie-detail') setSelectedMovieId(null);
          }}
          onOpenAddModal={handleOpenAddModal}
          onSelectMovie={handleSelectMovie}
          selectedMovieName={selectedMovie?.Name}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onToggleMobileSidebar={() =>
            setIsMobileSidebarOpen((value) => !value)
          }
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (selectedMovieId || '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentPage === 'dashboard' && (
                <Dashboard
                  movies={movies}
                  actorCount={actors.length}
                  directors={directors}
                  producers={producers}
                  onNavigate={(page) => setCurrentPage(page)}
                  onSelectMovie={handleSelectMovie}
                  onOpenAddModal={handleOpenAddModal}
                  onEditMovie={handleOpenEditModal}
                  onDeleteMovie={handlePromptDelete}
                />
              )}

              {currentPage === 'movies' && (
                <Movies
                  movies={movies}
                  directors={directors}
                  producers={producers}
                  onSelectMovie={handleSelectMovie}
                  onOpenAddModal={handleOpenAddModal}
                  onEditMovie={handleOpenEditModal}
                  onDeleteMovie={handlePromptDelete}
                />
              )}

              {currentPage === 'movie-detail' && selectedMovie && (
                <MovieDetails
                  movie={selectedMovie}
                  director={selectedMovieDirector}
                  producer={selectedMovieProducer}
                  cast={selectedMovieCast}
                  onBack={() => setCurrentPage('movies')}
                  onEdit={handleOpenEditModal}
                  onDelete={handlePromptDelete}
                  onSelectActor={() => setCurrentPage('actors')}
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'actors' && (
                <Actors
                  actors={actors}
                  movies={movies}
                  movieActors={movieActors}
                  onSelectMovie={handleSelectMovie}
                />
              )}

              {currentPage === 'directors' && (
                <Directors
                  directors={directors}
                  movies={movies}
                  onSelectMovie={handleSelectMovie}
                />
              )}

              {currentPage === 'producers' && (
                <Producers
                  producers={producers}
                  movies={movies}
                  onSelectMovie={handleSelectMovie}
                />
              )}

              {currentPage === 'insights' && <Statistics movies={movies} />}

              {currentPage === 'activity' && (
                <AuditLogs auditLogs={auditLogs} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MovieModal
        isOpen={isMovieModalOpen}
        onClose={() => {
          setIsMovieModalOpen(false);
          setEditingMovie(null);
        }}
        onSave={handleSaveMovie}
        initialData={editingMovie}
        directors={directors}
        producers={producers}
        actors={actors}
        existingActorIds={existingActorIdsForEditing}
      />

      <ConfirmDialog
        isOpen={Boolean(movieToDelete)}
        title="Remove Movie from Collection?"
        message="Are you sure you want to remove this movie from your collection?"
        targetName={movieToDelete ? movieToDelete.Name : undefined}
        confirmLabel="Remove Movie"
        cancelLabel="Keep Movie"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMovieToDelete(null)}
        isLoading={isDeleting}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
