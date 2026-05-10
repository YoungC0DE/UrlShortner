# URL Shortener

URL shortener with a Node API (Fastify + MongoDB) and a simple static web page.

## Requirements

- [Node.js](https://nodejs.org/) (a version compatible with the project)
- [MongoDB](https://www.mongodb.com/) running locally or via a remote URI

## Backend

Location: `Backend` folder.

### Setup

1. Copy `Backend/.env-example` to `Backend/.env` (PowerShell: `Copy-Item Backend\.env-example Backend\.env`).

2. Adjust `Backend/.env` as needed (port, MongoDB, limits).

### Main environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP server port (default: `3000`) |
| `MONGO_URL` | MongoDB connection URI |
| `MONGO_DATABASE` | Database name |
| `TRUST_PROXY` | `true` behind a reverse proxy (correct IP for rate limiting) |
| `RATE_LIMIT_MAX` | Max `POST /shorten` requests per IP per window |
| `RATE_LIMIT_TIME_WINDOW_MS` | Window length in milliseconds |
| `CORS_ENABLED` | `false` disables CORS (keep `true` if the frontend runs on another origin) |

### Run

```bash
cd Backend
npm install
npm run dev
```

For production: `npm run build` and `npm start`.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/shorten` | JSON body: `{ "url": "<https://...>" }`. Success: `{ "code", "short_url" }`. |
| `GET` | `/:code` | Redirects to the original URL for that code. |

The API only accepts absolute URLs with **http** or **https**. Query parameters (e.g. UTM tags) are preserved.

Common errors: invalid body or URL (`400`), unknown code (`404`), rate limit exceeded (`429`).

## Frontend

Location: `Frontend` folder. Static HTML, CSS, and JavaScript (no bundler).

1. Start the backend (for example at `http://localhost:3000`).
2. Serve the `Frontend` folder with any static HTTP server, for example:

   ```bash
   npx --yes serve Frontend -l 5173
   ```

3. Open the URL printed by the command in your browser (for example `http://localhost:5173`).

Change the API base URL in `<meta name="api-base" content="...">` inside `Frontend/index.html` if the backend is not at `http://localhost:3000`.

The browser needs CORS enabled on the backend (`CORS_ENABLED=true`, the default) because the page and API run on different ports.