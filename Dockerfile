# Multi-stage: build frontend, then run Django + Gunicorn
# Build frontend (Vite)
FROM node:20-alpine AS frontend-build
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ .
# Same-origin API when SPA is served by Django
ENV VITE_API_URL=/api
RUN npm run build

# Backend (Django + Gunicorn)
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend code
COPY backend/ .
# Frontend build output into backend static folder (served as /static/spa/*)
RUN mkdir -p /app/static/spa
COPY --from=frontend-build /build/dist/ /app/static/spa/

# Defaults (override with -e or .env)
ENV DEBUG=false
ENV ALLOWED_HOSTS=*
ENV SPA_ROOT=
ENV DB_PATH=/app/db.sqlite3

# Create media and data dirs
RUN mkdir -p /app/media /app/staticfiles /app/data

# Collect static files (admin, etc.)
RUN python manage.py collectstatic --noinput --clear 2>/dev/null || true

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "2", "config.wsgi:application"]
