import { Producer, Movie } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

type ProducerCreateData = {
  CompanyName: string;
  Name: string;
  Age: number;
  AvatarUrl?: string;
};

const normalizeProducer = (producer: any): Producer => ({
  PID: String(producer.PID),
  Name: String(producer.Name ?? ''),
  Age: Number(producer.Age ?? 0),
  CompanyName: String(producer.CompanyName ?? ''),
  AvatarUrl: producer.AvatarUrl ?? undefined
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

export const producerService = {
  async getProducers(): Promise<Producer[]> {
    const response = await fetch(`${API_BASE_URL}/producers`);
    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch producers.'));
    }
    return (await response.json()).map(normalizeProducer);
  },

  async getProducer(id: string): Promise<Producer | null> {
    const response = await fetch(
      `${API_BASE_URL}/producers/${encodeURIComponent(id)}`
    );
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch producer.'));
    }
    return normalizeProducer(await response.json());
  },

  async getMoviesForProducer(producerId: string): Promise<Movie[]> {
    const response = await fetch(
      `${API_BASE_URL}/producers/${encodeURIComponent(producerId)}/movies`
    );
    if (!response.ok) {
      throw new Error(
        await readError(response, 'Failed to fetch producer movies.')
      );
    }
    return (await response.json()).map(normalizeMovie);
  },

  async createProducer(data: ProducerCreateData): Promise<Producer> {
    const response = await fetch(`${API_BASE_URL}/producers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        CompanyName: data.CompanyName.trim(),
        Name: data.Name.trim(),
        Age: Number(data.Age)
      })
    });

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to add producer.'));
    }

    return normalizeProducer(await response.json());
  }
};
