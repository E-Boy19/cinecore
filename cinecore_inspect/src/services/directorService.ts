import { Director, Movie } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

type DirectorCreateData = {
  Name: string;
  Age: number;
  Style?: string;
  AvatarUrl?: string;
};

const normalizeDirector = (director: any): Director => ({
  DID: String(director.DID),
  Name: String(director.Name ?? ''),
  Age: Number(director.Age ?? 0),
  Style: director.Style ?? undefined,
  AvatarUrl: director.AvatarUrl ?? undefined
});

const normalizeMovie = (movie: any): Movie => ({
  MID: String(movie.MID),
  Name: String(movie.Name ?? ''),
  Genre: String(movie.Genre ?? ''),
  FilmIndustry: movie.FilmIndustry,
  ReleaseDate: String(movie.ReleaseDate ?? ''),
  IMDbRating: Number(movie.IMDbRating ?? 0),
  PID: String(movie.PID),
  DID: String(movie.DID),
  Duration: movie.Duration ?? undefined,
  BoxOffice: movie.BoxOffice ?? undefined,
  Synopsis: movie.Synopsis ?? undefined,
  PosterUrl: movie.PosterUrl ?? undefined
});

const readError = async (response: Response, fallback: string) => {
  try {
    const body = await response.json();
    return body?.error || fallback;
  } catch {
    return fallback;
  }
};

export const directorService = {
  async getDirectors(): Promise<Director[]> {
    const response = await fetch(`${API_BASE_URL}/directors`);
    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch directors.'));
    }
    return (await response.json()).map(normalizeDirector);
  },

  async getDirector(id: string): Promise<Director | null> {
    const response = await fetch(
      `${API_BASE_URL}/directors/${encodeURIComponent(id)}`
    );
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch director.'));
    }
    return normalizeDirector(await response.json());
  },

  async getMoviesForDirector(directorId: string): Promise<Movie[]> {
    const response = await fetch(
      `${API_BASE_URL}/directors/${encodeURIComponent(directorId)}/movies`
    );
    if (!response.ok) {
      throw new Error(
        await readError(response, 'Failed to fetch director movies.')
      );
    }
    return (await response.json()).map(normalizeMovie);
  },

  async createDirector(data: DirectorCreateData): Promise<Director> {
    const response = await fetch(`${API_BASE_URL}/directors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Name: data.Name.trim(),
        Age: Number(data.Age)
      })
    });

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to add director.'));
    }

    return normalizeDirector(await response.json());
  }
};
