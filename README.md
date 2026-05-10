# 🔗 URL shortener (uLnk)

<img width="782" height="691" alt="image" src="https://github.com/user-attachments/assets/e1b0bd65-5ec8-4924-8002-37855d495075" />

A small **Node API** (Fastify + MongoDB) plus a **static page** to shorten links.

---

## ✨ What you get

- 🚀 **Production API:** [https://ulnk.com.br](https://ulnk.com.br)
- 📱 **Light frontend:** HTML, CSS, and JS — no bundler
- 🔒 Only **http** or **https** URLs (query params, e.g. UTMs, are preserved)

---

## 📋 Prerequisites

| Item | Why |
|------|-----|
| [Node.js](https://nodejs.org/) | Run the backend |
| [MongoDB](https://www.mongodb.com/) | Store links (local or Atlas) |

---

## 🖥️ Backend

📂 Folder: **`Backend`**

### ⚙️ Quick setup

1. Copy the environment example:
   - PowerShell: `Copy-Item Backend\.env-example Backend\.env`
2. Edit **`Backend/.env`** (port, MongoDB, limits).

### 🔑 Main environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default: `3000`) |
| `MONGO_URL` | MongoDB connection URI |
| `MONGO_DATABASE` | Database name |
| `TRUST_PROXY` | `true` behind a reverse proxy (correct IP for rate limiting) |
| `RATE_LIMIT_MAX` | Max `POST /shorten` requests per IP per window |
| `RATE_LIMIT_TIME_WINDOW_MS` | Window length in milliseconds |
| `CORS_ENABLED` | `false` disables CORS (`true` if the frontend is on another origin) |

### ▶️ Development

```bash
cd Backend
npm install
npm run dev
```

### 🚢 Production

```bash
npm run build
npm start
```

### 📡 Endpoints

| Method | Path | Description |
|--------|------|---------------|
| `POST` | `/shorten` | JSON body: `{ "url": "https://..." }` → `{ "code", "short_url" }` |
| `GET` | `/:code` | Redirects to the original URL |

**Common errors:** invalid body or URL (`400`), unknown code (`404`), rate limit (`429`).

---

## 🌐 Frontend

📂 Folder: **`Frontend`**

The app uses the production API **`https://ulnk.com.br`** (`api-base` meta in `Frontend/index.html`).

To run **only the frontend** against production, serve the folder statically:

```bash
npx --yes serve Frontend -l 5173
```

Open the URL printed in the terminal (e.g. `http://localhost:5173`).

### 🔧 Local API during development

If the backend runs elsewhere (e.g. `http://localhost:3000`), change the attribute in `Frontend/index.html`:

```html
<meta name="api-base" content="http://localhost:3000" />
```

With different origins (frontend on 5173, API on 3000), keep **`CORS_ENABLED=true`** on the backend.

---

## 📄 License / usage

Use and adapt freely for personal projects.
