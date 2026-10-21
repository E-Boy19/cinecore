# CineCore — Movie Management System

CineCore is a full-stack movie database and management dashboard. It brings movie records, cast and crew information, collection statistics, and movie-change audit history into one interface.

## Features

- **Dashboard:** Overview of the movie collection and quick navigation to key sections.
- **Movie catalogue:** View, create, edit, delete, and inspect movie records.
- **Movie details:** View related director, producer, and cast information.
- **People and credits:** Browse actors, directors, and producers, along with their related movies.
- **Collection insights:** Visual summaries by film industry, genre, rating, release decade, and top-rated movies.
- **Audit history:** Review recorded movie insert, update, and delete events.
- **Relational database:** MySQL tables connect movies, actors, directors, and producers. The SQL dump also defines views and triggers, including IMDb-rating validation and movie audit logging.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Motion, Lucide React |
| Backend API | Python, Flask, Flask-CORS |
| Database | MySQL, `mysql-connector-python` |
| Configuration | Environment variables loaded with `python-dotenv` |

## Project Structure

```text
cinecore/
├── cinecore_backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
├── cinecore_inspect/
│   ├── src/
│   ├── moviedb.sql
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
└── README.md
```

## Prerequisites

Before running CineCore locally, install:

- **Node.js and npm**
- **Python 3.10 or newer**
- **MySQL 8.0 or newer**

## Getting Started

Follow the steps below to configure and run the database, backend, and frontend.

### 1. Set Up the MySQL Database

Start your local MySQL server, then run the following commands from the project root.

Create the database if it does not already exist:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS MovieDB CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
```

Import the provided schema and sample data:

```bash
mysql -u root -p MovieDB < cinecore_inspect/moviedb.sql
```

> **Warning:** The SQL dump contains `DROP TABLE IF EXISTS` statements for project tables. Import it only into a development database where replacing those tables and their data is acceptable. Back up any data you need first.

The dump includes the core tables:

- `MOVIES`
- `ACTORS`
- `DIRECTOR`
- `PRODUCER`
- `MOVIE_ACTORS`
- `MOVIE_AUDIT`

It also includes database views, triggers, and sample data.

### 2. Configure and Start the Flask Backend

Open a terminal at the project root and run:

```bash
cd cinecore_backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

Edit `cinecore_backend/.env` and configure your local MySQL credentials:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=MovieDB
```

Replace `your_mysql_password` with your actual MySQL password.

Start the backend:

```bash
python app.py
```

The backend runs at:

`http://127.0.0.1:5000`

Check the API health endpoint:

`http://127.0.0.1:5000/api/health`

A healthy response should include `"status": "ok"` and the connected database name.

### 3. Configure and Start the Frontend

Open a **second terminal** at the project root:

```bash
cd cinecore_inspect
npm install
```

The frontend defaults to the local API URL:

`http://127.0.0.1:5000/api`

If your backend runs elsewhere, create a `.env.local` file inside `cinecore_inspect/` and add:

```dotenv
VITE_API_URL=http://127.0.0.1:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Open the application in your browser:

**http://localhost:3000**

Keep both the Flask backend and Vite frontend running while using the application.

## Useful Commands

Run these commands from `cinecore_inspect/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the frontend development server on port `3000` |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript checking with `tsc --noEmit` |

To run the backend, navigate to `cinecore_backend/`, activate its virtual environment, and execute:

```bash
python app.py
```

## API Overview

The Flask API uses the `/api` prefix.

| Resource | Main Endpoints |
|---|---|
| Health | `GET /api/health` |
| Movies | `GET /api/movies`, `GET /api/movies/<id>`, `POST /api/movies`, `PUT /api/movies/<id>`, `DELETE /api/movies/<id>` |
| Actors | `GET /api/actors`, `GET /api/actors/<id>`, `POST /api/actors`, plus movie relationship endpoints |
| Directors | `GET /api/directors`, `GET /api/directors/<id>`, `POST /api/directors`, plus related movies |
| Producers | `GET /api/producers`, `GET /api/producers/<id>`, `POST /api/producers`, plus related movies |
| Movie credits | `GET /api/movie-actors`, `GET /api/movies/<id>/actors` |
| Audit logs | `GET /api/audit-logs` |

## Database Notes

- `MOVIE_ACTORS` links movies and actors through a many-to-many relationship.
- Foreign keys connect movies to their producers and directors.
- Database triggers validate IMDb ratings and record movie insert, update, and delete activity in `MOVIE_AUDIT`.
- The supplied SQL dump contains views for highly rated movies, movie/actor relationships, and movie details.

## Troubleshooting

**The frontend cannot load data**

- Confirm the Flask backend is running.
- Verify that `VITE_API_URL` points to the correct API base URL.
- Restart the Vite development server after changing frontend environment variables.

**Database connection errors**

- Confirm MySQL is running.
- Check that the `MovieDB` database has been imported.
- Verify the credentials in `cinecore_backend/.env`.

**SQL import errors**

- Confirm that you are using a compatible MySQL 8 installation.
- Ensure your MySQL account has permission to create tables, views, and triggers.
- Some installations may reject the dump's GTID metadata. If this occurs, remove the `SET @@GLOBAL.GTID_PURGED=...` statement from a working copy of the dump before importing it.

## Security Notes

- Never commit real `.env` files, passwords, API keys, or other credentials. Commit example configuration files containing placeholders instead.
- The backend currently enables permissive CORS for `/api/*`, which is convenient for local development. Restrict allowed origins before deploying the application publicly.
- Use a dedicated MySQL application user with only the required privileges instead of a database administrator account for a deployed instance.

---

Built as a full-stack project for exploring movie catalogue management, relational data, analytics, and audit logging.
