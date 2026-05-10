export type UrlValidationCode =
  | "EMPTY"
  | "INVALID_FORMAT"
  | "UNSUPPORTED_PROTOCOL"
  | "MISSING_HOST";

export class UrlValidationError extends Error {
  readonly code: UrlValidationCode;

  constructor(code: UrlValidationCode) {
    super(code);
    this.name = "UrlValidationError";
    this.code = code;
  }
}

/**
 * Validates an absolute http(s) URL and returns its canonical form.
 * Query strings (including UTM parameters) are preserved.
 */
export function parseValidHttpUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new UrlValidationError("EMPTY");
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new UrlValidationError("INVALID_FORMAT");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new UrlValidationError("UNSUPPORTED_PROTOCOL");
  }

  if (!parsed.hostname) {
    throw new UrlValidationError("MISSING_HOST");
  }

  return parsed.href;
}
