import "dotenv/config";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

const env = {
  PORT: Number(process.env.PORT || 3000),
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  MONGO_DATABASE: process.env.MONGO_DATABASE || "url_shortener",
  TRUST_PROXY: process.env.TRUST_PROXY === "true",
  /** Allow browser requests from another origin (e.g. static dev server on port 5173). */
  CORS_ENABLED: process.env.CORS_ENABLED !== "false",
  RATE_LIMIT_MAX: parsePositiveInt(process.env.RATE_LIMIT_MAX, 20),
  RATE_LIMIT_TIME_WINDOW_MS: parsePositiveInt(
    process.env.RATE_LIMIT_TIME_WINDOW_MS,
    60_000
  ),
};

export default env;