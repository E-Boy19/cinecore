import { Actor, Movie, MovieActor } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

type ActorCreateData = {
  Name: string;
  Age: number;
  Gender?: Actor['Gender'];
  Bio?: string;
  AvatarUrl?: string;
};

const normalizeActor = (actor: any): Actor => ({
  AID: String(actor.AID),
  Name: String(actor.Name ?? ''),
  Age: Number(actor.Age ?? 0),
  Gender: actor.Gender as Actor['Gender'],
  Bio: actor.Bio ?? undefined,
  AvatarUrl: actor.AvatarUrl ?? undefined
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

export const actorService = {
  async getActors(): Promise<Actor[]> {
    const response = await fetch(`${API_BASE_URL}/actors`);
    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch actors.'));
    }
    return (await response.json()).map(normalizeActor);
  },

  async getActor(id: string): Promise<Actor | null> {
    const response = await fetch(
      `${API_BASE_URL}/actors/${encodeURIComponent(id)}`
    );
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch actor.'));
    }
    return normalizeActor(await response.json());
  },

  async getMoviesForActor(
    actorId: string
  ): Promise<{ movie: Movie; role?: string }[]> {
    const response = await fetch(
      `${API_BASE_URL}/actors/${encodeURIComponent(actorId)}/movies`
    );
    if (!response.ok) {
      throw new Error(
        await readError(response, 'Failed to fetch actor filmography.')
      );
    }

    const rows = await response.json();
    return rows.map((row: any) => ({
      movie: normalizeMovie(row.movie),
      role: row.role ?? undefined
    }));
  },

  async getActorsForMovie(
    movieId: string
  ): Promise<{ actor: Actor; role?: string }[]> {
    const response = await fetch(
      `${API_BASE_URL}/movies/${encodeURIComponent(movieId)}/actors`
    );
    if (!response.ok) {
      throw new Error(
        await readError(response, 'Failed to fetch movie cast.')
      );
    }

    const rows = await response.json();
    return rows.map((row: any) => ({
      actor: normalizeActor(row.actor),
      role: row.role ?? undefined
    }));
  },

  async getAllMovieActors(): Promise<MovieActor[]> {
    const response = await fetch(`${API_BASE_URL}/movie-actors`);
    if (!response.ok) {
      throw new Error(
        await readError(response, 'Failed to fetch movie cast relationships.')
      );
    }

    const rows = await response.json();
    return rows.map((row: any) => ({
      MID: String(row.MID),
      AID: String(row.AID),
      Role: row.Role ?? undefined
    }));
  },

  async createActor(data: ActorCreateData): Promise<Actor> {
    const response = await fetch(`${API_BASE_URL}/actors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Name: data.Name.trim(),
        Age: Number(data.Age),
        Gender: data.Gender ?? 'Male'
      })
    });

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to add actor.'));
    }

    return normalizeActor(await response.json());
  }
};
