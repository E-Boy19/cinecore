export type FilmIndustry = 'Hollywood' | 'Bollywood';

/**
 * Frontend representation of the MOVIES table.
 *
 * Persisted database columns:
 * MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID
 *
 * The optional presentation-only fields are retained so existing UI components
 * continue to compile; they are NOT sent to MySQL by the movie service.
 */
export interface Movie {
  MID: string;
  Name: string;
  Genre: string;
  FilmIndustry: FilmIndustry;
  ReleaseDate: string;
  IMDbRating: number;
  PID: string;
  DID: string;
  Duration?: string;
  BoxOffice?: string;
  Synopsis?: string;
  PosterUrl?: string;
}

/** ACTORS: AID, Name, Age, Gender */
export interface Actor {
  AID: string;
  Name: string;
  Age: number;
  Gender: 'Male' | 'Female' | 'Non-Binary';
  Bio?: string;
  AvatarUrl?: string;
}

/** DIRECTOR: DID, Name, Age */
export interface Director {
  DID: string;
  Name: string;
  Age: number;
  Style?: string;
  AvatarUrl?: string;
}

/** PRODUCER: PID, Name, Age, CompanyName */
export interface Producer {
  PID: string;
  Name: string;
  Age: number;
  CompanyName: string;
  AvatarUrl?: string;
}

/** MOVIE_ACTORS: MID, AID, Role */
export interface MovieActor {
  MID: string;
  AID: string;
  Role?: string;
}

/** MOVIE_AUDIT: AuditID, MID, MovieName, ActionType, OldRating, NewRating, ActionTime */
export type AuditActionType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface MovieAudit {
  AuditID: string;
  MID: string;
  MovieName: string;
  ActionType: AuditActionType;
  OldRating: number | null;
  NewRating: number | null;
  ActionTime: string;
  Details?: string;
}

export interface MovieFilterOptions {
  searchQuery?: string;
  genre?: string;
  industry?: FilmIndustry | 'ALL';
  minRating?: number;
  sortBy?:
    | 'rating-desc'
    | 'rating-asc'
    | 'date-desc'
    | 'date-asc'
    | 'name-asc'
    | 'name-desc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  timestamp: number;
}

export type PageId =
  | 'dashboard'
  | 'movies'
  | 'movie-detail'
  | 'actors'
  | 'directors'
  | 'producers'
  | 'insights'
  | 'activity';
