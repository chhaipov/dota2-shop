# Dota 2 Item Shop

A Dota 2 item purchasing web app. Built with Django (backend) and Vite + React (frontend). Available as both Django templates and Vite SPA — use the navbar switch to toggle between them.

## Tech Stack

| Part | Technology |
|------|------------|
| SPA | Vite + React |
| Templates | Django |
| API | Django REST Framework |
| Admin | Django Admin |

## Quick Start

### Backend (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_items     # Load Dota 2 items
python manage.py createsuperuser   # For admin access
python manage.py runserver
```

Backend runs at **http://localhost:8000**

### Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

### Admin Panel

1. Create superuser: `python manage.py createsuperuser`
2. Open **http://localhost:8000/admin/**
3. Login with superuser credentials
4. Manage **Dota 2 Items**, **Orders**, **Carts**, **Users**

## Routes

### Django Templates

| URL | Description |
|-----|-------------|
| `/shop/` | Landing page |
| `/shop/login/` | Log in |
| `/shop/register/` | Create account |
| `/shop/items/` | Item list |
| `/shop/item/:id/` | Item detail |
| `/shop/cart/` | Cart |
| `/shop/orders/` | Order history |

### Vite SPA

| URL | Description |
|-----|-------------|
| `/` | Store (items grid) |
| `/item/:id` | Item detail |
| `/cart` | Cart |
| `/orders` | Order history |
| `/login` | Log in |
| `/register` | Create account |

### API (JWT)

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/token/` | No |
| POST | `/api/auth/token/refresh/` | No |
| POST | `/api/auth/register/` | No |
| GET | `/api/items/` | No |
| GET | `/api/items/:id/` | No |
| GET | `/api/cart/` | JWT |
| POST | `/api/cart/add/` | JWT |
| PATCH | `/api/cart/:id/` | JWT |
| DELETE | `/api/cart/:id/` | JWT |
| GET | `/api/orders/` | JWT |
| POST | `/api/orders/` | JWT |

## CORS

Backend allows `http://localhost:5173` and `http://127.0.0.1:5173` for the Vite dev server.
