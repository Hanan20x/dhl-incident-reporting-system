# DHL Incident Reporting System
### DHL DAC 3.0 Challenge — AI-Enhanced Incident Reporting & Resolution System

**Course:** SECJ3483 Web Technology  
**Scenario:** Scenario 2 — AI-Enhanced Incident Reporting & Resolution System  
**Student:** Hanan Osama Hussein Salah | A22EC4042  
**Section:** Section 3  
**Academic Session:** 2025/2026 — Semester 2  

---

## Project Overview

This system automates the full process of collecting, understanding, assigning, and tracking DHL incident reports. It consists of:

- **Laravel REST API** backend with PostgreSQL database
- **React frontend** with DHL branding
- **UiPath RPA workflow** for automated incident ingestion and email reporting

---

## Project Structure

```
dhl-incident-reporting-system/
├── backend/        → Laravel 13 REST API
├── frontend/       → React + Vite frontend
├── rpa/            → UiPath RPA workflow files
└── report/         → Assignment report
```

---

## Prerequisites

- PHP 8.4+ with extensions: `pdo_pgsql`, `pgsql`, `mbstring`, `fileinfo`, `openssl`
- Composer
- PostgreSQL 16+
- Node.js 18+ and npm
- UiPath Studio 2026 (Community Edition)

---

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/Hanan20x/dhl-incident-reporting-system.git
cd dhl-incident-reporting-system
```

---

### 2. Backend Setup (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Update `.env` with your PostgreSQL credentials:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dhl_incident_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Create the database in PostgreSQL:
```sql
CREATE DATABASE dhl_incident_db;
```

Run migrations:
```bash
php artisan migrate
```

Start the server:
```bash
php artisan serve
```

API will be available at: `http://localhost:8000`

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:8080`

---

### 4. Create Admin User

```bash
curl -s -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Admin","email":"admin@dhl.com","password":"password123","role":"admin"}'
```

---

### 5. Running the RPA Workflow

1. Create the incidents folder:
```
C:\DHL_Incidents\
```

2. Place `.txt` incident files inside the folder

3. Open `rpa/DHL_Incident_RPA` project in UiPath Studio

4. Make sure the Laravel server is running on `http://localhost:8000`

5. Click **Run** in UiPath Studio

The workflow will:
- Login and get auth token
- Read files from `C:\DHL_Incidents`
- Skip files processed in the last 14 days
- Create incidents via the API
- Send a summary email with totals

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/register | Register user | No |
| POST | /api/login | Login & get token | No |
| GET | /api/incidents | List all incidents | Yes |
| POST | /api/incidents | Create incident | Yes |
| GET | /api/incidents/{id} | Get incident details | Yes |
| PUT | /api/incidents/{id} | Update incident | Yes |
| PATCH | /api/incidents/{id}/status | Update status | Yes |
| DELETE | /api/incidents/{id} | Delete incident | Yes |
| GET | /api/departments | List departments | Yes |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Laravel 13 (PHP 8.4) |
| Database | PostgreSQL 16 |
| Auth | Laravel Sanctum |
| RPA | UiPath Studio 2026 |
| Version Control | GitHub |

---

## GitHub Repository

[https://github.com/Hanan20x/dhl-incident-reporting-system](https://github.com/Hanan20x/dhl-incident-reporting-system)
