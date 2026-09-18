# SCDemo - Intentionally Vulnerable Web App

## WARNING

This project is intentionally insecure and is built for security training, labs, and testing practice only.

Do not use this app in production.
Do not expose it to the public internet without strict isolation.
Do not store real user data, credentials, or secrets in this app.

Use only in a controlled environment (local machine, private lab network, or isolated VM).

## Allowed Use

- Security training and classroom exercises
- CTF/lab practice
- Demonstrating web/API vulnerabilities and attack workflows

## Not Allowed / Not Recommended

- Production deployment
- Hosting with real customer data
- Running on open internet without proper containment

## Quick Run (Access Web via Backend)

### 1) Build frontend and copy into backend static

```bash
cd frontend
npm install
VITE_API_URL=/api npm run build
```

Copy build to backend static:

```bash
rm -rf ../backend/static/spa
mkdir -p ../backend/static/spa
cp -r dist/* ../backend/static/spa/
```

### 2) Run backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 3) Open app from backend

- App URL: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs/`
- Redoc: `http://localhost:8000/api/redoc/`

Do not use `http://localhost:5173` for this run mode.

