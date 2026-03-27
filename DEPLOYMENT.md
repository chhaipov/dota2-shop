# Deployment Guide — Dota 2 Item Shop

This app is a **single-server** deployment: Django serves the API, admin, and the built Vite SPA. Use either **Docker** (recommended) or **manual** setup.

---

## Quick start (Docker)

From the repo root:

```bash
docker compose up --build
```

- App: **http://localhost:8000**
- API: **http://localhost:8000/api/**
- API docs: **http://localhost:8000/api/docs/**
- Health: **http://localhost:8000/api/health/**

Set production secrets via environment or `.env`:

```bash
SECRET_KEY=your-secret-key-min-50-chars
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DEBUG=false
docker compose up -d
```

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | (dev key) | **Required in production.** Django secret; use a long random string. |
| `DEBUG` | `true` | Set `false` in production. |
| `ALLOWED_HOSTS` | `*` | Comma-separated host names (e.g. `example.com,www.example.com`). |
| `SPA_ROOT` | (unset) | Path to Vite build (e.g. `/app/frontend/dist`). When set, Django serves the SPA for non-API paths. |
| `DB_PATH` | `backend/db.sqlite3` | SQLite file path (default backend location). |
| `DATABASE_URL` | — | Optional. PostgreSQL URL (`postgresql://user:pass@host/db`). Requires `dj-database-url` and `psycopg2-binary`. |

Copy `.env.example` to `.env` and fill in values.

---

## Docker details

- **Dockerfile**: Multi-stage build (Node for Vite, then Python). Frontend is built with `VITE_API_URL=/api` so the SPA uses the same origin.
- **Volumes**: `app_data` (SQLite + default DB path) and `app_media` (uploaded avatars) are persisted.
- **Health check**: `GET /api/health/` every 30s.
- **Entrypoint**: Runs `migrate` then the main command (Gunicorn).

To seed items/vouchers inside the container:

```bash
docker compose exec app python manage.py seed_items
docker compose exec app python manage.py seed_vouchers
```

---

## Manual deployment (no Docker)

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Unix: source venv/bin/activate
pip install -r requirements.txt
```

Set environment variables (or use `.env` and a loader like `python-dotenv`):

```bash
export SECRET_KEY=your-production-secret
export DEBUG=false
export ALLOWED_HOSTS=yourdomain.com
```

Create DB and static files:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_items   # optional
python manage.py seed_vouchers # optional
```

Run with Gunicorn:

```bash
gunicorn --bind 0.0.0.0:8000 --workers 2 config.wsgi:application
```

### 2. Frontend build / API URL

From repo root:

```bash
cd frontend
cp .env.example .env            # optional, then edit VITE_API_URL
npm ci
VITE_API_URL=/api npm run build
```

Then **copy the built SPA into the backend static folder** so Django/WhiteNoise can serve it:

```bash
rm -rf ../backend/static/spa
mkdir -p ../backend/static/spa
cp -r dist/* ../backend/static/spa/
```

Now Django will:

- Serve the SPA assets at `/static/spa/*`
- Use `backend/static/spa/index.html` as the SPA entrypoint for non-API routes (via `SPA_ROOT` auto-detection)

Control which backend the SPA talks to via `VITE_API_URL`:

- **Local dev (separate frontend)**: `VITE_API_URL=http://localhost:8000/api`
- **Same-origin (served by Django static)**: `VITE_API_URL=/api`
- **Remote backend**: `VITE_API_URL=https://api.yourdomain.com/api`

### 3. Reverse proxy (optional)

Put Gunicorn behind Nginx or Caddy:

- Proxy `/api/`, `/admin/`, `/shop/`, `/static/`, `/media/` to `http://127.0.0.1:8000`.
- Optionally serve `/assets/` and `/images/` from the Vite `dist` folder and only proxy `/api/*` and Django routes to the app.

---

## Health check

- **URL**: `GET /api/health/`
- **Response**: `200` and `{"status": "ok"}`

Use for load balancers and container orchestration (e.g. Kubernetes liveness/readiness).

---

## Security note

This application is a **security demo** and includes intentional vulnerabilities. For production use in a real environment, fix or remove those issues and follow standard hardening (HTTPS, restricted CORS, rate limiting, etc.).
