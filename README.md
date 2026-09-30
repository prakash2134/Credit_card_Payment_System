# Credit Card Payment System

A full-stack payment simulation system built for the Full Stack Junior Application Task.

**Stack:** React + Tailwind CSS (frontend) · Django REST Framework (auth, cards, transactions, admin) · FastAPI (payment processing) · MySQL

## Architecture

```
frontend (React/Vite, :3000)
   |
   |--> Django API (:8000)   -- auth, cards, transaction history, admin panel
   |--> FastAPI (:8001)      -- payment processing only
                 |
              MySQL (:3306)  -- shared database, schema owned by Django migrations
```

Both services share one MySQL database. Django owns the schema (via migrations); FastAPI reads/writes to the `cards_card` and `transactions_transaction` tables through SQLAlchemy models mapped to those same table names. Both services validate the same JWT (same `SECRET_KEY` + `HS256`), so a token issued by Django's `/api/auth/login/` also authenticates FastAPI's `/api/payments/`.

## Setup (Docker — recommended)

```bash
cp backend_django/.env.example backend_django/.env
cp frontend/.env.example frontend/.env

docker-compose up --build
```

- Frontend: http://localhost:3000
- Django API: http://localhost:8000/api
- FastAPI docs (Swagger): http://localhost:8001/docs
- Create an admin user: `docker-compose exec django python manage.py createsuperuser`

## Setup (manual / local dev)

**Django**
```bash
cd backend_django
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit MYSQL_HOST=localhost if running MySQL locally
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

**FastAPI**
```bash
cd backend_fastapi
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export MYSQL_HOST=localhost DJANGO_SECRET_KEY=<same value as backend_django/.env>
uvicorn main:app --reload --port 8001
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Running Tests

```bash
# Django (auth, cards, transactions, admin panel)
cd backend_django && python manage.py test

# FastAPI (payment simulation logic)
cd backend_fastapi && pytest
```

## API Documentation

- **FastAPI:** Swagger UI auto-generated at `/docs`, ReDoc at `/redoc`.
- **Django:** endpoints are listed below; a Postman collection (`postman_collection.json`) covering every endpoint is included at the repo root — import it into Postman and set the `access_token` collection variable after logging in.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | none | Create a user |
| POST | `/api/auth/login/` | none | Get access + refresh JWT |
| POST | `/api/auth/logout/` | user | Blacklist refresh token |
| GET | `/api/auth/me/` | user | Current user (protected route) |
| GET/POST | `/api/cards/` | user | List / add cards |
| DELETE | `/api/cards/<id>/` | user | Delete a card |
| POST | `/api/payments/` (FastAPI, :8001) | user | Make a payment |
| GET | `/api/transactions/` | user | History, filterable by `status`, `date_from`, `date_to`, `min_amount`, `max_amount` |
| GET | `/api/transactions/export/` | admin | CSV export |
| GET | `/api/admin-panel/users/` | admin | Manage users |
| GET | `/api/admin-panel/cards/` | admin | View all cards |
| GET | `/api/admin-panel/transactions/` | admin | View all transactions |
| GET | `/api/admin-panel/summary/` | admin | Daily payment summary |

## Database Schema

**users** *(Django's built-in `auth_user`)* — id, username, email, password (hashed), is_staff, date_joined

**cards_card**
| column | type | notes |
|---|---|---|
| id | PK | |
| user_id | FK -> auth_user | |
| card_holder_name | varchar | |
| brand | varchar | VISA / MASTERCARD / AMEX / OTHER |
| last4 | varchar(4) | |
| masked_number | varchar | e.g. `**** **** **** 1234` |
| expiry_month / expiry_year | int | |
| created_at | datetime | |

*Full card numbers and CVVs are never received into a stored field or written to disk — only `last4` and a masked display string persist.*

**transactions_transaction**
| column | type | notes |
|---|---|---|
| id | PK | |
| reference_id | UUID | unique |
| user_id | FK -> auth_user | |
| card_id | FK -> cards_card | nullable |
| amount | decimal(12,2) | |
| currency | varchar(3) | |
| status | varchar | PENDING / SUCCESS / FAILED |
| failure_reason | varchar | |
| created_at / updated_at | datetime | |

**Admin Logs**: covered by Django's built-in `django_admin_log` table, populated automatically for any action taken through `/admin/`.

## Security Notes (Module 8)

- No CVV is ever accepted or stored by any endpoint.
- Passwords are hashed with Django's PBKDF2 hasher (`set_password`) — never stored in plaintext.
- Auth uses JWT (`djangorestframework-simplejwt`) with access/refresh tokens and blacklist-on-logout.
- All input is validated through DRF/Pydantic serializers before touching the database.
- SQL injection protection: Django ORM and SQLAlchemy's parameterized queries are used exclusively — no raw string-interpolated SQL anywhere in the codebase.

## Admin Credentials (for submission)

After running `createsuperuser`, note the chosen username here for the reviewer, e.g.:
```
username: Prakash22
password: STK26-3892
```

## Screenshots

<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 50 35 AM" src="https://github.com/user-attachments/assets/2a99f452-ab68-42af-b219-4988c7eb289c" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 50 05 AM" src="https://github.com/user-attachments/assets/b7cfab35-9b54-4f78-902a-b69b00047363" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 49 47 AM" src="https://github.com/user-attachments/assets/5675f9e3-fb48-4e13-b7c2-a36f95eb8c43" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 48 54 AM" src="https://github.com/user-attachments/assets/0c18c3a5-cd35-45c6-9b74-b9329aa4a5e9" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 44 58 AM" src="https://github.com/user-attachments/assets/ef5f9549-2f8a-4cc1-8b19-253955c712b2" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 42 33 AM" src="https://github.com/user-attachments/assets/5e9a9bd5-2b60-490a-8fef-e6d129db2cf9" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 42 24 AM" src="https://github.com/user-attachments/assets/db567f32-d6bb-47eb-8cf0-9bbc56fe7fd8" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 39 13 AM" src="https://github.com/user-attachments/assets/11dd4d99-6def-4582-89d1-4a0a0cfa248b" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 38 46 AM" src="https://github.com/user-attachments/assets/8d1444ae-fb92-49b5-be2c-dca78e723961" />
<img width="1470" height="956" alt="Screenshot 2026-09-30 at 9 37 57 AM" src="https://github.com/user-attachments/assets/aeba8101-505e-408f-9e5a-ae79cfba32cd" />

