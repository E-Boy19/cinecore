import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Film, Check, Sparkles, AlertCircle, Clapperboard, Building, Users, Plus, UserPlus } from 'lucide-react';
import { Movie, Director, Producer, Actor, FilmIndustry } from '../types';
import { directorService } from '../services/directorService';
import { producerService } from '../services/producerService';
import { actorService } from '../services/actorService';

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movieData: Partial<Movie> & { actorIds: string[] }) => Promise<void>;
  initialData?: Movie | null;
  directors: Director[];
  producers: Producer[];
  actors: Actor[];
  existingActorIds?: string[];
}

export const MovieModal: React.FC<MovieModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  directors,
  producers,
  actors,
  existingActorIds = []
}) => {
  const isEditing = Boolean(initialData);

  // Movie Form State
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [industry, setIndustry] = useState<FilmIndustry>('Hollywood');
  const [releaseDate, setReleaseDate] = useState('');
  const [imdbRating, setImdbRating] = useState('7.5');
  const [did, setDid] = useState('');
  const [pid, setPid] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);

  // Local entity cache to immediately reflect created items before parent re-render
  const [localDirectors, setLocalDirectors] = useState<Director[]>([]);
  const [localProducers, setLocalProducers] = useState<Producer[]>([]);
  const [localActors, setLocalActors] = useState<Actor[]>([]);

  // Subform State: 'none' | 'director' | 'producer' | 'actor'
  const [activeSubForm, setActiveSubForm] = useState<'none' | 'director' | 'producer' | 'actor'>('none');

  // Director Subform Fields
  const [newDirName, setNewDirName] = useState('');
  const [newDirAge, setNewDirAge] = useState('48');
  const [newDirStyle, setNewDirStyle] = useState('');
  const [dirError, setDirError] = useState('');
  const [isCreatingDir, setIsCreatingDir] = useState(false);

  // Producer Subform Fields
  const [newProdCompany, setNewProdCompany] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdAge, setNewProdAge] = useState('45');
  const [prodError, setProdError] = useState('');
  const [isCreatingProd, setIsCreatingProd] = useState(false);

  // Actor Subform Fields
  const [newActorName, setNewActorName] = useState('');
  const [newActorAge, setNewActorAge] = useState('32');
  const [newActorGender, setNewActorGender] = useState<'Male' | 'Female' | 'Non-Binary'>('Male');
  const [newActorBio, setNewActorBio] = useState('');
  const [actorError, setActorError] = useState('');
  const [isCreatingActor, setIsCreatingActor] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prevIsOpenRef = useRef(false);

  // Initialize or reset ONLY when opening the modal (preserves user input during director/producer/actor creation)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (initialData) {
        setName(initialData.Name);
        setGenre(initialData.Genre);
        setIndustry(initialData.FilmIndustry);
        setReleaseDate(initialData.ReleaseDate);
        setImdbRating(String(initialData.IMDbRating));
        setDid(initialData.DID);
        setPid(initialData.PID);
        setSynopsis(initialData.Synopsis || '');
        setSelectedActorIds(existingActorIds);
      } else {
        setName('');
        setGenre('Action / Sci-Fi');
        setIndustry('Hollywood');
        setReleaseDate(new Date().toISOString().split('T')[0]);
        setImdbRating('8.0');
        setDid(directors[0]?.DID || 'DID-01');
        setPid(producers[0]?.PID || 'PID-01');
        setSynopsis('');
        setSelectedActorIds(actors.slice(0, 2).map((a) => a.AID));
      }
      setActiveSubForm('none');
      setErrors({});
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialData, existingActorIds, directors, producers, actors]);

  // Combined lists with local additions to guarantee immediate selection
  const allDirectors = React.useMemo(() => {
    const map = new Map<string, Director>();
    directors.forEach((d) => map.set(d.DID, d));
    localDirectors.forEach((d) => map.set(d.DID, d));
    return Array.from(map.values());
  }, [directors, localDirectors]);

  const allProducers = React.useMemo(() => {
    const map = new Map<string, Producer>();
    producers.forEach((p) => map.set(p.PID, p));
    localProducers.forEach((p) => map.set(p.PID, p));
    return Array.from(map.values());
  }, [producers, localProducers]);

  const allActors = React.useMemo(() => {
    const map = new Map<string, Actor>();
    actors.forEach((a) => map.set(a.AID, a));
    localActors.forEach((a) => map.set(a.AID, a));
    return Array.from(map.values());
  }, [actors, localActors]);

  const toggleActor = (actorId: string) => {
    if (selectedActorIds.includes(actorId)) {
      setSelectedActorIds(selectedActorIds.filter((id) => id !== actorId));
    } else {
      setSelectedActorIds([...selectedActorIds, actorId]);
    }
  };

  // Create Director Handler
  const handleCreateDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirName.trim()) {
      setDirError('Please enter a director name.');
      return;
    }
    const ageNum = parseInt(newDirAge, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      setDirError('Please enter a valid age.');
      return;
    }

    setIsCreatingDir(true);
    setDirError('');
    try {
      const created = await directorService.createDirector({
        Name: newDirName.trim(),
        Age: ageNum,
        Style: newDirStyle.trim() || undefined
      });
      setLocalDirectors((prev) => [...prev, created]);
      setDid(created.DID);
      setNewDirName('');
      setNewDirStyle('');
      setActiveSubForm('none');
    } catch (err: any) {
      setDirError(err?.message || 'Failed to create director.');
    } finally {
      setIsCreatingDir(false);
    }
  };

  // Create Producer Handler
  const handleCreateProducer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdCompany.trim()) {
      setProdError('Please enter a company name.');
      return;
    }
    if (!newProdName.trim()) {
      setProdError('Please enter a producer name.');
      return;
    }
    const ageNum = parseInt(newProdAge, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      setProdError('Please enter a valid age.');
      return;
    }

    setIsCreatingProd(true);
    setProdError('');
    try {
      const created = await producerService.createProducer({
        CompanyName: newProdCompany.trim(),
        Name: newProdName.trim(),
        Age: ageNum
      });
      setLocalProducers((prev) => [...prev, created]);
      setPid(created.PID);
      setNewProdCompany('');
      setNewProdName('');
      setActiveSubForm('none');
    } catch (err: any) {
      setProdError(err?.message || 'Failed to create production company.');
    } finally {
      setIsCreatingProd(false);
    }
  };

  // Create Actor Handler
  const handleCreateActor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActorName.trim()) {
      setActorError('Please enter an actor name.');
      return;
    }
    const ageNum = parseInt(newActorAge, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      setActorError('Please enter a valid age.');
      return;
    }

    setIsCreatingActor(true);
    setActorError('');
    try {
      const created = await actorService.createActor({
        Name: newActorName.trim(),
        Age: ageNum,
        Gender: newActorGender,
        Bio: newActorBio.trim() || undefined
      });
      setLocalActors((prev) => [...prev, created]);
      setSelectedActorIds((prev) => (prev.includes(created.AID) ? prev : [...prev, created.AID]));
      setNewActorName('');
      setNewActorBio('');
      setActiveSubForm('none');
    } catch (err: any) {
      setActorError(err?.message || 'Failed to create actor.');
    } finally {
      setIsCreatingActor(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter a movie title';
    if (!genre.trim()) errs.genre = 'Please enter a genre';
    if (!releaseDate) errs.releaseDate = 'Please select a release date';
    const ratingNum = parseFloat(imdbRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      errs.imdbRating = 'Rating must be between 0.0 and 10.0';
    }
    if (!did) errs.did = 'Please choose or add a director';
    if (!pid) errs.pid = 'Please choose or add a production company';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        Name: name.trim(),
        Genre: genre.trim(),
        FilmIndustry: industry,
        ReleaseDate: releaseDate,
        IMDbRating: parseFloat(imdbRating),
        DID: did,
        PID: pid,
        Synopsis: synopsis.trim(),
        actorIds: selectedActorIds
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-slate-950 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden z-10 my-8 tech-bracket-top-left tech-bracket-bottom-right"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-white tracking-wide">
                  {isEditing ? 'EDIT MOVIE DETAILS' : 'ADD NEW MOVIE'}
                </h2>
                <div className="text-xs text-slate-400">
                  {isEditing ? `Update details for ${initialData?.Name}` : 'Add a title to your movie collection'}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Movie Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Interstellar"
                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-800'
                } focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-white focus:outline-none`}
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Grid: Genre & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Genre *
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g. Sci-Fi / Action / Drama"
                  className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                    errors.genre ? 'border-rose-500' : 'border-slate-800'
                  } focus:border-cyan-500 text-xs text-white focus:outline-none`}
                />
                {errors.genre && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.genre}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Film Industry
                </label>
                <div className="flex gap-2">
                  {(['Hollywood', 'Bollywood'] as FilmIndustry[]).map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                        industry === ind
                          ? ind === 'Hollywood'
                            ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                            : 'bg-amber-950/60 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid: Release Date & IMDb Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Release Date *
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                    errors.releaseDate ? 'border-rose-500' : 'border-slate-800'
                  } focus:border-cyan-500 text-xs text-slate-200 focus:outline-none`}
                />
                {errors.releaseDate && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.releaseDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  IMDb Rating (0.0 – 10.0) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={imdbRating}
                  onChange={(e) => setImdbRating(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                    errors.imdbRating ? 'border-rose-500' : 'border-slate-800'
                  } focus:border-amber-500 text-xs font-mono text-amber-300 font-bold focus:outline-none`}
                />
                {errors.imdbRating && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.imdbRating}
                  </p>
                )}
              </div>
            </div>

            {/* Director & Production Company Selects + Inline Add Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Director Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Director *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubForm(activeSubForm === 'director' ? 'none' : 'director');
                      setDirError('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{activeSubForm === 'director' ? 'Cancel' : 'Add New'}</span>
                  </button>
                </div>

                <select
                  value={did}
                  onChange={(e) => setDid(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 focus:outline-none"
                >
                  {allDirectors.map((d) => (
                    <option key={d.DID} value={d.DID}>
                      {d.Name}
                    </option>
                  ))}
                </select>

                {/* Inline Director Creator */}
                <AnimatePresence>
                  {activeSubForm === 'director' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-xl space-y-2.5 mt-1 tech-bracket-top-left">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Add New Director</span>
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">Direct Entry</span>
                        </div>

                        {dirError && (
                          <div className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{dirError}</span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={newDirName}
                            onChange={(e) => setNewDirName(e.target.value)}
                            placeholder="Director Name (e.g. Denis Villeneuve)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                              <input
                                type="number"
                                value={newDirAge}
                                onChange={(e) => setNewDirAge(e.target.value)}
                                placeholder="Age"
                                min="1"
                                max="120"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="text"
                                value={newDirStyle}
                                onChange={(e) => setNewDirStyle(e.target.value)}
                                placeholder="Style (e.g. Visual sci-fi)"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveSubForm('none')}
                            className="px-2.5 py-1 rounded-md text-slate-400 hover:text-white text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateDirector}
                            disabled={isCreatingDir}
                            className="px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1"
                          >
                            {isCreatingDir ? (
                              <span>Saving...</span>
                            ) : (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Save & Select</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Producer Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    <span>Production Company *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubForm(activeSubForm === 'producer' ? 'none' : 'producer');
                      setProdError('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{activeSubForm === 'producer' ? 'Cancel' : 'Add New'}</span>
                  </button>
                </div>

                <select
                  value={pid}
                  onChange={(e) => setPid(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 focus:outline-none"
                >
                  {allProducers.map((p) => (
                    <option key={p.PID} value={p.PID}>
                      {p.CompanyName} ({p.Name})
                    </option>
                  ))}
                </select>

                {/* Inline Producer Creator */}
                <AnimatePresence>
                  {activeSubForm === 'producer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/40 shadow-xl space-y-2.5 mt-1 tech-bracket-top-left">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-purple-400" />
                            <span>Add Production Company</span>
                          </span>
                          <span className="text-[10px] font-mono text-purple-400">Direct Entry</span>
                        </div>

                        {prodError && (
                          <div className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{prodError}</span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={newProdCompany}
                            onChange={(e) => setNewProdCompany(e.target.value)}
                            placeholder="Company Name (e.g. Syncopy Inc.)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <input
                                type="text"
                                value={newProdName}
                                onChange={(e) => setNewProdName(e.target.value)}
                                placeholder="Executive / Producer Name"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-1">
                              <input
                                type="number"
                                value={newProdAge}
                                onChange={(e) => setNewProdAge(e.target.value)}
                                placeholder="Age"
                                min="1"
                                max="120"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveSubForm('none')}
                            className="px-2.5 py-1 rounded-md text-slate-400 hover:text-white text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateProducer}
                            disabled={isCreatingProd}
                            className="px-3 py-1 rounded-md bg-purple-500 hover:bg-purple-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1"
                          >
                            {isCreatingProd ? (
                              <span>Saving...</span>
                            ) : (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Save & Select</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Synopsis / Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Storyline / Synopsis
              </label>
              <textarea
                rows={3}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Brief summary of the movie plot..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            {/* Cast Selection + Add New Actor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Starring Cast</span>
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-cyan-400">
                    {selectedActorIds.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubForm(activeSubForm === 'actor' ? 'none' : 'actor');
                      setActorError('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{activeSubForm === 'actor' ? 'Cancel' : 'Add New Actor'}</span>
                  </button>
                </div>
              </div>

              {/* Inline Actor Creator */}
              <AnimatePresence>
                {activeSubForm === 'actor' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-xl space-y-2.5 mb-2 tech-bracket-top-left">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Add New Actor to Cast</span>
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400">Direct Entry</span>
                      </div>

                      {actorError && (
                        <div className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{actorError}</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newActorName}
                          onChange={(e) => setNewActorName(e.target.value)}
                          placeholder="Actor Full Name (e.g. Cillian Murphy)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <input
                              type="number"
                              value={newActorAge}
                              onChange={(e) => setNewActorAge(e.target.value)}
                              placeholder="Age"
                              min="1"
                              max="120"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                            />
                          </div>
                          <div className="col-span-2">
                            <select
                              value={newActorGender}
                              onChange={(e) => setNewActorGender(e.target.value as any)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white focus:outline-none"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Non-Binary">Non-Binary</option>
                            </select>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={newActorBio}
                          onChange={(e) => setNewActorBio(e.target.value)}
                          placeholder="Notable Roles / Short Bio (optional)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveSubForm('none')}
                          className="px-2.5 py-1 rounded-md text-slate-400 hover:text-white text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateActor}
                          disabled={isCreatingActor}
                          className="px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          {isCreatingActor ? (
                            <span>Saving...</span>
                          ) : (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Save & Add to Cast</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actors Multi-select Grid */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 max-h-36 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allActors.map((actor) => {
                  const isChecked = selectedActorIds.includes(actor.AID);
                  return (
                    <button
                      key={actor.AID}
                      type="button"
                      onClick={() => toggleActor(actor.AID)}
                      className={`flex items-center gap-2 p-1.5 rounded text-left text-xs transition-colors border ${
                        isChecked
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate text-[11px]">{actor.Name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative group px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    {isEditing ? 'Saving Changes...' : 'Adding Movie...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isEditing ? 'Save Changes' : 'Add Movie'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

