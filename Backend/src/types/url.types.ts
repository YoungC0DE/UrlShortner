export interface CreateShortUrlDTO {
  url: string;
}

export interface UrlDocument {
  code: string;
  original_url: string;
  created_at: Date;
}