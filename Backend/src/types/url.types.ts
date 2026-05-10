export interface CreateShortUrlDTO {
  url: string;
}

export interface UrlDocument {
  code: string;
  original_url: string;
  created_at: Date;
  /** Deleted by MongoDB TTL after this instant (sliding window: renewed on each redirect). */
  expires_at: Date;
  /** Set on each redirect (GET /:code). */
  last_access_at?: Date;
}