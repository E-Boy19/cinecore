import { MovieAudit } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const normalizeAudit = (log: any): MovieAudit => ({
  AuditID: String(log.AuditID),
  MID: String(log.MID),
  MovieName: String(log.MovieName ?? ''),
  ActionType: log.ActionType,
  OldRating:
    log.OldRating === null || log.OldRating === undefined
      ? null
      : Number(log.OldRating),
  NewRating:
    log.NewRating === null || log.NewRating === undefined
      ? null
      : Number(log.NewRating),
  ActionTime: String(log.ActionTime ?? ''),
  Details: log.Details ?? undefined
});

const readError = async (response: Response, fallback: string) => {
  try {
    const body = await response.json();
    return body?.error || fallback;
  } catch {
    return fallback;
  }
};

export const auditService = {
  async getAuditLogs(): Promise<MovieAudit[]> {
    const response = await fetch(`${API_BASE_URL}/audit-logs`);

    if (!response.ok) {
      throw new Error(await readError(response, 'Failed to fetch activity.'));
    }

    return (await response.json()).map(normalizeAudit);
  }
};
