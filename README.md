# DHL Incident Reporting System
### DHL DAC 3.0 Challenge — AI-Enhanced Incident Reporting & Resolution System

![DHL](https://img.shields.io/badge/DHL-DAC%203.0-D40511?style=for-the-badge)
![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![UiPath](https://img.shields.io/badge/UiPath-RPA-FA4616?style=for-the-badge)

---

**Course:** SECJ3483 Web Technology  
**Scenario:** Scenario 2 — AI-Enhanced Incident Reporting & Resolution System  
**Student:** Hanan Osama Hussein Salah | A22EC4042  
**Section:** Section 3  
**Academic Session:** 2025/2026 — Semester 2  
**University:** Universiti Teknologi Malaysia (UTM)

---

## 📋 Project Overview

This system automates the full process of collecting, understanding, assigning, and tracking DHL incident reports. It replaces slow, manual, inconsistent processes with an intelligent automated pipeline.

### Key Features
- 🔐 **Secure Authentication** — Laravel Sanctum token-based auth
- 📊 **Incident Dashboard** — searchable, filterable incident list
- 🤖 **AI Draft Builder** — paste raw text, get structured incident via Claude AI
- 🔍 **AI Conflict Check** — detect inconsistencies in incident reports
- 📁 **RPA Automation** — UiPath workflow for automated file ingestion
- 📧 **Summary Email** — automated email report after each RPA run
- 🏢 **Department Management** — assign incidents to DHL departments
- 📜 **Status Versioning** — Draft → Reviewed → Resolved with full history

---

## 🏗️ Project Structure

```
dhl-incident-reporting-system/
├── backend/        → Laravel 13 REST API (PHP 8.4)
├── frontend/       → React + Vite frontend
├── rpa/            → UiPath RPA workflow (Main.xaml)
└── report/         → Assignment report
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Laravel 13 (PHP 8.4) |
| Database | PostgreSQL 16 |
| Authentication | Laravel Sanctum |
| AI | Claude API (Anthropic) |
| RPA | UiPath Studio 2026 |
| Version Control | GitHub |

---

## 📦 Prerequisites

- PHP 8.4+ with extensions: `pdo_pgsql`, `pgsql`, `mbstring`, `fileinfo`, `openssl`
- Composer
- PostgreSQL 16+
- Node.js 18+ and npm
- UiPath Studio 2026 (Community Edition)
- Git

---

## 🚀 How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/Hanan20x/dhl-incident-reporting-system.git
cd dhl-incident-reporting-system
```

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

Run migrations and start the server:
```bash
php artisan migrate
php artisan serve
```

API runs at: `http://localhost:8000`

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:8080`

### 4. Create Admin User

```bash
curl -s -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Admin","email":"admin@dhl.com","password":"password123","role":"admin"}'
```

**Login credentials:**
- Email: `admin@dhl.com`
- Password: `password123`

### 5. Running the RPA Workflow

1. Create the incidents folder: `C:\DHL_Incidents\`
2. Place `.txt` incident files inside the folder
3. Open `rpa/DHL_Incident_RPA` project in UiPath Studio
4. Ensure Laravel server is running on `http://localhost:8000`
5. Click **Run** in UiPath Studio

The RPA workflow will automatically:
- Login and retrieve auth token
- Read all files from `C:\DHL_Incidents`
- Skip files processed in the last 14 days (duplicate check)
- Create incidents via the REST API
- Retry failed requests up to 3 times
- Log all results to `automation_log.txt`
- Send summary email with totals: created, skipped, failed

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/register` | Register user | No |
| POST | `/api/login` | Login & get token | No |
| GET | `/api/me` | Get current user | Yes |
| POST | `/api/logout` | Logout | Yes |
| GET | `/api/incidents` | List all incidents | Yes |
| POST | `/api/incidents` | Create incident | Yes |
| GET | `/api/incidents/{id}` | Get incident details | Yes |
| PUT | `/api/incidents/{id}` | Update incident | Yes |
| PATCH | `/api/incidents/{id}/status` | Update status | Yes |
| DELETE | `/api/incidents/{id}` | Delete incident | Yes |
| GET | `/api/departments` | List departments | Yes |
| POST | `/api/departments` | Create department | Yes |

---

## 🗄️ Database Schema

| Table | Key Fields |
|-------|-----------|
| `users` | id, name, email, password, role |
| `departments` | id, name, email |
| `incidents` | id, title, description, type, source, status, priority, department_id, created_by |
| `incident_logs` | id, incident_id, action, old_status, new_status, changed_by |
| `personal_access_tokens` | Sanctum auth tokens |

---

## 🤖 AI Features

### AI Draft Builder
- Paste raw unstructured text (email, WhatsApp, phone notes)
- Claude AI generates: Title, Summary, Type, Source, Priority, Tags, Suggested Steps
- All fields editable before creating the incident

### AI Conflict Check
- Detects conflicting or missing information in incident reports
- Provides recommendations for improvement

---

## 🔗 GitHub Repository

[https://github.com/Hanan20x/dhl-incident-reporting-system](https://github.com/Hanan20x/dhl-incident-reporting-system)

---

## 📄 License

This project is submitted as part of SECJ3483 Web Technology coursework at UTM.
