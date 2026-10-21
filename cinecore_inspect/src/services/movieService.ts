import { Movie, MovieFilterOptions } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

type MoviePayload = {
  Name: string;
  Genre: string;
  FilmIndustry: Movie['FilmIndustry'];
  ReleaseDate: string;
  IMDbRating: number;
  PID: string | number;
  DID: string | number;
  actorIds?: Array<string | number>;
};

const normalizeMovie = (movie: any): Movie => ({
  MID: String(movie.MID),
  Name: String(movie.Name ?? ''),
  Genre: String(movie.Genre ?? ''),
  FilmIndustry: movie.FilmIndustry as Movie['FilmIndustry'],
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

export const movieService = {
  async getMovies(filters?: MovieFilterOptions): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/movies`);

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch movies.'));
    }

    let list: Movie[] = (await response.json()).map(normalizeMovie);

    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (movie) =>
          movie.Name.toLowerCase().includes(q) ||
          movie.Genre.toLowerCase().includes(q) ||
          movie.MID.toLowerCase().includes(q)
      );
    }

    if (filters?.industry && filters.industry !== 'ALL') {
      list = list.filter((movie) => movie.FilmIndustry === filters.industry);
    }

    if (filters?.genre && filters.genre !== 'ALL') {
      list = list.filter((movie) =>
        movie.Genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }

    if (filters?.minRating && filters.minRating > 0) {
      list = list.filter((movie) => movie.IMDbRating >= filters.minRating!);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'rating-desc':
          list.sort((a, b) => b.IMDbRating - a.IMDbRating);
          break;
        case 'rating-asc':
          list.sort((a, b) => a.IMDbRating - b.IMDbRating);
          break;
        case 'date-desc':
          list.sort(
            (a, b) =>
              new Date(b.ReleaseDate).getTime() -
              new Date(a.ReleaseDate).getTime()
          );
          break;
        case 'date-asc':
          list.sort(
            (a, b) =>
              new Date(a.ReleaseDate).getTime() -
              new Date(b.ReleaseDate).getTime()
          );
          break;
        case 'name-asc':
          list.sort((a, b) => a.Name.localeCompare(b.Name));
          break;
        case 'name-desc':
          list.sort((a, b) => b.Name.localeCompare(a.Name));
          break;
      }
    }

    return list;
  },

  async getMovie(id: string): Promise<Movie | null> {
    const response = await fetch(
      `${API_BASE_URL}/movies/${encodeURIComponent(id)}`
    );

    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch movie.'));
    }

    return normalizeMovie(await response.json());
  },

  async createMovie(
    data: Omit<Movie, 'MID'> & {
      MID?: string;
      actorIds?: string[];
    }
  ): Promise<Movie> {
    const payload: MoviePayload = {
      Name: data.Name.trim(),
      Genre: data.Genre.trim(),
      FilmIndustry: data.FilmIndustry,
      ReleaseDate: data.ReleaseDate,
      IMDbRating: Number(data.IMDbRating),
      PID: data.PID,
      DID: data.DID,
      actorIds: data.actorIds ?? []
    };

    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to add movie.'));
    }

    return normalizeMovie(await response.json());
  },

  async updateMovie(
    id: string,
    data: Partial<Movie> & { actorIds?: string[] }
  ): Promise<Movie> {
    const payload: Record<string, unknown> = {};

    const fields: Array<keyof Movie> = [
      'Name',
      'Genre',
      'FilmIndustry',
      'ReleaseDate',
      'IMDbRating',
      'PID',
      'DID'
    ];

    for (const field of fields) {
      if (data[field] !== undefined) {
        payload[field] =
          field === 'IMDbRating' ? Number(data[field]) : data[field];
      }
    }

    if (data.actorIds !== undefined) {
      payload.actorIds = data.actorIds;
    }

    const response = await fetch(
      `${API_BASE_URL}/movies/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to update movie.'));
    }

    return normalizeMovie(await response.json());
  },

  async deleteMovie(id: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/movies/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );

    if (response.status === 404) return false;

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to remove movie.'));
    }

    const result = await response.json();
    return result?.success !== false;
  }
};
